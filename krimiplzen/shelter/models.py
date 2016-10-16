from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from sorl.thumbnail import ImageField

categories = (
    ("dog", _("Dogs")),
    ("cat", _("Cats")),
)


class Animal(models.Model):
    id = models.IntegerField(primary_key=True)
    text = models.CharField(_("Text"), max_length=320)
    link = models.CharField(_("Link"), max_length=256)
    photo = ImageField(_("Animal photo"), blank=False, upload_to="animals/")
    time_created = models.DateTimeField(_("Created at"),
                                        auto_now=False,
                                        auto_now_add=True)
    category = models.CharField(_("Category"),
                                max_length=8,
                                choices=categories)
    is_visible = models.BooleanField(_("Visible"), default=True)

    def __str__(self):
        category_dict = dict(categories)
        return category_dict[self.category] + " – " + str(self.id)

    class Meta:
        verbose_name = _("Shelter animal")
        verbose_name_plural = _("Shelter animals")
        unique_together = ("id", "category")


@receiver(models.signals.pre_save, sender=Animal)
def before_animal_save(sender, instance, **kwargs):
    instance.full_clean()
