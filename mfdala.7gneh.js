document.addEventListener("DOMContentLoaded", function () {
    const favoritesContainer = document.getElementById("favorites-list");
    const totalPriceElement = document.getElementById("total-price");
    const addAllToCartButton = document.getElementById("add-all-to-cart");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>❌ لا توجد منتجات في المفضلة.</p>";
        totalPriceElement.style.display = "none";
        addAllToCartButton.style.display = "none"; 
        return;
    }

    function renderFavorites() {
        favoritesContainer.innerHTML = ""; 

        favorites.forEach((product, index) => {
            let productDiv = document.createElement("div");
            productDiv.className = "favorite-item";

            let imageContainer = document.createElement("div");
            imageContainer.className = "image-container";

            let priceOverlay = document.createElement("div");
            priceOverlay.className = "price-overlay";
            priceOverlay.textContent = `💰 ${product.price ? product.price + " ج.م" : "غير متوفر"}`;

            let imageElement = document.createElement("img");
            imageElement.src = product.image;
            imageElement.alt = product.title;

            imageContainer.appendChild(priceOverlay);
            imageContainer.appendChild(imageElement);

            let productInfo = document.createElement("div");
            productInfo.className = "product-info";

            let titleElement = document.createElement("a");
            titleElement.textContent = product.title;
            titleElement.className = "title";
            titleElement.href = product.link;
            titleElement.target = "_blank";
            titleElement.style.textDecoration = "none"; 
            titleElement.style.color = "black"; 

            let quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = product.quantity || 1;
            quantityInput.min = 1; 
            quantityInput.style.width = "60px";

            let individualTotalPriceElement = document.createElement("span");
            
            function updateIndividualTotalPrice() {
                let price = parseFloat(product.price) || 0;
                let quantity = parseInt(quantityInput.value) || 1;
                let individualTotalPrice = (price * quantity).toFixed(2);
                individualTotalPriceElement.textContent = `💵 الإجمالي: ${individualTotalPrice} ج.م`;
            }

            updateIndividualTotalPrice();

            quantityInput.addEventListener("change", function () {
                const newQuantity = parseInt(quantityInput.value);
                if (newQuantity > 0) {
                    product.quantity = newQuantity;
                    updateIndividualTotalPrice();
                    updateTotalPrice();
                    saveFavorites();
                } else {
                    quantityInput.value = product.quantity; 
                }
            });

            let buttonsContainer = document.createElement("div");
            buttonsContainer.className = "buttons";

            let removeButton = document.createElement("button");
            removeButton.innerHTML = "🗑️";
            removeButton.onclick = function () {
                favorites.splice(index, 1);
                saveFavorites();
                renderFavorites();
                updateTotalPrice();
            };

            let addToCartButton = document.createElement("button");
            addToCartButton.textContent = "🛒";
            addToCartButton.onclick = function () {
                let updatedQuantity = parseInt(quantityInput.value);
                if (isNaN(updatedQuantity) || updatedQuantity <= 0) {
                    updatedQuantity = 1; // تعيين الكمية إلى 1 إذا كانت غير صالحة
                }
                sendToCart({ ...product, quantity: updatedQuantity }); // ✅ إرسال الكمية المحدثة
                favorites.splice(index, 1);
                saveFavorites();
                renderFavorites();
                updateTotalPrice();
            };

            buttonsContainer.appendChild(addToCartButton);
            buttonsContainer.appendChild(removeButton);

            // إضافة اللون والحجم تحت العنوان
            let colorElement, sizeElement;
            if (product.color) {
                colorElement = document.createElement("span");
                colorElement.textContent = `🎨 اللون: ${product.color}`;
            }

            if (product.size) {
                sizeElement = document.createElement("span");
                sizeElement.textContent = `📏 الحجم: ${product.size}`;
            }

            // إضافة العنوان، الكمية، والسعر
            productInfo.appendChild(titleElement);
            productInfo.appendChild(quantityInput);
            productInfo.appendChild(individualTotalPriceElement);

            // إضافة اللون والحجم تحت العنوان
            if (colorElement) productInfo.appendChild(colorElement);
            if (sizeElement) productInfo.appendChild(sizeElement);

            productInfo.appendChild(buttonsContainer);

            productDiv.appendChild(imageContainer);
            productDiv.appendChild(productInfo);
            favoritesContainer.appendChild(productDiv);
        });
    }

    renderFavorites();
    updateTotalPrice();

    addAllToCartButton.onclick = function () {
        favorites.forEach(product => {
            let updatedQuantity = parseInt(product.quantity);
            if (isNaN(updatedQuantity) || updatedQuantity <= 0) {
                updatedQuantity = 1; // تعيين الكمية إلى 1 إذا كانت غير صالحة
            }
            sendToCart({ ...product, quantity: updatedQuantity });
        });

        favorites = []; // مسح المفضلة بعد إضافة كل المنتجات
        saveFavorites();
        renderFavorites();
        updateTotalPrice();
    };

    function sendToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites)); 
    }

    function updateTotalPrice() {
        let grandTotal = 0; 
        favorites.forEach((product) => {
            let price = parseFloat(product.price) || 0;
            let quantity = parseInt(product.quantity) || 1;
            grandTotal += price * quantity;
        });
        totalPriceElement.textContent = `💵 السعر الإجمالي: ${grandTotal.toFixed(2)} ج.م`; 
    }
});
