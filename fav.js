<script>
  document.addEventListener("DOMContentLoaded", function () {
    let selectedStars = 0;
    const scriptURL = "https://script.google.com/macros/s/AKfycbxAznk5rudobevlDA2NsBUHW9LxYikCm8LACmNKGTCYAmm4efCUiooNwh_xmHqKOQ3qYA/exec";
    const postId = window.location.pathname.split("/").pop(); 
    const reviewKey = "reviewed_" + postId; 

    // ✅ تحميل التقييمات فورًا عند تحميل الصفحة
    loadReviews();

    if (localStorage.getItem(reviewKey)) {
      document.getElementById("review-form").innerHTML = "<p style='color: red;'>لقد قمت بإرسال تقييم لهذه التدوينة.</p>";
      return;
    }

    document.querySelectorAll(".star").forEach(star => {
      star.addEventListener("click", function () {
        selectedStars = parseInt(this.dataset.value);
        document.querySelectorAll(".star").forEach(s => 
          s.style.color = s.dataset.value <= selectedStars ? "gold" : "gray"
        );
      });
    });

    // ✅ إرسال التقييم
    document.getElementById("submit-review").addEventListener("click", function (event) {
      event.preventDefault();

      let username = document.getElementById("username").value.trim() || "مجهول";
      let comment = document.getElementById("comment").value.trim();

      if (selectedStars === 0 || comment === "") {
        alert("يرجى اختيار عدد النجوم وكتابة تعليق");
        return;
      }

      if (!isArabic(username) || !isArabic(comment)) {
        alert("يرجى إدخال النص باللغة العربية فقط.");
        return;
      }

      let formData = new URLSearchParams();
      formData.append("postId", postId);
      formData.append("username", username);
      formData.append("stars", selectedStars);
      formData.append("comment", comment);

      sendReview(formData);
    });

    // ✅ إرسال التقييم إلى Google Sheets
    async function sendReview(formData) {
      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString()
        });
        const data = await response.json();
        alert(data.message);
        if (data.status === "success") {
          localStorage.setItem(reviewKey, "true");
          document.getElementById("review-form").innerHTML = "<p style='color: red;'>شكرًا! لقد قمت بإرسال تقييم لهذه التدوينة.</p>";
          loadReviews(); 
        }
      } catch (error) {
        console.error("Error:", error);
        alert("حدث خطأ أثناء إرسال التقييم.");
      }
    }

    // ✅ تحميل التقييمات من Google Sheets
    async function loadReviews() {
      try {
        if (localStorage.getItem('reviews_' + postId)) {
          let cachedReviews = JSON.parse(localStorage.getItem('reviews_' + postId));
          renderReviews(cachedReviews);
        }

        let response = await fetch(`${scriptURL}?postId=${postId}`);
        if (!response.ok) throw new Error("فشل تحميل التقييمات.");
        
        let data = await response.json();
        localStorage.setItem('reviews_' + postId, JSON.stringify(data));
        renderReviews(data);

      } catch (error) {
        console.error("خطأ:", error);
        document.getElementById("reviews").innerHTML = "حدث خطأ أثناء تحميل التقييمات.";
        setTimeout(loadReviews, 3000); // إعادة المحاولة بعد 3 ثوانٍ
      }
    }

    function renderReviews(data) {
      let reviewsContainer = document.getElementById("reviews");
      reviewsContainer.innerHTML = "<h3>التقييمات</h3>";

      if (data.length === 0) {
        reviewsContainer.innerHTML += "<p>لا توجد تقييمات لهذه التدوينة بعد.</p>";
      } else {
        let totalStars = 0;
        data.forEach(review => {
          totalStars += parseInt(review.stars);
        });
        let averageStars = (totalStars / data.length).toFixed(2);
        let averageStarsHtml = generateStarsHtml(averageStars);

        reviewsContainer.innerHTML += `<p><strong>التقييم العام: ${averageStarsHtml}</strong></p>`;

        const visibleReviews = data.slice(0, 3);
        visibleReviews.forEach(review => {
          let stars = "★".repeat(parseInt(review.stars)) + "☆".repeat(5 - parseInt(review.stars));
          reviewsContainer.innerHTML += `
            <div class="review">
              <strong>${review.username}</strong> - ${stars} (${review.stars}/5)
              <p>${review.comment}</p>
            </div>
          `;
        });

        const hiddenReviews = data.slice(3);
        hiddenReviews.forEach(review => {
          let stars = "★".repeat(parseInt(review.stars)) + "☆".repeat(5 - parseInt(review.stars));
          reviewsContainer.innerHTML += `
            <div class="review hidden">
              <strong>${review.username}</strong> - ${stars} (${review.stars}/5)
              <p>${review.comment}</p>
            </div>
          `;
        });

        reviewsContainer.addEventListener("scroll", function () {
          if (reviewsContainer.scrollTop + reviewsContainer.clientHeight >= reviewsContainer.scrollHeight) {
            const hiddenReviews = document.querySelectorAll(".review.hidden");
            hiddenReviews.forEach((review) => {
              review.classList.remove("hidden");
            });
          }
        });
      }
    }

    function generateStarsHtml(stars) {
      let fullStars = Math.floor(stars);
      let halfStar = (stars - fullStars) >= 0.5 ? '★' : '☆';
      let emptyStars = 5 - fullStars - (halfStar === '★' ? 1 : 0);
      let starsHtml = '★'.repeat(fullStars);
      if (halfStar === '★') starsHtml += '★';
      starsHtml += '☆'.repeat(emptyStars);
      return starsHtml;
    }

    function isArabic(text) {
      return /^[\u0600-\u06FF\s]+$/.test(text);
    }
  });
</script>
