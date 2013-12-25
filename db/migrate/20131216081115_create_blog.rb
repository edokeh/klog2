class CreateBlog < ActiveRecord::Migration
  def change
    create_table :blogs do |t|
      t.string :title, :null => false
      t.text :content, :null => false
      t.text :html_content, :null => false
      t.text :html_content_summary, :null=>false
      t.string :slug, :null => false
      t.string :seo_kwd
      t.string :seo_desc
      t.integer :status
      t.integer :category_id
      t.integer :comment_count, :default => 0

      t.timestamps
    end

    add_index :blogs, :slug, :unique => true
  end
end