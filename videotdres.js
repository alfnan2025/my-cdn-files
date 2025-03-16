document.addEventListener("DOMContentLoaded", function() {
    let postContent = document.querySelector(".post-body.entry-content");
    if (!postContent) return;

    let videos = postContent.querySelectorAll("iframe");

    if (videos.length === 0) return;

    let videoSliderContainer = document.createElement("div");
    videoSliderContainer.classList.add("video-slider-container");

    videos.forEach((video, index) => {
        let videoContainer = document.createElement("div");
        videoContainer.classList.add("video-container");

        let videoTitle = document.createElement("h3");
        videoTitle.textContent = "فيديو المحاضرة " + (index + 1);
        videoContainer.appendChild(videoTitle);

        // إدخال الكود
        let codeInput = document.createElement("input");
        codeInput.type = "text";
        codeInput.placeholder = "أدخل كود الفيديو هنا";
        videoContainer.appendChild(codeInput);

        let playButton = document.createElement("button");
        playButton.textContent = "تشغيل الفيديو";
        videoContainer.appendChild(playButton);

        let errorMessage = document.createElement("span");
        errorMessage.style.color = "red";
        errorMessage.style.display = "none";
        videoContainer.appendChild(errorMessage);

        let postId = document.querySelector("meta[itemprop='postId']").content;

        // حدث عند الضغط على زر التشغيل
        playButton.addEventListener("click", function () {
            let code = codeInput.value.trim();

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
        video.style.display = "none"; // إخفاء الفيديو الأصلي
    });

    postContent.insertBefore(videoSliderContainer, postContent.firstChild);
});
