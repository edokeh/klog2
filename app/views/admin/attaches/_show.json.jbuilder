json.extract! attach, :id, :file_name
json.is_image attach.image?
json.file attach.file.serializable_hash
json.url attach.image? ? attach.file.thumb.url : attach.file.url