Router.configure({
  layoutTemplate: 'masterLayout',
  // loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.map(function () {
  this.route('newArticles', {
    path: '/',
    waitOn: function () {
      return Meteor.subscribe('newArticles', 12);
    },
    cache: true,
    fastRender: true,
    data: function () {
      if (!Session.get("currentLimit")) {
        Session.set("currentLimit", 12);
      };
      templateData = {
        articles: Articles.find({}, {
          sort: {
            timestamp: -1
          },
          limit: Session.get('currentLimit')
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
      GAnalytics.pageview();
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
      GAnalytics.pageview();
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
      GAnalytics.pageview();
    }
  });

  this.route('archiv', {
    path: '/archiv',
    // waitOn: function () {
    //   return Meteor.subscribe('archiveArticles');
    // },
    cache: true,
    fastRender: true,
    data: function () {
      if (!Session.get("archiveSince")) {
        dateOffset = (24*60*60*1000) * 6;
        SixDaysAgo = new Date();
        SixDaysAgo.setTime(SixDaysAgo.getTime() - dateOffset);
        SixDaysAgo.setHours(0,0,0,0);
        Session.set("archiveSince", SixDaysAgo);
      };
      if (!Session.get("archiveUntil")) {
        dateOffset = (24*60*60*1000) * 3;
        ThreeDaysAgo = new Date();
        ThreeDaysAgo.setTime(ThreeDaysAgo.getTime() - dateOffset);
        ThreeDaysAgo.setHours(0,0,0,0);
        Session.set("archiveUntil", ThreeDaysAgo);
      };
      Meteor.subscribe('archiveArticles', Session.get('archiveSince'), Session.get('archiveUntil'));
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
      GAnalytics.pageview();
    },
  });

  this.route('weaponArticles', {
    path: '/zbrane',
    waitOn: function () {
      return Meteor.subscribe('weaponArticles', 10);
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
      GAnalytics.pageview();
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
      $("html, body").animate({ scrollTop: $("#content").offset().top }, 600);
      GAnalytics.pageview();
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