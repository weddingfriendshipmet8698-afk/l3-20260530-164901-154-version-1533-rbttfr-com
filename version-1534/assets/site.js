(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = form.querySelector('input[name="q"]');
            const value = input ? input.value.trim() : '';
            const target = value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html';
            window.location.href = target;
        });
    });

    const filterInput = document.querySelector('[data-filter-input]');
    const yearSelect = document.querySelector('[data-filter-year]');
    const cards = Array.from(document.querySelectorAll('[data-search-card]'));
    const emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }

        const keyword = normalize(filterInput ? filterInput.value : '');
        const year = yearSelect ? yearSelect.value : '';
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.dataset.search);
            const cardYear = card.dataset.year || '';
            const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            const matchedYear = !year || cardYear === year;
            const show = matchedKeyword && matchedYear;
            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    if (filterInput || yearSelect) {
        const params = new URLSearchParams(window.location.search);
        const queryValue = params.get('q') || '';
        if (filterInput && queryValue) {
            filterInput.value = queryValue;
        }
        if (filterInput) {
            filterInput.addEventListener('input', applyFilter);
        }
        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilter);
        }
        applyFilter();
    }

    const hero = document.querySelector('[data-hero]');
    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let current = 0;
        let timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('is-active', position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('is-active', position === current);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.dataset.heroDot || 0));
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }
})();
