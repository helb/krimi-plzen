(function() {
    if (typeof NodeList.prototype.forEach === "function") return false;
    NodeList.prototype.forEach = Array.prototype.forEach;
})();

document.addEventListener("DOMContentLoaded", function(event) {
    if (typeof SVGUseElement !== "function") {
        document.querySelector(".site-logo img").style.display = "block";
    }

    const pageEl = document.querySelector(".page");
    const navEl = document.querySelector(".main-nav");

    document.querySelector(".sidebar-toggle").addEventListener("click", () => {
        pageEl.classList.toggle("shifted");
        if (navEl.classList.contains("opened")) {
            navEl.classList.remove("opened");
        }
    });

    document.querySelector(".main-nav-toggle").addEventListener("click", () => {
        navEl.classList.toggle("opened");
    });

    setTimeout(() => {
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
