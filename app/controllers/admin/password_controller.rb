class Admin::PasswordController < Admin::ApplicationController

  def update
    @admin_pass = Password.new(password_params)

    if @admin_pass.save
      render :json => @admin_pass
    else
      render :json => @admin_pass, :status => 422
    end
  end

  private
  def password_params
    params.require(:password).permit(:old, :new, :new_confirmation)
  end
end