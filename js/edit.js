/* ==========================================
   SOME MEMORY LANE
   EDIT / DEVELOPING / STRIP ENGINE
   FIXED VERSION
========================================== */

/* ==========================================
   ELEMENTS
========================================== */

const developingScreen = document.getElementById("developingScreen");

const resultScreen = document.getElementById("resultScreen");

const finalStrip = document.getElementById("finalStrip");

const developingProgress = document.getElementById("developingProgress");

const developingStatus = document.getElementById("developingStatus");

const resultLayout = document.getElementById("resultLayout");

const resultDesign = document.getElementById("resultDesign");

const downloadButton = document.getElementById("downloadButton");

const printButton = document.getElementById("printButton");

const finishButton = document.getElementById("finishButton");

const finishDialog = document.getElementById("finishDialog");

const finishDialogClose = document.getElementById("finishDialogClose");

const keepPrivateButton = document.getElementById("keepPrivateButton");

const featuredWallButton = document.getElementById("featuredWallButton");

const downloadAndFinishButton = document.getElementById(
  "downloadAndFinishButton",
);
const timelapsePanel = document.getElementById("timelapsePanel");
const timelapseStatus = document.getElementById("timelapseStatus");
const timelapseVideo = document.getElementById("timelapseVideo");
const downloadTimelapseButton = document.getElementById(
  "downloadTimelapseButton",
);

let finishDialogReturnFocus = null;
let timelapseUrl = "";

/* ==========================================
   LOAD SESSION
========================================== */

function readSession() {
  try {
    const storedSession = sessionStorage.getItem("memoryLaneSession");

    return storedSession ? JSON.parse(storedSession) : null;
  } catch (error) {
    console.error("Unable to read the photo booth session:", error);

    return null;
  }

  async function createTimelapse(sourceBlob) {
    if (!sourceBlob || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      throw new Error("Timelapse video is not supported in this browser.");
    }

    const sourceUrl = URL.createObjectURL(sourceBlob);
    const sourceVideo = document.createElement("video");
    sourceVideo.src = sourceUrl;
    sourceVideo.muted = true;
    sourceVideo.loop = true;
    sourceVideo.playsInline = true;
    await new Promise((resolve, reject) => {
      sourceVideo.onloadedmetadata = resolve;
      sourceVideo.onerror = () => reject(new Error("Could not load the recorded session."));
    });

    const width = Math.min(sourceVideo.videoWidth || 640, 640);
    const height = Math.max(
      1,
      Math.round(width * ((sourceVideo.videoHeight || 360) / (sourceVideo.videoWidth || 640))),
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const stream = canvas.captureStream(24);
    const mimeType = ["video/webm;codecs=vp8", "video/webm"].find((type) =>
      MediaRecorder.isTypeSupported(type),
    );
    if (!context || !mimeType) {
      URL.revokeObjectURL(sourceUrl);
      throw new Error("Timelapse encoding is not supported in this browser.");
    }

    const chunks = [];
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 600000,
    });
    recorder.ondataavailable = (event) => {
      if (event.data.size) {
        chunks.push(event.data);
      }
    };
    await sourceVideo.play();
    recorder.start(500);
    const startedAt = performance.now();

    await new Promise((resolve) => {
      function drawFrame(now) {
        context.fillStyle = "#f7f1e7";
        context.fillRect(0, 0, width, height);
        context.drawImage(sourceVideo, 0, 0, width, height);
        if (now - startedAt < 30000) {
          requestAnimationFrame(drawFrame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(drawFrame);
    });

    await new Promise((resolve) => {
      recorder.onstop = resolve;
      recorder.stop();
    });
    sourceVideo.pause();
    URL.revokeObjectURL(sourceUrl);
    return new Blob(chunks, { type: mimeType });
  }

  async function prepareTimelapse() {
    if (savedSession?.workflowMode !== "camera" || !timelapsePanel) {
      return;
    }

    timelapsePanel.hidden = false;
    try {
      const media = await window.MemoryLanePhotoStorage.readMedia(savedSession.id);
      const blob = await createTimelapse(media?.blob);
      timelapseUrl = URL.createObjectURL(blob);
      timelapseVideo.src = timelapseUrl;
      timelapseVideo.hidden = false;
      downloadTimelapseButton.hidden = false;
      timelapseStatus.textContent = "Your 30-second timelapse is ready.";
    } catch (error) {
      console.warn("Timelapse unavailable:", error);
      timelapseStatus.textContent =
        "The photo strip is ready. Timelapse video is unavailable in this browser.";
    }
  }

  function downloadTimelapse() {
    if (!timelapseUrl) {
      return;
    }
    const link = document.createElement("a");
    link.href = timelapseUrl;
    link.download = "some-memory-lane-timelapse.webm";
    link.click();
  }
}

async function createTimelapse(sourceBlob) {
  if (!sourceBlob || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    throw new Error("Timelapse video is not supported in this browser.");
  }
  const sourceUrl = URL.createObjectURL(sourceBlob);
  const sourceVideo = document.createElement("video");
  sourceVideo.src = sourceUrl;
  sourceVideo.muted = true;
  sourceVideo.loop = true;
  sourceVideo.playsInline = true;
  await new Promise((resolve, reject) => {
    sourceVideo.onloadedmetadata = resolve;
    sourceVideo.onerror = () => reject(new Error("Could not load the recorded session."));
  });
  const width = Math.min(sourceVideo.videoWidth || 640, 640);
  const height = Math.max(1, Math.round(width * ((sourceVideo.videoHeight || 360) /
    (sourceVideo.videoWidth || 640))));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const stream = canvas.captureStream(24);
  const mimeType = ["video/webm;codecs=vp8", "video/webm"].find((type) =>
    MediaRecorder.isTypeSupported(type));
  if (!context || !mimeType) {
    URL.revokeObjectURL(sourceUrl);
    throw new Error("Timelapse encoding is not supported in this browser.");
  }
  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 600000 });
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };
  await sourceVideo.play();
  recorder.start(500);
  await new Promise((resolve) => {
    const startedAt = performance.now();
    function drawFrame(now) {
      context.fillStyle = "#f7f1e7";
      context.fillRect(0, 0, width, height);
      context.drawImage(sourceVideo, 0, 0, width, height);
      if (now - startedAt < 30000) requestAnimationFrame(drawFrame);
      else resolve();
    }
    requestAnimationFrame(drawFrame);
  });
  await new Promise((resolve) => {
    recorder.onstop = resolve;
    recorder.stop();
  });
  sourceVideo.pause();
  URL.revokeObjectURL(sourceUrl);
  return new Blob(chunks, { type: mimeType });
}

async function prepareTimelapse() {
  if (!savedSession?.id || !timelapsePanel) return;
  timelapsePanel.hidden = false;
  try {
    const media = await window.MemoryLanePhotoStorage.readMedia(savedSession.id);
    if (!media?.blob) {
      timelapsePanel.hidden = true;
      return;
    }
    const blob = await createTimelapse(media?.blob);
    timelapseUrl = URL.createObjectURL(blob);
    timelapseVideo.src = timelapseUrl;
    timelapseVideo.hidden = false;
    downloadTimelapseButton.hidden = false;
    timelapseStatus.textContent = "Your 30-second timelapse is ready.";
  } catch (error) {
    console.warn("Timelapse unavailable:", error);
    timelapseStatus.textContent =
      "The photo strip is ready. Timelapse video is unavailable in this browser.";
  }
}

function downloadTimelapse() {
  if (!timelapseUrl) return;
  const link = document.createElement("a");
  link.href = timelapseUrl;
  link.download = "some-memory-lane-timelapse.webm";
  link.click();
}

const savedSession = readSession();

/* ==========================================
   USER SELECTION
========================================== */

const layout = savedSession?.layout || "Layout 1";

const design = savedSession?.design || "Design 1";

/*
    Normal value:

        layout1-design1

    Older versions may save:

        blue-pattern-4xs.jpeg
*/

const savedStrip = savedSession?.strip || "";

const catalogEntry = window.MemoryLaneStripCatalog?.get(savedStrip);

/* ==========================================
   LOAD PHOTOS
========================================== */

let photos = [];

async function restoreStoredPhotos() {
  if (!window.MemoryLanePhotoStorage) {
    throw new Error("Photo storage is unavailable.");
  }

  if (!savedSession?.id) {
    throw new Error("A session ID is required to restore photos.");
  }

  const storedPhotos = await window.MemoryLanePhotoStorage.read(
    savedSession.id,
  );

  if (storedPhotos.length) {
    photos = storedPhotos;
    return;
  }

  photos = await window.MemoryLanePhotoStorage.migrate(savedSession.id);
}

/* ==========================================
   DEBUG
========================================== */

console.log("Memory Lane Session:", savedSession);

console.log("Saved Strip Value:", savedStrip);

console.log("Photos:", photos.length);

/* ==========================================
   STRIP TEMPLATES
========================================== */

const stripTemplates = {
  /* ======================================
       LAYOUT 1 — DESIGN 1
       4 STRAIGHT PHOTOS
    ====================================== */

  "layout1-design1": {
    image: "../assets/strip design/blue-pattern-4xs.jpeg",

    width: 426,

    height: 1332,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 47,
        y: 53,
        width: 332,
        height: 272,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 47,
        y: 347,
        width: 332,
        height: 275,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 47,
        y: 645,
        width: 332,
        height: 273,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 47,
        y: 943,
        width: 332,
        height: 272,
      },
    ],
  },

  /* ======================================
       LAYOUT 1 — DESIGN 2
       4 STRAIGHT PHOTOS
    ====================================== */

  "layout1-design2": {
    image: "../assets/strip design/green-pattern-4xs.jpeg",

    width: 424,

    height: 1313,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 54,
        y: 67,
        width: 323,
        height: 265,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 54,
        y: 353,
        width: 323,
        height: 265,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 58,
        y: 645,
        width: 323,
        height: 255,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 54,
        y: 931,
        width: 323,
        height: 264,
      },
    ],
  },

  /* ======================================
       LAYOUT 1 — DESIGN 3
       4 STRAIGHT PHOTOS
    ====================================== */

  "layout1-design3": {
    image: "../assets/strip design/red-pattern-4xs.jpeg",

    width: 430,

    height: 1313,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 54,
        y: 67,
        width: 323,
        height: 265,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 54,
        y: 353,
        width: 323,
        height: 265,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 55,
        y: 640,
        width: 323,
        height: 255,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 54,
        y: 931,
        width: 323,
        height: 264,
      },
    ],
  },

  /* ======================================
       LAYOUT 1 — DESIGN 4
       4 STRAIGHT PHOTOS
    ====================================== */

  "layout1-design4": {
    image: "../assets/strip design/yellow-pattern-4xs.jpeg",

    width: 475,

    height: 1330,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 65,
        y: 80,
        width: 323,
        height: 265,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 68,
        y: 371,
        width: 323,
        height: 265,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 68,
        y: 664,
        width: 323,
        height: 260,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 67,
        y: 950,
        width: 323,
        height: 264,
      },
    ],
  },

  "layout1-design6": {
    image: "../assets/strip design/cat-4xs.jpg",

    width: 430,

    height: 1330,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 35,
        y: 45,
        width: 360,
        height: 265,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 35,
        y: 335,
        width: 365,
        height: 265,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 35,
        y: 630,
        width: 365,
        height: 265,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 35,
        y: 925,
        width: 365,
        height: 265,
      },
    ],
  },

  "layout1-design7": {
    image: "../assets/strip design/cat2-4xs.jpg",

    width: 430,

    height: 1330,

    slots: [
      /* PHOTO 1 */

      {
        photoIndex: 0,

        x: 34,
        y: 163,
        width: 362,
        height: 262,
      },

      /* PHOTO 2 */

      {
        photoIndex: 1,

        x: 34,
        y: 454,
        width: 362,
        height: 262,
      },

      /* PHOTO 3 */

      {
        photoIndex: 2,

        x: 34,
        y: 746,
        width: 362,
        height: 262,
      },

      /* PHOTO 4 */

      {
        photoIndex: 3,

        x: 34,
        y: 1041,
        width: 362,
        height: 262,
      },
    ],
  },

  "layout1-design21": {
    image: "../assets/strip design/14.png",
    width: 450,
    height: 1300,
    slots: [
      { photoIndex: 0, x: 38, y: 207, width: 375, height: 222 },
      { photoIndex: 1, x: 38, y: 441, width: 375, height: 222 },
      { photoIndex: 2, x: 38, y: 677, width: 375, height: 222 },
      { photoIndex: 3, x: 38, y: 912, width: 375, height: 220 },
    ],
  },

  "layout1-design22": {
    image: "../assets/strip design/15.png",
    width: 450,
    height: 1300,
    slots: [
      { photoIndex: 0, x: 24, y: 17, width: 401, height: 282 },
      { photoIndex: 1, x: 24, y: 314, width: 401, height: 284 },
      { photoIndex: 2, x: 24, y: 613, width: 401, height: 284 },
      { photoIndex: 3, x: 24, y: 912, width: 401, height: 284 },
    ],
  },

  "layout1-design23": {
    image: "../assets/strip design/16.png",
    width: 450,
    height: 1300,
    slots: [
      { photoIndex: 0, x: 24, y: 17, width: 401, height: 282 },
      { photoIndex: 1, x: 24, y: 314, width: 401, height: 284 },
      { photoIndex: 2, x: 24, y: 613, width: 401, height: 284 },
      { photoIndex: 3, x: 24, y: 912, width: 401, height: 284 },
    ],
  },

  "layout1-design24": {
    image: "../assets/strip design/17.png",
    width: 450,
    height: 1300,
    slots: [
      { photoIndex: 0, x: 15, y: 196, width: 420, height: 222 },
      { photoIndex: 1, x: 15, y: 508, width: 420, height: 222 },
      { photoIndex: 2, x: 15, y: 741, width: 420, height: 222 },
      { photoIndex: 3, x: 17, y: 975, width: 420, height: 222 },
    ],
  },

  "layout1-design25": {
    image: "../assets/strip design/18.png",
    width: 450,
    height: 1300,
    slots: [
      { photoIndex: 0, x: 42, y: 211, width: 366, height: 213 },
      { photoIndex: 1, x: 42, y: 446, width: 366, height: 213 },
      { photoIndex: 2, x: 42, y: 681, width: 366, height: 213 },
      { photoIndex: 3, x: 42, y: 914, width: 366, height: 212 },
    ],
  },

  "layout2-design1": {
    image: "../assets/strip design/blue-pattern-8xs.jpeg",

    width: 600,

    height: 1200,

    slots: [
      /* ==================================
           PHOTO 1 — LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 40,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

      {
        photoIndex: 0,

        x: 320,
        y: 40,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 2 — LEFT
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 300,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 320,
        y: 300,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

      {
        photoIndex: 2,

        x: 320,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — LEFT
        ================================== */

      {
        photoIndex: 3,

        x: 35,
        y: 820,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 320,
        y: 820,
        width: 250,
        height: 232,
      },
    ],
  },

  "layout2-design2": {
    image: "../assets/strip design/green-pattern-8xs.jpeg",

    width: 600,

    height: 1200,

    slots: [
      /* ==================================
           PHOTO 1 — LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 40,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

      {
        photoIndex: 0,

        x: 320,
        y: 40,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 2 — LEFT
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 300,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 320,
        y: 300,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

      {
        photoIndex: 2,

        x: 320,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — LEFT
        ================================== */

      {
        photoIndex: 3,

        x: 35,
        y: 820,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 320,
        y: 820,
        width: 250,
        height: 232,
      },
    ],
  },

  "layout2-design3": {
    image: "../assets/strip design/red-pattern-8xs.jpeg",

    width: 600,

    height: 1200,

    slots: [
      /* ==================================
           PHOTO 1 — LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 50,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

      {
        photoIndex: 0,

        x: 320,
        y: 50,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 2 — LEFT
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 310,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 320,
        y: 310,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 570,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

      {
        photoIndex: 2,

        x: 320,
        y: 570,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — LEFT
        ================================== */

      {
        photoIndex: 3,

        x: 35,
        y: 830,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 320,
        y: 830,
        width: 250,
        height: 232,
      },
    ],
  },

  "layout2-design4": {
    image: "../assets/strip design/yellow-pattern-8xs.jpeg",

    width: 600,

    height: 1200,

    slots: [
      /* ==================================
           PHOTO 1 — LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 33,
        y: 45,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

      {
        photoIndex: 0,

        x: 320,
        y: 45,
        width: 250,
        height: 234,
      },

      /* ==================================
           PHOTO 2 — LEFT
        ================================== */

      {
        photoIndex: 1,

        x: 33,
        y: 305,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 320,
        y: 305,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 33,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

      {
        photoIndex: 2,

        x: 320,
        y: 560,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — LEFT
        ================================== */

      {
        photoIndex: 3,

        x: 33,
        y: 820,
        width: 250,
        height: 232,
      },

      /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 320,
        y: 820,
        width: 250,
        height: 232,
      },
    ],
  },

  "layout3-design1": {
    image: "../assets/strip design/blue-pattern-4xg.jpeg",

    width: 650,

    height: 650,

    slots: [
      /* ==================================
           PHOTO 1 — TOP LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 35,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 330,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 315,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 330,
        y: 315,

        width: 280,
        height: 265,
      },
    ],
  },

  "layout3-design2": {
    image: "../assets/strip design/green-pattern-4xg.jpeg",

    width: 650,

    height: 650,

    slots: [
      /* ==================================
           PHOTO 1 — TOP LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 35,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 330,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 315,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 330,
        y: 315,

        width: 280,
        height: 265,
      },
    ],
  },

  "layout3-design3": {
    image: "../assets/strip design/red-pattern-4xg.jpeg",

    width: 650,

    height: 650,

    slots: [
      /* ==================================
           PHOTO 1 — TOP LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 35,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 330,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 315,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 330,
        y: 315,

        width: 280,
        height: 265,
      },
    ],
  },

  "layout3-design4": {
    image: "../assets/strip design/yellow-pattern-4xg.jpeg",

    width: 650,

    height: 650,

    slots: [
      /* ==================================
           PHOTO 1 — TOP LEFT
        ================================== */

      {
        photoIndex: 0,

        x: 35,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

      {
        photoIndex: 1,

        x: 330,
        y: 35,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 315,

        width: 280,
        height: 265,
      },

      /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

      {
        photoIndex: 3,

        x: 330,
        y: 315,

        width: 280,
        height: 265,
      },
    ],
  },

  "layout4-design1": {
    image: "../assets/strip design/blue-pattern-3xs.jpeg",

    width: 350,

    height: 1050,

    slots: [
      /* ==================================
           PHOTO 1 — TOP
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 45,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 350,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

      {
        photoIndex: 2,

        x: 30,
        y: 655,

        width: 290,
        height: 275,
      },
    ],
  },

  "layout4-design2": {
    image: "../assets/strip design/green-pattern-3xs.jpeg",

    width: 350,

    height: 1050,

    slots: [
      /* ==================================
           PHOTO 1 — TOP
        ================================== */

      {
        photoIndex: 0,

        x: 35,
        y: 45,

        width: 280,
        height: 275,
      },

      /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

      {
        photoIndex: 1,

        x: 35,
        y: 345,

        width: 285,
        height: 275,
      },

      /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

      {
        photoIndex: 2,

        x: 35,
        y: 650,

        width: 285,
        height: 275,
      },
    ],
  },

  "layout4-design3": {
    image: "../assets/strip design/red-pattern-3xs.jpeg",

    width: 350,

    height: 1050,

    slots: [
      /* ==================================
           PHOTO 1 — TOP
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 45,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 350,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

      {
        photoIndex: 2,

        x: 30,
        y: 655,

        width: 290,
        height: 275,
      },
    ],
  },

  "layout4-design4": {
    image: "../assets/strip design/yellow-pattern-3xs.jpeg",

    width: 350,

    height: 1050,

    slots: [
      /* ==================================
           PHOTO 1 — TOP
        ================================== */

      {
        photoIndex: 0,

        x: 30,
        y: 45,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

      {
        photoIndex: 1,

        x: 30,
        y: 350,

        width: 290,
        height: 275,
      },

      /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

      {
        photoIndex: 2,

        x: 30,
        y: 655,

        width: 290,
        height: 275,
      },
    ],
  },

  "layout5-design1": {
    image: "../assets/strip design/blue-pattern-instax.jpeg",

    width: 970,

    height: 1139,

    slots: [
      /* ==================================
           PHOTO 1 — INSTAX PHOTO AREA
        ================================== */

      {
        photoIndex: 0,

        x: 60,
        y: 55,

        width: 840,
        height: 960,
      },
    ],
  },

  "layout5-design2": {
    image: "../assets/strip design/green-pattern-instax.jpeg",

    width: 970,

    height: 1139,

    slots: [
      /* ==================================
           PHOTO 1 — INSTAX PHOTO AREA
        ================================== */

      {
        photoIndex: 0,

        x: 60,
        y: 55,

        width: 840,
        height: 960,
      },
    ],
  },

  "layout5-design3": {
    image: "../assets/strip design/red-pattern-instax.jpeg",

    width: 970,

    height: 1139,

    slots: [
      /* ==================================
           PHOTO 1 — INSTAX PHOTO AREA
        ================================== */

      {
        photoIndex: 0,

        x: 60,
        y: 55,

        width: 840,
        height: 955,
      },
    ],
  },

  "layout5-design4": {
    image: "../assets/strip design/yellow-pattern-instax.jpeg",

    width: 970,

    height: 1139,

    slots: [
      /* ==================================
           PHOTO 1 — INSTAX PHOTO AREA
        ================================== */

      {
        photoIndex: 0,

        x: 60,
        y: 55,

        width: 840,
        height: 955,
      },
    ],
  },
};

/* ==========================================
   NUMBERED COLLECTION

   The 1.png–13.png assets share one 450 × 1300 canvas
   and the same four transparent photo windows.
========================================== */

const numberedStripSlots = [
  { photoIndex: 0, x: 13, y: 13, width: 424, height: 283 },
  { photoIndex: 1, x: 13, y: 315, width: 424, height: 283 },
  { photoIndex: 2, x: 13, y: 617, width: 424, height: 283 },
  { photoIndex: 3, x: 13, y: 919, width: 424, height: 283 },
];

for (let imageNumber = 1; imageNumber <= 13; imageNumber++) {
  stripTemplates[`layout1-design${imageNumber + 7}`] = {
    image: `../assets/strip design/${imageNumber}.png`,
    width: 450,
    height: 1300,
    slots: numberedStripSlots.map((slot) => ({ ...slot })),
  };
}

/* ==========================================
   FIND TEMPLATE
========================================== */

/*
    First:
    Try the normal template key.

        layout1-design1
        layout1-design2
        layout2-design1
*/

let template = stripTemplates[savedStrip];

if (template && catalogEntry) {
  template = {
    ...template,
    image: `../${catalogEntry.outputTemplate}`,
    width: catalogEntry.width || template.width,
    height: catalogEntry.height || template.height,
  };
}

/*
    Fallback:
    If savedStrip contains the actual
    filename instead:

        blue-pattern-4xs.jpeg

    find the template whose image
    matches that filename.
*/

if (!template) {
  template = Object.values(stripTemplates).find((item) => {
    const filename = item.image.split("/").pop();

    return filename === savedStrip;
  });
}

/* ==========================================
   FIND TEMPLATE KEY
========================================== */

let selectedTemplateKey = Object.keys(stripTemplates).find(
  (key) => stripTemplates[key] === template,
);

console.log("Selected Template:", selectedTemplateKey || "Not Found");

console.log("Selected Template Data:", template);

/* ==========================================
   DEVELOPING SCREEN
========================================== */

function showPrinting() {
  /*
       Show developing screen.
    */

  if (developingScreen) {
    developingScreen.style.display = "flex";
  }

  /*
       Hide result screen.
    */

  if (resultScreen) {
    resultScreen.style.display = "none";
  }

  /*
       Reset progress.
    */

  if (developingProgress) {
    developingProgress.style.width = "10%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Preparing your photos...";
  }
}

/* ==========================================
   ERROR SCREEN
========================================== */

function showError(message) {
  console.error("Memory Lane:", message);

  /*
       Hide developing screen.
    */

  if (developingScreen) {
    developingScreen.style.display = "none";
  }

  /*
       Show error.
    */

  if (resultScreen) {
    resultScreen.style.display = "flex";

    resultScreen.innerHTML = `

            <div class="result-header">

                <p class="section-label">
                    SOME MEMORY LANE
                </p>

                <h1>
                    Something went wrong
                </h1>

                <p>
                    ${message}
                </p>

            </div>


            <div class="result-actions">

                <button
                    type="button"
                    onclick="location.reload()"
                    class="primary-btn"
                >
                    Try Again
                </button>

            </div>

        `;
  }
}

/* ==========================================
   LOAD IMAGE
========================================== */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Image source is empty."));

      return;
    }

    const image = new Image();

    image.onload = () => {
      console.log("Image loaded successfully:", src);

      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Could not load image: " + src));
    };

    image.src = src;
  });
}

/* ==========================================
   DRAW PHOTO INTO SLOT
========================================== */

function drawImageCover(ctx, image, slot) {
  const imageRatio = image.width / image.height;

  const slotRatio = slot.width / slot.height;

  let sourceWidth = image.width;

  let sourceHeight = image.height;

  let sourceX = 0;

  let sourceY = 0;

  /* ======================================
       CROP LEFT / RIGHT
    ====================================== */

  if (imageRatio > slotRatio) {
    sourceWidth = image.height * slotRatio;

    sourceX = (image.width - sourceWidth) / 2;
  } else if (imageRatio < slotRatio) {
    /* ======================================
       CROP TOP / BOTTOM
    ====================================== */
    sourceHeight = image.width / slotRatio;

    sourceY = (image.height - sourceHeight) / 2;
  }

  /* ======================================
       DRAW
    ====================================== */

  ctx.drawImage(
    image,

    sourceX,
    sourceY,

    sourceWidth,
    sourceHeight,

    slot.x,
    slot.y,
    slot.width,
    slot.height,
  );
}

/* ==========================================
   CREATE STRIP
========================================== */

async function createStrip() {
  console.log("Creating strip...");

  /* ======================================
       CHECK TEMPLATE
    ====================================== */

  if (!template) {
    throw new Error(`Template "${savedStrip}" has not been configured yet.`);
  }

  /* ======================================
       DETERMINE REQUIRED PHOTOS
    ====================================== */

  /*
       Important:

       The number of slots is NOT necessarily
       the number of photos required.

       Example:

       Layout 2:

       photoIndex 0
       photoIndex 0
       photoIndex 1
       photoIndex 1
       photoIndex 2
       photoIndex 2
       photoIndex 3
       photoIndex 3

       This still only requires 4 photos.
    */

  const requiredPhotos = template.slots.reduce(
    (highest, slot) => {
      const photoIndex = slot.photoIndex !== undefined ? slot.photoIndex : 0;

      return Math.max(highest, photoIndex + 1);
    },

    0,
  );

  console.log("Required Photos:", requiredPhotos);

  /* ======================================
       CHECK PHOTOS
    ====================================== */

  if (photos.length < requiredPhotos) {
    throw new Error(
      `This design needs ${requiredPhotos} photos, ` +
        `but only ${photos.length} were found.`,
    );
  }

  /* ======================================
       CREATE CANVAS
    ====================================== */

  const canvas = document.createElement("canvas");

  canvas.width = template.width;

  canvas.height = template.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  /* ======================================
       WHITE BACKGROUND
    ====================================== */

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* ======================================
       UPDATE PROGRESS
    ====================================== */

  if (developingProgress) {
    developingProgress.style.width = "30%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Loading your photos...";
  }

  /* ======================================
       LOAD PHOTOS
    ====================================== */

  console.log("Loading captured photos...");

  /*
       Load photos according to
       photoIndex.

       This allows duplicate slots.

       Example:

       Slot 1 → photoIndex 0
       Slot 2 → photoIndex 0

       Both use Photo 1.
    */

  const loadedPhotos = await Promise.all(
    template.slots.map((slot) => {
      const photoIndex = slot.photoIndex !== undefined ? slot.photoIndex : 0;

      return loadImage(photos[photoIndex]);
    }),
  );

  console.log("All photos loaded.");

  /* ======================================
       UPDATE PROGRESS
    ====================================== */

  if (developingProgress) {
    developingProgress.style.width = "60%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Putting your memories together...";
  }

  /* ======================================
       DRAW PHOTOS
    ====================================== */

  loadedPhotos.forEach((photo, index) => {
    drawImageCover(
      ctx,

      photo,

      template.slots[index],
    );
  });

  /* ======================================
       LOAD TEMPLATE IMAGE
    ====================================== */

  console.log("Loading strip template:", template.image);

  if (developingProgress) {
    developingProgress.style.width = "75%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Adding your strip design...";
  }

  const templateImage = await loadImage(template.image);

  console.log("Strip template loaded.");

  /* ======================================
       DRAW TEMPLATE
    ====================================== */

  /*
       The template contains the
       decorative design.

       Multiply allows the white
       areas of the JPEG to blend
       with the photos underneath.
    */

  /*
     JPEG frames use white backgrounds and need multiply blending.
     The numbered PNG frames have transparent photo windows, so normal
     source-over drawing preserves their original colors.
  */
  ctx.globalCompositeOperation = template.image.endsWith(".png")
    ? "source-over"
    : "multiply";

  ctx.drawImage(
    templateImage,

    0,
    0,

    template.width,
    template.height,
  );

  ctx.globalCompositeOperation = "source-over";

  /* ======================================
       COMPLETE PROGRESS
    ====================================== */

  if (developingProgress) {
    developingProgress.style.width = "90%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Finishing your memory strip...";
  }

  console.log("Strip successfully created.");

  return canvas;
}

/* ==========================================
   DISPLAY STRIP
========================================== */

function displayStrip(canvas) {
  if (!finalStrip) {
    console.error("Final strip container was not found.");

    return;
  }

  /* ======================================
       CLEAR OLD RESULT
    ====================================== */

  finalStrip.innerHTML = "";

  /* ======================================
       CREATE IMAGE
    ====================================== */

  const image = document.createElement("img");

  image.alt = "Some Memory Lane Photo Strip";

  image.src = canvas.toDataURL("image/jpeg", 0.95);

  /*
       The image keeps the natural dimensions
       of the selected template.

       CSS controls how large it appears
       on the screen.
    */

  image.style.width = "100%";

  image.style.height = "auto";

  image.style.display = "block";

  finalStrip.appendChild(image);

  /* ======================================
       SAVE FINAL STRIP
    ====================================== */

  sessionStorage.setItem(
    "memoryLaneFinalStrip",

    image.src,
  );

  /*
       Also save the selected template
       dimensions for printing if needed.
    */

  sessionStorage.setItem(
    "memoryLaneFinalStripDimensions",

    JSON.stringify({
      width: template.width,

      height: template.height,
    }),
  );

  console.log("Final strip saved.");

  /* ======================================
       UPDATE RESULT DETAILS
    ====================================== */

  if (resultLayout) {
    resultLayout.textContent = layout;
  }

  if (resultDesign) {
    resultDesign.textContent = design;
  }

  /* ======================================
       COMPLETE PROGRESS
    ====================================== */

  if (developingProgress) {
    developingProgress.style.width = "100%";
  }

  if (developingStatus) {
    developingStatus.textContent = "Your strip is ready!";
  }

  /* ======================================
       SWITCH TO RESULT SCREEN
    ====================================== */

  setTimeout(
    () => {
      if (developingScreen) {
        developingScreen.style.display = "none";
      }

      if (resultScreen) {
        resultScreen.style.display = "flex";
      }

      console.log("Result screen displayed.");
    },

    300,
  );

  void prepareTimelapse();
}

/* ==========================================
   DOWNLOAD STRIP
========================================== */

function downloadStrip() {
  const image = sessionStorage.getItem("memoryLaneFinalStrip");

  if (!image) {
    alert("Your memory strip is not ready yet.");

    return;
  }

  const link = document.createElement("a");

  link.href = image;

  link.download = "some-memory-lane-strip.jpg";

  document.body.appendChild(link);

  link.click();

  link.remove();
}

/* ==========================================
   FINISH SESSION
========================================== */

function finishSession() {
  /*
        Clear current photo booth session.
    */

  sessionStorage.removeItem("memoryLaneSession");

  sessionStorage.removeItem("memoryLaneFinalStrip");

  sessionStorage.removeItem("memoryLaneFinalStripDimensions");

  localStorage.removeItem("memoryLanePhotos");

  window.MemoryLanePhotoStorage?.remove(savedSession?.id)?.catch(() => {});

  /*
        Return to beginning.
    */

  window.location.href = "../index.html";
}

function openFinishDialog() {
  if (!finishDialog) {
    finishSession();
    return;
  }

  if (downloadAndFinishButton) {
    downloadAndFinishButton.hidden = Boolean(
      sessionStorage.getItem("memoryLaneFinalStrip"),
    );
  }

  finishDialogReturnFocus = document.activeElement;
  finishDialog.hidden = false;
  document.body.classList.add("dialog-open");
  keepPrivateButton?.focus();
}

function closeFinishDialog() {
  if (!finishDialog) {
    return;
  }

  finishDialog.hidden = true;
  document.body.classList.remove("dialog-open");
  finishDialogReturnFocus?.focus();
  finishDialogReturnFocus = null;
}

function finishWithVisibility(isFeatured) {
  sessionStorage.setItem("memoryLaneGalleryOptIn", JSON.stringify(isFeatured));
  closeFinishDialog();
  finishSession();
}

function downloadAndFinish() {
  downloadStrip();
  finishWithVisibility(false);
}

/* ==========================================
   PRINT STRIP
========================================== */

function printStrip() {
  const image = sessionStorage.getItem("memoryLaneFinalStrip");

  if (!image) {
    alert("Your memory strip is not ready yet.");

    return;
  }

  /*
       Get dimensions of the selected
       template.

       This prevents Layout 2 from
       being forced into Layout 1's
       dimensions.
    */

  let printWidth = template ? template.width : 426;

  let printHeight = template ? template.height : 1332;

  /*
       Create temporary print window.
    */

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow pop-ups to print your strip.");

    return;
  }

  printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Some Memory Lane
            </title>


            <style>

                @page {

                    margin: 0;

                }


                html,
                body {

                    margin: 0;

                    padding: 0;

                    background: white;

                }


                body {

                    display: flex;

                    justify-content: center;

                    align-items: flex-start;

                }


                img {

                    width: ${printWidth}px;

                    height: ${printHeight}px;

                    display: block;

                }

            </style>

        </head>


        <body>

            <img
                src="${image}"
                alt="Some Memory Lane Photo Strip"
            >

        </body>

        </html>

    `);

  printWindow.document.close();

  /*
       Wait for the image to load
       before opening print dialog.
    */

  printWindow.onload = () => {
    printWindow.focus();

    printWindow.print();
  };
}

/* ==========================================
   BUTTON EVENTS
========================================== */

if (downloadButton) {
  downloadButton.addEventListener(
    "click",

    downloadStrip,
  );
}

if (printButton) {
  printButton.addEventListener(
    "click",

    printStrip,
  );
}

if (finishButton) {
  finishButton.addEventListener(
    "click",

    openFinishDialog,
  );
}

finishDialogClose?.addEventListener("click", closeFinishDialog);
keepPrivateButton?.addEventListener("click", () => finishWithVisibility(false));
featuredWallButton?.addEventListener("click", () => finishWithVisibility(true));
downloadAndFinishButton?.addEventListener("click", downloadAndFinish);
downloadTimelapseButton?.addEventListener("click", downloadTimelapse);

finishDialog?.addEventListener("click", (event) => {
  if (event.target === finishDialog) {
    closeFinishDialog();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && finishDialog && !finishDialog.hidden) {
    event.preventDefault();
    closeFinishDialog();
    return;
  }

  if (event.key === "Tab" && finishDialog && !finishDialog.hidden) {
    const focusable = finishDialog.querySelectorAll(
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
  }
});

/* ==========================================
   MAIN
========================================== */

async function generateStrip() {
  console.log("Starting strip generation...");

  if (!savedSession || !savedStrip) {
    window.location.replace("../fallback.html?reason=editor");

    return;
  }

  try {
    await restoreStoredPhotos();
  } catch (error) {
    console.error("Unable to restore IndexedDB photos:", error);
    window.location.replace("../fallback.html?reason=photos");

    return;
  }

  if (!photos.length) {
    window.location.replace("../fallback.html?reason=photos");

    return;
  }

  /* ======================================
       SHOW DEVELOPING SCREEN
    ====================================== */

  showPrinting();

  /* ======================================
       CREATE STRIP
    ====================================== */

  try {
    const canvas = await createStrip();

    /* ==================================
           DISPLAY RESULT
        ================================== */

    displayStrip(canvas);

    console.log("Strip generation complete.");
  } catch (error) {
    console.error("STRIP GENERATION FAILED:", error);

    showError(error.message);
  }
}

/* ==========================================
   START
========================================== */

generateStrip();
