(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    setupHeader();
    setupMobileMenu();
    setupHeroCarousel();
    setupFilters();
    setupPlayers();
  });

  function setupHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) {
      return;
    }
    var sync = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-mobile-menu]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("is-menu-open", nav.classList.contains("is-open"));
    });
  }

  function setupHeroCarousel() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function move(step) {
      show(index + step);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        move(-1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        move(1);
        restart();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        restart();
      });
    });
    show(0);
    restart();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function (panel) {
      var list = document.querySelector("[data-filter-list]");
      if (!list) {
        return;
      }
      var input = panel.querySelector("[data-filter-input]");
      var year = panel.querySelector("[data-filter-year]");
      var type = panel.querySelector("[data-filter-type]");
      var category = panel.querySelector("[data-filter-category]");
      var empty = document.querySelector("[data-empty-state]");
      var cards = Array.prototype.slice.call(list.querySelectorAll(".filter-card"));
      var params = new URLSearchParams(window.location.search);

      if (input && params.get("keyword")) {
        input.value = params.get("keyword");
      }
      if (year && params.get("year")) {
        year.value = params.get("year");
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var yearValue = year ? year.value : "";
        var typeValue = type ? type.value : "";
        var categoryValue = category ? category.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.getAttribute("data-region"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var ok = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            ok = false;
          }
          if (yearValue && card.getAttribute("data-year") !== yearValue) {
            ok = false;
          }
          if (typeValue && card.getAttribute("data-type") !== typeValue) {
            ok = false;
          }
          if (categoryValue && haystack.indexOf(categoryValue.toLowerCase()) === -1) {
            ok = false;
          }
          card.classList.toggle("is-hidden", !ok);
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [input, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var cover = player.querySelector("[data-play-button]");
      var play = player.querySelector("[data-toggle-play]");
      var mute = player.querySelector("[data-toggle-mute]");
      var full = player.querySelector("[data-fullscreen]");
      var started = false;
      var hls = null;

      function begin() {
        if (!video) {
          return;
        }
        if (!started) {
          started = true;
          attach(video, player, function (instance) {
            hls = instance;
          });
        }
        if (cover) {
          cover.classList.add("is-hidden");
        }
        video.play().catch(function () {});
      }

      if (cover) {
        cover.addEventListener("click", begin);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!started || video.paused) {
            begin();
          } else {
            video.pause();
          }
        });
      }
      if (play) {
        play.addEventListener("click", function () {
          if (!started || video.paused) {
            begin();
          } else {
            video.pause();
          }
        });
      }
      if (mute && video) {
        mute.addEventListener("click", function () {
          video.muted = !video.muted;
          mute.textContent = video.muted ? "取消静音" : "静音";
        });
      }
      if (full) {
        full.addEventListener("click", function () {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });
      }
      window.addEventListener("beforeunload", function () {
        if (hls && hls.destroy) {
          hls.destroy();
        }
      });
    });
  }

  function attach(video, player, setInstance) {
    var url = video.getAttribute("data-hls");
    var Hls = window.Hls;
    if (!url) {
      player.classList.add("has-error");
      return;
    }
    if (Hls && Hls.isSupported && Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      setInstance(hls);
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            player.classList.add("has-error");
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", function () {
        video.play().catch(function () {});
      }, { once: true });
    } else {
      player.classList.add("has-error");
    }
  }
})();
