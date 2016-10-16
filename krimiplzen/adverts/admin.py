from django.contrib import admin
from .models import Advert, Advertiser, Position
from daterange_filter.filter import DateRangeFilter

admin.site.register(
    Advert,
    list_display=["title", "time_created", "time_updated", "active_from" ,"active_until"],
    list_display_links=["title"],
    ordering=["-time_created"],
    list_filter=(
        ("time_created", DateRangeFilter),
        "time_updated",
        "tags"
        )
)


admin.site.register(
    Advertiser,
    list_display=["title"],
    list_display_links=["title"],
    ordering=["title"]
)


admin.site.register(
    Position,
    list_display=["title"],
    list_display_links=["title"],
    ordering=["slug"],
    prepopulated_fields = {"slug": ("title",)}
)
