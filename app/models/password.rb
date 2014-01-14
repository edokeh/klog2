class Password
  include ActiveModel::Model

  attr_accessor :old_pw, :new_pw, :new_pw_confirmation

  validate :valid_old
  validates :new_pw, :length => {:minimum => 6}, :confirmation => true
  validates :new_pw_confirmation, :presence => true

  # 保存
  def save
    if valid?
      Setting.admin_pass = new_pw
      return true
    else
      return false
    end
  end

  # 校验旧密码
  def valid_old
    errors.add(:old_pw, "旧密码错误！") if Setting.admin_pass != old_pw
  end
end