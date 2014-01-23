json.page do
  json.current @attaches.current_page
  json.total @attaches.total_pages
  json.hasNext !@attaches.last_page?
  json.totalCount @attaches.total_count
end
json.array do
  json.array! @attaches do |attach|
    json.partial! 'admin/attaches/show', :attach => attach
  end
end
