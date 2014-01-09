class Admin::DisqusController < Admin::ApplicationController

  def show
    @disqus = Setting.disqus

    render :json => @disqus.marshal_dump
  end

  def update
    Setting.disqus = disqus_params

    render :json => Setting.disqus.marshal_dump
  end

  def enable
    @disqus = Setting.disqus
    @disqus.enable = params[:enable]
    Setting.disqus = @disqus

    render :json => @disqus.marshal_dump
  end

  private

  def disqus_params
    params.require(:disqus).permit(:enable, :shortname, :api_secret, :access_token)
  end
end