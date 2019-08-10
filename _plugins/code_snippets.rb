module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, file, tokens)
      super
      @file = file
    end

    def render(context)
      File.readlines(@file)
    end
  end
end

Liquid::Template.register_tag('fromFile', Jekyll::RenderTimeTag)