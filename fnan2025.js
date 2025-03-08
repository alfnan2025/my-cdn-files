function _0xed88(_0x17ce9f,_0x35b578){const _0x186777=_0x1867();return _0xed88=function(_0xed882b,_0x64895a){_0xed882b=_0xed882b-0x1a9;let _0x3fdf58=_0x186777[_0xed882b];return _0x3fdf58;},_0xed88(_0x17ce9f,_0x35b578);}(function(_0x1a07c0,_0x290bbd){const _0x330460=_0xed88,_0x4d0656=_0x1a07c0();while(!![]){try{const _0x579bbd=-parseInt(_0x330460(0x1bb))/0x1*(-parseInt(_0x330460(0x1b3))/0x2)+-parseInt(_0x330460(0x1b5))/0x3*(parseInt(_0x330460(0x1ad))/0x4)+parseInt(_0x330460(0x1ae))/0x5*(parseInt(_0x330460(0x1bd))/0x6)+parseInt(_0x330460(0x1ab))/0x7+parseInt(_0x330460(0x1b9))/0x8+-parseInt(_0x330460(0x1b7))/0x9*(-parseInt(_0x330460(0x1b6))/0xa)+parseInt(_0x330460(0x1ac))/0xb*(-parseInt(_0x330460(0x1b8))/0xc);if(_0x579bbd===_0x290bbd)break;else _0x4d0656['push'](_0x4d0656['shift']());}catch(_0x2bb421){_0x4d0656['push'](_0x4d0656['shift']());}}}(_0x1867,0xb7a5f),(function(){function _0x5a0e8d(){const _0x3dd826=_0xed88,_0x3f7599=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1ba)))||[],_0x4cc1ad=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1af)))||[];document[_0x3dd826(0x1b4)](_0x3dd826(0x1b0))[_0x3dd826(0x1b1)]=_0x3f7599['length'],document['getElementById'](_0x3dd826(0x1b2))[_0x3dd826(0x1b1)]=_0x4cc1ad[_0x3dd826(0x1aa)];}setInterval(_0x5a0e8d,0x64);}()));function _0x1867(){const _0x2fb949=['49126ChRkqc','590532eVdWPX','215bwfzlY','favorites','cart-notification','textContent','favorites-notification','1000424VCwhjY','getElementById','9GyGOeW','2760qVGcKC','18513PmFJpq','8676WTzWeU','9613416xohUoP','cart','2dtcgJi','parse','40620ooFNJP','getItem','length','9541679GGWfjL'];_0x1867=function(){return _0x2fb949;};return _0x1867();}

window.addEventListener("load", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let cartCount = 0; 
    let favoritesCount = favorites.length; 

    if (cart.length > 0) {
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    }

    document.getElementById("cart-notification").innerText = cartCount;
    document.getElementById("favorites-notification").innerText = favoritesCount;

    function getFirstImage() {
        const firstImage = document.querySelector("img");
        return firstImage ? firstImage.src : "";
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
                document.getElementById("cart-notification").innerText = cartCount;
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
                document.getElementById("favorites-notification").innerText = favoritesCount;
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

    document.querySelectorAll(".product").forEach(function (product) {
        let snippet = product.querySelector(".price") ? product.querySelector(".price").innerHTML : "";

        let finalPriceMatch = snippet.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
        let discountMatch = snippet.match(/الخصم:\s*([0-9]+(?:\.[0-9]+)?)\s*%/);

        if (finalPriceMatch) {
            let finalPrice = parseFloat(finalPriceMatch[1]);
            let finalPriceElement = product.querySelector(".final-price");
            let originalPriceElement = product.querySelector(".price");

            if (discountMatch) {
                let discount = parseFloat(discountMatch[1]);
                let originalPrice = finalPrice / (1 - (discount / 100));
                originalPriceElement.innerHTML = originalPrice.toFixed(2) + " جنيه";
                originalPriceElement.style.display = "inline";
                originalPriceElement.style.opacity = 1;
            } else {
                originalPriceElement.style.display = "none";
            }

            finalPriceElement.innerHTML = finalPrice.toFixed(2) + " جنيه";
            finalPriceElement.style.display = "inline";
            finalPriceElement.style.opacity = 1;
        }
    });
});

function showCartContents() {
    let cartTooltip = document.getElementById("cart-tooltip");
    cartTooltip.innerHTML = "";

    if (cart.length > 0) {
        cart.forEach(item => {
            let itemElement = document.createElement("div");
            itemElement.innerHTML = `${item.title} - ${item.quantity} x ${item.price} جنيه - الإجمالي: ${item.totalPrice} جنيه`;
            cartTooltip.appendChild(itemElement);
        });
    } else {
        cartTooltip.innerHTML = "سلة المشتريات فارغة.";
    }

    cartTooltip.style.display = "block";
}

function showFavoritesContents() {
    let favoritesTooltip = document.getElementById("favorites-tooltip");
    favoritesTooltip.innerHTML = "";

    if (favorites.length > 0) {
        favorites.forEach(item => {
            let itemElement = document.createElement("div");
            itemElement.innerHTML = `${item.title} - <img alt='${item.title} image' src='${item.image}' style='width: 50px; height: auto;'/>`;
            favoritesTooltip.appendChild(itemElement);
        });
    } else {
        favoritesTooltip.innerHTML = "لا توجد منتجات في المفضلة.";
    }

    favoritesTooltip.style.display = "block";
}

function hideCartContents() {
    document.getElementById("cart-tooltip").style.display = "none";
}

function hideFavoritesContents() {
    document.getElementById("favorites-tooltip").style.display = "none";
}
