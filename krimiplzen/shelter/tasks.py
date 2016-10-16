from .models import Animal
from celery.decorators import periodic_task, task
from datetime import timedelta
from celery.utils.log import get_task_logger
from django.conf import settings
from django.core.files.images import ImageFile
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from html import unescape
import tempfile
import re
import requests
import xml.etree.ElementTree as ET
import os

logger = get_task_logger(__name__)


@task
def task_save_animal(rssitem, category):
    animal_id = int(rssitem[0].text.split(" ")[0])

    if Animal.objects.filter(id=animal_id).count() > 0:
        logger.info("Animal exists - " + category + " " + str(animal_id))
    else:
        animal_link = rssitem[1].text
        animal_text = unescape(rssitem[7].text)
        photo_link = re.sub(r".*src=\"", "", rssitem[8].text.replace("\r", "").replace("\n", ""))
        photo_link = re.sub(r"jpg\".*", "jpg", photo_link)
        if photo_link.startswith("http"):
            photo_r = requests.get(photo_link)
            if photo_r.status_code == requests.codes.ok:
                file_name = re.sub(r"jpe?g$", ".jpg", slugify(photo_link.split("/")[-1]))
                lf = tempfile.SpooledTemporaryFile(dir=settings.TEMPDIR)
                for block in photo_r.iter_content(1024 * 8):
                    if not block:
                        break
                    lf.write(block)
                try:
                    animal = Animal.objects.create(
                        id=animal_id,
                        link=animal_link,
                        text=animal_text,
                        category=category,
                        photo=ImageFile(name=file_name, file=lf)
                    )
                    animal.save()
                except ValidationError:
                    logger.info("Animal exists - " + category + " " + str(animal_id))
                else:
                    logger.info("Animal saved  - " + category + " " + str(animal_id))
            else:
                logger.info("Photo fetch failed  - " + category + " " + str(animal_id))
        else:
            logger.info("Photo fetch failed  - invalid URL parsed – " + category + " " + str(animal_id))


@periodic_task(
    run_every=timedelta(hours=1),
    name="task_update_shelter_animals",
    ignore_result=True
)
def task_update_shelter_animals():
    saved_count = 0
    for category in settings.SHELTER_URLS:
        try:
            r = requests.get(settings.SHELTER_URLS[category])
            r.encoding = "utf-8"
            rss_root = ET.fromstring(r.text)
            for item in rss_root[0].iter("item"):
                task_save_animal(item, category)
        except:
            logger.info("Connection failed")
