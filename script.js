const folder = document.querySelector('.portfolio-folder');
const openButton = document.querySelector('.open-dossier');
const folderFront = document.querySelector('.folder-front');
const tabs = [...document.querySelectorAll('.file-tab')];
const sheets = [...document.querySelectorAll('.file-sheet')];

function openFolder() {
  if (folder.classList.contains('is-open')) return;
  folder.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');
  openButton.querySelector('span').textContent = 'Dossier opened';
  window.setTimeout(() => folder.scrollIntoView({ behavior: 'smooth', block: 'start' }), 260);
}

function selectFile(name) {
  tabs.forEach((tab) => {
    const active = tab.dataset.file === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });

  sheets.forEach((sheet) => {
    const active = sheet.dataset.sheet === name;
    sheet.hidden = !active;
    sheet.classList.toggle('is-active', active);
  });
}

openButton.addEventListener('click', openFolder);
folderFront.addEventListener('click', openFolder);
tabs.forEach((tab) => tab.addEventListener('click', () => selectFile(tab.dataset.file)));

document.addEventListener('keydown', (event) => {
  if (!folder.classList.contains('is-open')) return;
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
});
