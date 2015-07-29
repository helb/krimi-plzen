Template.missingPersons.rendered = function() {
  Meteor.subscribe('personArticles');
}

Template.missingPersons.helpers({
  persons: function() {
    var twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return Articles.find({
      'category': 'o',
      'is_published': true,
      'timestamp':  {
        $gt: twoMonthsAgo
      }
    }, {
      sort: {
        timestamp: -1
      }
    });
  },

  thereArePersons: function() {
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
  'click section.person a': function(event) {
    scrollToContent();
  },
});