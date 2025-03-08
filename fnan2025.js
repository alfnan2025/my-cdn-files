document.addEventListener("DOMContentLoaded", function() {
  let postContent = document.querySelector(".post-content");
  if (!postContent) return;

  let images = postContent.querySelectorAll("img");
  let videos = postContent.querySelectorAll("iframe");

  if (images.length === 0 && videos.length === 0) return;

  let container = document.createElement("div");
  container.classList.add("container");

  let sliderContainer = document.createElement("div");
  sliderContainer.classList.add("slider-container");

  // معالجة الصور
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

  // معالجة الفيديوهات
  if (videos.length > 0) {
    let videoSliderContainer = document.createElement("div");
    videoSliderContainer.classList.add("video-slider-container");

    videos.forEach((video, index) => {
      let videoContainer = document.createElement("div");
      videoContainer.classList.add("video-container");
      let videoTitle = document.createElement("h3");
      videoTitle.textContent = "فيديو المنتج " + (index + 1);
      videoContainer.appendChild(videoTitle);
      videoContainer.appendChild(video.cloneNode(true));
      videoSliderContainer.appendChild(videoContainer);
      video.style.display = "none"; // إخفاء الفيديو الأصلي
    });

    let videoThumbnailsContainer = document.createElement("div");
    videoThumbnailsContainer.classList.add("video-thumbnails");

    videos.forEach((video, index) => {
      let videoId = getYouTubeVideoId(video.src);
      if (videoId) {
        let thumb = document.createElement("img");
        thumb.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        thumb.addEventListener("click", function () {
          videoSliderContainer.querySelectorAll('.video-container').forEach(container => container.classList.remove('active'));
          videoSliderContainer.querySelectorAll('.video-container')[index].classList.add('active');
        });
        videoThumbnailsContainer.appendChild(thumb);
      }
    });

    videoSliderContainer.appendChild(videoThumbnailsContainer);
    container.appendChild(videoSliderContainer);
  }

  postContent.insertBefore(container, postContent.firstChild);
});

// دالة لاستخراج ID الفيديو من رابط YouTube
function getYouTubeVideoId(url) {
  let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}
