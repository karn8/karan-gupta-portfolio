const folder = document.querySelector('.portfolio-folder');
const openButton = document.querySelector('.open-dossier');
const folderFront = document.querySelector('.folder-front');
const tabs = [...document.querySelectorAll('.file-tab')];
const sheets = [...document.querySelectorAll('.file-sheet')];
const tabList = document.querySelector('.file-tabs');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
tabList.inert = true;
document.querySelector('.file-window').inert = true;
tabs.forEach(tab => {
  tab.id = `tab-${tab.dataset.file}`;
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', `panel-${tab.dataset.file}`);
  tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
});
sheets.forEach(sheet => {
  sheet.id = `panel-${sheet.dataset.sheet}`;
  sheet.setAttribute('role', 'tabpanel');
  sheet.setAttribute('aria-labelledby', `tab-${sheet.dataset.sheet}`);
  sheet.tabIndex = 0;
});

function openFolder() {
  folder.classList.add('is-open');
  folderFront.hidden = true;
  tabList.inert = false;
  document.querySelector('.file-window').inert = false;
  openButton.setAttribute('aria-expanded', 'true');
  openButton.querySelector('span').textContent = 'Back to the dossier';
  folder.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
}

function selectFile(name) {
  tabs.forEach((tab) => {
    const active = tab.dataset.file === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  sheets.forEach((sheet) => {
    const active = sheet.dataset.sheet === name;
    sheet.hidden = !active;
    sheet.classList.toggle('is-active', active);
  });
}

function openAndFocus() {
  openFolder();
  tabs.find(tab => tab.classList.contains('is-active')).focus({ preventScroll: true });
}
openButton.addEventListener('click', openAndFocus);
folderFront.addEventListener('click', openAndFocus);
folderFront.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openAndFocus();
  }
});
tabs.forEach((tab) => tab.addEventListener('click', () => {
  selectFile(tab.dataset.file);
  history.replaceState(null, '', `#${tab.dataset.file}`);
}));

tabList.addEventListener('keydown', (event) => {
  if (!event.target.matches('.file-tab')) return;
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (event.key === 'ArrowRight') {
    const next = tabs[(activeIndex + 1) % tabs.length];
    selectFile(next.dataset.file);
    next.focus();
  }
  if (event.key === 'ArrowLeft') {
    const next = tabs[(activeIndex - 1 + tabs.length) % tabs.length];
    selectFile(next.dataset.file);
    next.focus();
  }
  if (event.key === 'Home' || event.key === 'End') {
    const next = event.key === 'Home' ? tabs[0] : tabs[tabs.length - 1];
    selectFile(next.dataset.file);
    next.focus();
  }
  const selected = tabs.find(tab => tab.classList.contains('is-active'));
  history.replaceState(null, '', `#${selected.dataset.file}`);
  selected.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
});

document.querySelectorAll('[data-open-file]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  selectFile(link.dataset.openFile);
  history.replaceState(null, '', `#${link.dataset.openFile}`);
  openAndFocus();
}));
function restoreFile() {
  const name = location.hash.slice(1);
  if (tabs.some(tab => tab.dataset.file === name)) {
    selectFile(name);
    openFolder();
  } else if (name === 'portfolio-folder') openAndFocus();
}
window.addEventListener('hashchange', restoreFile);
restoreFile();
