  const form = document.getElementById('consultationForm');
  const responseMessage = document.getElementById('responseMessage');

  // رابط Google Apps Script
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwaAA0D8Bx0DkwXUudRW7hE3dR4z0vDoyHPMdxlrXmwYKncpHczYP3AutFyGe6zobXyBA/exec";

  form.addEventListener('submit', function(event) {
    event.preventDefault(); // منع الإرسال الافتراضي للنموذج

    responseMessage.textContent = 'جاري إرسال الطلب...';
    responseMessage.style.color = 'blue';

    const formData = new FormData(form);

    // استخدام رابط Google Apps Script في عملية الإرسال
    fetch(scriptUrl, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.result === 'success') {
        responseMessage.textContent = 'تم إرسال طلب الحجز بنجاح. سيتم التواصل معك قريبا.';
        responseMessage.style.color = 'green';
        form.reset();
      } else {
        responseMessage.textContent = 'حدث خطأ أثناء إرسال طلب الحجز: ' + (data.message || 'خطأ غير معروف');
        responseMessage.style.color = 'red';
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      responseMessage.textContent = 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.';
      responseMessage.style.color = 'red';
    });
  });
