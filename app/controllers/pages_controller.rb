class PagesController < ApplicationController

  def show
    @page = Page.where(:slug => params[:id]).first
    raise ActiveRecord::RecordNotFound if @page.nil?

    @curr_nav = "page_#{@page.slug}"
  end

end