json.array! @pages do |page|
  json.extract! page, :id, :title, :created_at, :slug, :sid
end