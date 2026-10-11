
const products = [
  {
    id: 1,
    name: "Purple Dream Toploader",
    category: "Decoden",
    price: 399,
    symbol: "✿",
    label: "HANDMADE",
    image: "k-heartsy-commerce/images/purple-dream-toploader.png",
    theme: "art-purple"
  },
  {
    id: 2,
    name: "Sweetheart Charm",
    category: "Phone Charms",
    price: 249,
    symbol: "♡",
    label: "BESTSELLER",
    image: "k-heartsy-commerce/images/sweetheart-charm.png",
    theme: "art-pink"
  },
  {
    id: 3,
    name: "Midnight Star Keychain",
    category: "Keychains",
    price: 299,
    symbol: "✧",
    label: "FAN FAVOURITE",
    image: "k-heartsy-commerce/images/midnight-star-keychain.png",
    theme: "art-blue"
  }
];


let cart = JSON.parse(localStorage.getItem("k-heartsy-cart")) || [];
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#product-search");
const categoryFilter = document.querySelector("#category-filter");
const resultsMessage = document.querySelector("#results-message");

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
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
  `).join("");

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
    cartItems.innerHTML = '<p class="cart-empty">Your bag is empty for now.</p>';
  }

  cart.forEach(item => {
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

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;
  cartSubtotal.textContent = `₹${subtotal}`;
  localStorage.setItem("k-heartsy-cart", JSON.stringify(cart));
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-to-cart");

  if (!button) return;

  const productId = Number(button.dataset.productId);
  const selectedProduct = products.find(product => product.id === productId);

  if (!selectedProduct) return;

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  renderCart();
});

renderProducts();
renderCart();

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;

  const item = cart.find(product => product.id === productId);

  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== productId);
    }
  } else if (action === "remove") {
    cart = cart.filter(product => product.id !== productId);
  }

  renderCart();
});