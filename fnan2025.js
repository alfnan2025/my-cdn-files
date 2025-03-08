document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.getElementById("mobile-menu");
    var navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", function() {
            navLinks.classList.toggle("active");
        });
    } else {
        console.error("❌ عنصر #mobile-menu أو .nav-links غير موجود!");
    }
});
