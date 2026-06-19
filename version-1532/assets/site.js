import { H as Hls } from "./hls-vendor.js";

    const STREAM_SOURCES = [
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];

    function ready(callback) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
      } else {
        callback();
      }
    }

    ready(() => {
      setupCurrentYear();
      setupMobileMenu();
      setupHeroSlider();
      setupSearchForms();
      setupFilters();
      setupVideoPlayers();
    });

    function setupCurrentYear() {
      document.querySelectorAll("[data-current-year]").forEach((element) => {
        element.textContent = String(new Date().getFullYear());
      });
    }

    function setupMobileMenu() {
      const button = document.querySelector("[data-mobile-menu-button]");
      const nav = document.querySelector("[data-mobile-nav]");

      if (!button || !nav) {
        return;
      }

      button.addEventListener("click", () => {
        nav.classList.toggle("is-open");
        const expanded = nav.classList.contains("is-open");
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    }

    function setupHeroSlider() {
      const slider = document.querySelector("[data-hero-slider]");

      if (!slider) {
        return;
      }

      const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
      const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
      const prev = slider.querySelector("[data-hero-prev]");
      const next = slider.querySelector("[data-hero-next]");
      let activeIndex = 0;
      let timer = null;

      function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
          dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }

        timer = window.setInterval(() => showSlide(activeIndex + 1), 5600);
      }

      prev?.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        restart();
      });

      next?.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        restart();
      });

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          showSlide(index);
          restart();
        });
      });

      showSlide(0);
      restart();
    }

    function setupSearchForms() {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q") || "";

      document.querySelectorAll("[data-site-search]").forEach((input) => {
        if (query && input instanceof HTMLInputElement) {
          input.value = query;
        }
      });

      document.querySelectorAll("[data-search-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const input = form.querySelector("input");
          const keyword = input ? input.value.trim() : "";
          const target = keyword ? `index.html?q=${encodeURIComponent(keyword)}#all-movies` : "index.html#all-movies";
          window.location.href = target;
        });
      });
    }

    function setupFilters() {
      const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
      const emptyState = document.querySelector("[data-empty-state]");

      if (cards.length === 0) {
        return;
      }

      const searchInputs = Array.from(document.querySelectorAll("[data-live-search]"));
      const regionSelect = document.querySelector("[data-region-filter]");
      const yearSelect = document.querySelector("[data-year-filter]");
      const typeSelect = document.querySelector("[data-type-filter]");
      const resetButton = document.querySelector("[data-filter-reset]");
      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get("q") || "";

      if (initialQuery) {
        searchInputs.forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.value = initialQuery;
          }
        });
      }

      function applyFilters() {
        const keyword = searchInputs
          .map((input) => input instanceof HTMLInputElement ? input.value.trim().toLowerCase() : "")
          .find(Boolean) || "";
        const region = regionSelect instanceof HTMLSelectElement ? regionSelect.value : "";
        const year = yearSelect instanceof HTMLSelectElement ? yearSelect.value : "";
        const type = typeSelect instanceof HTMLSelectElement ? typeSelect.value : "";
        let visibleCount = 0;

        cards.forEach((card) => {
          const haystack = (card.getAttribute("data-search") || "").toLowerCase();
          const cardRegion = card.getAttribute("data-region") || "";
          const cardYear = card.getAttribute("data-year") || "";
          const cardType = card.getAttribute("data-type") || "";
          const matchesKeyword = !keyword || haystack.includes(keyword);
          const matchesRegion = !region || cardRegion === region;
          const matchesYear = !year || cardYear === year;
          const matchesType = !type || cardType === type;
          const shouldShow = matchesKeyword && matchesRegion && matchesYear && matchesType;

          card.style.display = shouldShow ? "" : "none";
          if (shouldShow) {
            visibleCount += 1;
          }
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? "block" : "none";
        }
      }

      searchInputs.forEach((input) => input.addEventListener("input", applyFilters));
      regionSelect?.addEventListener("change", applyFilters);
      yearSelect?.addEventListener("change", applyFilters);
      typeSelect?.addEventListener("change", applyFilters);

      resetButton?.addEventListener("click", () => {
        searchInputs.forEach((input) => {
          if (input instanceof HTMLInputElement) {
            input.value = "";
          }
        });

        if (regionSelect instanceof HTMLSelectElement) {
          regionSelect.value = "";
        }

        if (yearSelect instanceof HTMLSelectElement) {
          yearSelect.value = "";
        }

        if (typeSelect instanceof HTMLSelectElement) {
          typeSelect.value = "";
        }

        applyFilters();
      });

      applyFilters();
    }

    function setupVideoPlayers() {
      document.querySelectorAll("[data-player-frame]").forEach((frame) => {
        const video = frame.querySelector("video[data-stream-src]");
        const overlay = frame.querySelector("[data-player-overlay]");
        const message = frame.parentElement?.querySelector("[data-player-message]");

        if (!(video instanceof HTMLVideoElement)) {
          return;
        }

        const source = video.getAttribute("data-stream-src") || STREAM_SOURCES[0];
        let initialized = false;
        let hlsInstance = null;

        function setMessage(text) {
          if (message) {
            message.textContent = text || "";
          }
        }

        function initializePlayer() {
          if (initialized) {
            return;
          }

          initialized = true;
          setMessage("正在加载播放源...");

          if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });

            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
              setMessage("");
            });

            hlsInstance.on(Hls.Events.ERROR, (event, data) => {
              if (!data || !data.fatal) {
                return;
              }

              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                setMessage("网络错误，正在尝试重新加载视频。");
                hlsInstance.startLoad();
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                setMessage("媒体错误，正在尝试恢复播放。");
                hlsInstance.recoverMediaError();
              } else {
                setMessage("无法播放视频，请稍后再试。");
                hlsInstance.destroy();
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", () => setMessage(""), { once: true });
          } else {
            setMessage("当前浏览器不支持 HLS 播放。");
          }
        }

        async function togglePlayback() {
          initializePlayer();

          try {
            if (video.paused) {
              await video.play();
            } else {
              video.pause();
            }
          } catch (error) {
            setMessage("播放被浏览器拦截，请再次点击播放按钮。");
          }
        }

        overlay?.addEventListener("click", togglePlayback);
        video.addEventListener("click", togglePlayback);

        video.addEventListener("play", () => {
          overlay?.classList.add("is-hidden");
        });

        video.addEventListener("pause", () => {
          overlay?.classList.remove("is-hidden");
        });

        video.addEventListener("ended", () => {
          overlay?.classList.remove("is-hidden");
        });

        window.addEventListener("beforeunload", () => {
          if (hlsInstance) {
            hlsInstance.destroy();
          }
        });
      });
    }
