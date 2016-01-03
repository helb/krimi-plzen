Template.newArticles.events({
  'click a#load-more-link': function (event) {
      event.preventDefault();

      Session.set("currentLimit", Session.get("currentLimit") + 2);

      var dateOffset = (24*60*60*1000) * Session.get("currentLimit");
      var daysAgo = new Date();
      daysAgo.setTime(daysAgo.getTime() - dateOffset);
      daysAgo.setHours(0,0,0,0);
      var until = daysAgo;
      until.setHours(23,59,59,999);
      Session.set("archiveUntil", until);
      dateOffset = (24*60*60*1000) * 3;
      var since = daysAgo;
      since.setTime(since.getTime() - dateOffset);
      Session.set("archiveSince", since);

      $("html, body").animate({ scrollTop: $('#new-articles .article-slug').last().offset().top - 20 }, 600);
      return Meteor.subscribe(Router.current().route.name, daysAgo);
  }
});
