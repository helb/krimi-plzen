Template.adminArticleEdit.rendered = function () {
/*  this._editor = new Pen({
    stay: false,
    editor: document.getElementById("editor"),
    list: [
      'blockquote', 'h2', 'h3', 'p', 'insertorderedlist', 'insertunorderedlist',
      'indent', 'outdent', 'bold', 'italic', 'createlink'
    ]
  });*/

  var editor = new MediumEditor('#editor', {
    anchorInputPlaceholder: 'adresa odkazu',
    // buttons: ['bold', 'italic', 'underline', 'strikethrough', 'header1', 'unorderedlist', 'orderedlist', 'quote', 'anchor'],
    checkLinkFormat: true,
    cleanPastedHTML: true,
    forcePlainText: true,
    firstHeader: 'h2',
    secondHeader: 'h3',
    placeholder: ''
  });

  window.onbeforeunload = function() {
    return "";
  };

  // getFlickrSets();
};

/*Template.adminArticleEdit.destroyed = function () {
  this._editor.destroy();
};*/

Template.adminArticleEdit.events({
  'click button#form-save': function (event) {
    event.preventDefault();
    article_id = event.currentTarget.dataset.article;
    // console.log(article_id);
    title = document.getElementById("form-title").value;
    // slug = titleToSlug(document.getElementById("form-title").value);
    intro = document.getElementById("form-intro").value;
    text = cleanHTML(document.getElementById("editor").innerHTML);
    // text = document.getElementById("editor").innerHTML;
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
    Articles.update({
      _id: article_id
    }, {
      $set: {
        title: title,
        intro: intro,
        text: text
      }
    });
    $("#form-save-success").removeClass("hidden");
    window.location.href = '/admin';
  },
});