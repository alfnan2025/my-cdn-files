document.addEventListener("DOMContentLoaded", function () {
    // الحصول على جميع أزرار التحقق في الصفحة
    const verifyButtons = document.querySelectorAll(".verify-code-btn");

    // إضافة حدث النقر لكل زر تحقق
    verifyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".payment-modal"); // تحديد العنصر الأب (المودال)
            const inputField = modal.querySelector(".payment-code"); // حقل إدخال الكود
            const errorMessage = modal.querySelector(".error-message"); // رسالة الخطأ

            // إخفاء أي رسالة خطأ سابقة
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            const code = inputField.value.trim(); // الحصول على الكود المدخل بعد إزالة المسافات
            const postId = this.getAttribute("data-post-id"); // الحصول على معرف التدوينة

            if (!code) {
                showError(errorMessage, "❌ يرجى إدخال الكود.");
                return;
            }

            const url = `https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec?post_id=${postId}&code=${encodeURIComponent(code)}`;

            // إرسال الطلب إلى Google Apps Script
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        // ✅ توجيه المستخدم إلى الرابط الصحيح عند نجاح التحقق
                        window.location.href = data.url;
                    } else {
                        showError(errorMessage, data.message);
                    }
                })
                .catch(error => {
                    showError(errorMessage, "⚠️ حدث خطأ أثناء التحقق، يرجى المحاولة لاحقًا.");
                    console.error("❌ خطأ:", error);
                });
        });
    });

    /**
     * عرض رسالة خطأ داخل العنصر المحدد
     * @param {HTMLElement} element - عنصر رسالة الخطأ
     * @param {string} message - نص الرسالة
     */
    function showError(element, message) {
        element.textContent = message;
        element.style.display = "block";
    }
});
