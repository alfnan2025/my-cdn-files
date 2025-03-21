 var searchContainer = document.getElementById("search-container");

    // إنشاء عنصر الإدخال بحجم مناسب
    var searchInput = document.createElement("input");
    searchInput.setAttribute("type", "text");
    searchInput.setAttribute("placeholder", "ابحث هنا...");
    searchInput.setAttribute("id", "search-input");

    // ضبط حجم الإدخال
    searchInput.style.width = "180px";
    searchInput.style.height = "30px";
    searchInput.style.minWidth = "180px";
    searchInput.style.maxWidth = "180px";

    // إنشاء زر البحث
    var searchButton = document.createElement("button");
    searchButton.setAttribute("id", "search-button");
    searchButton.innerHTML = "🔍";

    searchButton.onclick = function () {
        var query = searchInput.value.trim();
        if (query !== "") {
            var baseUrl = "https://tshferrrrr123.blogspot.com/search?q=";
            window.location.href = baseUrl + encodeURIComponent(query);
        } else {
            alert("يرجى إدخال كلمة للبحث!");
        }
    };

    // إضافة عناصر البحث إلى الحاوية
    searchContainer.appendChild(searchButton);
    searchContainer.appendChild(searchInput);
