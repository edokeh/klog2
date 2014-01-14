class Admin::ApplicationController < ApplicationController
  layout false
  add_flash_types :error

  before_action :check_admin

  private
  # 检查是否为admin
  def check_admin
    redirect_to new_admin_session_path unless is_admin?
  end
end
