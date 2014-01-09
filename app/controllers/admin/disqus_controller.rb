class Admin::DisqusController < Admin::ApplicationController

  def show
    @disqus = Setting.disqus || OpenStruct.new
    render :json => @disqus.marshal_dump
  end

  def update
    @disqus = disqus_params
    Setting.disqus = @disqus
    render :json => @disqus
  end

  private

  def disqus_params
    params.require(:disqus).permit(:enable, :shortname, :api_secret, :access_token)
  end
end