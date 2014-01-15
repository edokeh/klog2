class Admin::SessionsController < Admin::ApplicationController
  skip_action_callback :check_admin

  # 登录页面
  def new
    # 如果忘记密码，请删除 admin_pass 记录，这里会初始化为 password
    Password.reset("password") if Setting.admin_pass.nil?
    redirect_to '/admin' if is_admin?
  end

  def create
    if Password.valid? params[:password]
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
