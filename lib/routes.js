Router.configure({
    layoutTemplate: "masterLayout",
    loadingTemplate: "loading",
    notFoundTemplate: "notFound",
    trackPageView: true
});

listSubs = new SubsManager({
    cacheLimit: 9999,
    expireIn: 9999
});

articleSubs = new SubsManager({
    cacheLimit: 20,
    expireIn: 10
});

Router.map(function() {
    this.route("newArticles", {
        path: "/",
        cache: true,
        fastRender: true,
        waitOn: function() {
            if (Meteor.isClient) {
                if (!Session.get("currentLimit")) {
                    Session.set("currentLimit", 7);
                };
                return listSubs.subscribe("newArticles", Session.get("currentLimit"));
            }
        },
        data: function() {
            listSubs.subscribe("partnerList");
            var dateOffset = (24 * 60 * 60 * 1000) * Session.get("currentLimit");
            var daysAgo = new Date();
            daysAgo.setTime(daysAgo.getTime() - dateOffset)
            daysAgo.setHours(0, 0, 0, 0);
            var templateData = {
                articles:  Articles.find({
                    "is_published": true,
                    "timestamp": {
                        $gte: daysAgo
                    }
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch(),
                partners: _.shuffle(Partners.find({
                    is_enabled: true
                }).fetch()),

            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Nejnovější články");
            Meta.set("og:title", "Krimi Plzeň");
            Meta.set("og:url", "http://www.krimi-plzen.cz/");
            Meta.set("og:image", "http://static.krimi-plzen.cz/images/kp-og.png");
            Meta.set("og:description", "Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
        }
    });

    this.route("redakce", {
        onBeforeAction: function() {
            this.redirect("/kontakt");
        }
    });


    this.route("kontakt", {
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Kontakt");
            // GAnalytics.pageview();
        },
        fastRender: true
    });

    this.route("archiv", {
        path: "/archiv",
        waitOn: function() {
            if (!Meteor.isClient) {
                return;
            }

            if (!Session.get("currentLimit")) {
                Session.set("currentLimit", 3);
            }
            if (!Session.get("archiveSince")) {
                var dateOffset = (24 * 60 * 60 * 1000) * (Session.get("currentLimit") + 2);
                var daysAgo = new Date();
                daysAgo.setTime(daysAgo.getTime() - dateOffset);
                daysAgo.setHours(0, 0, 0, 0);
                Session.set("archiveSince", daysAgo);
            };
            if (!Session.get("archiveUntil")) {
                var dateOffset = (24 * 60 * 60 * 1000) * Session.get("currentLimit");
                var daysAgo = new Date();
                daysAgo.setTime(daysAgo.getTime() - dateOffset);
                daysAgo.setHours(23, 59, 59, 999);
                Session.set("archiveUntil", daysAgo);
            };
            return listSubs.subscribe("archiveArticles", Session.get("archiveSince"), Session.get("archiveUntil"));
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "timestamp": {
                        $gte: Session.get("archiveSince"),
                        $lte: Session.get("archiveUntil")
                    }
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch()
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Archiv");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });

    this.route("weaponArticles", {
        path: "/zbrane",
        waitOn: function() {
            return listSubs.subscribe("weaponArticles", 99);
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "category": "z"
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch()
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Zbraně");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });

    this.route("minimumUliceArticles", {
        path: "/pravni-minimum-ulice",
        waitOn: function() {
            return listSubs.subscribe("minimumUliceArticles", 99);
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "category": "pravni-minimum-ulice"
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch()
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Právní minimum ulice");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });

    this.route("zachranariArticles", {
        path: "/zachranari",
        waitOn: function() {
            return listSubs.subscribe("zachranariArticles", 99);
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "category": "zachranari"
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch()
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Záchranáři");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });


    this.route("hasiciArticles", {
        path: "/hasici",
        waitOn: function() {
            return listSubs.subscribe("hasiciArticles", 99);
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "category": "hasici"
                }, {
                    sort: {
                        timestamp: -1
                    }
                })
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Hasiči");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });


    this.route("mountainArticles", {
        path: "/horska-sluzba",
        waitOn: function() {
            return listSubs.subscribe("mountainArticles", 99);
        },
        cache: true,
        fastRender: true,
        data: function() {
            var templateData = {
                articles: Articles.find({
                    "category": "mountains"
                }, {
                    sort: {
                        timestamp: -1
                    }
                }).fetch()
            };
            return templateData;
        },
        onAfterAction: function() {
            if (!Meteor.isClient) {
                return;
            }
            Meta.setTitle("Horská služba");
            Meta.set("viewport", "width=device-width, initial-scale=1.0")
                // GAnalytics.pageview();
        }
    });


    this.route("articleShow", {
        path: "/a/:slug",
        fastRender: true,
        cache:  true,
        waitOn: function() {
            return articleSubs.subscribe("article", this.params.slug);
        },
        data: function() {
            var templateData = {
                article: Articles.findOne({
                    slug:  this.params.slug
                })
            };
            return templateData;
        },
        onAfterAction: function() {
            var article;
            if (!Meteor.isClient) {
                return;
            }
            article = this.data().article;
            var photo_url = "";
            if (typeof article != "undefined") {
                if (typeof article.photo_url != "undefined") {
                    photo_url = article.photo_url.replace("_q.jpg", "_b.jpg");
                } else {
                    photo_url = "https://farm4.staticflickr.com/3921/15159532768_129e15feb2_o.jpg";
                }
                Meta.setTitle(article.title);
                Meta.set("og:title", article.title);
                Meta.set("description", article.intro);
                Meta.set("og:description", article.intro);
                Meta.set("og:type", "article");
                Meta.set("og:image", article.photo_url.replace("_q", "_b"));
                Meta.set("og:updated_time", Math.floor(article.timestamp.getTime() / 1000));
                Meta.set("viewport", "width=device-width, initial-scale=1.0")
            }
            /* else {
              this.render("notFound");
            }*/
        }
    });

    this.route("adminArticleAdd", {
        path: "/admin/article/add",
        layoutTemplate: "adminLayout",
        onBeforeAction: function() {
            if (!Meteor.userId()) {
                this.redirect("/");
            } else {
                this.next();
            }
        },
        trackPageView: false
    });

    this.route("adminArticleList", {
        path: "/admin/article",
        layoutTemplate: "adminLayout",
        onBeforeAction: function() {
            if (!Meteor.userId()) {
                this.redirect("/");
            } else {
                this.next();
            }
        },
        waitOn: function() {
            return listSubs.subscribe("adminArticleList", 15);
        },
        data: function() {
            var templateData = {
                articles: Articles.find({
                    author_name: {
                        $ne: "PARTNER"
                    }
                }, {
                    sort: {
                        timestamp: -1
                    }
                })
            };
            return templateData;
        },
        trackPageView: false
    });

    this.route("adminArticleEdit", {
        path: "/admin/article/:slug",
        layoutTemplate: "adminLayout",
        onBeforeAction: function() {
            if (!Meteor.userId()) {
                this.redirect("/");
            } else {
                this.next();
            }
        },
        waitOn: function() {
            return articleSubs.subscribe("article", this.params.slug);
        },
        data: function() {
            var templateData = {
                article: Articles.findOne({
                    slug:  this.params.slug
                })
            };
            return templateData;
        },
        trackPageView: false
    });

    this.route("adminIndex", {
        path: "/admin/",
        layoutTemplate: "adminLayout",
        onBeforeAction: function() {
            this.redirect("/admin/article");
        },
        trackPageView: false
    });

    this.route("a", {
        path: "/a",
        onBeforeAction: function() {
            this.redirect("/");
        }
    });

});
