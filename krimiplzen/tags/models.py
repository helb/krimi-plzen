from django.db import models
from django.core import validators
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver


class Tag(models.Model):
    slug = models.SlugField(unique=True,
                            primary_key=True,
                            blank=False)
    title = models.CharField(_("Title"),
                             max_length=20,
                             blank=False,
                             validators=[
        validators.MinLengthValidator(3)
    ])
    display_in_menu = models.BooleanField(_("Display in top bar"), default=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ["title"]


@receiver(models.signals.pre_save, sender=Tag)
def before_tag_save(sender, instance, **kwargs):
    if not instance.slug:
        slug = slugify(instance.title)
        instance.slug = slug
    instance.full_clean()
