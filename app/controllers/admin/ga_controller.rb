class Admin::GaController < Admin::ApplicationController

  def show
    @ga = Ga.find

    render :json => @ga.to_json(:methods => [:secret_file])
  end

  def update
    @ga = Ga.find

    if @ga.update_attributes(ga_params)
      # 更新附件的归属
      Attach.update_parent(ga_params[:secret_file_id], @ga)
      render :json => @ga
    else
      render :json => @ga, :status => 422
    end
  end

  private

  def ga_params
    params.require(:ga).permit(:account, :chart_enable, :api_email).tap do |whitelisted|
      whitelisted[:secret_file_id] = params[:secret_file][:id] if params[:secret_file]
    end
  end
end