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

articles = Article.objects.filter(cover_photo="")

data = []
for line in open("/home/helb/tmp/krimi_2016-10-14_16-43/krimi/articles.bson.json", "r"):
    data.append(json.loads(line))

for article in articles:
    for line in data:
        if line["slug"] == article.slug:
            article_json = line
    print("-------------------------")
    print("> "+ article_json["title"])

    if "photo_url" in article_json and isinstance(article_json["photo_url"], str):
        photo_link = re.sub("_q.jpg", "_b.jpg", re.sub("^//", "https://", article_json["photo_url"]))
    else:
        photo_link = "http://static2.krimi-plzen.cz/media/foto/old/kp.jpg"

    photo_r = requests.get(photo_link)
    if photo_r.status_code == requests.codes.ok:
        file_name = re.sub(r"jpe?g$", ".jpg", slugify(photo_link.split("/")[-1]))
        lf = tempfile.SpooledTemporaryFile(dir=settings.TEMPDIR)
        for block in photo_r.iter_content(1024 * 8):
            if not block:
                break
            lf.write(block)
        try:
            article.cover_photo = ImageFile(name=file_name, file=lf)
            article.save()
        except ValidationError:
            logger.info("ERR")
    else:
        print("Error fetching photo.")
