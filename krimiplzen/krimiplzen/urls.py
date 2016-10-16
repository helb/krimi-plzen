from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin
from articles import views as articles_views
from articles.models import Article
from articles.feeds import LatestArticlesFeed, TaggedArticlesFeed
from django.contrib.sitemaps.views import sitemap
from django.contrib.sitemaps import GenericSitemap

sitemap_dict = {
    "queryset": Article.objects.filter(status="p"),
    "date_field": "time_updated",
}

admin.site.site_header = "Krimi Plzeň – redakce"
admin.site.site_title = admin.site.site_header

urlpatterns = [
    url(r"^$", articles_views.newest_articles, name="newest_articles"),
    url(r"^a/tag/(?P<tag_slug>[a-z0-9-]+)/$", articles_views.tagged_articles, name="tagged_articles"),
    url(r"^a/(?P<article_slug>[a-z0-9-]+)/$", articles_views.article_detail, name="article_detail"),
    url(r"^summernote/", include("django_summernote.urls")),
    url(r"^admin/", admin.site.urls),
    url(r"^sitemap\.xml$", sitemap,
        {"sitemaps": {"articles": GenericSitemap(sitemap_dict)}},
        name="django.contrib.sitemaps.views.sitemap"),
    url(r"^rss/$", LatestArticlesFeed()),
    url(r"^rss/(?P<tag_slug>[a-z0-9-]+)/$", TaggedArticlesFeed()),

]
