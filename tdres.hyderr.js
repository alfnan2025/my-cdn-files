document.addEventListener("DOMContentLoaded", function () {
    const searchContainer = document.getElementById("search-container");

    if (!searchContainer) {
        console.error("❌ لم يتم العثور على العنصر 'search-container'. تأكد من إضافته في HTML.");
        return;
    }

    // إنشاء حقل الإدخال للبحث
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "search-input";
    searchInput.placeholder = "ابحث هنا...";
    searchInput.style.width = "180px";
    searchInput.style.height = "30px";
    searchInput.style.minWidth = "180px";
    searchInput.style.maxWidth = "180px";

    // إنشاء زر البحث
    const searchButton = document.createElement("button");
    searchButton.id = "search-button";
    searchButton.innerHTML = "🔍";

    // عند النقر على زر البحث
    searchButton.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            const baseUrl = "https://tshferrrrr123.blogspot.com/search?q=";
            window.location.href = baseUrl + encodeURIComponent(query);
        } else {
            alert("❌ يرجى إدخال كلمة للبحث!");
        }
    });

    // إضافة العناصر إلى الحاوية
    searchContainer.appendChild(searchButton);
    searchContainer.appendChild(searchInput);
});
