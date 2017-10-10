from django.contrib.syndication.views import Feed
from .models import Article
from tags.models import Tag
import datetime


class LatestArticlesFeed(Feed):
    title = "Krimi Plzeň – nejnovější články"
    link = "/"
    description = title

    def items(self):
        return Article.objects.filter(status="p")[:30]

    def item_title(self, item):
        return item.title

    def item_pubdate(self, item):
        return item.time_created

    def item_updateddate(self, item):
        return item.time_updated

    def item_description(self, item):
        return f"""<span class='item-img'>
                   <img alt='{item.title}' src='{item.get_cover_thumbnail_url()}'/></span>
                   <span class='item-text'>{item.intro}</span>"""


class TaggedArticlesFeed(Feed):
    def get_object(self, request, tag_slug):
        return Tag.objects.get(pk=tag_slug)

    def title(self, obj):
        return "Krimi Plzeň – %s" % obj.title

    def description(self, obj):
        return "Krimi Plzeň – %s" % obj.title

    def link(self, obj):
        return "/a/tag/" + obj.slug + "/"

    def item_pubdate(self, item):
        return item.time_created

    def item_updateddate(self, item):
        return item.time_updated

    def items(self, obj):
        return Article.objects.filter(status="p", tags__slug__contains=obj.slug)[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        def item_description(self, item):
            return f"""<img alt='{item.title}' src='{item.get_cover_thumbnail_url()}'/>
                       <span>{item.intro}</span>"""


class TodayArticlesFeed(Feed):
    title = "Krimi Plzeň – dnešní články"
    link = "/"
    description = title

    def items(self):
        return Article.objects.filter(status="p", time_created__gte=(datetime.datetime.now() - datetime.timedelta(days=1)))

    def item_title(self, item):
        return item.title

    def item_pubdate(self, item):
        return item.time_created

    def item_updateddate(self, item):
        return item.time_updated

    def item_description(self, item):
        def item_description(self, item):
            return f"""<img alt='{item.title}' src='{item.get_cover_thumbnail_url()}'/>
                       <span>{item.intro}</span>"""
