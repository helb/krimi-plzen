from django.contrib.syndication.views import Feed
from .models import Article
from tags.models import Tag

class LatestArticlesFeed(Feed):
    title = "Krimi Plzeň – nejnovější články"
    link = "/"
    description = title

    def items(self):
        return Article.objects.filter(status="p")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro

class TaggedArticlesFeed(Feed):
    def get_object(self, request, tag_slug):
        return Tag.objects.get(pk=tag_slug)

    def title(self, obj):
        return "Krimi Plzeň – %s" % obj.title

    def description(self, obj):
        return "Krimi Plzeň – %s" % obj.title

    def link(self, obj):
        return "/a/tag/" + obj.slug + "/"

    def items(self, obj):
        return Article.objects.filter(status="p", tags__slug__contains=obj.slug)[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.intro
