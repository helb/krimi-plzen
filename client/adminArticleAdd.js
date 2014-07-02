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
    if(document.getElementById("form-category").value.length > 0){
      category = document.getElementById("form-category").value;
    } else {
      category = null;
    }
    if (document.getElementById("form-youtube").value) {
      youtube_url  = getIdFromYoutube(document.getElementById("form-youtube").value);
    } else {
      youtube_url =  null;
    }
    console.log(youtube_url);
    Articles.insert({
      author_id:  Meteor.userId(),
      timestamp: new Date(),
      title: title,
      slug: slug,
      intro: intro,
      text: text,
      photo_url:  photo_url,
      photoset:  photoset,
      photoset_placement:  photoset_placement,
      youtube_url:  youtube_url,
      category: category,
      is_published:  true
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