json.extract! attach, :id, :file_name, :created_at, :parent_type
json.file_size number_to_human_size(attach.file_size)
json.parent do
  json.title attach.parent.title
  if attach.parent.is_a? Blog
    json.url blog_path(attach.parent.slug)
  else
    json.url page_path(attach.parent.slug)
  end
end if attach.parent
json.is_image attach.image?
json.file attach.file.serializable_hash
json.url attach.image? ? attach.file.thumb.url : attach.file.url