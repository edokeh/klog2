class Admin::CommentsController < Admin::ApplicationController

  def index
    @comments = Comment.all(params[:cursor])
  end

  def create
    @comment = Comment.new(params[:comment])
    @comment.save
    render :show
  end

  def destroy
    Comment.remove(params[:id])
    head :no_content
  end

  # 获取详情，其实是上下文
  def context
    @comments = Comment.showContext(params[:comment_id])
    @comments.reverse!
  end

end