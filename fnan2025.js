function _0xed88(_0x17ce9f,_0x35b578){const _0x186777=_0x1867();return _0xed88=function(_0xed882b,_0x64895a){_0xed882b=_0xed882b-0x1a9;let _0x3fdf58=_0x186777[_0xed882b];return _0x3fdf58;},_0xed88(_0x17ce9f,_0x35b578);}(function(_0x1a07c0,_0x290bbd){const _0x330460=_0xed88,_0x4d0656=_0x1a07c0();while(!![]){try{const _0x579bbd=-parseInt(_0x330460(0x1bb))/0x1*(-parseInt(_0x330460(0x1b3))/0x2)+-parseInt(_0x330460(0x1b5))/0x3*(parseInt(_0x330460(0x1ad))/0x4)+parseInt(_0x330460(0x1ae))/0x5*(parseInt(_0x330460(0x1bd))/0x6)+parseInt(_0x330460(0x1ab))/0x7+parseInt(_0x330460(0x1b9))/0x8+-parseInt(_0x330460(0x1b7))/0x9*(-parseInt(_0x330460(0x1b6))/0xa)+parseInt(_0x330460(0x1ac))/0xb*(-parseInt(_0x330460(0x1b8))/0xc);if(_0x579bbd===_0x290bbd)break;else _0x4d0656['push'](_0x4d0656['shift']());}catch(_0x2bb421){_0x4d0656['push'](_0x4d0656['shift']());}}}(_0x1867,0xb7a5f),(function(){function _0x5a0e8d(){const _0x3dd826=_0xed88,_0x3f7599=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1ba)))||[],_0x4cc1ad=JSON[_0x3dd826(0x1bc)](localStorage[_0x3dd826(0x1a9)](_0x3dd826(0x1af)))||[];document[_0x3dd826(0x1b4)](_0x3dd826(0x1b0))[_0x3dd826(0x1b1)]=_0x3f7599['length'],document['getElementById'](_0x3dd826(0x1b2))[_0x3dd826(0x1b1)]=_0x4cc1ad[_0x3dd826(0x1aa)];}setInterval(_0x5a0e8d,0x64);}()));function _0x1867(){const _0x2fb949=['49126ChRkqc','590532eVdWPX','215bwfzlY','favorites','cart-notification','textContent','favorites-notification','1000424VCwhjY','getElementById','9GyGOeW','2760qVGcKC','18513PmFJpq','8676WTzWeU','9613416xohUoP','cart','2dtcgJi','parse','40620ooFNJP','getItem','length','9541679GGWfjL'];_0x1867=function(){return _0x2fb949;};return _0x1867();}

    document.addEventListener(&quot;DOMContentLoaded&quot;, function() {
        let cart = JSON.parse(localStorage.getItem(&quot;cart&quot;)) || [];
        let favorites = JSON.parse(localStorage.getItem(&quot;favorites&quot;)) || [];
        let cartCount = 0; // عدد العناصر في السلة
        let favoritesCount = favorites.length; // عدد العناصر في المفضلة

        // تحديث عدد العناصر في السلة عند تحميل الصفحة
        if (cart.length &gt; 0) {
            cartCount = cart.reduce((total, item) =&gt; total + item.quantity, 0); // حساب العدد الإجمالي
        }
        document.getElementById(&#39;cart-notification&#39;).innerText = cartCount;
        document.getElementById(&#39;favorites-notification&#39;).innerText = favoritesCount; 

        // دالة لجلب أول صورة من التدوينة
        function getFirstImage() {
            const firstImage = document.querySelector(&#39;img&#39;); // إعادة أول صورة موجودة في الوثيقة
            return firstImage ? firstImage.src : &#39;&#39;; // إرجاع رابط الصورة أو سلسلة فارغة إذا لم توجد صورة
        }

        // إضافة مستمع لزر إضافة للسلة
        document.querySelectorAll(&quot;.add-to-cart&quot;).forEach(button =&gt; {
            button.addEventListener(&quot;click&quot;, function() {
                let productTitle = this.getAttribute(&quot;data-title&quot;);
                let productPriceText = this.getAttribute(&quot;data-price&quot;);

                // استخراج السعر فقط
                let priceMatch = productPriceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
                let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

                // جلب الصورة من التدوينة
                let productImage = getFirstImage();

                if (productPrice &gt; 0) {
                    let existingProduct = cart.find(p =&gt; p.title === productTitle);
                    if (existingProduct) {
                        existingProduct.quantity += 1;
                        existingProduct.totalPrice = (existingProduct.quantity * existingProduct.price).toFixed(2);
                    } else {
                        cart.push({
                            title: productTitle,
                            price: productPrice,
                            quantity: 1,
                            totalPrice: productPrice.toFixed(2),
                            image: productImage // إضافة رابط الصورة
                        });
                    }

                    localStorage.setItem(&quot;cart&quot;, JSON.stringify(cart));
                    cartCount++;
                    document.getElementById(&#39;cart-notification&#39;).innerText = cartCount; // تحديث عدد السلة
                    alert(&quot;تمت إضافة المنتج إلى السلة!&quot;);
                } else {
                    alert(&quot;خطأ في جلب السعر! تأكد من تنسيق البيانات.&quot;);
                }
            });
        });

        // دالة إضافة للمفضلة
      // دالة إضافة للمفضلة
window.addToFavorites = function(title, priceText) {
    let priceMatch = priceText.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
    let productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

    if (productPrice &gt; 0) {
        let existingProduct = favorites.find(item =&gt; item.title === title);
        if (!existingProduct) {
            // جلب الصورة من التدوينة عند إضافة للمفضلة
            let productImage = getFirstImage();
            favorites.push({
                title: title,
                price: productPrice,
                image: productImage // إضافة رابط الصورة
            });
            localStorage.setItem(&quot;favorites&quot;, JSON.stringify(favorites));
            favoritesCount++;
            document.getElementById(&#39;favorites-notification&#39;).innerText = favoritesCount; // تحديث عدد المفضلة
            alert(&quot;تمت إضافة المنتج إلى المفضلة!&quot;);
        } else {
            alert(&quot;هذا المنتج موجود بالفعل في المفضلة.&quot;);
        }
    } else {
        alert(&quot;خطأ في جلب السعر! تأكد من تنسيق البيانات.&quot;);
    }
}

// تأكد من استدعاء `addToFavorites` عند الضغط على زر &quot;أضف إلى المفضلة&quot;
document.querySelectorAll(&quot;.add-to-favorites&quot;).forEach(button =&gt; {
    button.addEventListener(&quot;click&quot;, function() {
        let productTitle = this.getAttribute(&quot;data-title&quot;);
        let productPriceText = this.getAttribute(&quot;data-price&quot;);
        addToFavorites(productTitle, productPriceText);
    });
});
     // عرض الأسعار المخفية
// اقتباس السعر والخصم من داخل التدوينة
document.querySelectorAll(&#39;.product&#39;).forEach(function(product) {
    let snippet = product.querySelector(&#39;.price&#39;) ? product.querySelector(&#39;.price&#39;).innerHTML : &quot;&quot;;

    let finalPriceMatch = snippet.match(/([0-9]+(?:\.[0-9]+)?)\s*جنيه/);
    let discountMatch = snippet.match(/الخصم:\s*([0-9]+(?:\.[0-9]+)?)\s*%/);
    
    if (finalPriceMatch) {
        let finalPrice = parseFloat(finalPriceMatch[1]); 
        let finalPriceElement = product.querySelector(&#39;.final-price&#39;);
        let originalPriceElement = product.querySelector(&#39;.price&#39;);
        
        // تحقق من وجود خصم
        if (discountMatch) {
            let discount = parseFloat(discountMatch[1]);
            let originalPrice = finalPrice / (1 - (discount / 100));

            // عرض السعر قبل الخصم
            originalPriceElement.innerHTML = originalPrice.toFixed(2) + &#39; جنيه&#39;;
            originalPriceElement.style.display = &#39;inline&#39;; 
            originalPriceElement.style.opacity = 1;
        } else {
            // إذا لم يكن هناك خصم&#1548; قم بإخفاء السعر الأصلي
            originalPriceElement.style.display = &#39;none&#39;;
        }

        // عرض السعر النهائي
        finalPriceElement.innerHTML = finalPrice.toFixed(2) + &#39; جنيه&#39;; 
        finalPriceElement.style.display = &#39;inline&#39;; 
        finalPriceElement.style.opacity = 1;
    }
});
    });

    function showCartContents() {
        let cartTooltip = document.getElementById(&#39;cart-tooltip&#39;);
        cartTooltip.innerHTML = &#39;&#39;; // تفريغ المحتوى السابق

        if (cart.length &gt; 0) {
            cart.forEach(item =&gt; {
                let itemElement = document.createElement(&#39;div&#39;);
                itemElement.innerHTML = `${item.title} - ${item.quantity} x ${item.price} جنيه - الإجمالي: ${item.totalPrice} جنيه`;
                cartTooltip.appendChild(itemElement);
            });
        } else {
            cartTooltip.innerHTML = &#39;سلة المشتريات فارغة.&#39;;
        }

        cartTooltip.style.display = &#39;block&#39;;
    }

    function showFavoritesContents() {
        let favoritesTooltip = document.getElementById(&#39;favorites-tooltip&#39;);
        favoritesTooltip.innerHTML = &#39;&#39;; // تفريغ المحتوى السابق

        if (favorites.length &gt; 0) {
            favorites.forEach(item =&gt; {
                let itemElement = document.createElement(&#39;div&#39;);
                itemElement.innerHTML = `${item.title} - <img alt='${item.title} image' src='${item.image}' style='width: 50px; height: auto;'/>`; // عرض عنوان المفضلة مع الصورة
                favoritesTooltip.appendChild(itemElement);  // إضافة العنصر إلى المفضلة
            });
        } else {
            favoritesTooltip.innerHTML = &#39;لا توجد منتجات في المفضلة.&#39;;
        }

        favoritesTooltip.style.display = &#39;block&#39;;
    }

    function hideCartContents() {
        var cartTooltip = document.getElementById(&#39;cart-tooltip&#39;);
        cartTooltip.style.display = &#39;none&#39;;
    }

    function hideFavoritesContents() {
        var favoritesTooltip = document.getElementById(&#39;favorites-tooltip&#39;);
        favoritesTooltip.style.display = &#39;none&#39;;
    }
