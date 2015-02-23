titleToSlug = function (title) {
  // XXX: this is a first approximation, needs:
  //   - deal with non-latin chars
  //   - check for overlap? (add a -1 or something?)
  sdiak = "ÁÂÄĄáâäąČčĆćÇçĈĉĎĐďđÉÉĚËĒĖĘéěëēėęĜĝĞğĠġĢģĤĥĦħÍÎíîĨĩĪīĬĭĮįİıĴĵĶķĸĹĺĻļĿŀŁłĹĽĺľŇŃŅŊŋņňńŉÓÖÔŐØŌōóöőôøŘřŔŕŖŗŠšŚśŜŝŞşŢţŤťŦŧŨũŪūŬŭŮůŰűÚÜúüűŲųŴŵÝYŶŷýyŽžŹźŻżß";
  bdiak = "AAAAaaaaCcCcCcCcDDddEEEEEEEeeeeeeGgGgGgGgHhHhIIiiIiIiIiIiIiJjKkkLlLlLlLlLLllNNNNnnnnnOOOOOOooooooRrRrRrSsSsSsSsTtTtTtUuUuUuUuUuUUuuuUuWwYYYyyyZzZzZzs";
  tx = "";
  for (p = 0; p < title.length; p++) {
    if (sdiak.indexOf(title.charAt(p)) != -1) {
      tx += bdiak.charAt(sdiak.indexOf(title.charAt(p)));
    } else {
      tx += title.charAt(p);
    }
  }
  return tx.trim().toLowerCase().replace(/\W+/g, '-').replace(/-$/, '').replace(/^-/, '');
}

cleanHTML = function (input) {
  // 1. remove line breaks / Mso classes
  var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
  var output = input.replace(stringStripper, ' ');
  // 2. strip Word generated HTML comments
  var commentSripper = new RegExp('<!--(.*?)-->', 'g');
  var output = output.replace(commentSripper, '');
  var tagStripper = new RegExp('<(/)*(meta|div|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
  // 3. remove tags leave content if any
  output = output.replace(tagStripper, '');
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'form', 'input', 'textarea', 'button', 'img', 'font', 'pre'];
  for (var i = 0; i < badTags.length; i++) {
    tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
    output = output.replace(tagStripper, '');
  }
  // 5. remove attributes ' style="..."'
  var badAttributes = ['style', 'start', 'class', 'id', 'align'];
  for (var i = 0; i < badAttributes.length; i++) {
    var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
    output = output.replace(attributeStripper, '');
  }
  return output;
}

getFlickrSets = function () {
  $.ajax({
    url: (window.location.protocol === 'https:' ?
        'https://secure' : 'https://api') +
      '.flickr.com/services/rest/',
    data: {
      format: 'json',
      method: 'flickr.photosets.getList',
      user_id:   '124879138@N07',
      primary_photo_extras:   'url_q',
      // per_page: '1',
      api_key: '7617adae70159d09ba78cfec73c13be3'
    },
    dataType: 'jsonp',
    jsonp: 'jsoncallback'
  }).done(function (result) {
    var setsContainer = $('#form-set');
    $('<option/>')
      .prop('label', '(bez fotek)').appendTo(setsContainer);

    $.each(result.photosets.photoset, function (index, photoset) {
      $('<option/>')
        .prop('label', photoset.title._content)
        .attr('data-photo', photoset.primary_photo_extras.url_q)
        .prop('value', photoset.id)
        .appendTo(setsContainer);

      $('#form-set option:eq(1)').attr('selected', 'selected');
    });
  });
}

getIdFromYoutube = function(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return match[2];
}

scrollToContent = function() {
  if($("#main-nav").length > 0){
    $("html, body").animate({ scrollTop: $("#main-nav").offset().top - 8}, 600);
  }
}
