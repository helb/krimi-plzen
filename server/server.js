Accounts.config({
    loginExpirationInDays: null,
    forbidClientAccountCreation: true
});

Meteor.methods({
    articleExists: function(slug) {
        article = Articles.findOne({
            "slug": slug
        });
        if (typeof article == "undefined") {
            return false;
        } else {
            return true;
        }
    }
});

var fetchDogs = function() {
    var response = HTTP.get("http://utulekplzen.cz/category/aktualne-prijati-psi/feed");

    xml2js.parseString(response.content, function(err, result) {
        var items = result.rss.channel[0].item;
        items.forEach(function(item) {
            var dog = {
                description: item.description[0].replace(/(, přijat| Přijat).*/, ""),
                link: item.link[0],
                image: item["content:encoded"].toString().replace(/(\r\n|\n|\r)/gm, "").replace(/^.*src="/, "").replace(/" alt.*/, ""),
                date: new Date(item.pubDate[0])
            };
            if(!Dogs.findOne({link: dog.link})) {
                Dogs.insert(dog);
            }
        });
    });
};

Meteor.startup(function() {
    Articles._ensureIndex({
        "slug": 1,
        "category":  1,
        "timestamp": -1
    });

    Meteor.setInterval(fetchDogs, 3600000);
    fetchDogs();
});
