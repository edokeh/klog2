class Admin::CategoriesController < Admin::ApplicationController

  def index
    @categories = Category.all
  end
end