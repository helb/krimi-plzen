from django.contrib import admin
from .models import Advert, Advertiser, Position, AdvertiserEvent
from daterange_filter.filter import DateRangeFilter

admin.site.register(
    Advert,
    list_display=["title", "advertiser", "time_created", "time_updated"],
    list_display_links=["title"],
    ordering=["-time_created"],
    list_filter=(
        ("time_created", DateRangeFilter),
        "time_updated",
        "advertiser"
    )
)

admin.site.register(
    AdvertiserEvent,
    list_display=["title", "advertiser", "date_start", "date_end"],
    list_display_links=["title"],
    ordering=["-date_start"]
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
    prepopulated_fields={"slug": ("title",)}
)
