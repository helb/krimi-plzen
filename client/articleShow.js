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
      if(result.photoset){
        var photoContainer = $('#photos'),
            baseUrl;
        photoContainer.empty();
        $.each(result.photoset.photo, function (index, photo) {
          baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
          photo.server + '/' + photo.id + '_' + photo.secret;
          $('<a/>')
            .append($('<img>').prop('src', baseUrl + '_q.jpg').prop('alt', photo.title))
            .prop('href', baseUrl + '_b.jpg')
            .data('id', photo.id)
            .appendTo(photoContainer);
        });
      }
    });
  }
});

Template.articleShow.rendered = function () {
  scrollToContent();
};
