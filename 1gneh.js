
    document.addEventListener("DOMContentLoaded", function () {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        let cartCount = 0;
        let favoritesCount = favorites.length;

        if (cart.length > 0) {
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        }

        document.getElementById('cart-notification').innerText = cartCount;
        document.getElementById('favorites-notification').innerText = favoritesCount;

        function getFirstImage() {
            const firstImage = document.querySelector('img');
            return firstImage ? firstImage.src : '';
        }

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", function () {
                let productTitle = this.getAttribute("data-title");
                let productPriceText = this.getAttribute("data-price");
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
                    cartCount++;
                    document.getElementById('cart-notification').innerText = cartCount;
                    alert("تمت إضافة المنتج إلى السلة!");
                } else {
                    alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
                }
            });
        });

        window.addToFavorites = function (title, priceText) {
            let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
            let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

            if (productPrice > 0) {
                let existingProduct = favorites.find(item => item.title === title);
                if (!existingProduct) {
                    let productImage = getFirstImage();
                    favorites.push({
                        title: title,
                        price: productPrice,
                        image: productImage
                    });
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    favoritesCount++;
                    document.getElementById('favorites-notification').innerText = favoritesCount;
                    alert("تمت إضافة المنتج إلى المفضلة!");
                } else {
                    alert("هذا المنتج موجود بالفعل في المفضلة.");
                }
            } else {
                alert("خطأ في جلب السعر! تأكد من تنسيق البيانات.");
            }
        };

        document.querySelectorAll(".add-to-favorites").forEach(button => {
            button.addEventListener("click", function () {
                let productTitle = this.getAttribute("data-title");
                let productPriceText = this.getAttribute("data-price");
                addToFavorites(productTitle, productPriceText);
            });
        });

        document.querySelectorAll('.product').forEach(function (product) {
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
                    originalPriceElement.style.opacity = 1;
                } else {
                    originalPriceElement.style.display = 'none';
                }

                finalPriceElement.innerHTML = finalPrice.toFixed(2) + ' جنيه';
                finalPriceElement.style.display = 'inline';
                finalPriceElement.style.opacity = 1;
            }
        });
    });

    function showCartContents() {
        let cartTooltip = document.getElementById('cart-tooltip');
        cartTooltip.innerHTML = '';

        if (cart.length > 0) {
            cart.forEach(item => {
                let itemElement = document.createElement('div');
                itemElement.innerHTML = `${item.title} - ${item.quantity} x ${item.price} جنيه - الإجمالي: ${item.totalPrice} جنيه`;
                cartTooltip.appendChild(itemElement);
            });
        } else {
            cartTooltip.innerHTML = 'سلة المشتريات فارغة.';
        }

        cartTooltip.style.display = 'block';
    }

    function showFavoritesContents() {
        let favoritesTooltip = document.getElementById('favorites-tooltip');
        favoritesTooltip.innerHTML = '';

        if (favorites.length > 0) {
            favorites.forEach(item => {
                let itemElement = document.createElement('div');
                itemElement.innerHTML = `${item.title} - <img alt='${item.title} image' src='${item.image}' style='width: 50px; height: auto;'/>`;
                favoritesTooltip.appendChild(itemElement);
            });
        } else {
            favoritesTooltip.innerHTML = 'لا توجد منتجات في المفضلة.';
        }

        favoritesTooltip.style.display = 'block';
    }

    function hideCartContents() {
        document.getElementById('cart-tooltip').style.display = 'none';
    }

    function hideFavoritesContents() {
        document.getElementById('favorites-tooltip').style.display = 'none';
    }

