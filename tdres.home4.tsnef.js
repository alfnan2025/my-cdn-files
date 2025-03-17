
document.addEventListener("DOMContentLoaded", function () {
    let courseList = document.querySelector(".course-list");
    let courseCards = Array.from(courseList.children);
    let categorySidebar = document.querySelector(".category-sidebar");

    let coursesByCategory = {};

    // ✅ جمع التصنيفات والدورات الخاصة بها
    courseCards.forEach(card => {
        let categoryElement = card.querySelector(".course-category");
        let category = categoryElement ? categoryElement.innerText.trim() : "غير مصنف";

        if (!coursesByCategory[category]) {
            coursesByCategory[category] = [];
        }
        coursesByCategory[category].push(card);
    });

    // ✅ ترتيب التصنيفات مع دعم الأرقام بالحروف
    let sortedCategories = Object.keys(coursesByCategory).sort((a, b) => {
        let numA = extractNumber(a);
        let numB = extractNumber(b);
        return numA - numB;
    });

    // ✅ إزالة أي زر "عرض الكل" موجود مسبقًا
    let existingAllBtn = categorySidebar.querySelector('[data-category="all"]');
    if (!existingAllBtn) {
        let allBtn = document.createElement("button");
        allBtn.classList.add("filter-btn", "active");
        allBtn.innerText = "عرض الكل";
        allBtn.setAttribute("data-category", "all");
        categorySidebar.insertBefore(allBtn, categorySidebar.firstChild);
    }

    // ✅ إضافة التصنيفات إلى القائمة الجانبية بعد الترتيب
    sortedCategories.forEach(category => {
        let btn = document.createElement("button");
        btn.classList.add("filter-btn");
        btn.innerText = category;
        btn.setAttribute("data-category", category);
        categorySidebar.appendChild(btn);
    });

    // ✅ إضافة حدث النقر لتصفية الدورات حسب التصنيف
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            let selectedCategory = this.getAttribute("data-category");

            courseCards.forEach(card => {
                let cardCategory = card.querySelector(".course-category") 
                    ? card.querySelector(".course-category").innerText.trim() 
                    : "غير مصنف";

                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // ✅ دالة لاستخراج الرقم من النص (دعم الأرقام بالحروف العربية)
    function extractNumber(text) {
        let numbersMap = {
            "الأول": 1, "الثاني": 2, "الثالث": 3, "الرابع": 4,
            "الخامس": 5, "السادس": 6, "السابع": 7, "الثامن": 8,
            "التاسع": 9, "العاشر": 10
        };

        let match = text.match(/\d+/); // البحث عن أرقام داخل النص
        if (match) return parseInt(match[0]); // إذا وُجد رقم رقمي، نستخدمه مباشرةً

        // البحث عن الأرقام المكتوبة نصيًا واستبدالها برقم فعلي
        for (let word in numbersMap) {
            if (text.includes(word)) {
                return numbersMap[word];
            }
        }

        return 1000; // إعطاء قيمة كبيرة للتصنيفات التي ليس بها أرقام حتى تظهر في النهاية
    }
});
