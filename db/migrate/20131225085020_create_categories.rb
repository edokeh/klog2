class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name, :null => false, :limit => 20
      t.integer :blog_count, :default => 0

      t.timestamps
    end
  end
end
