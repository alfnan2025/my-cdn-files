document.addEventListener("DOMContentLoaded", function() {

    let postContent = document.querySelector(".post-body.entry-content");
    if (!postContent) return;

    let videos = postContent.querySelectorAll("iframe");

    if (videos.length === 0) return;

    let container = document.createElement("div");
    container.classList.add("container");

    // إنشاء سلايدر الفيديوهات
    if (videos.length > 0) {
        let videoSliderContainer = document.createElement("div");
        videoSliderContainer.classList.add("video-slider-container");

        let videoTitle = document.createElement("h2");
        videoTitle.textContent = "";
        videoSliderContainer.appendChild(videoTitle);

        let videoList = document.createElement("div");
        videoList.classList.add("video-list");

        videos.forEach((video, index) => {
            let videoContainer = document.createElement("div");
            videoContainer.classList.add("video-container");

            let postId = document.querySelector("meta[itemprop='postId']").content;

            let videoTitle = document.createElement("h3");
            videoTitle.textContent = "فيديو المحاضرة " + (index + 1);
            videoContainer.appendChild(videoTitle);

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

            let successMessage = document.createElement("div");
            successMessage.classList.add("footer-message");
            successMessage.style.display = "none"; // ستظهر فقط بعد إدخال الكود الصحيح
            successMessage.innerHTML = `
                <p>⚠️ جميع الحقوق محفوظة. لا نسمح بنشر الفيديوهات بشكل غير قانوني. إذا كان هناك صديق لك غير قادر على شراء المحاضرة <strong>بلغنا على الواتساب</strong> وسنقدم له اشتراك مجاني طوال العام شامل المتابعة.</p>
                <a href="https://wa.me/+2001030584429" class="whatsapp-link">اضغط هنا للتواصل عبر الواتساب</a>
            `;
            videoContainer.appendChild(successMessage);

            playButton.addEventListener("click", function () {
                let code = codeInput.value.trim();
                let postId = playButton.getAttribute("data-post-id");

                if (!code) {
                    errorMessage.textContent = "❌ يرجى إدخال الكود!";
                    errorMessage.style.display = "block";
                    return;
                }

                let url = "https://script.google.com/macros/s/AKfycbx-LWsR1wkWD1GrhR4-dIA18gTp5k6pqhT_ZKhZAi7gcHGt8HgsC-u1zYxZDqxZEhPR/exec";
                let params = `?post_id=${postId}&code=${code}`;

                fetch(url + params)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "Success") {
                            let videoUrl = data.videoUrl;
                            let iframe = document.createElement("iframe");
                            iframe.src = videoUrl;
                            iframe.style.width = "100%";
                            iframe.style.height = "auto";
                            iframe.style.aspectRatio = "16 / 9";
                            iframe.style.borderRadius = "10px";
                            iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
                            videoContainer.appendChild(iframe);
                            iframe.style.display = "block";
                            codeInput.style.display = "none";
                            playButton.style.display = "none";
                            errorMessage.style.display = "none";

                            // عرض رسالة التنبيه بعد تشغيل الفيديو
                            successMessage.style.display = "block";

                            // إضافة العلامة المائية
                            let watermark = document.createElement("div");
                            watermark.classList.add("watermark");
                            watermark.textContent = code;
                            videoContainer.appendChild(watermark);
                            watermark.style.display = "none"; // إخفاؤها في البداية

                            // ظهور العلامة المائية كل 30 ثانية واختفاؤها بعد 10 ثوانٍ مع تحريك مستمر
                            setInterval(() => {
                                watermark.style.display = "block";
                                moveWatermark(watermark);

                                let moveInterval = setInterval(() => {
                                    moveWatermark(watermark);
                                }, 2000); // تحريك كل ثانيتين

                                setTimeout(() => {
                                    watermark.style.display = "none";
                                    clearInterval(moveInterval);
                                }, 10000);
                            }, 30000);

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

            videoList.appendChild(videoContainer);
            video.style.display = "none";
        });

        videoSliderContainer.appendChild(videoList);
        container.appendChild(videoSliderContainer);
    }

    postContent.insertBefore(container, postContent.firstChild);
});

function moveWatermark(watermark) {
    // تحريك العلامة المائية بشكل عشوائي داخل الفيديو
    let x = Math.floor(Math.random() * 80) + 10;
    let y = Math.floor(Math.random() * 80) + 10;
    watermark.style.position = "absolute";
    watermark.style.left = `${x}%`;
    watermark.style.top = `${y}%`;
}
