(() => {
    const mobileButton = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener("click", () => {
            mobileNav.classList.toggle("is-open");
        });
    }

    const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    let heroIndex = 0;

    const showHero = (index) => {
        if (!heroSlides.length) {
            return;
        }

        heroIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === heroIndex);
        });
        heroDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === heroIndex);
        });
    };

    heroDots.forEach((dot, index) => {
        dot.addEventListener("click", () => showHero(index));
    });

    if (heroSlides.length > 1) {
        window.setInterval(() => showHero(heroIndex + 1), 5200);
    }

    const normalize = (value) => (value || "").toString().toLowerCase().trim();

    const setupFilters = (scope) => {
        const input = scope.querySelector("[data-filter-input]");
        const cards = Array.from(scope.querySelectorAll("[data-movie-card]"));
        const chips = Array.from(scope.querySelectorAll("[data-filter-chip]"));
        const emptyState = scope.querySelector("[data-empty-state]");
        let active = "all";

        if (!cards.length) {
            return;
        }

        const apply = () => {
            const keyword = normalize(input ? input.value : "");
            let visible = 0;

            cards.forEach((card) => {
                const haystack = normalize([
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type
                ].join(" "));
                const matchKeyword = !keyword || haystack.includes(keyword);
                const matchChip = active === "all" || haystack.includes(active);
                const isVisible = matchKeyword && matchChip;
                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        };

        if (input) {
            input.addEventListener("input", apply);
        }

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                active = normalize(chip.dataset.filterChip || "all");
                chips.forEach((item) => item.classList.toggle("is-active", item === chip));
                apply();
            });
        });

        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query && input) {
            input.value = query;
        }

        apply();
    };

    document.querySelectorAll("[data-filter-scope]").forEach(setupFilters);
})();
