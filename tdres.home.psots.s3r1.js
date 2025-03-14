document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".course-card").forEach(function (card) {
        let postContent = card.querySelector(".post-content").innerHTML;  

        // البحث عن كلمة "مجاني"
        let isFree = postContent.includes("مجاني");

        // البحث عن السعر باستخدام Regex
        let priceMatch = postContent.match(/السعر:\s*(\d+)/);

        // البحث عن الخصم باستخدام Regex
        let discountMatch = postContent.match(/الخصم:\s*(\d+)%/);

        let priceElement = card.querySelector(".course-price");
        let oldPriceElement = card.querySelector(".course-old-price");
        let freeElement = card.querySelector(".course-free");

        if (isFree) {
            // إذا كان الكورس مجاني، إخفاء السعر والخصم وعرض "مجاني"
            freeElement.style.display = "block";
            priceElement.style.display = "none";
            oldPriceElement.style.display = "none";
        } else if (priceMatch) {
            let price = parseInt(priceMatch[1]);
            let finalPrice = price;
            let oldPrice = null;

            if (discountMatch) {
                let discount = parseInt(discountMatch[1]);
                oldPrice = Math.round(price / (1 - discount / 100)); // حساب السعر قبل الخصم
            }

            if (oldPrice) {
                oldPriceElement.innerText = `💲 السعر قبل الخصم: ${oldPrice} جنيه`;
                oldPriceElement.style.display = "block";
            } else {
                oldPriceElement.style.display = "none";
            }

            priceElement.innerText = `💰 السعر: ${finalPrice} جنيه`;
            priceElement.style.display = "block";
            freeElement.style.display = "none"; // تأكد من إخفاء كلمة "مجاني"
        }
    });
});