class Disqus
  include ActiveModel::Model

  PUBLIC_FIELDS = [:enable, :shortname, :api_secret, :access_token]

  attr_accessor *PUBLIC_FIELDS

  with_options :if => :enable? do |disqus|
    disqus.validates :shortname, :presence => true
    disqus.validates :api_secret, :presence => true
    disqus.validates :access_token, :presence => true
    disqus.validate :validate_legality
  end

  # 获取实例
  def self.find
    Disqus.new Setting.disqus.marshal_dump
  end

  # 更新字段
  def update_attributes(attributes={})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
    if valid?
      Setting.disqus = as_hash
      return true
    else
      return false
    end
  end

  def update_enable(bool)
    self.enable = bool
    Setting.disqus = as_hash
  end

  def enable?
    enable
  end

  # 校验合法性，发起请求来验证
  def validate_legality
    return if !enable? or shortname.blank? or api_secret.blank? or access_token.blank?
    begin
      Comment.all("", :shortname => shortname, :api_secret => api_secret, :access_token => access_token)
    rescue
      errors.add(:shortname, 'Disqus 校验失败！')
    end
  end

  def as_hash
    hash = {}
    PUBLIC_FIELDS.each { |f| hash[f] = send(f) }
    hash
  end
end