from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from datetime import datetime
from django.core import validators
from sorl.thumbnail import ImageField
from django.template.defaultfilters import slugify


def get_banner_filename(instance, filename):
    ext = filename.split(".")[-1]
    partner_slug = slugify(instance.advertiser.title)
    date_slug = datetime.now().strftime(settings.SLUG_DATE_FORMAT)
    return f"partners/{partner_slug}/{partner_slug}-{date_slug}.{ext}"


class Advertiser(models.Model):
    title = models.CharField(_("Title"),
                             max_length=60,
                             blank=False,
                             validators=[
                                 validators.MinLengthValidator(3)
                             ])

    link = models.CharField(_("Link"),
                            max_length=600,
                            blank=True,
                            validators=[
                                validators.URLValidator(schemes=["http", "https"])
                            ])

    text = models.TextField(_("Text"),
                            max_length=300,
                            blank=True,
                            validators=[
                                validators.MinLengthValidator(10)
                            ])

    display_on_frontpage = models.BooleanField(_("Display on front page"), default=False)
    logo = ImageField(_("Logo"), blank=True, upload_to="partners")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Advertiser")
        verbose_name_plural = _("Advertisers")
        ordering = ["title"]


class Position(models.Model):
    slug = models.SlugField(unique=True,
                            primary_key=True,
                            max_length=120,
                            blank=False,
                            validators=[
                                validators.MinLengthValidator(3)
                            ])

    title = models.CharField(_("Title"),
                             max_length=120,
                             blank=False,
                             validators=[
                                 validators.MinLengthValidator(3)
                             ])

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Advertisement position")
        verbose_name_plural = _("Advertisement positions")
        ordering = ["title"]


class Advert(models.Model):
    title = models.CharField(_("Title"),
                             max_length=60,
                             blank=False,
                             validators=[
        validators.MinLengthValidator(3)
    ])

    link = models.URLField(_("Link"),
                           blank=False,
                           validators=[
                             validators.URLValidator(schemes=["http", "https"])
                           ])

    time_updated = models.DateTimeField(_("Updated at"),
                                        auto_now=True,
                                        auto_now_add=False)

    time_created = models.DateTimeField(_("Created at"),
                                        auto_now=False,
                                        auto_now_add=True)

    advertiser = models.ForeignKey(Advertiser,
                                   on_delete=models.CASCADE,
                                   verbose_name=_("Advertiser"))

    position = models.ManyToManyField(Position, verbose_name=_("Position"), blank=False)

    image_desktop = ImageField(_("Image – desktop"), blank=True, upload_to=get_banner_filename)

    content = models.TextField(_("Content"), blank=True)

    def __str__(self):
        return self.title

    def is_active(self):
        if self.active_until < datetime.now() > self.active_from:
            return True
        else:
            return False
    is_active.boolean = True
    is_active.short_description = _("Active")

    class Meta:
        verbose_name = _("Advert")
        verbose_name_plural = _("Adverts")
        ordering = ["title"]


class AdvertiserEvent(models.Model):
    title = models.CharField(_("Title"),
                             max_length=60,
                             blank=False,
                             validators=[
                                 validators.URLValidator(schemes=["http", "https"])
                             ])

    link = models.URLField(_("Link"),
                           blank=False)

    time_updated = models.DateTimeField(_("Updated at"),
                                        auto_now=True,
                                        auto_now_add=False)

    time_created = models.DateTimeField(_("Created at"),
                                        auto_now=False,
                                        auto_now_add=True)

    date_start = models.DateField(_("Start date"), blank=False)

    date_end = models.DateField(_("End date"), blank=False)

    advertiser = models.ForeignKey(Advertiser,
                                   on_delete=models.CASCADE,
                                   verbose_name=_("Advertiser"))

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Advertiser event")
        verbose_name_plural = _("Advertiser events")
        ordering = ["-date_start"]
