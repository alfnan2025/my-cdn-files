document.addEventListener("DOMContentLoaded", function () {
    let postContent = document.querySelector(".post-body.entry-content");
    if (!postContent) return;

    let videos = postContent.querySelectorAll("iframe");

    if (videos.length === 0) return;

    let videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");

    videos.forEach((video, index) => {
        let videoWrapper = document.createElement("div");
        videoWrapper.classList.add("video-wrapper");

        let iframe = document.createElement("iframe");
        iframe.width = "560";
        iframe.height = "315";
        iframe.allowFullscreen = true;
        iframe.style.display = "none"; // إخفاء الفيديو حتى يتم إدخال الكود الصحيح

        let videoTitle = document.createElement("h3");
        videoTitle.textContent = "فيديو المحاضرة " + (index + 1);
        videoWrapper.appendChild(videoTitle);

        // إدخال الكود
        let codeInput = document.createElement("input");
        codeInput.type = "text";
        codeInput.placeholder = "أدخل كود الفيديو لتشغيله";

        let playButton = document.createElement("button");
        playButton.textContent = "تشغيل الفيديو";

        let errorMessage = document.createElement("span");
        errorMessage.style.color = "red";
        errorMessage.style.display = "none";

        // حدث عند الضغط على زر التشغيل
        playButton.addEventListener("click", function () {
            let code = codeInput.value.trim();

            if (!code) {
                errorMessage.textContent = "❌ يرجى إدخال الكود!";
                errorMessage.style.display = "block";
                return;
            }

            let url =
                "https://script.google.com/macros/s/AKfycbxR5gCZEhqHBQdO3yzh_NxG-WlRkWgr4U0XjCrpqO-G36zx9ZQuBd4cEnuA1EW2HT3MoQ/exec";
            let params = `?code=${code}`;

            fetch(url + params)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "Success") {
                        iframe.src = data.videoUrl; // الرابط الذي تم جلبه من جوجل شيت
                        iframe.style.display = "block"; // إظهار الفيديو
                        codeInput.style.display = "none";
                        playButton.style.display = "none";
                        errorMessage.style.display = "none";
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = "block";
                    }
                })
                .catch(() => {
                    errorMessage.textContent = "❌ خطأ أثناء الاتصال بالسيرفر!";
                    errorMessage.style.display = "block";
                });
        });

        videoWrapper.appendChild(codeInput);
        videoWrapper.appendChild(playButton);
        videoWrapper.appendChild(errorMessage);
        videoWrapper.appendChild(iframe);
        videoContainer.appendChild(videoWrapper);

        video.style.display = "none"; // إخفاء الفيديوهات الأصلية في التدوينة
    });

    postContent.insertBefore(videoContainer, postContent.firstChild);
});
