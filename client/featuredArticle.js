Template.featuredArticles.helpers({
    featuredArticles: function() {
        return Meteor.settings.public.featuredArticles;
    },
});
