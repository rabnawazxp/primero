# frozen_string_literal: true

# This specifies the locales the Primero currently supports
class Primero::Application
  LOCALE_ENGLISH = :en
  LOCALE_ARABIC = :ar
  LOCALES = %i[en fr ar ar-LB so es bn id my th ku ar-SD].freeze
  RTL_LOCALES = %i[ar ar-LB ku ar-SD].freeze
end

def locale_settings
  return @locale_settings if @locale_settings

  settings_file = Rails.root.join('config', 'locales.yml')
  return {} unless File.exist?(settings_file)

  @locale_settings = YAML.load_file(settings_file)[Rails.env]
end

I18n.default_locale = locale_settings['default_locale'] || Primero::Application::LOCALE_ENGLISH
I18n.available_locales = locale_settings['locales'].present? ? locale_settings['locales'] : Primero::Application::LOCALES
