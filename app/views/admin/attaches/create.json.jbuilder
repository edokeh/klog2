json.extract! @attach, :id, :file_name
json.file @attach.file.serializable_hash
json.is_image @attach.image?
json.url @attach.image? ? @attach.file.thumb.url : @attach.file.url

