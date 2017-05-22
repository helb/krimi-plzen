import os
import raven
import uuid
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = "!m0k^lhkzhg-re+#u3(_HAHAenNOPE_zhwf+pJEZEVEC(JEZEVEC4TRI8KUNYxm76z86h&xqc6%j-!%"
SITE_ID = 2
DEBUG = True

if not DEBUG:
    ALLOWED_HOSTS = ["www.krimi-plzen.cz"]
else:
    ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "django.contrib.redirects",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.humanize",
    "django_gulp",
    "django.contrib.staticfiles",
    "cachalot",
    "tags",
    "articles",
    "shelter",
    "adverts",
    "django_summernote",
    "daterange_filter",
    "raven.contrib.django.raven_compat",
    "sorl.thumbnail",
]


MIDDLEWARE_CLASSES = [
    "raven.contrib.django.raven_compat.middleware.Sentry404CatchMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.cache.UpdateCacheMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.cache.FetchFromCacheMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.redirects.middleware.RedirectFallbackMiddleware",
    "django.contrib.auth.middleware.SessionAuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "htmlmin.middleware.MarkRequestMiddleware"
]

CACHE_MIDDLEWARE_SECONDS = 30

if not DEBUG:
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_NAME = "krimi_csrf2"
    CSRF_COOKIE_DOMAIN = "www.krimi-plzen.cz"
    CSRF_COOKIE_DOMAIN = "localhost:8000"
    CSRF_TRUSTED_ORIGINS = ["www.krimi-plzen.cz"]

SESSION_ENGINE = "django.contrib.sessions.backends.cache"

ROOT_URLCONF = "krimiplzen.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "krimiplzen.wsgi.application"


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        # "ENGINE": "django.db.backends.postgresql",
        # "NAME": "krimi2",
        # "USER": "krimi",
        # "PASSWORD": "0KrimiPlzen0",
        # "CONN_MAX_AGE": None
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        }
    },
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "cs-cz"

TIME_ZONE = "Europe/Prague"

USE_I18N = True

USE_L10N = True

USE_TZ = False

SLUG_DATE_FORMAT = "-%Y-%m-%d-%H%M%S"

ARTICLES_PER_PAGE = 10
MISSING_PERSONS_DAYS = 90

HTML_MINIFY = not DEBUG


if not DEBUG:
    STATIC_BASE = "//static2.krimi-plzen.cz/"
else:
    STATIC_BASE = "http://localhost:8002/"

STATIC_URL = STATIC_BASE + "static/"
MEDIA_URL = STATIC_BASE + "media/"

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "assets"),
)
STATIC_BASE_DIR = "/home/helb/tmp/krimi_static/"
STATIC_ROOT = os.path.join(STATIC_BASE_DIR, "static")
MEDIA_ROOT = os.path.join(STATIC_BASE_DIR, "media")

DATA_UPLOAD_MAX_NUMBER_FIELDS = 5000

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://localhost:6379/1",
        "TIMEOUT": 300,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "MAX_ENTRIES": 2000
        }
    }
}

DUMPER_PATH_IGNORE_REGEX = r"^/(?:(?:admin)|(?:summernote))/"

TEST_RUNNER = "krimiplzen.testing.TestRunner"

# celery:
BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE


if not DEBUG:
    RAVEN_CONFIG = {
        "dsn": "http://fa59989c0f1d4dc384288f171a272199:cabc6ca77d9646d8bcabd5c7799995be@sentry.helb.cz/2",
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        "release": raven.fetch_git_sha(os.path.dirname(__file__) + "/../../")
    }

CF_EMAIL = "helb@helb.cz"
CF_KEY = "ca800a364971005da10eac7ef622e8078b78b"
CF_DOMAIN = "krimi-plzen.cz"
BASE_URL = "//www.krimi-plzen.cz/"
TEMPDIR = "/tmp/"


THUMBNAIL_KVSTORE = "sorl.thumbnail.kvstores.redis_kvstore.KVStore"
THUMBNAIL_BACKEND = "optisorl.backend.OptimizingThumbnailBackend"

SHELTER_URLS = {
    "dog": "http://utulekplzen.cz/category/aktualne-prijati-psi/feed/",
    "cat": "http://utulekplzen.cz/category/aktualne-prijate-kocky/feed/"
}


def summernote_upload_to(instance, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    today = datetime.now().strftime("%Y-%m-%d")
    return os.path.join("foto", today, filename)


def static_url(path):
    return STATIC_URL + path


SUMMERNOTE_CONFIG = {
    # Using SummernoteWidget - iframe mode
    # "iframe": False,  # or set False to use SummernoteInplaceWidget - no iframe mode

    # Using Summernote Air-mode
    "airMode": False,

    # Use native HTML tags (`<b>`, `<i>`, ...) instead of style attributes
    # (Firefox, Chrome only)
    "styleWithTags": True,

    # Set text direction : "left to right" is default.
    "direction": "ltr",

    # Change editor size
    "width": "100%",
    "height": "700",

    # Use proper language setting automatically (default)
    # "lang": None,

    # Or, set editor language/locale forcely
    "lang": "cs-CZ",

    # Customize toolbar buttons
    "toolbar": [
        ["misc", ["undo", "redo"]],
        ["misc", ["codeview"]],
        ["style", ["style"]],
        ["style", ["bold", "italic", "strikethrough", "clear"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["hr", "table"]],
        ["insert", ["link", "picture", "video", "article-link", "gallery"]]
    ],

    # Need authentication while uploading attachments.
    "attachment_require_authentication": True,

    # Set `upload_to` function for attachments.
    "attachment_upload_to": summernote_upload_to,


    # Set custom storage class for attachments.
    # "attachment_storage_class": "my.custom.storage.class.name",

    # Set custom model for attachments (default: "django_summernote.Attachment")
    # "attachment_model": "my.custom.attachment.model",
    #  must inherit "django_summernote.AbstractAttachment"

    # Set common css/js media files
    # "external_css": (
    #     "//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css",
    # ),
    # "external_js": (
    # "//cdnjs.cloudflare.com/ajax/libs/summernote/0.8.2/lang/summernote-cs-CZ.min.js",
    # "//code.jquery.com/jquery-1.9.1.min.js",
    # "//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js",
    # ),
    # "internal_css": (
    #     static_url("django_summernote/summernote.css"),
    # ),
    # "internal_js": (
    #     # static_url("django_summernote/jquery.ui.widget.js"),
    #     # static_url("django_summernote/jquery.iframe-transport.js"),
    #     # static_url("django_summernote/jquery.fileupload.js"),
    #     # static_url("django_summernote/summernote.min.js"),
    #
    # ),


    # # You can add custom css/js for SummernoteWidget.
    "css": (
        static_url("css/summernote.css"),
    ),
    "js": (
        static_url("js/summernote-gallery-plugin.js"),
        static_url("js/summernote-krimilink-plugin.js"),
    ),

    # And also for SummernoteInplaceWidget.
    # !!! Be sure to put {{ form.media }} in template before initiate summernote.
    # "css_for_inplace": (
    # ),
    # "js_for_inplace": (
    # ),

    # You can disable file upload feature.
    "disable_upload": False,
    "attachment_filesize_limit": 3 * 1024 * 1024

    # Codemirror as codeview
    # "codemirror": {
    #         # Please visit http://summernote.org/examples/#codemirror-as-codeview
    #         "theme": "monokai",
    # },

}
