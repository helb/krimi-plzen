Accounts.config({loginExpirationInDays: null, forbidClientAccountCreation: true});

SEO.config({
        title: 'Krimi Plzeň',
        meta: {
          'description': 'Vše o kriminalitě v Plzni. Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.'
        },
        og: {
          'image': 'http://www.krimi-plzen.cz/images/style/biglogo.png'
        }
      });

titleToSlug = function(title) {
  // XXX: this is a first approximation, needs:
  //   - deal with non-latin chars
  //   - check for overlap? (add a -1 or something?)
sdiak="ÁÂÄĄáâäąČčĆćÇçĈĉĎĐďđÉÉĚËĒĖĘéěëēėęĜĝĞğĠġĢģĤĥĦħÍÎíîĨĩĪīĬĭĮįİıĴĵĶķĸĹĺĻļĿŀŁłĹĽĺľŇŃŅŊŋņňńŉÓÖÔŐØŌōóöőôøŘřŔŕŖŗŠšŚśŜŝŞşŢţŤťŦŧŨũŪūŬŭŮůŰűÚÜúüűŲųŴŵÝYŶŷýyŽžŹźŻżß";
bdiak="AAAAaaaaCcCcCcCcDDddEEEEEEEeeeeeeGgGgGgGgHhHhIIiiIiIiIiIiIiJjKkkLlLlLlLlLLllNNNNnnnnnOOOOOOooooooRrRrRrSsSsSsSsTtTtTtUuUuUuUuUuUUuuuUuWwYYYyyyZzZzZzs";
tx="";
for(p=0;p<title.length;p++){
	if (sdiak.indexOf(title.charAt(p))!=-1){
		tx+=bdiak.charAt(sdiak.indexOf(title.charAt(p)));
	} else {
		tx+=title.charAt(p);
	}
}
return tx.trim().toLowerCase().replace(/\W+/g, '-').replace(/-$/, '').replace(/^-/, '');
}

function cleanHTML(input) {
  // 1. remove line breaks / Mso classes
  var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
  var output = input.replace(stringStripper, ' ');
  // 2. strip Word generated HTML comments
  var commentSripper = new RegExp('<!--(.*?)-->','g');
  var output = output.replace(commentSripper, '');
  var tagStripper = new RegExp('<(/)*(meta|div|link|span|\\?xml:|st1:|o:|font)(.*?)>','gi');
  // 3. remove tags leave content if any
  output = output.replace(tagStripper, '');
  // 4. Remove everything in between and including tags '<style(.)style(.)>'
  var badTags = ['style','script','applet','embed','noframes','noscript','form','input','textarea','button','img'];
  for (var i=0; i< badTags.length; i++) {
    tagStripper = new RegExp('<'+badTags[i]+'.*?'+badTags[i]+'(.*?)>', 'gi');
    output = output.replace(tagStripper, '');
  }
  // 5. remove attributes ' style="..."'
  var badAttributes = ['style','start','class','id'];
  for (var i=0; i< badAttributes.length; i++) {
    var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"','gi');
    output = output.replace(attributeStripper, '');
  }
  return output;
}

function getFlickrSets(){
$.ajax({
        url: (window.location.protocol === 'https:' ?
                'https://secure' : 'https://api') +
                '.flickr.com/services/rest/',
        data: {
            format: 'json',
            method: 'flickr.photosets.getList',
            user_id: '124879138@N07',
            primary_photo_extras: 'url_q',
            // per_page: '1',
            api_key: '7617adae70159d09ba78cfec73c13be3'
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback'
    }).done(function (result) {
        var setsContainer = $('#form-set');
        $('<option/>')
              .prop('label', '(bez fotek)').appendTo(setsContainer);
        // Add the demo images as links with thumbnails to the page:
        $.each(result.photosets.photoset, function (index, photoset) {
            $('<option/>')
              .prop('label', photoset.title._content)
              .attr('data-photo', photoset.primary_photo_extras.url_q)
              .prop('value', photoset.id)
              .appendTo(setsContainer);
        });
    });
}

function getIdFromYoutube(url){
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  return match[2];
}


Template.adminArticleAdd.rendered = function () {
  this._editor = new Pen({
  	stay: false,
  	editor: document.getElementById("editor"),
  	list: [
    'blockquote', 'h2', 'h3', 'p', 'insertorderedlist', 'insertunorderedlist',
    'indent', 'outdent', 'bold', 'italic', 'createlink'
  	]
  });

  getFlickrSets();

};

Template.adminArticleAdd.destroyed = function () {
  this._editor.destroy();
};

Template.adminArticleAdd.events({
	'click button#form-save': function (event) {
    event.preventDefault();
		title = document.getElementById("form-title").value;
		slug = titleToSlug(document.getElementById("form-title").value);
		intro = document.getElementById("form-intro").value;
		text = cleanHTML(document.getElementById("editor").innerHTML);
    setselect = document.getElementById("form-set");
    photoset = setselect.value;
    photo_url = setselect.options[setselect.selectedIndex].dataset.photo;
    photoset_placement = document.getElementById("form-set-placement").value;
    category = document.getElementById("form-category").value;
    if(document.getElementById("form-youtube").value){
      youtube_url = getIdFromYoutube(document.getElementById("form-youtube").value);
    }else{
      youtube_url = null;
    }
    console.log(youtube_url);
		Articles.insert({
			author_id: Meteor.userId(),
      timestamp: new Date(),
			title: title,
			slug: slug,
			intro: intro,
			text: text,
			photo_url: photo_url,
			photoset: photoset,
      photoset_placement: photoset_placement,
      youtube_url: youtube_url,
      category: category,
      is_published: true
		});
  $("#form-save-success").removeClass("hidden");
	},

  'click button#form-flickr-reload': function (event) {
    event.preventDefault();
    photosets = document.getElementById("form-set");
    while (photosets.firstChild) {
      photosets.removeChild(photosets.firstChild);
    }
    getFlickrSets();
  },

  'click input': function (event) {
    $("#form-save-success").addClass("hidden");
  }
});

Template.adminArticleEdit.rendered = function () {
  this._editor = new Pen({
    stay: false,
    editor: document.getElementById("editor"),
    list: [
    'blockquote', 'h2', 'h3', 'p', 'insertorderedlist', 'insertunorderedlist',
    'indent', 'outdent', 'bold', 'italic', 'createlink'
    ]
  });

  // getFlickrSets();
};

Template.adminArticleEdit.destroyed = function () {
  this._editor.destroy();
};

Template.adminArticleEdit.events({
  'click button#form-save': function (event) {
    event.preventDefault();
    article_id =  event.currentTarget.dataset.article;
    // console.log(article_id);
    title = document.getElementById("form-title").value;
    // slug = titleToSlug(document.getElementById("form-title").value);
    intro = document.getElementById("form-intro").value;
    text = cleanHTML(document.getElementById("editor").innerHTML);
    // setselect = document.getElementById("form-set");
    // photoset = setselect.value;
    // photo_url = setselect.options[setselect.selectedIndex].dataset.photo;
    // photoset_placement = document.getElementById("form-set-placement").value;
    // category = document.getElementById("form-category").value;
    // if(document.getElementById("form-youtube").value){
    //   youtube_url = getIdFromYoutube(document.getElementById("form-youtube").value);
    // }else{
    //   youtube_url = null;
    // }
    // console.log(youtube_url);
    Articles.update({_id: article_id}, {$set: {
      title: title,
      intro: intro,
      text: text
    }
    });
  $("#form-save-success").removeClass("hidden");
  window.location.href = '/admin';
  },
});


$(window).scroll(function(){
  if(document.getElementById("new-articles") || document.getElementById("admin-article-list")){
  if ($(window).scrollTop() == $(document).height()-$(window).height()){

    if(!Session.get("currentLimit")){
      if(document.getElementById("new-articles")){
          Session.set("currentLimit", 5);
        } else {Session.set("currentLimit", 15);}
    }

  Session.set("currentLimit", Session.get("currentLimit") + 5);
  return Meteor.subscribe(Router.current().route.name, Session.get("currentLimit"));
  }
}
});


Template.articleShow.helpers({
  flickr: function (set_id) {
    $.ajax({
      url: (window.location.protocol === 'https:' ?
              'https://secure' : 'https://api') +
              '.flickr.com/services/rest/',
      data: {
          format: 'json',
          method: 'flickr.photosets.getPhotos',
          photoset_id: set_id,
          // per_page: '1',
          api_key: '7617adae70159d09ba78cfec73c13be3'
      },
      dataType: 'jsonp',
      jsonp: 'jsoncallback'
  }).done(function (result) {
    var linksContainer = $('#photos'),
        baseUrl;
    // Add the demo images as links with thumbnails to the page:
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


Template.missingPersons.rendered = function(){
  Meteor.subscribe('personArticles');
}

Template.missingPersons.helpers({
    persons: function(){
      return Articles.find({'category': 'o', 'is_published': true}, { sort: { timestamp: -1 }});
    },

    thereArePersons: function(){
     if(Articles.find({'category': 'o', 'is_published': true}).count() > 0){
      return true;
     } else {
      return false;
     }
    }
});

Template.adminArticleList.helpers({
  hide_button_text: function(published){
    if(published != true){
      return "Zobrazit"
    }
    return "Schovat"
  }
})

Template.adminArticleList.events({
  'click button.hide': function (event) {
    event.preventDefault();
    article = event.currentTarget.parentNode.parentNode.dataset.article;
    if(event.currentTarget.classList.contains("true")){
      Articles.update({_id: article}, {$set: {is_published: false}});
    }else{
      Articles.update({_id: article}, {$set: {is_published: true}});
    }
  },
  'click button.remove': function (event) {
    event.preventDefault();
    article = event.currentTarget.parentNode.parentNode.dataset.article;
    Articles.remove({_id: article});
  },
  'click td.category': function (event) {
    article_id =  event.currentTarget.parentNode.dataset.article;
    current_category = Articles.findOne({_id: article_id}).category;
    if(current_category == null){
      Articles.update({_id: article_id}, {$set: {category: "z"}});
    }else if (current_category == "z"){
      Articles.update({_id: article_id}, {$set: {category: "o"}});
    } else {
      Articles.update({_id: article_id}, {$set: {category: null}});
    }
  },
})
