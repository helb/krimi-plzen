RssFeed.publish('clanky', function(query) {
    var self = this;
    self.setValue('title', self.cdata('Krimi Plzeň – články'));
    self.setValue('description', self.cdata('Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.'));
    self.setValue('link', 'http://www.krimi-plzen.cz/');
    self.setValue('lastBuildDate', new Date());
    self.setValue('pubDate', new Date());
    self.setValue('ttl', 1);

    var filter = {is_published: true};

    if (query.tag) {
        filter.category = query.tag;
    }

    Articles.find(filter, {
        sort: {
            timestamp: -1
        },
        limit: 30
    }).forEach(function(article) {
        self.addItem({
            "title": article.title,
            "link": 'http://www.krimi-plzen.cz/a/' + article.slug,
            "pubDate": article.timestamp,
            "guid": 'http://www.krimi-plzen.cz/a/' + article.slug,
            "description": "<![CDATA[<div><a href='http://www.krimi-plzen.cz/a/" + article.slug + "'><img src='http:" + article.photo_url + "' alt='" + article.title + "'></a></div><div><h1><a href='http://www.krimi-plzen.cz/a/" + article.slug + "'>" + article.title + "</a></h1><p>" + article.intro + "</p></div>]]>"
        });
    });
});

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
