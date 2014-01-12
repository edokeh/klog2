json.array! @comments do |comment|
  json.content simple_format(comment.content)
  json.extract! comment, :id, :author_name, :author_email, :author_avatar, :ip, :created_at
end