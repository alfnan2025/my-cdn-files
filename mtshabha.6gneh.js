function fetchProductsFromBlogger(maxResults) {
    let blogUrl = window.location.origin; 
    let currentPageUrl = window.location.href.split("?")[0];

    fetch(`${blogUrl}/feeds/posts/default?alt=json&max-results=10`)
        .then(response => response.json())
        .then(data => {
            let entries = data.feed.entry || [];
            let currentPost = entries.find(post => {
                let linkObj = post.link.find(l => l.rel === "alternate");
                return linkObj && linkObj.href.split("?")[0] === currentPageUrl;
            });

            if (!currentPost) {
                console.error("لم يتم العثور على التدوينة الحالية.");
                return Promise.reject("التدوينة غير موجودة");
            }

            let categories = currentPost.category ? currentPost.category.map(cat => cat.term) : [];
            let category = categories.length > 0 ? categories[0] : '';

            if (!category) {
                console.error("التدوينة الحالية ليس لها فئة.");
                return Promise.reject("لا توجد فئة");
            }

            let categoryFeedUrl = `${blogUrl}/feeds/posts/default/-/${encodeURIComponent(category)}?alt=json&max-results=${maxResults}`;
            return fetch(categoryFeedUrl);
        })
        .then(response => response.json())
        .then(data => {
            let posts = data.feed.entry || [];
            let output = '';
            let count = 0;

            posts.forEach(post => {
                let title = post.title.$t;
                let linkObj = post.link.find(l => l.rel === "alternate");
                let link = linkObj ? linkObj.href.split("?")[0] : "#";

                if (link === currentPageUrl) return;

                let image = "https://via.placeholder.com/300"; 
                let price = "السعر: غير متوفر";
                let comingSoon = ""; 

                try {
                    let tempDiv = document.createElement("div");
                    tempDiv.innerHTML = post.content.$t;

                    let imgTag = tempDiv.querySelector("img");
                    if (imgTag) image = imgTag.src;

                    let priceMatch = tempDiv.innerHTML.match(/السعر\s*:\s*(\d+(?:\.\d+)?)\s*جنيه/);
                    if (priceMatch) price = `السعر: ${priceMatch[1]} جنيه`;

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
                if (count >= maxResults) return;
            });

            document.getElementById("product-grid").innerHTML = output;
        })
        .catch(error => console.error("خطأ في جلب المنتجات:", error));
}

// بدء تحميل المنتجات
fetchProductsFromBlogger(6);