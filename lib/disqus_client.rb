# Disqus API Client
# 返回 Hash 格式数据
class DisqusClient
  DSQ_API = "https://disqus.com/api/3.0"
  DSQ_API_POSTS = "#{DSQ_API}/forums/listPosts.json"
  DSQ_API_THREADS = "#{DSQ_API}/forums/listThreads.json"
  DSQ_API_POST_CONTEXT = "#{DSQ_API}/posts/getContext.json"
  DSQ_API_REMOVE_POST = "#{DSQ_API}/posts/remove.json"
  DSQ_API_CREATE_POST = "#{DSQ_API}/posts/create.json"
  DSQ_API_THREAD_DETAIL = "#{DSQ_API}/threads/details.json"

  # 获取评论列表
  def self.all_post(cursor="", options={})
    resp = RestClient.get DSQ_API_POSTS, {
        :params => {
            :forum => options[:shortname] || Setting.disqus.shortname,
            :related => 'thread',
            :limit => 30,
            :cursor => cursor,
            :api_secret => options[:api_secret] || Setting.disqus.api_secret,
            :access_token => options[:access_token] || Setting.disqus.access_token
        }
    }
    hash = JSON.parse(resp.to_s)

    # 返回两个
    return hash["response"], hash["cursor"]
  end

  # 获取评论上下文
  def self.get_context(post_id)
    resp = RestClient.get DSQ_API_POST_CONTEXT, {
        :params => {
            :post => post_id,
            :api_secret => Setting.disqus.api_secret,
            :access_token => Setting.disqus.access_token
        }
    }
    JSON.parse(resp.to_s)["response"]
  end

  # 删除评论
  def self.remove_post(post_id)
    RestClient.post DSQ_API_REMOVE_POST, {
        :post => post_id,
        :api_secret => Setting.disqus.api_secret,
        :access_token => Setting.disqus.access_token
    }
  end

  # 创建评论
  def self.create_post(comment)
    resp = RestClient.post DSQ_API_CREATE_POST, {
        :parent => comment.parent,
        :message => comment.content,
        :api_secret => Setting.disqus.api_secret,
        :access_token => Setting.disqus.access_token
    }
    JSON.parse(resp.to_s)["response"]
  end

  # 获取所有的 Thread（blog)
  # TODO 等写超过 100 篇就来 Fix
  def self.all_thread
    resp = RestClient.get DSQ_API_THREADS, {
        :params => {
            :forum => Setting.disqus.shortname,
            :limit => 100,
            :api_secret => Setting.disqus.api_secret,
            :access_token => Setting.disqus.access_token
        }
    }
    JSON.parse(resp.to_s)["response"]
  end

  # 获取某个 Thread 的详情
  def self.get_thread(thread_id)
    resp = RestClient.get DSQ_API_THREAD_DETAIL, {
        :params => {
            :thread => thread_id,
            :api_secret => Setting.disqus.api_secret,
            :access_token => Setting.disqus.access_token
        }
    }
    JSON.parse(resp.to_s)["response"]
  end
end