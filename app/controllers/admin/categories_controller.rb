class Admin::CategoriesController < Admin::ApplicationController

  def index
    @categories = Category.all
  end

  def create
    @category = Category.new(category_params)

    if @category.save
      render :show
    else
      render :show, :status => 422
    end
  end

  def update
    @category = Category.find(params[:id])

    if @category.update_attributes(category_params)
      render :show
    else
      render :show, :status => 422
    end
  end

  def destroy
    @category = Category.find(params[:id])
    @category.destroy

    head :no_content
  end

  private
  def category_params
    params.require(:category).permit(:name)
  end
end