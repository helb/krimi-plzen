Router.configure({
  layoutTemplate: 'masterLayout',
  // loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  trackPageView: true,
});

Router.map(function () {
  this.route('newArticles', {
    path: '/',
    waitOn: function () {
    if (Meteor.isClient) {
        if (!Session.get("currentLimit")) {
          Session.set("currentLimit", 3);
        };
        dateOffset = (24*60*60*1000) * Session.get("currentLimit");
        daysAgo = new Date();
        daysAgo.setTime(daysAgo.getTime() - dateOffset)
        daysAgo.setHours(0,0,0,0);
        return Meteor.subscribe('newArticles', daysAgo);
      }
    },
    cache: true,
    fastRender: true,
    data: function () {
      dateOffset = (24*60*60*1000) * Session.get("currentLimit");
        daysAgo = new Date();
        daysAgo.setTime(daysAgo.getTime() - dateOffset)
        daysAgo.setHours(0,0,0,0);
      templateData = {
        articles: Articles.find({
          'timestamp': {$gte: daysAgo}
        }, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Nejnovější články – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    },
  });

  this.route('redakce', {
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Redakce – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    },
  });

  this.route('kontakt', {
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Kontakt – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    }
  });

  this.route('archiv', {
    path: '/archiv',
    waitOn: function () {
      if (!Meteor.isClient) {
        return;
      }
      if (!Session.get("currentLimit")) {
        Session.set("currentLimit", 3);
      }
      if (!Session.get("archiveSince")) {
        dateOffset = (24*60*60*1000) * (Session.get("currentLimit") + 2);
        daysAgo = new Date();
        daysAgo.setTime(daysAgo.getTime() - dateOffset);
        daysAgo.setHours(0,0,0,0);
        Session.set("archiveSince", daysAgo);
      };
      if (!Session.get("archiveUntil")) {
        dateOffset = (24*60*60*1000) * Session.get("currentLimit");
        daysAgo = new Date();
        daysAgo.setTime(daysAgo.getTime() - dateOffset);
        daysAgo.setHours(23,59,59,999);
        Session.set("archiveUntil", daysAgo);
      };
      return Meteor.subscribe('archiveArticles', Session.get('archiveSince'), Session.get('archiveUntil'));
    },
    cache: true,
    fastRender: true,
    data: function () {
      templateData = {
        articles: Articles.find({
          'timestamp': {$gte: Session.get('archiveSince'), $lte: Session.get('archiveUntil')}
        }, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Archiv – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    },
  });

  this.route('weaponArticles', {
    path: '/zbrane',
    waitOn: function () {
      return Meteor.subscribe('weaponArticles', 99);
    },
    cache: true,
    fastRender: true,
    data: function () {
      templateData = {
        articles: Articles.find({
          'category': 'z'
        }, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Zbraně – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    }
  });

    this.route('minimumUliceArticles', {
    path: '/pravni-minimum-ulice',
    waitOn: function () {
      return Meteor.subscribe('minimumUliceArticles', 99);
    },
    cache: true,
    fastRender: true,
    data: function () {
      templateData = {
        articles: Articles.find({
          'category': 'pravni-minimum-ulice'
        }, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Právní minimum ulice – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    }
  });

        this.route('zachranariArticles', {
    path: '/zachranari',
    waitOn: function () {
      return Meteor.subscribe('zachranariArticles', 99);
    },
    cache: true,
    fastRender: true,
    data: function () {
      templateData = {
        articles: Articles.find({
          'category': 'zachranari'
        }, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Záchranáři – Krimi Plzeň"
      });
      // GAnalytics.pageview();
    }
  });

  this.route('articleShow', {
    path: '/a/:slug',
    waitOn: function () {
      return Meteor.subscribe('article', this.params.slug);
    },
    fastRender: true,
    data: function () {
      templateData = {
        article: Articles.findOne({
          slug:  this.params.slug
        })
      };
      return templateData;
    },
    onAfterAction: function () {
      var article;
      if (!Meteor.isClient) {
        return;
      }
      article = this.data().article;
      if(typeof article != 'undefined'){
        SEO.set({
          title: article.title + " – Krimi Plzeň",
          meta: {
            'description': article.intro
          },
          og: {
            'title': article.title,
            'description': article.intro,
            'image': article.photo_url.replace("_q.jpg", "_b.jpg"),
            'updated_time': Math.floor(article.timestamp.getTime() / 1000)
          }
        });
      }
      // GAnalytics.pageview();
      $("html, body").animate({ scrollTop: $("#content").offset().top }, 600);
    }
  });

  this.route('adminArticleAdd', {
    path: '/admin/article/add',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      }
    }
  });

  this.route('adminArticleList', {
    path: '/admin/article',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      }
    },
    waitOn: function () {
      return Meteor.subscribe('adminArticleList', 15);
    },
    data: function () {
      templateData = {
        articles: Articles.find({}, {
          sort: {
            timestamp: -1
          }
        })
      };
      return templateData;
    },
  });

  this.route('adminArticleEdit', {
    path: '/admin/article/:slug',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      }
    },
    waitOn: function () {
      return Meteor.subscribe('article', this.params.slug);
    },
    data: function () {
      templateData = {
        article: Articles.findOne({
          slug:  this.params.slug
        })
      };
      return templateData;
    }
  });

  this.route('adminIndex', {
    path: '/admin/',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      this.redirect('/admin/article');
    }
  });

  this.route('a', {
    path: '/a',
    onBeforeAction: function () {
      this.redirect('/');
    }
  });

});