/* ==========================================
   START SESSION
   Some Memory Lane
========================================== */


/* ==========================================
   SESSION DATA
========================================== */

let sessionChoice = "Solo";

let layoutChoice = "Layout 1";

let designChoice = "Design 1";

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


/* ==========================================
   SESSION SELECTION
========================================== */

const sessionCards =
    document.querySelectorAll(".session-card");


sessionCards.forEach(card => {

    card.addEventListener("click", () => {


        /* Ignore disabled cards */

        if(card.classList.contains("disabled")){

            return;

        }


        /* Remove previous selection */

        sessionCards.forEach(item => {

            item.classList.remove("selected");

        });


        /* Select clicked session */

        card.classList.add("selected");


        /* Save session */

        sessionChoice =
            card.dataset.session;


        /* ==================================
           GROUP / DUO
        ================================== */

        if(
            sessionChoice === "Group" ||
            sessionChoice === "Duo"
        ){

            groupOptions.classList.add("show");


            sessionContinue.disabled = true;


            sessionContinue.style.opacity =
                ".45";


            sessionContinue.style.cursor =
                "not-allowed";

        }

        else{

            groupOptions.classList.remove("show");


            sessionContinue.disabled = false;


            sessionContinue.style.opacity =
                "1";


            sessionContinue.style.cursor =
                "pointer";

        }

    });

});


/* ==========================================
   SESSION → STRIP
========================================== */

if(sessionContinue){

    sessionContinue.addEventListener("click", () => {


        /*
            Only Solo is currently available.
        */

        if(sessionChoice !== "Solo"){

            return;

        }


        sessionStep.classList.remove("active");

        layoutStep.classList.add("active");

    });

}


/* ==========================================
   STRIP SELECTION
   Layout + Design
========================================== */

const stripOptions =
    document.querySelectorAll(".strip-option");


stripOptions.forEach(option => {

    option.addEventListener("click", () => {


        /* ==============================
           Remove previous selection
        ============================== */

        stripOptions.forEach(item => {

            item.classList.remove("selected");

        });


        /* ==============================
           Select clicked strip
        ============================== */

        option.classList.add("selected");


        /* ==============================
           Save layout
        ============================== */

        layoutChoice =
            option.dataset.layout ||
            "Layout 1";


        /* ==============================
           Save design
        ============================== */

        designChoice =
            option.dataset.design ||
            "Design 1";


        /* ==============================
           Save complete strip
        ============================== */

        stripChoice =
            option.dataset.strip ||
            "";


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

    });

});


/* ==========================================
   CAPTURE SELECTION
========================================== */

const captureOptions =
    document.querySelectorAll(".capture-circle");


captureOptions.forEach(option => {

    option.addEventListener("click", () => {


        /* Remove previous selection */

        captureOptions.forEach(item => {

            item.classList.remove("selected");

        });


        /* Select clicked option */

        option.classList.add("selected");


        /* Save number of captures */

        captureChoice =
            Number(option.dataset.captures);


        console.log(
            "Captures:",
            captureChoice
        );

    });

});


/* ==========================================
   HORIZONTAL STRIP SCROLL
========================================== */

const layoutScroller =
    document.getElementById("layoutScroller");

const layoutLeft =
    document.getElementById("layoutLeft");

const layoutRight =
    document.getElementById("layoutRight");


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
   SAVE SESSION
========================================== */

function saveSession(){

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
            captureChoice

    };


    sessionStorage.setItem(

        "memoryLaneSession",

        JSON.stringify(
            memoryLaneSession
        )

    );


    console.log(
        "Memory Lane Session Saved:",
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


            /* ==============================
               Save everything
            ============================== */

            saveSession();


            /* ==============================
               Show saved data in console
               for testing
            ============================== */

            console.log(
                "-------------------------"
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
                "-------------------------"
            );


            /* ==============================
               Go to camera
            ============================== */

            window.location.href =
                "../pages/camera.html";

        }
    );

}