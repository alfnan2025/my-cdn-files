    document.addEventListener("DOMContentLoaded", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        function updateCart() {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        function updateFavorites() {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }

        function extractFirstImage(postContent) {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = postContent;
            let img = tempDiv.querySelector("img");
            return img ? img.src : "https://via.placeholder.com/150"; // صورة افتراضية
        }

        function showNotification(message, type = "success") {
            let notification = document.getElementById("notification");

            if (type === "success") {
                notification.style.background = "#28a745";
            } else if (type === "warning") {
                notification.style.background = "#ffc107";
            } else if (type === "error") {
                notification.style.background = "#dc3545";
            }

            notification.innerHTML = message;
            notification.classList.add("show");

            setTimeout(() => {
                notification.classList.remove("show");
            }, 2000);
        }

        document.querySelectorAll(".full-post").forEach(post => {
            const isUnavailable = post.innerHTML.includes('غير متوفر');
            post.querySelectorAll('.add-to-cart, .add-to-favorites').forEach(button => {
                if (isUnavailable) {
                    button.classList.add('disabled');
                    button.addEventListener('click', function () {
                        showNotification("⚠️ المنتج غير متوفر حاليا.", "warning");
                    });
                }
            });
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", function (event) {
                if (button.classList.contains('disabled')) return;

                let postContent = event.currentTarget.closest(".full-post").innerHTML;
                let productTitle = event.currentTarget.getAttribute("data-title");
                let productPriceText = event.currentTarget.getAttribute("data-price");
                let productImage = extractFirstImage(postContent);
                let productLink = window.location.href; // رابط التدوينة

                let priceMatch = productPriceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
                let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

                const selectedSize = document.querySelector('.size') ? document.querySelector('.size').value : null;
                const selectedColor = document.querySelector('.color') ? document.querySelector('.color').value : null;

                if (productPrice > 0) {
                    let existingProduct = cart.find(p => p.title === productTitle);
                    if (existingProduct) {
                        existingProduct.quantity += 1;
                        existingProduct.totalPrice = (existingProduct.quantity * existingProduct.price).toFixed(2);
                    } else {
                        cart.push({
                            title: productTitle,
                            price: productPrice,
                            quantity: 1,
                            totalPrice: productPrice.toFixed(2),
                            image: productImage,
                            size: selectedSize,
                            color: selectedColor,
                            link: productLink // إضافة رابط التدوينة
                        });
                    }
                    updateCart();
                    showNotification("✅ تمت إضافة المنتج إلى السلة!", "success");
                } else {
                    showNotification("⚠️ خطأ في جلب السعر! تأكد من تنسيق البيانات.", "error");
                }
            });
        });

        document.querySelectorAll(".add-to-favorites").forEach(button => {
            button.addEventListener("click", function (event) {
                if (button.classList.contains('disabled')) return;

                let postContent = event.currentTarget.closest(".full-post").innerHTML;
                let productTitle = event.currentTarget.getAttribute("data-title");
                let productPriceText = event.currentTarget.getAttribute("data-price");
                let productImage = extractFirstImage(postContent);
                let productLink = window.location.href; // رابط التدوينة

                let priceMatch = productPriceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
                let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

                const selectedSize = document.querySelector('.size') ? document.querySelector('.size').value : null;
                const selectedColor = document.querySelector('.color') ? document.querySelector('.color').value : null;

                if (productPrice > 0) {
                    let existingProduct = favorites.find(item => item.title === productTitle);
                    if (!existingProduct) {
                        favorites.push({
                            title: productTitle,
                            price: productPrice,
                            image: productImage,
                            size: selectedSize, // تسجيل الحجم
                            color: selectedColor, // تسجيل اللون
                            link: productLink // إضافة رابط التدوينة
                        });
                        updateFavorites();
                        showNotification("❤️ تمت إضافة المنتج إلى المفضلة!", "success");
                    } else {
                        showNotification("ℹ️ هذا المنتج موجود بالفعل في المفضلة.", "warning");
                    }
                } else {
                    showNotification("⚠️ خطأ في جلب السعر! تأكد من تنسيق البيانات.", "error");
                }
            });
        });
    });