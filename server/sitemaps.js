newestArticleTime = Articles.findOne({'is_published': true}, {sort: {'timestamp': -1}}).timestamp;
newestWeaponArticleTime = Articles.findOne({'is_published': true, 'category': 'z'}, {sort: {'timestamp': -1}}).timestamp;

// sitemaps.add('/sitemap.xml', function() {
//   // 'page' is reqired
//   // 'lastmod', 'changefreq', 'priority' are optional.
//   return [
//     { page: '/kontakt', changefreq: 'never', priority: 0.4 },
//     { page: '/redakce', changefreq: 'never', priority: 0.4 },
//     // { page: 'archiv', lastmod: new Date().getTime() },
//     { page: '/', lastmod: newestArticleTime, changefreq: 'hourly', priority: 0.8 },
//     { page: '/zbrane', lastmod: newestWeaponArticleTime, changefreq: 'daily', priority: 0.7 },
//   ];
// });

sitemaps.add('/sitemap.xml', function() {
        var out = [
    { page: '/kontakt', changefreq: 'never', priority: 0.4 },
    { page: '/redakce', changefreq: 'never', priority: 0.4 },
    // { page: 'archiv', lastmod: new Date().getTime() },
    { page: '/', lastmod: newestArticleTime, changefreq: 'hourly', priority: 0.8 },
    { page: '/zbrane', lastmod: newestWeaponArticleTime, changefreq: 'daily', priority: 0.7 },
    ];
        pages = Articles.find().fetch();
        _.each(pages, function(page) {
            out.push({
                page: 'a/' + page.slug,
                lastmod: page.timestamp,
                priority: 0.9
            });
        });
        return out;
    });
