/*Template.newArticles.events({
  'click a.article-link': function (event) {
  	console.log('– EVENTS ––––––––––––––––––––––––––––––––––––––––––––');
  	console.log('scrollTop: ' +  $(window).scrollTop());
  	Session.set('scrollTop', $(window).scrollTop());
  }
});
*/
Template.newArticles.rendered = function () {
	// console.log('– RENDERED ––––––––––––––––––––––––––––––––––––––––––');
	// $("#sidebar").css({"margin-bottom": $(document).height() - $("#sidebar").height * 193) + "px"});
	// console.log('margin set to ' + $(document).height());
	// $(window).scrollTop(Session.get('scrollTop'));
 //    console.log('scrolled to ' + Session.get('scrollTop'));
	GAnalytics.pageview();
	console.log("rendered newArticles");
};
