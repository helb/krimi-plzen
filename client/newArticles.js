Template.newArticles.events({
  'click a#load-more-link': function (event) {
      event.preventDefault();
      if (!Session.get("currentLimit")) {
        if (document.getElementById("new-articles")) {
          Session.set("currentLimit", 12);
        } else {
          Session.set("currentLimit", 15);
        }
      }
      Session.set("currentLimit", Session.get("currentLimit") + 5);
      return Meteor.subscribe(Router.current().route.name, Session.get("currentLimit"));
  }
});

// Template.newArticles.rendered = function () {
	// console.log('– RENDERED ––––––––––––––––––––––––––––––––––––––––––');
	// $("#sidebar").css({"margin-bottom": $(document).height() - $("#sidebar").height * 193) + "px"});
	// console.log('margin set to ' + $(document).height());
	// $(window).scrollTop(Session.get('scrollTop'));
 //    console.log('scrolled to ' + Session.get('scrollTop'));
// 	GAnalytics.pageview();
// 	console.log("rendered newArticles");
// };
