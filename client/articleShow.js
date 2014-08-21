Template.articleShow.helpers({
  flickr: function (set_id) {
    $('#photos').empty();
    $.ajax({
      url: (window.location.protocol === 'https:' ?
          'https://secure' : 'https://api') +
        '.flickr.com/services/rest/',
      data: {
        format: 'json',
        method: 'flickr.photosets.getPhotos',
        photoset_id:  set_id,
        // per_page: '1',
        api_key: '7617adae70159d09ba78cfec73c13be3'
      },
      dataType: 'jsonp',
      jsonp: 'jsoncallback'
    }).done(function (result) {
      var linksContainer = $('#photos'),
        baseUrl;
      $.each(result.photoset.photo, function (index, photo) {
        baseUrl = 'http://farm' + photo.farm + '.static.flickr.com/' +
          photo.server + '/' + photo.id + '_' + photo.secret;
        $('<a/>')
          .attr('data-lightbox', 'article')
          // .attr('data-title', photo.title)
          .append($('<img>').prop('src', baseUrl + '_q.jpg'))
          .prop('href', baseUrl + '_b.jpg')
          // .prop('title', photo.title)
          .attr('class', 'grow')
          .appendTo(linksContainer);
      });
    });
  }
});

Template.articleShow.rendered = function () {
  $("html, body").animate({ scrollTop: $("#content").offset().top }, 600);
};