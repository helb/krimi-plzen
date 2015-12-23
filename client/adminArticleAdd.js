Template.adminArticleAdd.rendered = function() {
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

    getFlickrSets();

};

Template.adminArticleAdd.helpers({
    partners: function() {
        Meteor.subscribe("partnerList");
        return Partners.find();
    }
});

Template.adminArticleAdd.events({
    'click button#form-save': function(event) {
        event.preventDefault();
        var title = document.getElementById("form-title").value;
        var slug = titleToSlug(document.getElementById("form-title").value);
        var intro = document.getElementById("form-intro").value;
        var text = cleanHTML(document.getElementById("editor").innerHTML);
        var partner = document.getElementById("form-partner").value;
        var setselect = document.getElementById("form-set");
        var photoset = setselect.value;
        var photo_url = "";
        var photoset_placement = document.getElementById("form-set-placement").value;
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
                photo_url = result.photoset.photo[0] + "_q.jpg";
                $.each(result.photoset.photo, function(index, photo) {
                    var baseUrl = '//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
                    photos.push(baseUrl);
                    if (index === 0) {
                        photo_url = baseUrl + "_q.jpg";
                    }
                });
                photosFetched = true;
            }
        });


        if (document.getElementById("form-category").value.length >  0) {
            category = document.getElementById("form-category").value;
        } else {
            category = null;
        }

        if (document.getElementById("form-youtube").value) {
            youtube_url  = getIdFromYoutube(document.getElementById("form-youtube").value);
        } else {
            youtube_url =  null;
        }

        if (document.getElementById("form-publish").checked) {
            is_published = true;
        } else {
            is_published = false;
        }

        Meteor.call('articleExists', slug, function(err, exists) {
            if (err) {
                console.log(err);
            }
            if (exists === true) {
                timestamp = new Date();
                day = timestamp.getDate();
                month = timestamp.getMonth() + 1;
                year = timestamp.getFullYear();
                finalSlug = slug + "-" + year + "-" + month + "-" + day + "-" + timestamp.getHours() + (timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes();
            } else {
                finalSlug = slug;
            }

            var insertArticle = function() {
                if (Articles.insert({
                        author_id:  Meteor.userId(),
                        timestamp: new Date(),
                        title: title,
                        slug: finalSlug,
                        intro: intro,
                        text: text,
                        photo_url: photo_url,
                        photoset: photoset,
                        photoset_placement:  photoset_placement,
                        youtube_url: youtube_url,
                        category: category,
                        is_published: is_published,
                        partner_id: partner,
                        photos: photos
                    })) {
                    $("#form-save-success").removeClass("hidden");
                    setTimeout(function() {
                        Router.go("/admin/article");
                    }, 500);
                }
            };

            var waitForPhotos = function(){
                if(photosFetched === true){
                    Meteor.clearInterval(insertTimeout);
                    insertArticle();
                }
            };

            var insertTimeout = Meteor.setInterval(waitForPhotos, 250);
        });
    },

    'click button#form-flickr-reload': function(event) {
        event.preventDefault();
        photosets = document.getElementById("form-set");
        while (photosets.firstChild) {
            photosets.removeChild(photosets.firstChild);
        }
        getFlickrSets();
    },

    'click input': function(event) {
        $("#form-save-success").addClass("hidden");
    }
});
