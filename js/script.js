/* ============================================
   CORA GLOBAL SOLUTIONS - MAIN SCRIPT
   ============================================ */

// ========== SCROLL REVEAL FUNCTIONALITY ==========

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all reveal elements
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(element => observer.observe(element));
  
  // Initialize navbar scroll effect
  initializeNavbar();
  
  // Initialize animations
  addAnimationDelays();
});

// ========== NAVBAR SCROLL EFFECT ==========

function initializeNavbar() {
  const nav = document.querySelector('nav');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ========== ADD ANIMATION DELAYS ==========

function addAnimationDelays() {
  const cards = document.querySelectorAll('.service-card, .testimonial-card, .blog-card');
  cards.forEach((card, index) => {
    card.style.setProperty('--index', index);
  });
  
  const stats = document.querySelectorAll('.stat');
  stats.forEach((stat, index) => {
    stat.style.setProperty('--index', index);
  });
  
  const formGroups = document.querySelectorAll('.form-group');
  formGroups.forEach((group, index) => {
    group.style.setProperty('--index', index);
  });
}

// ========== SMOOTH SCROLL ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== LAZY LOADING IMAGES ==========

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========== MOBILE MENU TOGGLE ==========

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// ========== UTILITY: SHOW NOTIFICATION ==========

function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.animation = 'slideInLeft 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// ========== UTILITY: CLOSE MODAL ==========

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ========== SCROLL COUNTERS ==========

function startCountUp(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const counter = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Trigger counters when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(num => {
        const target = parseInt(num.textContent);
        startCountUp(num, target);
      });
      entry.target.classList.add('counted');
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
  // Press 'C' to open chat
  if (e.key === 'c' || e.key === 'C') {
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
      chatButton.click();
    }
  }
  
  // Press 'Escape' to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
  }
});

// ========== UTILITY: FORMAT PHONE NUMBER ==========

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 0) {
    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
      value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
    }
  }
  
  input.value = value;
}

// ========== PREVENT FORM DOUBLE SUBMISSION ==========

function preventDoubleSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
  });
}

// Apply to all forms
document.querySelectorAll('form').forEach(form => {
  preventDoubleSubmit(form);
});

// ========== ACCESSIBILITY: SKIP TO MAIN CONTENT ==========

const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
`;

skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});

document.body.prepend(skipLink);

// ========== DEBUG MODE ==========

window.CORA_DEBUG = false;

function debugLog(...args) {
  if (window.CORA_DEBUG) {
    console.log('[CORA DEBUG]', ...args);
  }
}

// Enable debug with: localStorage.setItem('CORA_DEBUG', 'true');
if (localStorage.getItem('CORA_DEBUG') === 'true') {
  window.CORA_DEBUG = true;
  console.log('🐛 CORA Debug Mode Enabled');
}
