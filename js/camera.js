/* ==========================================
   MEMORY LANE
   CAMERA ENGINE V5

   RESPONSIBILITIES:
   - Read selected session
   - Determine photo count by layout
   - Restore current session photos
   - Capture photos with countdown
   - Prevent duplicate captures
   - Automatically continue captures
   - Finish when required number is reached
   - Match camera preview to actual camera ratio
   - Prevent black side bars
========================================== */

/* ==========================================
   ELEMENTS
========================================== */

const video = document.getElementById("video");

const canvas = document.getElementById("canvas");

const countdown = document.getElementById("countdown");

const flash = document.getElementById("flash");

const statusLight = document.getElementById("statusLight");

const statusText = document.getElementById("statusText");

const currentPhoto = document.getElementById("currentPhoto");

const totalPhotos = document.getElementById("totalPhotos");

const startButton = document.getElementById("startCapture");

const restartButton = document.getElementById("retakeSession");

const requestButton = document.getElementById("requestCamera");

const turnOnButton = document.getElementById("turnOnCamera");

const turnOffButton = document.getElementById("turnOffCamera");

const layoutName = document.getElementById("layoutName");

const captureInfo = document.getElementById("captureInfo");

const cameraContainer = document.querySelector(".camera-container");

/* ==========================================
   LOAD SESSION
========================================== */

const savedSession =
  JSON.parse(sessionStorage.getItem("memoryLaneSession")) || {};

/* ==========================================
   USER CHOICES
========================================== */

const session = savedSession.session || "Solo";

const layout = savedSession.layout || "Layout 1";

const design = savedSession.design || "Blue";

const strip = savedSession.strip || "layout1-design1";

/* ==========================================
   PHOTO COUNT BY LAYOUT
========================================== */

const layoutPhotoCounts = {
  "Layout 1": 4,

  "Layout 2": 4,

  "Layout 3": 4,

  "Layout 4": 3,

  "Layout 5": 1,
};

/* ==========================================
   DETERMINE PHOTO COUNT
========================================== */

const layoutCaptureCount = layoutPhotoCounts[layout];

const captureMode = layoutCaptureCount || Number(savedSession.captures) || 4;

/* ==========================================
   DEBUG INFORMATION
========================================== */

console.log("=================================");

console.log("MEMORY LANE CAMERA SESSION");

console.log("=================================");

console.log("Saved Session:", savedSession);

console.log("Session:", session);

console.log("Layout:", layout);

console.log("Design:", design);

console.log("Strip:", strip);

console.log("Saved Captures:", savedSession.captures);

console.log("Required Photos:", captureMode);

console.log("=================================");

/* ==========================================
   ELEMENT DISPLAY
========================================== */

if (layoutName) {
  layoutName.textContent = layout;
}

if (captureInfo) {
  captureInfo.textContent = `${captureMode} Photos • ${design}`;
}

if (totalPhotos) {
  totalPhotos.textContent = captureMode;
}

/* ==========================================
   CAMERA VARIABLES
========================================== */

let stream = null;

let photos = [];

let current = 0;

let cameraReady = false;

let cameraBusy = false;

/*
    Prevent multiple countdowns
    from running simultaneously.
*/

let captureInProgress = false;

/*
    Used to stop delayed automatic
    countdowns after the session ends.
*/

let sessionFinished = false;

/*
    Reference to the next-photo timer.
*/

let nextCaptureTimer = null;

/* ==========================================
   RESTORE PHOTOS
========================================== */

try {
  photos = JSON.parse(localStorage.getItem("memoryLanePhotos") || "[]");

  if (!Array.isArray(photos)) {
    photos = [];
  }
} catch (error) {
  console.error("Unable to restore saved photos:", error);

  photos = [];
}

/* ==========================================
   SAFETY CHECK
========================================== */

if (photos.length > captureMode) {
  console.warn(
    `Too many saved photos detected. Keeping only the first ${captureMode}.`,
  );

  photos = photos.slice(0, captureMode);

  localStorage.setItem(
    "memoryLanePhotos",

    JSON.stringify(photos),
  );
}

current = photos.length;

/* ==========================================
   INITIAL STATE
========================================== */

if (startButton) {
  startButton.disabled = true;
}

setCameraStatus("Camera Off", false);

updateCameraControls();

updatePhotoCounter();

/* ==========================================
   CAMERA CONTROLS
========================================== */

function updateCameraControls() {
  const hasStream = Boolean(stream);

  /* ======================================
       REQUEST CAMERA
    ====================================== */

  if (requestButton) {
    requestButton.disabled = cameraBusy || hasStream;
  }

  /* ======================================
       TURN CAMERA ON
    ====================================== */

  if (turnOnButton) {
    turnOnButton.disabled = cameraBusy || hasStream;
  }

  /* ======================================
       TURN CAMERA OFF
    ====================================== */

  if (turnOffButton) {
    turnOffButton.disabled = cameraBusy || !hasStream;
  }

  /* ======================================
       START CAPTURE
    ====================================== */

  if (startButton) {
    startButton.disabled =
      cameraBusy ||
      !cameraReady ||
      !hasStream ||
      current >= captureMode ||
      sessionFinished;
  }
}

/* ==========================================
   CAMERA STATUS
========================================== */

function setCameraStatus(message, isOn) {
  if (statusText) {
    statusText.textContent = message;
  }

  if (statusLight) {
    statusLight.classList.toggle("green", isOn);

    statusLight.classList.toggle("red", !isOn);
  }
}

/* ==========================================
   UPDATE PHOTO COUNTER
========================================== */

function updatePhotoCounter() {
  if (currentPhoto) {
    currentPhoto.textContent = Math.min(current + 1, captureMode);
  }

  if (totalPhotos) {
    totalPhotos.textContent = captureMode;
  }
}

/* ==========================================
   UPDATE CAMERA ASPECT RATIO
========================================== */

/*
    IMPORTANT:

    This function makes the camera container
    use the EXACT aspect ratio of the actual
    camera stream.

    Example:

        1280 x 720
        = 16:9

        1920 x 1080
        = 16:9

        1280 x 960
        = 4:3

    Because the container uses the same ratio
    as the video, object-fit: cover will not
    crop the camera and will not create
    black side bars.
*/

function updateCameraAspectRatio() {
  if (!video || !cameraContainer || !video.videoWidth || !video.videoHeight) {
    return;
  }

  const ratio = video.videoWidth / video.videoHeight;

  cameraContainer.style.aspectRatio = `${ratio}`;

  /*
        The video can now fill the container
        because the container has the same
        ratio as the actual camera.
    */

  video.style.objectFit = "cover";

  video.style.objectPosition = "center";

  console.log("Camera resolution:", video.videoWidth, "x", video.videoHeight);

  console.log("Camera aspect ratio:", ratio);
}

/* ==========================================
   OPEN CAMERA
========================================== */

async function openCamera() {
  /*
        Don't open another camera stream
        if one already exists.
    */

  if (stream) {
    return;
  }

  /*
        Don't open camera after session
        has already finished.
    */

  if (sessionFinished) {
    return;
  }

  /*
        Make sure the browser supports
        camera access.
    */

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Camera access is not supported by this browser.");

    return;
  }

  cameraBusy = true;

  updateCameraControls();

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
      },

      audio: false,
    });

    /*
            Connect camera stream.
        */

    if (video) {
      video.srcObject = stream;

      /*
                Mirror camera preview.
            */

      video.style.transform = "scaleX(-1)";

      /*
                Wait until the browser knows
                the actual camera dimensions.
            */

      await new Promise((resolve) => {
        /*
                        If metadata is already
                        available, continue immediately.
                    */

        if (video.videoWidth && video.videoHeight) {
          resolve();

          return;
        }

        /*
                        Otherwise wait for metadata.
                    */

        video.onloadedmetadata = () => {
          resolve();
        };
      });

      /*
                Make the camera container match
                the real camera ratio.
            */

      updateCameraAspectRatio();

      /*
                Make sure playback starts.
            */

      try {
        await video.play();
      } catch (playError) {
        console.warn(
          "Video playback could not start automatically:",
          playError,
        );
      }
    }

    cameraReady = true;

    setCameraStatus("Camera Ready", true);

    console.log("Camera opened successfully.");
  } catch (error) {
    cameraReady = false;

    stream = null;

    setCameraStatus("Camera Off", false);

    alert(
      "Unable to access your camera. Please allow camera access and try again.",
    );

    console.error("Camera error:", error);
  } finally {
    cameraBusy = false;

    updateCameraControls();
  }
}

/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera() {
  /*
        Cancel any pending automatic
        capture timer.
    */

  if (nextCaptureTimer) {
    clearTimeout(nextCaptureTimer);

    nextCaptureTimer = null;
  }

  /*
        Stop all camera tracks.
    */

  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  stream = null;

  cameraReady = false;

  if (video) {
    video.srcObject = null;
  }

  setCameraStatus("Camera Off", false);

  updateCameraControls();
}

/* ==========================================
   COUNTDOWN
========================================== */

async function startCountdown() {
  /*
        Don't start another countdown
        if one is already running.
    */

  if (captureInProgress) {
    console.warn("Capture already in progress.");

    return;
  }

  /*
        Don't capture after the session
        has finished.
    */

  if (sessionFinished) {
    return;
  }

  /*
        Camera must be ready.
    */

  if (!cameraReady || !stream) {
    setCameraStatus("Turn the camera on first", false);

    return;
  }

  /*
        Stop if all required photos
        have already been captured.
    */

  if (current >= captureMode) {
    finishSession();

    return;
  }

  if (!countdown) {
    console.error("Countdown element not found.");

    return;
  }

  /*
        Lock capture process.
    */

  captureInProgress = true;

  cameraBusy = true;

  updateCameraControls();

  countdown.style.display = "block";

  /*
        Countdown:
            3
            2
            1
    */

  for (let i = 3; i >= 1; i--) {
    if (sessionFinished) {
      countdown.style.display = "none";

      captureInProgress = false;

      cameraBusy = false;

      updateCameraControls();

      return;
    }

    countdown.textContent = i;

    await wait(1000);
  }

  countdown.style.display = "none";

  /*
        Final safety check.
    */

  if (sessionFinished || !cameraReady || !stream || current >= captureMode) {
    captureInProgress = false;

    cameraBusy = false;

    updateCameraControls();

    return;
  }

  /*
        Take actual photo.
    */

  capturePhoto();
}

/* ==========================================
   CAPTURE PHOTO
========================================== */

function capturePhoto() {
  /*
        Prevent duplicate capture.
    */

  if (sessionFinished || current >= captureMode) {
    captureInProgress = false;

    cameraBusy = false;

    updateCameraControls();

    return;
  }

  /*
        Make sure video has dimensions.
    */

  if (!video || !video.videoWidth || !video.videoHeight) {
    console.warn("Camera video is not ready yet.");

    captureInProgress = false;

    cameraBusy = false;

    updateCameraControls();

    return;
  }

  if (!canvas) {
    console.error("Canvas element not found.");

    captureInProgress = false;

    cameraBusy = false;

    updateCameraControls();

    return;
  }

  const ctx = canvas.getContext("2d");

  /*
        Use the REAL camera resolution.

        This guarantees that the saved image
        has the same aspect ratio as the
        camera preview.
    */

  canvas.width = video.videoWidth;

  canvas.height = video.videoHeight;

  /* ======================================
       MIRROR PHOTO
    ====================================== */

  ctx.save();

  ctx.translate(canvas.width, 0);

  ctx.scale(-1, 1);

  ctx.drawImage(
    video,

    0,
    0,

    canvas.width,
    canvas.height,
  );

  ctx.restore();

  /* ======================================
       FLASH
    ====================================== */

  if (flash) {
    flash.classList.add("flash");

    setTimeout(
      () => {
        flash.classList.remove("flash");
      },

      350,
    );
  }

  /* ======================================
       CONVERT PHOTO
    ====================================== */

  const image = canvas.toDataURL("image/jpeg", 0.9);

  /* ======================================
       EXTRA SAFETY
    ====================================== */

  if (current >= captureMode) {
    captureInProgress = false;

    cameraBusy = false;

    updateCameraControls();

    return;
  }

  /* ======================================
       SAVE PHOTO
    ====================================== */

  photos.push(image);

  current = photos.length;

  localStorage.setItem(
    "memoryLanePhotos",

    JSON.stringify(photos),
  );

  updatePhotoCounter();

  console.log(`Photo ${current} of ${captureMode} captured.`);

  /* ======================================
       SESSION COMPLETE?
    ====================================== */

  if (current >= captureMode) {
    captureInProgress = false;

    finishSession();

    return;
  }

  /* ======================================
       MORE PHOTOS
    ====================================== */

  cameraBusy = false;

  captureInProgress = false;

  updateCameraControls();

  /*
        Automatically begin the next
        countdown after 1.2 seconds.
    */

  nextCaptureTimer = setTimeout(
    () => {
      nextCaptureTimer = null;

      if (
        sessionFinished ||
        current >= captureMode ||
        !cameraReady ||
        !stream
      ) {
        return;
      }

      startCountdown();
    },

    1200,
  );
}

/* ==========================================
   FINISH SESSION
========================================== */

function finishSession() {
  /*
        Prevent duplicate finish.
    */

  if (sessionFinished) {
    return;
  }

  sessionFinished = true;

  cameraBusy = true;

  captureInProgress = false;

  /*
        Cancel pending capture.
    */

  if (nextCaptureTimer) {
    clearTimeout(nextCaptureTimer);

    nextCaptureTimer = null;
  }

  updateCameraControls();

  setCameraStatus("Session Complete", true);

  /* ======================================
       STOP WEBCAM
    ====================================== */

  stopCamera();

  /* ======================================
       SAVE FINAL SESSION
    ====================================== */

  const finalSession = {
    session: session,

    layout: layout,

    design: design,

    strip: strip,

    photoCount: captureMode,

    photos: photos,
  };

  sessionStorage.setItem(
    "memoryLaneSession",

    JSON.stringify(finalSession),
  );

  console.log("Final Session:", finalSession);

  console.log(`Final photo count: ${photos.length} / ${captureMode}`);

  /* ======================================
       MOVE TO EDIT PAGE
    ====================================== */

  setTimeout(
    () => {
      window.location.href = "../pages/edit.html";
    },

    1200,
  );
}

/* ==========================================
   HELPER
========================================== */

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* ==========================================
   START CAPTURE
========================================== */

if (startButton) {
  startButton.addEventListener(
    "click",

    () => {
      /*
                Don't allow multiple clicks.
            */

      if (
        cameraBusy ||
        captureInProgress ||
        !cameraReady ||
        !stream ||
        sessionFinished
      ) {
        return;
      }

      /*
                Prevent capture if required
                number has been reached.
            */

      if (current >= captureMode) {
        finishSession();

        return;
      }

      startCountdown();
    },
  );
}

/* ==========================================
   REQUEST CAMERA
========================================== */

if (requestButton) {
  requestButton.addEventListener(
    "click",

    () => {
      openCamera();
    },
  );
}

/* ==========================================
   TURN CAMERA ON
========================================== */

if (turnOnButton) {
  turnOnButton.addEventListener(
    "click",

    () => {
      openCamera();
    },
  );
}

/* ==========================================
   TURN CAMERA OFF
========================================== */

if (turnOffButton) {
  turnOffButton.addEventListener(
    "click",

    () => {
      /*
                Don't stop camera during
                countdown.
            */

      if (captureInProgress) {
        return;
      }

      stopCamera();
    },
  );
}

/* ==========================================
   RETAKE / RESTART SESSION
========================================== */

if (restartButton) {
  restartButton.addEventListener(
    "click",

    () => {
      /*
                Stop camera first.
            */

      stopCamera();

      /*
                Cancel pending capture.
            */

      if (nextCaptureTimer) {
        clearTimeout(nextCaptureTimer);

        nextCaptureTimer = null;
      }

      /*
                Reset capture state.
            */

      sessionFinished = false;

      captureInProgress = false;

      cameraBusy = false;

      /*
                Remove old photos.
            */

      localStorage.removeItem("memoryLanePhotos");

      /*
                Reset in-memory photos.
            */

      photos = [];

      current = 0;

      /*
                Update UI.
            */

      updatePhotoCounter();

      updateCameraControls();

      /*
                Reload camera page.
            */

      location.reload();
    },
  );
}
