from django import template
import re
from sorl.thumbnail import get_thumbnail
from articles.models import Article
from datetime import date
from django.contrib.humanize.templatetags.humanize import naturalday, naturaltime

register = template.Library()


@register.filter(name="insert_photo_thumbs")
def insert_photo_thumbs(content):
    urls = re.findall(
        r"<img ?(?:style=\"[^\"]*\")? src=[\"']((?:https?:)?//[a-z0-9\-_/:\.]+(?:jpe?g|png|gif))[\"'] ?(?:style=\"[^\"]*\")? ?/?>",
        content, re.IGNORECASE)
    for url in urls:
        ssl_url = re.sub(r"//", "https://", url)
        thumb_l = get_thumbnail(ssl_url, "200x200", crop="center", quality=95)
        thumb_WEBP_l = get_thumbnail(ssl_url, "200x200", crop="center", quality=95, format="WEBP")
        img_s = get_thumbnail(ssl_url, "640", quality=95)
        img_l = get_thumbnail(ssl_url, "1440", quality=95)
        img_WEBP_s = get_thumbnail(ssl_url, "640", quality=95, format="WEBP")
        img_WEBP_l = get_thumbnail(ssl_url, "1440", quality=95, format="WEBP")
        content = re.sub("<img ?(?:style=\"[^\"]*\")? src=[\"']" + url + "[\"'] ?(?:style=\"[^\"]*\")? ?/?>",
                         f"""<a class='thumb' href='{img_l.url}'><picture data-src='{img_l.url}'
                          data-jpeg='{img_s.url} 640w, {img_l.url} 1440w'
                          data-webp='{img_WEBP_l.url} 640w, {img_WEBP_s.url} 1440w'>
                            <source type="image/webp" srcset='{thumb_WEBP_l.url} 200w' />
                            <source type="image/jpeg" srcset='{thumb_l.url} 200w' />
                            <img src='{thumb_l.url}'></picture>
                         </a>""", content, re.IGNORECASE)
    return content


@register.filter(name="insert_article_links")
def insert_article_links(content):
    link_regex = r"<hr data-href=\"[a-z0-9-]+\" contenteditable=\"false\" class=\"editor-article-link\">"
    links = re.findall(link_regex, content, re.IGNORECASE)
    for link in links:
        slug = re.sub(r"<hr data-href=\"", "", link)
        slug = re.sub(r"\".*", "", slug)
        article = Article.objects.get(slug=slug)
        thumb = article.get_cover_thumbnail_url()
        updated = ""
        if article.time_updated > article.time_created:
            updated = f", aktualizace {naturaltime(article.time_updated)}"
        link_with_slug = r"<hr data-href=\"" + slug + "\" contenteditable=\"false\" class=\"editor-article-link\">"
        content = re.sub(link_with_slug, f"""<a class='article-link' href='{article.get_url()}'>
        <img class='article-link-image' src='{thumb}' alt='{article.title}' />
        <div class='article-link-text'>
        <h3 class='article-link-text-title'>{article.title}</h3>
        <p class='article-link-text-meta'>
        {article.time_created.strftime("%d. %m. %Y, %H:%M")}{updated}
        </p>
        <p class='article-link-text-description'>{article.intro}</p>
        </div>
        </a>""", content, re.IGNORECASE)
    return content
