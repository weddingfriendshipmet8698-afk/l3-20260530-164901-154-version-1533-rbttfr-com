(() => {
    const player = document.querySelector("[data-player]");

    if (!player) {
        return;
    }

    const video = player.querySelector("video");
    const overlay = player.querySelector("[data-player-overlay]");
    const button = player.querySelector("[data-play-button]");
    const configNode = document.getElementById("player-config");

    if (!video || !overlay || !configNode) {
        return;
    }

    let config = {};

    try {
        config = JSON.parse(configNode.textContent || "{}");
    } catch (error) {
        config = {};
    }

    const src = config.src;
    let started = false;
    let hls = null;

    const attachSource = () => {
        if (!src) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            return;
        }

        video.src = src;
    };

    const start = () => {
        if (!started) {
            started = true;
            attachSource();
        }

        overlay.classList.add("is-hidden");
        const promise = video.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(() => {
                overlay.classList.remove("is-hidden");
            });
        }
    };

    overlay.addEventListener("click", start);

    if (button) {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            start();
        });
    }

    video.addEventListener("click", () => {
        if (!started) {
            start();
        }
    });

    window.addEventListener("beforeunload", () => {
        if (hls) {
            hls.destroy();
        }
    });
})();
