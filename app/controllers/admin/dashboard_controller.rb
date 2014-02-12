# 统计
class Admin::DashboardController < Admin::ApplicationController
  rescue_from Faraday::ClientError, OAuth2::Error, :with => :ga_request_error

  def show
    @blog_publish_count = Blog.with_status(:publish).count
    @blog_draft_count = Blog.with_status(:draft).count
    @comment_count = Blog.sum(:comment_count)
    @total_visits = GaClient.get_total_visits if Setting.ga.chart_enable

    render :json => {
        :blog => {:publish => @blog_publish_count, :draft => @blog_draft_count},
        :comment => @comment_count,
        :disqus_enable => Setting.disqus.enable,
        :ga_enable => Setting.ga.chart_enable,
        :total_visits => @total_visits
    }
  end

  # 评论的统计
  def comment
    @comment_count = Blog.sum(:comment_count)
    @disqus_enable = Setting.disqus.enable

    render :json => {
        :total => @comment_count,
        :disqus_enable => Setting.disqus.enable
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

  # 页面访问排行
  def top_pages
    results = GaClient.get_top_pages
    results = results.map(&:marshal_dump)
    render :json => results
  end

  def browser
    results = GaClient.get_browser_with_version
    results = results.map(&:marshal_dump)
    render :json => results
  end

  def hot_blogs
    @hot_blogs = Blog.select(:id, :title, :status, :slug, :comment_count).order('comment_count DESC').limit(5)

    render :json => @hot_blogs
  end

  # 附件统计
  def attach
    @attach_count = Attach.count
    @attach_size = Attach.sum('file_size')

    render :json => {
        :count => @attach_count,
        :size => view_context.number_to_human_size(@attach_size),
    }
  end

  # 评论数同步日志
  def sync_comment_logs
    @logs = Setting.sync_comment_logs || []
    @logs.map!(&:marshal_dump)

    render :json => @logs
  end

  # 同步评论数
  def sync_comment
    # 防御 get
    render :text => '', :status => 404 and return if request.get?
    Comment.sync_count
    head :no_content
  end

  private
  # GA api 请求中发生错误的处理，错误原因如 timeout 等
  def ga_request_error(e)
    render :json => {:error => e.message}, :status => e.try(:response).try(:status) || 408 # timeout code default
    GaClient.clear_service_account_user

    # log error
    message = "\n#{e.class} (#{e.message}):\n"
    message << "  " << Rails.backtrace_cleaner.clean(e.backtrace).join("\n  ")
    logger.fatal("#{message}\n\n")
  end
end