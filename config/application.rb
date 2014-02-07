require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module Klog2
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    config.time_zone = 'Beijing'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.enforce_available_locales = true
    config.i18n.default_locale = "zh-CN"

    config.autoload_paths += %W(#{config.root}/lib)

    config.assets.precompile += %w(admin.css public.css)
    config.assets.precompile += %w(html5shiv.js respond.js xhr-shim.js)

    config.after_initialize do
      Setting.defaults = {
          "website" => OpenStruct.new(
              :title => "网站名称",
              :sub_title => "一点点简介写在这里",
              :author => "蛇精病"
          ),
          "disqus" => OpenStruct.new(:enable => false),
          "ga" => OpenStruct.new(:chart_enable => false)
      }

      RestClient.log = Rails.logger
    end
  end
end
