# markdown语法支持
module Klog2
  # 格式化markdown语法为html的类
  class Markdown

    def self.render(text)
      return self.instance.render(text)
    end

    def self.instance
      @markdown ||= Redcarpet::Markdown.new(Klog2::Render.new,
                                            :autolink => true,
                                            :fenced_code_blocks => true,
                                            :disable_indented_code_blocks => true,
                                            :strikethrough => true,
                                            :space_after_headers => true,
                                            :superscript => true,
                                            :footnotes => true,
                                            :no_intra_emphasis => true,
                                            :tables => true)
      return @markdown
    end

  end

  # 格式化定制
  class Render < Redcarpet::Render::HTML
    def initialize(extensions={})
      super(extensions.merge(:xhtml => true,
                             :with_toc_data => true,
                             :no_styles => true,
                             :filter_html => true,
                             :link_attributes => {:target => "_blank", :rel => "nofollow"},
                             :hard_wrap => true))
    end

    def header(text, header_level)
      tag = 'h' + (header_level + 2).to_s
      tag_start = "<#{tag}>"
      tag_end = "</#{tag}>"
      return tag_start + text + tag_end
    end

    def block_code(code, language)
      language = language || 'unknown'
      # 加上 HTML 注释是为了不让 truncate_html 把代码片段切开，参见 :break_token 参数
      '<!-- truncate -->' + CodeRay.scan(code, language).div(:tab_width => 2)
    end

    def table(header, body)
      return "<table class=\"table table-bordered\"><thead>#{header}</thead><tbody>#{body}</tbody></table>"
    end
  end
end