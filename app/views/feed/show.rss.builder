xml.instruct! :xml, :version => "1.0"
xml.rss :version => "2.0" do
  xml.channel do
    xml.title # TODO Setting.website_title
    xml.description #Setting.website_descr
    xml.link root_url

    @blogs.each do |blog|
      xml.item do
        xml.title blog.title
        xml.description do
          xml.cdata! blog.html_content
        end
        xml.pubDate blog.created_at.to_s(:rfc822)
        xml.link blog_url(blog.slug)
        xml.guid blog_url(blog.slug)
      end
    end
  end
end