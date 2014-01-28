worker_processes 4
timeout 30

app_root = File.expand_path("../..", __FILE__)
working_directory app_root
preload_app true

listen 8080, :tcp_nopush => false
listen "/tmp/unicorn.klog.sock", :backlog => 64

pid "#{app_root}/tmp/pids/unicorn.pid"
stderr_path "#{app_root}/log/unicorn.log"
stdout_path "#{app_root}/log/unicorn.log"

if GC.respond_to?(:copy_on_write_friendly=)
  GC.copy_on_write_friendly = true
end

before_exec do |_|
  ENV["BUNDLE_GEMFILE"] = File.join(app_root, 'Gemfile')
end

before_fork do |server, worker|
  # 参考 http://unicorn.bogomips.org/SIGNALS.html
  # 使用USR2信号，以及在进程完成后用QUIT信号来实现无缝重启
  old_pid = "#{app_root}/tmp/pids/unicorn.pid.oldbin"
  if File.exists?(old_pid) && server.pid != old_pid
    begin
      Process.kill("QUIT", File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH
      puts "Send 'QUIT' signal to unicorn error!"
    end
  end

  if defined? ActiveRecord::Base
    ActiveRecord::Base.connection.disconnect!
  end
end

after_fork do |server, worker|
  # 禁止GC，配合后续的OOB，来减少请求的执行时间
  GC.disable
  # the following is *required* for Rails + "preload_app true",
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
  end
end