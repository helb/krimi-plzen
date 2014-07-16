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
  pickerSince = new Pikaday({ field: document.getElementById('form-archive-since'), format: 'YYYY-MM-DD', defaultDate: Session.get('archiveSince'), setDefaultDate: true, firstDay: 1, i18n: i18n });
  pickerUntil = new Pikaday({ field: document.getElementById('form-archive-until'), format: 'YYYY-MM-DD', defaultDate: Session.get('archiveUntil'), setDefaultDate: true, firstDay: 1, i18n: i18n });
}