from django import template
import re
from sorl.thumbnail import get_thumbnail

register = template.Library()

@register.filter(name="insert_photo_thumbs")
def insert_photo_thumbs(content):
    urls = re.findall(r"<img src=[\"'](https?://[a-z0-9\-_/\.]+jpe?g)[\"'] ?(?:style=\"[^\"]*\")? ?/?>", content, re.IGNORECASE)
    thumb_urls = []
    for url in urls:
        thumb_s = get_thumbnail(url, "100x100", crop="center", quality=95)
        thumb_l = get_thumbnail(url, "200x200", crop="center", quality=95)
        img_s = get_thumbnail(url, "640", quality=95)
        img_l = get_thumbnail(url, "1440", quality=95)
        content = re.sub("<img src=[\"']" + url + "[\"'] ?(?:style=\"[^\"]*\")? ?/?>",
                         "<a href='" + url + "'>" +
                         "<img src='" + thumb_s.url + "' data-src=" + img_l.url + " srcset='" + thumb_s.url + " 100w, " + thumb_l.url + " 200w' data-srcset='" + img_s.url + " 640w, " + img_l.url + " 1440w' /></a>",
                         content, re.IGNORECASE)
    return content
