class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  layout 'public'

  private

  # 是否是管理员
  def is_admin?
    return session[:admin] == true
  end
end
