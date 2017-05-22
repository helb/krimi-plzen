from django.test import TestCase
from .models import Article, slug_date_format
from sampledata.helper import SampleData
import datetime
import json

sd = SampleData(seed=str(datetime.datetime.now()))


class ArticleTestCase(TestCase):
    def setUp(self):
        self.article1 = Article.objects.create(
            title="Test article",
            intro=sd.words(10, 20),
            content={"text": sd.paragraph()}
        )
        self.article2 = Article.objects.create(
            title="Test article",
            intro=sd.words(10, 20),
            content={"text": sd.paragraph()}
        )

    def tearDown(self):
        self.article1.delete()
        self.article2.delete()

    def test_article_is_saved(self):
        """Article is saved in DB."""
        self.assertIsInstance(self.article1, Article)

    def test_creation_ts_is_saved(self):
        """Creation timestamp is correctly saved."""
        self.assertIsInstance(self.article1.time_created,
                              datetime.datetime)

    def test_correct_slug_is_created(self):
        """Unique slug is created from the title. Timestamp is added when a slug already exists."""
        self.assertEqual(self.article1.slug, "test-article")
        self.assertEqual(self.article2.slug,
                         "test-article" + self.article2.time_created.strftime(slug_date_format))

    def test_new_article_is_published(self):
        """Article is published after creation."""
        self.assertEqual(self.article1.is_published(), True)

    def test_article_can_be_serialized_to_dict(self):
        """Article can be serialized to dict."""
        s_dict = self.article1.serialize_teaser_fields()
        self.assertIsInstance(s_dict, dict)

    def test_article_can_be_serialized_to_json(self):
        """Article can be serialized to valid JSON."""
        s_json = json.dumps(self.article1.serialize_teaser_fields())
        self.assertIsInstance(json.loads(s_json), dict)
