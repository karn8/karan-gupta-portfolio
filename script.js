const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const typingName = document.querySelector('.typing-name');
const typingText = document.querySelector('.typing-text');
const fullName = typingText.textContent;
let typingTimer;
function finishTyping() {
  clearTimeout(typingTimer);
  typingText.textContent = fullName;
  typingName.classList.remove('is-typing');
}
if (!motionPreference.matches) {
  typingText.textContent = '';
  typingName.classList.add('is-typing');
  let letter = 0;
  function typeNextLetter() {
    typingText.textContent = fullName.slice(0, ++letter);
    if (letter < fullName.length) typingTimer = setTimeout(typeNextLetter, 105);
    else typingTimer = setTimeout(finishTyping, 1100);
  }
  typingTimer = setTimeout(typeNextLetter, 320);
}
motionPreference.addEventListener('change', event => { if (event.matches) finishTyping(); });

const chapters = document.querySelector('.chapters');
const chapterCards = [...document.querySelectorAll('.chapter-card')];
const chapterCounter = document.querySelector('.chapter-counter');
function updateChapters() {
  if (!chapters.classList.contains('is-enhanced')) return;
  const bounds = chapters.getBoundingClientRect();
  const distance = Math.max(1, chapters.offsetHeight - innerHeight);
  const progress = Math.max(0, Math.min(1, -bounds.top / distance)) * (chapterCards.length - 1);
  chapterCards.forEach((card, index) => {
    const offset = index - progress;
    const exit = Math.max(0, -offset);
    const depth = Math.min(3.5, Math.max(0, offset));
    card.style.setProperty('--card-y', `${-depth * 24 - exit * (innerHeight * .7)}px`);
    card.style.setProperty('--card-scale', String(1 - depth * .045));
    card.style.setProperty('--card-opacity', String(Math.max(0, 1 - Math.max(0, exit - .6) * 3)));
    card.style.setProperty('--card-rotate', '0deg');
    card.style.setProperty('--card-z', String(chapterCards.length - index));
  });
  chapterCounter.textContent = `${String(Math.min(chapterCards.length, Math.floor(progress + .55) + 1)).padStart(2, '0')} / 05`;
}
function setChapterMotion() {
  chapters.classList.toggle('is-enhanced', !motionPreference.matches);
  updateChapters();
}
setChapterMotion();
motionPreference.addEventListener('change', setChapterMotion);
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
const floatingNavigation = document.querySelector('.floating-nav');
const contactDock = document.querySelector('.contact-dock');
const navigationTargets = navigationLinks.map(link => document.querySelector(link.hash));
function updateNavigation() {
  const progress = motionPreference.matches ? Number(scrollY > 80) : Math.min(1, Math.max(0, scrollY / 360));
  const viewportWidth = document.documentElement.clientWidth;
  const gutter = viewportWidth <= 600 ? 8 : 28;
  const shift = Math.max(0, (viewportWidth - floatingNavigation.getBoundingClientRect().width) / 2 - gutter) * progress;
  floatingNavigation.style.setProperty('--dock-shift', `${shift}px`);
  contactDock.classList.toggle('is-shown', progress > .85);
  contactDock.inert = progress <= .85;
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
  requestAnimationFrame(() => { updateNavigation(); updateChapters(); scrollScheduled = false; });
}, { passive: true });
window.addEventListener('resize', () => { updateNavigation(); updateChapters(); });
updateNavigation();
document.querySelector('#year').textContent = new Date().getFullYear();

// Keep links shared from the previous portfolio useful after the redesign.
const legacySections = { dossier: 'intro', profile: 'about', work: 'experience', academy: 'education', 'portfolio-folder': 'projects' };
const redirectedSection = legacySections[window.location.hash.slice(1)];
if (redirectedSection) {
  history.replaceState(null, '', `#${redirectedSection}`);
  document.getElementById(redirectedSection).scrollIntoView({ behavior: 'instant' });
}
