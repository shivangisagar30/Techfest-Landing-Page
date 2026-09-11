const progress = document.querySelector('.scroll-progress');
const header = document.querySelector('[data-header]');
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('.menu-toggle');
const reveals = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav a:not(.nav-cta)');
const sections = document.querySelectorAll('main section[id]');

const updateScrollChrome = () => {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range ? window.scrollY / range : 0})`;
  header.classList.toggle('scrolled', window.scrollY > 20);
};

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${Math.max(0, Math.min(entry.target.getBoundingClientRect().top / 1000, .25))}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
reveals.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.timeline-point').forEach((point) => point.addEventListener('click', () => {
  document.querySelectorAll('.timeline-point').forEach((item) => {
    const active = item === point;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  document.querySelector('.timeline-status').textContent = `Techfest / ${point.dataset.year} - The next signal`;
}));

window.addEventListener('scroll', updateScrollChrome, { passive: true });
updateScrollChrome();
