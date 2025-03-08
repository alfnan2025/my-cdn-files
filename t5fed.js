    const wrapper = document.getElementById("scrollable-wrapper");
    const categoryName = "تجربة"; // ضع اسم التصنيف المطلوب
    const maxResults = 15;

    // إعدادات العد التنازلي
    let endDate;

    // تحقق مما إذا كان تاريخ انتهاء العد التنازلي موجودًا في localStorage
    const storedEndDate = localStorage.getItem('endDate');
    if (storedEndDate) {
        endDate = new Date(storedEndDate);
    } else {
        endDate = new Date();
        const daysUntilEnd = 3; // عدد الأيام المتبقية
        endDate.setDate(endDate.getDate() + daysUntilEnd);
        // تخزين تاريخ الانتهاء في localStorage
        localStorage.setItem('endDate', endDate);
    }

    function updateCountdown() {
        const now = new Date();
        const distance = endDate - now;

        // حساب الأيام والأوقات المتبقية
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownElement = document.getElementById("countdown");
        if (distance < 0) {
            countdownElement.innerHTML = "انتهت التخفيضات";
        } else {
            countdownElement.innerHTML = `تنتهي التخفيضات بعد ${days} أيام و ${hours} ساعات و ${minutes} دقائق و ${seconds} ثواني`;
        }
    }

    setInterval(updateCountdown, 1000); // تحديث العد التنازلي كل ثانية

    async function fetchProducts() {
        try {
            const blogUrl = window.location.origin; // استخدام الرابط الحالي للمدونة
            const response = await fetch(`${blogUrl}/feeds/posts/default/-/${categoryName}?alt=json&max-results=${maxResults}`);
            const data = await response.json();
            const posts = data.feed.entry || [];

            if (posts.length === 0) {
                console.warn("لم يتم العثور على تدوينات في هذا التصنيف.");
                return;
            }

            wrapper.innerHTML = "";

            posts.forEach(post => {
                const title = post.title.$t;
                const content = post.content.$t;
                const link = post.link.find(l => l.rel === "alternate").href;
                
                // استخراج السعر والخصم
                const priceMatch = content.match(/السعر:\s*(\d+)\s*جنيه/);
                let discountedPrice = priceMatch ? parseInt(priceMatch[1]) : null;
                const discountMatch = content.match(/الخصم:\s*(\d+)%/);
                let discount = discountMatch ? parseInt(discountMatch[1]) : null;
                let originalPrice = discountedPrice;
                if (discountedPrice !== null && discount !== null) {
                    originalPrice = Math.round(discountedPrice / (1 - (discount / 100)));
                }
                
                // استخراج الصورة
                let imageUrl = "https://via.placeholder.com/200x150?text=No+Image";
                if (post.media$thumbnail) {
                    imageUrl = post.media$thumbnail.url.replace(/s72-c/, "s400");
                } else {
                    const imgMatch = content.match(/<img.*?src=["'](.*?)["']/);
                    if (imgMatch) imageUrl = imgMatch[1];
                }

                // التحقق مما إذا كان المنتج غير متوفر
                const outOfStock = content.includes("غير متوفر") ? `<div class="out-of-stock">غير متوفر 😢</div>` : "";

                // إنشاء العنصر
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                    <a href="${link}">
                        <div class="image-container">
                            <img src="${imageUrl}" alt="${title}">
                            ${outOfStock}
                        </div>
                        <div class="product-info">
                            <h3>${title}</h3>
                        </div>
                    </a>
                    <div class="price-box">
                        ${discount !== null ? `<span class="original-price">${originalPrice} جنيه</span> <span class="discount-badge">-${discount}%</span>` : ""} 
                        <br>${discountedPrice} جنيه
                    </div>
                `;
                wrapper.appendChild(productCard);
            });
        } catch (error) {
            console.error("خطأ أثناء جلب المنتجات:", error);
        }
    }

    document.addEventListener("DOMContentLoaded", function() {
        fetchProducts();
        updateCountdown(); // تحديث العد التنازلي عند تحميل الصفحة
    });
