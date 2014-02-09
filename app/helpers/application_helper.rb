module ApplicationHelper
  # 获取操作系统
  # os.mac?
  def os
    os = case (request.user_agent || "").downcase
           when /iphone|ipad|itouch/
             "ios"
           when /android/
             "android"
           when /mac/
             "mac"
           when /windows/
             "win"
           else
             "unknown"
         end
    ActiveSupport::StringInquirer.new(os)
  end

  # 导航项是否高亮，手工设置 @curr_nav 变量来实现
  def nav_class(name)
    "active" if @curr_nav == name
  end

  # 页面标题
  def title(text)
    subhead = "#{Setting.website.title} - #{Setting.website.author}的Blog"
    if text.present?
      "#{text} - #{subhead}"
    else
      subhead
    end
  end

  # 针对网站设置的一些链接，Github，微博等等
  # use Ruby 2.0 keywords argument
  def website_link(setting_key, icon: "", url: "", title: "")
    setting = Setting.website[setting_key]
    if setting.present?
      url = setting if url.blank?
      link_to fa_icon(icon + ' fa-fw'), url, :target => '_blank', :rel => 'nofollow', :title => title
    end
  end
end