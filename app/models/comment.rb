# -*- encoding : utf-8 -*-
class Comment
  include ActiveModel::Model

  DSQ_API = "https://disqus.com/api/3.0/1"
  DSQ_API_POSTS = "#{DSQ_API}/forums/listPosts.json"
  DSQ_API_THREADS = "#{DSQ_API}/forums/listThreads.json"

  DSQ_API_SECRET = "wewIP40PYYJnLigTWlnHAFZ0jiyA3KQjPWvPbKLEUtd7cHPJTkSCfSpeKaQQOlGB"
  DSQ_ACCESS_TOKEN = "807e8dc2d176412fa5d94b4536482521"

  attr_accessor :content, :author_name, :author_email, :ip, :is_admin, :blog, :blog_id

  def self.all(cursor="")
    resp = RestClient.get DSQ_API_POSTS, {
        :params => {
            :forum => 'chaoskeh',
            :related => 'thread',
            :limit => 25,
            :cursor => cursor,
            :api_secret => DSQ_API_SECRET,
            :access_token => DSQ_ACCESS_TOKEN
        }
    }
    response = JSON.parse(resp.to_s)
    return CommentArray.new(response)
  end

  # 从 disqus api 同步 BLOG 评论数
  def self.sync_count
    resp = RestClient.get DSQ_API_THREADS, {
        :params => {
            :forum => 'chaoskeh',
            :limit => 100,
            :api_secret => DSQ_API_SECRET,
            :access_token => DSQ_ACCESS_TOKEN
        }
    }
    threads = JSON.parse(resp.to_s)["response"]

    threads.each do |th|
      blog = Blog.where(:id => th["identifiers"][0]).first
      blog.update_columns(:comment_count => th["posts"]) if blog
    end
  end

  # Comment 数组类
  class CommentArray < Array
    def initialize(api_response)
      @comments = api_response["response"].map! do |cm|
        Comment.new(
            :content => cm["raw_message"],
            :author_name => cm["author"]["name"],
            :author_email => cm["author"]["email"],
            :ip => cm["ipAddress"],
            :blog_id => cm["thread"]["identifiers"][0]
        )
      end

      # 填充 blog 关联字段
      blog_ids = @comments.map { |cm| cm.blog_id }
      Blog.where(:id => blog_ids).each do |blog|
        c = @comments.detect { |c| c.blog_id == blog.id.to_s }
        c.blog = blog unless c.nil?
      end

      @cursor = api_response["cursor"]

      super @comments
    end

    # 下一页
    def next
      Comment.all(@cursor["next"])
    end

    def prev
      Comment.all(@cursor["prev"])
    end

    def has_next?
      @cursor["hasNext"]
    end

    def has_prev?
      @cursor["hasPrev"]
    end
  end
end