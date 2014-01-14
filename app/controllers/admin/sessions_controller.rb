class Admin::SessionsController < Admin::ApplicationController
  skip_action_callback :check_admin

  # 登录页面
  def new
    redirect_to '/admin' if is_admin?
  end

  def create
    if Setting.admin_pass == params[:password]
      session[:admin] = true
      redirect_to '/admin'
    else
      redirect_to new_admin_session_path, :error => '密码错误！'
    end
  end

  def destroy
    session[:admin] = nil
    respond_to do |format|
      format.html { redirect_to :action => :new }
      format.json { head :no_content }
    end
  end
end
