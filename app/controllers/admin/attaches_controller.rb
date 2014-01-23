class Admin::AttachesController < Admin::ApplicationController

  def index
    @attaches = Attach.order('created_at DESC').includes(:parent).page(params[:page]).per(15)
  end

  #上传附件
  def create
    @attach = Attach.new_by_params(params)

    if @attach.save
      render
    else
      render :status => 422
    end
  end

  def destroy
    @attach = Attach.find(params[:id])
    @attach.destroy

    head :no_content
  end
end