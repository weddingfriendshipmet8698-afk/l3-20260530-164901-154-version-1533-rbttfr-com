(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-menu]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero-slider]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    if (slides.length <= 1) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function reset() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        reset();
      });
    });

    start();
  }

  function initGridFilter() {
    var input = document.querySelector('[data-grid-filter]');
    if (!input) {
      return;
    }
    var grid = document.getElementById(input.getAttribute('data-grid-filter'));
    if (!grid) {
      return;
    }
    var cards = selectAll('[data-title]', grid);
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        card.style.display = text.indexOf(keyword) >= 0 ? '' : 'none';
      });
    });
  }

  function cardTemplate(movie) {
    return [
      '<a class="movie-card" href="./' + movie.file + '">',
      '  <figure>',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="card-category">' + escapeHtml(movie.category) + '</span>',
      '  </figure>',
      '  <div class="card-body">',
      '    <h3>' + escapeHtml(movie.title) + '</h3>',
      '    <p>' + escapeHtml(movie.description) + '</p>',
      '    <div class="card-meta">',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>★ ' + escapeHtml(movie.rating) + '</span>',
      '    </div>',
      '  </div>',
      '</a>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initSearchPage() {
    var resultRoot = document.getElementById('searchResults');
    if (!resultRoot || !window.MOVIE_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var keyword = (params.get('q') || '').trim();
    var input = document.getElementById('searchInput');
    var title = document.getElementById('searchTitle');
    if (input) {
      input.value = keyword;
    }
    if (!keyword) {
      resultRoot.innerHTML = '<div class="search-empty">请输入关键词进行搜索</div>';
      return;
    }
    var lower = keyword.toLowerCase();
    var results = window.MOVIE_INDEX.filter(function (movie) {
      return [movie.title, movie.description, movie.category, movie.region, movie.genre, movie.year]
        .join(' ')
        .toLowerCase()
        .indexOf(lower) >= 0;
    });
    if (title) {
      title.textContent = '“' + keyword + '” 的搜索结果';
    }
    if (!results.length) {
      resultRoot.innerHTML = '<div class="search-empty">未找到相关影片</div>';
      return;
    }
    resultRoot.innerHTML = results.slice(0, 240).map(cardTemplate).join('');
  }

  function initPlayer() {
    var video = document.getElementById('movieVideo');
    var trigger = document.querySelector('[data-player-trigger]');
    if (!video || !trigger) {
      return;
    }
    var stream = trigger.getAttribute('data-stream');
    var hls = null;
    var loaded = false;

    function attach() {
      if (loaded || !stream) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      attach();
      trigger.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          trigger.classList.remove('is-hidden');
        });
      }
    }

    trigger.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      trigger.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        trigger.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initGridFilter();
    initSearchPage();
    initPlayer();
  });
})();
