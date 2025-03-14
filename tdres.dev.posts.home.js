document.addEventListener("DOMContentLoaded", function () {
    // احصل على كل أزرار التحقق داخل الصفحة
    const verifyButtons = document.querySelectorAll(".verify-code-btn");

    // أضف حدث لكل زر تحقق بشكل منفصل
    verifyButtons.forEach(button => {
        button.addEventListener("click", function () {
            // البحث عن العناصر داخل نفس المودال الخاص بالزر
            const modal = this.closest(".payment-modal");
            const inputField = modal.querySelector(".payment-code");
            const errorMessage = modal.querySelector(".error-message");

            // إخفاء أي رسالة خطأ سابقة
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            // الحصول على الكود المدخل ومعرّف التدوينة
            const code = inputField.value.trim();
            const postId = this.getAttribute("data-post-id");

            // التحقق من إدخال الكود
            if (!code) {
                errorMessage.textContent = "❌ يرجى إدخال الكود.";
                errorMessage.style.display = "block";
                return;
            }

            // تجهيز الرابط لاستدعاء API التحقق
            const url = `https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec?post_id=${postId}&code=${encodeURIComponent(code)}`;

            // تنفيذ الطلب
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        // عند النجاح: إخفاء الرسالة والتوجيه إلى الرابط
                        errorMessage.style.display = "none";
                        errorMessage.textContent = "";
                        window.location.href = data.url;
                    } else {
                        // عند الفشل: عرض رسالة الخطأ
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = "block";
                    }
                })
                .catch(error => {
                    // عند حدوث خطأ في الاتصال
                    errorMessage.textContent = "⚠️ حدث خطأ أثناء التحقق، يرجى المحاولة لاحقًا.";
                    errorMessage.style.display = "block";
                    console.error("❌ خطأ:", error);
                });
        });
    });
});
