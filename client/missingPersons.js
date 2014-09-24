Template.missingPersons.rendered = function () {
  Meteor.subscribe('personArticles');
}

Template.missingPersons.helpers({
  persons: function () {
    return Articles.find({
      'category': 'o',
      'is_published':  true
    }, {
      sort: {
        timestamp: -1
      }
    });
  },

  thereArePersons: function () {
    if (Articles.find({
      'category': 'o',
      'is_published':  true
    }).count() > 0) {
      return true;
    } else {
      return false;
    }
  }
});

Template.missingPersons.events({
  'click section.person a': function (event) {
    scrollToContent();
  },
});