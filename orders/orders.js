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

// Orders Page - Display user orders from localStorage

document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});

function displayOrders() {
  const wrapper = document.querySelector(".wrapper");

  if (!wrapper) return;

  // Get orders from localStorage
  const ordersData = JSON.parse(localStorage.getItem("userOrders") || "[]");

  // Clear existing content except the header
  const header = wrapper.querySelector("h2");
  wrapper.innerHTML = "";
  if (header) {
    wrapper.appendChild(header);
  } else {
    const newHeader = document.createElement("h2");
    newHeader.textContent = "View your orders and delivery details below:";
    wrapper.appendChild(newHeader);
  }

  // Check if there are any orders
  if (ordersData.length === 0) {
    const noOrders = document.createElement("div");
    noOrders.className = "no-orders";
    noOrders.innerHTML = `
      <p style="text-align: center; padding: 40px; font-size: 18px; color: #666;">
        You haven't placed any orders yet.
        <br><br>
        <a href="../marketplace/market.html" style="color: #667E06; text-decoration: underline;">
          Start shopping now
        </a>
      </p>
    `;
    wrapper.appendChild(noOrders);
    return;
  }

  // Display orders (most recent first)
  ordersData.reverse().forEach((order) => {
    const orderCard = createOrderCard(order);
    wrapper.appendChild(orderCard);
  });
}

function createOrderCard(order) {
  const orderCard = document.createElement("section");
  orderCard.className = "order-card";

  // Format date
  const orderDate = new Date(order.timestamp);
  const formattedDate = orderDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Order Header
  const orderHeader = document.createElement("div");
  orderHeader.className = "order-header box";
  orderHeader.innerHTML = `
    <div>
      <strong>${order.orderId}</strong>
      <p class="date">${formattedDate}</p>
    </div>
    <span class="status">${order.status || "Pending"}</span>
  `;
  orderCard.appendChild(orderHeader);

  // Customer Info (if available)
  if (order.customerInfo) {
    const customerInfo = document.createElement("div");
    customerInfo.className = "box";
    customerInfo.innerHTML = `
      <h3>Customer & Delivery Information</h3>
      <p><strong>Name:</strong> ${order.customerInfo.name || "N/A"}</p>
      <p><strong>Phone:</strong> ${order.customerInfo.phone || "N/A"}</p>
      <p><strong>Address:</strong> ${order.customerInfo.address || "N/A"}</p>
      ${
        order.customerInfo.city
          ? `<p><strong>City:</strong> ${order.customerInfo.city}</p>`
          : ""
      }
      ${
        order.customerInfo.state
          ? `<p><strong>State:</strong> ${order.customerInfo.state}</p>`
          : ""
      }
    `;
    orderCard.appendChild(customerInfo);
  }

  // Order Items
  const orderItems = document.createElement("div");
  orderItems.className = "box";
  orderItems.innerHTML = `<h3>Order Items</h3>`;

  order.items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>₦${item.total.toLocaleString()}</span>
    `;
    orderItems.appendChild(itemDiv);
  });

  orderCard.appendChild(orderItems);

  // Payment Method
  const paymentMethod = document.createElement("div");
  paymentMethod.className = "box";
  paymentMethod.innerHTML = `
    <h3>Payment Method</h3>
    <p>${order.paymentMethod || "N/A"}</p>
  `;
  orderCard.appendChild(paymentMethod);

  // Order Summary
  const summary = document.createElement("div");
  summary.className = "box";
  summary.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary">
      <div>
        <p>Subtotal</p>
        <p>Delivery</p>
        <strong>Total</strong>
      </div>
      <div class="amount">
        <p>₦${order.subtotal.toLocaleString()}</p>
        <p>₦${order.deliveryFee.toLocaleString()}</p>
        <strong>₦${(
          order.subtotal + order.deliveryFee
        ).toLocaleString()}</strong>
      </div>
    </div>
  `;
  orderCard.appendChild(summary);

  return orderCard;
}

// Function to generate unique order ID
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD${timestamp}${random}`;
}

// Export function for use in payment system
window.OrdersModule = {
  generateOrderId,
  displayOrders,
};
