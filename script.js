(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const cityButtons = [...document.querySelectorAll('[data-filter-city]')];
  const typeButtons = [...document.querySelectorAll('[data-filter-type]')];
  const cards = [...document.querySelectorAll('.guide-card')];
  const searchInput = document.querySelector('#search');
  const count = document.querySelector('#results-count');
  const clearButtons = [document.querySelector('#clear-filters'), document.querySelector('#empty-clear')].filter(Boolean);
  const emptyState = document.querySelector('#empty-state');
  const toast = document.querySelector('#toast');

  const filters = { city: 'all', type: 'all', search: '' };
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }

  function setActive(buttons, activeButton) {
    buttons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function updateResults() {
    let visible = 0;
    const term = filters.search.trim().toLocaleLowerCase('pt-BR');

    cards.forEach((card) => {
      const matchesCity = filters.city === 'all' || card.dataset.city === filters.city;
      const matchesType = filters.type === 'all' || card.dataset.type === filters.type;
      const matchesSearch = !term || (card.dataset.search || '').toLocaleLowerCase('pt-BR').includes(term);
      const shouldShow = matchesCity && matchesType && matchesSearch;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) visible += 1;
    });

    count.textContent = String(visible);
    emptyState.hidden = visible !== 0;
  }

  function clearFilters() {
    filters.city = 'all';
    filters.type = 'all';
    filters.search = '';
    searchInput.value = '';
    setActive(cityButtons, cityButtons[0]);
    setActive(typeButtons, typeButtons[0]);
    updateResults();
  }

  cityButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      filters.city = button.dataset.filterCity;
      setActive(cityButtons, button);
      updateResults();
    });
  });

  typeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => {
      filters.type = button.dataset.filterType;
      setActive(typeButtons, button);
      updateResults();
    });
  });

  searchInput.addEventListener('input', (event) => {
    filters.search = event.target.value;
    updateResults();
  });

  clearButtons.forEach((button) => button.addEventListener('click', clearFilters));

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!navigation.classList.contains('is-open')) return;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  document.querySelectorAll('.map-link').forEach((link) => {
    link.addEventListener('click', () => {
      showToast('Fit Perto: Redirecionando para a busca no Google Maps...');
    });
  });

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  updateResults();
})();
