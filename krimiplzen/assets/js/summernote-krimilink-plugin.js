(function(factory) {
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
}(function($) {

    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        "article-link": function(context) {
            var self = this;

            var ui = $.summernote.ui;

            // add gallery button
            context.memo("button.article-link", function() {
                // create button
                var button = ui.button({
                    contents: "Článek",
                    tooltip: "Odkaz na článek",
                    click: function() {
                        var articleURL = window.prompt("Adresa článku");
                        // if (articleURL.match(/^https:\/\/www\.krimi-plzen\.cz/)) {
                        if (articleURL.match(/^http:\/\/localhost:8000/)) {
                            $.get(articleURL, function(data) {
                                var ogTitle = data.match(/<meta property="og:title" content="([^"]*)" \/>/m)[1];
                                var ogDescription = data.match(/<meta property="og:description" content="([^"]*)" \/>/m)[1];
                                var ogThumbnail = data.match(/<meta property="og:thumbnail" content="([^"]*)" \/>/m)[1];
                                var ogUrl = data.match(/<meta property="og:url" content="([^"]*)" \/>/m)[1];
                                var node = document.createElement("aside");
                                node.dataset.href = ogUrl;
                                node.classList.add("article-link");
                                var linkImage = document.createElement("img");
                                linkImage.classList.add("article-link-image");
                                linkImage.src = ogThumbnail;
                                var linkText = document.createElement("div");
                                linkText.classList.add("article-link-text");
                                var linkHeading = document.createElement("h3");
                                linkHeading.classList.add("article-link-text-title");
                                linkHeading.innerText = ogTitle;
                                linkText.appendChild(linkHeading);
                                var linkDescription = document.createElement("p");
                                linkDescription.classList.add("article-link-text-description");
                                linkDescription.innerText = ogDescription;
                                linkText.appendChild(linkDescription);
                                node.appendChild(linkImage);
                                node.appendChild(linkText);
                                context.invoke("editor.insertNode", node);
                                context.invoke("editor.disable");
                            });
                        } else {
                            alert("Špatný formát adresy.")
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
