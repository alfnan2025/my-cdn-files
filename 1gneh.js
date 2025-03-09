document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    let favoritesCount = favorites.length;

    document.getElementById('cart-notification').innerText = cartCount;
    document.getElementById('favorites-notification').innerText = favoritesCount;

    // دالة لجلب أول صورة من التدوينة
    function getFirstImage() {
        const firstImage = document.querySelector('img');
        return firstImage ? firstImage.src : '';
    }

    // كائن يحتوي على عمليات السلة والمفضلة
    const ShopManager = {
        addToCart: function (button) {
            let productTitle = button.getAttribute("data-title");
            let productPriceText = button.getAttribute("data-price");

            let priceMatch = productPriceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
            let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
            let productImage = getFirstImage();

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
                        image: productImage
                    });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                document.getElementById('cart-notification').innerText = ++cartCount;
                alert("تمت إضافة المنتج إلى السلة!");
            } else {
                alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
            }
        },

        addToFavorites: function (title, priceText) {
            let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
            let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

            if (productPrice > 0) {
                let existingProduct = favorites.find(item => item.title === title);
                if (!existingProduct) {
                    let productImage = getFirstImage();
                    favorites.push({ title, price: productPrice, image: productImage });
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    document.getElementById('favorites-notification').innerText = ++favoritesCount;
                    alert("تمت إضافة المنتج إلى المفضلة!");
                } else {
                    alert("هذا المنتج موجود بالفعل في المفضلة.");
                }
            } else {
                alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
            }
        }
    };

    // تفعيل الأزرار الخاصة بالسلة والمفضلة
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => ShopManager.addToCart(button));
    });

    document.querySelectorAll(".add-to-favorites").forEach(button => {
        button.addEventListener("click", () => {
            let title = button.getAttribute("data-title");
            let priceText = button.getAttribute("data-price");
            ShopManager.addToFavorites(title, priceText);
        });
    });

    // عرض الأسعار المخفية
    document.querySelectorAll('.product').forEach(product => {
        let snippet = product.querySelector('.price') ? product.querySelector('.price').innerHTML : "";
        let finalPriceMatch = snippet.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
        let discountMatch = snippet.match(/الخصم:\s*([0-9]+(?:\.[0-9]+)?)\s*%/);

        if (finalPriceMatch) {
            let finalPrice = parseFloat(finalPriceMatch[1]);
            let finalPriceElement = product.querySelector('.final-price');
            let originalPriceElement = product.querySelector('.price');

            if (discountMatch) {
                let discount = parseFloat(discountMatch[1]);
                let originalPrice = finalPrice / (1 - (discount / 100));
                originalPriceElement.innerHTML = originalPrice.toFixed(2) + ' جنيه';
                originalPriceElement.style.display = 'inline';
            } else {
                originalPriceElement.style.display = 'none';
            }

            finalPriceElement.innerHTML = finalPrice.toFixed(2) + ' جنيه';
            finalPriceElement.style.display = 'inline';
        }
    });

    // وظائف عرض محتويات السلة والمفضلة
    function showCartContents() {
        let cartTooltip = document.getElementById('cart-tooltip');
        cartTooltip.innerHTML = cart.length
            ? cart.map(item => `${item.title} - ${item.quantity} x ${item.price} جنيه - الإجمالي: ${item.totalPrice} جنيه`).join('<br>')
            : 'سلة المشتريات فارغة.';
        cartTooltip.style.display = 'block';
    }

    function showFavoritesContents() {
        let favoritesTooltip = document.getElementById('favorites-tooltip');
        favoritesTooltip.innerHTML = favorites.length
            ? favorites.map(item => `${item.title} - <img src='${item.image}' alt='${item.title}' style='width:50px;height:auto;'/>`).join('<br>')
            : 'لا توجد منتجات في المفضلة.';
        favoritesTooltip.style.display = 'block';
    }

    function hideCartContents() {
        document.getElementById('cart-tooltip').style.display = 'none';
    }

    function hideFavoritesContents() {
        document.getElementById('favorites-tooltip').style.display = 'none';
    }

    // ربط الوظائف بعناصر HTML
    window.showCartContents = showCartContents;
    window.showFavoritesContents = showFavoritesContents;
    window.hideCartContents = hideCartContents;
    window.hideFavoritesContents = hideFavoritesContents;
});
