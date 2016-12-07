from django.contrib import admin
from .models import Article, Sticker
from tags.models import Tag
from daterange_filter.filter import DateRangeFilter
from django.utils.translation import ugettext_lazy as _
from django.contrib.admin.actions import delete_selected
from django_summernote.admin import SummernoteModelAdmin
from sorl.thumbnail.admin import AdminImageMixin
from django.utils.html import format_html
from django.forms import TextInput, Textarea
from django.db import models


class ArticleAdmin(SummernoteModelAdmin):
    list_per_page = 20
    list_display = ("title", "share_field", "link_field", "time_created", "is_published")
    radio_fields = {"status": admin.HORIZONTAL}
    # formfield_overrides = {
    #     models.CharField: {"widget": TextInput(attrs={"size":"100"})}
    # }
    list_filter = (
        ("time_created", DateRangeFilter),
        "time_updated",
        "status",
        "tags",
        "stickers"
    )
    filter_horizontal = ("tags", "stickers", "related_articles")
    save_on_top = True
    search_fields = ["title", "intro"]
    ordering = ("-time_created"),
    actions = ["make_published", "make_inaccessible"]
    fieldsets = (
        (_("Basic info"), {
            "fields": ["title", "intro", "content", "cover_photo"]
        }),
        (_("Tags and stickers"), {
            #   "classes": ["collapse"],
            "fields": ["tags", "stickers"]
        }),
        (_("Publication"), {
            "classes": ["collapse"],
            "fields": ["status"]
        }),
        (_("Advanced"), {
            "classes": ["collapse"],
            "fields": ["related_articles", "photo_cover", "advertiser", "allow_ads", "video_ad", "author_name", "liveupdates"]
        }),
    )

    def formfield_for_dbfield(self, db_field, **kwargs):
        field = super(ArticleAdmin, self).formfield_for_dbfield(db_field, **kwargs)
        if db_field.name in ["title", "intro"]:
            field.widget.attrs["style"] = "width: 79%"
        return field

    def share_field(self, obj):
        return format_html("<a href='%s%s' target='_blank'><img src='https://www.facebook.com/rsrc.php/v3/yv/r/Iie2_IVxtfF.png' style='width:1.25em; height: 1.25em;'/></a>" % ("https://www.facebook.com/dialog/share?app_id=966242223397117&display=popup&href=http%3A%2F%2Fwww.krimi-plzen.cz%2Fa%2F", obj.slug))

    share_field.short_description = _("Share")

    def link_field(self, obj):
        return format_html("<a style='color: #fff; background: #7ada0e; width:1.25em; height: 1.25em; padding: 0.15em; margin-top: -0.1em; display: inline-block; font-size: 0.7em; border-radius: 0.15em;' href='%s%s' target='_blank'>➜</a>" % ("/a/", obj.slug))

    link_field.short_description = _("Web")

    def make_published(modeladmin, request, queryset):
        queryset.update(status="p")
    make_published.short_description = _("Publish selected articles")

    def make_inaccessible(modeladmin, request, queryset):
        queryset.update(status="x")
    make_inaccessible.short_description = _("Unpublish selected articles")

    def save_model(self, request, obj, form, change):
        obj.author = request.user
        obj.save()

admin.site.register(Article, ArticleAdmin)

admin.site.register(
    Sticker,
    list_display=["title"],
    list_display_links=["title"],
    ordering=["title"],
)
