const marketDefaults = [
  { id: 'adv-001', name: 'Cripta do Rei Sem Nome', category: 'Aventura', price: 29, rating: 4.9, description: 'One-shot sombria para nível 3 com ganchos, encontros, tesouros e final alternativo.' },
  { id: 'map-001', name: 'Ruínas Afogadas de Amn', category: 'Mapa', price: 19, rating: 4.8, description: 'Pacote de mapas para cidade costeira, esgoto, docas e templo submerso.' },
  { id: 'tok-001', name: 'Tokens de Goblinoides Premium', category: 'Token', price: 15, rating: 4.7, description: 'Conjunto de tokens para goblins, hobgoblins, chefes tribais e xamãs.' },
  { id: 'fry-001', name: 'Bundle Foundry: Taverna Maldita', category: 'Foundry', price: 39, rating: 5.0, description: 'Estrutura pronta para importar cenas, atores, notas e encontros no Foundry.' }
];

const getProducts = () => JSON.parse(localStorage.getItem('mo_market_products') || 'null') || marketDefaults;
const setProducts = (products) => localStorage.setItem('mo_market_products', JSON.stringify(products));
const getCart = () => JSON.parse(localStorage.getItem('mo_market_cart') || '[]');
const setCart = (cart) => localStorage.setItem('mo_market_cart', JSON.stringify(cart));

function money(value){ return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

function renderProducts(filter = 'todos'){
  const grid = document.querySelector('#marketplaceGrid');
  if(!grid) return;
  const products = getProducts().filter(item => filter === 'todos' || item.category === filter);
  grid.innerHTML = products.map(item => `
    <article class="market-card">
      <div class="market-badge">${item.category}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="market-card-meta"><span>⭐ ${item.rating || 'Novo'}</span><strong>${money(item.price)}</strong></div>
      <button class="btn-cta btn-cta-primary small-action" data-buy="${item.id}">Adicionar</button>
    </article>`).join('');
}

function renderCart(){
  const cartBox = document.querySelector('#cartList');
  const totalBox = document.querySelector('#cartTotal');
  if(!cartBox || !totalBox) return;
  const products = getProducts();
  const cart = getCart();
  const items = cart.map(id => products.find(p => p.id === id)).filter(Boolean);
  cartBox.innerHTML = items.length ? items.map(item => `<div class="cart-item"><span>${item.name}</span><strong>${money(item.price)}</strong></div>`).join('') : '<p class="empty-state">Nenhum item adicionado ainda.</p>';
  totalBox.textContent = money(items.reduce((sum, item) => sum + Number(item.price), 0));
}

document.addEventListener('click', (event) => {
  const filter = event.target.closest('[data-filter]');
  if(filter){
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    filter.classList.add('active');
    renderProducts(filter.dataset.filter);
  }
  const buy = event.target.closest('[data-buy]');
  if(buy){ setCart([...getCart(), buy.dataset.buy]); renderCart(); }
});

document.querySelector('#productForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  const products = getProducts();
  products.unshift({ id: `custom-${Date.now()}`, name: data.name, category: data.category, price: Number(data.price), rating: 'Novo', description: data.description });
  setProducts(products);
  event.target.reset();
  renderProducts(document.querySelector('.filter-pill.active')?.dataset.filter || 'todos');
});

document.querySelector('#clearCart')?.addEventListener('click', () => { setCart([]); renderCart(); });

renderProducts();
renderCart();


document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-api-checkout]');
  if (!button) return;
  event.preventDefault();
  const productId = button.dataset.apiCheckout;
  if (window.MestreOrcPayments && productId) await MestreOrcPayments.checkoutProduct(productId);
});
