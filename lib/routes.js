Router.configure({
  layoutTemplate: 'masterLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  trackPageView: true
});

var listSubs = new SubsManager({
    cacheLimit: 9999,
    expireIn: 9999
});

var articleSubs = new SubsManager({
    cacheLimit: 20,
    expireIn: 10
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
        return listSubs.subscribe('newArticles', daysAgo);
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
      Meta.setTitle("Nejnovější články");
      Meta.set("og:title", "Krimi Plzeň");
      Meta.set("og:image", "https://farm4.staticflickr.com/3944/15100277064_bfc4f18108_o.png");
      Meta.set("og:description", "Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    },
    fastRender: true
  });

  this.route('redakce', {
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      Meta.setTitle("Redakce");
      // GAnalytics.pageview();
    }
  });


  this.route('kontakt', {
    onAfterAction: function () {
      if (!Meteor.isClient) {
        return;
      }
      Meta.setTitle("Kontakt");
      // GAnalytics.pageview();
    },
    fastRender: true
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
      return listSubs.subscribe('archiveArticles', Session.get('archiveSince'), Session.get('archiveUntil'));
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
      Meta.setTitle("Archiv");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    }
  });

  this.route('weaponArticles', {
    path: '/zbrane',
    waitOn: function () {
      return listSubs.subscribe('weaponArticles', 99);
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
      Meta.setTitle("Zbraně");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    }
  });

    this.route('minimumUliceArticles', {
    path: '/pravni-minimum-ulice',
    waitOn: function () {
      return listSubs.subscribe('minimumUliceArticles', 99);
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
      Meta.setTitle("Právní minimum ulice");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    }
  });

  this.route('zachranariArticles', {
    path: '/zachranari',
    waitOn: function () {
      return listSubs.subscribe('zachranariArticles', 99);
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
      Meta.setTitle("Záchranáři");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    }
  });


  this.route('hasiciArticles', {
    path: '/hasici',
    waitOn: function () {
      return listSubs.subscribe('hasiciArticles', 99);
    },
    cache: true,
    fastRender: true,
    data: function () {
      templateData = {
        articles: Articles.find({
          'category': 'hasici'
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
      Meta.setTitle("Hasiči");
      Meta.set("viewport", "width=device-width, initial-scale=1.0")
      // GAnalytics.pageview();
    }
  });


  this.route('articleShow', {
    path: '/a/:slug',
    waitOn: function () {
      return articleSubs.subscribe('article', this.params.slug);
    },
    fastRender: true,
    cache: true,
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
        if(typeof article.photo_url != 'undefined'){
          photo_url = article.photo_url.replace("_q.jpg", "_b.jpg");
        } else {
          photo_url = "https://farm4.staticflickr.com/3921/15159532768_129e15feb2_o.jpg";
        }
        Meta.setTitle(article.title);
        Meta.set("og:title", article.title);
        Meta.set("description", article.intro);
        Meta.set("og:description", article.intro);
        Meta.set("og:image", article.photo_url.replace("_q", "_b"));
        Meta.set("og:updated_time", Math.floor(article.timestamp.getTime() / 1000));
        Meta.set("viewport", "width=device-width, initial-scale=1.0")
      }
      /* else {
        this.render("notFound");
      }*/
    }
  });

  this.route('adminArticleAdd', {
    path: '/admin/article/add',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      } else {
        this.next();
      }
    },
    trackPageView: false
  });

  this.route('adminArticleList', {
    path: '/admin/article',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      } else {
        this.next();
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
    trackPageView: false
  });

  this.route('adminArticleEdit', {
    path: '/admin/article/:slug',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      if (!Meteor.userId()) {
        this.redirect('/');
      } else {
        this.next();
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
    },
    trackPageView: false
  });

  this.route('adminIndex', {
    path: '/admin/',
    layoutTemplate: 'adminLayout',
    onBeforeAction: function () {
      this.redirect('/admin/article');
    },
    trackPageView: false
  });

  this.route('a', {
    path: '/a',
    onBeforeAction: function () {
      this.redirect('/');
    }
  });

});
