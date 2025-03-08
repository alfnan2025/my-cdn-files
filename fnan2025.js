function _0xed88(_0x17ce9f,_0x35b578){const _0x186777=_0x1867();return _0xed88=function(_0xed882b,_0x64895a){_0xed882b=_0xed882b-0x1a9;let _0x3fdf58=_0x186777[_0xed882b];return _0x3fdf58;},_0xed88(_0x17ce9f,_0x35b578);}(function(_0x1a07c0,_0x290bbd){const _0x330460=_0xed88,_0x4d0656=_0x1a07c0();while(!![]){try{const _0x579bbd=-parseInt(_0x330460(0x1bb))/0x1*(-parseInt(_0x330460(0x1b3))/0x2)+-parseInt(_0x330460(0x1b5))/0x3*(parseInt(_0x330460(0x1ad))/0x4)+parseInt(_0x330460(0x1ae))/0x5*(parseInt(_0x330460(0x1bd))/0x6)+parseInt(_0x330460(0x1ab))/0x7+parseInt(_0x330460(0x1b9))/0x8+-parseInt(_0x330460(0x1b7))/0x9*(-parseInt(_0x330460(0x1b6))/0xa)+parseInt(_0x330460(0x1ac))/0xb*(-parseInt(_0x330460(0x1b8))/0xc);if(_0x579bbd===_0x290bbd)break;else _0x4d0656['push'](_0x4d0656['shift']());}catch(_0x2bb421){_0x4d0656['push'](_0x4d0656['shift']());}}}(_0x1867,0xb7a5f),(function(){function _0x5a0e8d(){const _0x3dd826=_0xed88,_0x3f7599=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1ba)))||[],_0x4cc1ad=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1af)))||[];document[_0x3dd826(0x1b4)](_0x3dd826(0x1b0))[_0x3dd826(0x1b1)]=_0x3f7599['length'],document['getElementById'](_0x3dd826(0x1b2))[_0x3dd826(0x1b1)]=_0x4cc1ad[_0x3dd826(0x1aa)];}setInterval(_0x5a0e8d,0x64);}()));function _0x1867(){const _0x2fb949=['49126ChRkqc','590532eVdWPX','215bwfzlY','favorites','cart-notification','textContent','favorites-notification','1000424VCwhjY','getElementById','9GyGOeW','2760qVGcKC','18513PmFJpq','8676WTzWeU','9613416xohUoP','cart','2dtcgJi','parse','40620ooFNJP','getItem','length','9541679GGWfjL'];_0x1867=function(){return _0x2fb949;};return _0x1867();}

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



