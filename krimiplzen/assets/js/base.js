document.addEventListener("DOMContentLoaded", function (event) {
    if (typeof SVGUseElement !== "function") {
        document.querySelector(".site-logo img").style.display = "block";
    };

    const pageEl = document.querySelector(".page");
    const navEl = document.querySelector(".main-nav");

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
