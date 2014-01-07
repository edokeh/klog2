json.current_page @blogs.current_page
json.total_pages @blogs.total_pages
json.is_last @blogs.last_page?
json.array do
  json.array! @blogs do |blog|
    json.extract! blog, :id, :title, :comment_count, :created_at, :slug
    json.publish blog.publish?
    json.category blog.category, :name if blog.category.present?
  end
end