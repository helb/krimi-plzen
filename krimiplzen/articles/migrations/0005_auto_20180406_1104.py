# Generated by Django 2.0.4 on 2018-04-06 11:04

from django.db import migrations
import krimiplzen.settings
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0004_auto_20171017_1459'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='cover_photo',
            field=sorl.thumbnail.fields.ImageField(upload_to=krimiplzen.settings.summernote_upload_to, verbose_name='Cover photo'),
        ),
    ]
