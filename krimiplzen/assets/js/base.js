import Raven from "raven-js";

(function (i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

Raven.config("https://cd567997671c4ed1a08e6c6ad040b3ce@sentry.helb.cz/3").install();
ga("create", "UA-52320835-1", "auto");
ga("send", "pageview");

document.addEventListener("DOMContentLoaded", function (event) {
    if (typeof SVGUseElement !== "function") {
        document.querySelector(".site-logo img").style.display = "block";
    };

    const pageEl = document.querySelector(".page");
    const navEl =document.querySelector(".main-nav");

    document.querySelector(".sidebar-toggle").addEventListener("click", function (event) {
        pageEl.classList.toggle("shifted");
        if (navEl.classList.contains("opened")) {
            navEl.classList.remove("opened");
        }
    });

    document.querySelector(".main-nav-toggle").addEventListener("click", function (event) {
        navEl.classList.toggle("opened");
    });
});
