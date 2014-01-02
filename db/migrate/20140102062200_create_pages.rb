class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title, :null=>false
      t.text :content, :null=>false
      t.text :html_content, :null=>false
      t.string :slug, :null=>false
      t.integer :sid

      t.timestamps
    end

    add_index :pages, :slug, :unique => true
  end
end
