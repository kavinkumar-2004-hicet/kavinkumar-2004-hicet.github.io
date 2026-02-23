// ========== IMPORTS ==========
import Lenis from 'https://unpkg.com/lenis@1.1.18/dist/lenis.mjs';

// ========== LENIS SMOOTH SCROLL ==========
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easeOut
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ========== THEME ==========
const themeToggle = document.querySelectorAll('.theme-toggle');
const html = document.documentElement;
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');

const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.forEach(btn => {
  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});

// ========== MOBILE NAV ==========
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('nav-is-open');
});

document.querySelectorAll('.mobile-menu-links a, .nav-links-desktop a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('nav-is-open');
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    }
  });
});

// ========== SCROLL PROGRESS BAR ==========
const scrollProgress = document.getElementById('scrollProgress');
lenis.on('scroll', ({ progress }) => {
  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${progress})`;
  }
});

// ========== NAV HIDE ON SCROLL ==========
let lastScroll = 0;
const nav = document.querySelector('.nav');

lenis.on('scroll', ({ scroll }) => {
  if (scroll <= 0) {
    nav.style.transform = 'translateY(0)';
  } else if (scroll > lastScroll && scroll > 100) {
    nav.style.transform = 'translateY(-100%)';
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('nav-is-open');
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScroll = scroll;
});

// ========== SCROLL REVEAL OBSERVER ==========
const revealClasses = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'reveal-blur'];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Don't unobserve — keeps the animation one-way (no flicker)
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all reveal elements
revealClasses.forEach(cls => {
  document.querySelectorAll('.' + cls).forEach(el => {
    revealObserver.observe(el);
  });
});

// ========== STAGGERED CARD REVEALS ==========
// Cards that should animate with stagger within their grid
const cardSelectors = [
  { container: '.skills-grid', cards: '.skill-card' },
  { container: '.projects-grid', cards: '.project-card' },
  { container: '.career-content', cards: '.career-card' },
  { container: '.timeline', cards: '.timeline-item' },
];

cardSelectors.forEach(({ container, cards }) => {
  const containerEl = document.querySelector(container);
  if (!containerEl) return;

  const cardEls = containerEl.querySelectorAll(cards);
  cardEls.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
  });

  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cardEls.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        gridObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  gridObserver.observe(containerEl);
});

// ========== SECTION HEADER PARALLAX ==========
const sectionHeaders = document.querySelectorAll('.section-header .section-title, .cta-title');
lenis.on('scroll', () => {
  sectionHeaders.forEach(header => {
    const rect = header.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.top < windowH && rect.bottom > 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const yOffset = (progress - 0.5) * -30; // subtle parallax
      header.style.transform = `translateY(${yOffset}px)`;
    }
  });
});

// ========== MAGNETIC BUTTON EFFECT ==========
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    btn.style.transition = 'transform 0.2s ease';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});
