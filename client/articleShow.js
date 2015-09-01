function loadFlickrSizes(currentImage, thumb) {
  $("#loading-circle").transition({
    opacity: 1
  }, 800);
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
    $("#navPrev svg").transition({
      opacity: 0
    }, 700);
  }
  if (index + 1 == totalPhotos) {
    $("#navNext svg").transition({
      opacity: 0
    }, 700);
  }
  loadFlickrSizes($("#currentImage"), thumb);
  $("#photoViewer").css({
    "opacity": 0,
    "display":   "block"
  }).transition({
    opacity: 1
  }, 500);
}

function closeViewer() {
  $("#photoViewer").transition({
    opacity: 0
  }, 500, function() {
    $("#currentImage").children().attr("src", "");
    $("#photos a").removeClass("current");
  }).css({
    "display":   "none"
  });
}

function switchPhoto(currentIndex, direction) {
  var nextIndex = currentIndex + direction + 1;
  if (nextIndex <= 1) {
    $("#navPrev svg").transition({
      opacity: 0
    }, 700);
  } else {
    $("#navPrev svg").transition({
      opacity: 1
    }, 700);
  }
  if (nextIndex >= $("#photos a").length) {
    $("#navNext svg").transition({
      opacity: 0
    }, 700);
  } else {
    $("#navNext svg").transition({
      opacity: 1
    }, 700);
  }

  if ((direction > 0 && nextIndex <= $("#photos a").length) || (direction < 0 && nextIndex >= 1)) {
    var nextThumb = $("#photos a:nth-child(" + nextIndex + ")");
    $("#currentImage")
      .transition({
        marginLeft: direction * -200 + 'vw'
      }, 500, function() {
        loadFlickrSizes($("#currentImage"), nextThumb);
        $("#photos a").removeClass("current");
        $("#currentPhotoIndex").text(nextIndex);
        nextThumb.addClass("current");
        $("#currentImage").children().attr("src", "");
      })
      .transition({
        marginLeft: direction * 100 + 'vw'
      }, 0);
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
          baseUrl = '//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
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
  },
  notPartner: function(name){
    if (name === "PARTNER") {
      return false;
    } else {
      return true;
    }
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
      $("#currentImage").transition({
        marginLeft: 0
      }, 500, function() {
        $("#loading-circle").transition({
          opacity: 0
        }, 200);
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
        } else
        if (direction == "up") {
          closeViewer();
        }
      }
    });
  });
}