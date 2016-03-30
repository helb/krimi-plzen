Template.partnerArticles.rendered = function () {
  listSubs.subscribe('partnerArticles');
};

Template.partnerArticles.helpers({
  articles: function () {
    return Articles.find({
      'author_name': "PARTNER",
      'is_published':  true
    }, {
      limit: 10,
      sort: {
        timestamp: -1
    },
    reactive: false
    }).fetch();
  }
});

Template.partnerArticles.events({
  'click section.partner a': function (event) {
    scrollToContent();
  },
});
