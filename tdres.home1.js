document.addEventListener("DOMContentLoaded", function () {
    // التحقق مما إذا كان رابط الصفحة يحتوي على "?q=" (يُشير إلى البحث أو التصفية)
    const isSearchPage = window.location.href.includes("?q=");

    if (isSearchPage) { 
        // العثور على الشريط الجانبي للتصنيفات
        const categorySidebar = document.querySelector(".category-sidebar");

        // إخفاء الشريط الجانبي إذا كان موجودًا
        if (categorySidebar) {
            categorySidebar.style.display = "none";
        }
    }
});
