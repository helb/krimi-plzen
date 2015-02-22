Template.articleShow.rendered = function() {
  var nanocss = "https://cdnjs.cloudflare.com/ajax/libs/nanogallery/5.4.0/css/nanogallery.min.css";

  scrollToContent();

  if($("#photos").length > 0){
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
            style: "stuckImage",
            autoMinimize: 500,
            standard: "previousButton, pageCounter, nextButton, playPauseButton, fullscreenButton, closeButton",
            minimized: "minimizeButton, playPauseButton, closeButton",
          },
          displayBreadcrumb: false,
        });
      })
  }
};