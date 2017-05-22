import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "krimiplzen.settings")
django.setup()

import json
import re
import datetime
import requests
from django.conf import settings
from articles.models import Article, Sticker
from tags.models import Tag
from django.core.files.images import ImageFile
from django.core.exceptions import ValidationError

data = []
for line in open("/home/helb/tmp/krimi_2016-10-14_16-43/krimi/articles.bson.json", "r"):
    data.append(json.loads(line))

print("Importing " + str(len(data)) + " articles.")

for article_json in data:
    try:
        art = Article.objects.get(slug=article_json["slug"])
    except Article.DoesNotExist:
        content = ""
        if "youtube_url" in article_json and isinstance(article_json["youtube_url"], str):
            content += "<iframe src='//www.youtube-nocookie.com/embed/" + \
                article_json["youtube_url"] + "'></iframe>"
        content += re.sub(" {2,}", " ", re.sub("(&nbsp; ?)",
                                               "", article_json["text"]))

        author_name = None
        if "author_name" in article_json and isinstance(article_json["author_name"], str):
            author_name = article_json["author_name"]

        photo_filenames = []
        if "photos" in article_json:
            gallery_html = "<div class='gallery'>\n"
            # photoset_r = requests.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=6a672cfb0a2bc5ab43e6086234ff720c&photoset_id=" +
            #                           article_json["photoset"] + "&user_id=124879138%40N07&format=json&nojsoncallback=1")
            # print(photoset_r.text)
            # photoset_j = json.loads(photoset_r.text)

            # if "photoset" in photoset_j:
            for photo in article_json["photos"]:
                # print(photo)
                # photo_r = requests.get("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6a672cfb0a2bc5ab43e6086234ff720c&photo_id=" +
                                    #    photo["id"] + "&user_id=124879138%40N07&format=json&nojsoncallback=1")
                # photo_url = json.loads(photo_r.text)["sizes"]["size"][-1]["source"]
                photo_filenames.append(re.sub(".*/", "", photo))

            for filename in photo_filenames:
                gallery_html += "  <img src='" + settings.MEDIA_URL + \
                    "foto/old/" + filename + "_b.jpg' />\n"

            gallery_html += "</div>"
            content += gallery_html

        timestamp = datetime.datetime.strptime(
            re.sub("\..*", "", article_json["timestamp"]["$date"]), "%Y-%m-%dT%H:%M:%S")

        cover_path = ""
        if len(photo_filenames) > 1:
            cover_path = os.path.join(
                settings.MEDIA_ROOT, "foto/old/" + photo_filenames[0])

        title = re.sub(" ?[-–] ?$", "", (re.sub("^ ?[,+: ]{1,} ?", "", re.sub("(FOTO|VIDEO|AKTUALIZOVÁNO|AKTUALIZUJEME|AKTUALIZACE|AKTUAL|AKTUÁLNĚ|GALERIE|FOTOGALERIE)", "", article_json["title"]))))


        if os.path.isfile(cover_path):
            article = Article.objects.create(
                title=title,
                slug=article_json["slug"],
                intro=article_json["intro"],
                content=content,
                time_created=timestamp,
                time_updated=timestamp,
                author_name=author_name,
                cover_photo=ImageFile(name=photo_filenames[0], file=open(cover_path, "rb"))
            )
        else:
            article = Article.objects.create(
                title=title,
                slug=article_json["slug"],
                intro=article_json["intro"],
                content=content,
                time_created=timestamp,
                time_updated=timestamp,
                author_name=author_name,
            )

        if re.match(".*VIDEO.*", article_json["title"]):
            sticker = Sticker.objects.get(pk=2)
            article.stickers.add(sticker)

        if re.match(".*(FOTO|GALERIE|FOTOGALERIE).*", article_json["title"]):
            sticker = Sticker.objects.get(pk=3)
            article.stickers.add(sticker)

        if re.match(".*(nehod|boural|řidič|střet).*", article_json["title"], re.IGNORECASE):
            article.tags.add(Tag.objects.get(pk="nehoda"))

        if re.match(".*(dálnic|dálniční|D5).*", article_json["title"], re.IGNORECASE):
            article.tags.add(Tag.objects.get(pk="dalnice"))

        if re.match(".*(drog|feťák|marih|pervi|heroin|stříkačk).*", article_json["title"], re.IGNORECASE):
            article.tags.add(Tag.objects.get(pk="drogy"))

        if re.match(".*(opil|alkohol|promile).*", article_json["title"], re.IGNORECASE):
            article.tags.add(Tag.objects.get(pk="alkohol"))

        if re.match(".*(požár|hořel|oheň|hasiči).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "hasici":
            article.tags.add(Tag.objects.get(pk="hasici"))

        if re.match(".*(horská|horské|horskou|sjezdovk|lyžař|snowboard).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "mountains":
            article.tags.add(Tag.objects.get(pk="horska-sluzba"))

        if re.match(".*(právní|právo).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "pravni-minimum-ulice":
            article.tags.add(Tag.objects.get(pk="pravo"))

        if re.match(".*(záchran|vrtulník|helikoptér|sanitka).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "zachranari":
            article.tags.add(Tag.objects.get(pk="zachranari"))

        if re.match(".*(zbran|zbraň|munice|střel|stříl|revolver|pistol|samopal|granát).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "z":
            article.tags.add(Tag.objects.get(pk="zbrane"))

        if re.match(".*(pátr).*", article_json["title"], re.IGNORECASE) or article_json.get("category") == "o":
            article.tags.add(Tag.objects.get(pk="patrani"))
