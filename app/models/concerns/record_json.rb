module RecordJson
  extend ActiveSupport::Concern

  require "uuidtools"

  STATUS_OPEN = 'open' ; STATUS_CLOSED = 'closed'

  included do
    store_accessor :data, :unique_identifier, :short_id, :record_state
    before_create :create_identification
    after_save :index_nested_reportables, unless: Proc.new{ Rails.env == 'production' }
    after_destroy :unindex_nested_reportables, unless: Proc.new{ Rails.env == 'production' }
  end

  module ClassMethods

    #TODO: This method needs to be merged with existing initialization logic
    def new_with_user(user, data = {})
      record = self.new
      record.data = data
      record.create_class_specific_fields(data) #TODO: Is there a better way to default? This method is doing 2 things!
      record.set_creation_fields_for(user)
      record.owned_by = user.user_name if record.owned_by.blank? #TODO: refactor with Ownable
      record.owned_by_full_name = user.full_name || nil #if record.owned_by_full_name.blank? #TODO: refactor with Ownable
      record
    end

    #TODO: This method is currently unused, but should eventually replace the mess in the record actions controller
    def find_or_initialize(unique_identifier)
      record = find_by_unique_identifier(unique_identifier)
      if record.nil?
        record = self.new
      end
      return record
    end

    def find_by_unique_identifier(unique_identifier)
      self.where('data @> ?', {unique_identifier: unique_identifier}.to_json)
    end

    def generate_unique_id
      return UUIDTools::UUID.random_create.to_s
    end

    def parent_form
      self.name.underscore.downcase
    end

    #TODO: Refactor when making names
    def model_from_name(name)
      name == 'case' ? Child : Object.const_get(name.camelize)
    end

    #TODO: Refactor with UIUX
    def model_name_for_messages
      self.name.titleize.downcase
    end

    #TODO: Refactor with UIUX
    def locale_prefix
      self.name.underscore.downcase
    end

  end

  #TODO: Initialize in one place
  def initialize(*args)
    super
    self.record_state = true if self['record_state'].nil?
  end


  def create_identification
    self.unique_identifier ||= self.class.generate_unique_id
    self.short_id ||= self.unique_identifier.last 7
    self.set_instance_id
  end


  def display_field(field_or_name, lookups = nil)
    result = ""
    if field_or_name.present?
      if field_or_name.is_a?(Field)
        result = field_or_name.display_text(self.data[field_or_name.name], lookups)
      else
        field = Field.get_by_name(field_or_name)
        if field.present?
          result = field.display_text(self.data[field_or_name], lookups)
        end
      end
    end
    return result
  end

  def display_id
    short_id
  end

  #TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  # # @param attr_keys: An array whose elements are properties and array indeces
  #   # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  #   # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(self.data) do |acc, attr|
      if acc.blank?
        nil
      else
        acc[attr]
      end
    end
  end

  #TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  def set_value_for_attr_keys(attr_keys, value)
    parent = value_for_attr_keys(attr_keys[0..-2])
    parent[attr_keys[-1]] = value
  end

  #TODO: Refactor further. This method does too much, and should probably just go away
  def update_properties(properties, user_name)
    properties = self.class.blank_to_nil(self.class.convert_arrays(properties))
    #TODO: Shouldn't this be either initialized or defaulted somehow? Is'nt this happening already?
    properties['record_state'] = true if properties['record_state'].nil?

    #TODO: Is this old RapidFTR logic?
    # attributes_to_update = {}
    # properties.each_pair do |name, value|
    #   attributes_to_update[name] = value
    #   attributes_to_update["#{name}_at"] = DateTime.now if ([:flag, :reunited].include?(name.to_sym) && value.to_s == 'true')
    # end
    #self.attributes = attributes_to_update
    self.data = properties
    self.last_updated_by = user_name
  end

  def nested_reportables_hash
    #TODO: Consider returning this as a straight list
    self.class.nested_reportable_types.reduce({}) do |hash, type|
      if self.try(type.record_field_name).present?
        hash[type] = type.from_record(self)
      end
      hash
    end
  end

  def index_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.index! reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    self.nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end
end