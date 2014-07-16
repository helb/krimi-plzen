Template.archiv.events({
  'click button#form-archive-submit': function (event) {
    event.preventDefault();
    since = new Date($('#form-archive-since').val());
    since.setHours(0,0,0,0);
    until = new Date($('#form-archive-until').val());
    until.setHours(24,0,0,0);
    if(since>until){
      since = [until, until = since][0]; //swap variables
      pickerSince.setDate(since);
      pickerUntil.setDate(until);
    }
    Session.set('archiveSince', since);
    Session.set('archiveUntil', until);
  },
});

Template.archiv.rendered = function () {
  $("html, body").animate({ scrollTop: 0 }, 600);
i18n = {
    previousMonth : 'Předchozí měsíc',
    nextMonth     : 'Další měsíc',
    months        : ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
    weekdays      : ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'],
    weekdaysShort : ['Ne','Po','Út','St','Čt','Pá','So']
}
  now = new Date();
  yesterday = new Date(now.getTime() - (24*60*60*1000) * 1);
  weekAgo = new Date(now.getTime() - (24*60*60*1000) * 4);
  var pickerSince = new Pikaday({ field: document.getElementById('form-archive-since'), format: 'YYYY-MM-DD', defaultDate: weekAgo, setDefaultDate: true, firstDay: 1, i18n: i18n });
  var pickerUntil = new Pikaday({ field: document.getElementById('form-archive-until'), format: 'YYYY-MM-DD', defaultDate: yesterday, setDefaultDate: true, firstDay: 1, i18n: i18n  });
  // $('#form-archive-since').val(weekAgo.toJSON().substr(0,10));
  // $('#form-archive-until').val(yesterday.toJSON().substr(0,10));
}