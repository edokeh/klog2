class ArchiveController < ApplicationController

  def show
    expires_in 1.hours
    @blogs = Blog.select(:title, :created_at, :status, :slug).with_status(:publish).order('created_at DESC')

    # 按年分组
    @blogs_by_year = {}

    @blogs.each do |blog|
      @blogs_by_year[blog.created_at.year] ||= []
      @blogs_by_year[blog.created_at.year] << blog
    end

    @curr_nav = "archive"
  end

end
