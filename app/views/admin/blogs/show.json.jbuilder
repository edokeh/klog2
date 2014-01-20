json.extract! @blog, :id, :title, :comment_count, :created_at, :slug, :tag_list, :category_id
json.status @blog.status.value
json.publish @blog.publish?
json.attaches @blog.attaches.each do |attach|
  json.partial! 'admin/attaches/show', :attach => attach
end
json.category @blog.category, :name if @blog.category.present?
json.extract! @blog, :content, :html_content if params[:detail]
json.errors @blog.errors if @blog.errors