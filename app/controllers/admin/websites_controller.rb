class Admin::WebsitesController < Admin::ApplicationController
  helper

  def show
    @website = Website.find
    @website.avatar = view_context.image_path('no_avatar.png') if @website.avatar.nil?
    render :json => @website
  end

  def update
    @website = Website.find
    if @website.update_attributes(website_params)
      # 更新附件的归属
      Attach.update_parent(website_params[:avatar_id], @website)
      render :json => @website
    else
      render :json => @website, :status => 422
    end
  end

  private

  def website_params
    params.require(:website).permit(:title, :sub_title, :author, :avatar, :avatar_id, :github, :weibo, :donate, :ga)
  end
end