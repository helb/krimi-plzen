RssFeed.publish('clanky', function(query) {
  var self = this;
  self.setValue('title', self.cdata('Krimi Plzeň – články'));
  self.setValue('description', self.cdata('Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.'));
  self.setValue('link', 'http://www.krimi-plzen.cz/');
  self.setValue('lastBuildDate', new Date());
  self.setValue('pubDate', new Date());
  self.setValue('ttl', 1);
  // managingEditor, webMaster, language, docs, generator

  Articles.find({}, {sort: {timestamp:-1}, limit: 30}).forEach(function(article) {
    self.addItem({
      title: article.title,
      description: article.intro,
      link: 'http://www.krimi-plzen.cz/a/' + article.slug,
      pubDate: article.timestamp
      // title, description, link, guid, pubDate
    });
  });
});

RssFeed.publish('zbrane', function(query) {
  var self = this;
  self.setValue('title', self.cdata('Krimi Plzeň – články o zbraních'));
  self.setValue('description', self.cdata('Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.'));
  self.setValue('link', 'http://www.krimi-plzen.cz/');
  self.setValue('lastBuildDate', new Date());
  self.setValue('pubDate', new Date());
  self.setValue('ttl', 1);
  // managingEditor, webMaster, language, docs, generator

  Articles.find({'category': 'z'}, {sort: {timestamp:-1}, limit: 30}).forEach(function(article) {
    self.addItem({
      title: article.title,
      description: article.intro,
      link: 'http://www.krimi-plzen.cz/a/' + article.slug,
      pubDate: article.timestamp
      // title, description, link, guid, pubDate
    });
  });
});

RssFeed.publish('osoby', function(query) {
  var self = this;
  self.setValue('title', self.cdata('Krimi Plzeň – hledané osoby'));
  self.setValue('description', self.cdata('Sledujeme veškeré dění v oblasti bezpečnostní situace, práce policistů, strážníků, záchranářů, hasičů nebo prostě jen lidí, kteří se nebojí pomoci jiným v nouzi.'));
  self.setValue('link', 'http://www.krimi-plzen.cz/');
  self.setValue('lastBuildDate', new Date());
  self.setValue('pubDate', new Date());
  self.setValue('ttl', 1);
  // managingEditor, webMaster, language, docs, generator

  Articles.find({'category': 'o'}, {sort: {timestamp:-1}, limit: 30}).forEach(function(article) {
    self.addItem({
      title: article.title,
      description: article.intro,
      link: 'http://www.krimi-plzen.cz/a/' + article.slug,
      pubDate: article.timestamp
      // title, description, link, guid, pubDate
    });
  });
});