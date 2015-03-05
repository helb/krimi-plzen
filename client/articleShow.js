function loadFlickrSizes(currentImage, thumb) {
  var b = thumb.attr("href");
  var c = b.replace("_b.jpg", "_c.jpg");
  var z = b.replace("_b.jpg", "_z.jpg");
  var def = b.replace("_b.jpg", ".jpg");
  var n = b.replace("_b.jpg", "_n.jpg");
  var m = b.replace("_b.jpg", "_m.jpg");
  var fallback = b;

  $("#currentImage .b").attr("srcset", b);
  $("#currentImage .c").attr("srcset", c);
  $("#currentImage .z").attr("srcset", z);
  $("#currentImage .def").attr("srcset", def);
  $("#currentImage .n").attr("srcset", n);
  $("#currentImage .m").attr("srcset", m);
  $("#currentImage .fallback").attr("src", fallback);
}

function openViewer(thumb) {
  var index = thumb.index();
  var totalPhotos = $("#photos a").length;
  $("#totalPhotos").text(totalPhotos);
  $("#currentPhotoIndex").text(index + 1);
  if (index == 0) {
    $("#navPrev svg").hide();
  }
  if (index + 1 == totalPhotos) {
    $("#navNext svg").hide();
  }
  loadFlickrSizes($("#currentImage"), thumb);
  $("#photoViewer").fadeIn();
}

function closeViewer() {
  $("#photoViewer").fadeOut(function() {
    $("#currentImage").children().attr("src", "");
    $("#photos a").removeClass("current");
  });
}

function switchPhoto(currentIndex, direction) {
  var nextIndex = currentIndex + direction + 1;
  if (nextIndex <= 1) {
    $("#navPrev svg").fadeOut();
  } else {
    $("#navPrev svg").fadeIn();
  }
  if (nextIndex >= $("#photos a").length) {
    $("#navNext svg").fadeOut();
  } else {
    $("#navNext svg").fadeIn()
  }

  if ((direction > 0 && nextIndex <= $("#photos a").length) || (direction < 0 && nextIndex >= 1)) {
    var nextThumb = $("#photos a:nth-child(" + nextIndex + ")");
    $("#loading-circle").show();
    $("#currentImage")
      .animate({
        marginLeft: direction * -200 + 'vw'
      }, 500, function() {
        $("#photos a").removeClass("current");
        $("#currentPhotoIndex").text(nextIndex);
        nextThumb.addClass("current");
        $("#currentImage").children().attr("src", "");
      })
      .animate({
        marginLeft: direction * 200 + 'vw'
      }, 0, function() {
        loadFlickrSizes($("#currentImage"), nextThumb);
      });
  }
}

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
          baseUrl = 'http://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
          $('<a/>').addClass('grow')
            .append($('<img>').prop('src', baseUrl + '_q.jpg').prop(
              'alt', photo.title))
            .prop('href', baseUrl + '_b.jpg')
            .appendTo(thumbContainer)
            .click(function(e) {
              e.preventDefault();
              openViewer($(this));
              $(this).addClass("current");
            });
        });
      }
    });
  }
});

Template.articleShow.rendered = function() {
  $(document).ready(function() {
    scrollToContent();

    $("#closeViewer").click(function(e) {
      e.preventDefault();
      closeViewer();
    });

    $("#navNext").click(function(e) {
      e.preventDefault();
      switchPhoto($("#photos a.current").index(), 1);
    });

    $("#navPrev").click(function(e) {
      e.preventDefault();
      switchPhoto($("#photos a.current").index(), -1);
    });

    $("#currentImage img").load(function() {
      $("#currentImage").animate({
        marginLeft: 0,
        width: '100%'
      }, 500, function() {
        $("#loading-circle").hide();
      });
    });

    $(document).unbind('keyup').keyup(function(e) {
      if ($("#photoViewer").is(":visible")) {
        if (e.keyCode == 27) { // esc
          closeViewer();
        } else if (e.keyCode == 39) { // ->
          switchPhoto($("#photos a.current").index(), 1);
        } else if (e.keyCode == 37) { // <-
          switchPhoto($("#photos a.current").index(), -1);
        }
      }
    });

    $("#currentImage").swipe({
      swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
        if (direction == "left") {
          switchPhoto($("#photos a.current").index(), 1);
        } else if (direction == "right") {
          switchPhoto($("#photos a.current").index(), -1);
        } else if (direction == "up") {
          closeViewer();
        }
      }
    });
  });
}