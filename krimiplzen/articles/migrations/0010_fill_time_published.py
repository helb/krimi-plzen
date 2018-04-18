from django.apps import apps
from django.db import migrations
from django.db.models import F


def copy_field(a, b):
    ArticleModel = apps.get_model("articles", "Article")
    ArticleModel.objects.all().update(time_published=F("time_created"))


class Migration(migrations.Migration):
    dependencies = [
        ("articles", "0009_auto_20180418_2308"),
    ]

    operations = [
        migrations.RunPython(copy_field),
    ]
