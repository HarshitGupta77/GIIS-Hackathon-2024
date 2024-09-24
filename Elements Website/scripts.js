// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const href = this.getAttribute('href');
        
        // Check if the href is an internal anchor or an external URL
        if (href.startsWith('#')) {
            // Internal anchor link
            const targetElement = document.querySelector(href);
            
            // Check if the target element exists
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.warn('Target element not found for href:', href);
            }
        } else {
            // External link (e.g., suggestions.html), just redirect
            window.location.href = href;
        }
    });
});
