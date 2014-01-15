json.extract! @category, :id, :name, :blog_count, :created_at
json.errors @category.errors if @category.errors