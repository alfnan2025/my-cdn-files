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

    images.forEach((img, index) => {
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

  container.appendChild(sliderContainer); // إضافة سلايد شو الصور أولاً

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

    if (videos.length > 0) {
      videoSliderContainer.querySelector('.video-container').classList.add('active');
    }

    // إنشاء المصغرات للفيديوهات
    let videoThumbnailsContainer = document.createElement("div");
    videoThumbnailsContainer.classList.add("video-thumbnails");

    videos.forEach((video, index) => {
      let thumb = document.createElement("img");
      thumb.src = "https://img.youtube.com/vi/" + video.src.split("/")[4] + "/0.jpg"; // استخدام صورة المصغرة من يوتيوب
      thumb.addEventListener("click", function () {
        videoSliderContainer.querySelectorAll('.video-container').forEach(container => container.classList.remove('active'));
        videoSliderContainer.querySelectorAll('.video-container')[index].classList.add('active');
      });
      videoThumbnailsContainer.appendChild(thumb);
    });

    videoSliderContainer.appendChild(videoThumbnailsContainer);
    container.appendChild(videoSliderContainer); // إضافة سلايد شو الفيديو بعد الصور
  }

  // إذا لم يكن هناك فيديوهات، ضع سلايد شو الصور في منتصف الصفحة
  if (videos.length === 0 && images.length > 0) {
    sliderContainer.style.margin = "0 auto"; // توسيط السلايد
  }

  // إضافة فاصل بين سلايد الصور والفيديوهات إذا كانت موجودة
  if (videos.length > 0) {
    let separator = document.createElement("div");
    separator.classList.add("separator");
    container.appendChild(separator);
  }

  postContent.insertBefore(container, postContent.firstChild);

  // تعديل النصوص المنسقة مباشرة
  let formattedTexts = postContent.querySelectorAll("b, i, u");
  formattedTexts.forEach((element) => {
    let newText = document.createElement("span");
    newText.classList.add("formatted-text");
    
    if (element.tagName === "B") {
      newText.classList.add("bold");
      newText.textContent = element.textContent + " 🌟";
      sliderContainer.appendChild(newText);
    } else if (element.tagName === "I") {
      newText.classList.add("italic");
      newText.textContent = element.textContent;
      sliderContainer.appendChild(newText);
    } else if (element.tagName === "U") {
      newText.classList.add("underline");
      newText.textContent = element.textContent;
      let emojiSpan = document.createElement("span");
      emojiSpan.classList.add("emoji");
      emojiSpan.textContent = "😪";
      newText.appendChild(emojiSpan);
      sliderContainer.appendChild(newText);
    }
    
    element.style.display = "none"; // إخفاء النصوص الأصلية
  });
});
