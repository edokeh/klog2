class Password
  include ActiveModel::Model

  attr_accessor :old_pw, :new_pw, :new_pw_confirmation

  validate :valid_old
  validates :new_pw, :length => {:minimum => 6}, :confirmation => true
  validates :new_pw_confirmation, :presence => true

  # 保存
  def save
    if valid?
      Password.reset(new_pw)
      return true
    else
      return false
    end
  end

  # 校验旧密码
  def valid_old
    errors.add(:old_pw, "旧密码错误！") unless Password.valid? old_pw
  end

  # 判断密码是否正确
  def self.valid?(pass)
    Digest::SHA1.hexdigest(Setting.admin_pass_salt + pass) == Setting.admin_pass
  end

  # salt
  def self.reset(pass)
    Setting.admin_pass_salt = SecureRandom.hex(10)
    Setting.admin_pass = Digest::SHA1.hexdigest(Setting.admin_pass_salt + pass)
  end
end