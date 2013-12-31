class BannerCell < Cell::Rails
  helper FontAwesome::Rails::IconHelper

  cache :show, :expires_in => 1.minutes

  # 显示首页的头像、标题等
  def show
    @settings = Setting.all_vars :website_title, :website_sub_title, :avatar
    render
  end

end
