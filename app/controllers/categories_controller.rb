class CategoriesController < ApplicationController

  def show
    @category = Category.where(:name=>params[:id]).first
    raise  ActiveRecord::RecordNotFound if @category.nil?

    @blogs = @category.blogs.with_status(:publish).order("created_at DESC").page(params[:page])
    render 'blogs/index'
  end

end