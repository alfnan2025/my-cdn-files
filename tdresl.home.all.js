document.addEventListener("DOMContentLoaded", function () {
    // 1️⃣ التحقق من الكود وإعادة التوجيه
    document.querySelectorAll(".verify-code-btn").forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".payment-modal");
            const inputField = modal.querySelector(".payment-code");
            const errorMessage = modal.querySelector(".error-message");

            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            const code = inputField.value.trim();
            const postId = this.getAttribute("data-post-id");

            if (!code) {
                errorMessage.textContent = "❌ يرجى إدخال الكود.";
                errorMessage.style.display = "block";
                return;
            }

            const url = "https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec" +
                        "?post_id=" + postId + "&code=" + encodeURIComponent(code);

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
                });
        });
    });

    // 2️⃣ إخفاء الشريط الجانبي عند البحث
    if (window.location.href.includes("?q=")) {
        const categorySidebar = document.querySelector(".category-sidebar");
        if (categorySidebar) categorySidebar.style.display = "none";
    }

    // 3️⃣ إدارة عرض الأسعار والخصومات
    document.querySelectorAll(".course-card").forEach(card => {
        let postContent = card.querySelector(".post-content").innerHTML;
        let isFree = postContent.includes("مجاني");
        let priceMatch = postContent.match(/السعر:\s*(\d+)/);
        let discountMatch = postContent.match(/الخصم:\s*(\d+)%/);

        let priceElement = card.querySelector(".course-price");
        let oldPriceElement = card.querySelector(".course-old-price");
        let freeElement = card.querySelector(".course-free");
        let courseButton = card.querySelector(".course-button");
        let paymentModal = card.querySelector(".payment-modal");

        if (isFree) {
            freeElement.style.display = "block";
            priceElement.style.display = "none";
            oldPriceElement.style.display = "none";
            courseButton.textContent = "تفاصيل المحاضرة"; 
        } else if (priceMatch) {
            let price = parseInt(priceMatch[1]);
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

            priceElement.innerText = "💰 السعر: " + price + " جنيه";
            priceElement.style.display = "block";
            freeElement.style.display = "none";

            courseButton.textContent = "ادفع الآن لمشاهدة المحاضرة";
            courseButton.style.backgroundColor = "#28a745";
            courseButton.style.color = "white";
            courseButton.addEventListener("click", function (e) {
                e.preventDefault();
                paymentModal.style.display = "block";
            });
        }
    });

    // 4️⃣ تصنيف الكورسات حسب الفصول الدراسية
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

                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
