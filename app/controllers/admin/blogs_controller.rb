class Admin::BlogsController < Admin::ApplicationController

  def index
    @blogs = Blog.order("created_at DESC").includes(:category).page(params[:page]).per(10)
    @blogs = @blogs.where(:status => params[:status]) if params[:status].present?
  end

  def show
    @blog = Blog.find(params[:id])
  end
end