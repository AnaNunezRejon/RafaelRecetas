const icons = {
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><circle cx="128" cy="128" r="96"/><polyline points="128 72 128 128 168 148"/></svg>',
  'fork-knife': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M72 48v56a24 24 0 0 0 24 24"/><path d="M72 128v80"/><path d="M120 48v80a24 24 0 0 0 24 24"/><path d="M120 152v56"/><path d="M168 48v56a24 24 0 0 1-24 24"/><path d="M168 128v80"/><path d="M216 48v80a24 24 0 0 1-24 24"/><path d="M216 152v56"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><circle cx="88" cy="80" r="40"/><circle cx="168" cy="80" r="40"/><path d="M24 192c0-48 32-72 64-72s64 24 64 72"/><path d="M168 120c32 0 64 24 64 72"/></svg>',
  'arrow-right': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><line x1="40" y1="128" x2="216" y2="128"/><polyline points="160 72 216 128 160 184"/></svg>',
  leaf: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M128 216c-40 0-72-48-72-104S88 24 128 24s72 40 72 88-32 104-72 104z"/><path d="M128 216V120"/><path d="M128 120c20 0 40-16 40-40"/><path d="M128 120c-20 0-40-16-40-40"/></svg>',
  download: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M200 176v24a16 16 0 0 1-16 16H72a16 16 0 0 1-16-16v-24"/><polyline points="88 136 128 176 168 136"/><line x1="128" y1="176" x2="128" y2="40"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M128 216S28 160 28 92a50 50 0 0 1 100-10 50 50 0 0 1 100 10c0 68-100 124-100 124z"/></svg>',
  'chef-hat': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"><path d="M48 112V88a32 32 0 0 1 32-32h96a32 32 0 0 1 32 32v24"/><path d="M48 112h160v32a32 32 0 0 1-32 32H80a32 32 0 0 1-32-32v-32z"/><path d="M88 176v16a40 40 0 0 0 80 0v-16"/></svg>',
};

/* ===== WELCOME SLIDER ===== */
function initWelcomeSlider() {
  const overlay = document.getElementById('welcome-overlay');
  if (!overlay) return;
  if (sessionStorage.getItem('welcomeSeen') === 'true') {
    overlay.classList.add('is-gone');
    showMainPage();
    return;
  }
  const wrapper = document.getElementById('slides-wrapper');
  const dots = document.querySelectorAll('.slider-dot');
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  let autoPlayTimer = null;
  const totalSlides = slides.length;

  function goToSlide(index) {
    currentSlide = index;
    wrapper.style.transform = 'translateX(-' + (index * 100) + '%)';
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
    clearInterval(autoPlayTimer);
    if (currentSlide < totalSlides - 1) {
      autoPlayTimer = setInterval(nextSlide, 5000);
    }
  }
  function nextSlide() {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
  }
  dots.forEach((dot, index) => { dot.addEventListener('click', () => goToSlide(index)); });
  const enterBtn = document.getElementById('btn-enter');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      sessionStorage.setItem('welcomeSeen', 'true');
      overlay.classList.add('is-hidden');
      setTimeout(() => {
        overlay.classList.add('is-gone');
        showMainPage();
      }, 400);
    });
  }
  slides[0].classList.add('is-active');
  dots[0].classList.add('is-active');
  autoPlayTimer = setInterval(nextSlide, 5000);
}

function showMainPage() {
  const mainPage = document.getElementById('main-page');
  if (mainPage) {
    mainPage.style.display = 'block';
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      requestAnimationFrame(() => { heroContent.classList.add('is-visible'); });
    }
  }
}

/* ===== FILTER BAR ===== */
function initFilterBar() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;
  const observer = new IntersectionObserver(
    ([entry]) => { filterBar.classList.toggle('is-stuck', entry.intersectionRatio < 1); },
    { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
  );
  observer.observe(filterBar);
}

/* ===== RECIPE GRID ===== */
let allRecipes = [];
let activeTimeFilter = null;
let activeTypeFilter = 'todos';

function initRecipeGrid() {
  const grid = document.getElementById('recipe-grid');
  if (!grid) return;
  fetch('./data.json')
    .then(r => r.json())
    .then(data => {
      allRecipes = data.recetas;
      renderRecipes(allRecipes);
      initFilters();
    })
    .catch(err => {
      console.error('Error cargando recetas:', err);
      grid.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">Error al cargar las recetas.</p>';
    });
}

function renderRecipes(recipes) {
  const grid = document.getElementById('recipe-grid');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('filter-count');
  if (!grid) return;
  if (recipes.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (countEl) countEl.textContent = '0 recetas';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (countEl) countEl.textContent = 'Mostrando ' + recipes.length + ' recetas';

  grid.innerHTML = recipes.map(r =>
    '<article class="recipe-card">' +
      '<a href="' + r.html + '" class="recipe-card-img-wrapper">' +
        '<img src="' + r.imagenThumb + '" alt="' + r.titulo + '" class="recipe-card-img" loading="lazy">' +
      '</a>' +
      '<div class="recipe-card-body">' +
        '<h3 class="recipe-card-title">' + r.titulo + '</h3>' +
        '<div class="recipe-card-meta">' +
          '<span class="recipe-card-meta-item">' + icons.clock + ' ' + r.tiempoLabel + '</span>' +
          '<span class="recipe-card-meta-item">' + icons['fork-knife'] + ' ' + capitalize(r.tipo) + '</span>' +
        '</div>' +
        '<div class="recipe-card-footer">' +
          '<span class="recipe-card-servings">' + icons.users + ' ' + r.comensales + ' pers.</span>' +
          '<a href="' + r.html + '" class="recipe-card-link">Ver receta ' + icons['arrow-right'] + '</a>' +
        '</div>' +
      '</div>' +
    '</article>'
  ).join('');
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function initFilters() {
  const timeChips = document.querySelectorAll('[data-filter-time]');
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.dataset.filterTime;
      if (activeTimeFilter === value) {
        activeTimeFilter = null;
        chip.classList.remove('is-active');
      } else {
        timeChips.forEach(c => c.classList.remove('is-active'));
        activeTimeFilter = value;
        chip.classList.add('is-active');
      }
      applyFilters();
    });
  });

  const typeChips = document.querySelectorAll('[data-filter-type]');
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const value = chip.dataset.filterType;
      typeChips.forEach(c => c.classList.remove('is-active'));
      activeTypeFilter = value;
      chip.classList.add('is-active');
      applyFilters();
    });
  });

  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeTimeFilter = null;
      activeTypeFilter = 'todos';
      timeChips.forEach(c => c.classList.remove('is-active'));
      typeChips.forEach(c => { c.classList.toggle('is-active', c.dataset.filterType === 'todos'); });
      applyFilters();
    });
  }
}

function applyFilters() {
  let filtered = allRecipes;
  if (activeTimeFilter) {
    filtered = filtered.filter(r => {
      if (activeTimeFilter === 'rapido') return r.tiempo < 30;
      if (activeTimeFilter === 'medio') return r.tiempo >= 30 && r.tiempo <= 60;
      if (activeTimeFilter === 'lento') return r.tiempo > 60;
      return true;
    });
  }
  if (activeTypeFilter && activeTypeFilter !== 'todos') {
    filtered = filtered.filter(r => r.tipo === activeTypeFilter);
  }
  renderRecipes(filtered);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeSlider();
  initFilterBar();
  initRecipeGrid();
});
