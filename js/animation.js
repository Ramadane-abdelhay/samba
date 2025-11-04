// Wait for the document to be fully loaded before running scripts
        document.addEventListener('DOMContentLoaded', (event) => {
            
            // Register the GSAP plugins
            gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
            
            // Create the surfer animation
            gsap.to("#surfer", {
                // Animate along the SVG path
                motionPath: {
                    path: "#wave-path", // The ID of the path to follow
                    align: "#wave-path", // Align the surfer to the path
                    alignOrigin: [0.5, 0.7], // Center the surfer on the path
                    autoRotate: true, // Rotate the surfer to match the path's direction
                },
                // Link the animation to the scrollbar
                scrollTrigger: {
                    trigger: "#animation-container", // The element that triggers the animation
                    start: "top top", // When the top of the trigger hits the top of the viewport
                    end: "bottom bottom", // When the bottom of the trigger hits the bottom of the viewport
                    scrub: 1, // Smoothly links animation progress to scroll (1 second "catch-up")
                    // markers: true, // Uncomment this for debugging. Shows start/end markers.
                },
                ease: "none" // Linear ease for direct scroll correlation
            });

            // --- NEW: Transparent Header Logic ---
            const header = document.getElementById('main-header');
            const logo = document.getElementById('logo');
            const navLinks = document.querySelectorAll('#nav-links a');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // Scrolled State (compact but still has some padding)
        header.classList.add('bg-[#f0f5d6]/80', 'backdrop-blur-md', 'shadow-lg');
        header.style.paddingTop = "15px"; // smaller padding
        header.style.paddingBottom = "15px";
        logo.classList.remove('text-white');
        logo.classList.add('text-[#c15402]');
        mobileMenuBtn.classList.remove('text-white');
        mobileMenuBtn.classList.add('text-gray-800');
        navLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-white/80');
            link.classList.add('text-gray-700', 'hover:text-[#c15402]');
        });
    } else {
        // Top State (tall)
        header.classList.remove('bg-[#f0f5d6]/80', 'backdrop-blur-md', 'shadow-lg');
        header.style.paddingTop = "30px"; // restore top padding
        header.style.paddingBottom = "30px"; // restore bottom padding
        logo.classList.add('text-white');
        logo.classList.remove('text-[#c15402]');
        mobileMenuBtn.classList.add('text-white');
        mobileMenuBtn.classList.remove('text-gray-800');
        navLinks.forEach(link => {
            link.classList.add('text-white', 'hover:text-white/80');
            link.classList.remove('text-gray-700', 'hover:text-[#c15402]');
        });
    }
});


            // --- End of New Logic ---

        });



document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const path = document.querySelector("#wave-path");
  const surfer = document.querySelector("#surfer");
  const pathLength = path.getTotalLength();

  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  // 🌀 Wave line animation
  gsap.to(path, {
    strokeDashoffset: 0,
    scrollTrigger: {
      trigger: "#animation-container",
      start: "bottom 80%",  // start earlier
      end: "center 30%",    // end earlier
      scrub: 1
    }
  });

  // 🏄 Surfer motion (delayed 5%)
  gsap.to(surfer, {
    motionPath: {
      path: "#wave-path",
      align: "#wave-path",
      alignOrigin: [0.5, 0.7],
      autoRotate: true
    },
    scrollTrigger: {
      trigger: "#animation-container",
      start: "bottom 75%",  // 5% later start
      end: "center 28%",    // ends slightly after
      scrub: 1
    }
  });
});
