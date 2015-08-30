Template.partners.helpers({
	partners: function() {
		return _.shuffle(Partners.find({
			is_enabled: true
		}).fetch());
	},
	partnerSlideshow: function() {
		Meteor.subscribe("partnerList");

		var partnerCount = Partners.find().count();
		var animation;
		var fTime = (100 - partnerCount * 3) / partnerCount;
		for (i = 0; i < partnerCount; i++) {
			var position = i * 100 / partnerCount;
			animation += position + "% {margin-left: " + i * -100 + "%} ";
			animation += position + fTime + "% {margin-left: " + i * -100 + "%} ";
		}
		var sliderStyle = "#partners-slider {animation:partnerSlide " + partnerCount * 8 +
						  "s ease-in-out infinite; width:" + partnerCount * 100 + "%;}";
		return "<style>@keyframes partnerSlide{" + animation + "} " + sliderStyle + "</style>";
	}
});