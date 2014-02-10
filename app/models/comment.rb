class Comment
  include ActiveModel::Model

  attr_accessor :id, :content, :author_name, :author_email, :author_avatar, :ip, :created_at, :blog, :blog_id, :parent

  def self.all(cursor="", options={})
    hash, cursor = DisqusClient.all_post(cursor, options)
    arr = CommentArray.new(hash)
    arr.cursor = cursor
    arr
  end

  # 获取评论的上下文
  def self.showContext(id)
    hash = DisqusClient.get_context(id)
    # 此时获取的数据中不含 thread 详情，所以 with_blog: false
    CommentArray.new(hash, :with_blog => false)
  end

  # 删除
  def self.remove(id)
    DisqusClient.remove_post(id)
  end

  # 从 disqus api 同步 BLOG 评论数
  def self.sync_count
    return unless Disqus.find.enable?
    latest_log = {:at => Time.now}

    begin
      DisqusClient.all_thread.each do |th|
        blog = Blog.where(:id => th["identifiers"][0]).first
        blog.update_columns(:comment_count => th["posts"]) if blog
      end
      latest_log[:status] = "success"
    rescue Exception => e
      latest_log[:error] = e.message
      latest_log[:status] = "failed"
    ensure
      sync_logs = Setting.sync_comment_logs || []
      sync_logs = sync_logs.push(latest_log).last(5)
      Setting.sync_comment_logs = sync_logs
    end
  end

  # 保存(仅用于创建)
  def save
    hash = DisqusClient.create_post(self)
    fill_by_api(hash, :with_blog => false)

    # 关联的 BLOG
    threadHash = DisqusClient.get_thread(hash["thread"])
    blog_id = threadHash["identifiers"][0]
    self.blog = Blog.where(:id => blog_id).first if blog_id
  end

  # 根据 API 获取的数据填充自身字段
  def fill_by_api(hash, with_blog: true)
    self.id = hash["id"]
    self.content = hash["raw_message"]
    self.author_name = hash["author"]["name"]
    self.author_email = hash["author"]["email"]
    self.author_avatar = hash["author"]["avatar"]["large"]["permalink"]
    self.ip = hash["ipAddress"]
    self.created_at = hash["createdAt"].to_datetime.in_time_zone
    self.blog_id = hash["thread"]["identifiers"][0] if with_blog
  end

  ###################
  # Comment 数组类
  ###################
  class CommentArray < Array
    attr_accessor :cursor

    def initialize(api_response, with_blog: true)
      @comments = api_response.map! do |cm|
        c = Comment.new
        c.fill_by_api(cm, :with_blog => with_blog)
        c
      end

      # 填充 blog 关联字段
      if with_blog
        blog_ids = @comments.map(&:blog_id)
        Blog.where(:id => blog_ids).each do |blog|
          arr = @comments.select { |c| c.blog_id == blog.id.to_s }
          arr.each { |c| c.blog = blog }
        end
      end
      super @comments
    end

    # 下一页
    def next
      Comment.all(cursor["next"])
    end

    def prev
      Comment.all(cursor["prev"])
    end

    def has_next?
      @cursor["hasNext"]
    end

    def has_prev?
      cursor["hasPrev"]
    end
  end
end