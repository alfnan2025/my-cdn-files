<script>

  
<script>
document.addEventListener("DOMContentLoaded", function () {
  let selectedStars = 0;
  const scriptURL = "https://script.google.com/macros/s/AKfycbxAznk5rudobevlDA2NsBUHW9LxYikCm8LACmNKGTCYAmm4efCUiooNwh_xmHqKOQ3qYA/exec";
  const postId = window.location.pathname.split("/").pop(); // ✅ استخراج معرف التدوينة
  const reviewKey = "reviewed_" + postId; // ✅ تخزين التقييم لكل تدوينة على حدة

  // ✅ تحميل التقييمات فورًا عند تحميل الصفحة
  loadReviews();

  // ✅ التحقق مما إذا كان المستخدم قد قام بالتقييم سابقًا
  if (localStorage.getItem(reviewKey)) {
    document.getElementById("review-form").innerHTML = "<p style='color: red;'>لقد قمت بإرسال تقييم لهذه التدوينة.</p>";
    return;
  }

  // ✅ تحديد عدد النجوم عند التقييم
  document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", function () {
      selectedStars = parseInt(this.dataset.value);
      document.querySelectorAll(".star").forEach(s => 
        s.style.color = s.dataset.value <= selectedStars ? "gold" : "gray"
      );
    });
  });

  // ✅ التحقق من إدخال اللغة العربية فقط
  function isArabic(text) {
    return /^[\u0600-\u06FF\s]+$/.test(text);
  }

  document.getElementById("username").addEventListener("input", function () {
    if (!isArabic(this.value)) {
      this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
    }
  });

  document.getElementById("comment").addEventListener("input", function () {
    if (!isArabic(this.value)) {
      this.value = this.value.replace(/[^\u0600-\u06FF\s]/g, '');
    }
  });

  // ✅ إرسال التقييم
  document.getElementById("submit-review").addEventListener("click", function (event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

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

    // ✅ تجهيز البيانات بصيغة x-www-form-urlencoded
    let formData = new URLSearchParams();
    formData.append("postId", postId);
    formData.append("username", username);
    formData.append("stars", selectedStars);
    formData.append("comment", comment);

    // ✅ إرسال البيانات إلى جوجل جداول
    sendReview(formData);
  });

  // ✅ إرسال التقييم إلى Google Sheets
  function sendReview(formData) {
    fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      if (data.status === "success") {
        localStorage.setItem(reviewKey, "true"); // ✅ حفظ حالة التقييم لكل تدوينة
        document.getElementById("review-form").innerHTML = "<p style='color: red;'>شكرًا! لقد قمت بإرسال تقييم لهذه التدوينة.</p>";
        loadReviews(); // تحديث التقييمات بعد الإرسال
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("حدث خطأ أثناء إرسال التقييم.");
    });
  }

  // ✅ تحميل التقييمات من Google Sheets حسب معرف التدوينة
  async function loadReviews() {
    try {
      // ✅ التحقق إذا كانت التقييمات موجودة في الذاكرة المحلية
      if (localStorage.getItem('reviews_' + postId)) {
        let cachedReviews = JSON.parse(localStorage.getItem('reviews_' + postId));
        renderReviews(cachedReviews);
      }

      // ✅ جلب التقييمات من Google Sheets فقط إذا كانت غير موجودة في الذاكرة المحلية
      let response = await fetch(`${scriptURL}?postId=${postId}`);
      if (!response.ok) throw new Error("فشل تحميل التقييمات.");
      
      let data = await response.json();
      localStorage.setItem('reviews_' + postId, JSON.stringify(data)); // تخزين التقييمات في الذاكرة المحلية
      renderReviews(data);

    } catch (error) {
      console.error("خطأ:", error);
      document.getElementById("reviews").innerHTML = "حدث خطأ أثناء تحميل التقييمات.";
    }
  }

  // ✅ عرض التقييمات
  function renderReviews(data) {
    let reviewsContainer = document.getElementById("reviews");
    reviewsContainer.innerHTML = "<h3>التقييمات</h3>";

    if (data.length === 0) {
      reviewsContainer.innerHTML += "<p>لا توجد تقييمات لهذه التدوينة بعد.</p>";
    } else {
      // حساب التقييم العام
      let totalStars = 0;
      data.forEach(review => {
        totalStars += parseInt(review.stars);
      });
      let averageStars = (totalStars / data.length).toFixed(2);

      // عرض التقييم العام على شكل نجوم
      let averageStarsHtml = generateStarsHtml(averageStars);

      // عرض التقييم العام
      reviewsContainer.innerHTML += `<p><strong>التقييم العام: ${averageStarsHtml}</strong></p>`;

      // عرض أول 3 تقييمات فقط
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

      // إضافة تقييمات مخفية مع تحميل المزيد عند التمرير
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

      // تفعيل التمرير لإظهار المزيد من التقييمات
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

  // ✅ توليد النجوم بناءً على التقييم
  function generateStarsHtml(stars) {
    let fullStars = Math.floor(stars);
    let halfStar = (stars - fullStars) >= 0.5 ? '★' : '☆';
    let emptyStars = 5 - fullStars - (halfStar === '★' ? 1 : 0);

    let starsHtml = '★'.repeat(fullStars);
    if (halfStar === '★') starsHtml += '★';
    starsHtml += '☆'.repeat(emptyStars);
    
    return starsHtml;
  }
});
</script>

  </script>
