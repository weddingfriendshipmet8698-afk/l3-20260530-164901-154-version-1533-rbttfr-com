(function () {
    const player = document.querySelector('[data-player]');
    const video = document.getElementById('mainVideo');
    const button = document.querySelector('[data-play-button]');

    if (!player || !video || !button) {
        return;
    }

    let isReady = false;
    let hlsInstance = null;

    function loadStream() {
        if (isReady) {
            return Promise.resolve();
        }

        const stream = video.dataset.stream;
        if (!stream) {
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            isReady = true;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
            isReady = true;
            return new Promise(function (resolve) {
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                window.setTimeout(resolve, 1200);
            });
        }

        video.src = stream;
        isReady = true;
        return Promise.resolve();
    }

    function start() {
        button.classList.add('is-hidden');
        loadStream().then(function () {
            const playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        });
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
        if (!isReady) {
            start();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.currentTime) {
            button.classList.remove('is-hidden');
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
