/* ==========================================
   MEMORY LANE
   CAMERA ENGINE V2
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


/* ==========================================
   LOAD SESSION
========================================== */

const savedSession =
    JSON.parse(
        sessionStorage.getItem("memoryLaneSession")
    ) || {};


/*
    Example:

    {
        session: "Solo",
        layout: "Layout 1",
        design: "Design 1",
        strip: "layout1-design1",
        captures: 4
    }
*/


/* ==========================================
   USER CHOICES
========================================== */

const session =
    savedSession.session || "Solo";

const layout =
    savedSession.layout || "Layout 1";

const design =
    savedSession.design || "Design 1";

const strip =
    savedSession.strip || "layout1-design1";

const captureMode =
    parseInt(savedSession.captures) || 4;


/* ==========================================
   ELEMENT DISPLAY
========================================== */

if(layoutName){

    layoutName.textContent =
        `${layout}`;

}


if(captureInfo){

    captureInfo.textContent =
        `${captureMode} Captures • ${design}`;

}


if(totalPhotos){

    totalPhotos.textContent =
        captureMode;

}


/* ==========================================
   CAMERA VARIABLES
========================================== */

let stream = null;

let photos = [];

let current = 0;

let cameraReady = false;

let cameraBusy = false;


/* ==========================================
   RESTORE PHOTOS
========================================== */

photos =
    JSON.parse(
        localStorage.getItem("memoryLanePhotos") || "[]"
    );


current = photos.length;


/* ==========================================
   INITIAL STATE
========================================== */

if(startButton){

    startButton.disabled = true;

}


setCameraStatus(
    "Camera Off",
    false
);


updateCameraControls();


updatePhotoCounter();


/* ==========================================
   CAMERA CONTROLS
========================================== */

function updateCameraControls(){

    const hasStream =
        Boolean(stream);


    /* Request Camera */

    if(requestButton){

        requestButton.disabled =
            cameraBusy || hasStream;

    }


    /* Turn Camera On */

    if(turnOnButton){

        turnOnButton.disabled =
            cameraBusy || hasStream;

    }


    /* Turn Camera Off */

    if(turnOffButton){

        turnOffButton.disabled =
            cameraBusy || !hasStream;

    }


    /* Start Capture */

    if(startButton){

        startButton.disabled =
            cameraBusy ||
            !hasStream ||
            current >= captureMode;

    }

}


/* ==========================================
   CAMERA STATUS
========================================== */

function setCameraStatus(
    message,
    isOn
){

    if(statusText){

        statusText.textContent =
            message;

    }


    if(statusLight){

        statusLight.classList.toggle(
            "green",
            isOn
        );


        statusLight.classList.toggle(
            "red",
            !isOn
        );

    }

}


/* ==========================================
   UPDATE PHOTO COUNTER
========================================== */

function updatePhotoCounter(){

    if(currentPhoto){

        currentPhoto.textContent =
            Math.min(
                current + 1,
                captureMode
            );

    }


    if(totalPhotos){

        totalPhotos.textContent =
            captureMode;

    }

}


/* ==========================================
   OPEN CAMERA
========================================== */

async function openCamera(){

    if(stream){

        return;

    }


    cameraBusy = true;

    updateCameraControls();


    try{

        stream =
            await navigator.mediaDevices.getUserMedia({

                video:{
                    facingMode:"user"
                },

                audio:false

            });


        video.srcObject =
            stream;


        /*
            Keep camera mirrored.
        */

        video.style.transform =
            "scaleX(-1)";


        cameraReady = true;


        setCameraStatus(
            "Camera Ready",
            true
        );


    }

    catch(error){

        cameraReady = false;


        setCameraStatus(
            "Camera Off",
            false
        );


        alert(
            "Unable to access your camera. Please allow camera access and try again."
        );


        console.error(
            "Camera error:",
            error
        );

    }


    finally{

        cameraBusy = false;

        updateCameraControls();

    }

}


/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera(){

    if(!stream){

        return;

    }


    stream
        .getTracks()
        .forEach(track => {

            track.stop();

        });


    stream = null;

    cameraReady = false;


    video.srcObject = null;


    setCameraStatus(
        "Camera Off",
        false
    );


    updateCameraControls();

}


/* ==========================================
   COUNTDOWN
========================================== */

async function startCountdown(){

    if(
        !cameraReady ||
        !stream
    ){

        setCameraStatus(
            "Turn the camera on first",
            false
        );

        return;

    }


    if(current >= captureMode){

        return;

    }


    if(!countdown){

        return;

    }


    cameraBusy = true;

    updateCameraControls();


    countdown.style.display =
        "block";


    for(
        let i = 3;
        i >= 1;
        i--
    ){

        countdown.textContent =
            i;


        await wait(1000);

    }


    countdown.style.display =
        "none";


    capturePhoto();

}


/* ==========================================
   CAPTURE PHOTO
========================================== */

function capturePhoto(){

    if(!video.videoWidth){

        cameraBusy = false;

        updateCameraControls();

        return;

    }


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;


    /*
        Because the camera preview is mirrored,
        mirror the captured image too.
    */

    ctx.save();


    ctx.translate(
        canvas.width,
        0
    );


    ctx.scale(
        -1,
        1
    );


    ctx.drawImage(

        video,

        0,
        0,

        canvas.width,
        canvas.height

    );


    ctx.restore();


    /* ======================================
       FLASH
    ====================================== */

    if(flash){

        flash.classList.add(
            "flash"
        );


        setTimeout(() => {

            flash.classList.remove(
                "flash"
            );

        },350);

    }


    /* ======================================
       CONVERT PHOTO
    ====================================== */

    const image =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );


    /* ======================================
       SAVE PHOTO
    ====================================== */

    photos.push(image);


    current =
        photos.length;


    localStorage.setItem(

        "memoryLanePhotos",

        JSON.stringify(photos)

    );


    updatePhotoCounter();


    /* ======================================
       MORE PHOTOS?
    ====================================== */

    if(current < captureMode){

        cameraBusy = false;

        updateCameraControls();


        setTimeout(

            () => {

                startCountdown();

            },

            1200

        );

    }

    else{

        finishSession();

    }

}


/* ==========================================
   FINISH SESSION
========================================== */

function finishSession(){

    cameraBusy = true;

    updateCameraControls();


    setCameraStatus(
        "Session Complete",
        true
    );


    /*
        Stop the webcam.
    */

    stopCamera();


    /*
        Save final session information.

        This is important because
        edit.html will need to know
        which strip template the user selected.
    */

    const finalSession = {

        session: session,

        layout: layout,

        design: design,

        strip: strip,

        captures: captureMode,

        photos: photos

    };


    sessionStorage.setItem(

        "memoryLaneSession",

        JSON.stringify(finalSession)

    );


    /*
        Small delay before moving
        to the next screen.
    */

    setTimeout(() => {

        window.location.href =
            "../pages/edit.html";

    },1200);

}


/* ==========================================
   HELPER
========================================== */

function wait(ms){

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


/* ==========================================
   START CAPTURE
========================================== */

if(startButton){

    startButton.addEventListener(

        "click",

        () => {

            if(
                cameraBusy ||
                !cameraReady
            ){

                return;

            }


            startButton.disabled =
                true;


            startCountdown();

        }

    );

}


/* ==========================================
   REQUEST CAMERA
========================================== */

if(requestButton){

    requestButton.addEventListener(

        "click",

        () => {

            openCamera();

        }

    );

}


/* ==========================================
   TURN CAMERA ON
========================================== */

if(turnOnButton){

    turnOnButton.addEventListener(

        "click",

        () => {

            openCamera();

        }

    );

}


/* ==========================================
   TURN CAMERA OFF
========================================== */

if(turnOffButton){

    turnOffButton.addEventListener(

        "click",

        () => {

            stopCamera();

        }

    );

}


/* ==========================================
   RESTART SESSION
========================================== */

if(restartButton){

    restartButton.addEventListener(

        "click",

        () => {

            /*
                Remove old captured photos.
            */

            localStorage.removeItem(
                "memoryLanePhotos"
            );


            /*
                Keep the user's
                selected session/layout/design.
            */

            location.reload();

        }

    );

}