Template.policeRecruitment.rendered = function () {
  Meteor.subscribe('recruitmentArticles');
}

Template.policeRecruitment.helpers({
  recruitments: function () {
    return Articles.find({
      'category': 'recruitment',
      'is_published':  true
    }, {
      sort: {
        timestamp: -1
      }
    });
  },

  thereAreRecruitments: function () {
    if (Articles.find({
      'category': 'recruitment',
      'is_published':  true
    }).count() > 0) {
      return true;
    } else {
      return false;
    }
  }
});

Template.policeRecruitment.events({
  'click section.recruitment a': function (event) {
    scrollToContent();
  },
});