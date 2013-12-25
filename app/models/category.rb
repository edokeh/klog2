class Category < ActiveRecord::Base
  validates :name,
            :length => {:in => 2..20},
            :uniqueness => true

  before_destroy :clear_blogs_category

  has_many :blogs

  # 将分类下所有blog的分类属性置为空
  def clear_blogs_category
    self.blogs.update_all(:category_id => nil)
  end

  # 重新计算 blog count 并保存
  def update_blog_count
    update_attributes(:blog_count => blogs.with_status(:publish).count)
  end
end
