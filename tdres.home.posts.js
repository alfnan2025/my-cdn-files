document.addEventListener("DOMContentLoaded", function () {
    if (window.location.href.includes("?q=")) { 
        var categorySidebar = document.querySelector(".category-sidebar");
        
        if (categorySidebar) {
            categorySidebar.style.display = "none";
        }
    }
});