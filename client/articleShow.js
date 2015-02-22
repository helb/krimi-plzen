Template.articleShow.helpers({
  flickr: function(set_id) {
    $.ajax({
      url: (window.location.protocol === 'https:' ?
          'https://secure' : 'https://api') +
        '.flickr.com/services/rest/',
      data: {
        format: 'json',
        method: 'flickr.photosets.getPhotos',
        photoset_id:  set_id,
        api_key: '7617adae70159d09ba78cfec73c13be3'
      },
      dataType: 'jsonp',
      jsonp: 'jsoncallback'
    }).done(function(result) {
      if (result.photoset) {
        var photoContainer = $('#photos'),
          baseUrl;
        photoContainer.empty();
        $.each(result.photoset.photo, function(index, photo) {
          baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
            photo.server + '/' + photo.id + '_' + photo.secret;
          $('<a/>')
            .append($('<img/>').prop('src', baseUrl + '_q.jpg').prop('alt', photo.title))
            .prop('href', baseUrl + '_b.jpg')
            .appendTo(photoContainer);
        });
      }
    });
  }
});

Template.articleShow.rendered = function() {
  var nanocss = "https://cdnjs.cloudflare.com/ajax/libs/nanogallery/5.4.0/css/nanogallery.min.css";

  scrollToContent();

  if (document.createStyleSheet) {
    document.createStyleSheet(nanocss);
  } else {
    $("head").append($("<link rel='stylesheet' href='" + nanocss + "' type='text/css' media='screen' />"));
  }

  $.getScript("https://cdnjs.cloudflare.com/ajax/libs/nanogallery/5.4.0/jquery.nanogallery.min.js")
    .done(function() {
      $("#photos").nanoGallery({
        userID: '124879138@N07',
        kind: 'flickr',
        photoset: $("#photos").data("set"),
        displayBreadcrumb: false,
        locationHash:  false,
        thumbnailLazyLoad: true,
        lazyBuild: "display",
        thumbnailWidth: 128,
        thumbnailHeight: "auto",
        thumbnailAlignment:   "left",
        colorScheme: "light",
        touchAnimation:  false,
        thumbnailLabel:  {
          display: false
        },
        viewerToolbar:  {
          style:   "stuckImage",
          autoMinimize: 500,
          standard:   "previousButton, pageCounter, nextButton, playPauseButton, fullscreenButton, closeButton",
          minimized: "playPauseButton, closeButton",
        }
      });
    })
};