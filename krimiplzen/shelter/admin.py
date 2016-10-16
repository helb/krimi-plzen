from django.contrib import admin
from .models import Animal
from daterange_filter.filter import DateRangeFilter
from django.utils.translation import ugettext_lazy as _


class AnimalAdmin(admin.ModelAdmin):
    list_display = ["text", "category", "time_created", "is_visible"]
    list_editable = ["is_visible"]
    ordering = ["-time_created"]

admin.site.register(Animal, AnimalAdmin)
