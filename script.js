// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Our Approach Tabs
    const tabItems = document.querySelectorAll('.approach-item');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected tab content
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Update active state of tab items
        tabItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });
    }

    // Add click event listeners to tab items
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize first tab as active
    if (tabItems.length > 0) {
        const firstTabId = tabItems[0].getAttribute('data-tab');
        switchTab(firstTabId);
    }
});
