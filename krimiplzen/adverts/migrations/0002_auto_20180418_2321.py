# Generated by Django 2.0.4 on 2018-04-18 23:21

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('adverts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdvertiserEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=60, validators=[django.core.validators.URLValidator(schemes=['http', 'https'])], verbose_name='Title')),
                ('link', models.URLField(verbose_name='Link')),
                ('time_updated', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('time_created', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('date_start', models.DateField(verbose_name='Start date')),
                ('date_end', models.DateField(verbose_name='End date')),
            ],
            options={
                'verbose_name': 'Advertiser event',
                'verbose_name_plural': 'Advertiser events',
                'ordering': ['-date_start'],
            },
        ),
        migrations.RemoveField(
            model_name='advert',
            name='active_from',
        ),
        migrations.RemoveField(
            model_name='advert',
            name='active_until',
        ),
        migrations.RemoveField(
            model_name='advert',
            name='image_mobile',
        ),
        migrations.RemoveField(
            model_name='advert',
            name='tags',
        ),
        migrations.AlterField(
            model_name='advert',
            name='link',
            field=models.URLField(validators=[django.core.validators.URLValidator(schemes=['http', 'https'])], verbose_name='Link'),
        ),
        migrations.AlterField(
            model_name='advertiser',
            name='link',
            field=models.CharField(blank=True, max_length=600, validators=[django.core.validators.URLValidator(schemes=['http', 'https'])], verbose_name='Link'),
        ),
        migrations.AddField(
            model_name='advertiserevent',
            name='advertiser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='adverts.Advertiser', verbose_name='Advertiser'),
        ),
    ]
