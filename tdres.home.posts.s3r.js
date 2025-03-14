document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".course-card").forEach(function (card) {
        let postContent = card.querySelector(".post-content").innerHTML;

        let isFree = postContent.includes("مجاني");
        let priceMatch = postContent.match(/السعر:\s*(\d+)/);
        let discountMatch = postContent.match(/الخصم:\s*(\d+)%/);

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
            freeElement.style.display = "block";
            priceElement.style.display = "none";
            oldPriceElement.style.display = "none";
            courseButton.textContent = "تفاصيل المحاضرة";
        } else if (priceMatch || discountMatch) {
            courseLink.style.pointerEvents = "none";
            courseLink.style.opacity = "0.5";
            freeElement.style.display = "none";
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

            courseButton.addEventListener("click", function (e) {
                e.preventDefault();
                paymentModal.style.display = "block";
            });

            verifyCodeBtn.addEventListener("click", function () {
                let enteredCode = paymentCodeInput.value.trim();

                fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?code=" + enteredCode)
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

            let buyCodeBtn = document.createElement("button");
            buyCodeBtn.textContent = "شراء الكود";

            let buttonContainer = document.createElement("div");
            Object.assign(buttonContainer.style, {
                display: "flex",
                gap: "10px",
                marginTop: "10px"
            });

            let buttonStyle = "padding: 8px 15px; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;";

            verifyCodeBtn.style.cssText = buttonStyle;
            buyCodeBtn.style.cssText = buttonStyle + "background-color: #007bff; color: white;";

            buttonContainer.appendChild(verifyCodeBtn);
            buttonContainer.appendChild(buyCodeBtn);
            paymentModal.appendChild(buttonContainer);

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