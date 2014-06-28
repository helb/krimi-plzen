Meteor.publishAuth = function (name, fn) {
  Meteor.publish(name, function () {
    if (!this.userId)
      return this.ready();

    return fn.apply(this, arguments);
  });
};

Meteor.publish("newArticles", function (limit) {
  return Articles.find({
    'is_published':  true
  }, {
    sort: {
      timestamp: -1
    },
    limit: limit,
    fields:  {
      text: 0,
      photoset:  0,
      photoset_placement: 0,
      youtube_url:  0
    }
  });
});

Meteor.publish("weaponArticles", function (limit) {
  return Articles.find({
    'category': 'z',
    'is_published':  true
  }, {
    sort: {
      timestamp: -1
    },
    limit: limit,
    fields:  {
      text: 0,
      photoset:  0,
      photoset_placement: 0,
      youtube_url:  0
    }
  });
});

Meteor.publish("personArticles", function () {
  return Articles.find({
    'category': 'o',
    'is_published':  true
  }, {
    sort: {
      timestamp: -1
    },
    fields:  {
      text: 0,
      photoset:  0,
      photoset_placement: 0,
      youtube_url:  0
    }
  });
});

Meteor.publish("adminArticleList", function (limit) {
  return Articles.find({}, {
    sort: {
      timestamp: -1
    },
    limit: limit,
    fields:  {
      text: 0,
      photoset:  0,
      photoset_placement: 0,
      youtube_url:  0,
      intro: 0
    }
  });
});

/*Meteor.publish("topArticles", function () {
    return Articles.find({ }, {sort :{ title: -1}, limit : 3});
});*/

Meteor.publish("article", function (slug) {
  return Articles.find({
    "slug": slug
  });
});