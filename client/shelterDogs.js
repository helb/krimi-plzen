Template.shelterDogs.onCreated(function() {
    var self = this;
    self.autorun(function() {
        listSubs.subscribe("dogs");
    });
});

Template.shelterDogs.helpers({
    dogs: function() {
        return Dogs.find().fetch();
    }
});

Template.shelterDogs.events({
    "mouseup section#dogs a": function (event) {
        var url = event.target.href;
        ga("send", "event", "outbound", "click", url);
        return true;
    }
});
