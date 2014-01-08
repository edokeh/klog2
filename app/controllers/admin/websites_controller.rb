class Admin::WebsitesController < Admin::ApplicationController

  def show
    @website = Setting.website
  end

  def update
    @website = website_params
    Setting.website = @website
    render :show
  end

  private

  def website_params
    params.require(:website).permit(:title, :sub_title, :author, :avatar, :github)
  end
end