Template.recommendedArticles.rendered = function () {
  Meteor.subscribe('recommendedArticles');
}

Template.recommendedArticles.helpers({
  articles: function () {
    return Articles.find({
      'is_recommended': true,
      'is_published':  true
    }, {
      limit: 10,
      sort: {
        timestamp: -1
      }
    }).fetch();
  }
});

Template.recommendedArticles.events({
  'click section.recommended a': function (event) {
    scrollToContent();
  },
});
