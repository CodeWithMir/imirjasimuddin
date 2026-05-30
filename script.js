/* ═══════════════════════════════════════════════════════════════════════
   SCRIPT.JS — Mir Jasimuddin Portfolio
   Handles: scroll progress, theme, hamburger menu, active nav,
            reveal animations, counters, typing effect, project filter,
            contact form
═══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   CONSTANTS & CACHED ELEMENTS
────────────────────────────────────────── */
const html          = document.documentElement;
const progressBar   = document.getElementById('progress-bar');
const themeToggle   = document.getElementById('themeToggle');
const menuToggle    = document.getElementById('menuToggle');
const mobileMenu    = document.getElementById('mobileMenu');
const backTop       = document.getElementById('backTop');
const contactForm   = document.getElementById('contactForm');
const submitBtn     = document.getElementById('submitBtn');
const submitText    = document.getElementById('submitText');
const successMsg    = document.getElementById('successMsg');
const typeTarget    = document.getElementById('typeTarget');
const navTabs       = document.querySelectorAll('.nav-tab');
const mobileTabs    = document.querySelectorAll('.mobile-tab');
const allNavLinks   = document.querySelectorAll('.nav-tab, .mobile-tab');
const filterBtns    = document.querySelectorAll('.pf');
const projCards     = document.querySelectorAll('.proj-card');
const revealEls     = document.querySelectorAll('.reveal');
const sections      = document.querySelectorAll('section[id]');
const statNums      = document.querySelectorAll('.stat-n[data-count]');
const heroDownload  = document.querySelectorAll('.dl-btn');

/* ──────────────────────────────────────────
   1. SCROLL PROGRESS BAR
────────────────────────────────────────── */
function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const pct      = total > 0 ? (scrolled / total) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
}

/* ──────────────────────────────────────────
   2. BACK TO TOP BUTTON
────────────────────────────────────────── */
function updateBackTop() {
  if (!backTop) return;
  if (window.scrollY > 420) {
    backTop.classList.add('show');
  } else {
    backTop.classList.remove('show');
  }
}

if (backTop) {
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────
   3. PASSIVE SCROLL HANDLER
────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  updateProgress();
  updateBackTop();
}, { passive: true });

/* Run once on load */
updateProgress();
updateBackTop();

/* ──────────────────────────────────────────
   4. DARK / LIGHT THEME TOGGLE
────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('mj-theme') || 'light';
  html.dataset.theme = saved;
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('mj-theme', html.dataset.theme);
  });
}

/* ──────────────────────────────────────────
   5. HAMBURGER MENU (THREE BARS)
────────────────────────────────────────── */
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  menuToggle.classList.add('is-open');
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
  menuOpen = false;
  menuToggle.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

/* ──────────────────────────────────────────
   6. SMOOTH SCROLL FOR ALL # LINKS
────────────────────────────────────────── */
function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const navHeight = document.getElementById('site-header')?.offsetHeight || 64;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const id = href.slice(1);
    if (document.getElementById(id)) {
      e.preventDefault();
      smoothScrollTo(id);
      /* Close mobile menu if open */
      if (menuOpen) closeMenu();
    }
  });
});

/* ──────────────────────────────────────────
   7. ACTIVE NAV HIGHLIGHT ON SCROLL
      Uses IntersectionObserver on each section
────────────────────────────────────────── */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allNavLinks.forEach(link => {
          const matches = link.getAttribute('data-section') === id;
          link.classList.toggle('active', matches);
        });
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: '-64px 0px -45% 0px',
  }
);

sections.forEach(section => navObserver.observe(section));

/* ──────────────────────────────────────────
   8. REVEAL ON SCROLL (Intersection Observer)
────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
      /* Trigger counters inside revealed elements */
      entry.target.querySelectorAll('[data-count]').forEach(el => triggerCounter(el));
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -32px 0px',
  }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────
   9. COUNTER ANIMATION
────────────────────────────────────────── */
const countedEls = new WeakSet();

function triggerCounter(el) {
  if (countedEls.has(el)) return;
  countedEls.add(el);
  animateCount(el);
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = target >= 100 ? '' : '+';
  const duration = 1400;
  let start      = null;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value    = Math.floor(easeOutCubic(progress) * target);
    el.textContent = value + (progress < 1 ? '' : suffix);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* Trigger hero stat counters after a short delay (they're always visible on load) */
window.addEventListener('load', () => {
  setTimeout(() => {
    statNums.forEach(el => triggerCounter(el));
  }, 500);
});

/* ──────────────────────────────────────────
   10. TYPING EFFECT
────────────────────────────────────────── */
const phrases = [
  'Senior UiPath RPA Developer @ Capgemini',
  'Building Coded Agents with C# SDK',
  'Integrating Claude Code with UiPath',
  'Maestro Case Management Expert',
  'Terminal & CLI Automation',
  'External API Integration Hub',
  'UiPath Agentic AI Specialist',
  '5× UiPath Forum Rewards Winner',
];

let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
let isPaused     = false;

const TYPE_SPEED   = 55;   /* ms per character when typing   */
const DELETE_SPEED = 28;   /* ms per character when deleting */
const PAUSE_AFTER  = 2000; /* ms to wait at end of phrase    */

function type() {
  if (!typeTarget) return;
  if (isPaused) return;

  const phrase = phrases[phraseIndex];

  if (!isDeleting) {
    charIndex++;
    typeTarget.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      isPaused = true;
      setTimeout(() => { isPaused = false; isDeleting = true; }, PAUSE_AFTER);
    }
  } else {
    charIndex--;
    typeTarget.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
  setTimeout(type, delay);
}

if (typeTarget) {
  setTimeout(type, 800);
}

/* ──────────────────────────────────────────
   11. PROJECT FILTER
────────────────────────────────────────── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Update active state */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const visible = filter === 'all' || tags.includes(filter);
      card.classList.toggle('hidden', !visible);
    });
  });
});

/* ──────────────────────────────────────────
   12. CONTACT FORM — MAILTO HANDLER
────────────────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic HTML5 validation */
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    submitBtn.disabled   = true;
    submitText.textContent = 'Sending…';

    const data    = new FormData(contactForm);
    const name    = `${data.get('first_name')} ${data.get('last_name')}`.trim();
    const email   = data.get('email')   || '';
    const company = data.get('company') || '—';
    const phone   = data.get('phone')   || '—';
    const reason  = data.get('reason')  || '';
    const subject = data.get('subject') || 'Portfolio Contact';
    const message = data.get('message') || '';

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `Phone: ${phone}`,
      `Reason: ${reason}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const mailto = `mailto:i.mir.jasim.uddin@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    /* Show success state after short delay */
    setTimeout(() => {
      contactForm.style.display = 'none';
      successMsg.classList.add('show');
    }, 900);
  });
}

/* ──────────────────────────────────────────
   13. KEYBOARD ACCESSIBILITY
────────────────────────────────────────── */
/* Allow Enter/Space to activate filter buttons */
filterBtns.forEach(btn => {
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

/* ──────────────────────────────────────────
   14. PREFETCH HINTS ON HOVER (performance)
────────────────────────────────────────── */
heroDownload.forEach(link => {
  link.addEventListener('mouseover', () => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hint = document.createElement('link');
    hint.rel  = 'prefetch';
    hint.href = href;
    document.head.appendChild(hint);
  }, { once: true });
});

/* ──────────────────────────────────────────
   15. INIT LOG (dev helper, remove in prod)
────────────────────────────────────────── */
// console.log('%c MJ Portfolio Loaded ', 'background:#44BEBE;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold;');
