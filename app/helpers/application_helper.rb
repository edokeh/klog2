module ApplicationHelper
  # 获取操作系统
  def os
    os = case request.user_agent.downcase
           when /iphone|ipad|itouch/
             "ios"
           when /android/
             "android"
           when /mac/
             "mac"
           when /windows/
             "win"
         end
    return ActiveSupport::StringInquirer.new(os)
  end
end