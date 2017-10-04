/* eslint no-var: 0, object-shorthand: 0 */
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
        "article-link": function (context) {
            var self = this;

            var ui = $.summernote.ui;

            // add gallery button
            context.memo("button.article-link", function () {
                // create button
                var button = ui.button({
                    contents: "Článek",
                    tooltip: "Odkaz na článek",
                    click: function () {
                        var articleURL = window.prompt("Adresa článku");
                        var urlFormat = new RegExp("^" + document.location.origin + "/a/[a-z0-9-]+/$");
                        if (articleURL.match(urlFormat)) {
                            var node = document.createElement("hr");
                            node.dataset.href = articleURL.replace(new RegExp("^" + document.location.origin + "/a/"), "").replace(/\/$/, "");
                            node.contentEditable = false;
                            node.classList.add("editor-article-link");
                            context.invoke("editor.insertNode", node);
                        } else {
                            alert("Špatný formát adresy.");
                        }
                    }
                });

                // create jQuery object from button instance.
                var $articleLink = button.render();
                return $articleLink;
            });

        }
    });
}));
