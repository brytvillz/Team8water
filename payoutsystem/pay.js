// Payment System Logic

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

    // Format PIN (numbers only)
    const cardPin = document.getElementById("cardPin");
    if (cardPin) {
      cardPin.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      });
    }
  }

  async processCardPayment() {
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const cardHolder = document.getElementById("cardHolder").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCvv = document.getElementById("cardCvv").value;
    const cardPin = document.getElementById("cardPin").value;

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
    if (!cardPin || cardPin.length < 4) {
      alert("Please enter your 4-digit PIN");
      return;
    }

    // Simulate processing
    const proceedBtn = document.getElementById("proceedPayment");
    const originalText = proceedBtn.textContent;
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    await this.simulateAPICall();

    // Close modal and show success
    this.closeCardModal();
    alert("Payment successful!\nThank you for your order!");

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;
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

    // Close modal and show success
    const modal = document.getElementById("codModal");
    this.closeModal(modal);
    alert(
      "Order confirmed!\nYour order will be delivered soon. Payment on delivery."
    );

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;
  }

  async processBankPayment() {
    const bankName = document.getElementById("bankName").value.trim();
    const bankReference = document.getElementById("bankReference").value.trim();

    if (!bankName) {
      alert("Please enter your full name");
      return;
    }
    if (!bankReference) {
      alert("Please enter your transaction reference number");
      return;
    }

    // Simulate processing
    const proceedBtn = document.getElementById("proceedBank");
    const originalText = proceedBtn.textContent;
    proceedBtn.disabled = true;
    proceedBtn.textContent = "Processing...";

    await this.simulateAPICall();

    // Close modal and show success
    const modal = document.getElementById("bankModal");
    this.closeModal(modal);
    alert(
      "Payment received!\nYour order will be processed once we verify your bank transfer."
    );

    proceedBtn.disabled = false;
    proceedBtn.textContent = originalText;
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

    const deliveryFee = 2500.0;
    const tax = 0.0;
    const total = subtotal + deliveryFee + tax;

    // Update summary
    const subtotalEl = document.querySelector(
      ".price-summary .summary-row:nth-child(1) span:last-child"
    );
    const deliveryEl = document.querySelector(
      ".price-summary .summary-row:nth-child(2) span:last-child"
    );
    const taxEl = document.querySelector(
      ".price-summary .summary-row:nth-child(3) span:last-child"
    );
    const totalEl = document.querySelector(".total-price");
    const itemCountEl = document.querySelector(
      ".price-summary .summary-row:first-child span:first-child"
    );
    const checkoutBtn = document.getElementById("processPayment");

    if (subtotalEl)
      subtotalEl.textContent = `₦${subtotal.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (deliveryEl)
      deliveryEl.textContent = `₦${deliveryFee.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (taxEl)
      taxEl.textContent = `₦${tax.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (totalEl)
      totalEl.textContent = `₦${total.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    if (itemCountEl)
      itemCountEl.textContent = `Subtotal (${items.length} items)`;
    if (checkoutBtn)
      checkoutBtn.textContent = `Complete Checkout - ₦${total.toLocaleString(
        "en-NG",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`;
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
