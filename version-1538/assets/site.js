(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', function () {
            mainNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide((current + 1) % slides.length);
            }, 5600);
        }
    }

    var toolbar = document.querySelector('[data-filter-toolbar]');

    if (toolbar) {
        var searchInput = toolbar.querySelector('[data-search-input]');
        var yearFilter = toolbar.querySelector('[data-year-filter]');
        var items = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && searchInput) {
            searchInput.value = query;
        }

        function applyFilter() {
            var text = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var year = yearFilter ? yearFilter.value : '';

            items.forEach(function (item) {
                var haystack = [
                    item.getAttribute('data-title') || '',
                    item.getAttribute('data-tags') || '',
                    item.getAttribute('data-region') || ''
                ].join(' ').toLowerCase();
                var itemYear = item.getAttribute('data-year') || '';
                var matchText = !text || haystack.indexOf(text) !== -1;
                var matchYear = !year || itemYear === year;

                item.style.display = matchText && matchYear ? '' : 'none';
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', applyFilter);
        }

        applyFilter();
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-player]'));

    players.forEach(function (box) {
        var video = box.querySelector('video');
        var button = box.querySelector('[data-play-button]');
        var source = box.getAttribute('data-source');
        var started = false;
        var hlsInstance = null;

        function startPlayback() {
            if (!video || !source) {
                return;
            }

            if (!started) {
                started = true;

                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else {
                    video.src = source;
                }
            }

            video.controls = true;
            box.classList.add('is-playing');
            var playAction = video.play();

            if (playAction && typeof playAction.catch === 'function') {
                playAction.catch(function () {
                    box.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }

        box.addEventListener('click', function (event) {
            if (event.target === video) {
                return;
            }
            startPlayback();
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
