(function () {
  var root = document.querySelector('[data-player]');

  if (!root) {
    return;
  }

  var video = root.querySelector('video');
  var button = root.querySelector('[data-play]');
  var stream = root.getAttribute('data-stream');
  var started = false;
  var hlsInstance = null;

  function startVideo() {
    if (!video || !stream) {
      return;
    }

    root.classList.add('is-playing');

    if (started) {
      video.play().catch(function () {});
      return;
    }

    started = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = stream;
    video.play().catch(function () {});
  }

  if (button) {
    button.addEventListener('click', startVideo);
  }

  video.addEventListener('click', function () {
    if (!started) {
      startVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
