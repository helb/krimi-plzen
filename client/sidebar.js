Template.sidebar.helpers({
    iframe: function() {
        if (screen.width > 1100) {
            return "<iframe src='http://www.ceskasit.cz/bazar' style='width: 0; height: 0; display: none;'></iframe>";
        } else {
            return "";
        }
    }
});
