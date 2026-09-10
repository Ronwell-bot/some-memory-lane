const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const portfolioDialog = document.getElementById("portfolioDialog");
const portfolioDialogClose = document.getElementById("portfolioDialogClose");
const portfolioDialogStay = document.getElementById("portfolioDialogStay");
const portfolioDialogConfirm = document.getElementById("portfolioDialogConfirm");

const portfolioUrl = "https://ronwell-bot.github.io/portfolio-cmdb/";

let musicPlaying = false;

musicToggle.addEventListener("click", () => {

    if (!musicPlaying) {

        music.play()
            .then(() => {

                musicPlaying = true;
                musicToggle.textContent = "/";

            })
            .catch(error => {

                console.error("Music could not play:", error);

            });

    } else {

        music.pause();

        musicPlaying = false;

        musicToggle.textContent = "♫";

    }

});

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