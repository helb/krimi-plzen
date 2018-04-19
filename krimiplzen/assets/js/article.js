document.addEventListener("DOMContentLoaded", function(event) {
    window.sliders = {};

    function removeGallery() {
        const galleryView = document.querySelector(".gallery-view.visible");
        document.onkeydown = null;
        if (galleryView) {
            galleryView.classList.remove("visible");
        }
    }

    function createGallery(thumbnails, galleryIndex) {
        const galleryView = document.createElement("div");
        galleryView.classList.add("gallery-view");

        const galleryImages = document.createElement("div");
        galleryImages.classList.add("gallery-view-images");
        galleryView.appendChild(galleryImages);

        const galleryViewClose = document.createElement("div");
        galleryViewClose.classList.add("gallery-view-close");
        galleryViewClose.addEventListener("click", function() {
            window.sliders["slider" + galleryIndex].goTo(0);
            removeGallery(galleryView);
        });
        galleryView.appendChild(galleryViewClose);

        const galleryViewPrev = document.createElement("div");
        galleryViewPrev.classList.add("gallery-view-prev");
        galleryViewPrev.addEventListener("click", function() {
            window.sliders["slider" + galleryIndex].prev();
        });
        galleryView.appendChild(galleryViewPrev);

        const galleryViewNext = document.createElement("div");
        galleryViewNext.classList.add("gallery-view-next");
        galleryViewNext.addEventListener("click", function() {
            window.sliders["slider" + galleryIndex].next();
        });
        galleryView.appendChild(galleryViewNext);

        const galleryControls = document.createElement("div");
        galleryControls.classList.add("gallery-view-controls");
        galleryView.appendChild(galleryControls);

        Array.from(thumbnails.getElementsByTagName("a")).forEach(
            (thumb, index) => {
                const link = document.createElement("a");
                const data = thumb.children[0].dataset;
                link.href = data.src;
                link.innerHTML = thumb.innerHTML;
                galleryControls.appendChild(link);

                const slide = document.createElement("div");
                slide.classList.add("gallery-view-images-slide");
                slide.style.width = document.documentElement.clientWidth;
                const pict = document.createElement("picture");
                data.jpeg.split(", ").forEach(source => {
                    let media = "";
                    if (source.endsWith("1440w")) {
                        media = `media="(min-width: 800px)"`;
                    } else {
                        media = `media="(max-width: 800px)"`;
                    }
                    let url = source.split(" ")[0];
                    pict.innerHTML += `<source type="image/jpeg" data-srcset="${url}" ${media}>`;
                });
                pict.innerHTML += `<img data-src="${data.src}" />`;
                slide.appendChild(pict);
                galleryImages.appendChild(slide);

                thumb.addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    galleryControls
                        .querySelectorAll("a")
                        .forEach(link => link.classList.remove("current"));
                    Array.from(
                        this.parentNode.querySelectorAll("[data-srcset]")
                    ).forEach(el => {
                        el.setAttribute("srcset", el.dataset.srcset);
                    });
                    Array.from(
                        this.parentNode.querySelectorAll("[data-src]")
                    ).forEach(el => {
                        el.setAttribute("src", el.dataset.src);
                    });
                    this.parentNode
                        .querySelector(".gallery-view")
                        .classList.add("visible");

                    if (!window.sliders["slider" + galleryIndex]) {
                        window.sliders["slider" + galleryIndex] = new Siema({
                            selector: galleryImages,
                            onInit: function() {
                                document.addEventListener("keydown", function(
                                    event
                                ) {
                                    switch (event.keyCode) {
                                        case 37:
                                            // left
                                            window.sliders[
                                                "slider" + galleryIndex
                                            ].prev();
                                            break;
                                        case 39:
                                            // right
                                            window.sliders[
                                                "slider" + galleryIndex
                                            ].next();
                                            break;
                                        case 27:
                                            // Esc
                                            window.sliders[
                                                "slider" + galleryIndex
                                            ].goTo(0);
                                            removeGallery(galleryView);
                                            break;
                                    }
                                });
                            },
                            onChange: function() {
                                galleryControls
                                    .querySelectorAll("a")
                                    .forEach(link =>
                                        link.classList.remove("current")
                                    );
                                let current =
                                    window.sliders["slider" + galleryIndex]
                                        .currentSlide;
                                galleryControls
                                    .querySelectorAll("a")
                                    [current].classList.add("current");
                            }
                        });
                    }

                    console.log(index);
                    window.sliders["slider" + galleryIndex].goTo(index);
                    galleryControls
                        .querySelectorAll("a")
                        [index].classList.add("current");

                    galleryControls
                        .querySelectorAll("a")
                        .forEach((link, controlindex) =>
                            link.addEventListener("click", function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                window.sliders["slider" + galleryIndex].goTo(
                                    controlindex
                                );
                                galleryControls
                                    .querySelectorAll("a")
                                    .forEach(link =>
                                        link.classList.remove("current")
                                    );
                                galleryControls
                                    .querySelectorAll("a")
                                    [controlindex].classList.add("current");
                            })
                        );
                });
            }
        );

        thumbnails.appendChild(galleryView);
    }

    Array.from(document.querySelectorAll(".article-content .gallery")).forEach(
        (gallery, galleryIndex) => {
            createGallery(gallery, galleryIndex);
        }
    );
});
