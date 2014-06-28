/*Router.configure({
  layoutTemplate: 'layout'
});
*/

Router.configure({
    layoutTemplate: 'masterLayout',
    // loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.map(function() {
  this.route('newArticles', {
  	path: '/',
  	waitOn: function() {
      return Meteor.subscribe('newArticles', 5);
    },
    cache: true,
    fastRender:true,
  	data: function() {
    	templateData = { articles: Articles.find({}, {sort: {timestamp:-1}}) };
    	return templateData;
  	},
    onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Nejnovější články – Krimi Plzeň"
      });
    },
    trackPageView: true
  });


  this.route('redakce', {
    onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
          title: "Redakce – Krimi Plzeň"
      });
    },
    trackPageView: true
  });

  this.route('kontakt', {
    onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Kontakt – Krimi Plzeň"
      });
    },
    trackPageView: true
  });

  this.route('archiv', {
    template: 'notFound',
    trackPageView: true
  });

  this.route('weaponArticles', {
    path: '/zbrane',
    waitOn: function() {
      return Meteor.subscribe('weaponArticles', 5);
    },
    cache: true,
    fastRender:true,
    data: function() {
      templateData = { articles: Articles.find({'category': 'z'}, {sort: {timestamp:-1}}) };
      return templateData;
    },
    onAfterAction: function() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: "Zbraně – Krimi Plzeň"
      });
    },
    trackPageView: true
  });

  this.route('articleShow', {
  		path: '/a/:slug',
  		waitOn: function() {
      	return Meteor.subscribe('article', this.params.slug);
    	},
    	fastRender: true,
  		data: function() {
  			templateData = { article: Articles.findOne({slug: this.params.slug}) };
    		return templateData;
    	},
      onAfterAction: function() {
        var article;
        if (!Meteor.isClient) {
          return;
        }
        article = this.data().article;
        SEO.set({
          title: article.title + " – Krimi Plzeň",
          meta: {
            'description': article.intro
          },
          og: {
            'title': article.title,
            'description': article.intro,
            'image': article.photo_url.replace("_q.jpg", "_b.jpg"),
            'updated_time': Math.floor(article.timestamp.getTime()/1000)
          }
        });
      },
    trackPageView: true
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
        waitOn: function() {
          return Meteor.subscribe('adminArticleList', 15);
        },
        data: function() {
          templateData = { articles: Articles.find({}, {sort: {timestamp:-1}}) };
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
      waitOn: function() {
        return Meteor.subscribe('article', this.params.slug);
      },
      data: function() {
        templateData = { article: Articles.findOne({slug: this.params.slug}) };
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


/*  this.route('adminArticleEdit', {
        path: '/admin/a/:slug',
        layoutTemplate: 'adminLayout',
        onBeforeAction: function (pause) {
          if (!Meteor.user()) {
            this.render('notFound');
          }
        },
        data: function() {
          templateData = { articles: Articles.find({}, {sort: {timestamp:-1}}) };
          return templateData;
    }
  });*/
});