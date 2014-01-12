class Comment
  include ActiveModel::Model

  DSQ_API = "https://disqus.com/api/3.0"
  DSQ_API_POSTS = "#{DSQ_API}/forums/listPosts.json"
  DSQ_API_THREADS = "#{DSQ_API}/forums/listThreads.json"
  DSQ_API_POST_CONTEXT = "#{DSQ_API}/posts/getContext.json"
  DSQ_API_REMOVE_POST = "#{DSQ_API}/posts/remove.json"
  DSQ_API_CREATE_POST = "#{DSQ_API}/posts/create.json"

  attr_accessor :id, :content, :author_name, :author_email, :author_avatar, :ip, :created_at, :blog, :blog_id, :parent

  def self.all(cursor="", options={})
    resp = RestClient.get DSQ_API_POSTS, {
        :params => {
            :forum => options[:shortname] || Setting.disqus.shortname,
            :related => 'thread',
            :limit => 100,
            :cursor => cursor,
            :api_secret => options[:api_secret] || Setting.disqus.api_secret,
            :access_token => options[:access_token] || Setting.disqus.access_token
        }
    }
    response = JSON.parse(resp.to_s)
    return CommentArray.new(response)
  end

  # 获取评论的上下文
  def self.showContext(id)
    resp = RestClient.get DSQ_API_POST_CONTEXT, {
        :params => {
            :post => id,
            :api_secret => Setting.disqus.api_secret,
            :access_token => Setting.disqus.access_token
        }
    }
    response = JSON.parse(resp.to_s)
    return CommentArray.new(response, :with_blog => false)
  end

  # 删除
  def self.remove(id)
    resp = RestClient.post DSQ_API_REMOVE_POST, {
        :post => id,
        :api_secret => Setting.disqus.api_secret,
        :access_token => Setting.disqus.access_token
    }
  end

  # 创建
  def self.create(comment)
    RestClient.post DSQ_API_CREATE_POST, {
        :parent => comment.parent,
        :message => comment.content,
        :api_secret => Setting.disqus.api_secret,
        :access_token => Setting.disqus.access_token
    }
  end

  # 从 disqus api 同步 BLOG 评论数
  def self.sync_count
    resp = RestClient.get DSQ_API_THREADS, {
        :params => {
            :forum => Setting.disqus.shortname,
            :limit => 100,
            :api_secret => Setting.disqus.api_secret,
            :access_token => Setting.disqus.access_token
        }
    }
    threads = JSON.parse(resp.to_s)["response"]

    threads.each do |th|
      blog = Blog.where(:id => th["identifiers"][0]).first
      blog.update_columns(:comment_count => th["posts"]) if blog
    end
  end

  def save
    Comment.create(self)
  end

  # Comment 数组类
  class CommentArray < Array
    attr_accessor :cursor

    def initialize(api_response, with_blog: true)
      @comments = api_response["response"].map! do |cm|
        c = Comment.new(
            :id => cm["id"],
            :content => cm["raw_message"],
            :author_name => cm["author"]["name"],
            :author_email => cm["author"]["email"],
            :author_avatar => cm["author"]["avatar"]["large"]["permalink"],
            :ip => cm["ipAddress"],
            :created_at => cm["createdAt"]
        )
        c.blog_id = cm["thread"]["identifiers"][0] if with_blog
        c
      end

      # 填充 blog 关联字段
      if with_blog
        blog_ids = @comments.map { |cm| cm.blog_id }
        Blog.where(:id => blog_ids).each do |blog|
          arr = @comments.select { |c| c.blog_id == blog.id.to_s }
          arr.each { |c| c.blog = blog }
        end
      end

      self.cursor = api_response["cursor"]

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