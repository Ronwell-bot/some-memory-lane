/* Shared music control for pages after the landing interaction. */
(function setupSessionMusic() {
  const preferenceKey = "memoryLaneMusicEnabled";
  const isFallback = window.location.pathname.endsWith("fallback.html");
  const assetPrefix = isFallback ? "" : "../";
  const musicSource = `${assetPrefix}assets/music/notcuteanymore.mp3`;
  const iconSource = `${assetPrefix}assets/icons/music-note.svg`;

  const music = document.createElement("audio");
  const source = document.createElement("source");
  const toggle = document.createElement("button");
  const icon = document.createElement("img");

  music.id = "sessionMusic";
  music.loop = true;
  source.src = musicSource;
  source.type = "audio/mpeg";
  music.appendChild(source);
  music.hidden = true;

  toggle.type = "button";
  toggle.className = "session-music-toggle";
  toggle.title = "Play music";
  toggle.setAttribute("aria-label", "Play music");
  toggle.setAttribute("aria-pressed", "false");

  icon.src = iconSource;
  icon.alt = "Play music";
  toggle.appendChild(icon);
  document.body.append(music, toggle);

  let playing = false;

  function updateControl() {
    toggle.classList.toggle("is-playing", playing);
    toggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.title = playing ? "Pause music" : "Play music";
    icon.alt = playing ? "Pause music" : "Play music";
  }

  function markUnavailable() {
    toggle.classList.add("is-unavailable");
    toggle.title = "Music is unavailable";
    toggle.setAttribute("aria-label", "Music is unavailable");
  }

  toggle.addEventListener("click", () => {
    if (playing) {
      music.pause();
      playing = false;
      localStorage.setItem(preferenceKey, "disabled");
      updateControl();
      return;
    }

    music
      .play()
      .then(() => {
        playing = true;
        localStorage.setItem(preferenceKey, "enabled");
        toggle.classList.remove("is-unavailable");
        updateControl();
      })
      .catch(() => {
        markUnavailable();
      });
  });

  music.addEventListener("ended", () => {
    playing = false;
    updateControl();
  });

  updateControl();

  if (localStorage.getItem(preferenceKey) === "enabled") {
    music
      .play()
      .then(() => {
        playing = true;
        updateControl();
      })
      .catch(() => {
        markUnavailable();
      });
  }
})();
