// ✅ سكربت التصفية حسب التصنيف
document.addEventListener("DOMContentLoaded", function () {
    let courseList = document.querySelector(".course-list");
    let courseCards = Array.from(courseList.children);
    let categorySidebar = document.querySelector(".category-sidebar");

    let coursesByCategory = {};

    courseCards.forEach(card => {
        let categoryElement = card.querySelector(".course-category");
        let category = categoryElement ? categoryElement.innerText.trim() : "غير مصنف";

        if (!coursesByCategory[category]) {
            coursesByCategory[category] = [];
            
            // ✅ إضافة التصنيف إلى القائمة الجانبية
            let btn = document.createElement("button");
            btn.classList.add("filter-btn");
            btn.innerText = category;
            btn.setAttribute("data-category", category);
            categorySidebar.appendChild(btn);
        }
        coursesByCategory[category].push(card);
    });

    // ✅ إضافة حدث النقر لتصفية الكورسات
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            let selectedCategory = this.getAttribute("data-category");
            
            courseCards.forEach(card => {
                let cardCategory = card.querySelector(".course-category") ? 
                                   card.querySelector(".course-category").innerText.trim() : 
                                   "غير مصنف";
                
                card.style.display = (selectedCategory === "all" || cardCategory === selectedCategory) ? "flex" : "none";
            });
        });
    });
});