class BlogsController < ApplicationController

  def index
    expires_in 2.minutes, :public=>true
    @blogs = Blog.with_status(:publish).includes([:category, :tags]).order('created_at DESC').page(params[:page])
    @curr_nav = "blog"
  end

  def show
    @blog = Blog.where(:slug=>params[:id]).first
    raise ActiveRecord::RecordNotFound if @blog.nil? || @blog.draft?

    @prev_blog = Blog.with_status(:publish).where('id < ?', @blog.id).order('id DESC').first
    @next_blog = Blog.with_status(:publish).where('id > ?', @blog.id).order('id ASC').first
  end

  # 根据 post 过来的数据提供预览页面
  def preview
    @blog = Blog.new_preview(blog_params)
    @preview = true
    render :show
  end

  private
  def blog_params
    params.permit(:title, :content, :category_id)
  end

end
