// Card Carousel Functionality
(function () {
  "use strict";

  let currentPosition = 1;
  let autoPlayTimer = null;

  function initCarousel() {
    const cards = document.querySelectorAll(".slide-card");

    if (!cards || cards.length === 0) {
      console.log("Carousel elements not found");
      return;
    }

    console.log("Carousel found, initializing with", cards.length, "cards");

    function updateCarousel() {
      cards.forEach((card, index) => {
        let position = (index - currentPosition + cards.length) % cards.length;
        if (position > 2) position = 3;
        card.setAttribute("data-position", position);
      });
    }

    function slideNext() {
      currentPosition = (currentPosition + 1) % cards.length;
      updateCarousel();
      console.log("Slid to position:", currentPosition);
    }

    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(slideNext, 5000);
      console.log("Auto-play started - will advance every 5 seconds");
    }

    // Initialize carousel position
    updateCarousel();

    // Start auto-play immediately
    startAutoPlay();
    console.log("Carousel fully initialized and auto-play running");
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
  } else {
    initCarousel();
  }
})();
