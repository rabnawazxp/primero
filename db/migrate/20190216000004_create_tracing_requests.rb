class CreateTracingRequests < ActiveRecord::Migration[5.0]
  enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

  def change
    create_table :tracing_requests, id: :uuid, default: 'gen_random_uuid()' do |t|
      t.jsonb 'data', default: {}
    end
    add_index :tracing_requests, :data, using: :gin
    add_foreign_key :cases, :tracing_requests, column: 'matched_tracing_request_id'
  end
end