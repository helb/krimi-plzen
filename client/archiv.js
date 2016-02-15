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
        // setArchiveSession($('#form-archive-since').val(), $('#form-archive-until').val());
        var since = new Date($('#form-archive-since-d').val() + "-" + $('#form-archive-since-m').val() + "-" + $('#form-archive-since-y').val());
        var until = new Date($('#form-archive-until-d').val() + "-" + $('#form-archive-until-m').val() + "-" + $('#form-archive-until-y').val());
        setArchiveSession(since, until);
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

    $('#form-archive-since-d').val(since.getDate());
    $('#form-archive-since-m').val(('0' + (since.getMonth()+1)).slice(-2));
    $('#form-archive-since-y').val(since.getFullYear());

    $('#form-archive-until-d').val(until.getDate());
    $('#form-archive-until-m').val(('0' + (until.getMonth()+1)).slice(-2));
    $('#form-archive-until-y').val(until.getFullYear());
}
