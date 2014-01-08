json.extract! @blog, :id, :title, :comment_count, :created_at, :slug, :content, :tag_list, :category_id, :status, :attaches
json.publish @blog.publish?
json.category @blog.category, :name if @blog.category.present?
json.extract! @blog, :html_content if params[:detail]
json.error @blog.errors