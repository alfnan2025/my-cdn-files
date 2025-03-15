document.addEventListener("DOMContentLoaded", function () {
    // ✅ إخفاء الشريط الجانبي إذا كانت الصفحة تحتوي على "?q="
    if (window.location.href.includes("?q=")) { 
        const categorySidebar = document.querySelector(".category-sidebar");
        if (categorySidebar) {
            categorySidebar.style.display = "none";
        }
    }

    // ✅ تصفية الكورسات حسب التصنيفات
    let courseList = document.querySelector(".course-list");
    let courseCards = Array.from(courseList.children);
    let categorySidebar = document.querySelector(".category-sidebar");

    let coursesByCategory = {};
    courseCards.forEach(card => {
        let categoryElement = card.querySelector(".course-category");
        let category = categoryElement ? categoryElement.innerText.trim() : "غير مصنف";

        if (!coursesByCategory[category]) {
            coursesByCategory[category] = [];
        }
        coursesByCategory[category].push(card);
    });

    let order = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"];
    let sortedCategories = Object.keys(coursesByCategory).sort((a, b) => order.indexOf(a) - order.indexOf(b));

    categorySidebar.innerHTML = "";
    let allBtn = document.createElement("button");
    allBtn.classList.add("filter-btn", "active");
    allBtn.innerText = "عرض الكل";
    allBtn.setAttribute("data-category", "all");
    categorySidebar.appendChild(allBtn);

    sortedCategories.forEach(category => {
        let btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.innerText = category;
        btn.setAttribute("data-category", category);
        categorySidebar.appendChild(btn);
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            let selectedCategory = this.getAttribute("data-category");
            courseCards.forEach(card => {
                let cardCategory = card.querySelector(".course-category") ? card.querySelector(".course-category").innerText.trim() : "غير مصنف";
                card.style.display = (selectedCategory === "all" || cardCategory === selectedCategory) ? "flex" : "none";
            });
        });
    });

    // ✅ التحقق من الأكواد وعرض الأسعار
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
        } else if (priceMatch) {
            let price = parseInt(priceMatch[1]);
            let finalPrice = price;
            let oldPrice = null;

            if (discountMatch) {
                let discount = parseInt(discountMatch[1]);
                oldPrice = Math.round(price / (1 - discount / 100));
            }

            if (oldPrice) {
                oldPriceElement.innerText = "💲 السعر قبل الخصم: " + oldPrice + " جنيه";
                oldPriceElement.style.display = "block";
            } else {
                oldPriceElement.style.display = "none";
            }

            priceElement.innerText = "💰 السعر: " + finalPrice + " جنيه";
            priceElement.style.display = "block";
            freeElement.style.display = "none";  

            courseLink.style.pointerEvents = "none";
            courseLink.style.opacity = "0.5";
            courseButton.textContent = "ادفع الآن لمشاهدة المحاضرة";
            courseButton.style.backgroundColor = "#28a745";
            courseButton.style.color = "white";
            courseButton.style.padding = "8px 15px";
            courseButton.style.border = "none";
            courseButton.style.cursor = "pointer";
            courseButton.style.borderRadius = "5px";
            courseButton.style.fontSize = "14px";

            courseButton.addEventListener("click", function (e) {
                e.preventDefault();
                paymentModal.style.display = "block";
            });

            verifyCodeBtn.addEventListener("click", function () {
                let enteredCode = paymentCodeInput.value.trim();
                let postId = verifyCodeBtn.getAttribute("data-post-id");
                
                if (!enteredCode) {
                    errorMessage.textContent = "❌ يرجى إدخال الكود.";
                    errorMessage.style.display = "block";
                    return;
                }

                let url = "https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec" +
                          "?post_id=" + postId + "&code=" + encodeURIComponent(enteredCode);

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === "Success") {
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

            let buyCodeBtn = document.createElement("button");
            buyCodeBtn.textContent = "شراء الكود";
            buyCodeBtn.style.cssText = "padding: 8px 15px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;";

            let buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.marginTop = "10px";

            verifyCodeBtn.style.cssText = "padding: 8px 15px; border: none; cursor: pointer; border-radius: 5px; font-size: 14px;";
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
