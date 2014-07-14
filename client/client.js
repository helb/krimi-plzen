// infinite scrolling:
$(window).scroll(function () {
  if (document.getElementById("admin-article-list")) {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      if (!Session.get("currentLimit")) {
        if (document.getElementById("new-articles")) {
          Session.set("currentLimit", 10);
        } else {
          Session.set("currentLimit", 15);
        }
      }
      Session.set("currentLimit", Session.get("currentLimit") + 5);
      return Meteor.subscribe(Router.current().route.name, Session.get("currentLimit"));
    }
  }
});