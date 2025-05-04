document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
    document.querySelectorAll(&quot;.course-card&quot;).forEach(function (card) {
        let postContent = card.querySelector(&quot;.post-content&quot;).innerHTML;  // استخدم innerHTML لالتقاط المحتوى الكامل بما في ذلك الأكواد المخفية

        // البحث عن كلمة &quot;مجاني&quot;
        let isFree = postContent.includes(&quot;مجاني&quot;);

        // البحث عن السعر باستخدام Regex
        let priceMatch = postContent.match(/السعر:\s*(\d+)/);

        // البحث عن الخصم باستخدام Regex
        let discountMatch = postContent.match(/الخصم:\s*(\d+)%/);

        let priceElement = card.querySelector(&quot;.course-price&quot;);
        let oldPriceElement = card.querySelector(&quot;.course-old-price&quot;);
        let freeElement = card.querySelector(&quot;.course-free&quot;);

        if (isFree) {
            // إذا كان الكورس مجاني إخفاء السعر والخصم وعرض &quot;مجاني&quot;
            freeElement.style.display = &quot;block&quot;;
            priceElement.style.display = &quot;none&quot;;
            oldPriceElement.style.display = &quot;none&quot;;
        } else if (priceMatch) {
            let price = parseInt(priceMatch[1]);
            let finalPrice = price;
            let oldPrice = null;

            if (discountMatch) {
                let discount = parseInt(discountMatch[1]);
                oldPrice = Math.round(price / (1 - discount / 100)); // حساب السعر قبل الخصم
            }

            if (oldPrice) {
                oldPriceElement.innerText = &quot;💲 السعر قبل الخصم: &quot; + oldPrice + &quot; جنيه&quot;;
                oldPriceElement.style.display = &quot;block&quot;;
            } else {
                oldPriceElement.style.display = &quot;none&quot;;
            }

            priceElement.innerText = &quot;💰 السعر: &quot; + finalPrice + &quot; جنيه&quot;;
            priceElement.style.display = &quot;block&quot;;
            freeElement.style.display = &quot;none&quot;;  // تأكد من إخفاء كلمة &quot;مجاني&quot;
        }
    });
});