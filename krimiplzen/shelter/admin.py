from django.contrib import admin
from .models import Animal


class AnimalAdmin(admin.ModelAdmin):
    list_display = ["text", "category", "time_created", "is_visible"]
    list_editable = ["is_visible"]
    ordering = ["-time_created"]


admin.site.register(Animal, AnimalAdmin)
