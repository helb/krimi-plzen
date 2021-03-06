from django.db import models
from django.conf import settings
from krimiplzen.settings import summernote_upload_to
from django.utils.translation import ugettext_lazy as _
from sorl.thumbnail import ImageField
from django.template.defaultfilters import slugify
from datetime import datetime
from django.core import validators
from krimiplzen.mixins import ModelDiffMixin
from tags.models import Tag
from adverts.models import Advertiser
from django.dispatch import receiver
from .tasks import task_invalidate_cf
from sorl.thumbnail import get_thumbnail
import re

slug_date_format = settings.SLUG_DATE_FORMAT

title_regex = "^(?:(?!FOTO|FOTKY|VIDEO|AKTU).)*$"
color_regex = "^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"

article_states = (
    ("p", _("Published")),
    ("a", _("Accessible")),
    ("x", _("Inacessible")),
)


def serialize_field(field):
    serialized_field = field
    if isinstance(field, datetime):
        serialized_field = field.isoformat()
    return serialized_field


class Sticker(models.Model):
    title = models.CharField(_("Title"),
                             max_length=20,
                             blank=False,
                             validators=[
        validators.MinLengthValidator(3)
    ])
    color = models.CharField(_("Color"),
                             max_length=6,
                             blank=False,
                             validators=[
        validators.RegexValidator(color_regex)
    ])
    hide_after = models.IntegerField(_("Hide after"),
                                     blank=True,
                                     null=True,
                                     help_text=_("Number of hours from the "
                                                 "latest article update when"
                                                 "the sticker is visible."),
                                     validators=[
        validators.MinValueValidator(1)
    ])
    is_public = models.BooleanField(_("Display on website"), default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Sticker")
        verbose_name_plural = _("Stickers")
        ordering = ["title"]


class Article(ModelDiffMixin, models.Model):
    title = models.CharField(_("Title"),
                             max_length=200,
                             blank=False,
                             validators=[
        validators.MinLengthValidator(3),
        validators.RegexValidator(title_regex)
    ])

    intro = models.CharField(_("Introduction"),
                             max_length=720,
                             blank=True,
                             validators=[
        validators.MinLengthValidator(3)
    ])

    content = models.TextField(_("Content"), blank=False)

    slug = models.SlugField(unique=True,
                            primary_key=True,
                            max_length=200,
                            editable=False,
                            blank=False,
                            validators=[
                                validators.MinLengthValidator(3)
                            ])

    author = models.ForeignKey(settings.AUTH_USER_MODEL,
                               verbose_name=_("Author"),
                               null=True,
                               blank=True,
                               on_delete=models.SET_NULL,
                               editable=False)

    author_name = models.CharField(_("Author name"),
                                   max_length=60,
                                   blank=True,
                                   null=True,
                                   help_text=_("Displayed author name"))

    time_updated = models.DateTimeField(_("Updated at"),
                                        auto_now=True,
                                        auto_now_add=False)

    time_created = models.DateTimeField(_("Created at"),
                                        auto_now=False,
                                        auto_now_add=True)

    time_published = models.DateTimeField(_("Created at"),
                                          editable=False,
                                          null=True)

    status = models.CharField(_("Status"),
                              max_length=1,
                              choices=article_states,
                              default=article_states[0][0],
                              help_text=_("<b>Published</b> – appears on "
                                          "website<br><b>Accessible</b> – does"
                                          " not appear on website, but can be"
                                          "opened with URL or link<br><b>"
                                          "Inaccessible</b> – can't be opened,"
                                          " links result in 'Page not found'"))

    photo_cover = models.BooleanField(_("Photo cover"),
                                      default=False)

    advertiser = models.ForeignKey(Advertiser,
                                   verbose_name=_("Article partner"),
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   blank=True)

    tags = models.ManyToManyField(Tag,
                                  blank=True,
                                  verbose_name=_("Tags"))

    stickers = models.ManyToManyField(Sticker,
                                      blank=True,
                                      verbose_name=_("Stickers"))

    cover_photo = ImageField(_("Cover photo"), blank=False, upload_to=summernote_upload_to)

    def get_url(self):
        return "/a/" + self.slug

    def is_published(self):
        if self.status == "p":
            return True
        else:
            return False
    is_published.boolean = True
    is_published.short_description = _("Published")

    def is_accessible(self):
        if self.status == "a":
            return True
        else:
            return False
    is_accessible.boolean = True
    is_accessible.short_description = _("Accessible")

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        base_url_noslash = re.sub(r"/$", "", settings.BASE_URL)
        return f"{base_url_noslash}{self.get_url()}/"

    def dependent_paths(self):
        outdated_urls = []
        outdated_urls.append(self.get_absolute_url())
        outdated_urls.append("/")
        outdated_urls.append("/a/")
        outdated_urls.append("/rss/")
        for tag in self.tags.all():
            outdated_urls.append("/a/tag/" + tag.slug + "/")
            outdated_urls.append("/rss/" + tag.slug + "/")
        return outdated_urls

    class Meta:
        verbose_name = _("Article")
        verbose_name_plural = _("Articles")
        ordering = ["-time_created", "title"]
        get_latest_by = "time_created"

    def serialize_teaser_fields(self):
        send_on_creation = [
            "title",
            "intro",
            "author_name",
            "slug"
        ]
        serialized = {}
        for field in send_on_creation:
            serialized[field] = serialize_field(getattr(self, field))
        return serialized

    def serialize_updated_fields(self):
        serialized = {}
        for field in self.changed_fields:
            serialized[field] = getattr(self, field)
            return serialized

    def get_cover_thumbnail_url(self):
        thumb = get_thumbnail(re.sub(r"^//", "https://", self.cover_photo.url),
                              "200x200", crop="center", quality=95)
        return thumb.url


@receiver(models.signals.pre_save, sender=Article)
def before_article_save(sender, instance, **kwargs):
    if not instance.slug:
        slug = slugify(instance.title)
        try:
            Article.objects.get(slug=slug)
        except Article.DoesNotExist:
            instance.slug = slug
        else:
            instance.slug = slug + datetime.now().strftime(slug_date_format)
    if not instance.time_published and instance.status is "p":
        instance.time_published = datetime.now()
    instance.full_clean()


@receiver(models.signals.post_save, sender=Article)
def after_article_save(sender, instance, created, **kwargs):
    if not settings.DEBUG:
        pass
        # task_invalidate_cf.delay(instance.dependent_paths())
