json.extract! @page, :id, :title, :created_at, :slug
json.attaches @page.attaches.each do |attach|
  json.partial! 'admin/attaches/show', :attach => attach
end
json.extract! @page, :html_content, :content if params[:detail]
json.errors @page.errors if @page.errors