from .models import Tag
from django.contrib import admin


admin.site.register(
    Tag,
    list_display=["title", "display_in_menu"],
    list_editable=["display_in_menu"],
    list_display_links=["title"],
    ordering=["title"],
    prepopulated_fields={"slug": ("title",)}
)
