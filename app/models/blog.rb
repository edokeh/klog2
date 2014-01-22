class Blog < ActiveRecord::Base
  include TruncateHtmlHelper
  include HasSlug
  extend Enumerize
  enumerize :status, :in => {:draft => 0, :publish => 1}, :predicates => true, :scope => true

  acts_as_ordered_taggable
  paginates_per 5

  validates :title, :length => {:in => 2..100}
  validates :content, :length => {:in => 3..100000}

  before_validation :clean_slug
  before_save :fill_slug
  before_save :fill_html_content
  after_save :update_blog_count

  belongs_to :category
  has_many :attaches, :as=>:parent, :dependent => :destroy

  # 创建一个预览对象
  def self.new_preview(params)
    blog = Blog.new(params)
    blog.fill_html_content
    blog.created_at = Time.now

    blog
  end

  def publish!
    self.status = :publish
    self.save
  end

  # 将 Markdown 转为 HTML 保存，并保存摘要
  def fill_html_content
    self.html_content = Klog2::Markdown.render(self.content)
    self.html_content_summary = truncate_html(self.html_content, :length => 250, :omission => '', :break_token => '<!-- truncate -->')
  end

  # 更新分类的 blog_count
  def update_blog_count
    return if category.nil?
    # 如果状态变动或者分类变动，重算当前分类
    category.update_blog_count if status_changed? or category_id_changed?
    # 如果分类变动，重算之前的分类
    Category.find(category_id_was).update_blog_count if category_id_changed? and !category_id_was.nil?
  end
end
