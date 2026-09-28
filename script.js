const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const portfolioDialog = document.getElementById("portfolioDialog");
const portfolioDialogClose = document.getElementById("portfolioDialogClose");
const portfolioDialogStay = document.getElementById("portfolioDialogStay");
const portfolioDialogConfirm = document.getElementById(
  "portfolioDialogConfirm",
);
const enterButton = document.querySelector(".enter-button");
const coinTransition = document.getElementById("coinTransition");

const portfolioUrl = "https://ronwell-bot.github.io/portfolio-cmdb/";

let musicPlaying = false;

const musicPreferenceKey = "memoryLaneMusicEnabled";

function updateMusicControl() {
  musicToggle.classList.toggle("playing", musicPlaying);
  musicToggle.setAttribute(
    "aria-label",
    musicPlaying ? "Pause music" : "Play music",
  );
  musicToggle.setAttribute("aria-pressed", String(musicPlaying));
  musicIcon.alt = musicPlaying ? "Pause music" : "Play music";
}

musicToggle.addEventListener("click", () => {
  if (!musicPlaying) {
    music
      .play()
      .then(() => {
        musicPlaying = true;
        localStorage.setItem(musicPreferenceKey, "enabled");
        updateMusicControl();
      })
      .catch((error) => {
        console.error("Music could not play:", error);
      });
  } else {
    music.pause();

    musicPlaying = false;
    localStorage.setItem(musicPreferenceKey, "disabled");
    updateMusicControl();
  }
});

music.addEventListener("ended", () => {
  musicPlaying = false;
  updateMusicControl();
});

updateMusicControl();

function openPortfolioDialog() {
  portfolioDialog.hidden = false;
  document.body.classList.add("dialog-open");
  portfolioDialogClose.focus();
}

function closePortfolioDialog() {
  portfolioDialog.hidden = true;
  document.body.classList.remove("dialog-open");
}

portfolioDialogClose.addEventListener("click", closePortfolioDialog);
portfolioDialogStay.addEventListener("click", closePortfolioDialog);

portfolioDialog.addEventListener("click", (event) => {
  if (event.target === portfolioDialog) {
    closePortfolioDialog();
  }
});

portfolioDialogConfirm.addEventListener("click", () => {
  window.location.href = portfolioUrl;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "ArrowLeft") {
    event.preventDefault();
    openPortfolioDialog();
  }
});

if (enterButton) {
  enterButton.addEventListener("click", (event) => {
    event.preventDefault();
    const destination = enterButton.href;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      window.location.href = destination;
      return;
    }

    coinTransition.classList.add("show");
    window.setTimeout(() => {
      window.location.href = destination;
    }, 1050);
  });
}
