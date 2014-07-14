Template.archiv.events({
  'click button#form-archive-submit': function (event) {
    event.preventDefault();
    since = new Date($('#form-archive-since').val());
    since.setHours(0,0,0,0);
    until = new Date($('#form-archive-until').val());
    until.setHours(24,0,0,0);
    Session.set('archiveSince', since);
    Session.set('archiveUntil', until);
  },
});

Template.archiv.rendered = function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
  now = new Date();
  weekAgo = new Date(now.getTime() - (24*60*60*1000) * 3);
  console.log(now.toJSON().substr(0,10));
  console.log(weekAgo.toJSON().substr(0,10));
  $('#form-archive-since').val(weekAgo.toJSON().substr(0,10));
  $('#form-archive-until').val(now.toJSON().substr(0,10));
}