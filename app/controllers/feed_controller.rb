class FeedController < ApplicationController

  def show
    expires_in 1.hours, :public=>true
    @blogs = Blog.with_status(:publish).order('created_at DESC')
    render :layout => false
  end

end
