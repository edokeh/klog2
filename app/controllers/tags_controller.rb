class TagsController < ApplicationController

  def show
    @tag = ActsAsTaggableOn::Tag.where(:name => params[:id])
    @blogs = Blog.with_status(:publish).tagged_with(params[:id]).order("created_at DESC").page(params[:page])
    render 'blogs/index'
  end

end