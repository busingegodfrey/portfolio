function bindNavLinks() {
  const links = document.querySelectorAll('nav a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveLink(targetId);
      }
    });
  });
}

function setActiveLink(activeId = '') {
  const links = document.querySelectorAll('nav a[href^="#"]');
  const currentId = activeId || [...document.querySelectorAll('section[id]')]
    .find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 140 && rect.bottom >= 140;
    })?.id || 'home';

  links.forEach((link) => {
    const linkId = link.getAttribute('href')?.slice(1) || '';
    link.classList.toggle('active', linkId === currentId);
  });
}

function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function initializePortfolio() {
  bindNavLinks();
  setActiveLink();
  setupImageUpload();
  setupAdminPanel();
  updateYear();
}

function setupAdminPanel() {
  const visitCountEl = document.getElementById('visitCount');
  const viewModeEl = document.getElementById('viewMode');
  const content = document.querySelector('main');

  if (!visitCountEl || !viewModeEl || !content) return;

  const storageKey = 'portfolio-admin-state';
  const visitKey = 'portfolio-visits';
  const savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
  let visits = Number(localStorage.getItem(visitKey) || 0);
  visits += 1;
  localStorage.setItem(visitKey, visits);
  visitCountEl.textContent = visits;

  if (savedState.viewMode) {
    viewModeEl.value = savedState.viewMode;
  }

  applyViewMode(savedState.viewMode || viewModeEl.value, content);

  viewModeEl.addEventListener('change', (event) => {
    const mode = event.target.value;
    localStorage.setItem(storageKey, JSON.stringify({ viewMode: mode }));
    applyViewMode(mode, content);
  });
}

function applyViewMode(mode, content) {
  const sections = Array.from(content.querySelectorAll('section'));

  sections.forEach((section) => {
    if (section.id === 'admin') return;
    const shouldHide = mode === 'minimal' ? section.id === 'about' || section.id === 'education' : false;
    const shouldHideContactOnly = mode === 'contact-only' ? section.id !== 'contact' && section.id !== 'admin' : false;
    section.style.display = shouldHide || shouldHideContactOnly ? 'none' : '';
  });

  if (mode === 'contact-only') {
    const home = document.getElementById('home');
    if (home) home.style.display = 'none';
  }
}

function setupImageUpload() {
  const input = document.getElementById('imageUpload');
  const preview = document.getElementById('imagePreview');

  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    preview.innerHTML = '';

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result;
        img.alt = file.name;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
}

document.addEventListener('DOMContentLoaded', initializePortfolio);
window.addEventListener('scroll', () => setActiveLink(), { passive: true });
