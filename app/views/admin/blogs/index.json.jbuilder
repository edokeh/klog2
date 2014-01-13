json.page do
  json.current @blogs.current_page
  json.total @blogs.total_pages
  json.hasNext !@blogs.last_page?
  json.totalCount @blogs.total_count
end
json.array do
  json.array! @blogs do |blog|
    json.extract! blog, :id, :title, :comment_count, :created_at, :slug
    json.publish blog.publish?
    json.category blog.category, :name if blog.category.present?
  end
end