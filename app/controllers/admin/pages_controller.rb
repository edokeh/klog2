class Admin::PagesController < Admin::ApplicationController

  def index
    @pages = Page.order('sid ASC').all
  end

  def show
    @page = Page.find(params[:id])
  end

  def create
    @page = Page.new(page_params)
    params[:detail] = true

    if @page.save
      # 更新附件的归属
      Attach.update_parent(params[:attach_ids], @page)
      render :show
    else
      render :show, :status => 422
    end
  end

  def update
    @page = Page.find(params[:id])
    params[:detail] = true

    if @page.update_attributes(page_params)
      # 更新附件的归属
      Attach.update_parent(params[:attach_ids], @page)
      render :show
    else
      render :show, :status => 422
    end
  end

  def destroy
    @page = Page.find(params[:id])
    @page.destroy

    head :no_content
  end

  def up
    @page = Page.find(params[:id])
    @page.up

    redirect_to admin_pages_url
  end

  def down
    @page = Page.find(params[:id])
    @page.down

    redirect_to admin_pages_url
  end

  private

  def page_params
    params.require(:page).permit(:title, :content, :slug, :attaches)
  end
end