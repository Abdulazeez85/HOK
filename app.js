// Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    filterTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// Cart button feedback
const cartButtons = document.querySelectorAll('.btn-cart');
cartButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    this.textContent = '✅';
    this.style.background = 'var(--green)';
    this.style.color = 'var(--white)';
    setTimeout(() => {
      this.textContent = '🛒';
      this.style.background = '';
      this.style.color = '';
    }, 1500);
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .product-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});