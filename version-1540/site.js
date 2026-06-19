(function () {
  function select(selector, root) {
    return (root || document).querySelector(selector);
  }

  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var button = select("[data-menu-button]");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
  }

  function setupHero() {
    var hero = select("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = selectAll("[data-hero-slide]", hero);
    var dots = selectAll("[data-hero-dot]", hero);
    var prev = select("[data-hero-prev]", hero);
    var next = select("[data-hero-next]", hero);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function move(step) {
      show(current + step);
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        move(1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupLocalFilter() {
    var form = select("[data-local-filter]");
    var list = select("[data-filter-list]");
    if (!form || !list) {
      return;
    }
    var input = select("input", form);
    var cards = selectAll(".movie-card", list);
    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = card.textContent.toLowerCase();
        card.setAttribute("data-filter-hidden", term && haystack.indexOf(term) === -1 ? "true" : "false");
      });
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<em>#" + escapeHtml(tag) + "</em>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"poster-wrap\" href=\"" + escapeAttr(movie.url) + "\" aria-label=\"" + escapeAttr(movie.title) + "\">" +
      "<img src=\"" + escapeAttr(movie.cover) + "\" alt=\"" + escapeAttr(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"rating\">" + escapeHtml(movie.rating) + "</span>" +
      "<span class=\"play-chip\">播放</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<div class=\"meta-row\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.type) + "</span></div>" +
      "<h3><a href=\"" + escapeAttr(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
      "<p>" + escapeHtml(limitText(movie.oneLine, 76)) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function limitText(value, size) {
    var text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length > size ? text.slice(0, size) + "…" : text;
  }

  function setupSearchPage() {
    var results = select("[data-search-results]");
    if (!results || typeof MOVIES === "undefined") {
      return;
    }
    var input = select("[data-search-input]");
    var summary = select("[data-search-summary]");
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    if (input) {
      input.value = q;
    }

    function render(term) {
      var query = term.trim().toLowerCase();
      if (!query) {
        summary.textContent = "热门推荐";
        results.innerHTML = MOVIES.slice(0, 24).map(cardTemplate).join("");
        return;
      }
      var matched = MOVIES.filter(function (movie) {
        var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, (movie.tags || []).join(" "), movie.oneLine].join(" ").toLowerCase();
        return haystack.indexOf(query) !== -1;
      }).slice(0, 120);
      summary.textContent = matched.length ? "搜索结果" : "暂无匹配影片";
      results.innerHTML = matched.map(cardTemplate).join("");
    }

    if (input) {
      input.addEventListener("input", function () {
        render(input.value);
      });
    }
    render(q);
  }

  function attachPlayer(source) {
    ready(function () {
      var video = select("[data-video-player]");
      var cover = select("[data-play-cover]");
      if (!video || !source) {
        return;
      }
      var hlsInstance = null;

      function bind() {
        if (video.getAttribute("data-ready") === "1") {
          return;
        }
        video.setAttribute("data-ready", "1");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 30
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        bind();
        if (cover) {
          cover.hidden = true;
        }
        var attempt = video.play();
        if (attempt && attempt.catch) {
          attempt.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener("click", play);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  window.createMoviePlayer = attachPlayer;

  ready(function () {
    setupMenu();
    setupHero();
    setupLocalFilter();
    setupSearchPage();
  });
})();
