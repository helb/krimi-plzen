Template.shelterDogs.rendered = function() {
  var feed = "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://utulekplzen.cz/category/aktualne-prijati-psi/feed/&num=5";
  var dogEntries = [];

  $.ajax({
    url: feed,
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(data) {
      console.log(data.responseData.feed.entries);
      $.each(data.responseData.feed.entries, function(i, val) {
        var text = val.contentSnippet.replace(/(\r\n|\n|\r)/gm, "").replace(" &#160;", "").replace(/Přijat.*$/, "");
        var image = val.content.replace(/(\r\n|\n|\r)/gm, "").replace(/^.*src="/, "").replace(/" alt.*/, "");
        var dog = "<article class='dog'><a href='" + val.link + "' target='_blank' class='grow' style='background-image:url(" + image + ")'></a><p><a target='_blank' href='" + val.link + "'>" + text + "</a></p></article>";
        $("#dogs").append(dog);
      });
      $("#dogs").append("<a href='http://utulekplzen.cz/category/aktualne-prijati-psi/' target='_blank' id='shelter-link'>Další psy najdete na utulekplzen.cz &raquo;</a>");
    },
    error: function() {
      $("#dogs").css("display", "none");
    }
  });
}