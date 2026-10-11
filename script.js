
const products = [
  {
    id: 1,
    name: "Purple Dream Toploader",
    category: "Decoden",
    price: 399,
    symbol: "✿",
    label: "HANDMADE",
    theme: "art-purple"
  },
  {
    id: 2,
    name: "Sweetheart Charm",
    category: "Phone Charms",
    price: 249,
    symbol: "♡",
    label: "BESTSELLER",
    theme: "art-pink"
  },
  {
    id: 3,
    name: "Midnight Star Keychain",
    category: "Keychains",
    price: 299,
    symbol: "✧",
    label: "FAN FAVOURITE",
    theme: "art-blue"
  }
];


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
        <span class="product-symbol" aria-hidden="true">
          ${product.symbol}
        </span>
        <span class="product-label">${product.label}</span>
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-price">₹${product.price}</p>
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

renderProducts();
