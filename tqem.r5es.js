document.addEventListener("DOMContentLoaded", function () {
  let selectedStars = 0;
  const scriptURL = "https://script.google.com/macros/s/AKfycbxAznk5rudobevlDA2NsBUHW9LxYikCm8LACmNKGTCYAmm4efCUiooNwh_xmHqKOQ3qYA/exec";
  const postId = window.location.pathname.split("/").pop(); // ✅ استخراج معرف التدوينة
  const reviewKey = "reviewed_" + postId; // ✅ تخزين التقييم لكل تدوينة على حدة

  // ✅ تحميل التقييمات فورًا عند تحميل الصفحة
  loadReviews();

  // ✅ التحقق مما إذا كان المستخدم قد قام بالتقييم سابقًا
  if (localStorage.getItem(reviewKey)) {
    document.getElementById("review-form").innerHTML = "<p style='color: red;'>لقد قمت بإرسال تقييم لهذا المنتج.</p>";
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

  // ✅ إرسال التقييم
  document.getElementById("submit-review").addEventListener("click", function (event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    let username = document.getElementById("username").value.trim() || "مجهول";
    let comment = document.getElementById("comment").value.trim();

    if (selectedStars === 0 || comment === "") {
      alert("يرجى اختيار عدد النجوم وكتابة تعليق");
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
        document.getElementById("review-form").innerHTML = "<p style='color: red;'>شكرًا! لقد قمت بإرسال تقييم لهذا المنتج.</p>";
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
      let response = await fetch(`${scriptURL}?postId=${postId}`);
      if (!response.ok) throw new Error("فشل تحميل التقييمات.");
      
      let data = await response.json();
      renderReviews(data);
    } catch (error) {
      console.error("خطأ:", error);
      document.getElementById("reviews").innerHTML = "حدث خطأ أثناء تحميل التقييمات.";
    }
  }

  // ✅ عرض التقييمات مع زر "عرض المزيد"
  function renderReviews(data) {
    let reviewsContainer = document.getElementById("reviews");
    reviewsContainer.innerHTML = "<h3>التقييمات</h3>";

    if (data.length === 0) {
      reviewsContainer.innerHTML += "<p>لا توجد تقييمات لهذا المنتج بعد.</p>";
      return;
    }

    // حساب التقييم العام
    let totalStars = data.reduce((sum, review) => sum + parseInt(review.stars), 0);
    let averageStars = (totalStars / data.length).toFixed(1);

    // عرض التقييم العام على شكل نجوم
    let averageStarsHtml = generateStarsHtml(averageStars);
    reviewsContainer.innerHTML += `<p><strong>التقييم العام: ${averageStarsHtml} (${averageStars}/5)</strong></p>`;

    // عرض أول 3 تقييمات فقط، والباقي مخفي
    data.forEach((review, index) => {
      let stars = "★".repeat(parseInt(review.stars)) + "☆".repeat(5 - parseInt(review.stars));
      let hiddenClass = index >= 3 ? "hidden-review" : "";
      reviewsContainer.innerHTML += `
        <div class="review ${hiddenClass}">
          <strong>${review.username}</strong> - ${stars} (${review.stars}/5)
          <p>${review.comment}</p>
        </div>
      `;
    });

    // زر "عرض المزيد" لإظهار باقي التقييمات
    if (data.length > 3) {
      let showMoreBtn = document.createElement("button");
      showMoreBtn.innerText = "عرض المزيد من التقييمات";
      showMoreBtn.classList.add("show-more-btn");
      showMoreBtn.addEventListener("click", function () {
        document.querySelectorAll(".hidden-review").forEach(el => el.classList.remove("hidden-review"));
        showMoreBtn.style.display = "none"; // إخفاء الزر بعد الضغط
      });
      reviewsContainer.appendChild(showMoreBtn);
    }
  }

  // ✅ توليد النجوم بناءً على التقييم
  function generateStarsHtml(stars) {
    let fullStars = Math.floor(stars);
    let halfStar = (stars - fullStars) >= 0.5 ? '★' : '☆';
    let emptyStars = 5 - fullStars - (halfStar === '★' ? 1 : 0);

    return '★'.repeat(fullStars) + (halfStar === '★' ? '★' : '') + '☆'.repeat(emptyStars);
  }
});