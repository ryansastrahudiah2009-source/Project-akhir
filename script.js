// ── Logo upload ──
const logoEmblem      = document.getElementById('logoEmblem');
const logoImg         = document.getElementById('logoImg');
const logoUpload      = document.getElementById('logoUpload');
const logoPlaceholder = document.getElementById('logoPlaceholder');

if (logoEmblem && logoUpload) {
  logoEmblem.addEventListener('click', () => logoUpload.click());
  logoUpload.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      logoImg.src = ev.target.result;
      logoImg.classList.add('loaded');
      logoPlaceholder.style.display = 'none';
      localStorage.setItem('tmii_logo', ev.target.result);
    };
    reader.readAsDataURL(file);
  });
  const saved = localStorage.getItem('tmii_logo');
  if (saved) {
    logoImg.src = saved;
    logoImg.classList.add('loaded');
    logoPlaceholder.style.display = 'none';
  }
}

// ── Scroll to section ──
function scrollSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({ top, behavior: 'smooth' });
  closeMobileMenu();
}

// ── Header scroll + scroll-spy ──
window.addEventListener('scroll', () => {
  document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 20);

  const sections = ['history', 'explore', 'tickets', 'contact'];
  const offset   = 120;
  let active     = null;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom > offset) active = id;
  });
  document.querySelectorAll('nav .nav-btn').forEach(b => {
    const matches = active && b.textContent.trim().toLowerCase().includes(active);
    b.classList.toggle('active', !!matches);
  });
}, { passive: true });

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  mobileNav?.classList.remove('open');
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ── Intersection observer (section animations) ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.timeline-item, .explore-card, .ticket-card, .contact-item').forEach(el => {
  observer.observe(el);
});

// ── Image strip drag ──
const stripWrap = document.querySelector('.image-strip-wrap');
const strip     = document.querySelector('.image-strip');

if (strip && stripWrap) {
  let isDragging = false, startX, scrollLeft;

  strip.addEventListener('mousedown', e => {
    isDragging = true;
    strip.classList.add('dragging');
    startX     = e.pageX - stripWrap.offsetLeft;
    scrollLeft = stripWrap.scrollLeft;
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    strip.classList.remove('dragging');
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    stripWrap.scrollLeft = scrollLeft - (e.pageX - stripWrap.offsetLeft - startX) * 1.4;
  });

  if (window.innerWidth >= 769) {
    let autoScroll, direction = 1, paused = false;
    function startAutoDrift() {
      if (autoScroll) return;
      autoScroll = setInterval(() => {
        if (paused || isDragging) return;
        stripWrap.scrollLeft += direction * 0.6;
        const max = stripWrap.scrollWidth - stripWrap.clientWidth;
        if (stripWrap.scrollLeft >= max) direction = -1;
        if (stripWrap.scrollLeft <= 0)   direction =  1;
      }, 16);
    }
    stripWrap.addEventListener('mouseenter', () => { paused = true; });
    stripWrap.addEventListener('mouseleave', () => { paused = false; });
    setTimeout(startAutoDrift, 1800);
  }
}

// ── Scroll hint ──
const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity    = '0';
    scrollHint.style.transition = 'opacity 0.5s';
  }, { passive: true, once: true });
}

// ── Parallax bg ──
if (window.innerWidth >= 769 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const bgImage = document.querySelector('.bg-image');
  if (bgImage) {
    window.addEventListener('scroll', () => {
      bgImage.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
    }, { passive: true });
  }
}
