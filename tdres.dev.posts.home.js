document.addEventListener("DOMContentLoaded", function () {
    // احصل على كل أزرار التحقق داخل الصفحة
    const verifyButtons = document.querySelectorAll(".verify-code-btn");

    // أضف حدث لكل زر تحقق بشكل منفصل
    verifyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".payment-modal"); // البحث عن العنصر الأب القريب لكل زر
            const inputField = modal.querySelector(".payment-code"); // البحث عن حقل الإدخال داخل نفس المودال
            const errorMessage = modal.querySelector(".error-message"); // البحث عن رسالة الخطأ داخل نفس المودال

            // إخفاء أي رسالة خطأ سابقة
            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            const code = inputField.value.trim();
            const postId = this.getAttribute("data-post-id"); // الحصول على الـ post_id لكل تدوينة

            if (!code) {
                errorMessage.textContent = "❌ يرجى إدخال الكود.";
                errorMessage.style.display = "block";
                return;
            }

        const url = &quot;https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec?post_id=&quot; + postId + &quot;&amp;code=&quot; + encodeURIComponent(code);


            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        // ✅ إخفاء الرسالة عند النجاح
                        errorMessage.style.display = "none";
                        errorMessage.textContent = "";

                        // ✅ التوجيه إلى الرابط الصحيح
                        window.location.href = data.url;
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