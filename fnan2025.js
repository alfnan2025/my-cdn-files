var myScripts = myScripts || {}; // التأكد من عدم تعارض الكود مع كود آخر

myScripts.updateNotifications = function() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const favoritesItems = JSON.parse(localStorage.getItem("favorites")) || [];

    const cartNotification = document.getElementById("cart-notification");
    const favoritesNotification = document.getElementById("favorites-notification");

    if (cartNotification) {
        cartNotification.textContent = cartItems.length;
    }

    if (favoritesNotification) {
        favoritesNotification.textContent = favoritesItems.length;
    }
};

// تشغيل التحديث بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    myScripts.updateNotifications();
    setInterval(myScripts.updateNotifications, 500); // تحديث كل نصف ثانية
});

// الكود الثاني 


var myScripts = myScripts || {}; // التأكد من عدم تعارض الكود مع كود آخر

myScripts.handleErrorAndSearch = function() {
    let errorMessage = document.getElementById("error-message");

    // التحقق مما إذا كانت الصفحة هي 404
    let is404Page = document.title.includes("404"); 
    if (is404Page && errorMessage) {
        errorMessage.textContent = "لم يتم العثور على الرابط 😢"; 
        errorMessage.style.display = "block"; 
    }

    // التحقق مما إذا كانت الصفحة هي صفحة البحث
    let isSearchPage = window.location.pathname.includes("/search");
    if (isSearchPage && errorMessage) {
        let resultsContainer = document.querySelector(".product");
        if (!resultsContainer) {
            errorMessage.style.display = "block"; 
        } else {
            errorMessage.style.display = "none"; 
        }
    }
};

myScripts.updateFavoritesCount = function() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let favoritesCount = favorites.length;
    let favoritesNotification = document.getElementById("favorites-notification");

    if (favoritesNotification) {
        favoritesNotification.innerText = favoritesCount;
    }
};

// تشغيل الأكواد بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    myScripts.handleErrorAndSearch();
    myScripts.updateFavoritesCount();
});



// الكود الثالث 



var myScripts = myScripts || {}; // التأكد من عدم تعارض الكود مع كود آخر

myScripts.toggleMobileMenu = function() {
    let mobileMenuButton = document.getElementById("mobile-menu");
    let navLinks = document.querySelector(".nav-links");

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    }
};

// تشغيل الكود بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    myScripts.toggleMobileMenu();
});



// الرابع

var myScripts = myScripts || {};

// تحديث إشعارات السلة والمفضلة
myScripts.updateNotifications = function() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const favoritesItems = JSON.parse(localStorage.getItem("favorites")) || [];

    let cartNotification = document.getElementById('cart-notification');
    let favoritesNotification = document.getElementById('favorites-notification');

    if (cartNotification) cartNotification.textContent = cartItems.length;
    if (favoritesNotification) favoritesNotification.textContent = favoritesItems.length;
};

// التحقق من صفحات 404 وصفحات البحث
myScripts.handleErrors = function() {
    let is404Page = document.title.includes("404");
    let isSearchPage = window.location.pathname.indexOf('/search') !== -1;
    let errorMessage = document.getElementById('error-message');

    if (is404Page && errorMessage) {
        errorMessage.textContent = "لم يتم العثور على الرابط 😢";
        errorMessage.style.display = 'block';
    }

    if (isSearchPage && errorMessage) {
        let resultsContainer = document.querySelector('.product');
        errorMessage.style.display = resultsContainer ? 'none' : 'block';
    }
};

// التحكم في القائمة الجانبية على الهاتف
myScripts.toggleMobileMenu = function() {
    let mobileMenuButton = document.getElementById("mobile-menu");
    let navLinks = document.querySelector(".nav-links");

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    }
};

// استرداد أول صورة من التدوينة
myScripts.getFirstImage = function() {
    const firstImage = document.querySelector('img');
    return firstImage ? firstImage.src : '';
};

// إضافة المنتجات إلى السلة
myScripts.addToCart = function(title, priceText) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCount = 0;

    let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
    let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

    if (productPrice > 0) {
        let existingProduct = cart.find(p => p.title === title);
        if (existingProduct) {
            existingProduct.quantity += 1;
            existingProduct.totalPrice = (existingProduct.quantity * existingProduct.price).toFixed(2);
        } else {
            cart.push({
                title: title,
                price: productPrice,
                quantity: 1,
                totalPrice: productPrice.toFixed(2),
                image: myScripts.getFirstImage()
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-notification').innerText = cartCount;
        alert("تمت إضافة المنتج إلى السلة!");
    } else {
        alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
    }
};

// إضافة المنتجات إلى المفضلة
myScripts.addToFavorites = function(title, priceText) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
    let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

    if (productPrice > 0) {
        let existingProduct = favorites.find(item => item.title === title);
        if (!existingProduct) {
            favorites.push({
                title: title,
                price: productPrice,
                image: myScripts.getFirstImage()
            });

            localStorage.setItem("favorites", JSON.stringify(favorites));
            document.getElementById('favorites-notification').innerText = favorites.length;
            alert("تمت إضافة المنتج إلى المفضلة!");
        } else {
            alert("هذا المنتج موجود بالفعل في المفضلة.");
        }
    } else {
        alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
    }
};

// عرض محتويات السلة عند التحريك فوقها
myScripts.showCartContents = function() {
    let cartTooltip = document.getElementById('cart-tooltip');
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cartTooltip) {
        cartTooltip.innerHTML = cart.length > 0 ? cart.map(item =>
            `<div>${item.title} - ${item.quantity} x ${item.price} جنيه - الإجمالي: ${item.totalPrice} جنيه</div>`
        ).join('') : 'سلة المشتريات فارغة.';
        cartTooltip.style.display = 'block';
    }
};

// عرض محتويات المفضلة عند التحريك فوقها
myScripts.showFavoritesContents = function() {
    let favoritesTooltip = document.getElementById('favorites-tooltip');
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favoritesTooltip) {
        favoritesTooltip.innerHTML = favorites.length > 0 ? favorites.map(item =>
            `<div>${item.title} - <img src='${item.image}' style='width: 50px; height: auto;'/></div>`
        ).join('') : 'لا توجد منتجات في المفضلة.';
        favoritesTooltip.style.display = 'block';
    }
};

// إخفاء محتويات السلة والمفضلة عند الخروج
myScripts.hideCartContents = function() {
    let cartTooltip = document.getElementById('cart-tooltip');
    if (cartTooltip) cartTooltip.style.display = 'none';
};

myScripts.hideFavoritesContents = function() {
    let favoritesTooltip = document.getElementById('favorites-tooltip');
    if (favoritesTooltip) favoritesTooltip.style.display = 'none';
};

// تشغيل الوظائف عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    myScripts.updateNotifications();
    myScripts.handleErrors();
    myScripts.toggleMobileMenu();

    // تفعيل أزرار الإضافة إلى السلة
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function() {
            myScripts.addToCart(this.getAttribute("data-title"), this.getAttribute("data-price"));
        });
    });

    // تفعيل أزرار الإضافة إلى المفضلة
    document.querySelectorAll(".add-to-favorites").forEach(button => {
        button.addEventListener("click", function() {
            myScripts.addToFavorites(this.getAttribute("data-title"), this.getAttribute("data-price"));
        });
    });
});















