'use strict';

const WA_NUMBER = '2348114550145';

// ── PRODUCT DATA ──────────────────────────────────────────
const products = [
  { id:1, category:'laptop', brand:'HP', name:'Elitebook 840 G6', price:485000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780627919/840_G6_gxjryc.jpg', specs:{cpu:'Elitebook 840 G6',ram:'16GB',storage:'256GB SSD',display:'14" Liquid Retina XDR',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'hot' },
  { id:2, category:'laptop', brand:'HP', name:'HP Revolve 810 G2', price:250000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780628167/hp_revolve_seebqb.jpg', specs:{cpu:'Intel Core i5-12700H',ram:'8GB',storage:'256GB SSD',display:'15.6" OLED Touch',condition:'UK Used'}, condition:'UK Used', stock:'Limited Stock', badge:'used' },
  { id:3, category:'laptop', brand:'HP', name:'HP EliteBook 840 G3', price:265000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780628496/G3_l5acuq.jpg', specs:{cpu:'Intel Core i5-1235U',ram:'8GB',storage:'256GB SSD',display:'14" FHD IPS',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'used' },
  { id:4, category:'laptop', brand:'HP', name:'HP Probook 11 G1 ', price:155000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780660797/11g1_vkurk0.jpg', specs:{cpu:'Intel pentium',ram:'8GB',storage:'128GB SSD',display:'11" ',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'used' },
  { id:5, category:'laptop', brand:'Lenovo', name:'Lenovo Ideapad', price:220000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780660911/lenovo_eowxmr.jpg', specs:{cpu:'Intel Core i5-1255U',ram:'4GB',storage:'128GB SSD',display:'13.5" OLED 2-in-1',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'new' },
  { id:6, category:'laptop', brand:'Dell', name:'Dell Latitude 7490', price:455000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780661218/7490_xkzs59.jpg', specs:{cpu:'Intel Core i5-1145G7',ram:'16GB',storage:'256GB SSD',display:'14" FHD',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'used' },
  { id:7, category:'phone', brand:'Apple', name:'iPhone XR', price:172000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780661428/XR_fhmz9r.jpg', specs:{cpu:'Apple A17 Pro',ram:'4GB',storage:'128GB',display:'6.7" Super Retina XDR',condition:'UK USED'}, condition:'UK USED', stock:'Limited Stock', badge:'hot' },
  { id:8, category:'phone', brand:'Samsung', name:'Galaxy S8PLUS', price:90000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780661647/S8PLUS_p7qxhp.jpg', specs:{cpu:'Snapdragon 8 Gen 3',ram:'4GB',storage:'64GB',display:'6.8" Dynamic AMOLED',condition:'UK USED'}, condition:'UK USED', stock:'In Stock', badge:'used' },
  { id:9, category:'laptop', brand:'Apple', name:'MacBook pro 2017', price:450000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780661922/macbook_pro_2017_leczzp.jpg', specs:{cpu:'Apple A15 Bionic',ram:'8GB',storage:'256GB',display:'6.1" Super Retina XDR',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'hot' },
  { id:10, category:'phone', brand:'Apple', name:'Iphone 12 ProMax', price:500000, image:'https://res.cloudinary.com/da7jzmy2g/image/upload/v1780662136/iphone_12_pro_max_fplaha.jpg', specs:{cpu:'N/A',ram:'N/A',storage:'N/A',display:'N/A',condition:'UK Used'}, condition:'UK Used', stock:'In Stock', badge:'hot' }
];

// ── STATE ──────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('hok_cart') || '[]');

// ── UTILS ──────────────────────────────────────────────────
const fmt = n => '₦' + n.toLocaleString('en-NG');
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

function saveCart() { localStorage.setItem('hok_cart', JSON.stringify(cart)); }

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

function stockClass(s) { return {InStock:'s-in','LimitedStock':'s-ltd','OutofStock':'s-out'}[s.replace(/\s/g,'')] || 's-in'; }
function badgeClass(b) { return {hot:'b-hot',new:'b-new',used:'b-used'}[b] || 'b-new'; }
function badgeLabel(b) { return {hot:'Hot',new:'New',used:'UK Used'}[b] || b; }

// ── BUILD CARD HTML (shared between pages) ─────────────────
function buildProductCard(p, i) {
  const specsText = [p.specs.cpu, p.specs.ram, p.specs.storage]
    .filter(v => v && v !== 'N/A').join(' · ');
  return `
    <div class="product-card reveal" style="transition-delay:${i*0.04}s" data-id="${p.id}">
      <div class="p-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="p-badge ${badgeClass(p.badge)}">${badgeLabel(p.badge)}</span>` : ''}
        <span class="p-stock ${stockClass(p.stock)}">${p.stock}</span>
      </div>
      <div class="p-info">
        <div class="p-brand">${p.brand}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-specs">${specsText}</div>
        <div class="p-footer">
          <div class="p-price">${fmt(p.price)}</div>
          <div class="p-actions">
            <button class="btn-cart" onclick="addToCart(${p.id},event)" ${p.stock==='Out of Stock'?'disabled':''}>+ Cart</button>
            <button class="btn-wa-icon" onclick="buyNowWA(${p.id},event)" title="Buy via WhatsApp">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.852L.054 23.447a.5.5 0 00.61.61l5.595-1.478A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.031-1.385l-.36-.214-3.733.985.997-3.617-.235-.372A9.808 9.808 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function attachCardEvents(container) {
  if (!container) return;
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      openProductModal(parseInt(card.dataset.id));
    });
  });
}

// ── CART ───────────────────────────────────────────────────
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 'Out of Stock') return;
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty += 1;
  else cart.push({ id:p.id, name:p.name, price:p.price, image:p.image, qty:1 });
  saveCart(); updateCartUI();
  showToast(`Added: ${p.name}`);
  bumpCount();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartUI(); renderCartItems();
}

function updateQuantity(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); updateCartUI(); renderCartItems();
}

function calcTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const cc = document.getElementById('cartCount');
  const chc = document.getElementById('cartHeaderCount');
  const ct = document.getElementById('cartTotal');
  const cf = document.getElementById('cartFooter');
  const ce = document.getElementById('cartEmpty');
  if (cc) cc.textContent = count;
  if (chc) chc.textContent = count > 0 ? `(${count})` : '';
  if (ct) ct.textContent = fmt(calcTotal());
  if (cf) cf.style.display = cart.length > 0 ? 'flex' : 'none';
  if (ce) ce.style.display = cart.length === 0 ? 'block' : 'none';
}

function bumpCount() {
  const el = document.getElementById('cartCount');
  if (!el) return;
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 300);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty" id="cartEmpty"><span>🛒</span><p>Your cart is empty</p><a href="products.html">Browse Products</a></div>`;
    return;
  }
  container.innerHTML = `<div id="cartEmpty" style="display:none"></div>` + cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${fmt(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id},1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>`).join('');
}

function openCartDrawer() {
  renderCartItems(); updateCartUI();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── CHECKOUT ───────────────────────────────────────────────
function checkoutWhatsApp() {
  if (!cart.length) return;
  const lines = cart.map(i => `• ${i.name} x${i.qty} = ${fmt(i.price*i.qty)}`).join('\n');
  const msg = `Hello HOK Computers, I want to purchase:\n\n${lines}\n\n*Total: ${fmt(calcTotal())}*\n\nPlease confirm availability.`;
  window.open(waLink(msg), '_blank');
}

function buyNowWA(id, e) {
  if (e) e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p) return;
  window.open(waLink(`Hello HOK Computers, I want to buy: *${p.name}* at *${fmt(p.price)}*. Please confirm availability.`), '_blank');
}

// ── INSTALLMENT ────────────────────────────────────────────
function showInstallmentModal() {
  document.getElementById('installmentOverlay').classList.add('open');
  document.getElementById('installmentModal').classList.add('open');
}
function closeInstallmentModal() {
  document.getElementById('installmentOverlay').classList.remove('open');
  document.getElementById('installmentModal').classList.remove('open');
}
function submitInstallment() {
  const name = document.getElementById('instName').value.trim();
  const phone = document.getElementById('instPhone').value.trim();
  const dur = document.getElementById('instDuration').value;
  const dep = document.getElementById('instDeposit').value.trim();
  if (!name || !phone) { showToast('Please fill in name and phone.'); return; }
  if (!cart.length) { showToast('Your cart is empty.'); return; }
  const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  const msg = `Hello HOK Computers, installment request:\n\n*Items:* ${items}\n*Total:* ${fmt(calcTotal())}\n*Duration:* ${dur}${dep?`\n*Deposit:* ${dep}`:''}\n\n*Name:* ${name}\n*Phone:* ${phone}`;
  window.open(waLink(msg), '_blank');
  closeInstallmentModal();
}

// ── PRODUCT MODAL ──────────────────────────────────────────
function openProductModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const specs = Object.entries(p.specs)
    .filter(([,v]) => v && v !== 'N/A')
    .map(([k,v]) => `<div class="modal-spec-row"><span>${k.charAt(0).toUpperCase()+k.slice(1)}</span><span>${v}</span></div>`)
    .join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img"><img src="${p.image}" alt="${p.name}" /></div>
    <div class="modal-info">
      <div class="modal-brand">${p.brand}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-price">${fmt(p.price)}</div>
      <span class="p-stock ${stockClass(p.stock)}" style="display:inline-block">${p.stock}</span>
      <div class="modal-specs">${specs}</div>
      <div class="modal-actions">
        <button class="btn-primary" style="justify-content:center;border:none;cursor:pointer;width:100%" onclick="addToCart(${p.id});closeProductModal()">+ Add to Cart</button>
        <a href="${waLink(`Hello HOK Computers, I want to buy: *${p.name}* at *${fmt(p.price)}*. Please confirm.`)}" target="_blank" class="btn-wa" style="justify-content:center">Buy via WhatsApp</a>
      </div>
    </div>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── REPAIR ─────────────────────────────────────────────────
function submitRepair() {
  const name = document.getElementById('repairName')?.value.trim();
  const phone = document.getElementById('repairPhone')?.value.trim();
  const device = document.getElementById('repairDevice')?.value;
  const problem = document.getElementById('repairProblem')?.value.trim();
  if (!name || !phone || !device || !problem) { showToast('Please fill in all fields.'); return; }
  const msg = `Hello HOK Computers, repair request:\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Device:* ${device}\n*Problem:* ${problem}`;
  window.open(waLink(msg), '_blank');
  ['repairName','repairPhone','repairProblem'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  document.getElementById('repairDevice').value = '';
  showToast('Repair request sent!');
}

// ── THEME ──────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('hok_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('hok_theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(t) {
  const el = document.querySelector('.theme-icon');
  if (el) el.textContent = t === 'dark' ? '☀️' : '🌙';
}

// ── SCROLL REVEAL ──────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── NAVBAR ─────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
  if (navLinks) navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('mobile-open')));
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  updateCartUI();

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const cartBtn = document.getElementById('cartToggle');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

  const closeCart = document.getElementById('closeCart');
  if (closeCart) closeCart.addEventListener('click', closeCartDrawer);

  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  const closeModal = document.getElementById('closeModal');
  if (closeModal) closeModal.addEventListener('click', closeProductModal);

  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.addEventListener('click', closeProductModal);

  const instOverlay = document.getElementById('installmentOverlay');
  if (instOverlay) instOverlay.addEventListener('click', closeInstallmentModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCartDrawer(); closeProductModal(); closeInstallmentModal(); }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});

