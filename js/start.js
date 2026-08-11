/* ==========================================
   START SESSION
   Some Memory Lane
========================================== */


/* ==========================================
   SESSION DATA
========================================== */

let sessionChoice = "Solo";

let layoutChoice = "Layout 1";

let designChoice = "Blue";

let stripChoice = "layout1-design1";

let captureChoice = 4;


/* ==========================================
   ELEMENTS
========================================== */

const sessionStep =
    document.getElementById("sessionStep");

const layoutStep =
    document.getElementById("layoutStep");

const groupOptions =
    document.getElementById("groupOptions");

const sessionContinue =
    document.getElementById("sessionContinue");

const layoutContinue =
    document.getElementById("layoutContinue");

const layoutBack =
    document.getElementById("layoutBack");

const selectedCaptureCount =
    document.getElementById("selectedCaptureCount");


/* ==========================================
   SESSION SELECTION
========================================== */

const sessionCards =
    document.querySelectorAll(".session-card");


sessionCards.forEach(card => {

    card.addEventListener("click", () => {

        if(card.disabled){

            return;

        }


        /*
            Remove previous selection.
        */

        sessionCards.forEach(item => {

            item.classList.remove("selected");

        });


        /*
            Select clicked session.
        */

        card.classList.add("selected");


        /*
            Save session choice.
        */

        sessionChoice =
            card.dataset.session;


        /*
            Duo / Group are not available yet.
        */

        if(
            sessionChoice === "Group" ||
            sessionChoice === "Duo"
        ){

            if(groupOptions){

                groupOptions.classList.add("show");

            }


            if(sessionContinue){

                sessionContinue.disabled = true;

                sessionContinue.style.opacity =
                    "0.45";

                sessionContinue.style.cursor =
                    "not-allowed";

            }

        }

        else{

            if(groupOptions){

                groupOptions.classList.remove("show");

            }


            if(sessionContinue){

                sessionContinue.disabled = false;

                sessionContinue.style.opacity =
                    "1";

                sessionContinue.style.cursor =
                    "pointer";

            }

        }

    });

});


/* ==========================================
   SESSION → LAYOUT
========================================== */

if(sessionContinue){

    sessionContinue.addEventListener(
        "click",
        () => {

            /*
                Only Solo is currently available.
            */

            if(sessionChoice !== "Solo"){

                return;

            }


            sessionStep.classList.remove(
                "active"
            );


            layoutStep.classList.add(
                "active"
            );

        }
    );

}


/* ==========================================
   STRIP SELECTION
========================================== */

const stripOptions =
    document.querySelectorAll(".strip-option");


stripOptions.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            /*
                Remove previous selection.
            */

            stripOptions.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            /*
                Select clicked strip.
            */

            option.classList.add(
                "selected"
            );


            /*
                Save layout.
            */

            layoutChoice =
                option.dataset.layout ||
                "Layout 1";


            /*
                Save design.
            */

            designChoice =
                option.dataset.design ||
                "Blue";


            /*
                Save strip identifier.
            */

            stripChoice =
                option.dataset.strip ||
                "layout1-design1";


            /*
                Get the number of photos
                from the selected strip.
            */

            captureChoice =
                Number(
                    option.dataset.captures
                ) || 4;


            /*
                Update visible count.
            */

            updateCaptureDisplay();


            /*
                Debug.
            */

            console.log(
                "Selected Strip:",
                stripChoice
            );

            console.log(
                "Layout:",
                layoutChoice
            );

            console.log(
                "Design:",
                designChoice
            );

            console.log(
                "Captures:",
                captureChoice
            );

        }
    );

});


/* ==========================================
   UPDATE PHOTO COUNT
========================================== */

function updateCaptureDisplay(){

    if(!selectedCaptureCount){

        return;

    }


    selectedCaptureCount.textContent =
        captureChoice;

}


/* ==========================================
   INITIAL PHOTO COUNT
========================================== */

updateCaptureDisplay();


/* ==========================================
   HORIZONTAL STRIP SCROLL
========================================== */

const layoutScroller =
    document.getElementById("layoutScroller");

const layoutLeft =
    document.getElementById("layoutLeft");

const layoutRight =
    document.getElementById("layoutRight");


/*
    Scroll left.
*/

if(
    layoutLeft &&
    layoutScroller
){

    layoutLeft.addEventListener(
        "click",
        () => {

            layoutScroller.scrollBy({

                left: -300,

                behavior: "smooth"

            });

        }
    );

}


/*
    Scroll right.
*/

if(
    layoutRight &&
    layoutScroller
){

    layoutRight.addEventListener(
        "click",
        () => {

            layoutScroller.scrollBy({

                left: 300,

                behavior: "smooth"

            });

        }
    );

}


/* ==========================================
   BACK → SESSION
========================================== */

if(layoutBack){

    layoutBack.addEventListener(
        "click",
        () => {

            layoutStep.classList.remove(
                "active"
            );


            sessionStep.classList.add(
                "active"
            );

        }
    );

}


/* ==========================================
   CLEAR PREVIOUS SESSION
========================================== */

/*
    IMPORTANT:

    A new "Take Pictures" session must
    NEVER inherit photos from a previous
    session.

    We clear both:

        memoryLanePhotos
        memoryLaneSession

    before creating the new session.
*/

function clearPreviousSession(){

    localStorage.removeItem(
        "memoryLanePhotos"
    );


    sessionStorage.removeItem(
        "memoryLaneSession"
    );


    console.log(
        "Previous Memory Lane session cleared."
    );

}


/* ==========================================
   SAVE SESSION
========================================== */

function saveSession(){

    /*
        IMPORTANT:
        Start with a completely clean
        photo/session state.
    */

    clearPreviousSession();


    const memoryLaneSession = {

        session:
            sessionChoice,

        layout:
            layoutChoice,

        design:
            designChoice,

        strip:
            stripChoice,

        captures:
            captureChoice,

        photoCount:
            captureChoice,

        photos:
            []

    };


    sessionStorage.setItem(

        "memoryLaneSession",

        JSON.stringify(
            memoryLaneSession
        )

    );


    /*
        Make absolutely sure there are
        no old photos.
    */

    localStorage.setItem(
        "memoryLanePhotos",
        JSON.stringify([])
    );


    console.log(
        "New Memory Lane Session Saved:",
        memoryLaneSession
    );

}


/* ==========================================
   STRIP → CAMERA
========================================== */

if(layoutContinue){

    layoutContinue.addEventListener(
        "click",
        () => {

            /*
                Find the currently selected strip.
            */

            const selectedStrip =
                document.querySelector(
                    ".strip-option.selected"
                );


            /*
                Make sure a strip exists.
            */

            if(!selectedStrip){

                alert(
                    "Please choose a strip first."
                );

                return;

            }


            /*
                Read the current selection
                one final time.
            */

            layoutChoice =
                selectedStrip.dataset.layout ||
                "Layout 1";


            designChoice =
                selectedStrip.dataset.design ||
                "Blue";


            stripChoice =
                selectedStrip.dataset.strip ||
                "layout1-design1";


            captureChoice =
                Number(
                    selectedStrip.dataset.captures
                ) || 4;


            /*
                IMPORTANT:

                Start a completely fresh session.
            */

            saveSession();


            /*
                Debug information.
            */

            console.log(
                "-------------------------"
            );

            console.log(
                "NEW SESSION"
            );

            console.log(
                "Session:",
                sessionChoice
            );

            console.log(
                "Layout:",
                layoutChoice
            );

            console.log(
                "Design:",
                designChoice
            );

            console.log(
                "Strip:",
                stripChoice
            );

            console.log(
                "Captures:",
                captureChoice
            );

            console.log(
                "Photos:",
                0
            );

            console.log(
                "-------------------------"
            );


            /*
                Go to camera.
            */

            window.location.href =
                "../pages/camera.html";

        }
    );

}