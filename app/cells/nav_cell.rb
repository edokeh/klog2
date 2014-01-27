class NavCell < Cell::Rails
  helper FontAwesome::Rails::IconHelper, ApplicationHelper

  # 显示导航栏
  def show(curr_nav)
    @curr_nav = curr_nav
    @pages = Page.order('sid ASC')
    render
  end

end
