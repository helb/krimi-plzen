Template.articleShow.helpers({
  flickrGallery: function(set) {
    $.ajax({
      url: (window.location.protocol === 'https:' ?
          'https://secure' : 'https://api') +
        '.flickr.com/services/rest/',
      data: {
        format: 'json',
        method: 'flickr.photosets.getPhotos',
        photoset_id: set,
        api_key: '7617adae70159d09ba78cfec73c13be3'
      },
      dataType: 'jsonp',
      jsonp: 'jsoncallback'
    }).done(function(result) {
      if (result.photoset) {
        var thumbContainer = $("#photos"),
          baseUrl;
        thumbContainer.empty();
        $.each(result.photoset.photo, function(index, photo) {
          baseUrl = 'http://farm' + photo.farm +
            '.static.flickr.com/' +
            photo.server + '/' + photo.id + '_' + photo.secret;
          $('<a/>').addClass('grow')
            .append($('<img>').prop('src', baseUrl + '_q.jpg').prop(
              'alt', photo.title))
            .prop('href', baseUrl + '_b.jpg')
            .data('id', photo.id)
            .appendTo(thumbContainer)
            .click(function(e) {
              $("#photoViewer").empty();
              $("<a id='closeViewer'>&times;</a>").appendTo(
                "#photoViewer").click(function(e) {
                e.preventDefault();
                $("#photoViewer").fadeOut();
              });
              e.preventDefault();
              $("<img id='currentImage' src='" + $(this).attr(
                  "href") +
                "'>").appendTo("#photoViewer");
              $(
                "<nav id='viewerNav'><a id='navPrev'>&lt;</a><span id='currentPhotoIndex'>6</span>/<span id='totalPhotos'>" +
                $("#photos a").length +
                "</span><a id='navNext'>&gt;</a></nav>"
              ).appendTo(
                "#photoViewer")
              $("#photoViewer").fadeIn();
            });
        });
      }
    });
  }
});

Template.articleShow.rendered = function() {
  $(document).ready(function() {
    scrollToContent();

    $("<div id='photoViewer'></div>").hide()
      .appendTo($("body"));
  });
}
