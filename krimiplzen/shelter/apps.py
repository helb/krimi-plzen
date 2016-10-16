from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class ShelterConfig(AppConfig):
    name = "shelter"
    verbose_name = _("Animal shelter")
