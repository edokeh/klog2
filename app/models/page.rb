class Page < ActiveRecord::Base
  before_validation :clean_slug
  before_save :fill_html_content
  after_create :set_sid

  validates :title, :length => {:in => 2..10}
  validates :content, :length => {:in => 10..100000}
  validates :slug, :presence => true, :uniqueness => true

  #has_many :attaches, :as => :parent

  #将slug中的非法字符过滤掉
  def clean_slug
    self.slug = self.slug.gsub(/[^a-zA-Z\-0-9]/, '-').downcase if self.slug.present?
  end

  #将markup的content转换为html并写入字段
  def fill_html_content
    self.html_content = Klog::Markdown.render(self.content)
  end

  def set_sid
    self.update_column(:sid, id)
  end
end
