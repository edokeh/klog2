class BlogsController < ApplicationController

  def index
    expires_in 2.minutes, :public=>true
    @blogs = Blog.with_status(:publish).includes([:category]).order('created_at DESC')#.page(params[:page]).per(5)
  end

  def show
    @blog = Blog.where(:slug=>params[:id]).first
    raise ActiveRecord::RecordNotFound if @blog.nil?
    #raise ActiveRecord::RecordNotFound if @blog.draft? and !is_admin?

    @prev_blog = Blog.with_status(:publish).where('id < ?', @blog.id).order('id DESC').first
    @next_blog = Blog.with_status(:publish).where('id > ?', @blog.id).order('id ASC').first
  end

end
