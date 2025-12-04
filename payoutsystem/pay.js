// ===================================
// GLOBAL VARIABLES & DOM ELEMENTS
// ===================================

// Get all DOM elements we need to manipulate
const deliveryInput = document.querySelector(".delivery-input");
const phoneInput = document.querySelector(".phone-input");
const paymentOptions = document.querySelectorAll('input[name="payment"]');
const backBtn = document.querySelector(".back-btn");
const changeButtons = document.querySelectorAll(".change-btn");

// Cart data - Using OBJECTS to store product information
const cart = [
  {
    id: 1,
    name: "Soybean",
    quantity: 2,
    price: 12.0,
    image: "https://via.placeholder.com/64/8B4513/FFFFFF?text=Soybean",
  },
  {
    id: 2,
    name: "Sorghum",
    quantity: 1,
    price: 12.0,
    image: "https://via.placeholder.com/64/DAA520/FFFFFF?text=Sorghum",
  },
];

// Pricing configuration - OBJECT
const pricing = {
  deliveryFee: 0.0,
  taxRate: 0.08, // 8% tax
};

// ===================================
// EVENT LISTENERS - Handling User Interactions
// ===================================

// Wait for DOM to fully load before running code
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the page
  renderCart();
  calculatePrices();

  // Back button click - Navigate to previous page
  backBtn.addEventListener("click", handleBackButton);

  // Payment option selection - Using LOOP to add event to each radio button
  paymentOptions.forEach(function (option) {
    option.addEventListener("change", handlePaymentSelection);
  });

  // Change buttons - Using LOOP
  changeButtons.forEach(function (btn) {
    btn.addEventListener("click", handleChangeButton);
  });

  // Input validation on typing
  deliveryInput.addEventListener("input", validateDeliveryInput);
  phoneInput.addEventListener("input", validatePhoneInput);
});

// ===================================
// FUNCTIONS - Reusable Code Blocks
// ===================================

// FUNCTION 1: Handle back button click
function handleBackButton() {
  // CONDITIONAL - Check if user has entered data
  if (deliveryInput.value || phoneInput.value) {
    const confirmLeave = confirm(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    if (confirmLeave) {
      window.history.back(); // Go to previous page
    }
  } else {
    window.history.back();
  }
}

// FUNCTION 2: Handle payment option selection
function handlePaymentSelection(event) {
  const selectedPayment = event.target.value;

  console.log(`Payment method selected: ${selectedPayment}`);

  // CONDITIONAL - Different actions based on payment type
  if (selectedPayment === "debit-card") {
    alert("Debit Card payment selected. Card form will open here.");
  } else if (selectedPayment === "bank-transfer") {
    alert("Bank Transfer selected. Account details will show here.");
  } else if (selectedPayment === "pay-on-delivery") {
    alert("Pay on Delivery selected. No payment needed now!");
  }
}

// FUNCTION 3: Handle change button clicks
function handleChangeButton(event) {
  const buttonText = event.target.textContent;
  alert(`You clicked: ${buttonText}. Edit functionality will be added here.`);
}

// ===================================
// RENDER CART - Display Products Dynamically
// ===================================

// FUNCTION 4: Render cart items to the page
function renderCart() {
  const productItemsContainer = document.querySelector(".product-items");

  // Clear existing content
  productItemsContainer.innerHTML = "";

  // LOOP through cart array and create HTML for each product
  cart.forEach(function (product) {
    // Create product item HTML - DOM Manipulation
    const productHTML = `
      <article class="product-item">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-details">
          <h4 class="product-name">${product.name}</h4>
          <p class="product-quantity">Qty: ${product.quantity}</p>
        </div>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </article>
    `;

    // Add to container - DOM Manipulation
    productItemsContainer.innerHTML += productHTML;
  });

  console.log(`Rendered ${cart.length} products to cart`);
}

// ===================================
// CALCULATE PRICES - Math & Logic
// ===================================

// FUNCTION 5: Calculate subtotal from cart
function calculateSubtotal() {
  let subtotal = 0;

  // LOOP through cart and add up prices
  for (let i = 0; i < cart.length; i++) {
    const itemTotal = cart[i].price * cart[i].quantity;
    subtotal += itemTotal;
  }

  return subtotal;
}

// FUNCTION 6: Calculate tax amount
function calculateTax(subtotal) {
  return subtotal * pricing.taxRate;
}

// FUNCTION 7: Calculate grand total
function calculateTotal(subtotal, deliveryFee, tax) {
  return subtotal + deliveryFee + tax;
}

// FUNCTION 8: Update price display on page
function calculatePrices() {
  // Calculate all values
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, pricing.deliveryFee, tax);

  // Get DOM elements for price display
  const subtotalElement = document.querySelector(
    ".price-row:nth-child(1) .price-value"
  );
  const deliveryElement = document.querySelector(
    ".price-row:nth-child(2) .price-value"
  );
  const taxElement = document.querySelector(
    ".price-row:nth-child(3) .price-value"
  );
  const totalElement = document.querySelector(".price-row.total .price-value");

  // Update DOM with calculated values - DOM Manipulation
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  deliveryElement.textContent = `$${pricing.deliveryFee.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;

  console.log(`Prices calculated - Total: $${total.toFixed(2)}`);
}

// ===================================
// INPUT VALIDATION - Real-time Feedback
// ===================================

// FUNCTION 9: Validate delivery location input
function validateDeliveryInput(event) {
  const input = event.target;
  const value = input.value.trim();

  // CONDITIONAL - Check if input is valid
  if (value.length === 0) {
    setInputError(input, "");
  } else if (value.length < 5) {
    setInputError(input, "Address must be at least 5 characters");
  } else {
    setInputSuccess(input);
  }
}

// FUNCTION 10: Validate phone number input
function validatePhoneInput(event) {
  const input = event.target;
  const value = input.value.trim();

  // Remove non-numeric characters for validation
  const numbersOnly = value.replace(/\D/g, "");

  // CONDITIONAL - Check phone number length
  if (value.length === 0) {
    setInputError(input, "");
  } else if (numbersOnly.length < 10) {
    setInputError(input, "Phone number must be at least 10 digits");
  } else if (numbersOnly.length > 15) {
    setInputError(input, "Phone number is too long");
  } else {
    setInputSuccess(input);
  }
}

// FUNCTION 11: Show error state on input
function setInputError(input, message) {
  input.style.borderColor = "#ff6b35"; // Orange border
  input.style.backgroundColor = "#fff5f0"; // Light orange background

  // Check if error message already exists
  let errorMsg = input.parentElement.querySelector(".error-message");

  if (message) {
    if (!errorMsg) {
      // Create error message element - DOM Manipulation
      errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      errorMsg.style.color = "#ff6b35";
      errorMsg.style.fontSize = "0.875rem";
      errorMsg.style.marginTop = "0.5rem";
      errorMsg.style.display = "block";
      input.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  } else if (errorMsg) {
    errorMsg.remove(); // Remove error message if input is empty
  }
}

// FUNCTION 12: Show success state on input
function setInputSuccess(input) {
  input.style.borderColor = "#6b8e23"; // Green border
  input.style.backgroundColor = "#ffffff"; // White background

  // Remove error message if exists
  const errorMsg = input.parentElement.querySelector(".error-message");
  if (errorMsg) {
    errorMsg.remove();
  }
}

// FUNCTION 13: Validate all inputs before checkout
function validateAllInputs() {
  const deliveryValue = deliveryInput.value.trim();
  const phoneValue = phoneInput.value.trim();

  // Array to store validation errors
  const errors = [];

  // CONDITIONAL - Check each field
  if (deliveryValue.length < 5) {
    errors.push("Please enter a valid delivery address");
  }

  const phoneNumbers = phoneValue.replace(/\D/g, "");
  if (phoneNumbers.length < 10) {
    errors.push("Please enter a valid phone number");
  }

  // Check if payment method is selected
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );
  if (!selectedPayment) {
    errors.push("Please select a payment method");
  }

  // CONDITIONAL - Return validation result
  if (errors.length > 0) {
    // LOOP through errors and display them
    let errorMessage = "Please fix the following errors:\n\n";
    errors.forEach(function (error, index) {
      errorMessage += `${index + 1}. ${error}\n`;
    });
    alert(errorMessage);
    return false;
  }

  return true;
}

// ===================================
// CONSOLE SUMMARY - Display What We Built
// ===================================

// FUNCTION 14: Log summary to console
function logProjectSummary() {
  console.clear(); // Clear console for clean display

  console.log(
    "%c🌾 CROP8HUB - CHECKOUT PAGE 🌾",
    "color: #6b8e23; font-size: 20px; font-weight: bold;"
  );
  console.log("%c========================================", "color: #6b8e23;");

  console.log("\n📋 JAVASCRIPT SKILLS DEMONSTRATED:\n");

  // Array of skills we demonstrated
  const skills = [
    "✅ DOM Manipulation (querySelector, innerHTML, createElement)",
    "✅ Functions (13 reusable functions created)",
    "✅ Arrays (cart array with product objects)",
    "✅ Objects (product objects, pricing object)",
    "✅ Events (click, change, input listeners)",
    "✅ Conditionals (if/else statements for validation)",
    "✅ Loops (forEach, for loop for calculations)",
  ];

  // LOOP through skills array and log each one
  skills.forEach(function (skill) {
    console.log(`  ${skill}`);
  });

  console.log("\n🛒 CART CONTENTS:\n");

  // LOOP through cart and display each product
  cart.forEach(function (product, index) {
    console.log(`  ${index + 1}. ${product.name}`);
    console.log(`     Quantity: ${product.quantity}`);
    console.log(`     Price: $${product.price.toFixed(2)}`);
    console.log(
      `     Subtotal: $${(product.price * product.quantity).toFixed(2)}\n`
    );
  });

  // Display pricing summary
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, pricing.deliveryFee, tax);

  console.log("💰 PRICE SUMMARY:\n");
  console.log(`  Subtotal: $${subtotal.toFixed(2)}`);
  console.log(`  Delivery: $${pricing.deliveryFee.toFixed(2)}`);
  console.log(`  Tax (8%): $${tax.toFixed(2)}`);
  console.log(`  ${"-".repeat(30)}`);
  console.log(
    `  %cTOTAL: $${total.toFixed(2)}`,
    "color: #6b8e23; font-weight: bold; font-size: 16px;"
  );

  console.log("\n🎨 PAGE FEATURES:\n");
  console.log("  ✓ Responsive design (Mobile, Tablet, Desktop)");
  console.log("  ✓ Real-time input validation");
  console.log("  ✓ Dynamic cart rendering");
  console.log("  ✓ Automatic price calculations");
  console.log("  ✓ Payment method selection");
  console.log("  ✓ Semantic HTML structure");
  console.log("  ✓ CSS variables & relative units");

  console.log("\n📱 TRY THESE INTERACTIONS:\n");
  console.log("  1. Type in delivery address (try less than 5 characters)");
  console.log("  2. Enter phone number (watch validation)");
  console.log("  3. Select a payment method");
  console.log("  4. Click the back button");
  console.log("  5. Resize browser to see responsive design");

  console.log(
    "\n%c========================================",
    "color: #6b8e23;"
  );
  console.log(
    "%c🚀 Checkout page ready! Happy coding! 🚀",
    "color: #6b8e23; font-weight: bold;"
  );
  console.log(
    "%c========================================\n",
    "color: #6b8e23;"
  );
}

// Call the summary function when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure everything is loaded
  setTimeout(logProjectSummary, 500);
});

// ===================================
// UTILITY FUNCTIONS - Helper Functions
// ===================================

// FUNCTION 15: Format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// FUNCTION 16: Get selected payment method
function getSelectedPaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');
  return selected ? selected.value : null;
}

// FUNCTION 17: Check if form is complete
function isFormComplete() {
  const hasDelivery = deliveryInput.value.trim().length >= 5;
  const hasPhone = phoneInput.value.replace(/\D/g, "").length >= 10;
  const hasPayment = getSelectedPaymentMethod() !== null;

  return hasDelivery && hasPhone && hasPayment;
}

// ===================================
// EXPOSE FUNCTIONS FOR TESTING (Optional)
// ===================================

// Make functions available in console for testing
window.checkoutApp = {
  cart: cart,
  validateForm: validateAllInputs,
  calculateTotal: function () {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return calculateTotal(subtotal, pricing.deliveryFee, tax);
  },
  isComplete: isFormComplete,
  summary: logProjectSummary,
};

console.log(
  "%cℹ️ Test functions available: window.checkoutApp",
  "color: #666; font-style: italic;"
);

// ===================================
// CONSOLE SUMMARY - Display What We Built
// ===================================

// FUNCTION 14: Log summary to console
function logProjectSummary() {
  console.clear(); // Clear console for clean display

  console.log(
    "%c🌾 CROP8HUB - CHECKOUT PAGE 🌾",
    "color: #6b8e23; font-size: 20px; font-weight: bold;"
  );
  console.log("%c========================================", "color: #6b8e23;");

  console.log("\n📋 JAVASCRIPT SKILLS DEMONSTRATED:\n");

  // Array of skills we demonstrated
  const skills = [
    "✅ DOM Manipulation (querySelector, innerHTML, createElement)",
    "✅ Functions (13 reusable functions created)",
    "✅ Arrays (cart array with product objects)",
    "✅ Objects (product objects, pricing object)",
    "✅ Events (click, change, input listeners)",
    "✅ Conditionals (if/else statements for validation)",
    "✅ Loops (forEach, for loop for calculations)",
  ];

  // LOOP through skills array and log each one
  skills.forEach(function (skill) {
    console.log(`  ${skill}`);
  });

  console.log("\n🛒 CART CONTENTS:\n");

  // LOOP through cart and display each product
  cart.forEach(function (product, index) {
    console.log(`  ${index + 1}. ${product.name}`);
    console.log(`     Quantity: ${product.quantity}`);
    console.log(`     Price: $${product.price.toFixed(2)}`);
    console.log(
      `     Subtotal: $${(product.price * product.quantity).toFixed(2)}\n`
    );
  });

  // Display pricing summary
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, pricing.deliveryFee, tax);

  console.log("💰 PRICE SUMMARY:\n");
  console.log(`  Subtotal: $${subtotal.toFixed(2)}`);
  console.log(`  Delivery: $${pricing.deliveryFee.toFixed(2)}`);
  console.log(`  Tax (8%): $${tax.toFixed(2)}`);
  console.log(`  ${"-".repeat(30)}`);
  console.log(
    `  %cTOTAL: $${total.toFixed(2)}`,
    "color: #6b8e23; font-weight: bold; font-size: 16px;"
  );

  console.log("\n🎨 PAGE FEATURES:\n");
  console.log("  ✓ Responsive design (Mobile, Tablet, Desktop)");
  console.log("  ✓ Real-time input validation");
  console.log("  ✓ Dynamic cart rendering");
  console.log("  ✓ Automatic price calculations");
  console.log("  ✓ Payment method selection");
  console.log("  ✓ Semantic HTML structure");
  console.log("  ✓ CSS variables & relative units");

  console.log("\n📱 TRY THESE INTERACTIONS:\n");
  console.log("  1. Type in delivery address (try less than 5 characters)");
  console.log("  2. Enter phone number (watch validation)");
  console.log("  3. Select a payment method");
  console.log("  4. Click the back button");
  console.log("  5. Resize browser to see responsive design");

  console.log(
    "\n%c========================================",
    "color: #6b8e23;"
  );
  console.log(
    "%c🚀 Checkout page ready! Happy coding! 🚀",
    "color: #6b8e23; font-weight: bold;"
  );
  console.log(
    "%c========================================\n",
    "color: #6b8e23;"
  );
}

// Call the summary function when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure everything is loaded
  setTimeout(logProjectSummary, 500);
});

// ===================================
// UTILITY FUNCTIONS - Helper Functions
// ===================================

// FUNCTION 15: Format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// FUNCTION 16: Get selected payment method
function getSelectedPaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');
  return selected ? selected.value : null;
}

// FUNCTION 17: Check if form is complete
function isFormComplete() {
  const hasDelivery = deliveryInput.value.trim().length >= 5;
  const hasPhone = phoneInput.value.replace(/\D/g, "").length >= 10;
  const hasPayment = getSelectedPaymentMethod() !== null;

  return hasDelivery && hasPhone && hasPayment;
}

// ===================================
// EXPOSE FUNCTIONS FOR TESTING (Optional)
// ===================================

// Make functions available in console for testing
window.checkoutApp = {
  cart: cart,
  validateForm: validateAllInputs,
  calculateTotal: function () {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return calculateTotal(subtotal, pricing.deliveryFee, tax);
  },
  isComplete: isFormComplete,
  summary: logProjectSummary,
};

console.log(
  "%cℹ️ Test functions available: window.checkoutApp",
  "color: #666; font-style: italic;"
);
