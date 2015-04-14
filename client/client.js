Meteor.startup(function() {
   $('html').attr('lang', 'cs');
});

// infinite scrolling:
$(window).scroll(function () {
  if (document.getElementById("archive-articles")) {
    var navHeight = $( window ).height() - 700;
             if ($(window).scrollTop() > navHeight) {
                 $('#form-archive').addClass('fixed');
             }
             else {
                 $('#form-archive').removeClass('fixed');
             }
  }
});
