# 统计
class Admin::DashboardController < Admin::ApplicationController
  def show
    @blog_publish_count = Blog.with_status(:publish).count
    @blog_draft_count = Blog.with_status(:draft).count
    @comment_count = Blog.sum(:comment_count)
    @category_count = Category.count
    @attach_count = Attach.count
    @attach_size = Attach.sum('file_size')

    render :json => {
        :blog => {:publish => @blog_publish_count, :draft => @blog_draft_count},
        :comment => @comment_count,
        :category => @category_count,
        :attach => {:count => @attach_count, :size => view_context.number_to_human_size(@attach_size)},
    }
  end

  # 每日访问量
  def daily_visits
    visits = GaClient.get_daily_visits
    visits = visits.map do |visit|
      [DateTime.parse(visit.date).to_i * 1000, visit.visits.to_i]
    end
    render :json => visits
  end

  # 总访问量
  def total_visits
    render :json => GaClient.get_total_visits
  end

  # 页面访问排行
  def top_pages
    render :json => GaClient.get_top_pages
  end

  def browser
    results = GaClient.get_browser_with_version
    render :json => results
  end

  def hot_blogs
    @hot_blogs = Blog.select(:id, :title, :status, :slug, :comment_count).order('comment_count DESC').limit(5)

    render :json => @hot_blogs
  end
end