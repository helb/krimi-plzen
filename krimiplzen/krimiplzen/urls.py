from django.contrib import admin
from django.urls import include, path
from articles import views as articles_views
from articles.models import Article
from articles.feeds import LatestArticlesFeed, TaggedArticlesFeed, TodayArticlesFeed
from django.contrib.sitemaps.views import sitemap
from django.contrib.sitemaps import GenericSitemap

sitemap_dict = {
    "queryset": Article.objects.filter(status="p"),
    "date_field": "time_updated",
}

admin.site.site_header = "Krimi Plzeň – redakce"
admin.site.site_title = admin.site.site_header

urlpatterns = [
    path("", articles_views.newest_articles, name="newest_articles"),
    path("a/tag/<slug:tag_slug>/", articles_views.tagged_articles, name="tagged_articles"),
    path("a/<slug:article_slug>/", articles_views.article_detail, name="article_detail"),
    path("summernote/", include("django_summernote.urls")),
    path("admin/", admin.site.urls),
    path("sitemap.xml", sitemap,
        {"sitemaps": {"articles": GenericSitemap(sitemap_dict)}},
        name="django.contrib.sitemaps.views.sitemap"),
    path("rss/", LatestArticlesFeed()),
    path("rss/today/", TodayArticlesFeed()),
    path("rss/<slug:tag_slug>/", TaggedArticlesFeed())
]
