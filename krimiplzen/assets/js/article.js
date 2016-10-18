document.addEventListener("DOMContentLoaded", function (event) {
    const galleryLinks = document.querySelectorAll(".article-content .gallery a img");
    const arrowIcon = document.querySelector(".back-to-top img").src;

    function switchImage(thumb, img) {
        Array.from(document.querySelectorAll(".gallery-view-controls img")).forEach((thumb) => {
            thumb.classList.remove("current");
        });
        img.setAttribute("src", thumb.dataset.src);
        img.setAttribute("srcset", thumb.dataset.srcset);
        thumb.classList.add("current");
        thumb.parentNode.scrollLeft = thumb.offsetLeft - 30;
    }

    function removeGallery(galleryView) {
        galleryView.parentNode.removeChild(galleryView);
        document.onkeydown = null;
    }

    function switchToNext(galleryImageImg) {
        const thumb = document.querySelector(".gallery-view-controls .current");
        if (thumb.nextSibling) {
            switchImage(thumb.nextSibling, galleryImageImg);
        }
    }

    function switchToPrev(galleryImageImg) {
        const thumb = document.querySelector(".gallery-view-controls .current");
        if (thumb.previousSibling) {
            switchImage(thumb.previousSibling, galleryImageImg);
        }
    }

    function createGallery(thumbnails, current) {
        const galleryView = document.createElement("div");
        galleryView.classList.add("gallery-view");

        galleryView.addEventListener("click", function () {
            removeGallery(galleryView);
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
        const galleryImagePrevImg = document.createElement("img");
        galleryImagePrevImg.setAttribute("src", arrowIcon);
        galleryImagePrev.appendChild(galleryImagePrevImg);
        galleryImagePrev.addEventListener("click", function (event) {
            event.stopPropagation();
            switchToPrev(galleryImageImg);
        });
        galleryImage.appendChild(galleryImagePrev);

        const galleryImageNext = document.createElement("div");
        galleryImageNext.classList.add("gallery-view-image-next");
        const galleryImageNextImg = document.createElement("img");
        galleryImageNextImg.setAttribute("src", arrowIcon);
        galleryImageNext.appendChild(galleryImageNextImg);
        galleryImageNext.addEventListener("click", function (event) {
            event.stopPropagation();
            switchToNext(galleryImageImg);
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
                controlThumb.parentNode.scrollLeft = controlThumb.offsetLeft - 30;
            }
            controlThumb.addEventListener("click", function (event) {
                event.stopPropagation();
                switchImage(event.target, galleryImageImg);
            });
        });

        document.onkeydown = function (event) {
            switch (event.keyCode) {
            case 37:
                // left
                switchToPrev(galleryImageImg);
                break;
            case 39:
                // right
                switchToNext(galleryImageImg);
                break;
            case 27:
                // Esc
                removeGallery(galleryView);
                break;
            }
        };

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
