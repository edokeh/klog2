# 拥有 Slug 的 Model ，如 Blog/Page
module HasSlug
  extend ActiveSupport::Concern

  included do
    before_validation :clean_slug
    before_save :fill_slug

    validates :slug, :uniqueness => true
  end

  # 将slug中的非法字符过滤掉
  def clean_slug
    self.slug = self.slug.gsub(/[^a-zA-Z\-0-9]/, '-').downcase if self.slug.present?
  end

  # 如果没有slug则用时间戳代替
  def fill_slug
    self.slug = Time.now.to_i.to_s if self.slug.blank?
  end
end