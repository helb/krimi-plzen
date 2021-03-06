from .models import Article
from tags.models import Tag
from shelter.models import Animal
from adverts.models import Advert
from django.conf import settings
from django.shortcuts import render
from django.http import Http404
from django.db.models import Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from datetime import datetime, timedelta, date
from adverts.models import Advertiser
import calendar

header = {
    "header": {
        "tags": Tag.objects.filter(display_in_menu=True)
                           .annotate(article_count=Count("article"))
                           .order_by("-article_count")
    }
}


def get_calendar(d=date.today()):
    cal = calendar.Calendar()
    first_of_month = date(d.year, d.month, 1)
    last_of_month = calendar.monthrange(d.year, d.month)[1]
    days = []
    today = date.today()

    def get_next_month():
        if d.year > today.year:
            return None
        if d.year == today.year and d.month >= today.month:
            return None
        return date(d.year, d.month, last_of_month) + timedelta(days=1)

    for day in cal.itermonthdays(d.year, d.month):
        if day > 0:
            ds = date(d.year, d.month, day)
            days.append({
                "date": ds,
                "is_past": ds < today
            })
    return {
        "days": days,
        "first_weekday": first_of_month.strftime("%a").lower(),
        "prev": first_of_month - timedelta(days=1),
        "next": get_next_month()
    }


sidebar = {
    "sidebar": {
        "newsletter_form": settings.NEWSLETTER_FORM,
        "dogs": Animal.objects.filter(category="dog")[:5],
        "missing": Article.objects.filter(time_created__gte=datetime.now() -
                                          timedelta(days=settings.MISSING_PERSONS_DAYS))
                                  .filter(status="p")
                                  .filter(tags__slug__contains="patrani")[:5],
        "police": Article.objects.filter(status="p")
                                 .filter(tags__slug__contains="predstavujeme-polici"),
        "specials": Article.objects.filter(status="p")
                                   .filter(tags__slug__contains="special"),
        "similar": Article.objects.filter(time_created__gte=datetime.now() - timedelta(days=5))
                                 .filter(status="p")
                                 .order_by("?")[:5]
    }
}


def newest_articles(request):
    article_list = Article.objects.filter(status="p")
    paginator = Paginator(article_list, settings.ARTICLES_PER_PAGE)
    page = request.GET.get("p")
    title = "Nejnovější články"

    try:
        articles = paginator.page(page)
        title = "Články – strana " + page
        if page == "1":
            title = "Nejnovější články"
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        articles = paginator.page(1)
        title = "Nejnovější články"
        page = 1
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        articles = paginator.page(paginator.num_pages)
        title = "Články – strana " + str(paginator.num_pages)
        page = paginator.num_pages

    context = dict({
        "show": {
            "dogs": True
        },
        "articles": articles,
        # "year_ago": Article.objects.filter(time_created__gte=datetime.now() - timedelta(days=368))
        # .filter(time_created__lte=datetime.now() - timedelta(days=363))
        # .filter(status="p")
        # .order_by("?")[:5],
        "partners": Advertiser.objects.filter(display_on_frontpage=True),
        "title": title,
        "page": page,
        "calendar": get_calendar(),
        "adverts": {
            "article_list_partner_box_middle": Advert.objects
                                                     .filter(position__slug="article-list-partner-box-middle")
                                                     .order_by("?")[:1],
            "article_list_partner_box_middle2": Advert.objects
                                                      .filter(position__slug="article-list-partner-box-middle2")
                                                      .order_by("?")[:1],
            "sidebar_top": Advert.objects.filter(position__slug="sidebar-top")
                                         .order_by("?")[:1],
            "sidebar_middle": Advert.objects.filter(position__slug="sidebar-middle")
                                         .order_by("?")[:1],
            "sidebar_bottom": Advert.objects.filter(position__slug="sidebar-bottom")
                                         .order_by("?")[:1]
        }
    }, **sidebar, **header)
    return render(request, "articles/list.html", context)


def tagged_articles(request, tag_slug):
    article_list = Article.objects.filter(
        status="p", tags__slug__contains=tag_slug)
    paginator = Paginator(article_list, settings.ARTICLES_PER_PAGE)
    page = request.GET.get("p")
    tag_title = Tag.objects.get(pk=tag_slug).title
    title = tag_title

    try:
        articles = paginator.page(page)
        title = tag_title + " – strana " + page
        if page == "1":
            title = tag_title
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        articles = paginator.page(1)
        title = tag_title
        page = 1
    except EmptyPage:
        # If page is out of range (e.g. 9999), deliver last page of results.
        articles = paginator.page(paginator.num_pages)
        title = tag_title + " – strana " + str(paginator.num_pages)
    context = dict({
        "show": {
            "similar": True
        },
        "articles": articles,
        "title": title,
        "tag_slug": tag_slug,
        "calendar": get_calendar(),
        "page": page,
        "adverts": {
            "article_list_partner_box_middle": Advert.objects
                                                     .filter(position__slug="article-list-partner-box-middle")
                                                     .order_by("?")[:1],
            "article_list_partner_box_middle2": Advert.objects
                                                      .filter(position__slug="article-list-partner-box-middle2")
                                                      .order_by("?")[:1],
            "sidebar_top": Advert.objects.filter(position__slug="sidebar-top")
                                         .order_by("?")[:1],
            "sidebar_middle": Advert.objects.filter(position__slug="sidebar-middle")
                                         .order_by("?")[:1],
            "sidebar_bottom": Advert.objects.filter(position__slug="sidebar-bottom")
                                         .order_by("?")[:1],
        }
    }, **sidebar, **header)
    return render(request, "articles/list.html", context)


def article_detail(request, article_slug):
    try:
        article = Article.objects.get(pk=article_slug, status__in=["p", "a"])
        context = dict({
            "show": {
                "similar": True
            },
            "article": article,
            "calendar": get_calendar(),
            "similar": Article.objects.filter(time_created__gte=datetime.now() - timedelta(days=30))
            .filter(status="p")
            .exclude(pk=article_slug)
            .exclude(tags__slug__contains="nehoda")
            .order_by("?")[:5],
            "adverts": {
                "article_partner_box_bottom": Advert.objects
                                                    .filter(position__slug="article-partner-box-bottom")
                                                    .order_by("?")[:1],
                "sidebar_top": Advert.objects.filter(position__slug="sidebar-top")
                .order_by("?")[:1],
                "sidebar_middle": Advert.objects.filter(position__slug="sidebar-middle")
                .order_by("?")[:1],
                "sidebar_bottom": Advert.objects.filter(position__slug="sidebar-bottom")
                .order_by("?")[:1],
                "article_attached_partner": Advert.objects.filter(position__slug="article-partner",
                                                                  advertiser=article.advertiser)[:1],
            }
        }, **sidebar, **header)
    except Article.DoesNotExist:
        raise Http404("Does not exist.")
    return render(request, "articles/detail.html", context)


def archive_articles(request, year, month, day):
    try:
        ds = date(year, month, day)
    except ValueError:
        raise Http404("No archived articles from the future.")

    def get_next_day():
        if ds >= date.today():
            return None
        else:
            return ds + timedelta(days=+1)

    articles = Article.objects.filter(status="p",
                                      time_published__year=year,
                                      time_published__month=month,
                                      time_published__day=day)

    title = f"Archiv {day}. {month}. {year}"

    context = dict({
        "show": {
            "similar": True
        },
        "articles": articles,
        "title": title,
        "archive_days": {
            "current": ds,
            "previous": ds + timedelta(days=-1),
            "next": get_next_day()
        },
        "adverts": {
            "article_list_partner_box_middle": Advert.objects
                                                     .filter(position__slug="article-list-partner-box-middle")
                                                     .order_by("?")[:1],
            "article_list_partner_box_middle2": Advert.objects
                                                      .filter(position__slug="article-list-partner-box-middle2")
                                                      .order_by("?")[:1],
            "sidebar_top": Advert.objects.filter(position__slug="sidebar-top")
                                         .order_by("?")[:1],
            "sidebar_middle": Advert.objects.filter(position__slug="sidebar-middle")
                                         .order_by("?")[:1],
            "sidebar_bottom": Advert.objects.filter(position__slug="sidebar-bottom")
                                         .order_by("?")[:1],
        },
        "calendar": get_calendar(date(year, month, day))
    }, **sidebar, **header)
    return render(request, "articles/list.html", context)
