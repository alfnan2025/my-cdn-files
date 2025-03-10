
document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById('cart-items');
    let totalPriceElement = document.getElementById('total-price');
    let shippingCostElement = document.getElementById('shipping-cost');
    let checkoutButton = document.getElementById('checkout-button');
    let orderForm = document.getElementById('order-form');
    let submitOrderButton = document.getElementById('submit-order');
    let notification = document.getElementById('notification');
    let stateInput = document.getElementById('state');
    let freeShippingAlert = document.getElementById('free-shipping-alert');
    let waitMessage = document.getElementById('wait-message');
    let waitTimer = document.getElementById('wait-timer');

    const MAX_REQUESTS = 2;
    const TIME_LIMIT = 5 * 60 * 1000; // 5 دقائق بالميلي ثانية

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        checkoutButton.disabled = cart.length === 0;

        cart.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
            total += itemTotalPrice;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            let quantityControls = `
                <div class="controls">
                    <button class="decrease-quantity" data-index="${index}">➖</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">➕</button>
                    <button class="remove-button" data-index="${index}">🗑 حذف</button>
                </div>
            `;

            let colorHtml = item.color ? `<p>اللون: ${item.color}</p>` : "";
            let sizeHtml = item.size ? `<p>الحجم: ${item.size}</p>` : "";

            cartItem.innerHTML = `
                <div style="position: relative;">
                    <img src="${item.image}" alt="${item.title}">
                    <span class="item-price">🏷️ ${item.price.toFixed(2)} جنيه</span>
                </div>
                <div class="item-details">
                    <h2 class="item-title"><a href="${item.link}" target="_blank">${item.title} 🌟</a></h2>
                    ${quantityControls}
                    ${colorHtml}
                    ${sizeHtml}
                    <p style="font-size: 14px;">المجموع: (${itemTotalPrice.toFixed(2)} جنيه)</p>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.innerText = `💰 المجموع الكلي: ${total.toFixed(2)} جنيه`;
        updateShippingCost();

        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', function() {
                const index = button.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = button.getAttribute('data-index');
                cart[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = button.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCartItems();
            });
        });
    }

    function getShippingCost(total) {
        if (total > 1000) {
            freeShippingAlert.style.display = "block";
            return 0;  // الشحن مجاني
        } else {
            freeShippingAlert.style.display = "none";
        }

        let state = stateInput.value.trim().toLowerCase();
        if (state === "القاهرة" || state === "الجيزة") {
            return 50;
        } else if (state.length > 0) {
            return 70;
        } else {
            return 0;
        }
    }

    function updateShippingCost() {
        let total = getTotalPrice();
        let shippingCost = getShippingCost(total);
        shippingCostElement.innerText = `🚚 مصاريف الشحن: ${shippingCost} جنيه`;
        totalPriceElement.innerText = `💰 المجموع الكلي: ${(total + shippingCost).toFixed(2)} جنيه`;
    }

    function getTotalPrice() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    stateInput.addEventListener("input", updateShippingCost);

    function canCheckout() {
        const requests = JSON.parse(localStorage.getItem('requests')) || [];
        const now = Date.now();
        const recentRequests = requests.filter(requestTime => now - requestTime < TIME_LIMIT);

        if (recentRequests.length >= MAX_REQUESTS) {
            const remainingTime = TIME_LIMIT - (now - recentRequests[0]);
            if (remainingTime > 0) {
                waitMessage.style.display = "block";
                let minutes = Math.floor((remainingTime / 1000 / 60) % 60);
                let seconds = Math.floor((remainingTime / 1000) % 60);
                waitTimer.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                return false;
            }
        }
        return true;
    }

    checkoutButton.addEventListener("click", function() {
        if (!canCheckout()) return;
        orderForm.style.display = orderForm.style.display === 'none' || orderForm.style.display === '' ? 'block' : 'none';
    });

    submitOrderButton.addEventListener("click", function() {
        if (!canCheckout()) return;

        let name = document.getElementById('name').value;
        let phone = document.getElementById('phone').value.trim();
        let state = stateInput.value;
        let city = document.getElementById('city').value;
        let address = document.getElementById('address').value;
        let orderDate = new Date().toLocaleString();

        const arabicOnlyRegex = /^[\u0600-\u066F\s]+$/; // يسمح بالحروف العربية فقط

        if (!arabicOnlyRegex.test(name) || !name.trim()) {
            alert("يرجى إدخال اسم صحيح باللغة العربية فقط.");
            return;
        }

        if (!/^(0|\d+)$/.test(phone)) {
            alert("يرجى إدخال رقم هاتف صحيح.");
            return;
        }

        // التأكد من أن الرقم يتم إدخاله كنص في Google Sheets
        phone = phone.startsWith('0') ? `'${phone}` : phone;

        if (!arabicOnlyRegex.test(state) || state.trim().length === 0) {
            alert("يرجى إدخال المحافظة باللغة العربية فقط.");
            return;
        }

        if (!arabicOnlyRegex.test(city) || city.trim().length === 0) {
            alert("يرجى إدخال المدينة باللغة العربية فقط.");
            return;
        }

        if (!/^[\u0600-\u066F0-9\s]+$/.test(address) || address.trim().length === 0) {
            alert("يرجى إدخال العنوان باللغة العربية أو الأرقام.");
            return;
        }

        let formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone); // إرسال رقم الهاتف مع الصفر عند البداية
        formData.append("state", state);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("orderDate", orderDate);

        // إعداد postTitle فقط لتحتوي على روابط المنتجات الموجودة في السلة بشكل صحيح
        let postLinks = cart.map(item => item.link).join(', ');
        formData.append("productLink_", postLinks); // تخزين الروابط فقط

        formData.append("totalPrice", totalPriceElement.innerText.replace("💰 المجموع الكلي: ", "").trim());
        formData.append("shippingCost", getShippingCost(getTotalPrice()));

        cart.forEach((item, index) => {
            formData.append(`productName_${index}`, item.title);
            formData.append(`price_${index}`, item.price);
            formData.append(`quantity_${index}`, item.quantity);
            formData.append(`itemTotalPrice_${index}`, (item.price * item.quantity).toFixed(2));
            formData.append(`color_${index}`, item.color || "غير محدد");
            formData.append(`size_${index}`, item.size || "غير محدد");
cart.forEach((item, index) => {
    formData.append(`productLink_${index}`, item.link || "رابط غير متوفر");
});
        });

        let requests = JSON.parse(localStorage.getItem('requests')) || [];
        requests.push(Date.now());
        localStorage.setItem('requests', JSON.stringify(requests));

        fetch("https://script.google.com/macros/s/AKfycbwjq8pBpcPpsM_jks0v2V59ZEXgQMX5tEKrFKhJSCODYSi1WejGoqiQpOeV3NC0yXuNUA/exec", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            notification.innerText = "🤩 تم إرسال الطلب بنجاح!";
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
            
            cart = [];
            localStorage.removeItem("cart");
            displayCartItems();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(async (error) => {
            console.error("❌ خطأ في الطلب:", error);
            const responseText = await error.text();
            console.error("تفاصيل الخطأ من السيرفر:", responseText);
            alert("❌ حدث خطأ أثناء إرسال الطلب. تفاصيل الخطأ في الكونسول.");
        });

    });

    displayCartItems();
});
