document.addEventListener("DOMContentLoaded", function () {
    // التحقق إذا كانت الصفحة 404
    let is404Page = document.title.includes("404");
    if (is404Page) {
        let errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.textContent = "لم يتم العثور على الرابط 😢"; // تغيير الرسالة
            errorMessage.style.display = "block"; // إظهار رسالة الخطأ
        }
    }

    let isSearchPage = window.location.pathname.includes("/search");

    // إذا كانت صفحة البحث، تحقق من وجود نتائج
    if (isSearchPage) {
        let resultsContainer = document.querySelector(".product"); // تحقق من العنصر
        let errorMessage = document.getElementById("error-message");

        if (errorMessage) {
            errorMessage.style.display = resultsContainer ? "none" : "block";
        }
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let favoritesCount = favorites.length; // عدد العناصر في المفضلة

    // تحديث عدد المفضلة في الهيدر
    function updateFavoritesCount() {
        let favoritesNotification = document.getElementById("favorites-notification");
        if (favoritesNotification) {
            favoritesNotification.innerText = favoritesCount;
        }
    }

    updateFavoritesCount(); // استدعاء التحديث عند تحميل الصفحة
});



