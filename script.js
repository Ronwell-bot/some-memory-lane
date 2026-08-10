const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

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