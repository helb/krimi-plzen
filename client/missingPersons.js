Template.missingPersons.rendered = function() {
  listSubs.subscribe('personArticles');
}

var threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);

var missingPersonFilter = {
  'category': 'o',
  'is_published': true,
  'timestamp':  {
    $gt: threeMonthsAgo
  }
};

Template.missingPersons.helpers({
  persons: function() {
    return Articles.find(missingPersonFilter, {
      sort: {
        timestamp: -1
    },
    reactive: false
    }).fetch();
  },

  thereArePersons: function() {
    if (Articles.find(missingPersonFilter, {reactive: false}).count() > 0) {
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
