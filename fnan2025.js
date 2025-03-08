function _0xed88(_0x17ce9f,_0x35b578){const _0x186777=_0x1867();return _0xed88=function(_0xed882b,_0x64895a){_0xed882b=_0xed882b-0x1a9;let _0x3fdf58=_0x186777[_0xed882b];return _0x3fdf58;},_0xed88(_0x17ce9f,_0x35b578);}(function(_0x1a07c0,_0x290bbd){const _0x330460=_0xed88,_0x4d0656=_0x1a07c0();while(!![]){try{const _0x579bbd=-parseInt(_0x330460(0x1bb))/0x1*(-parseInt(_0x330460(0x1b3))/0x2)+-parseInt(_0x330460(0x1b5))/0x3*(parseInt(_0x330460(0x1ad))/0x4)+parseInt(_0x330460(0x1ae))/0x5*(parseInt(_0x330460(0x1bd))/0x6)+parseInt(_0x330460(0x1ab))/0x7+parseInt(_0x330460(0x1b9))/0x8+-parseInt(_0x330460(0x1b7))/0x9*(-parseInt(_0x330460(0x1b6))/0xa)+parseInt(_0x330460(0x1ac))/0xb*(-parseInt(_0x330460(0x1b8))/0xc);if(_0x579bbd===_0x290bbd)break;else _0x4d0656['push'](_0x4d0656['shift']());}catch(_0x2bb421){_0x4d0656['push'](_0x4d0656['shift']());}}}(_0x1867,0xb7a5f),(function(){function _0x5a0e8d(){const _0x3dd826=_0xed88,_0x3f7599=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1ba)))||[],_0x4cc1ad=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1af)))||[];document[_0x3dd826(0x1b4)](_0x3dd826(0x1b0))[_0x3dd826(0x1b1)]=_0x3f7599['length'],document['getElementById'](_0x3dd826(0x1b2))[_0x3dd826(0x1b1)]=_0x4cc1ad[_0x3dd826(0x1aa)];}setInterval(_0x5a0e8d,0x64);}()));function _0x1867(){const _0x2fb949=['49126ChRkqc','590532eVdWPX','215bwfzlY','favorites','cart-notification','textContent','favorites-notification','1000424VCwhjY','getElementById','9GyGOeW','2760qVGcKC','18513PmFJpq','8676WTzWeU','9613416xohUoP','cart','2dtcgJi','parse','40620ooFNJP','getItem','length','9541679GGWfjL'];_0x1867=function(){return _0x2fb949;};return _0x1867();}

document.addEventListener("DOMContentLoaded", function () {
    let postContent = document.querySelector(".post-content") || document.querySelector(".post-body") || document.body;
    if (!postContent) return;

    setTimeout(() => {
        let images = [...postContent.querySelectorAll("img")];
        let videos = [...postContent.querySelectorAll("iframe")];

        if (images.length === 0 && videos.length === 0) return;

        let container = document.createElement("div");
        container.classList.add("media-container");

        // إنشاء سلايدر الصور
        if (images.length > 0) {
            let sliderContainer = document.createElement("div");
            sliderContainer.classList.add("slider-container");

            let mainImage = document.createElement("img");
            mainImage.classList.add("main-image");
            mainImage.src = images[0].src;
            sliderContainer.appendChild(mainImage);

            let thumbnailsContainer = document.createElement("div");
            thumbnailsContainer.classList.add("thumbnails");

            images.forEach(img => {
                let thumb = document.createElement("img");
                thumb.src = img.src;
                thumb.addEventListener("click", () => {
                    mainImage.src = img.src;
                });
                thumbnailsContainer.appendChild(thumb);
                img.style.display = "none"; // إخفاء الصور الأصلية
            });

            sliderContainer.appendChild(thumbnailsContainer);
            container.appendChild(sliderContainer);
        }

        // إنشاء سلايدر الفيديوهات
        if (videos.length > 0) {
            let videoContainer = document.createElement("div");
            videoContainer.classList.add("video-container");

            let videoWrapper = document.createElement("div");
            videoWrapper.classList.add("video-wrapper");

            videos.forEach((video, index) => {
                let wrapper = document.createElement("div");
                wrapper.classList.add("video-item");

                let title = document.createElement("h3");
                title.textContent = `فيديو المنتج ${index + 1}`;
                wrapper.appendChild(title);

                let clonedVideo = video.cloneNode(true);
                clonedVideo.style.display = "block";
                wrapper.appendChild(clonedVideo);

                videoWrapper.appendChild(wrapper);
                video.style.display = "none"; // إخفاء الفيديو الأصلي
            });

            videoContainer.appendChild(videoWrapper);
            container.appendChild(videoContainer);
        }

        postContent.insertBefore(container, postContent.firstChild);
    }, 1000); // تأخير لمدة ثانية لضمان تحميل المحتوى
});
