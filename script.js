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

let portfolioDialogReturnFocus = null;

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
  portfolioDialogReturnFocus = document.activeElement;
  portfolioDialog.hidden = false;
  document.body.classList.add("dialog-open");
  portfolioDialogClose.focus();
}

function closePortfolioDialog() {
  portfolioDialog.hidden = true;
  document.body.classList.remove("dialog-open");
  portfolioDialogReturnFocus?.focus();
  portfolioDialogReturnFocus = null;
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
  if (event.key === "Escape" && !portfolioDialog.hidden) {
    event.preventDefault();
    closePortfolioDialog();
    return;
  }

  if (event.key === "Tab" && !portfolioDialog.hidden) {
    const focusable = portfolioDialog.querySelectorAll(
      'button:not([disabled]):not([hidden]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }

  if (event.key === "ArrowLeft" && portfolioDialog.hidden) {
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
