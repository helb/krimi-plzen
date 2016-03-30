Meteor.publishAuth = function(name, fn) {
    Meteor.publish(name, function() {
        if (!this.userId) {
            return this.ready();
        }
        return fn.apply(this, arguments);
    });
};

var articleLinkFields = {
    slug: 1,
    title: 1,
    intro:  1,
    photo_url: 1,
    timestamp: 1,
    is_published: 1
}

Meteor.publish("newArticles", function(limit) {
    var dateOffset = (24 * 60 * 60 * 1000) * limit;
    var daysAgo = new Date();
    daysAgo.setTime(daysAgo.getTime() - dateOffset);
    daysAgo.setHours(0, 0, 0, 500);

    return Articles.find({
        "is_published":  true,
        "timestamp": {
            $gte: daysAgo
        },
    }, {
        sort: {
            timestamp: -1
        },
        fields:  articleLinkFields
    });
});

Meteor.publish("newArticlesLatest", function(limit) {
    return Articles.find({
        "is_published":  true
    }, {
        limit: 10,
        sort: {
            timestamp: -1
        },
        fields: articleLinkFields
    });
});

Meteor.publish("archiveArticles", function(since, until) {
    return Articles.find({
        "is_published":  true,
        "timestamp": {
            $gte: since,
            $lte: until
        }
    }, {
        sort: {
            timestamp: -1
        },
        fields: articleLinkFields
    });
});

Meteor.publish("weaponArticles", function(limit) {
    return Articles.find({
        "category": "z",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields: articleLinkFields
    });
});

Meteor.publish("minimumUliceArticles", function(limit) {
    return Articles.find({
        "category": "pravni-minimum-ulice",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields: articleLinkFields
    });
});

Meteor.publish("zachranariArticles", function(limit) {
    return Articles.find({
        "category": "zachranari",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields: articleLinkFields
    });
});

Meteor.publish("hasiciArticles", function(limit) {
    return Articles.find({
        "category": "hasici",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields: articleLinkFields
    });
});

Meteor.publish("mountainArticles", function(limit) {
    return Articles.find({
        "category": "mountains",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        limit: limit,
        fields: articleLinkFields
    });
});

Meteor.publish("personArticles", function() {
    this.unblock();
    return Articles.find({
        "category": "o",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        fields: _.extend(articleLinkFields, {
            category:  1
        })
    });
});

Meteor.publish("recruitmentArticles", function() {
    this.unblock();
    return Articles.find({
        "category": "recruitment",
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        fields: _.extend(articleLinkFields, {
            category:  1
        })
    });
});


Meteor.publish("recommendedArticles", function() {
    this.unblock();
    return Articles.find({
        "is_recommended":  true,
        "is_published":  true
    }, {
        sort: {
            timestamp: -1
        },
        fields: _.extend(articleLinkFields, {
            is_recommended: 1
        })
    });
});

Meteor.publish("partnerArticles", function() {
    this.unblock();
    return Articles.find({
        "author_name": "PARTNER",
        "is_published":  true
    }, {
        limit: 10,
        sort: {
            timestamp: -1
        },
        fields: _.extend(articleLinkFields, {
            author_name:  1
        })
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
    this.unblock();
    return Partners.find({}, {
        sort: {
            order: 1
        }
    });
});

Meteor.publish("partnerDetail", function(id) {
    this.unblock();
    return Partners.find({
        "_id": id
    });
});

Meteor.publish("article", function(slug) {
    return Articles.find({
        "slug": slug
    }, {
        fields:  {
            author_id: 0,
            is_recommended: 0,
            photoset_placement: 0
        }
    });
});

Meteor.publish("dogs", function(slug) {
    this.unblock();
    return Dogs.find({}, {
        limit:  5,
        sort: {
            date:  -1
        },
        fields:  {
            date: 0
        }
    });
});
