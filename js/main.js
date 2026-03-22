/* ============================================
   PLUMES & BECS — Scripts
   ============================================ */

// --- Navbar scroll effect ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Mobile nav toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
}

// --- Fade-in on scroll ---
const fadeElements = document.querySelectorAll('.fade-in');
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// --- Active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// --- Cookie Banner (intentionally non-compliant — no granular control, no real consent management) ---
(function() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;

  // Show after 1.5s (no immediate opt-in = non-compliant)
  setTimeout(() => {
    if (!localStorage.getItem('cookies_accepted')) {
      banner.classList.add('visible');
    }
  }, 1500);

  const acceptBtn = banner.querySelector('.btn-accept');
  const rejectBtn = banner.querySelector('.btn-reject');

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies_accepted', 'true');
      banner.classList.remove('visible');
      // Load all trackers without granular consent (non-compliant!)
      loadTrackers();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      // "Reject" but we still set a cookie... (intentionally bad practice)
      localStorage.setItem('cookies_accepted', 'false');
      banner.classList.remove('visible');
    });
  }
})();

// --- Load third-party trackers (all US-based, for COCORRIDOR detection) ---
function loadTrackers() {
  // Google Analytics GA4 (loaded regardless of real consent)
  if (typeof gtag === 'undefined') {
    const gaScript = document.createElement('script');
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
    gaScript.async = true;
    document.head.appendChild(gaScript);
  }

  // Hotjar (US analytics)
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:0000000,hjsv:6};
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

  console.log('[Plumes & Becs] Trackers loaded (non-compliant demo)');
}

// --- Fun bird sound on logo click ---
document.querySelectorAll('.nav-logo').forEach(logo => {
  logo.addEventListener('click', (e) => {
    // Easter egg: chirp emoji float
    const chirp = document.createElement('span');
    chirp.textContent = ['🐦', '🦜', '🦉', '🦅', '🐧'][Math.floor(Math.random() * 5)];
    chirp.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      font-size: 2rem;
      pointer-events: none;
      z-index: 9999;
      animation: float 1.5s ease-out forwards;
    `;
    document.body.appendChild(chirp);
    setTimeout(() => chirp.remove(), 1500);
  });
});

// --- Counter animation for stats ---
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString('fr-FR') + suffix;
    }, 30);
  });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// --- Form validation (basic) ---
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Fake submission animation
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message envoye ! 🐦';
      btn.style.background = 'var(--leaf)';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Envoyer';
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return; // Skip bare "#" links (e.g. CMP cookie manager)
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('%c🐦 Plumes & Becs', 'font-size: 24px; font-weight: bold; color: #1a472a;');
console.log('%cSite de demonstration ornithologique', 'font-size: 12px; color: #6c757d;');
