class Website
  include ActiveModel::Model

  PUBLIC_FIELDS = [:title, :sub_title, :author, :avatar, :avatar_id, :github, :weibo, :donate, :ga]

  attr_accessor *PUBLIC_FIELDS

  validates :title, :presence => true
  validates :author, :presence => true

  # 获取实例
  def self.find
    Website.new Setting.website.marshal_dump
  end

  # 保存
  def update_attributes(attributes={})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
    if valid?
      Setting.website = as_hash
      return true
    else
      return false
    end
  end

  def as_hash
    hash = {}
    PUBLIC_FIELDS.each { |f| hash[f] = send(f) }
    hash
  end

  def id
    nil
  end
end