// Navigation Elements
const hideNavLoggedOut = document.getElementById("hideNavLoggedOut");
const hideNavLoggedIn = document.getElementById("hideNavLoggedIn");
const showNav = document.getElementById("showNav");
const mobileNavLoggedOut = document.getElementById("mobileNavLoggedOut");
const mobileNavLoggedIn = document.getElementById("mobileNavLoggedIn");
const navLinksLoggedOut = document.getElementById("navLinksLoggedOut");
const navLinksLoggedIn = document.getElementById("navLinksLoggedIn");
const navLinks = document.querySelectorAll(".mobile-nav-links li");

const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");
const mobileUserName = document.getElementById("mobileUserName");
const mobileUserDisplay = document.getElementById("mobileUserDisplay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

// Mobile Navigation Toggle
if (showNav) {
  showNav.addEventListener("click", (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
      mobileNavLoggedIn.style.display = "block";
      mobileNavLoggedOut.style.display = "none";
    } else {
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
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
    if (userName) userName.textContent = `Hi ${currentUser.firstName}`;
    if (mobileUserName)
      mobileUserName.textContent = `Hi ${currentUser.firstName}`;
    if (navLinksLoggedOut) navLinksLoggedOut.style.display = "none";
    if (navLinksLoggedIn) navLinksLoggedIn.style.display = "flex";
    if (mobileUserDisplay) {
      mobileUserDisplay.textContent = `Hi ${currentUser.firstName}`;
      mobileUserDisplay.style.display = "inline-block";
    }
  } else {
    // User is NOT logged in
    if (loginBtn) loginBtn.style.display = "block";
    if (userMenu) userMenu.style.display = "none";
    if (navLinksLoggedOut) navLinksLoggedOut.style.display = "flex";
    if (navLinksLoggedIn) navLinksLoggedIn.style.display = "none";
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

// Navbar search functionality
const navSearchInput = document.getElementById("navSearchInput");
const navSearchBtn = document.getElementById("navSearchBtn");

if (navSearchBtn && navSearchInput) {
  navSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleNavSearch();
  });

  navSearchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNavSearch();
    }
  });
}

function handleNavSearch() {
  const searchQuery = navSearchInput.value.trim();

  if (!searchQuery) {
    alert("Please enter a crop name to search");
    return;
  }

  // Store search query and redirect to marketplace
  localStorage.setItem("searchQuery", searchQuery);
  window.location.href = "../marketplace/market.html";
}

// Check if user is logged in
function checkAuthentication() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    // Redirect to home page if not logged in
    window.location.href = "../index.html";
    return null;
  }
  return currentUser;
}

// Load and display profile data
function loadProfile() {
  const currentUser = checkAuthentication();
  if (!currentUser) return;

  // Display full name in header
  document.getElementById(
    "displayFullName"
  ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("displayEmail").textContent = currentUser.email;

  // Display details
  document.getElementById("displayFirstName").textContent =
    currentUser.firstName;
  document.getElementById("displayLastName").textContent = currentUser.lastName;
  document.getElementById("displayEmailDetail").textContent = currentUser.email;
  document.getElementById("displayLocation").textContent =
    currentUser.location || "Not specified";
}

// Toggle between view and edit mode
function toggleEditMode(showEdit) {
  const profileView = document.getElementById("profileView");
  const profileEdit = document.getElementById("profileEdit");

  if (showEdit) {
    // Populate edit form with current data
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById("editFirstName").value = currentUser.firstName;
    document.getElementById("editLastName").value = currentUser.lastName;
    document.getElementById("editEmail").value = currentUser.email;
    document.getElementById("editLocation").value = currentUser.location || "";

    profileView.style.display = "none";
    profileEdit.style.display = "block";
  } else {
    profileView.style.display = "block";
    profileEdit.style.display = "none";
  }
}

// Update profile information
function updateProfile(e) {
  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Get updated values
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName = document.getElementById("editLastName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const location = document.getElementById("editLocation").value.trim();

  // Validation
  if (!firstName || !lastName || !email || !location) {
    alert("Please fill in all fields");
    return;
  }

  // Check if email is already used by another user
  if (
    email !== currentUser.email &&
    users.some((user) => user.email === email)
  ) {
    alert("This email is already in use by another account");
    return;
  }

  // Update user in users array
  const userIndex = users.findIndex((user) => user.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      email,
      location,
    };

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));

    // Reload profile display
    loadProfile();
    toggleEditMode(false);

    alert("Profile updated successfully!");
  } else {
    alert("Error updating profile. Please try logging in again.");
  }
}

// Update password
function updatePassword(e) {
  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  // Validation
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    alert("Please fill in all password fields");
    return;
  }

  if (currentPassword !== currentUser.password) {
    alert("Current password is incorrect");
    return;
  }

  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters long");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    alert("New passwords do not match");
    return;
  }

  if (currentPassword === newPassword) {
    alert("New password must be different from current password");
    return;
  }

  // Update password in users array
  const userIndex = users.findIndex((user) => user.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;

    // Update localStorage
    localStorage.setItem("users", JSON.stringify(users));

    const updatedCurrentUser = { ...currentUser, password: newPassword };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    // Clear password form
    document.getElementById("profilePasswordForm").reset();

    alert("Password updated successfully!");
  } else {
    alert("Error updating password. Please try logging in again.");
  }
}

// Mobile menu functionality
function openMobileMenu() {
  const mobileMenu = document.getElementById("profileMobileMenu");
  const overlay = document.getElementById("profileMobileOverlay");
  mobileMenu.classList.add("active");
  overlay.classList.add("active");
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("profileMobileMenu");
  const overlay = document.getElementById("profileMobileOverlay");
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load profile on page load
  loadProfile();

  // Edit profile button
  const editProfileBtn = document.getElementById("editProfileBtn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => toggleEditMode(true));
  }

  // Cancel edit button
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => toggleEditMode(false));
  }

  // Profile edit form submission
  const profileEditForm = document.getElementById("profileEditForm");
  if (profileEditForm) {
    profileEditForm.addEventListener("submit", updateProfile);
  }

  // Password form submission
  const profilePasswordForm = document.getElementById("profilePasswordForm");
  if (profilePasswordForm) {
    profilePasswordForm.addEventListener("submit", updatePassword);
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById("profileMobileToggle");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", openMobileMenu);
  }

  const mobileClose = document.getElementById("profileMobileClose");
  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileMenu);
  }

  const overlay = document.getElementById("profileMobileOverlay");
  if (overlay) {
    overlay.addEventListener("click", closeMobileMenu);
  }
});
