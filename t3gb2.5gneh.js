function fetchProductsFromBlogger(maxResults, category) {
    let blogUrl = window.location.origin; // الحصول على رابط المدونة تلقائيًا
    let currentPageUrl = window.location.href.split("?")[0];

    let categoryFeedUrl = `${blogUrl}/feeds/posts/default/-/${encodeURIComponent(category)}?alt=json&max-results=${maxResults}`;
    
    fetch(categoryFeedUrl)
        .then(response => response.json())
        .then(data => {
            let posts = data.feed.entry || [];
            let output = '';
            let count = 0;

            posts.forEach(post => {
                let title = post.title.$t;
                let link = post.link.find(l => l.rel === "alternate").href;
                let cleanLink = link.split("?")[0];

                // تجاهل المقالة الحالية
                if (cleanLink === currentPageUrl) {
                    return; 
                }

                let image = "https://via.placeholder.com/300"; 
                let price = "السعر: غير متوفر";
                let comingSoon = ""; 

                try {
                    let tempDiv = document.createElement("div");
                    tempDiv.innerHTML = post.content.$t;
                    let imgTag = tempDiv.querySelector("img");
                    if (imgTag) {
                        image = imgTag.src;
                    }

                    // تعديل التعبير العادي لاستخراج السعر من النص
                    let priceMatch = tempDiv.innerHTML.match(/السعر\s*:\s*(\d+(?:\.\d+)?)\s*جنيه/);
                    if (priceMatch) {
                        price = `السعر: ${priceMatch[1]} جنيه`;
                    }
                    
                    if (tempDiv.innerHTML.includes("غير متوفر")) {
                        comingSoon = "<div class='coming-soon'>غير متوفر</div>";
                    }
                } catch (e) {
                    console.error("خطأ في استخراج البيانات:", e);
                }

                output += `
                    <div class="product-card">
                        <a href="${link}" target="_blank">
                            <img src="${image}" alt="${title}" loading="lazy">
                            ${comingSoon}
                            <h3>${title}</h3>
                        </a>
                        <p>${price}</p>
                    </div>
                `;

                count++;
                if (count >= maxResults) {
                    return; 
                }
            });

            document.getElementById("product-grid").innerHTML = output;
        })
        .catch(error => console.error("خطأ في جلب المنتجات:", error));
}

// تحديد التصنيف المطلوب
let category = "منتجات قد تعجبك"; 

// بدء تحميل المنتجات
fetchProductsFromBlogger(6, category);