class Admin::DisqusController < Admin::ApplicationController

  def show
    @disqus = Disqus.find

    render :json => @disqus
  end

  def update
    @disqus = Disqus.find

    if @disqus.update_attributes(disqus_params)
      render :json => @disqus
    else
      render :json => @disqus, :status => 422
    end
  end

  def enable
    @disqus = Disqus.find
    @disqus.update_enable(params[:enable])

    render :json => @disqus
  end

  private

  def disqus_params
    params.require(:disqus).permit(:enable, :shortname, :api_secret, :access_token)
  end
end