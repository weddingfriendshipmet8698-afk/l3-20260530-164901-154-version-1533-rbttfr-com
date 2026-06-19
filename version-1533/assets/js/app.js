(function () {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 18) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    document.querySelectorAll('[data-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-dot]'));
        var prev = slider.querySelector('[data-slide-prev]');
        var next = slider.querySelector('[data-slide-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide-dot')) || 0);
                restart();
            });
        });

        show(0);
        restart();
    });

    document.querySelectorAll('[data-filter-form]').forEach(function (form) {
        var wrapper = form.parentElement;
        var list = wrapper ? wrapper.querySelector('[data-filter-list]') : null;
        var emptyState = wrapper ? wrapper.querySelector('[data-empty-state]') : null;
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];
        var keywordInput = form.querySelector('[data-filter-keyword]');
        var yearSelect = form.querySelector('[data-filter-year]');
        var regionSelect = form.querySelector('[data-filter-region]');
        var typeSelect = form.querySelector('[data-filter-type]');
        var params = new URLSearchParams(window.location.search);

        if (keywordInput && params.get('q')) {
            keywordInput.value = params.get('q');
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(keywordInput ? keywordInput.value : '');
            var year = normalize(yearSelect ? yearSelect.value : '');
            var region = normalize(regionSelect ? regionSelect.value : '');
            var type = normalize(typeSelect ? typeSelect.value : '');
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-category'),
                    card.textContent
                ].join(' '));
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    matched = false;
                }
                if (region && normalize(card.getAttribute('data-region')) !== region) {
                    matched = false;
                }
                if (type && normalize(card.getAttribute('data-type')) !== type) {
                    matched = false;
                }

                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visible !== 0;
            }
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });

        form.addEventListener('input', applyFilter);
        form.addEventListener('change', applyFilter);
        applyFilter();
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.stream-overlay');
        var source = video ? video.getAttribute('data-src') : '';
        var attached = false;
        var hls = null;

        function attach() {
            if (!video || !source || attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            attached = true;
        }

        function start() {
            if (!video) {
                return;
            }
            attach();
            player.classList.add('is-playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        function stop() {
            player.classList.remove('is-playing');
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!attached || video.paused) {
                    start();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('pause', stop);
            video.addEventListener('ended', stop);
        }

        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();
