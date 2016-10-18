document.addEventListener("DOMContentLoaded", function (event) {
    const partnerSliderInner = document.querySelector(".article-list-partner-slider-inner");
    const partnerSliderControls = document.querySelector(".article-list-partner-slider-controls");
    const partnerCount = partnerSliderInner.children.length;
    const slidePartners = function (position) {
        console.log(position);
        Array.from(partnerSliderControls.children).forEach((item) => {
            item.classList.remove("current");
        });
        partnerSliderInner.style.transform = "translateX(" + (-100 / partnerCount * position) + "%)";
        partnerSliderControls.children[position].classList.add("current");
    };

    for (let i = partnerCount; i >= 0; i--) {
        const position = Math.random() * i | 0;
        partnerSliderInner.appendChild(partnerSliderInner.children[position]);
        partnerSliderControls.appendChild(partnerSliderControls.children[position]);
    }

    // for (let i = partnerCount; i >= 0; i--) {
    //     console.log(partnerSliderControls.children[i]);
    //     partnerSliderControls.children[i].setAttribute("data-position", i - 1); // .dataset.position = i;
    // }
    partnerSliderControls.children[0].classList.add("current");

    let sliderPosition = 0;

    const slideTimer = setInterval(function () {
        sliderPosition += 1;
        if (sliderPosition >= partnerCount) {
            sliderPosition = 0;
        }
        slidePartners(sliderPosition);
    }, 4500);

    Array.from(partnerSliderControls.children).forEach((item, index) => {
        item.dataset.position = index;
        item.addEventListener("click", function (event) {
            clearInterval(slideTimer);
            event.stopPropagation();
            slidePartners(parseInt(event.target.parentNode.dataset.position));
        });
    });
});
