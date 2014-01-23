# RestClient 全局 timeout
class << ::RestClient::Request
  def execute_with_timeout(args, &block)
    args[:timeout] = 10
    args[:open_timeout] = 10
    execute_without_timeout(args, &block)
  end

  alias_method_chain :execute, :timeout
end