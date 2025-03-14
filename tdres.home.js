document.addEventListener("DOMContentLoaded", function () {
    // تحديد جميع أزرار التحقق في الصفحة
    const verifyButtons = document.querySelectorAll(".verify-code-btn");

    // إضافة حدث لكل زر تحقق
    verifyButtons.forEach(button => {
        button.addEventListener("click", function () {
            // العثور على العنصر الأب (المودال) لكل زر
            const modal = this.closest(".payment-modal");
            const inputField = modal.querySelector(".payment-code"); // حقل إدخال الكود
            const errorMessage = modal.querySelector(".error-message"); // رسالة الخطأ

            // إعادة ضبط رسالة الخطأ
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            const code = inputField.value.trim(); // استخراج الكود وإزالة المسافات الفارغة
            const postId = this.getAttribute("data-post-id"); // جلب معرف التدوينة

            if (!code) {
                errorMessage.textContent = "❌ يرجى إدخال الكود.";
                errorMessage.style.display = "block";
                return;
            }

            // بناء رابط الطلب إلى Google Apps Script (متوافق مع بلوجر)
            const url = "https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec" +
                        "?post_id=" + postId + "&code=" + encodeURIComponent(code);

            // إرسال الطلب والتحقق من الكود
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        errorMessage.style.display = "none"; // إخفاء رسالة الخطأ
                        window.location.href = data.url; // التوجيه إلى الرابط الصحيح
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = "block";
                    }
                })
                .catch(error => {
                    errorMessage.textContent = "⚠️ حدث خطأ أثناء التحقق، يرجى المحاولة لاحقًا.";
                    errorMessage.style.display = "block";
                    console.error("❌ خطأ:", error);
                });
        });
    });
});
