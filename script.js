const hideNav = document.getElementById("hideNav");
const showNav = document.getElementById("showNav");
const mobileNav = document.querySelector(".mobile-nav-links");
const navLinks = document.querySelectorAll("#mobileNav li");
const navBar = document.querySelector(".container");

const userMenu = document.getElementById("userMenu");
const mobileUserName = document.getElementById("mobileUserName");
const modalContainer = document.querySelector(".modal-container");
const loginModal = document.querySelector(".signIn-card");
const registerModal = document.querySelector(".signUp-card");
const loginBtn = document.querySelectorAll("#loginBtn");
const logoutBtn = document.querySelectorAll("#logoutBtn");
const mobileAuthButtons = document.querySelector(".mobile-auth");
const mobileLoginBtn = mobileAuthButtons?.querySelector("#loginBtn");
const mobileLogoutBtn = mobileAuthButtons?.querySelector("#logoutBtn");
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

  // Remove active class from all slides and dots
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to current slide and dot
  if (slides[currentSlideIndex]) {
    slides[currentSlideIndex].classList.add("active");
  }
  if (dots[currentSlideIndex]) {
    dots[currentSlideIndex].classList.add("active");
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
  // Auto-advance slider every 5 seconds
  if (slides.length > 0) {
    autoSlideInterval = setInterval(() => {
      currentSlideIndex++;
      if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
      showSlide(currentSlideIndex);
    }, 5000);
  }
}

// Initialize slider
if (slides.length > 0) {
  showSlide(currentSlideIndex);
  startAutoSlide();
}

// Mobile Navvigation
if (showNav) {
  showNav.addEventListener("click", (e) => {
    mobileNav.style.display = "block";
    hideNav.style.display = "block";
    navBar.style.display = "none";
  });
}

if (hideNav) {
  hideNav.addEventListener("click", (e) => {
    showNav.style.display = "block";
    mobileNav.style.display = "none";
    navBar.style.display = "flex";
  });
}

navLinks.forEach((links, index) => {
  links.addEventListener("click", () => {
    mobileNav.style.display = "none";
    navBar.style.display = "flex";
  });
});

// Event Listeners for Login/Logout Modals
loginBtn.forEach((login) => {
  login.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
    mobileNav.style.display = "none";
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

    // Close modal and update display
    modalContainer.style.display = "none";
    loginFormElement.reset();

    // Show user menu
    loginBtn.forEach((btn) => (btn.style.display = "none"));
    logoutBtn.forEach((btn) => (btn.style.display = "block"));
    userMenu.style.display = "flex";
    mobileUserName.style.display = "flex";

    // Mobile: hide login button, show logout button
    if (mobileLoginBtn) {
      mobileLoginBtn.style.display = "none";
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "block";
    }

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

    // Mobile: show login button, hide logout button
    if (mobileLoginBtn) {
      mobileLoginBtn.style.display = "block";
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "none";
    }

    alert("You have been logged out successfully!");
  });
});

// ===== Check if user is already logged in on page load =====
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // User is logged in - show logout button, hide login button, show user menu
    loginBtn.forEach((btn) => (btn.style.display = "none"));
    logoutBtn.forEach((btn) => (btn.style.display = "block"));
    userMenu.style.display = "flex";
    mobileUserName.style.display = "flex";

    // Mobile: hide login button, show logout button
    if (mobileLoginBtn) {
      mobileLoginBtn.style.display = "none";
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "block";
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

    // Mobile: show login button, hide logout button
    if (mobileLoginBtn) {
      mobileLoginBtn.style.display = "block";
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.style.display = "none";
    }
  }
});