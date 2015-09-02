Template.adminArticleEdit.rendered = function () {

  var editor = new MediumEditor('#editor', {
    anchorInputPlaceholder: 'adresa odkazu',
    buttons: ['bold', 'italic', 'underline', 'strikethrough', 'header1', 'unorderedlist', 'orderedlist', 'quote', 'anchor'],
    checkLinkFormat: true,
    cleanPastedHTML: true,
    forcePlainText: true,
    firstHeader: 'h2',
    secondHeader: 'h3',
    placeholder: ''
  });

  setTimeout(function(){
    $("#form-partner option[value=" + $("#form-partner").data("articlepartner") + "]").prop("selected", "selected");
    }, 1500);
};

Template.adminArticleEdit.helpers({
  partners: function(){
    Meteor.subscribe("partnerList");
    return Partners.find();
  }
});

Template.adminArticleEdit.events({
  'click button#form-save': function (event) {
    event.preventDefault();
    article_id = event.currentTarget.dataset.article;
    title = document.getElementById("form-title").value;
    intro = document.getElementById("form-intro").value;
    partner = document.getElementById("form-partner").value;
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
        text: text,
        partner_id: partner
      }
    });
    $("#form-save-success").removeClass("hidden");
  },
});
