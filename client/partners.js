Template.partners.helpers({
  partners: function() {
  	Meteor.subscribe("partnerList");
    return Partners.find({}, {
      sort: {
        order: 1
      }
    });
  },
});
