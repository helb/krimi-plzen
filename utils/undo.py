import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "krimiplzen.settings")
django.setup()
import tempfile
import json
import re
import requests
from django.utils.text import slugify

from django.conf import settings
from articles.models import Article

from django.core.files.images import ImageFile
from django.core.exceptions import ValidationError

titles = []
for line in open("/home/helb/tmp/undo2.txt", "r"):
    titles.append(re.sub(" ?[-–] ?$", "", (re.sub("^ ?[,+: ]{1,} ?", "", re.sub("(FOTO|VIDEO|AKTUALIZOVÁNO|AKTUALIZUJEME|AKTUALIZACE|AKTUAL|AKTUÁLNĚ|GALERIE|FOTOGALERIE)", "", line.rstrip("\n"))))))

for title in titles:
    # print("--" + title + "--")
    try:
        article = Article.objects.get(title=title)
        article.cover_photo = ""
        article.save()
    except:
        print(title)
