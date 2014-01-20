class Admin::PagesController < Admin::ApplicationController

  def index
    @pages = Page.order('sid ASC').all
  end

  def show
    @page = Page.find(params[:id])
  end

  def create
    @page = Page.new(page_params)

    if @page.save
      # 更新附件的归属
      Attach.update_parent(params[:attach_ids], @page)
      redirect_to admin_pages_path, :notice => "<strong>#{@page.title}</strong> 创建成功！".html_safe
    else
      render :new
    end
  end

  def update
    @page = Page.find(params[:id])

    if @page.update_attributes(page_params)
      # 更新附件的归属
      Attach.update_parent(params[:attach_ids], @page)
      redirect_to admin_pages_path, :notice => '修改成功！'
    else
      render :action => "edit"
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
    params.require(:page).permit(:title, :content, :slug, :status, :attaches)
  end
end