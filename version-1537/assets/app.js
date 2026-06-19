(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      var target = form.getAttribute('action') || 'search.html';
      window.location.href = target + '?q=' + encodeURIComponent(value);
    });
  });

  document.querySelectorAll('img[data-cover]').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-empty');
      image.removeAttribute('src');
    });
  });

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var searchInput = document.querySelector('[data-search-input]');
  var emptyState = document.querySelector('[data-empty-state]');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  function applyFilter(value) {
    var keyword = value.trim().toLowerCase();
    var visible = 0;

    searchCards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      var matched = !keyword || text.indexOf(keyword) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (searchInput) {
    searchInput.value = query;
    applyFilter(query);
    searchInput.addEventListener('input', function () {
      applyFilter(searchInput.value);
    });
  }
})();
