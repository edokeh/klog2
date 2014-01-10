class Admin::WebsitesController < Admin::ApplicationController

  def show
    @website = Setting.website
    render :json => @website.marshal_dump
  end

  def update
    @website = website_params
    Setting.website = @website
    render :json => @website
  end

  private

  def website_params
    params.require(:website).permit(:title, :sub_title, :author, :avatar, :github, :weibo, :donate, :ga)
  end
end