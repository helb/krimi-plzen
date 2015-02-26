Template.articleShow.rendered = function() {
  var nanocss = "https://cdnjs.cloudflare.com/ajax/libs/nanogallery/5.4.0/css/nanogallery.min.css";

  scrollToContent();

  if ($("#photos").length > 0) {
    if (document.createStyleSheet) {
      document.createStyleSheet(nanocss);
    } else {
      $("head").append($("<link rel='stylesheet' href='" + nanocss + "' type='text/css' media='screen' />"));
    }

    $(document).ready(function() {
      var setId = String($("#photos").data("set"));
      $.getScript("https://cdnjs.cloudflare.com/ajax/libs/nanogallery/5.4.0/jquery.nanogallery.min.js")
        .done(function() {
          $("#photos").nanoGallery({
            userID: '124879138@N07',
            kind: 'flickr',
            photoset: setId,
            lazyBuild: 'loadData',
            thumbnailLazyLoad: true,
            locationHash: false,
            thumbnailWidth: 128,
            thumbnailHeight: "auto",
            thumbnailAlignment:   "left",
            colorScheme: "light",
            touchAnimation:  false,
            thumbnailLabel:  {
              display: false
            },
            viewerToolbar:  {
              style: "stuckImage",
              autoMinimize: 500,
              standard: "label, previousButton, pageCounter, nextButton, playPauseButton, fullscreenButton",
              minimized: "label, minimizeButton, playPauseButton, closeButton",
            },
            displayBreadcrumb: false,
          });
        })
    });
  }
};