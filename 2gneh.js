   document.addEventListener("DOMContentLoaded", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let favoritesCount = favorites.length; // عدد العناصر في المفضلة

        // تحديث عدد المفضلة في الهيدر
        function updateFavoritesCount() {
            document.getElementById('favorites-notification').innerText = favoritesCount;
        }

        function showNotification(message, type = "success") {
            let notification = document.getElementById("notification");

            // تغيير لون الإشعار حسب النوع
            if (type === "success") {
                notification.style.background = "#28a745"; // أخضر
            } else if (type === "warning") {
                notification.style.background = "#ffc107"; // أصفر
            } else if (type === "error") {
                notification.style.background = "#dc3545"; // أحمر
            }

            notification.innerHTML = message;
            notification.classList.add("show");

            setTimeout(() => {
                notification.classList.remove("show");
            }, 2000);
        }

        function updateCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        function updateFavorites() {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

        document.querySelectorAll(".product").forEach(product => {
            let title = product.querySelector(".product-title").innerText;
            let priceText = product.querySelector(".final-price").innerText; // استخدم السعر النهائي
            let imageElement = product.querySelector("img");
            let imageUrl = imageElement ? imageElement.src : "";
            let productLink = product.querySelector("a") ? product.querySelector("a").href : ""; 

            // التحقق من وجود جملة "غير متوفر"
            if (product.innerText.includes("غير متوفر")) {
                let addToCartButton = product.querySelector(".add-to-cart");
                let addToFavoritesButton = product.querySelector(".add-to-favorites");
                if (addToCartButton) addToCartButton.style.display = "none";
                if (addToFavoritesButton) addToFavoritesButton.style.display = "none";
            }

            let favButton = product.querySelector(".add-to-favorites");
            if (favButton) {
                favButton.addEventListener("click", function () {
                    addToFavorites(title, priceText, imageUrl, productLink);
                });
            }

            let cartButton = product.querySelector(".add-to-cart");
            if (cartButton) {
                cartButton.addEventListener("click", function () {
                    addToCart(title, priceText, imageUrl, productLink);
                });
            }
        });

        function addToFavorites(title, priceText, productImage, productLink) {
            let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
            let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

            if (productPrice > 0) {
                let existingProduct = favorites.find(item => item.title === title);
                if (!existingProduct) {
                    favorites.push({
                        title: title,
                        price: productPrice,
                        image: productImage,
                        link: productLink
                    });
                    favoritesCount++;
                    updateFavorites();
                    updateFavoritesCount();
                    showNotification("❤️ تمت إضافة المنتج إلى المفضلة!", "success");
                } else {
                    showNotification("ℹ️ هذا المنتج موجود بالفعل في المفضلة.", "warning");
                }
            } else {
                showNotification("⚠️ خطأ في جلب السعر! تأكد من تنسيق البيانات.", "error");
            }
        }

        function addToCart(title, priceText, productImage, productLink) {
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
                        image: productImage,
                        link: productLink
                    });
                }
                updateCart();
                showNotification("✅ تمت إضافة المنتج إلى السلة!", "success");
            } else {
                showNotification("⚠️ خطأ في جلب السعر! تأكد من تنسيق البيانات.", "error");
            }
        }

        updateFavoritesCount(); // تحديث عدد المفضلة عند تحميل الصفحة

        setInterval(() => {
            cart = JSON.parse(localStorage.getItem("cart")) || [];
            favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            favoritesCount = favorites.length;
            updateFavoritesCount();
        }, 400); // تحديث كل 400 مللي ثانية
    });