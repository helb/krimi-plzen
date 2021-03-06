document.addEventListener("DOMContentLoaded", function () {
    NodeList.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;

    if (typeof SVGUseElement !== "function") {
        document.querySelector(".site-logo img").style.display = "block";
    }

    const pageEl = document.querySelector(".page");
    const navEl = document.querySelector(".main-nav");

    document.querySelector(".sidebar-toggle").addEventListener("click", function () {
        pageEl.classList.toggle("shifted");
        if (navEl.classList.contains("opened")) {
            navEl.classList.remove("opened");
        }
    });

    document.querySelector(".main-nav-toggle").addEventListener("click", function () {
        navEl.classList.toggle("opened");
    });

    setTimeout(function () {
        document
            .querySelectorAll(
                "a[href]:not([href*='krimi-plzen.cz']):not([href^='/']):not([href^='#']):not([href^='?'])"
            )
            .forEach(link => {
                link.addEventListener("click", () => {
                    ga("send", "event", "outbound", "click", link.href, {
                        transport: "beacon"
                    });
                });
            });
    }, 1000);
});
