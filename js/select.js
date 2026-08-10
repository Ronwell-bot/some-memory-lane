const selectionGrid = document.getElementById("selectionGrid");
const selectLayout = document.getElementById("selectLayout");
const selectNeed = document.getElementById("selectNeed");
const selectCaptured = document.getElementById("selectCaptured");
const selectChosen = document.getElementById("selectChosen");
const selectNote = document.getElementById("selectNote");
const selectionStatus = document.getElementById("selectionStatus");
const saveSelectionButton = document.getElementById("saveSelection");
const retakeButton = document.getElementById("retakeSession");

const photos = JSON.parse(localStorage.getItem("memoryLanePhotos") || "[]");
const layout = localStorage.getItem("layout") || "Classic Strip";
const requiredPhotos = parseInt(localStorage.getItem("requiredPhotos"), 10) || 4;
const captureMode = parseInt(localStorage.getItem("captureMode"), 10) || photos.length || requiredPhotos;
const bypassAutoEdit = localStorage.getItem("memoryLaneBypassAutoEdit") === "true";

if(bypassAutoEdit){
    localStorage.removeItem("memoryLaneBypassAutoEdit");
}

if(photos.length === requiredPhotos && !bypassAutoEdit){
    const chosenPhotos = photos.slice(0, requiredPhotos);
    localStorage.setItem("memoryLaneSelectedPhotos", JSON.stringify(chosenPhotos));
    localStorage.setItem("memoryLaneSelectedLayout", layout);
    localStorage.setItem("memoryLaneSelectedRequired", String(requiredPhotos));
    localStorage.setItem("memoryLanePendingOutput", "true");
    localStorage.setItem("memoryLaneOutputViewed", "false");
    window.location.replace("../pages/edit.html");
}

selectLayout.textContent = layout;
selectNeed.textContent = requiredPhotos;
selectCaptured.textContent = photos.length;

let selectedIndexes = new Set();

if(photos.length > 0 && photos.length <= requiredPhotos){
    photos.forEach((_, index) => selectedIndexes.add(index));
}

function renderPhotos(){
    if(photos.length === 0){
        selectionGrid.innerHTML = '<div class="capture-empty">No captured photos found. Go back and take pictures first.</div>';
        selectNote.textContent = "You need captured photos before selecting them.";
        saveSelectionButton.disabled = true;
        return;
    }

    selectionGrid.innerHTML = photos.map((photo, index) => {
        const isSelected = selectedIndexes.has(index);
        return `
            <button type="button" class="selection-card ${isSelected ? 'is-selected' : ''}" data-index="${index}">
                <img src="${photo}" alt="Captured photo ${index + 1}">
                <span class="selection-index">${index + 1}</span>
                <span class="selection-check">${isSelected ? 'Selected' : 'Tap to choose'}</span>
            </button>
        `;
    }).join("");

    selectionGrid.querySelectorAll(".selection-card").forEach(card => {
        card.addEventListener("click", () => {
            const index = Number(card.dataset.index);

            if(selectedIndexes.has(index)){
                selectedIndexes.delete(index);
                selectionStatus.textContent = "Photo removed from selection.";
            }
            else if(selectedIndexes.size < requiredPhotos){
                selectedIndexes.add(index);
                selectionStatus.textContent = "Photo added to selection.";
            }
            else{
                selectionStatus.textContent = `Choose only ${requiredPhotos} photos for this layout.`;
                return;
            }

            updateSelectionState();
            renderPhotos();
        });
    });
}

function updateSelectionState(){
    selectChosen.textContent = selectedIndexes.size;
    saveSelectionButton.disabled = selectedIndexes.size !== requiredPhotos;

    if(selectedIndexes.size === requiredPhotos){
        selectNote.textContent = `Perfect. You selected ${requiredPhotos} photos for ${layout}.`;
    }
    else{
        selectNote.textContent = `Select ${requiredPhotos} photos for the strip layout.`;
    }
}

saveSelectionButton.addEventListener("click", () => {
    if(selectedIndexes.size !== requiredPhotos){
        selectionStatus.textContent = `Please choose exactly ${requiredPhotos} photos first.`;
        return;
    }

    const chosenPhotos = Array.from(selectedIndexes)
        .sort((a, b) => a - b)
        .map(index => photos[index]);

    localStorage.setItem("memoryLaneSelectedPhotos", JSON.stringify(chosenPhotos));
    localStorage.setItem("memoryLaneSelectedLayout", layout);
    localStorage.setItem("memoryLaneSelectedRequired", String(requiredPhotos));
    localStorage.setItem("memoryLanePendingOutput", "true");
    localStorage.setItem("memoryLaneOutputViewed", "false");

    window.location.href = "../pages/edit.html";
});

retakeButton.addEventListener("click", () => {
    localStorage.removeItem("memoryLanePhotos");
    localStorage.removeItem("memoryLaneSelectedPhotos");
    localStorage.removeItem("memoryLanePendingOutput");
    localStorage.removeItem("memoryLaneOutputViewed");
    window.location.href = "../camera/camera.html";
});

updateSelectionState();
renderPhotos();