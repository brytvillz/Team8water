// Card Carousel Functionality - Reliable Auto-start Version
(function () {
  "use strict";

  // Global carousel state
  let carousel = {
    currentPosition: 1,
    autoPlayTimer: null,
    isRunning: false,
    isInitialized: false,
  };

  function initCarousel() {
    const prevBtn = document.getElementById("prevCard");
    const nextBtn = document.getElementById("nextCard");
    const cards = document.querySelectorAll(".slide-card");
    const carouselContainer = document.querySelector(".cardSlide-carousel");

    // Safety check
    if (!cards || cards.length === 0) {
      console.log("Carousel elements not found");
      return;
    }

    console.log("Carousel initializing...");

    // Stop any existing timer before initializing
    if (carousel.autoPlayTimer) {
      clearInterval(carousel.autoPlayTimer);
      carousel.autoPlayTimer = null;
      carousel.isRunning = false;
      console.log("Cleared existing timer before init");
    }

    function updateCarousel() {
      cards.forEach((card, index) => {
        // Calculate the position relative to current center
        let position =
          (index - carousel.currentPosition + cards.length) % cards.length;

        // Adjust positions to show only 3 cards (left, center, right)
        if (position > 2) {
          position = 3; // Hide cards that are too far
        }

        card.setAttribute("data-position", position);
      });
    }

    function slideNext() {
      carousel.currentPosition = (carousel.currentPosition + 1) % cards.length;
      updateCarousel();
    }

    function slidePrev() {
      carousel.currentPosition =
        (carousel.currentPosition - 1 + cards.length) % cards.length;
      updateCarousel();
    }

    function startAutoPlay() {
      // Clear any existing timer first
      if (carousel.autoPlayTimer) {
        clearInterval(carousel.autoPlayTimer);
      }

      // Start new auto-play - every 5 seconds
      carousel.autoPlayTimer = setInterval(function () {
        slideNext();
      }, 5000);

      carousel.isRunning = true;
      console.log("Auto-play started");
    }

    function stopAutoPlay() {
      if (carousel.autoPlayTimer) {
        clearInterval(carousel.autoPlayTimer);
        carousel.autoPlayTimer = null;
      }
      carousel.isRunning = false;
      console.log("Auto-play stopped");
    }

    // Navigation button event listeners
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        slideNext();
        stopAutoPlay();
        startAutoPlay(); // Restart the timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        slidePrev();
        stopAutoPlay();
        startAutoPlay(); // Restart the timer
      });
    }

    // Hover pause/resume
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", function () {
        stopAutoPlay();
      });

      carouselContainer.addEventListener("mouseleave", function () {
        startAutoPlay();
      });
    }

    // Click on side cards to bring them to center
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        const position = parseInt(this.getAttribute("data-position"));

        if (position === 0) {
          // Left card clicked
          slidePrev();
          stopAutoPlay();
          startAutoPlay();
        } else if (position === 2) {
          // Right card clicked
          slideNext();
          stopAutoPlay();
          startAutoPlay();
        }
      });
    });

    // Initialize carousel display
    updateCarousel();

    // Start auto-play immediately
    startAutoPlay();

    carousel.isInitialized = true;
    console.log("Carousel initialized and auto-play started");
  }

  // Initialize when DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("DOMContentLoaded event fired");
      initCarousel();
    });
  } else {
    // DOM already loaded, initialize immediately
    console.log("DOM already ready, initializing immediately");
    initCarousel();
  }

  // Handle page show event (back/forward navigation)
  window.addEventListener("pageshow", function (event) {
    console.log("Page shown event triggered, persisted:", event.persisted);

    // Small delay to ensure DOM is fully ready after navigation
    setTimeout(function () {
      // Stop any existing timer
      if (carousel.autoPlayTimer) {
        clearInterval(carousel.autoPlayTimer);
        carousel.autoPlayTimer = null;
        console.log("Cleared existing timer on pageshow");
      }

      // Reinitialize carousel
      carousel.isInitialized = false;
      initCarousel();
    }, 100);
  });

  // Additional check for visibility change (when user switches tabs or returns)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      console.log("Page became visible");
      // Restart auto-play if carousel exists and is not running
      if (!carousel.isRunning) {
        const cards = document.querySelectorAll(".slide-card");
        if (cards && cards.length > 0) {
          console.log("Restarting auto-play after visibility change");

          // Stop any existing timer first
          if (carousel.autoPlayTimer) {
            clearInterval(carousel.autoPlayTimer);
            carousel.autoPlayTimer = null;
          }

          initCarousel();
        }
      }
    }
  });
})();
