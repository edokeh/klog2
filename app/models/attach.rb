class Attach < ActiveRecord::Base
  attr_accessor :max_width, :max_height

  before_create :fill_attributes
  after_destroy :delete_file

  belongs_to :parent, :polymorphic => true

  mount_uploader :file, AttachUploader

  def self.new_by_params(params)
    attach = Attach.new
    attach.max_width = params[:max_width]
    attach.file = params[:file]
    attach.file_name = params[:file].original_filename
    attach
  end

  def self.update_parent(ids, parent)
    return if ids.blank?
    attaches = self.where(:id => ids)
    attaches.update_all(:parent_id => parent.id, :parent_type => parent.class.to_s)
  end

  # 填充content_type,file_size字段
  def fill_attributes
    self.content_type = file.file.content_type
    self.file_size = file.file.size
  end

  # 删除对应的文件
  def delete_file
    self.remove_file!
  end

  def image?
    self.content_type.include?('image')
  end
end
