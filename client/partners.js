Template.partners.helpers({
	partnerSlideshowStyle: function() {
		var partnerCount = Partners.find().count();
		var sliderAnimation = "";
		var fakebgAnimation = "";
		var fTime = (100 - partnerCount * 3) / partnerCount;
		for (i = 0; i < partnerCount; i++) {
			var percents = i * 100 / partnerCount;
			sliderAnimation += percents + "% {margin-left: " + i * -100 + "%} ";
			sliderAnimation += percents + fTime + "% {margin-left: " + i * -100 + "%} ";
			fakebgAnimation += percents + "% {left: " + (partnerCount - i) * -4.75 + "em} ";
			fakebgAnimation += percents + fTime + "% {left: " + (partnerCount - i) * -4.75 + "em} ";
		}
		var sliderStyle = "#partners-slider {animation: partnerSlide " + partnerCount * 8 +
			"s ease-in-out infinite; width:"  + partnerCount * 100 + "%; transition: margin-left 0.5s}";
		var fakebgStyle = ".partner-label-fakebg{animation: fakebgSlide " + partnerCount * 8 +
			"s ease-in-out infinite; left: " + partnerCount * -4.75 + "em}";
		var style = "<style>@keyframes partnerSlide{" + sliderAnimation + "} " +
			sliderStyle + " " + fakebgStyle +
			" @keyframes fakebgSlide{" + fakebgAnimation + "}</style>";
		return style;
	}
});

Template.partners.events({
	"change .partner-radio": function (event) {
		console.log(event.target);
		var el = event.target;
		document.querySelector(".partner-label-fakebg").classList.add("hidden");
		document.querySelector("#partners-slider").classList.add("stopped");
		var frameCount = document.querySelectorAll(".partner-label").length;
		for (var i = 0; el = el.previousElementSibling; i++);
		var currentFrame = i / 2;
		console.log(currentFrame);
		$("#partners-slider").css({"margin-left": currentFrame * -100 + "%"});
	}
});
