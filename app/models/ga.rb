# google analytic 的设置
class Ga
  include ActiveModel::Model

  PUBLIC_FIELDS = [:account, :chart_enable, :secret_file_id, :api_email]

  attr_accessor *PUBLIC_FIELDS
  attr_accessor :secret_file

  with_options :if => :chart_enable do |ga|
    ga.validates :secret_file_id, :presence => true
    ga.validates :api_email, :presence => true
    ga.validate :validate_legality
  end

  # 获取实例
  def self.find
    ga = Ga.new(Setting.ga.marshal_dump)
    ga.fill_secret_file
    ga
  end

  # 更新字段
  def update_attributes(attributes={})
    attributes.each do |name, value|
      send("#{name}=", value)
    end
    fill_secret_file
    if valid?
      Setting.ga = as_hash
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

  def fill_secret_file
    self.secret_file = Attach.find(secret_file_id) if secret_file_id.present?
  end

  # 校验合法性，发起请求来验证
  def validate_legality
    return if !chart_enable or secret_file.nil? or api_email.blank?
    begin
      GaClient.clear_service_account_user
      GaClient.service_account_user(self)
      GaClient.get_daily_visits
    rescue
      GaClient.clear_service_account_user
      errors.add(:api_email, 'GA API 身份校验失败！')
    end
  end
end