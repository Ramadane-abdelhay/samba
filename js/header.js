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


// ---slider---
    /*--------------------
    Vars
    --------------------*/
    let progress = 0; // This will be controlled by scroll
    let active = 0;
    let startX = 0; 
    let isDown = false; 

    /*--------------------
    Contants
    --------------------*/
    // (No constants)

    /*--------------------
    Get Z
    --------------------*/
    const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)));

    /*--------------------
    Items
    --------------------*/
    const $items = document.querySelectorAll('.carousel-item');
    const numItems = $items.length; 
    const $cursors = document.querySelectorAll('.cursor');
    const $container = document.querySelector('.sticky-scroll-container');
    const $prevBtn = document.getElementById('prev-btn');
    const $nextBtn = document.getElementById('next-btn');


    const displayItems = (item, index, active) => {
      const zIndex = getZindex([...$items], active)[index];
      item.style.setProperty('--zIndex', zIndex);
      item.style.setProperty('--active', (index - active) / $items.length);
      
      // NEW: Check if this item is the active one
      const isActive = index === active;
      
      // NEW: Apply opacity to the entire carousel-item to dim non-active ones
      item.style.opacity = isActive ? '1' : '0.4';
          
      // REMOVED: Old logic that targeted .carousel-box, which is no longer used
      // const oldCardBox = item.querySelector('.carousel-box');
      // if (oldCardBox) {
      //  oldCardBox.style.setProperty('--opacity', zIndex === $items.length ? 1 : 0.6);
      // }
    };

    /*--------------------
    Animate
    --------------------*/
    const animate = () => {
      progress = Math.max(0, Math.min(progress, 100)); // Clamp progress 0-100
      
      if (numItems > 0) {
        active = Math.floor(progress / 100 * (numItems - 1));
      } else {
        active = 0;
      }
      
      $items.forEach((item, index) => displayItems(item, index, active));
      
      if ($prevBtn && $nextBtn) {
        $prevBtn.disabled = active === 0;
        $nextBtn.disabled = active === numItems - 1;
      }
    };
    
    animate();

    /*--------------------
    Scroll To Item Function
    --------------------*/
    const scrollToItem = (index) => {
      if (numItems <= 1) return;
      
      const targetIndex = Math.max(0, Math.min(index, numItems - 1));
      let targetProgress = (targetIndex / (numItems - 1)) * 100;
      
      if ($container) {
        const containerHeight = $container.offsetHeight;
        const viewportHeight = window.innerHeight;
        const totalScrollableDistance = containerHeight - viewportHeight;
        const pauseDistance = viewportHeight * 1; 
        const animationDistance = totalScrollableDistance - pauseDistance;

        const newScrollY = $container.offsetTop + (targetProgress / 100) * animationDistance;

        window.scrollTo({ top: newScrollY, behavior: 'smooth' });
      }
    }

    /*--------------------
    Click on Items
    --------------------*/
    $items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        // Don't trigger scroll if clicking a link/button inside the card
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        scrollToItem(i);
      });
    });
    
    /*--------------------
    Button Click Listeners
    --------------------*/
    if ($prevBtn && $nextBtn) {
      $prevBtn.addEventListener('click', () => {
        scrollToItem(active - 1);
      });
      
      $nextBtn.addEventListener('click', () => {
        scrollToItem(active + 1);
      });
    }


    /*--------------------
    Handlers
    --------------------*/
    const handleMouseMove = (e) => {
      if (e.type === 'mousemove') {
        $cursors.forEach(($cursor) => {
          $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
      }
      
      if (!isDown) return;
      
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      
      if (e.type === 'touchmove') {
        e.preventDefault(); 
      }
      
      const scrollDelta = (x - startX) * -2.5; 
      window.scrollBy(0, scrollDelta);
      startX = x;
    };

    const handleMouseDown = e => {
      const targetElement = e.target.closest('button');
      if (targetElement && (targetElement.id === 'prev-btn' || targetElement.id === 'next-btn')) {
        return; 
      }
      
      if (e.type === 'touchstart') {
        if (e.target.closest('a')) { // Check for any link
          return; 
        }
        e.preventDefault(); 
      }
      isDown = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleScroll = () => {
      if (!$container) return; 

      const containerTop = $container.offsetTop;
      const containerHeight = $container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const totalScrollableDistance = containerHeight - viewportHeight;
      const pauseDistance = viewportHeight * 1; 
      const animationDistance = totalScrollableDistance - pauseDistance;

      let scrollAmount = window.scrollY - containerTop;
      scrollAmount = Math.max(0, Math.min(scrollAmount, totalScrollableDistance));

      if (animationDistance > 0) {
        let animationProgress = (scrollAmount / animationDistance) * 100;
        progress = Math.max(0, Math.min(animationProgress, 100)); 
      } else {
        progress = (window.scrollY > containerTop) ? 100 : 0;
      }
      
      animate();
    };


    /*--------------------
    Listeners
    --------------------*/
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchstart', handleMouseDown, { passive: false });
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    handleScroll();