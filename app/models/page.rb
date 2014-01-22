class Page < ActiveRecord::Base
  include HasSlug

  before_save :fill_html_content
  after_create :set_sid

  validates :title, :length => {:in => 2..10}
  validates :content, :length => {:in => 3..100000}

  has_many :attaches, :as => :parent, :dependent => :destroy

  #将markup的content转换为html并写入字段
  def fill_html_content
    self.html_content = Klog2::Markdown.render(self.content)
  end

  def set_sid
    self.update_column(:sid, id)
  end

  #向上
  def up
    above_record = Page.where("sid < ?", self.sid).order('sid ASC').last
    return if above_record.nil?
    tmp_id = self.sid
    self.update_column(:sid, above_record.sid)
    above_record.update_column(:sid, tmp_id)
  end

  #向下
  def down
    under_record = Page.where("sid > ?", self.sid).order('sid ASC').first
    return if under_record.nil?
    tmp_id = self.sid
    self.update_column(:sid, under_record.sid)
    under_record.update_column(:sid, tmp_id)
  end
end
