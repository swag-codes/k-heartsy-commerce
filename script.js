const products = [
  {
    id: 1,
    name: "Purple Dream Toploader",
    category: "Decoden",
    price: 399,
    description:
      "A dreamy purple decoden photocard toploader decorated with butterflies, pearls, flowers and sparkling charms. Perfect for showcasing your favourite photocards.",
    symbol: "✿",
    label: "HANDMADE",
    image: "k-heartsy-commerce/images/purple-dream-toploader.png",
    theme: "art-purple",
  },
  {
    id: 2,
    name: "Sweetheart Charm",
    category: "Phone Charms",
    price: 249,
    description:
      "A delicate phone charm featuring soft pink and pearl-toned beads with a heart accent. A sweet accessory for your everyday style.",
    symbol: "♡",
    label: "BESTSELLER",
    image: "k-heartsy-commerce/images/sweetheart-charm.png",
    theme: "art-pink",
  },
  {
    id: 3,
    name: "Midnight Star Keychain",
    category: "Keychains",
    price: 299,
    description:
      "A dreamy purple beaded keychain featuring a translucent star charm and silver-tone hardware. Made to add a little sparkle to your bag.",
    symbol: "✧",
    label: "FAN FAVOURITE",
    image: "k-heartsy-commerce/images/midnight-star-keychain.png",
    theme: "art-blue",
  },
];

let cart = JSON.parse(localStorage.getItem("k-heartsy-cart")) || [];
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const resultsMessage = document.querySelector("#results-message");


let toastTimer;

function showToast(message) {
  let toast = document.querySelector("#cart-toast");

  // Create the toast the first time it is needed.
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cart-toast";
    toast.className = "cart-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  // Reset the animation if another product is added.
  clearTimeout(toastTimer);
  toast.classList.remove("show");
  toast.textContent = message;

  // Trigger the entrance animation.
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Hide the toast after 2.5 seconds.
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-art ${product.theme}">
  ${
    product.image
      ? `<img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
        >`
      : `<span class="product-symbol" aria-hidden="true">
          ${product.symbol}
        </span>`
  }

  <span class="product-label">${product.label}</span>
</div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-price">₹${product.price}</p>

        <button class="add-to-cart" data-product-id="${product.id}">
          Add to Bag +
        </button>
      </div>
    </article>
  `,
    )
    .join("");

  resultsMessage.textContent =
    filteredProducts.length === 0
      ? "No products found. Try another search."
      : `${filteredProducts.length} product(s) found`;
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector(".cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="cart-empty">Your bag is empty for now.</p>';
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `₹${item.price} × ${item.quantity}`;

    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "−";
    decreaseButton.dataset.action = "decrease";
    decreaseButton.dataset.productId = item.id;
    decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.dataset.action = "increase";
    increaseButton.dataset.productId = item.id;
    increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.dataset.action = "remove";
    removeButton.dataset.productId = item.id;

    controls.append(decreaseButton, quantity, increaseButton, removeButton);
    const lineTotal = document.createElement("strong");
    lineTotal.textContent = `₹${item.price * item.quantity}`;

    row.append(details, controls, lineTotal);
    cartItems.append(row);
  });

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );


const previousCount = Number(cartCount.textContent);

cartCount.textContent = totalQuantity;
cartSubtotal.textContent = `₹${subtotal}`;

// Animate when the bag quantity changes.
if (previousCount !== totalQuantity) {
  cartCount.classList.remove("animate");

  // Force the browser to restart the animation.
  void cartCount.offsetWidth;

  cartCount.classList.add("animate");
}


  const checkoutButton = document.querySelector("#checkout-button");

  checkoutButton.disabled = cart.length === 0;

  localStorage.setItem("k-heartsy-cart", JSON.stringify(cart));
}

const productModal = document.querySelector("#product-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector("#modal-close");

function openProductModal(product) {
  modalContent.innerHTML = `
    <div class="modal-product">
      <img
        src="${product.image}"
        alt="${product.name}"
      >

      <div>
        <p class="product-category">${product.category}</p>
        <h2>${product.name}</h2>
        <p class="modal-price">₹${product.price}</p>
        <p>
          ${
            product.description ||
            "A handmade accessory created for your collection. A lovely little addition to your everyday style."
          }
        </p>

        <button
          class="add-to-cart"
          type="button"
          data-modal-add="${product.id}"
        >
          Add to Bag +
        </button>
      </div>
    </div>
  `;

  productModal.showModal();
}

productGrid.addEventListener("click", (event) => {
  // Let the existing cart handler handle Add to Bag buttons.
  if (event.target.closest(".add-to-cart")) return;

  const card = event.target.closest(".product-card");
  if (!card) return;

  const productId = Number(card.dataset.productId);
  const product = products.find((item) => item.id === productId);

  if (product) {
    openProductModal(product);
  }
});

modalClose.addEventListener("click", () => {
  productModal.close();
});

productModal.addEventListener("click", (event) => {
  // Close if the user clicks the dark backdrop.
  if (event.target === productModal) {
    productModal.close();
  }
});

productModal.addEventListener("click", (event) => {
  const button = event.target.closest("[data-modal-add]");
  if (!button) return;

  const productId = Number(button.dataset.modalAdd);
  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
productModal.close();

showToast(`♡ ${product.name} added to your bag`);
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");

  if (!button) return;

  const productId = Number(button.dataset.productId);
  const selectedProduct = products.find((product) => product.id === productId);

  if (!selectedProduct) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  renderCart();

showToast(`♡ ${selectedProduct.name} added to your bag`);
});

renderProducts();
renderCart();

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;

  const item = cart.find((product) => product.id === productId);

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter((product) => product.id !== productId);
    }
  } else if (action === "remove") {
    cart = cart.filter((product) => product.id !== productId);
  }

  renderCart();
});


const checkoutButton = document.querySelector("#checkout-button");
const checkoutModal = document.querySelector("#checkout-modal");
const checkoutItems = document.querySelector("#checkout-items");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutClose = document.querySelector("#checkout-close");
const placeDemoOrder = document.querySelector("#place-demo-order");
const continueShopping = document.querySelector("#continue-shopping");

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) return;

  checkoutItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} × ${item.quantity}</span>
      <strong>₹${item.price * item.quantity}</strong>
    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  checkoutTotal.textContent = `₹${total}`;
  checkoutModal.showModal();
});

checkoutClose.addEventListener("click", () => {
  checkoutModal.close();
});


placeDemoOrder.addEventListener("click", () => {
  if (cart.length === 0) return;

  // Clear the shopping bag.
  cart = [];
  renderCart();

  // Show confirmation inside the checkout modal.
  checkoutItems.innerHTML = `
    <p>Thank you for trying the K-Heartsy demo!</p>
    <p>Your demo order has been completed successfully.</p>
  `;

  checkoutTotal.textContent = "₹0";

  // Update the button to confirm completion.
  placeDemoOrder.textContent = "Demo Order Complete";
  placeDemoOrder.disabled = true;
  continueShopping.hidden = false;
});

continueShopping.addEventListener("click", () => {
  checkoutModal.close();
  continueShopping.hidden = true;

  placeDemoOrder.disabled = false;
  placeDemoOrder.textContent = "Place Demo Order";

  document.querySelector("#shop").scrollIntoView({
    behavior: "smooth"
  });
});

