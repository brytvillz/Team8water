// Payment System Logic

// Load order data from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  loadOrderSummary();
});

function loadOrderSummary() {
  const orderData = JSON.parse(localStorage.getItem("currentOrder"));

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    // No order data found - show empty state
    document.getElementById("productItemsContainer").innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>No items in your order</p>
        <a href="../marketplace/market.html" style="color: #667e06; text-decoration: none;">
          Return to Marketplace
        </a>
      </div>
    `;
    return;
  }

  // Display products
  const container = document.getElementById("productItemsContainer");
  container.innerHTML = "";

  orderData.items.forEach((item, index) => {
    const productHTML = `
      <div class="product-item" data-index="${index}">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="product-image"
          onerror="this.src='https://via.placeholder.com/200x200?text=${
            item.name
          }'"
        />
        <div class="product-details">
          <h3>${
            item.name
          } <span style="font-size: 0.9rem; font-weight: normal;">(x${
      item.quantity
    })</span></h3>
          <p class="product-description">
            ${item.description}
          </p>
        </div>
        <div class="product-actions">
          <button class="delete-btn" onclick="removeItem(${index})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              />
            </svg>
          </button>
          <span class="product-price">₦${item.total.toLocaleString()}.00</span>
        </div>
      </div>
    `;
    container.innerHTML += productHTML;
  });

  // Update price summary
  const subtotal = orderData.subtotal;
  const deliveryFee = orderData.deliveryFee || 1000;
  const total = subtotal + deliveryFee;

  document.getElementById("itemCount").textContent = orderData.items.length;
  document.getElementById(
    "subtotalAmount"
  ).textContent = `₦${subtotal.toLocaleString()}.00`;
  document.getElementById(
    "deliveryFee"
  ).textContent = `₦${deliveryFee.toLocaleString()}.00`;
  document.getElementById(
    "totalAmount"
  ).textContent = `₦${total.toLocaleString()}.00`;
}

function removeItem(index) {
  const orderData = JSON.parse(localStorage.getItem("currentOrder"));

  if (!orderData || !orderData.items) return;

  // Remove item
  orderData.items.splice(index, 1);

  // Recalculate subtotal
  orderData.subtotal = orderData.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  // Save updated order
  localStorage.setItem("currentOrder", JSON.stringify(orderData));

  // Reload display
  loadOrderSummary();

  // If no items left, redirect to marketplace
  if (orderData.items.length === 0) {
    setTimeout(() => {
      alert("Your cart is empty. Redirecting to marketplace...");
      window.location.href = "../marketplace/market.html";
    }, 500);
  }
}

class PaymentSystem {
  constructor() {
    this.selectedMethod = "card";
    this.cart = [
      { id: 1, name: "Rice", price: 12000.0, qty: 1, type: "18kg" },
      { id: 2, name: "Sorghum", price: 22000.0, qty: 1, type: "1/2bag" },
    ];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCart();
    this.setupCardFormatting();
  }

  setupEventListeners() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach((option) => {
      option.addEventListener("change", (e) =>
        this.handlePaymentMethodChange(e)
      );
    });

    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleDelete(e));
    });

    // Back button
    const backBtn = document.querySelector(".back-button");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.history.back();
      });
    }

    // Modal close button
    const modalClose = document.querySelector(".modal-close");
    if (modalClose) {
      modalClose.addEventListener("click", () => this.closeCardModal());
    }

    // Modal overlay click to close
    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) {
      modalOverlay.addEventListener("click", () => this.closeCardModal());
    }

    // Close buttons for all modals
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".payment-modal");
        this.closeModal(modal);
      });
    });

    // Close on overlay click for all modals
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (e) => {
        const modal = e.target.closest(".payment-modal");
        this.closeModal(modal);
      });
    });

    // Proceed button in modal
    const proceedBtn = document.getElementById("proceedPayment");
    if (proceedBtn) {
      proceedBtn.addEventListener("click", () => this.processCardPayment());
    }

    // COD proceed button
    const proceedCODBtn = document.getElementById("proceedCOD");
    if (proceedCODBtn) {
      proceedCODBtn.addEventListener("click", () => this.processCODPayment());
    }

    // Bank proceed button
    const proceedBankBtn = document.getElementById("proceedBank");
    if (proceedBankBtn) {
      proceedBankBtn.addEventListener("click", () => this.processBankPayment());
    }
  }

  handlePaymentMethodChange(e) {
    this.selectedMethod = e.target.value;
    console.log("Payment method selected:", this.selectedMethod);

    // Open the appropriate modal based on selection
    if (this.selectedMethod === "card") {
      this.openCardModal();
    } else if (this.selectedMethod === "cod") {
      this.openCODModal();
    } else if (this.selectedMethod === "bank") {
      this.openBankModal();
    }
  }

  handleDelete(e) {
    const productItem = e.target.closest(".product-item");
    if (productItem) {
      productItem.remove();
      this.updateCart();
    }
  }

  openCardModal() {
    const modal = document.getElementById("cardModal");
    if (modal) {
      // Add active class with slight delay for smooth animation
      requestAnimationFrame(() => {
        modal.classList.add("active");
      });
      document.body.style.overflow = "hidden";
    }
  }

  closeCardModal() {
    const modal = document.getElementById("cardModal");
    if (modal) {
      modal.classList.remove("active");

      // Wait for animation to complete before allowing scroll
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 600);

      // Uncheck the card radio button if user closes without proceeding
      const cardRadio = document.getElementById("card");
      if (cardRadio) {
        cardRadio.checked = false;
      }
    }
  }

  openCODModal() {
    const modal = document.getElementById("codModal");
    if (modal) {
      requestAnimationFrame(() => {
        modal.classList.add("active");
      });
      document.body.style.overflow = "hidden";
    }
  }

  openBankModal() {
    const modal = document.getElementById("bankModal");
    if (modal) {
      // Calculate and display the total amount
      const orderData = JSON.parse(localStorage.getItem("currentOrder"));
      if (orderData) {
        const subtotal = orderData.subtotal;
        const deliveryFee = orderData.deliveryFee || 1000;
        const total = subtotal + deliveryFee;

        const bankTransferAmountEl =
          document.getElementById("bankTransferAmount");
        if (bankTransferAmountEl) {
          bankTransferAmountEl.textContent = `₦${total.toLocaleString()}.00`;
        }
      }

      requestAnimationFrame(() => {
        modal.classList.add("active");
      });
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove("active");

      setTimeout(() => {
        document.body.style.overflow = "";
      }, 600);

      // Uncheck all radio buttons
      document.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.checked = false;
      });
    }
  }
  setupCardFormatting() {
    // Format card number
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;
      });
    }

    // Format expiry date
    const cardExpiry = document.getElementById("cardExpiry");
    if (cardExpiry) {
      cardExpiry.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
          value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value;
      });
    }

    // Format CVV (numbers only)
    const cardCvv = document.getElementById("cardCvv");
    if (cardCvv) {
      cardCvv.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    }
  }

  // Function to save order to localStorage
  saveOrder(paymentMethod, customerInfo = {}) {
    const currentOrder = JSON.parse(
      localStorage.getItem("currentOrder") || "{}"
    );

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`;

    // Get existing orders
    const existingOrders = JSON.parse(
      localStorage.getItem("userOrders") || "[]"
    );

    // Create new order object
    const newOrder = {
      orderId: orderId,
      timestamp: new Date().toISOString(),
      items: currentOrder.items || [],
      subtotal: currentOrder.subtotal || 0,
      deliveryFee: currentOrder.deliveryFee || 1000,
      paymentMethod: paymentMethod,
      customerInfo: customerInfo,
      status: "Pending",
    };

    // Add new order to beginning of array
    existingOrders.unshift(newOrder);

    // Save back to localStorage
    localStorage.setItem("userOrders", JSON.stringify(existingOrders));

    // Clear current order
    localStorage.removeItem("currentOrder");

    return orderId;
  }

  // Function to redirect to orders page
  redirectToOrders() {
    setTimeout(() => {
      window.location.href = "../orders/orders.html";
    }, 1500);
  }

  async processCardPayment() {
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const cardHolder = document.getElementById("cardHolder").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCvv = document.getElementById("cardCvv").value;

    // Validate fields
    if (!cardNumber || cardNumber.length < 13) {
      alert("Please enter a valid card number");
      return;
    }
    if (!cardHolder) {
      alert("Please enter cardholder name");
      return;
    }
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      alert("Please enter a valid expiration date (MM/YY)");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      alert("Please enter a valid CVV");
      return;
    }

    // Simulate processing
    const proceedBtn = document.getElementById("proceedPayment");
    const originalText = proceedBtn.textContent;
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    await this.simulateAPICall();

    // Save order to localStorage with customer info
    const cardholderName = document
      .getElementById("cardholderName")
      .value.trim();
    const orderId = this.saveOrder("Credit/Debit Card", {
      name: cardholderName,
    });

    // Close modal and show success
    this.closeCardModal();
    alert(
      `Payment successful!\nOrder ID: ${orderId}\nThank you for your order!`
    );

    // Clear marketplace state after successful payment
    localStorage.removeItem("marketplaceState");
    localStorage.removeItem("marketplacePage");
    localStorage.removeItem("currentOrder");

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;

    // Redirect to orders page
    this.redirectToOrders();
  }

  async processCODPayment() {
    const codName = document.getElementById("codName").value.trim();
    const codPhone = document.getElementById("codPhone").value.trim();
    const codAddress = document.getElementById("codAddress").value.trim();

    if (!codName) {
      alert("Please enter your full name");
      return;
    }
    if (!codPhone || codPhone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    if (!codAddress) {
      alert("Please enter your delivery address");
      return;
    }

    // Simulate processing
    const proceedBtn = document.getElementById("proceedCOD");
    const originalText = proceedBtn.textContent;
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    await this.simulateAPICall();

    // Save order to localStorage with customer info
    const orderId = this.saveOrder("Cash on Delivery", {
      name: codName,
      phone: codPhone,
      address: codAddress,
    });

    // Close modal and show success
    const modal = document.getElementById("codModal");
    this.closeModal(modal);
    alert(
      `Order confirmed!\nOrder ID: ${orderId}\nYour order will be delivered soon. Payment on delivery.`
    );

    // Clear marketplace state after successful payment
    localStorage.removeItem("marketplaceState");
    localStorage.removeItem("marketplacePage");
    localStorage.removeItem("currentOrder");

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;

    // Redirect to orders page
    this.redirectToOrders();
  }

  async processBankPayment() {
    const bankName = document.getElementById("bankName").value.trim();

    if (!bankName) {
      alert("Please enter your full name");
      return;
    }

    // Simulate processing
    const proceedBtn = document.getElementById("proceedBank");
    const originalText = proceedBtn.textContent;
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    await this.simulateAPICall();

    // Save order to localStorage with customer info
    const orderId = this.saveOrder("Bank Transfer", {
      name: bankName,
    });

    // Close modal and show success
    const modal = document.getElementById("bankModal");
    this.closeModal(modal);
    alert(
      `Payment received!\nOrder ID: ${orderId}\nYour order will be processed once we verify your bank transfer.`
    );

    // Clear marketplace state after successful payment
    localStorage.removeItem("marketplaceState");
    localStorage.removeItem("marketplacePage");
    localStorage.removeItem("currentOrder");

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;

    // Redirect to orders page
    this.redirectToOrders();
  }

  updateCart() {
    const items = document.querySelectorAll(".product-item");
    let subtotal = 0;

    items.forEach((item) => {
      const price = parseFloat(
        item.querySelector(".product-price").textContent.replace(/[₦,]/g, "")
      );
      subtotal += price;
    });

    const deliveryFee = 1000.0;
    const tax = 0.0;
    const total = subtotal + deliveryFee + tax;

    // Update summary using the correct IDs
    const itemCountEl = document.getElementById("itemCount");
    const subtotalEl = document.getElementById("subtotalAmount");
    const deliveryEl = document.getElementById("deliveryFee");
    const totalEl = document.getElementById("totalAmount");

    if (itemCountEl) itemCountEl.textContent = items.length;
    if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}.00`;
    if (deliveryEl)
      deliveryEl.textContent = `₦${deliveryFee.toLocaleString()}.00`;
    if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}.00`;
  }

  simulateAPICall() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }
}

// Initialize the payment system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PaymentSystem();
});
