class Admin::BlogsController < Admin::ApplicationController

  def index
    @blogs = Blog.order("created_at DESC").includes(:category).page(params[:page]).per(10)
    @blogs = @blogs.where(:status => params[:status]) if params[:status].present?
  end

  def show
    @blog = Blog.find(params[:id])
  end

  def create
    @blog = Blog.new(blog_params)
    if @blog.save
      # 更新附件的归属
      Attach.update_parent((params[:attaches] || []).map { |a| a[:id] }, @blog)
      render :show
    else
      render :show, :status => 422
    end
  end

  def update
    @blog = Blog.find(params[:id])
    if @blog.update_attributes(blog_params)
      # 更新附件的归属
      Attach.update_parent((params[:attaches] || []).map { |a| a[:id] }, @blog)
      render :show
    else
      render :show, :status => 422
    end
  end

  def destroy
    @blog = Blog.find(params[:id])
    @blog.destroy

    head :no_content
  end

  def publish
    @blog = Blog.find(params[:id])
    @blog.publish!

    head :no_content
  end

  private
  def blog_params
    params.require(:blog).permit(:title, :content, :slug, :category_id, :status, :attaches)
  end
end