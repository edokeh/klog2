class Admin::AttachesController < Admin::ApplicationController

  #上传附件
  def create
    @attach = Attach.new_by_params(params)

    if @attach.save
      render
    else
      render :json => @attach.errors, :status => 422
    end
  end
end