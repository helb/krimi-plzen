Meteor.publishAuth = function(name, fn) {
    Meteor.publish(name, function() {
        if (!this.userId) {
            return this.ready();
        }
        return fn.apply(this, arguments);
    });
};

Meteor.publish("newArticles", function(limit) {
    var dateOffset = (24 * 60 * 60 * 1000) * limit;
    var daysAgo = new Date();
    daysAgo.setTime(daysAgo.getTime() - dateOffset);
    daysAgo.setHours(0, 0, 0, 500);

    return Articles.find({
        'is_published':  true,
        'timestamp': {
            $gte: daysAgo
        },
    }, {
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("newArticlesLatest", function(limit) {
    return Articles.find({
        'is_published':  true
    }, {
        limit: 10,
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("archiveArticles", function(since, until) {
    return Articles.find({
        'is_published':  true,
        'timestamp': {
            $gte: since,
            $lte: until
        }
    }, {
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("weaponArticles", function(limit) {
    return Articles.find({
        'category': 'z',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("minimumUliceArticles", function(limit) {
    return Articles.find({
        'category': 'pravni-minimum-ulice',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("zachranariArticles", function(limit) {
    return Articles.find({
        'category': 'zachranari',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("hasiciArticles", function(limit) {
    return Articles.find({
        'category': 'hasici',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0
        }
    });
});

Meteor.publish("personArticles", function() {
    return Articles.find({
        'category': 'o',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0,
            intro:  0,
            // timestamp: 0,
            author_id: 0,
            author_name: 0
        }
    });
});

Meteor.publish("recruitmentArticles", function() {
    return Articles.find({
        'category': 'recruitment',
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0,
            intro:  0,
            // timestamp: 0,
            author_id: 0,
            author_name: 0
        }
    });
});


Meteor.publish("recommendedArticles", function() {
    return Articles.find({
        'is_recommended':  true,
        'is_published':  true
    }, {
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0,
            intro:  0,
            // timestamp: 0,
            category: 0,
            author_id: 0,
            author_name: 0
        }
    });
});

Meteor.publish("partnerArticles", function() {
    return Articles.find({
        'author_name':   "PARTNER",
        'is_published':  true
    }, {
        limit: 10,
        sort: {
            timestamp: -1
        },
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0,
            intro:  0,
            // timestamp: 0,
            category: 0,
            author_id: 0
        }
    });
});

Meteor.publish("adminArticleList", function(limit) {
    return Articles.find({}, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields:  {
            text: 0,
            photoset: 0,
            photoset_placement: 0,
            youtube_url: 0,
            intro: 0
        }
    });
});

Meteor.publish("partnerList", function() {
    return Partners.find({}, {
        sort: {
            order: 1
        }
    });
});

Meteor.publish("partnerDetail", function(id) {
    return Partners.find({
        "_id": id
    });
});

Meteor.publish("article", function(slug) {
    return Articles.find({
        "slug": slug
    });
});

Meteor.publish("dogs", function(slug) {
    return Dogs.find({}, {limit: 5, sort: {date: -1}});
});
