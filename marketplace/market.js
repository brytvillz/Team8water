// Mobile Navigation Elements
const hideNavLoggedOut = document.getElementById("hideNavLoggedOut");
const hideNavLoggedIn = document.getElementById("hideNavLoggedIn");
const showNav = document.getElementById("showNav");
const mobileNavLoggedOut = document.getElementById("mobileNavLoggedOut");
const mobileNavLoggedIn = document.getElementById("mobileNavLoggedIn");
const navLinksLoggedOut = document.getElementById("navLinksLoggedOut");
const navLinksLoggedIn = document.getElementById("navLinksLoggedIn");
const navLinks = document.querySelectorAll(".mobile-nav-links li");
const navBar = document.querySelector(".container");

const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const mobileUserName = document.getElementById("mobileUserName");
const mobileUserDisplay = document.getElementById("mobileUserDisplay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

// Mobile Navigation Functions
if (showNav) {
  showNav.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      // Show logged-in nav
      mobileNavLoggedIn.style.display = "block";
      mobileNavLoggedOut.style.display = "none";
    } else {
      // Show logged-out nav
      mobileNavLoggedOut.style.display = "block";
      mobileNavLoggedIn.style.display = "none";
    }
  });
}

if (hideNavLoggedOut) {
  hideNavLoggedOut.addEventListener("click", (e) => {
    e.preventDefault();
    mobileNavLoggedOut.style.display = "none";
  });
}

if (hideNavLoggedIn) {
  hideNavLoggedIn.addEventListener("click", (e) => {
    e.preventDefault();
    mobileNavLoggedIn.style.display = "none";
  });
}

// Check login status on page load
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // User is logged in
    if (navLinksLoggedIn) navLinksLoggedIn.style.display = "flex";
    if (navLinksLoggedOut) navLinksLoggedOut.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
    if (mobileUserDisplay) {
      mobileUserDisplay.style.display = "block";
      mobileUserDisplay.textContent = `Hi ${currentUser.firstName}`;
    }
    if (userName) userName.textContent = `Hi ${currentUser.firstName}`;
    if (mobileUserName)
      mobileUserName.textContent = `Hi ${currentUser.firstName}`;
  } else {
    // User is not logged in
    if (navLinksLoggedOut) navLinksLoggedOut.style.display = "flex";
    if (navLinksLoggedIn) navLinksLoggedIn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";
    if (userMenu) userMenu.style.display = "none";
    if (mobileUserDisplay) mobileUserDisplay.style.display = "none";
  }
});

// Logout functionality
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
}

if (mobileLogoutBtn) {
  mobileLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
  });
}

//smooth scrolling through the a tag
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar search functionality
  const navSearchInput = document.getElementById("navSearchInput");
  const navSearchBtn = document.getElementById("navSearchBtn");

  if (navSearchBtn && navSearchInput) {
    navSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterProducts();
    });

    navSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        filterProducts();
      }
    });
  }

  // Check for search query from homepage
  const searchQuery = localStorage.getItem("searchQuery");
  if (searchQuery) {
    // Find the navbar search input
    const navSearchInput = document.getElementById("navSearchInput");
    if (navSearchInput) {
      // Populate the navbar search with the query
      navSearchInput.value = searchQuery;

      // Trigger the search/filter
      setTimeout(() => {
        filterProducts();
      }, 100);
    }

    // Clear the search query from localStorage after using it
    localStorage.removeItem("searchQuery");
  }

  // Also check URL parameters for search query (when redirected from marketplace)
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearchQuery = urlParams.get("search");
  if (urlSearchQuery) {
    const navSearchInput = document.getElementById("navSearchInput");
    if (navSearchInput) {
      // Populate the navbar search with the URL query
      navSearchInput.value = urlSearchQuery;

      // Trigger the search/filter
      setTimeout(() => {
        filterProducts();
        // Clean URL by removing search parameter
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 100);
    }
  }
});

//To give active button a color
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("secondPartRight");
  if (!container) return;

  const links = container.querySelectorAll("a");

  const currentUrl = window.location.href;

  links.forEach((link) => {
    if (currentUrl.includes(link.href)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

//To control carousel - Smooth continuous auto-scroll with hover pause
const track = document.querySelector(".carousel-track");
const images = document.querySelectorAll(".carousel-track img");
const carouselContainer = document.querySelector(".carousel-container");

if (!track || images.length === 0) {
  console.error("Carousel elements not found.");
} else {
  // Pause animation on hover over any image
  images.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      track.classList.add("paused");
    });

    img.addEventListener("mouseleave", () => {
      track.classList.remove("paused");
    });
  });

  // Pause animation on hover over container
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      track.classList.add("paused");
    });

    carouselContainer.addEventListener("mouseleave", () => {
      track.classList.remove("paused");
    });
  }
}

//To take note of the number of crops in real time
const accurateCropCounts = {
  "market.html": 10,
  "market.html?category=cereals": 5,
  "market.html?category=legumes": 3,
  "market.html?category=tubers": 2,
};

function getProductPrice(productCard) {
  const priceText = productCard.querySelector(".price").textContent;
  const match = priceText.match(/₦([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ""), 10);
  }
  return 0;
}

//To take note of amount of products
function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

function updateGlobalSummary() {
  const productCards = document.querySelectorAll(".product-card");
  let totalItems = 0;
  let totalPrice = 0;

  productCards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('input[type="number"]');

    if (checkbox && checkbox.checked && card.style.display !== "none") {
      const quantity = parseInt(quantityInput.value) || 0;
      const price = getProductPrice(card);

      totalItems += quantity;
      totalPrice += price * quantity;
    }
  });

  const oneElement = document.getElementById("one");
  if (oneElement) {
    oneElement.textContent =
      totalItems === 0
        ? "No item selected"
        : `${totalItems} item${totalItems !== 1 ? "s" : ""} selected`;
  }

  const twoElement = document.getElementById("two");
  if (twoElement) {
    twoElement.textContent = `Total: ${formatNaira(totalPrice)}`;
  }
}

function updateFilteredCropCount(currentVisibleCount) {
  const showCropsElement = document.getElementById("showCrops");
  const totalCrops = document.querySelectorAll(".product-card").length;

  if (showCropsElement) {
    showCropsElement.innerHTML = `Showing <strong>${currentVisibleCount}</strong> of <strong>${totalCrops}</strong> crops`;
  }
}

//To search for crops on the webpage
function updateNotAvailableMessage(isVisible) {
  let messageElement = document.getElementById("notAvailableMessage");
  if (!messageElement) {
    const mainContent =
      document.querySelector(".selection-controls") || document.body;
    messageElement = document.createElement("p");
    messageElement.id = "notAvailableMessage";
    messageElement.textContent =
      "Crop not available on this page. Redirecting...";
    messageElement.style.color = "red";
    messageElement.style.fontWeight = "bold";
    messageElement.style.display = "none";
    mainContent.insertAdjacentElement("afterend", messageElement);
  }
  messageElement.style.display = isVisible ? "block" : "none";
}

const cropLocationMap = {
  rice: "market.html?category=cereals",
  wheat: "market.html?category=cereals",
  maize: "market.html?category=cereals",
  millet: "market.html?category=cereals",
  sorghum: "market.html?category=cereals",
  groundnut: "market.html?category=legumes",
  soybean: "market.html?category=legumes",
  beans: "market.html?category=legumes",
  yam: "market.html?category=tubers",
  cassava: "market.html?category=tubers",
};

// Filter products by category
function filterByCategory(category) {
  const productCards = document.querySelectorAll(".product-card");
  let visibleCrops = 0;

  // Category mapping to product keywords
  const categoryKeywords = {
    tubers: ["yam", "cassava", "potato", "root"],
    cereals: [
      "wheat",
      "rice",
      "maize",
      "millet",
      "sorghum",
      "corn",
      "grain",
      "cereal",
    ],
    legumes: ["beans", "soybean", "groundnut", "peas", "lentils", "legume"],
  };

  const keywords = categoryKeywords[category.toLowerCase()] || [];

  productCards.forEach((card) => {
    const title =
      card.querySelector(".product-title h3")?.textContent.toLowerCase() || "";
    const description =
      card.querySelector(".description")?.textContent.toLowerCase() || "";

    // Check if the product matches any keyword in the category
    const isMatch = keywords.some(
      (keyword) => title.includes(keyword) || description.includes(keyword)
    );

    if (isMatch || keywords.length === 0) {
      card.style.display = "";
      visibleCrops++;
    } else {
      card.style.display = "none";
    }
  });

  updateFilteredCropCount(visibleCrops);
  updateGlobalSummary();
  updateNotAvailableMessage(visibleCrops === 0);
}

function filterProducts() {
  const navSearchInput = document.getElementById("navSearchInput");
  if (!navSearchInput) return;

  const searchTerm = navSearchInput.value.toLowerCase().trim();

  const productCards = document.querySelectorAll(".product-card");
  let visibleCrops = 0;

  if (searchTerm === "") {
    productCards.forEach((card) => (card.style.display = ""));
    updateFilteredCropCount(productCards.length);
    updateNotAvailableMessage(false);
    return;
  }

  productCards.forEach((card) => {
    const title =
      card.querySelector(".product-title h3")?.textContent.toLowerCase() || "";
    const description =
      card.querySelector(".description")?.textContent.toLowerCase() || "";

    const isMatch =
      title.includes(searchTerm) || description.includes(searchTerm);

    if (isMatch) {
      card.style.display = "";
      visibleCrops++;
    } else {
      card.style.display = "none";
    }
  });

  updateFilteredCropCount(visibleCrops);
  updateGlobalSummary();
  updateNotAvailableMessage(false);

  if (visibleCrops === 0) {
    const foundPage = cropLocationMap[searchTerm];

    if (foundPage) {
      // Get current page URL (filename + query params)
      const currentFile = window.location.pathname.substring(
        window.location.pathname.lastIndexOf("/") + 1
      );
      const currentParams = window.location.search;
      const currentPageUrl = currentFile + currentParams;

      // Check if we need to redirect to a different page
      if (foundPage !== currentPageUrl && !foundPage.includes(currentFile)) {
        updateNotAvailableMessage(true);

        setTimeout(() => {
          window.location.href = `${foundPage}&search=${encodeURIComponent(
            navSearchInput.value.trim()
          )}`;
        }, 500);
      } else {
        updateNotAvailableMessage(true);
        document.getElementById("notAvailableMessage").textContent =
          "Crop not found. Try a different search.";
      }
    } else {
      updateNotAvailableMessage(true);
      document.getElementById("notAvailableMessage").textContent =
        "Crop not available anywhere.";
    }
  }
}

//To update the crop count on the webpage
function updateCropCount() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf("/") + 1) || "market.html";
  const params = window.location.search;
  const pageKey = filename + params;

  const totalCrops =
    accurateCropCounts[pageKey] || accurateCropCounts[filename] || 10;
  const showCropsElement = document.getElementById("showCrops");

  if (showCropsElement) {
    showCropsElement.innerHTML = `Showing <strong>${totalCrops}</strong> of <strong>${totalCrops}</strong> crops`;
  }
}

function setupProductCardListeners(card) {
  const checkbox = card.querySelector('input[type="checkbox"]');
  const quantityInput = card.querySelector(
    '.quantity-area input[type="number"]'
  );

  const qtyUpButton = card.querySelector(".qty-buttons-vertical #qtyUp");
  const qtyDownButton = card.querySelector(".qty-buttons-vertical #qtyDown");

  if (!checkbox || !quantityInput || !qtyUpButton || !qtyDownButton) {
    console.warn("Missing elements in product card:", card);
    return;
  }

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      quantityInput.disabled = false;
      quantityInput.value = 1;
    } else {
      quantityInput.disabled = true;
      quantityInput.value = "";
    }
    updateGlobalSummary();
    // Save state whenever checkbox changes
    saveMarketplaceState();
  });

  qtyUpButton.addEventListener("click", () => {
    if (checkbox.checked) {
      let currentQty = parseInt(quantityInput.value) || 0;
      quantityInput.value = currentQty + 1;
      updateGlobalSummary();
    }
  });

  qtyDownButton.addEventListener("click", () => {
    if (checkbox.checked) {
      let currentQty = parseInt(quantityInput.value) || 0;
      if (currentQty > 1) {
        quantityInput.value = currentQty - 1;
        updateGlobalSummary();
      } else if (currentQty === 1) {
        checkbox.checked = false;
        quantityInput.disabled = true;
        quantityInput.value = "";
        updateGlobalSummary();
      }
    }
  });

  quantityInput.addEventListener("input", () => {
    let currentQty = parseInt(quantityInput.value);
    if (currentQty < 1 || isNaN(currentQty)) {
      quantityInput.value = 1;
    }
    if (checkbox.checked) {
      updateGlobalSummary();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCropCount();

  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach(setupProductCardListeners);

  const searchInput = document.querySelector('.search-box input[type="text"]');
  const searchButton = document.querySelector(".search-btn");

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
    searchButton?.addEventListener("click", filterProducts);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialSearchTerm = urlParams.get("search");
  const categoryFilter = urlParams.get("category");

  // Handle category filtering from URL parameter
  if (categoryFilter) {
    filterByCategory(categoryFilter);
    // Update the page title/heading to reflect the category
    const showCropsElement = document.getElementById("showCrops");
    if (showCropsElement) {
      const categoryNames = {
        tubers: "Root Crops",
        cereals: "Grains & Cereals",
        legumes: "Legumes",
      };
      const categoryName = categoryNames[categoryFilter] || "All Crops";
      // Keep the filtered count display but add category name
      const visibleCount = document.querySelectorAll(
        '.product-card:not([style*="display: none"])'
      ).length;
      const totalCount = document.querySelectorAll(".product-card").length;
      showCropsElement.innerHTML = `<strong>${categoryName}</strong> - Showing <strong>${visibleCount}</strong> of <strong>${totalCount}</strong> crops`;
    }
  }

  if (initialSearchTerm && searchInput) {
    searchInput.value = initialSearchTerm;
    filterProducts();

    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }

  updateGlobalSummary();

  // Restore marketplace selections if returning from payment
  restoreMarketplaceSelections();
});

// ===== Function to Save Marketplace State =====
function saveMarketplaceState() {
  const marketplaceState = [];
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    const quantityInput = card.querySelector('input[type="number"]');
    const productName = card.querySelector("h3")?.textContent;

    if (productName) {
      // Save ALL products, not just checked ones
      marketplaceState.push({
        productName: productName,
        quantity:
          checkbox && checkbox.checked ? parseInt(quantityInput.value) || 1 : 0,
        checked: checkbox ? checkbox.checked : false,
      });
    }
  });

  localStorage.setItem("marketplaceState", JSON.stringify(marketplaceState));
  // Also save the current page URL for proper navigation back
  localStorage.setItem("marketplacePage", window.location.pathname);
} // ===== Function to Restore Marketplace State =====
function restoreMarketplaceSelections() {
  const savedState = localStorage.getItem("marketplaceState");

  if (!savedState) return;

  try {
    const marketplaceState = JSON.parse(savedState);
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      const productName = card.querySelector("h3")?.textContent;
      const checkbox = card.querySelector('input[type="checkbox"]');
      const quantityInput = card.querySelector('input[type="number"]');

      // Find if this product was saved
      const savedProduct = marketplaceState.find(
        (item) => item.productName === productName
      );

      if (savedProduct && checkbox && quantityInput) {
        // Restore the exact state (checked or unchecked)
        checkbox.checked = savedProduct.checked;

        if (savedProduct.checked && savedProduct.quantity > 0) {
          quantityInput.disabled = false;
          quantityInput.value = savedProduct.quantity;
        } else {
          quantityInput.disabled = true;
          quantityInput.value = "";
        }
      }
    });

    // Update the summary after restoring
    updateGlobalSummary();
  } catch (error) {
    console.error("Error restoring marketplace selections:", error);
  }
}

// ===== Proceed to Payment Button Handler =====
const proceedToPaymentBtn = document.getElementById("proceedToPaymentBtn");

if (proceedToPaymentBtn) {
  proceedToPaymentBtn.addEventListener("click", () => {
    // Check if any items are selected
    const selectedItems = document.querySelectorAll(
      '.product-card input[type="checkbox"]:checked'
    );

    if (selectedItems.length === 0) {
      alert("Please select at least one item before proceeding to payment");
      return;
    }

    // Get the total from the display
    const totalText = document.getElementById("two").textContent;
    const total = totalText.replace("Total: ₦", "").replace(/,/g, "");

    if (parseFloat(total) === 0) {
      alert("Please select items with valid quantities");
      return;
    }

    // Collect order data
    const orderItems = [];
    selectedItems.forEach((checkbox) => {
      const productCard = checkbox.closest(".product-card");
      const productName = productCard.querySelector("h3").textContent;
      const productDescription =
        productCard.querySelector(".description").textContent;
      const priceText = productCard.querySelector(".price").textContent;
      const price = priceText.match(/[\d,]+/)[0].replace(/,/g, "");
      const quantityInput = productCard.querySelector('input[type="number"]');
      const quantity = parseInt(quantityInput.value) || 1;
      const imageSrc = productCard.querySelector("img").src;

      // Calculate total for this item
      const itemTotal = parseFloat(price) * quantity;

      orderItems.push({
        name: productName,
        description: productDescription,
        price: parseFloat(price),
        quantity: quantity,
        total: itemTotal,
        image: imageSrc,
      });
    });

    // Store order data in localStorage
    const orderData = {
      items: orderItems,
      subtotal: parseFloat(total),
      deliveryFee: 1000, // Fixed delivery fee
      tax: 0,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderData));

    // Save marketplace state before navigating
    saveMarketplaceState();

    // Navigate to payout system
    window.location.href = "../payoutsystem/pay.html";
  });
}
