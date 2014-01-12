class Admin::ApplicationController < ApplicationController
  layout false

  protected

  #检查是否为admin
  def check_admin
    redirect_to new_admin_session_path unless is_admin?
  end
end
