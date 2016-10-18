from celery.decorators import task, periodic_task
from celery.utils.log import get_task_logger
from datetime import timedelta
from cloudflare_v4 import CloudFlare
from django.conf import settings
import re

logger = get_task_logger(__name__)


@task
def task_invalidate_cf(urls):
    full_urls = [re.sub("^", re.sub("/$", "", settings.BASE_URL), item) for item in urls]
    logger.info("Invalidating on CloudFlare:\n" + "\n".join(full_urls))
    cf = CloudFlare(settings.CF_EMAIL, settings.CF_KEY, settings.DEBUG)
    zone_id = cf.zones.get(params={"name": settings.CF_DOMAIN})[0]["id"]
    logger.info(cf.zones.purge_cache.delete(zone_id, data={"files": full_urls}))


@periodic_task(
    run_every=timedelta(hours=2),
    name="task_regenerate_poster_images",
    ignore_result=True
)
def task_regenerate_poster_images():
    logger.info("Regenerating…")
