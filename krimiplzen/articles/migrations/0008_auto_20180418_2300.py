# Generated by Django 2.0.4 on 2018-04-18 23:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0007_auto_20180409_1620'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='time_published',
        ),
        migrations.AddField(
            model_name='article',
            name='liveupdates',
            field=models.BooleanField(default=True, help_text='Automatically push article updates to visitors.', verbose_name='Live updates'),
        ),
        migrations.AddField(
            model_name='article',
            name='photo_cover_light',
            field=models.BooleanField(default=False, verbose_name='Dark text on a light photo'),
        ),
        migrations.AddField(
            model_name='article',
            name='related_articles',
            field=models.ManyToManyField(blank=True, related_name='_article_related_articles_+', to='articles.Article', verbose_name='Related articles'),
        ),
        migrations.AddField(
            model_name='article',
            name='video_ad',
            field=models.BooleanField(default=True, verbose_name='Allow ad before video'),
        ),
    ]
