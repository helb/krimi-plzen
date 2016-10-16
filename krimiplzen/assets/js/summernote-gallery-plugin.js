(function (factory) {
    /* global define */
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        // Node/CommonJS
        module.exports = factory(require("jquery"));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {

    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        "gallery": function (context) {
            var self = this;

            var ui = $.summernote.ui;

            // add gallery button
            context.memo("button.gallery", function () {
                // create button
                var button = ui.button({
                    contents: "▦ Galerie",
                    tooltip: "Galerie",
                    click: function() {
                        var node = document.createElement("div");
                        node.classList.add("gallery");
                        context.invoke("editor.insertNode", node);
                    }
                });

                // create jQuery object from button instance.
                var $gallery = button.render();
                return $gallery;
            });

        }
    });
}));
