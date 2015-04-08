Template.archiv.events({
  'click button#form-archive-submit': function(event) {
    event.preventDefault();
    since = new Date($('#form-archive-since').val());
    since.setHours(0, 0, 0, 0);
    until = new Date($('#form-archive-until').val());
    until.setHours(23, 59, 59, 999);
    if (since > until) {
      since = [until, until = since][0]; //swap variables
      pickerSince.setDate(since);
      pickerUntil.setDate(until);
    }
    Session.set('archiveSince', since);
    Session.set('archiveUntil', until);
  },
});

Template.archiv.rendered = function() {
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth() + 1;
  var year = d.getFullYear();

  var prevMonth = month - 1;
  var prevYear = year;

  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  if (day < 10) {
    day = '0' + day
  }

  if (month < 10) {
    month = '0' + month
  }

  if (prevMonth < 10) {
    prevMonth = '0' + prevMonth
  }

  $('#form-archive-since').val(year + "-" + prevMonth + "-" + day);
  $('#form-archive-until').val(year + "-" + month + "-" + day);

  $("html, body").animate({
    scrollTop: 0
  }, 600);
}
