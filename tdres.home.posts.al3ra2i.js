document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
    // احصل على كل أزرار التحقق داخل الصفحة
    const verifyButtons = document.querySelectorAll(&quot;.verify-code-btn&quot;);

    // أضف حدث لكل زر تحقق بشكل منفصل
    verifyButtons.forEach(button =&gt; {
        button.addEventListener(&quot;click&quot;, function () {
            const modal = this.closest(&quot;.payment-modal&quot;); // البحث عن العنصر الأب القريب لكل زر
            const inputField = modal.querySelector(&quot;.payment-code&quot;); // البحث عن حقل الإدخال داخل نفس المودال
            const errorMessage = modal.querySelector(&quot;.error-message&quot;); // البحث عن رسالة الخطأ داخل نفس المودال

            errorMessage.style.display = &quot;none&quot;; // إخفاء أي رسالة خطأ سابقة
            errorMessage.textContent = &quot;&quot;; // تفريغ محتوى الرسالة

            const code = inputField.value.trim();
            const postId = this.getAttribute(&quot;data-post-id&quot;); // الحصول على الـ post_id لكل تدوينة

            if (!code) {
                errorMessage.textContent = &quot;&#10060; يرجى إدخال الكود.&quot;;
                errorMessage.style.display = &quot;block&quot;;
                return;
            }

            const url = &quot;https://script.google.com/macros/s/AKfycbx9GOXcqxTBzsk5X-ddg3Co3kJMYB-NzMu6N-mDhK0Kut_7hhcGBh53hAUmAqlTNt9Ocw/exec?post_id=&quot; + postId + &quot;&amp;code=&quot; + encodeURIComponent(code);


            fetch(url)
                .then(response =&gt; response.json())
                .then(data =&gt; {
                    if (data.status === &quot;Success&quot;) {
                        errorMessage.style.display = &quot;none&quot;; // &#9989; إخفاء الرسالة عند النجاح
                        errorMessage.textContent = &quot;&quot;; // &#9989; تفريغ النص لمنع ظهوره بعد التوجيه
                        window.location.href = data.url; // &#9989; التوجيه إلى الرابط الصحيح
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.display = &quot;block&quot;;
                    }
                })
                .catch(error =&gt; {
                    errorMessage.textContent = &quot;&#9888;&#65039; حدث خطأ أثناء التحقق&#1548; يرجى المحاولة لاحق&#1611;ا.&quot;;
                    errorMessage.style.display = &quot;block&quot;;
                    console.error(&quot;&#10060; خطأ:&quot;, error);
                });
        });
    });
});