class imageGallery {
    constructor(thumbsDiv) {
        this.state = {
            thumbs: thumbsDiv.querySelectorAll("a"),
            galleryDiv: null,
            current: null,
            opened: false
        };
    }

    closeGallery() {
        document.removeEventListener("keydown");
        this.state.galleryDiv.remove();
        this.state = {
            ...this.state,
            galleryDiv: null,
            current: null,
            opened: false
        };
    }

    openGallery() {
        const component = this;

        const createGalleryView = () => {
            const galleryView = document.createElement("div");
            galleryView.classList.add("gallery-view");
            galleryView.addEventListener("click", () => component.closeGallery);
            return galleryView;
        };

        const addCloseButton = (galleryView) => {
            const galleryViewClose = document.createElement("div");
            galleryViewClose.classList.add("gallery-view-close");
            galleryViewClose.addEventListener("click", () => component.closeGallery);
            galleryView.appendChild(galleryViewClose);
        };

        const addControlButtons = (imageContainer) => {
            const arrowIcon = document.querySelector(".back-to-top img").src;

            const galleryImagePrev = document.createElement("div");
            galleryImagePrev.classList.add("gallery-view-image-prev");
            const galleryImagePrevImg = document.createElement("img");
            galleryImagePrevImg.setAttribute("src", arrowIcon);
            galleryImagePrev.appendChild(galleryImagePrevImg);
            galleryImagePrev.addEventListener("click", (event) => {
                event.stopPropagation();
                component.switchToPrev();
            });
            galleryImage.appendChild(galleryImagePrev);

            const galleryImageNext = document.createElement("div");
            galleryImageNext.classList.add("gallery-view-image-next");
            const galleryImageNextImg = document.createElement("img");
            galleryImageNextImg.setAttribute("src", arrowIcon);
            galleryImageNext.appendChild(galleryImageNextImg);
            galleryImageNext.addEventListener("click", (event) => {
                event.stopPropagation();
                component.switchToNext();
            });
            galleryImage.appendChild(galleryImageNext);
        };

        const addImageContainer = (galleryView) => {
            const galleryImage = document.createElement("div");
            galleryImage.classList.add("gallery-view-image");
            const galleryImageImg = document.createElement("img");
            galleryImageImg.setAttribute("src", current.dataset.src);
            galleryImageImg.setAttribute("srcset", current.dataset.srcset);
            galleryImage.appendChild(galleryImageImg);
            galleryView.appendChild(galleryImage);
        };

        const addKeyboardListener = () => {
            document.addEventListener("keydown", (event) => {
                switch (event.keyCode) {
                    case 37:
                        // left
                        this.switchToPrev();
                        break;
                    case 39:
                        // right
                        this.switchToNext();
                        break;
                    case 27:
                        // Esc
                        this.closeGallery();
                        break;
                }
            });
        };

        const galleryView = createGalleryView();
        addCloseButton(galleryView);
        const imageContainer = addImageContainer(galleryView);
        addControlButtons(imageContainer);
        addKeyboardListener();

        document.body.appendChild(galleryView);

        this.state = {
            ...this.state,
            galleryDiv: galleryView,
            opened: true
        };
    }

    switchToPosition(index) {
        this.state.current = index;
    }

    switchToPrev() {
        if (this.state.current > 1) {
            this.switchToPosition(this.state.current - 1);
        };
    }

    switchToNext() {
        if (this.state.current < this.state.thumbs.length - 1) {
            this.switchToPosition(this.state.current - 1);
        };
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const galleryLinks = document.querySelectorAll(".article-content .gallery a img");

    function switchImage(thumb, img) {
        Array.from(document.querySelectorAll(".gallery-view-controls img")).forEach((thumb) => {
            thumb.classList.remove("current");
        });
        img.setAttribute("src", thumb.dataset.src);
        img.setAttribute("srcset", thumb.dataset.srcset);
        thumb.classList.add("current");
        thumb.parentNode.scrollLeft = thumb.offsetLeft - 30;
    }

    function createGallery(thumbnails, current) {

        const galleryControls = document.createElement("div");
        galleryControls.classList.add("gallery-view-controls");
        galleryView.appendChild(galleryControls);

        Array.from(thumbnails.getElementsByTagName("a")).forEach((thumb, index) => {
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
