        document.addEventListener('DOMContentLoaded', () => {

            // --- HEADER SCROLL LOGIC ---
            const headerTop = document.getElementById('header-top');
            const headerSticky = document.getElementById('header-sticky');
            const scrollThreshold = 50; // Pixels to scroll before changing

            // Function to handle header state
            const handleHeaderScroll = () => {
                if (window.scrollY > scrollThreshold) {
                    // --- APPLY SCROLLED STATE ---
                    // Fade out top header
                    headerTop.classList.add('opacity-0', 'invisible');
                    
                    // Slide in sticky header
                    headerSticky.classList.remove('-translate-y-full', 'invisible');
                    headerSticky.classList.add('translate-y-0');

                } else {
                    // --- APPLY TOP (TRANSPARENT) STATE ---
                    // Fade in top header
                    headerTop.classList.remove('opacity-0', 'invisible');
                    
                    // Slide out sticky header
                    headerSticky.classList.add('-translate-y-full', 'invisible');
                    headerSticky.classList.remove('translate-y-0');
                }
            };

            // Listen for scroll events
            window.addEventListener('scroll', handleHeaderScroll);
            
            // Run once on load in case the page is reloaded mid-scroll
            handleHeaderScroll();


            // --- MOBILE MENU TOGGLE LOGIC ---
            const menuToggleButtons = document.querySelectorAll('.mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIconOpen = document.querySelectorAll('.menu-icon-open');
            const menuIconClose = document.querySelectorAll('.menu-icon-close');

            const toggleMenu = () => {
                // Toggle visibility of the menu
                mobileMenu.classList.toggle('opacity-0');
                mobileMenu.classList.toggle('invisible');
                
                // Toggle icons on ALL buttons
                menuIconOpen.forEach(icon => icon.classList.toggle('hidden'));
                menuIconClose.forEach(icon => icon.classList.toggle('hidden'));
            };

            // Add click listener to all toggle buttons (This now includes the new 'X' button)
            menuToggleButtons.forEach(button => {
                button.addEventListener('click', toggleMenu);
            });
            
            // Close mobile menu when a link is clicked
            mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
                link.addEventListener('click', () => {
                    // Only close if the menu is open
                    if (!mobileMenu.classList.contains('invisible')) {
                        toggleMenu();
                    }
                });
            });

            // --- MOBILE DROPDOWN LOGIC ---
            const dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
            
            dropdownToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const content = toggle.nextElementSibling;
                    const icon = toggle.querySelector('svg');
                    
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                });
            });
        });