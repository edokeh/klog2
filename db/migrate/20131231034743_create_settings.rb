class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.string :key
      t.string :value, :limit=>2000

      t.timestamps
    end

    add_index :settings, :key, :unique => true
  end
end
