Template.shelterDogs.onCreated(function() {
    var self = this;
    self.autorun(function() {
        self.subscribe("dogs");
    });
});

Template.shelterDogs.helpers({
    dogs: function() {
        return Dogs.find();
    }
});

Template.shelterDogs.events({
    "mouseup section#dogs a": function (event) {
        var url = event.target.href;
        ga("send", "event", "outbound", "click", url);
        return true;
    }
});
