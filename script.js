const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [...document.querySelectorAll('.reveal')];

// Content stays visible without JavaScript or when reduced motion is preferred.
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  revealElements.forEach(element => {
    element.classList.add('will-reveal');
    revealObserver.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      revealElements.forEach(element => element.classList.add('is-visible'));
      revealObserver.disconnect();
    }
  });
}

const navigationLinks = [...document.querySelectorAll('.floating-nav a')];
const navigationTargets = navigationLinks.map(link => document.querySelector(link.hash));
function updateNavigation() {
  const marker = window.innerHeight * .45;
  let current = navigationTargets[0];
  navigationTargets.forEach(target => {
    if (target.getBoundingClientRect().top <= marker) current = target;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
    current = navigationTargets[navigationTargets.length - 1];
  }
  navigationLinks.forEach(link => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle('is-current', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => { updateNavigation(); scrollScheduled = false; });
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
document.querySelector('#year').textContent = new Date().getFullYear();

// Keep links shared from the previous portfolio useful after the redesign.
const legacySections = { dossier: 'intro', profile: 'about', work: 'experience', academy: 'education', 'portfolio-folder': 'projects' };
const redirectedSection = legacySections[window.location.hash.slice(1)];
if (redirectedSection) {
  history.replaceState(null, '', `#${redirectedSection}`);
  document.getElementById(redirectedSection).scrollIntoView({ behavior: 'instant' });
}
