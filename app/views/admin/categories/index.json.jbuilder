json.array! @categories do |category|
  json.extract! category, :id, :name, :blog_count, :created_at
end