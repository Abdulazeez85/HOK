// Filter tabs
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.querySelector('.contact-form');

const filterProducts = (brand) => {
  productCards.forEach(card => {
    const cardBrand = card.dataset.brand;
    const isVisible = brand === 'All' || cardBrand === brand;
    card.style.display = isVisible ? '' : 'none';
  });
};

filterTabs.forEach(tab => {
  tab.addEventListener('click', function() {
    filterTabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    filterProducts(this.textContent.trim());
    if (navLinks?.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileMenu?.classList.remove('open');
    }
  });
});

mobileMenu?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('.btn-submit');
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    submitButton.textContent = 'Message Sent!';
    submitButton.disabled = true;
    setTimeout(() => {
      submitButton.textContent = 'Send Message 🚀';
      submitButton.disabled = false;
      contactForm.reset();
    }, 2200);
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