function setArchiveSession(since, until) {
    since.setHours(0, 0, 0, 0);
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
        var sinceString = $('#form-archive-since-y').val() + "-" + $('#form-archive-since-m').val() + "-" + ('0' + ($('#form-archive-since-d').val())).slice(-2);
        var untilString = $('#form-archive-until-y').val() + "-" + $('#form-archive-until-m').val() + "-" + ('0' + ($('#form-archive-until-d').val())).slice(-2);
        setArchiveSession(new Date(sinceString), new Date(untilString));
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
    $('#form-archive-since-m').val(('0' + (since.getMonth() + 1)).slice(-2));
    $('#form-archive-since-y').val(since.getFullYear());

    $('#form-archive-until-d').val(until.getDate());
    $('#form-archive-until-m').val(('0' + (until.getMonth() + 1)).slice(-2));
    $('#form-archive-until-y').val(until.getFullYear());
}
