document.addEventListener("DOMContentLoaded", () => {
  /* ===========================
     HEADER SCROLL LOGIC
  ============================ */
  const headerTop = document.getElementById("header-top");
  const headerSticky = document.getElementById("header-sticky");
  const scrollThreshold = 50;

  const handleHeaderScroll = () => {
    if (window.scrollY > scrollThreshold) {
      headerTop.classList.add("opacity-0", "invisible");
      headerSticky.classList.remove("-translate-y-full", "invisible");
      headerSticky.classList.add("translate-y-0");
    } else {
      headerTop.classList.remove("opacity-0", "invisible");
      headerSticky.classList.add("-translate-y-full", "invisible");
      headerSticky.classList.remove("translate-y-0");
    }
  };

  /* ===========================
     MOBILE MENU LOGIC
  ============================ */
  const menuToggleButtons = document.querySelectorAll(".mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIconOpen = document.querySelectorAll(".menu-icon-open");
  const menuIconClose = document.querySelectorAll(".menu-icon-close");

  const toggleMenu = () => {
    mobileMenu.classList.toggle("opacity-0");
    mobileMenu.classList.toggle("invisible");
    menuIconOpen.forEach((icon) => icon.classList.toggle("hidden"));
    menuIconClose.forEach((icon) => icon.classList.toggle("hidden"));
  };

  menuToggleButtons.forEach((button) =>
    button.addEventListener("click", toggleMenu)
  );

  mobileMenu.querySelectorAll(".mobile-menu-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMenu.classList.contains("invisible")) toggleMenu();
    });
  });

  // --- MOBILE DROPDOWNS ---
  const dropdownToggles = document.querySelectorAll(".mobile-dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector("svg");
      content.classList.toggle("hidden");
      icon.classList.toggle("rotate-180");
    });
  });

  /* ===========================
     SLIDER LOGIC
  ============================ */
  const $items = document.querySelectorAll(".carousel-item");
  const numItems = $items.length;
  const $container = document.querySelector(".sticky-scroll-container");
  const $prevBtn = document.getElementById("prev-btn");
  const $nextBtn = document.getElementById("next-btn");

  let progress = 0;
  let active = 0;

  const getZindex = (array, index) =>
    array.map((_, i) =>
      index === i ? array.length : array.length - Math.abs(index - i)
    );

  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - active) / $items.length);
    item.style.opacity = index === active ? "1" : "0.4";
  };

  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = numItems > 0 ? Math.floor((progress / 100) * (numItems - 1)) : 0;
    $items.forEach((item, index) => displayItems(item, index, active));
    if ($prevBtn && $nextBtn) {
      $prevBtn.disabled = active === 0;
      $nextBtn.disabled = active === numItems - 1;
    }
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

    progress =
      animationDistance > 0
        ? (scrollAmount / animationDistance) * 100
        : window.scrollY > containerTop
        ? 100
        : 0;

    animate();
  };

  const scrollToItem = (index) => {
    if (numItems <= 1) return;
    const targetIndex = Math.max(0, Math.min(index, numItems - 1));
    const targetProgress = (targetIndex / (numItems - 1)) * 100;

    if ($container) {
      const containerHeight = $container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollableDistance = containerHeight - viewportHeight;
      const pauseDistance = viewportHeight * 1;
      const animationDistance = totalScrollableDistance - pauseDistance;

      const newScrollY =
        $container.offsetTop + (targetProgress / 100) * animationDistance;

      window.scrollTo({ top: newScrollY, behavior: "smooth" });
    }
  };

  $items.forEach((item, i) => {
    item.addEventListener("click", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) return;
      scrollToItem(i);
    });
  });

  if ($prevBtn && $nextBtn) {
    $prevBtn.addEventListener("click", () => scrollToItem(active - 1));
    $nextBtn.addEventListener("click", () => scrollToItem(active + 1));
  }

  /* ===========================
     GSAP SCROLL ANIMATIONS
  ============================ */
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    gsap.to("#surfer", {
      motionPath: {
        path: "#wave-path",
        align: "#wave-path",
        alignOrigin: [0.5, 0.7],
        autoRotate: true,
      },
      scrollTrigger: {
        trigger: "#animation-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      ease: "none",
    });

    const path = document.querySelector("#wave-path");
    const surfer = document.querySelector("#surfer");
    if (path && surfer) {
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;

      gsap.to(path, {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: "#animation-container",
          start: "bottom 80%",
          end: "center 30%",
          scrub: 1,
        },
      });

      gsap.to(surfer, {
        motionPath: {
          path: "#wave-path",
          align: "#wave-path",
          alignOrigin: [0.5, 0.7],
          autoRotate: true,
        },
        scrollTrigger: {
          trigger: "#animation-container",
          start: "bottom 75%",
          end: "center 28%",
          scrub: 1,
        },
      });
    }
  }

  /* ===========================
     HEADER COLOR CHANGE (Transparent Header)
  ============================ */
  const header = document.getElementById("main-header");
  const logo = document.getElementById("logo");
  const navLinks = document.querySelectorAll("#nav-links a");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  const handleTransparentHeader = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add(
        "bg-[#f0f5d6]/80",
        "backdrop-blur-md",
        "shadow-lg"
      );
      header.style.paddingTop = "15px";
      header.style.paddingBottom = "15px";
      logo?.classList.replace("text-white", "text-[#c15402]");
      mobileMenuBtn?.classList.replace("text-white", "text-gray-800");
      navLinks.forEach((link) => {
        link.classList.remove("text-white", "hover:text-white/80");
        link.classList.add("text-gray-700", "hover:text-[#c15402]");
      });
    } else {
      header.classList.remove(
        "bg-[#f0f5d6]/80",
        "backdrop-blur-md",
        "shadow-lg"
      );
      header.style.paddingTop = "30px";
      header.style.paddingBottom = "30px";
      logo?.classList.replace("text-[#c15402]", "text-white");
      mobileMenuBtn?.classList.replace("text-gray-800", "text-white");
      navLinks.forEach((link) => {
        link.classList.add("text-white", "hover:text-white/80");
        link.classList.remove("text-gray-700", "hover:text-[#c15402]");
      });
    }
  };

  /* ===========================
     SCROLL PERFORMANCE COMBINED
  ============================ */
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleHeaderScroll();
          handleScroll();
          handleTransparentHeader();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initial state
  handleHeaderScroll();
  handleTransparentHeader();
  handleScroll();
});


/* ACTIVITIES CAROUSEL */

const track = document.getElementById('track');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Configuration
        const CLONE_COUNT = 3; // How many items to clone at each end (max visible items)
        const AUTO_PLAY_DELAY = 2000;
        
        // State
        let currentIndex = CLONE_COUNT; // Start at the first real item (after start clones)
        let autoPlayInterval;
        let isTransitioning = false;

        // 1. Initial Setup: Clone Items
        // We clone the first few to the end, and last few to the start.
        const originalItems = Array.from(track.children);
        
        // Create clones
        const startClones = originalItems.slice(-CLONE_COUNT).map(item => item.cloneNode(true));
        const endClones = originalItems.slice(0, CLONE_COUNT).map(item => item.cloneNode(true));

        // Inject clones into DOM
        startClones.forEach(clone => track.insertBefore(clone, track.firstChild));
        endClones.forEach(clone => track.appendChild(clone));

        // Get updated list of all items (clones + real)
        const allItems = Array.from(track.children);
        const totalSlides = allItems.length;

        // 2. Logic to calculate width and position
        function getSlidesToShow() {
            if (window.innerWidth >= 1024) return 3; // lg
            if (window.innerWidth >= 768) return 2;  // md
            return 1;                                // mobile
        }

        function updateCarousel(enableTransition = true) {
            const slidesToShow = getSlidesToShow();
            const itemWidth = 100 / slidesToShow;
            
            // Toggle transition
            if (enableTransition) {
                track.style.transition = 'transform 0.5s ease-out';
            } else {
                track.style.transition = 'none';
            }

            const translateX = -(currentIndex * itemWidth);
            track.style.transform = `translateX(${translateX}%)`;
        }

        // 3. Movement Logic
        function nextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updateCarousel(true);
        }

        function prevSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updateCarousel(true);
        }

        // 4. Infinite Loop "Jump" Logic (The Magic Part)
        track.addEventListener('transitionend', () => {
            isTransitioning = false;
            
            const realItemCount = originalItems.length; // 6
            
            // Case A: We scrolled past the last real item into the "End Clones"
            // The first end clone is at index: CLONE_COUNT + realItemCount
            if (currentIndex >= CLONE_COUNT + realItemCount) {
                // Snap back to the first real item (index 3)
                // Calculate the offset into the clones to maintain smooth scrolling if user clicked fast
                const offset = currentIndex - (CLONE_COUNT + realItemCount);
                currentIndex = CLONE_COUNT + offset; 
                updateCarousel(false); // Disable animation for the snap
            }

            // Case B: We scrolled backwards past the first real item into "Start Clones"
            // The last start clone is at index: CLONE_COUNT - 1
            if (currentIndex < CLONE_COUNT) {
                // Snap to the last real item
                const offset = CLONE_COUNT - currentIndex;
                currentIndex = (CLONE_COUNT + realItemCount) - offset;
                updateCarousel(false);
            }
        });

        // 5. Auto Play
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                nextSlide();
            }, AUTO_PLAY_DELAY);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // 6. Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Reset timer
        });

        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        
        window.addEventListener('resize', () => {
            // Recalculate layout without animating
            updateCarousel(false);
        });

        // Initialize
        updateCarousel(false); // Initial positioning without animation
        startAutoPlay();


/* WHATSSAP BUTTON */

document.querySelector('.wa__btn_popup').addEventListener('click', function() {
            const chatBox = document.querySelector('.wa__popup_chat_box');
            const btn = this;
            
            if (chatBox.classList.contains('wa__active')) {
                // Close Animation
                chatBox.classList.remove('wa__active');
                btn.classList.remove('wa__active');
                
                // Reset pending states after animation
                setTimeout(() => {
                    chatBox.classList.remove('wa__pending');
                    chatBox.classList.remove('wa__lauch');
                }, 400);
            } else {
                // Open Animation
                chatBox.classList.add('wa__pending');
                chatBox.classList.add('wa__active');
                btn.classList.add('wa__active');
                
                // Launch inner items slightly after box opens
                setTimeout(() => {
                    chatBox.classList.add('wa__lauch');
                }, 100);
            }
        });