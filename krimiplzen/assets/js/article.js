document.addEventListener("DOMContentLoaded", function (event) {
    const galleryLinks = document.querySelectorAll(".article-content .gallery a img");

    function switchImage(thumb, img) {
        Array.from(document.querySelectorAll(".gallery-view-controls img")).forEach((thumb) => {
            thumb.classList.remove("current");
        });
        img.setAttribute("src", thumb.dataset.src);
        img.setAttribute("srcset", thumb.dataset.srcset);
        thumb.classList.add("current");
    }

    function createGallery(thumbnails, current) {
        const galleryView = document.createElement("div");
        galleryView.classList.add("gallery-view");

        galleryView.addEventListener("click", function () {
            galleryView.remove();
        });

        const galleryImage = document.createElement("div");
        galleryImage.classList.add("gallery-view-image");
        galleryView.appendChild(galleryImage);

        const galleryImageImg = document.createElement("img");
        galleryImageImg.setAttribute("src", current.dataset.src);
        galleryImageImg.setAttribute("srcset", current.dataset.srcset);
        galleryImage.appendChild(galleryImageImg);

        const galleryImagePrev = document.createElement("div");
        galleryImagePrev.classList.add("gallery-view-image-prev");
        galleryImagePrev.addEventListener("click", function (event) {
            event.stopPropagation();
            const thumb = document.querySelector(".gallery-view-controls .current");
            if (thumb.previousSibling) {
                switchImage(thumb.previousSibling, galleryImageImg);
            }
        });
        galleryImage.appendChild(galleryImagePrev);

        const galleryImageNext = document.createElement("div");
        galleryImageNext.classList.add("gallery-view-image-next");
        galleryImageNext.addEventListener("click", function (event) {
            event.stopPropagation();
            const thumb = document.querySelector(".gallery-view-controls .current");
            if (thumb.nextSibling) {
                switchImage(thumb.nextSibling, galleryImageImg);
            }
        });
        galleryImage.appendChild(galleryImageNext);

        const galleryViewClose = document.createElement("div");
        galleryViewClose.classList.add("gallery-view-close");
        galleryViewClose.addEventListener("click", function () {
            galleryView.remove();
        });
        galleryView.appendChild(galleryViewClose);

        const galleryControls = document.createElement("div");
        galleryControls.classList.add("gallery-view-controls");
        galleryView.appendChild(galleryControls);

        Array.from(thumbnails.children).forEach((thumb, index) => {
            const controlThumb = thumb.children[0].cloneNode();
            galleryControls.appendChild(controlThumb);
            if (controlThumb.dataset.src === current.dataset.src) {
                controlThumb.classList.add("current");
            }
            controlThumb.addEventListener("click", function (event) {
                event.stopPropagation();
                switchImage(event.target, galleryImageImg);
            });
        });

        document.body.appendChild(galleryView);
    }

    Array.from(galleryLinks).forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            const current = event.target;
            const thumbnails = event.target.parentNode.parentNode;
            createGallery(thumbnails, current);
        });
    });
});
