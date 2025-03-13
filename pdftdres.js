document.addEventListener("DOMContentLoaded", function() {
    // البحث عن جميع العناصر التي تحتوي على نص غامق <b> داخل التدوينة
    const boldElements = document.querySelectorAll("b");

    // إضافة الحماية والعرض المميز بعد التحقق من الكود
    boldElements.forEach(function(element) {
        // إعداد الإطار والرموز التعبيرية المبدئية
        element.style.fontWeight = "bold";
        element.style.color = "#ff6600";  // تغيير اللون إلى برتقالي
        element.style.backgroundColor = "#fff3e6";  // إضافة خلفية خفيفة
        element.style.padding = "2px 5px";  // إضافة بعض الحشو لتحسين الشكل
        element.style.borderRadius = "5px";  // جعل الزوايا دائرية
        element.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";  // إضافة تأثير ظل خفيف
        element.innerHTML = "🔒 " + element.innerHTML + " 🔒";  // إضافة رمز القفل حول النص الغامق

        // إنشاء نافذة إدخال الكود
        let codeInput = document.createElement("input");
        codeInput.type = "text";
        codeInput.placeholder = "أدخل الكود لتفعيل المحتوى";
        codeInput.style.display = "block";
        codeInput.style.marginTop = "10px";
        codeInput.style.padding = "5px";
        codeInput.style.borderRadius = "5px";
        codeInput.style.border = "1px solid #ccc";
        codeInput.style.width = "100%";
        element.insertAdjacentElement('afterend', codeInput);

        let errorMessage = document.createElement("span");
        errorMessage.style.color = "red";
        errorMessage.style.display = "none";
        errorMessage.textContent = "❌ الكود غير صحيح!";
        element.insertAdjacentElement('afterend', errorMessage);

        let submitButton = document.createElement("button");
        submitButton.textContent = "تفعيل";
        submitButton.style.marginTop = "10px";
        submitButton.style.padding = "5px 10px";
        submitButton.style.backgroundColor = "#4CAF50";
        submitButton.style.color = "white";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "5px";
        submitButton.style.cursor = "pointer";
        element.insertAdjacentElement('afterend', submitButton);

        // الحدث عند الضغط على زر التفعيل
        submitButton.addEventListener("click", function() {
            let code = codeInput.value.trim();
            if (code === "") {
                errorMessage.textContent = "❌ يرجى إدخال الكود!";
                errorMessage.style.display = "block";
                return;
            }

            // إرسال الطلب لجلب الرابط من جوجل شيتس بناءً على الكود
            let postId = document.querySelector("meta[itemprop='postId']").content; // استخراج post_id الصحيح
            let url = "https://script.google.com/macros/s/AKfycbxxO1_Y99tfntPg0zhHAV0m6OUj_n7X9PcvpGiBTFImJSaBoVC4M3F7k_0x6_yRqCOppA/exec";
            let params = `?post_id=${postId}&code=${code}`;

            fetch(url + params)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "Success") {
                        let pdfLink = data.pdfLink; // الرابط الذي تم جلبه من العمود 12
                        
                        // إنشاء الـ iframe لعرض الـ PDF
                        let iframeContainer = document.createElement("div");
                        iframeContainer.classList.add("pdf-container");

                        // إضافة طبقة السواد على الزر
                        let overlay = document.createElement("div");
                        overlay.classList.add("block-overlay");
                        iframeContainer.appendChild(overlay);

                        // إضافة الـ iframe لعرض الـ PDF
                        let iframe = document.createElement("iframe");
                        iframe.src = pdfLink;
                        iframe.width = "100%";
                        iframe.height = "100%";  // التأكد من أن الإطار يأخذ الحجم بالكامل
                        iframe.style.border = "none";

                        iframeContainer.appendChild(iframe);

                        // إضافة الـ iframe إلى التدوينة
                        element.innerHTML = "";
                        element.appendChild(iframeContainer);

                        codeInput.style.display = "none";
                        submitButton.style.display = "none";
                        errorMessage.style.display = "none";
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = "block";
                    }
                })
                .catch(error => {
                    errorMessage.textContent = "❌ خطأ أثناء الاتصال بالسيرفر!";
                    errorMessage.style.display = "block";
                });
        });
    });
});