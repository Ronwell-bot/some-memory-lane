/* ==========================================
   SOME MEMORY LANE
   EDIT / DEVELOPING / STRIP ENGINE
   FIXED VERSION
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const developingScreen =
    document.getElementById("developingScreen");

const resultScreen =
    document.getElementById("resultScreen");

const finalStrip =
    document.getElementById("finalStrip");

const developingProgress =
    document.getElementById("developingProgress");

const developingStatus =
    document.getElementById("developingStatus");

const resultLayout =
    document.getElementById("resultLayout");

const resultDesign =
    document.getElementById("resultDesign");

const downloadButton =
    document.getElementById("downloadButton");

const printButton =
    document.getElementById("printButton");

const finishButton =
    document.getElementById("finishButton");


/* ==========================================
   LOAD SESSION
========================================== */

const savedSession =
    JSON.parse(
        sessionStorage.getItem("memoryLaneSession")
    ) || {};


/* ==========================================
   USER SELECTION
========================================== */

const layout =
    savedSession.layout || "Layout 1";

const design =
    savedSession.design || "Design 1";


/*
    Normal value:

        layout1-design1

    Older versions may save:

        blue-pattern-4xs.jpeg
*/

const savedStrip =
    savedSession.strip || "layout1-design1";


/* ==========================================
   LOAD PHOTOS
========================================== */

let photos =
    savedSession.photos || [];


/*
    Fallback:
    If photos aren't inside sessionStorage,
    get them from localStorage.
*/

if(photos.length === 0){

    photos =
        JSON.parse(
            localStorage.getItem("memoryLanePhotos")
            || "[]"
        );

}


/* ==========================================
   DEBUG
========================================== */

console.log(
    "Memory Lane Session:",
    savedSession
);

console.log(
    "Saved Strip Value:",
    savedStrip
);

console.log(
    "Photos:",
    photos.length
);


/* ==========================================
   STRIP TEMPLATES
========================================== */

const stripTemplates = {


    /* ======================================
       LAYOUT 1 — DESIGN 1
       4 STRAIGHT PHOTOS
    ====================================== */

    "layout1-design1": {

        image:
            "../assets/strip design/blue-pattern-4xs.jpeg",

        width: 426,

        height: 1332,

        slots: [

            /* PHOTO 1 */

            {
                photoIndex: 0,

                x: 47,
                y: 53,
                width: 332,
                height: 272
            },


            /* PHOTO 2 */

            {
                photoIndex: 1,

                x: 47,
                y: 347,
                width: 332,
                height: 275
            },


            /* PHOTO 3 */

            {
                photoIndex: 2,

                x: 47,
                y: 645,
                width: 332,
                height: 273
            },


            /* PHOTO 4 */

            {
                photoIndex: 3,

                x: 47,
                y: 943,
                width: 332,
                height: 272
            }

        ]

    },


    /* ======================================
       LAYOUT 1 — DESIGN 2
       4 STRAIGHT PHOTOS
    ====================================== */

    "layout1-design2": {

        image:
            "../assets/strip design/green-pattern-4xs.jpeg",

        width: 424,

        height: 1313,

        slots: [

            /* PHOTO 1 */

            {
                photoIndex: 0,

                x: 54,
                y: 67,
                width: 323,
                height: 265
            },


            /* PHOTO 2 */

            {
                photoIndex: 1,

                x: 54,
                y: 353,
                width: 323,
                height: 265
            },


            /* PHOTO 3 */

            {
                photoIndex: 2,

                x: 58,
                y: 645,
                width: 323,
                height: 255
            },


            /* PHOTO 4 */

            {
                photoIndex: 3,

                x: 54,
                y: 931,
                width: 323,
                height: 264
            }

        ]

    },


    /* ======================================
       LAYOUT 1 — DESIGN 3
       4 STRAIGHT PHOTOS
    ====================================== */

    "layout1-design3": {

        image:
            "../assets/strip design/red-pattern-4xs.jpeg",

        width: 430,

        height: 1313,

        slots: [

            /* PHOTO 1 */

            {
                photoIndex: 0,

                x: 54,
                y: 67,
                width: 323,
                height: 265
            },


            /* PHOTO 2 */

            {
                photoIndex: 1,

                x: 54,
                y: 353,
                width: 323,
                height: 265
            },


            /* PHOTO 3 */

            {
                photoIndex: 2,

                x: 55,
                y: 640,
                width: 323,
                height: 255
            },


            /* PHOTO 4 */

            {
                photoIndex: 3,

                x: 54,
                y: 931,
                width: 323,
                height: 264
            }

        ]

    },


    /* ======================================
       LAYOUT 1 — DESIGN 4
       4 STRAIGHT PHOTOS
    ====================================== */

    "layout1-design4": {

        image:
            "../assets/strip design/yellow-pattern-4xs.jpeg",

        width: 475,

        height: 1330,

        slots: [

            /* PHOTO 1 */

            {
                photoIndex: 0,

                x: 65,
                y: 80,
                width: 323,
                height: 265
            },


            /* PHOTO 2 */

            {
                photoIndex: 1,

                x: 68,
                y: 371,
                width: 323,
                height: 265
            },


            /* PHOTO 3 */

            {
                photoIndex: 2,

                x: 68,
                y: 664,
                width: 323,
                height: 260
            },


            /* PHOTO 4 */

            {
                photoIndex: 3,

                x: 67,
                y: 950,
                width: 323,
                height: 264
            }

        ]

    },


    /* ======================================
       LAYOUT 1 — DESIGN 5
       4 STRAIGHT PHOTOS
    ====================================== */

    "layout1-design5": {

        image:
            "../assets/strip design/red-simple-4xs.jpeg",

        width: 430,

        height: 1330,

        slots: [

            /* PHOTO 1 */

            {
                photoIndex: 0,

                x: 45,
                y: 50,
                width: 345,
                height: 265
            },


            /* PHOTO 2 */

            {
                photoIndex: 1,

                x: 45,
                y: 345,
                width: 340,
                height: 270
            },


            /* PHOTO 3 */

            {
                photoIndex: 2,

                x: 45,
                y: 645,
                width: 340,
                height: 270
            },


            /* PHOTO 4 */

            {
                photoIndex: 3,

                x: 45,
                y: 945,
                width: 340,
                height: 270
            }

        ]

    },



    "layout2-design1": {

    image:
        "../assets/strip design/blue-pattern-8xs.jpeg",

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
            height: 234
        },


        /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

        {
            photoIndex: 0,

            x: 320,
            y: 40,
            width: 250,
            height: 234
        },


        /* ==================================
           PHOTO 2 — LEFT
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 320,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

        {
            photoIndex: 2,

            x: 320,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — LEFT
        ================================== */

        {
            photoIndex: 3,

            x: 35,
            y: 820,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 320,
            y: 820,
            width: 250,
            height: 232
        }

    ]

},



    "layout2-design2": {

    image:
        "../assets/strip design/green-pattern-8xs.jpeg",

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
            height: 234
        },


        /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

        {
            photoIndex: 0,

            x: 320,
            y: 40,
            width: 250,
            height: 234
        },


        /* ==================================
           PHOTO 2 — LEFT
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 320,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

        {
            photoIndex: 2,

            x: 320,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — LEFT
        ================================== */

        {
            photoIndex: 3,

            x: 35,
            y: 820,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 320,
            y: 820,
            width: 250,
            height: 232
        }

    ]

},



    "layout2-design3": {

    image:
        "../assets/strip design/red-pattern-8xs.jpeg",

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
            height: 234
        },


        /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

        {
            photoIndex: 0,

            x: 320,
            y: 50,
            width: 250,
            height: 234
        },


        /* ==================================
           PHOTO 2 — LEFT
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 310,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 320,
            y: 310,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 570,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

        {
            photoIndex: 2,

            x: 320,
            y: 570,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — LEFT
        ================================== */

        {
            photoIndex: 3,

            x: 35,
            y: 830,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 320,
            y: 830,
            width: 250,
            height: 232
        }

    ]

},



    "layout2-design4": {

    image:
        "../assets/strip design/yellow-pattern-8xs.jpeg",

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
            height: 234
        },


        /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

        {
            photoIndex: 0,

            x: 320,
            y: 45,
            width: 250,
            height: 234
        },


        /* ==================================
           PHOTO 2 — LEFT
        ================================== */

        {
            photoIndex: 1,

            x: 33,
            y: 305,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 320,
            y: 305,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 33,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

        {
            photoIndex: 2,

            x: 320,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — LEFT
        ================================== */

        {
            photoIndex: 3,

            x: 33,
            y: 820,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 320,
            y: 820,
            width: 250,
            height: 232
        }

    ]

},



    "layout2-design5": {

    image:
        "../assets/strip design/red-simple-8xs.jpeg",

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
            height: 234
        },


        /* ==================================
           PHOTO 1 — RIGHT
        ================================== */

        {
            photoIndex: 0,

            x: 320,
            y: 40,
            width: 250,
            height: 234
        },


        /* ==================================
           PHOTO 2 — LEFT
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 2 — RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 320,
            y: 300,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 3 — RIGHT
        ================================== */

        {
            photoIndex: 2,

            x: 320,
            y: 560,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — LEFT
        ================================== */

        {
            photoIndex: 3,

            x: 35,
            y: 820,
            width: 250,
            height: 232
        },


        /* ==================================
           PHOTO 4 — RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 320,
            y: 820,
            width: 250,
            height: 232
        }

    ]

},



"layout3-design1": {

    image:
        "../assets/strip design/blue-pattern-4xg.jpeg",

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
            height: 265
        },


        /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 330,
            y: 35,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 315,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 330,
            y: 315,

            width: 280,
            height: 265
        }

    ]

},



"layout3-design2": {

    image:
        "../assets/strip design/green-pattern-4xg.jpeg",

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
            height: 265
        },


        /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 330,
            y: 35,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 315,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 330,
            y: 315,

            width: 280,
            height: 265
        }

    ]

},



"layout3-design3": {

    image:
        "../assets/strip design/red-pattern-4xg.jpeg",

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
            height: 265
        },


        /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 330,
            y: 35,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 315,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 330,
            y: 315,

            width: 280,
            height: 265
        }

    ]

},



"layout3-design4": {

    image:
        "../assets/strip design/yellow-pattern-4xg.jpeg",

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
            height: 265
        },


        /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 330,
            y: 35,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 315,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 330,
            y: 315,

            width: 280,
            height: 265
        }

    ]

},



"layout3-design5": {

    image:
        "../assets/strip design/red-simple-4xg.jpeg",

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
            height: 265
        },


        /* ==================================
           PHOTO 2 — TOP RIGHT
        ================================== */

        {
            photoIndex: 1,

            x: 330,
            y: 35,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 3 — BOTTOM LEFT
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 315,

            width: 280,
            height: 265
        },


        /* ==================================
           PHOTO 4 — BOTTOM RIGHT
        ================================== */

        {
            photoIndex: 3,

            x: 330,
            y: 315,

            width: 280,
            height: 265
        }

    ]

},

"layout4-design1": {

    image:
        "../assets/strip design/blue-pattern-3xs.jpeg",

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
            height: 275
        },


        /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 350,

            width: 290,
            height: 275
        },


        /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

        {
            photoIndex: 2,

            x: 30,
            y: 655,

            width: 290,
            height: 275
        }

    ]

},

"layout4-design2": {

    image:
        "../assets/strip design/green-pattern-3xs.jpeg",

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
            height: 275
        },


        /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

        {
            photoIndex: 1,

            x: 35,
            y: 345,

            width: 285,
            height: 275
        },


        /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

        {
            photoIndex: 2,

            x: 35,
            y: 650,

            width: 285,
            height: 275
        }

    ]

},

"layout4-design3": {

    image:
        "../assets/strip design/red-pattern-3xs.jpeg",

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
            height: 275
        },


        /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 350,

            width: 290,
            height: 275
        },


        /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

        {
            photoIndex: 2,

            x: 30,
            y: 655,

            width: 290,
            height: 275
        }

    ]

},

"layout4-design5": {

    image:
        "../assets/strip design/red-simple-3xs.jpeg",

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
            height: 275
        },


        /* ==================================
           PHOTO 2 — MIDDLE
        ================================== */

        {
            photoIndex: 1,

            x: 30,
            y: 350,

            width: 290,
            height: 275
        },


        /* ==================================
           PHOTO 3 — BOTTOM
        ================================== */

        {
            photoIndex: 2,

            x: 30,
            y: 655,

            width: 290,
            height: 275
        }

    ]

},

"layout5-design1": {

    image:
        "../assets/strip design/blue-pattern-instax.jpeg",

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
            height: 960
        }

    ]

},

"layout5-design2": {

    image:
        "../assets/strip design/green-pattern-instax.jpeg",

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
            height: 960
        }

    ]

},

"layout5-design3": {

    image:
        "../assets/strip design/red-pattern-instax.jpeg",

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
            height: 955
        }

    ]

},

"layout5-design4": {

    image:
        "../assets/strip design/yellow-pattern-instax.jpeg",

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
            height: 955
        }

    ]

},  


};


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

let template =
    stripTemplates[savedStrip];


/*
    Fallback:
    If savedStrip contains the actual
    filename instead:

        blue-pattern-4xs.jpeg

    find the template whose image
    matches that filename.
*/

if(!template){

    template =
        Object.values(
            stripTemplates
        ).find(

            item => {

                const filename =
                    item.image
                        .split("/")
                        .pop();

                return filename === savedStrip;

            }

        );

}


/* ==========================================
   FIND TEMPLATE KEY
========================================== */

let selectedTemplateKey =
    Object.keys(
        stripTemplates
    ).find(

        key =>
            stripTemplates[key] === template

    );


console.log(
    "Selected Template:",
    selectedTemplateKey || "Not Found"
);

console.log(
    "Selected Template Data:",
    template
);


/* ==========================================
   DEVELOPING SCREEN
========================================== */

function showPrinting(){

    /*
       Show developing screen.
    */

    if(developingScreen){

        developingScreen.style.display =
            "flex";

    }


    /*
       Hide result screen.
    */

    if(resultScreen){

        resultScreen.style.display =
            "none";

    }


    /*
       Reset progress.
    */

    if(developingProgress){

        developingProgress.style.width =
            "10%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Preparing your photos...";

    }

}


/* ==========================================
   ERROR SCREEN
========================================== */

function showError(message){

    console.error(
        "Memory Lane:",
        message
    );


    /*
       Hide developing screen.
    */

    if(developingScreen){

        developingScreen.style.display =
            "none";

    }


    /*
       Show error.
    */

    if(resultScreen){

        resultScreen.style.display =
            "flex";


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

function loadImage(src){

    return new Promise(

        (resolve, reject) => {

            if(!src){

                reject(

                    new Error(
                        "Image source is empty."
                    )

                );

                return;

            }


            const image =
                new Image();


            image.onload =
                () => {

                    console.log(
                        "Image loaded successfully:",
                        src
                    );

                    resolve(image);

                };


            image.onerror =
                () => {

                    reject(

                        new Error(
                            "Could not load image: " + src
                        )

                    );

                };


            image.src =
                src;

        }

    );

}


/* ==========================================
   DRAW PHOTO INTO SLOT
========================================== */

function drawImageCover(

    ctx,
    image,
    slot

){

    const imageRatio =
        image.width /
        image.height;

    const slotRatio =
        slot.width /
        slot.height;


    let sourceWidth =
        image.width;

    let sourceHeight =
        image.height;

    let sourceX =
        0;

    let sourceY =
        0;


    /* ======================================
       CROP LEFT / RIGHT
    ====================================== */

    if(imageRatio > slotRatio){

        sourceWidth =
            image.height *
            slotRatio;

        sourceX =
            (
                image.width -
                sourceWidth
            ) / 2;

    }


    /* ======================================
       CROP TOP / BOTTOM
    ====================================== */

    else if(imageRatio < slotRatio){

        sourceHeight =
            image.width /
            slotRatio;

        sourceY =
            (
                image.height -
                sourceHeight
            ) / 2;

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
        slot.height

    );

}


/* ==========================================
   CREATE STRIP
========================================== */

async function createStrip(){

    console.log(
        "Creating strip..."
    );


    /* ======================================
       CHECK TEMPLATE
    ====================================== */

    if(!template){

        throw new Error(

            `Template "${savedStrip}" has not been configured yet.`

        );

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

    const requiredPhotos =
        template.slots.reduce(

            (highest, slot) => {

                const photoIndex =
                    slot.photoIndex !== undefined
                        ? slot.photoIndex
                        : 0;

                return Math.max(
                    highest,
                    photoIndex + 1
                );

            },

            0

        );


    console.log(
        "Required Photos:",
        requiredPhotos
    );


    /* ======================================
       CHECK PHOTOS
    ====================================== */

    if(
        photos.length <
        requiredPhotos
    ){

        throw new Error(

            `This design needs ${requiredPhotos} photos, ` +
            `but only ${photos.length} were found.`

        );

    }


    /* ======================================
       CREATE CANVAS
    ====================================== */

    const canvas =
        document.createElement("canvas");


    canvas.width =
        template.width;

    canvas.height =
        template.height;


    const ctx =
        canvas.getContext("2d");


    if(!ctx){

        throw new Error(
            "Could not create canvas context."
        );

    }


    /* ======================================
       WHITE BACKGROUND
    ====================================== */

    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    /* ======================================
       UPDATE PROGRESS
    ====================================== */

    if(developingProgress){

        developingProgress.style.width =
            "30%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Loading your photos...";

    }


    /* ======================================
       LOAD PHOTOS
    ====================================== */

    console.log(
        "Loading captured photos..."
    );


    /*
       Load photos according to
       photoIndex.

       This allows duplicate slots.

       Example:

       Slot 1 → photoIndex 0
       Slot 2 → photoIndex 0

       Both use Photo 1.
    */

    const loadedPhotos =
        await Promise.all(

            template.slots.map(

                slot => {

                    const photoIndex =
                        slot.photoIndex !== undefined
                            ? slot.photoIndex
                            : 0;

                    return loadImage(
                        photos[photoIndex]
                    );

                }

            )

        );


    console.log(
        "All photos loaded."
    );


    /* ======================================
       UPDATE PROGRESS
    ====================================== */

    if(developingProgress){

        developingProgress.style.width =
            "60%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Putting your memories together...";

    }


    /* ======================================
       DRAW PHOTOS
    ====================================== */

    loadedPhotos.forEach(

        (photo, index) => {

            drawImageCover(

                ctx,

                photo,

                template.slots[index]

            );

        }

    );


    /* ======================================
       LOAD TEMPLATE IMAGE
    ====================================== */

    console.log(
        "Loading strip template:",
        template.image
    );


    if(developingProgress){

        developingProgress.style.width =
            "75%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Adding your strip design...";

    }


    const templateImage =
        await loadImage(
            template.image
        );


    console.log(
        "Strip template loaded."
    );


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

    ctx.globalCompositeOperation =
        "multiply";


    ctx.drawImage(

        templateImage,

        0,
        0,

        template.width,
        template.height

    );


    ctx.globalCompositeOperation =
        "source-over";


    /* ======================================
       COMPLETE PROGRESS
    ====================================== */

    if(developingProgress){

        developingProgress.style.width =
            "90%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Finishing your memory strip...";

    }


    console.log(
        "Strip successfully created."
    );


    return canvas;

}


/* ==========================================
   DISPLAY STRIP
========================================== */

function displayStrip(canvas){

    if(!finalStrip){

        console.error(
            "Final strip container was not found."
        );

        return;

    }


    /* ======================================
       CLEAR OLD RESULT
    ====================================== */

    finalStrip.innerHTML =
        "";


    /* ======================================
       CREATE IMAGE
    ====================================== */

    const image =
        document.createElement("img");


    image.alt =
        "Some Memory Lane Photo Strip";


    image.src =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );


    /*
       The image keeps the natural dimensions
       of the selected template.

       CSS controls how large it appears
       on the screen.
    */

    image.style.width =
        "100%";

    image.style.height =
        "auto";

    image.style.display =
        "block";


    finalStrip.appendChild(
        image
    );


    /* ======================================
       SAVE FINAL STRIP
    ====================================== */

    sessionStorage.setItem(

        "memoryLaneFinalStrip",

        image.src

    );


    /*
       Also save the selected template
       dimensions for printing if needed.
    */

    sessionStorage.setItem(

        "memoryLaneFinalStripDimensions",

        JSON.stringify({

            width:
                template.width,

            height:
                template.height

        })

    );


    console.log(
        "Final strip saved."
    );


    /* ======================================
       UPDATE RESULT DETAILS
    ====================================== */

    if(resultLayout){

        resultLayout.textContent =
            layout;

    }


    if(resultDesign){

        resultDesign.textContent =
            design;

    }


    /* ======================================
       COMPLETE PROGRESS
    ====================================== */

    if(developingProgress){

        developingProgress.style.width =
            "100%";

    }


    if(developingStatus){

        developingStatus.textContent =
            "Your strip is ready!";

    }


    /* ======================================
       SWITCH TO RESULT SCREEN
    ====================================== */

    setTimeout(

        () => {

            if(developingScreen){

                developingScreen.style.display =
                    "none";

            }


            if(resultScreen){

                resultScreen.style.display =
                    "flex";

            }


            console.log(
                "Result screen displayed."
            );

        },

        300

    );

}


/* ==========================================
   DOWNLOAD STRIP
========================================== */

function downloadStrip(){

    const image =
        sessionStorage.getItem(
            "memoryLaneFinalStrip"
        );


    if(!image){

        alert(
            "Your memory strip is not ready yet."
        );

        return;

    }


    const link =
        document.createElement("a");


    link.href =
        image;


    link.download =
        "some-memory-lane-strip.jpg";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

}


/* ==========================================
   FINISH SESSION
========================================== */

function finishSession(){

    /*
        Clear current photo booth session.
    */

    sessionStorage.removeItem(
        "memoryLaneSession"
    );

    sessionStorage.removeItem(
        "memoryLaneFinalStrip"
    );

    sessionStorage.removeItem(
        "memoryLaneFinalStripDimensions"
    );

    localStorage.removeItem(
        "memoryLanePhotos"
    );


    /*
        Return to beginning.
    */

    window.location.href =
        "../index.html";

}


/* ==========================================
   PRINT STRIP
========================================== */

function printStrip(){

    const image =
        sessionStorage.getItem(
            "memoryLaneFinalStrip"
        );


    if(!image){

        alert(
            "Your memory strip is not ready yet."
        );

        return;

    }


    /*
       Get dimensions of the selected
       template.

       This prevents Layout 2 from
       being forced into Layout 1's
       dimensions.
    */

    let printWidth =
        template
            ? template.width
            : 426;

    let printHeight =
        template
            ? template.height
            : 1332;


    /*
       Create temporary print window.
    */

    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if(!printWindow){

        alert(
            "Please allow pop-ups to print your strip."
        );

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

    printWindow.onload =
        () => {

            printWindow.focus();

            printWindow.print();

        };

}


/* ==========================================
   BUTTON EVENTS
========================================== */

if(downloadButton){

    downloadButton.addEventListener(

        "click",

        downloadStrip

    );

}


if(printButton){

    printButton.addEventListener(

        "click",

        printStrip

    );

}


if(finishButton){

    finishButton.addEventListener(

        "click",

        finishSession

    );

}


/* ==========================================
   MAIN
========================================== */

async function generateStrip(){

    console.log(
        "Starting strip generation..."
    );


    /* ======================================
       SHOW DEVELOPING SCREEN
    ====================================== */

    showPrinting();


    /* ======================================
       CREATE STRIP
    ====================================== */

    try{

        const canvas =
            await createStrip();


        /* ==================================
           DISPLAY RESULT
        ================================== */

        displayStrip(
            canvas
        );


        console.log(
            "Strip generation complete."
        );

    }

    catch(error){

        console.error(
            "STRIP GENERATION FAILED:",
            error
        );


        showError(
            error.message
        );

    }

}


/* ==========================================
   START
========================================== */

generateStrip();