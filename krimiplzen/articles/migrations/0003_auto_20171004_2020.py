# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-04 20:20
from __future__ import unicode_literals

from django.db import migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0002_auto_20170803_0057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='cover_photo',
            field=sorl.thumbnail.fields.ImageField(blank=True, upload_to='foto/covers/', verbose_name='Cover photo'),
        ),
    ]