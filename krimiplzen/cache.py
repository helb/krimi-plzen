import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "krimiplzen.settings")
django.setup()
from django.core.cache import cache
cache.clear()

