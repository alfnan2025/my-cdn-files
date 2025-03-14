document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".course-card").forEach(function (card) {
        // استخراج محتوى التدوينة
        let postContent = card.querySelector(".post-content").innerHTML;

        // التحقق مما إذا كان الكورس مجانيًا أو يحتوي على سعر وخصم
        let isFree = postContent.includes("مجاني");
        let priceMatch = postContent.match(/السعر:\s*(\d+)/);
        let discountMatch = postContent.match(/الخصم:\s*(\d+)%/);

        // تحديد العناصر ذات الصلة داخل بطاقة الكورس
        let priceElement = card.querySelector(".course-price");
        let oldPriceElement = card.querySelector(".course-old-price");
        let freeElement = card.querySelector(".course-free");
        let courseLink = card.querySelector(".course-link");
        let courseButton = card.querySelector(".course-button");
        let paymentModal = card.querySelector(".payment-modal");
        let verifyCodeBtn = card.querySelector(".verify-code-btn");
        let paymentCodeInput = card.querySelector(".payment-code");
        let errorMessage = card.querySelector(".error-message");

        if (isFree) {
            // إظهار إشارة "مجاني" وإخفاء السعر
            freeElement.style.display = "block";
            priceElement.style.display = "none";
            oldPriceElement.style.display = "none";

            // تعديل نص الزر
            courseButton.textContent = "تفاصيل المحاضرة"; 
        } else if (priceMatch || discountMatch) {
            // تعطيل الرابط الافتراضي للكورس
            courseLink.style.pointerEvents = "none";
            courseLink.style.opacity = "0.5";

            // إخفاء العنصر المجاني
            freeElement.style.display = "none";

            // تعديل تصميم الزر
            courseButton.textContent = "ادفع الآن لمشاهدة المحاضرة";
            Object.assign(courseButton.style, {
                backgroundColor: "#28a745",
                color: "white",
                padding: "8px 15px",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "14px"
            });

            // فتح نافذة الدفع عند النقر على الزر
            courseButton.addEventListener("click", function (e) {
                e.preventDefault();
                paymentModal.style.display = "block";
            });

            // التحقق من الكود عند الضغط على زر "تحقق"
            verifyCodeBtn.addEventListener("click", function () {
                let enteredCode = paymentCodeInput.value.trim();
                
                fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?code=${enteredCode}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.valid) {
                            window.location.href = card.querySelector(".course-link").href;
                        } else {
                            errorMessage.style.display = "block";
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        errorMessage.style.display = "block";
                    });
            });

            // إنشاء زر شراء الكود
            let buyCodeBtn = document.createElement("button");
            buyCodeBtn.textContent = "شراء الكود";

            // حاوية الأزرار
            let buttonContainer = document.createElement("div");
            Object.assign(buttonContainer.style, {
                display: "flex",
                gap: "10px",
                marginTop: "10px"
            });

            let buttonStyle = "padding: 8px 15px; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;";

            // تنسيق الأزرار
            verifyCodeBtn.style.cssText = buttonStyle;
            buyCodeBtn.style.cssText = buttonStyle + "background-color: #007bff; color: white;";

            // إضافة الأزرار إلى النافذة المنبثقة
            buttonContainer.appendChild(verifyCodeBtn);
            buttonContainer.appendChild(buyCodeBtn);
            paymentModal.appendChild(buttonContainer);

            // عند الضغط على زر شراء الكود
            buyCodeBtn.addEventListener("click", function () {
                let courseTitle = card.querySelector(".course-title").textContent.trim();
                let courseUrl = window.location.href;
                let whatsappNumber = "+2001023580827";

                let whatsappMessage = `أرغب في شراء كود الكورس: ${courseTitle}%0Aرابط الكورس: ${courseUrl}`;
                let whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

                window.open(whatsappLink, "_blank");
            });
        }
    });
});
