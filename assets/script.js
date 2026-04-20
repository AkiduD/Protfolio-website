/* ══════════════════════════════════════
   Akidu Dehan Portfolio — script.js
══════════════════════════════════════ */

// ── Theme ───────────────────────────────────
const html = document.documentElement;
const themeBtn = document.querySelector('[data-theme-toggle]');
let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
html.setAttribute('data-theme', theme);
const setThemeIcon = () => {
  if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
  if (themeBtn) themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
};
setThemeIcon();
themeBtn?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', theme);
  setThemeIcon();
});

// ── SPA Navigation ──────────────────────────
const pages    = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-link]');
const mobileMenu = document.getElementById('mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');

function showPage(hash) {
  const id = (hash || '#home').replace('#', '');
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  mobileMenu?.classList.remove('open');
  menuToggle?.classList.remove('active');
  menuToggle?.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // trigger reveals on newly visible page
  document.querySelectorAll('.page.active .reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

navLinks.forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href?.startsWith('#')) { e.preventDefault(); history.replaceState(null, '', href); showPage(href); }
  });
});
window.addEventListener('load',       () => showPage(location.hash || '#home'));
window.addEventListener('hashchange', () => showPage(location.hash));

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

// ── Scroll Reveal ──────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.13 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Stagger grid children
document.querySelectorAll('.services-grid, .portfolio-grid, .hero-stats, .blog-sidebar, .skills-grid').forEach(grid => {
  [...grid.children].forEach((child, i) => { child.style.transitionDelay = `${i * 75}ms`; });
});

// ── Animated Counters ──────────────────────
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = Number(el.dataset.count);
    const suffix = target === 100 ? '%' : '+';
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const tick = () => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + suffix;
      if (cur < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── Skill Bars ─────────────────────────────
const skillBarObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill[data-width]').forEach(fill => {
      requestAnimationFrame(() => { fill.style.width = fill.dataset.width + '%'; });
    });
    skillBarObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-grid').forEach(el => skillBarObs.observe(el));

// ── Portfolio Filter ────────────────────────
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
    const f = btn.dataset.filter;
    projectCards.forEach(card => card.classList.toggle('hidden', f !== 'all' && card.dataset.category !== f));
  });
});

// ── Like Buttons ────────────────────────────
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const liked = btn.classList.toggle('liked');
    btn.textContent = liked ? '♥' : '♡';
    btn.setAttribute('aria-label', liked ? 'Unlike project' : 'Like project');
    btn.style.transform = 'scale(1.35)';
    setTimeout(() => { btn.style.transform = ''; }, 220);
  });
});

// ── Blog Read More ──────────────────────────
const readMoreBtn = document.querySelector('.read-more-btn');
const blogMore    = document.querySelector('.blog-more');
readMoreBtn?.addEventListener('click', () => {
  const open = blogMore.classList.toggle('open');
  readMoreBtn.textContent = open ? 'Collapse ↑' : 'Continue reading →';
});

// ── Testimonial Slider ──────────────────────
const testimonials = document.querySelectorAll('.testimonial');
const dots         = document.querySelectorAll('.dot');
const prevBtn      = document.querySelector('.slider-btn.prev');
const nextBtn      = document.querySelector('.slider-btn.next');
let idx = 0, autoPlay;

const goTo = i => {
  testimonials.forEach((t, ti) => t.classList.toggle('active', ti === i));
  dots.forEach((d, di) => d.classList.toggle('active', di === i));
  idx = i;
};
const advance = () => goTo((idx + 1) % testimonials.length);
const retreat = () => goTo((idx - 1 + testimonials.length) % testimonials.length);
const resetAuto = () => { clearInterval(autoPlay); autoPlay = setInterval(advance, 5500); };

nextBtn?.addEventListener('click', () => { advance(); resetAuto(); });
prevBtn?.addEventListener('click', () => { retreat(); resetAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));
goTo(0); resetAuto();

// ── Contact Form ────────────────────────────
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const validateField = field => {
  const err = field.closest('.form-group')?.querySelector('.error-message');
  if (!err) return true;
  let msg = '';
  if (field.required && !field.value.trim()) {
    const label = field.labels?.[0]?.textContent?.replace(/\(optional\)/i, '').trim() || 'This field';
    msg = `${label} is required.`;
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    msg = 'Please enter a valid email.';
  }
  err.textContent = msg;
  return !msg;
};

form?.querySelectorAll('input, textarea').forEach(f => {
  f.addEventListener('blur',  () => validateField(f));
  f.addEventListener('input', () => { if (f.closest('.form-group')?.querySelector('.error-message')?.textContent) validateField(f); });
});

form?.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  if (!fields.every(validateField)) { formStatus.textContent = 'Please fix the errors above.'; return; }
  const btn = form.querySelector('[type="submit"]');
  btn.textContent = 'Sending…'; btn.disabled = true;
  setTimeout(() => {
    formStatus.textContent = '✓ Message sent! I will get back to you soon.';
    form.reset();
    btn.innerHTML = 'Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.disabled = false;
  }, 1300);
});

// ── Broken Image Fallback ───────────────────
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    this.style.background = 'var(--surfoff)';
    this.style.minHeight  = this.height ? this.height + 'px' : '120px';
    this.removeAttribute('src');
  });
});

// ── Cursor Glow ─────────────────────────────
const glow = document.querySelector('.cursor-glow');
if (glow && !window.matchMedia('(hover: none)').matches) {
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
