// ===== IMAGE OPTIMIZATION & PRELOADING =====
// This script optimizes image loading for better performance

(function () {
  "use strict";

  // Configuration
  const config = {
    // Critical images to preload immediately (hero section)
    criticalImages: ["images/hero image1.jpg", "images/Crop8Hub nav-logo.svg"],
    // Non-critical images to lazy load
    lazyLoadImages: [
      "images/hero image2.jpg",
      "images/hero image3.jpg",
      "images/categories BGimage.jpg",
      "images/needs bg-image.jpg",
      "images/about us image.jpg",
      "images/card-slide1.jpg",
      "images/card-slide2.jpg",
      "images/card-slide3.jpg",
      "images/card-slide4.jpg",
    ],
    // Placeholder color while loading
    placeholderColor: "rgba(102, 126, 6, 0.1)",
  };

  // 1. Create low-quality placeholder
  function createPlaceholder(element) {
    // Get computed background image (from CSS)
    const computedStyle = window.getComputedStyle(element);
    const originalBg = computedStyle.backgroundImage;
    
    // Only create placeholder if there's actually a background image
    if (originalBg && originalBg !== 'none') {
      element.style.backgroundColor = config.placeholderColor;
      element.setAttribute("data-bg", originalBg);
      element.style.backgroundImage = "none";
    }
  }

  // 2. Preload critical images
  function preloadCriticalImages() {
    const promises = config.criticalImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    });

    return Promise.all(promises);
  }

  // 3. Lazy load images with Intersection Observer
  function setupLazyLoading() {
    const lazyElements = document.querySelectorAll("[data-bg]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const bgImage = element.getAttribute("data-bg");

              if (bgImage && bgImage !== "none") {
                // Extract URL from background-image string
                const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch && urlMatch[1]) {
                  const imgUrl = urlMatch[1];

                  // Preload the image
                  const img = new Image();
                  img.onload = () => {
                    element.style.backgroundImage = bgImage;
                    element.classList.add("loaded");
                    element.removeAttribute("data-bg");
                  };
                  img.onerror = () => {
                    console.error(`Failed to load image: ${imgUrl}`);
                    element.style.backgroundImage = bgImage; // Try to load anyway
                  };
                  img.src = imgUrl;
                }
              }

              observer.unobserve(element);
            }
          });
        },
        {
          rootMargin: "50px", // Start loading 50px before element enters viewport
          threshold: 0.01,
        }
      );

      lazyElements.forEach((el) => imageObserver.observe(el));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyElements.forEach((element) => {
        const bgImage = element.getAttribute("data-bg");
        if (bgImage) {
          element.style.backgroundImage = bgImage;
          element.removeAttribute("data-bg");
        }
      });
    }
  }

  // 4. Compress and optimize loaded images (visual feedback)
  function addLoadingTransition() {
    const style = document.createElement("style");
    style.textContent = `
      [data-bg] {
        transition: background-image 0.3s ease-in-out;
      }
      [data-bg].loaded {
        animation: fadeIn 0.5s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0.7; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // 5. Setup lazy loading for specific sections
  function setupSectionLazyLoad() {
    // Wait for DOM to be fully ready
    setTimeout(() => {
      // DON'T lazy load hero slides - they should all load normally
      // The CSS will handle them fine
      
      // DON'T lazy load category section - it's important and visible
      
      // Only lazy load carousel section background (it's further down)
      const carouselSection = document.querySelector(".slide-section");
      if (carouselSection) {
        createPlaceholder(carouselSection);
      }

      // About section image - native lazy loading
      const aboutImages = document.querySelectorAll(".about-content img, .flip-card img");
      aboutImages.forEach((img) => {
        if (!img.loading) {
          img.loading = "lazy";
        }
      });

      // Carousel card images - native lazy loading
      const cardImages = document.querySelectorAll(".slide-card img");
      cardImages.forEach((img) => {
        if (!img.loading) {
          img.loading = "lazy";
        }
      });
    }, 100);
  }

  // 6. Initialize optimization
  function init() {
    // Add loading transitions
    addLoadingTransition();

    // Setup lazy loading for sections (only carousel section now)
    setupSectionLazyLoad();

    // Preload critical images first
    preloadCriticalImages()
      .then(() => {
        console.log("Critical images preloaded");

        // Then setup lazy loading for other images (carousel background)
        setTimeout(() => {
          setupLazyLoading();
        }, 100);
      })
      .catch((err) => {
        console.error("Error preloading critical images:", err);
        // Continue with lazy loading anyway
        setupLazyLoading();
      });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
