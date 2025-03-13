document.addEventListener("DOMContentLoaded", function() {
    let postContent = document.querySelector(".post-body.entry-content");
    if (!postContent) return;

    let images = postContent.querySelectorAll("img");
    let videos = postContent.querySelectorAll("iframe");

    if (images.length === 0 && videos.length === 0) return;

    let container = document.createElement("div");
    container.classList.add("container");

    let sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    // إنشاء سلايدر الصور
    if (images.length > 0) {
        let mainImage = document.createElement("img");
        mainImage.classList.add("main-image");
        mainImage.src = images[0].src;
        sliderContainer.appendChild(mainImage);

        let thumbnailsContainer = document.createElement("div");
        thumbnailsContainer.classList.add("thumbnails");

        images.forEach((img) => {
            let thumb = document.createElement("img");
            thumb.src = img.src;
            thumb.addEventListener("click", function () {
                mainImage.src = img.src;
            });
            thumbnailsContainer.appendChild(thumb);
            img.style.display = "none"; // إخفاء الصور الأصلية
        });

        sliderContainer.appendChild(thumbnailsContainer);
    }

    container.appendChild(sliderContainer);

    // إنشاء سلايدر الفيديوهات مع الحماية
    if (videos.length > 0) {
        let videoSliderContainer = document.createElement("div");
        videoSliderContainer.classList.add("video-slider-container");

        videos.forEach((video, index) => {
            let videoContainer = document.createElement("div");
            videoContainer.classList.add("video-container");
            let postId = document.querySelector("meta[itemprop='postId']").content; // استخراج post_id الصحيح

            let videoTitle = document.createElement("h3");
            videoTitle.textContent = "فيديو الدرس " + (index + 1);
            videoContainer.appendChild(videoTitle);

            // إدخال الكود
            let codeInput = document.createElement("input");
            codeInput.type = "text";
            codeInput.placeholder = "أدخل كود الفيديو لتشغيله";
            videoContainer.appendChild(codeInput);

            let playButton = document.createElement("button");
            playButton.textContent = "تشغيل الفيديو";
            playButton.setAttribute("data-post-id", postId);
            videoContainer.appendChild(playButton);

            let errorMessage = document.createElement("span");
            errorMessage.style.color = "red";
            errorMessage.style.display = "none";
            videoContainer.appendChild(errorMessage);

            // حدث عند الضغط على زر التشغيل
            playButton.addEventListener("click", function () {
                let code = codeInput.value.trim();
                let postId = playButton.getAttribute("data-post-id");

                if (!code) {
                    errorMessage.textContent = "❌ يرجى إدخال الكود!";
                    errorMessage.style.display = "block";
                    return;
                }

                let url = "https://script.google.com/macros/s/AKfycbxxO1_Y99tfntPg0zhHAV0m6OUj_n7X9PcvpGiBTFImJSaBoVC4M3F7k_0x6_yRqCOppA/exec";
                let params = `?post_id=${postId}&code=${code}`;

                fetch(url + params)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "Success") {
                            let videoUrl = data.videoUrl; // الرابط الذي تم جلبه من العمود 11
                            let iframe = document.createElement("iframe");
                            iframe.src = videoUrl;
                            iframe.width = "560";
                            iframe.height = "315";
                            iframe.allowFullscreen = true;
                            videoContainer.appendChild(iframe);
                            iframe.style.display = "block";
                            codeInput.style.display = "none";
                            playButton.style.display = "none";
                            errorMessage.style.display = "none";
                        } else {
                            errorMessage.textContent = data.message;
                            errorMessage.style.display = "block";
                        }
                    })
                    .catch(error => {
                        errorMessage.textContent = "❌ خطأ أثناء الاتصال بالسيرفر!";
                        errorMessage.style.display = "block";
                    });
            });

            videoSliderContainer.appendChild(videoContainer);
            video.style.display = "none"; // إخفاء الفيديوهات الأصلية
        });

        // إنشاء مصغرات الفيديوهات
        let videoThumbnailsContainer = document.createElement("div");
        videoThumbnailsContainer.classList.add("video-thumbnails");

        videos.forEach((video, index) => {
            let thumb = document.createElement("img");
            thumb.src = "https://img.youtube.com/vi/" + video.src.split("/")[4] + "/0.jpg";
            thumb.addEventListener("click", function () {
                videoSliderContainer.querySelectorAll('.video-container').forEach(container => container.classList.remove('active'));
                videoSliderContainer.querySelectorAll('.video-container')[index].classList.add('active');
            });
            videoThumbnailsContainer.appendChild(thumb);
        });

        videoSliderContainer.appendChild(videoThumbnailsContainer);
        container.appendChild(videoSliderContainer);
    }

    postContent.insertBefore(container, postContent.firstChild);
});