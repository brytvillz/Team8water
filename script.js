const hideNavLoggedOut = document.getElementById("hideNavLoggedOut");
const hideNavLoggedIn = document.getElementById("hideNavLoggedIn");
const showNav = document.getElementById("showNav");
const mobileNavLoggedOut = document.getElementById("mobileNavLoggedOut");
const mobileNavLoggedIn = document.getElementById("mobileNavLoggedIn");
const navLinksLoggedOut = document.getElementById("navLinksLoggedOut");
const navLinksLoggedIn = document.getElementById("navLinksLoggedIn");
const navLinks = document.querySelectorAll(".mobile-nav-links li");
const navBar = document.querySelector(".container");

// Footer navigation elements
const footerNavLoggedOut = document.getElementById("footerNavLoggedOut");
const footerNavLoggedIn = document.getElementById("footerNavLoggedIn");

const userMenu = document.getElementById("userMenu");
const mobileUserName = document.getElementById("mobileUserName");
const mobileUserDisplay = document.getElementById("mobileUserDisplay");
const modalContainer = document.querySelector(".modal-container");
const loginModal = document.querySelector(".signIn-card");
const registerModal = document.querySelector(".signUp-card");
const loginBtn = document.querySelectorAll("#loginBtn");
const logoutBtn = document.querySelectorAll("#logoutBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
const formClose = document.querySelectorAll("#formClose");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");
const loginSubmitBtn = document.querySelectorAll("#loginSubmitBtn");

// Image Slider
let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let autoSlideInterval;

function showSlide(index) {
  // Ensure index is within bounds
  if (index >= slides.length) currentSlideIndex = 0;
  if (index < 0) currentSlideIndex = slides.length - 1;

  // Remove active and prev classes from all slides
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "prev");
    if (i < currentSlideIndex) {
      slide.classList.add("prev");
    }
  });

  // Add active class to current slide
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add("active");
  }
}

function changeSlide(direction) {
  currentSlideIndex += direction;
  if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
  if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
  clearInterval(autoSlideInterval);
  showSlide(currentSlideIndex);
  startAutoSlide();
}

function currentSlide(index) {
  currentSlideIndex = index;
  clearInterval(autoSlideInterval);
  showSlide(currentSlideIndex);
  startAutoSlide();
}

function startAutoSlide() {
  // Auto-advance slider every 8 seconds
  if (slides.length > 0) {
    autoSlideInterval = setInterval(() => {
      currentSlideIndex++;
      if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
      showSlide(currentSlideIndex);
    }, 8000);
  }
}

// Initialize slider
if (slides.length > 0) {
  showSlide(currentSlideIndex);
  startAutoSlide();
}

// ===== Statistics Counter Animation =====
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16); // 60fps
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + "%";
  }, 16);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = document.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target"));
          animateCounter(stat, target);
        });
        statsObserver.disconnect(); // Animate only once
      }
    });
  },
  { threshold: 0.5 }
);

// Observe the stats container
const statsContainer = document.querySelector(".stats-container");
if (statsContainer) {
  statsObserver.observe(statsContainer);
}

// Mobile Navigation
if (showNav) {
  showNav.addEventListener("click", (e) => {
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

    navBar.style.display = "none";
  });
}

if (hideNavLoggedOut) {
  hideNavLoggedOut.addEventListener("click", (e) => {
    e.preventDefault();
    showNav.style.display = "block";
    mobileNavLoggedOut.style.display = "none";
    navBar.style.display = "flex";
  });
}

if (hideNavLoggedIn) {
  hideNavLoggedIn.addEventListener("click", (e) => {
    e.preventDefault();
    showNav.style.display = "block";
    mobileNavLoggedIn.style.display = "none";
    navBar.style.display = "flex";
  });
}

navLinks.forEach((links, index) => {
  links.addEventListener("click", () => {
    mobileNavLoggedOut.style.display = "none";
    mobileNavLoggedIn.style.display = "none";
    navBar.style.display = "flex";
  });
});

// Event Listeners for Login/Logout Modals
loginBtn.forEach((login) => {
  login.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
    mobileNavLoggedOut.style.display = "none";
    mobileNavLoggedIn.style.display = "none";
    navBar.style.display = "flex";
  });
});

// Event Listeners for Modals

formClose.forEach((close) => {
  close.addEventListener("click", (e) => {
    e.preventDefault();
    modalContainer.style.display = "none";
  });
});

if (switchToRegister) {
  switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "none";
    registerModal.style.display = "flex";
  });
}

if (switchToLogin) {
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
  });
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    modalContainer.style.display = "none";
  }
  if (e.target === registerModal) {
    modalContainer.style.display = "none";
  }
});

// ===== Registration Form Submission =====
const registerFormElement = document.querySelector(".signUp-card form");
if (registerFormElement) {
  registerFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const location = document.getElementById("location").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById(
      "registerConfirmPassword"
    ).value;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !location ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.some((user) => user.email === email)) {
      alert("This email is already registered");
      return;
    }

    // Create user object
    const newUser = {
      firstName,
      lastName,
      email,
      location,
      password,
    };

    // Save to localStorage
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Registration successful! You can now login.");

    // Clear form
    registerFormElement.reset();

    // Switch to login form
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
  });
}

// ===== Login Form Submission =====
const loginFormElement = document.querySelector(".signIn-card form");
if (loginFormElement) {
  loginFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find matching user
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    // Login successful
    const userName = `${user.firstName} ${user.lastName}`;

    // Save current logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Update UI
    document.getElementById("userName").textContent = `Hi ${user.firstName}`;
    document.getElementById(
      "mobileUserName"
    ).textContent = `Hi ${user.firstName}`;

    // Update mobile navbar user display
    if (mobileUserDisplay) {
      mobileUserDisplay.textContent = `Hi ${user.firstName}`;
      mobileUserDisplay.style.display = "inline-block";
    }

    // Close modal and update display
    modalContainer.style.display = "none";
    loginFormElement.reset();

    // Show user menu and update nav links
    loginBtn.forEach((btn) => (btn.style.display = "none"));
    logoutBtn.forEach((btn) => (btn.style.display = "block"));
    userMenu.style.display = "flex";
    mobileUserName.style.display = "flex";

    // Switch desktop nav links
    navLinksLoggedOut.style.display = "none";
    navLinksLoggedIn.style.display = "flex";

    // Switch footer nav links
    if (footerNavLoggedOut) footerNavLoggedOut.style.display = "none";
    if (footerNavLoggedIn) footerNavLoggedIn.style.display = "block";

    // Mobile: show logout button
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "block";
    }

    // Dispatch event for footer link update
    window.dispatchEvent(new Event("userLoggedIn"));

    alert(`Welcome back, ${user.firstName}!`);
  });
}

// ===== Logout Functionality =====
logoutBtn.forEach((logout) => {
  logout.addEventListener("click", () => {
    // Clear current user
    localStorage.removeItem("currentUser");

    // Reset UI
    loginBtn.forEach((btn) => (btn.style.display = "block"));
    logoutBtn.forEach((btn) => (btn.style.display = "none"));
    userMenu.style.display = "none";
    mobileUserName.style.display = "none";

    // Switch desktop nav links back to logged out
    navLinksLoggedOut.style.display = "flex";
    navLinksLoggedIn.style.display = "none";

    // Switch footer nav links back to logged out
    if (footerNavLoggedOut) footerNavLoggedOut.style.display = "block";
    if (footerNavLoggedIn) footerNavLoggedIn.style.display = "none";

    // Mobile: hide logout button and user display
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "none";
    }
    if (mobileUserDisplay) {
      mobileUserDisplay.style.display = "none";
    }

    // Dispatch event for footer link update
    window.dispatchEvent(new Event("userLoggedOut"));

    alert("You have been logged out successfully!");
  });
});

// Mobile Logout Button
if (mobileLogoutBtn) {
  mobileLogoutBtn.addEventListener("click", () => {
    // Clear current user
    localStorage.removeItem("currentUser");

    // Reset UI
    loginBtn.forEach((btn) => (btn.style.display = "block"));
    logoutBtn.forEach((btn) => (btn.style.display = "none"));
    userMenu.style.display = "none";
    mobileUserName.style.display = "none";

    // Switch desktop nav links back to logged out
    navLinksLoggedOut.style.display = "flex";
    navLinksLoggedIn.style.display = "none";

    // Switch footer nav links back to logged out
    if (footerNavLoggedOut) footerNavLoggedOut.style.display = "block";
    if (footerNavLoggedIn) footerNavLoggedIn.style.display = "none";

    // Mobile: hide logout button and user display
    mobileLogoutBtn.style.display = "none";
    if (mobileUserDisplay) {
      mobileUserDisplay.style.display = "none";
    }

    // Close mobile menu
    mobileNavLoggedIn.style.display = "none";
    navBar.style.display = "flex";

    // Dispatch event for footer link update
    window.dispatchEvent(new Event("userLoggedOut"));

    alert("You have been logged out successfully!");
  });
}

// ===== Check if user is already logged in on page load =====
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // User is logged in - show logout button, hide login button, show user menu
    loginBtn.forEach((btn) => (btn.style.display = "none"));
    logoutBtn.forEach((btn) => (btn.style.display = "block"));
    userMenu.style.display = "flex";
    mobileUserName.style.display = "flex";

    // Switch desktop nav links to logged in
    navLinksLoggedOut.style.display = "none";
    navLinksLoggedIn.style.display = "flex";

    // Switch footer nav links to logged in
    if (footerNavLoggedOut) footerNavLoggedOut.style.display = "none";
    if (footerNavLoggedIn) footerNavLoggedIn.style.display = "block";

    // Mobile: show logout button and user display
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "block";
    }
    if (mobileUserDisplay) {
      mobileUserDisplay.textContent = `Hi ${currentUser.firstName}`;
      mobileUserDisplay.style.display = "inline-block";
    }

    document.getElementById(
      "userName"
    ).textContent = `Hi ${currentUser.firstName}`;
    document.getElementById(
      "mobileUserName"
    ).textContent = `Hi ${currentUser.firstName}`;
  } else {
    // User is logged out - show login button, hide logout button and user menu
    loginBtn.forEach((btn) => (btn.style.display = "block"));
    logoutBtn.forEach((btn) => (btn.style.display = "none"));
    userMenu.style.display = "none";
    mobileUserName.style.display = "none";

    // Switch desktop nav links to logged out
    navLinksLoggedOut.style.display = "flex";
    navLinksLoggedIn.style.display = "none";

    // Switch footer nav links to logged out
    if (footerNavLoggedOut) footerNavLoggedOut.style.display = "block";
    if (footerNavLoggedIn) footerNavLoggedIn.style.display = "none";

    // Mobile: hide logout button
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "none";
    }
  }

  // Update footer marketplace link on page load
  if (footerMarketplaceLink) {
    footerMarketplaceLink.href = currentUser ? "marketplace/market.html" : "#";
  }
});

// ===== Marketplace Link Protection =====
// Protect marketplace links for logged-out users
const marketplaceLinkLoggedOut = document.getElementById(
  "marketplaceLinkLoggedOut"
);
const mobileMarketplaceLinkLoggedOut = document.getElementById(
  "mobileMarketplaceLinkLoggedOut"
);

// Desktop marketplace link protection
if (marketplaceLinkLoggedOut) {
  marketplaceLinkLoggedOut.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      // User not logged in - show login modal
      alert("Please log in to access the Marketplace");
      modalContainer.style.display = "flex";
      loginModal.style.display = "flex";
      registerModal.style.display = "none";
    }
  });
}

// Mobile marketplace link protection
if (mobileMarketplaceLinkLoggedOut) {
  mobileMarketplaceLinkLoggedOut.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      // User not logged in - show login modal
      alert("Please log in to access the Marketplace");
      mobileNavLoggedOut.style.display = "none";
      navBar.style.display = "flex";
      modalContainer.style.display = "flex";
      loginModal.style.display = "flex";
      registerModal.style.display = "none";
    }
  });
}

// ===== Category Button Protection =====
// Protect category buttons - only accessible to logged-in users
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      // User not logged in - show login modal
      alert("Please log in to browse categories");
      modalContainer.style.display = "flex";
      loginModal.style.display = "flex";
      registerModal.style.display = "none";
    } else {
      // User is logged in - redirect to marketplace with category filter
      const category = button.getAttribute("data-category");
      window.location.href = `marketplace/market.html?category=${category}`;
    }
  });
});

// ===== Search Functionality =====
const navSearchInput = document.getElementById("navSearchInput");
const navSearchBtn = document.getElementById("navSearchBtn");

// Handle search button click
if (navSearchBtn) {
  navSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSearch();
  });
}

// Handle Enter key press in search input
if (navSearchInput) {
  navSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });
}

function handleSearch() {
  const searchQuery = navSearchInput.value.trim();

  if (!searchQuery) {
    alert("Please enter a crop name to search");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    // User not logged in - show login modal
    alert("Please log in to search for crops");
    modalContainer.style.display = "flex";
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
  } else {
    // User is logged in - redirect to marketplace with search query
    // Store search query in localStorage for marketplace to use
    localStorage.setItem("searchQuery", searchQuery);
    window.location.href = "marketplace/market.html";
  }
}

// ===== Footer Marketplace Link Protection (for logged-out users) =====
const footerMarketplaceLinkLoggedOut = document.getElementById(
  "footerMarketplaceLinkLoggedOut"
);

if (footerMarketplaceLinkLoggedOut) {
  // Add click handler for protection
  footerMarketplaceLinkLoggedOut.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      // User not logged in - show login modal
      alert("Please log in to access the Marketplace");
      modalContainer.style.display = "flex";
      loginModal.style.display = "flex";
      registerModal.style.display = "none";
    } else {
      // User is logged in - redirect to marketplace
      window.location.href = "marketplace/market.html";
    }
  });
}
