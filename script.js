
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

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
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
}

renderProducts();
