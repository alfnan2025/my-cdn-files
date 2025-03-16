document.addEventListener("DOMContentLoaded", function() {
    let postContent = document.querySelector(".post-body.entry-content");
    if (!postContent) return;

    let videos = postContent.querySelectorAll("iframe");

    if (videos.length === 0) return;

    let videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");

    videos.forEach((video, index) => {
        let videoWrapper = document.createElement("div");
        videoWrapper.classList.add("video-wrapper");

        let videoTitle = document.createElement("h3");
        videoTitle.textContent = "فيديو المحاضرة " + (index + 1);
        videoWrapper.appendChild(videoTitle);

        // إدخال الكود
        let codeInput = document.createElement("input");
        codeInput.type = "text";
        codeInput.placeholder = "أدخل كود الفيديو هنا";
        videoWrapper.appendChild(codeInput);

        let playButton = document.createElement("button");
        playButton.textContent = "تشغيل الفيديو";
        videoWrapper.appendChild(playButton);

        let errorMessage = document.createElement("span");
        errorMessage.style.color = "red";
        errorMessage.style.display = "none";
        videoWrapper.appendChild(errorMessage);

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
                        iframe.allowFullscreen = true;
                        iframe.classList.add("full-width-video");

                        videoWrapper.appendChild(iframe);
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

        videoContainer.appendChild(videoWrapper);
        video.style.display = "none"; // إخفاء الفيديو الأصلي
    });

    postContent.insertBefore(videoContainer, postContent.firstChild);
});

// ضبط الفيديو ليكون بحجم الشاشة
let style = document.createElement("style");
style.innerHTML = `
    .video-container {
        width: 100%;
        max-width: 100%;
    }
    .video-wrapper {
        text-align: center;
        margin-bottom: 20px;
    }
    .full-width-video {
        width: 100%;
        height: 70vh; /* نسبة ارتفاع الفيديو 70% من الشاشة */
        max-width: 100%;
    }
    input[type="text"], button {
        display: block;
        width: 100%;
        max-width: 400px;
        margin: 10px auto;
        padding: 10px;
        font-size: 16px;
    }
`;
document.head.appendChild(style);
