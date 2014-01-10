class Admin::CommentsController < Admin::ApplicationController

  def index
    @comments = Comment.all(params[:cursor])
  end

end