Template.adminArticleEdit.rendered = function() {

    var editor = new MediumEditor('#editor', {
        anchorInputPlaceholder: 'adresa odkazu',
        buttons: ['bold', 'italic', 'underline', 'strikethrough', 'header1', 'unorderedlist', 'orderedlist', 'quote', 'anchor'],
        checkLinkFormat: true,
        cleanPastedHTML:  true,
        forcePlainText: true,
        firstHeader: 'h2',
        secondHeader: 'h3',
        placeholder: ''
    });

    if ($("#form-partner").data("articlepartner")) {
        setTimeout(function() {
            $("#form-partner option[value='" + $("#form-partner").data("articlepartner") + "']").prop("selected", "selected");
        }, 1500);
    }
};

Template.adminArticleEdit.helpers({
  partners: function(){
    Meteor.subscribe("partnerList");
    return Partners.find();
  }
});

Template.adminArticleEdit.events({
    'click button#form-save': function(event) {
        event.preventDefault();
        var article_id = event.currentTarget.dataset.article;
        var photoset = document.getElementById("form-photoset").value;
        var title = document.getElementById("form-title").value;
        var intro = document.getElementById("form-intro").value;
        var partner = document.getElementById("form-partner").value;
        var text = cleanHTML(document.getElementById("editor").innerHTML);

        var photos = [];

        var photosFetched = false;

        $.ajax({
            url: (window.location.protocol === 'https:' ?
                    'https://secure' : 'https://api') +
                '.flickr.com/services/rest/',
            data: {
                format: 'json',
                method: 'flickr.photosets.getPhotos',
                photoset_id: photoset,
                api_key: '7617adae70159d09ba78cfec73c13be3'
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback'
        }).done(function(result) {
            if (result.photoset) {
                $.each(result.photoset.photo, function(index, photo) {
                    var baseUrl = '//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
                    photos.push(baseUrl);
                });
                photosFetched = true;
            }
        });

        var updateArticle = function() {
            if (Articles.update({
                    _id: article_id
                }, {
                    $set: {
                        title: title,
                        intro: intro,
                        text: text,
                        partner_id: partner,
                        photos: photos
                    }
                })) {
                $("#form-save-success").removeClass("hidden");
            }
        };

        var waitForPhotos = function() {
            if (photosFetched === true) {
                Meteor.clearInterval(insertTimeout);
                updateArticle();
            }
        };

        var insertTimeout = Meteor.setInterval(waitForPhotos, 250);
    },
});
