function dateToString(date) {
  return date.toISOString().slice(0, 10);
}

function setArchiveSession(since, until) {
  console.log("since " + since);
  console.log("until " + until);

  var since = new Date(since);
  since.setHours(0, 0, 0, 0);
  var until = new Date(until);
  until.setHours(23, 59, 59, 999);

  if (since > until) {
    since = [until, until = since][0]; //swap variables
  }

  Session.set('archiveSince', since);
  Session.set('archiveUntil', until);
}

Template.archiv.events({
  'click button#form-archive-submit': function(event) {
    event.preventDefault();
    setArchiveSession($('#form-archive-since').val(), $('#form-archive-until').val());
  },
});

Template.archiv.rendered = function() {
  if (typeof Session.get("archiveSince") === "undefined" ||
    typeof Session.get("archiveUntil") === "undefined") {
    var now = new Date();
    var until = now.getDate() - Session.get("currentLimit");
    var since = until.getDate() - 7;
  } else {
    var until = Session.get("archiveUntil");
    var since = Session.get("archiveSince")
  }

  $('#form-archive-since').val(dateToString(since));
  $('#form-archive-until').val(dateToString(until));

  $("html, body").animate({
    scrollTop: 0
  }, 600);
}