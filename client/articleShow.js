Template.articleShow.helpers({
  flickr: function (set_id) {
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
    }).done(function (result) {
      var photoContainer = $('#photos'),
          baseUrl;
      if(result.photoset){
        photoContainer.empty();
        $.each(result.photoset.photo, function (index, photo) {
          baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
          photo.server + '/' + photo.id + '_' + photo.secret;
          $('<a/>')
            .append($('<img>').prop('src', baseUrl + '_q.jpg').prop('alt', 'fotka'))
            .prop('href', baseUrl + '_b.jpg')
            .attr('class', 'swipebox')
            .appendTo(photoContainer);
        });
      }
    });
  }
});

Template.articleShow.rendered = function () {
  scrollToContent();
  $.getScript("/js/ios-orientationchange-fix.js");
  $.getScript("/js/jquery.swipebox.min.js")
    .done(function(script, textStatus){
      $('.swipebox').swipebox({
            useCSS: false,
            beforeOpen: null, // called before opening
            afterOpen: null, // called after opening
            afterClose: null // called after closing
      });
    });
};
