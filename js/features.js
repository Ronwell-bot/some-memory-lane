/* ==========================================
   SOME MEMORY LANE
   FEATURED WALL
   INTERACTION SCRIPT
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const wall =
    document.getElementById("memoryWall");

const shuffleButton =
    document.getElementById("shuffleBtn");

const strips =
    Array.from(
        document.querySelectorAll(".strip")
    );


/* ==========================================
   STATE
========================================== */

let highestZIndex = 20;

let isDragging = false;

let draggedStrip = null;

let dragOffsetX = 0;

let dragOffsetY = 0;


/* ==========================================
   INITIAL SETUP
========================================== */

function setupStrips() {

    strips.forEach((strip, index) => {

        strip.style.zIndex =
            5 + index;

        strip.addEventListener(
            "pointerdown",
            startDragging
        );

        strip.addEventListener(
            "click",
            selectStrip
        );

    });

}


/* ==========================================
   SELECT STRIP
========================================== */

function selectStrip(event) {

    /*
        Don't trigger selection after
        dragging.
    */

    if (
        stripWasDragged
    ) {

        stripWasDragged = false;

        return;

    }


    const strip =
        event.currentTarget;


    highestZIndex++;


    strip.style.zIndex =
        highestZIndex;


    strips.forEach(item => {

        item.classList.remove(
            "is-selected"
        );

    });


    strip.classList.add(
        "is-selected"
    );


    /*
        Remove the selected state
        after a short moment.
    */

    clearTimeout(
        strip.selectionTimeout
    );


    strip.selectionTimeout =
        setTimeout(() => {

            strip.classList.remove(
                "is-selected"
            );

        }, 500);

}


/* ==========================================
   DRAGGING
========================================== */

let stripWasDragged =
    false;


function startDragging(event) {

    /*
        Only react to primary pointer.
    */

    if (
        event.button !== 0
    ) {

        return;

    }


    draggedStrip =
        event.currentTarget;


    isDragging = true;

    stripWasDragged = false;


    const wallRect =
        wall.getBoundingClientRect();

    const stripRect =
        draggedStrip.getBoundingClientRect();


    /*
        Convert the strip's current
        position into wall-relative
        coordinates.
    */

    const currentLeft =
        stripRect.left -
        wallRect.left;


    const currentTop =
        stripRect.top -
        wallRect.top;


    /*
        Pointer offset inside card.
    */

    dragOffsetX =
        event.clientX -
        stripRect.left;


    dragOffsetY =
        event.clientY -
        stripRect.top;


    /*
        Change from percentage-based
        positioning to pixels while
        dragging.
    */

    draggedStrip.style.left =
        `${currentLeft}px`;

    draggedStrip.style.top =
        `${currentTop}px`;

    draggedStrip.style.right =
        "auto";

    draggedStrip.style.bottom =
        "auto";


    /*
        Bring to front.
    */

    highestZIndex++;

    draggedStrip.style.zIndex =
        highestZIndex;


    draggedStrip.classList.add(
        "is-selected"
    );


    draggedStrip.setPointerCapture(
        event.pointerId
    );


    draggedStrip.addEventListener(
        "pointermove",
        dragStrip
    );

    draggedStrip.addEventListener(
        "pointerup",
        stopDragging
    );

    draggedStrip.addEventListener(
        "pointercancel",
        stopDragging
    );

}


/* ==========================================
   MOVE STRIP
========================================== */

function dragStrip(event) {

    if (
        !isDragging ||
        !draggedStrip
    ) {

        return;

    }


    stripWasDragged =
        true;


    const wallRect =
        wall.getBoundingClientRect();


    const stripRect =
        draggedStrip.getBoundingClientRect();


    let newLeft =
        event.clientX -
        wallRect.left -
        dragOffsetX;


    let newTop =
        event.clientY -
        wallRect.top -
        dragOffsetY;


    /*
        Keep the strip inside the wall.
    */

    const maxLeft =
        wall.clientWidth -
        stripRect.width;


    const maxTop =
        wall.clientHeight -
        stripRect.height;


    newLeft =
        Math.max(
            0,
            Math.min(
                newLeft,
                maxLeft
            )
        );


    newTop =
        Math.max(
            0,
            Math.min(
                newTop,
                maxTop
            )
        );


    draggedStrip.style.left =
        `${newLeft}px`;

    draggedStrip.style.top =
        `${newTop}px`;


    /*
        Disable the normal transition
        while dragging.
    */

    draggedStrip.style.transition =
        "none";

}


/* ==========================================
   STOP DRAGGING
========================================== */

function stopDragging(event) {

    if (
        !draggedStrip
    ) {

        return;

    }


    isDragging = false;


    draggedStrip.releasePointerCapture(
        event.pointerId
    );


    draggedStrip.removeEventListener(
        "pointermove",
        dragStrip
    );

    draggedStrip.removeEventListener(
        "pointerup",
        stopDragging
    );

    draggedStrip.removeEventListener(
        "pointercancel",
        stopDragging
    );


    /*
        Restore transitions.
    */

    draggedStrip.style.transition =
        "";


    /*
        Remove selection after dragging.
    */

    setTimeout(() => {

        if (
            draggedStrip
        ) {

            draggedStrip.classList.remove(
                "is-selected"
            );

        }

    }, 200);


    draggedStrip =
        null;

}


/* ==========================================
   RANDOM POSITION GENERATOR
========================================== */

function randomPosition(
    strip,
    index
) {

    const wallWidth =
        wall.clientWidth;

    const wallHeight =
        wall.clientHeight;


    const stripWidth =
        strip.offsetWidth;

    const stripHeight =
        strip.offsetHeight;


    /*
        Keep a generous safe area
        around the edges.
    */

    const horizontalPadding =
        Math.max(
            15,
            wallWidth * 0.025
        );


    const verticalPadding =
        Math.max(
            15,
            wallHeight * 0.025
        );


    const maxLeft =
        Math.max(
            horizontalPadding,
            wallWidth -
            stripWidth -
            horizontalPadding
        );


    const maxTop =
        Math.max(
            verticalPadding,
            wallHeight -
            stripHeight -
            verticalPadding
        );


    /*
        Random position.
    */

    let left =
        randomNumber(
            horizontalPadding,
            maxLeft
        );


    let top =
        randomNumber(
            verticalPadding,
            maxTop
        );


    /*
        Rotation.
    */

    const rotation =
        randomNumber(
            -10,
            10
        );


    return {

        left,

        top,

        rotation

    };

}


/* ==========================================
   RANDOM NUMBER
========================================== */

function randomNumber(
    min,
    max
) {

    return (
        Math.random() *
        (max - min)
    ) + min;

}


/* ==========================================
   SHUFFLE
========================================== */

function shuffleMemories() {

    if (
        isDragging
    ) {

        return;

    }


    /*
        Button animation.
    */

    shuffleButton.classList.add(
        "is-spinning"
    );


    setTimeout(() => {

        shuffleButton.classList.remove(
            "is-spinning"
        );

    }, 500);


    /*
        Shuffle the order.
    */

    const shuffled =
        [...strips].sort(
            () =>
                Math.random() - 0.5
        );


    /*
        Move each strip.
    */

    shuffled.forEach(
        (strip, index) => {

            const position =
                randomPosition(
                    strip,
                    index
                );


            /*
                Remove old percentage
                positioning.
            */

            strip.style.right =
                "auto";

            strip.style.bottom =
                "auto";


            /*
                Apply new position.
            */

            strip.style.left =
                `${position.left}px`;

            strip.style.top =
                `${position.top}px`;


            strip.style.setProperty(
                "--rotation",
                `${position.rotation}deg`
            );


            /*
                Random stacking.
            */

            highestZIndex++;

            strip.style.zIndex =
                highestZIndex;


            /*
                Small stagger.
            */

            strip.style.transitionDelay =
                `${index * 45}ms`;


            strip.classList.add(
                "is-shuffling"
            );

        }
    );


    /*
        Clean up transition delays.
    */

    setTimeout(() => {

        strips.forEach(strip => {

            strip.style.transitionDelay =
                "";

            strip.classList.remove(
                "is-shuffling"
            );

        });

    }, 1100);

}


/* ==========================================
   SHUFFLE BUTTON
========================================== */

shuffleButton.addEventListener(
    "click",
    shuffleMemories
);


/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            strips.forEach(strip => {

                strip.classList.remove(
                    "is-selected"
                );

            });

        }

    }
);


/* ==========================================
   INITIALIZE
========================================== */

setupStrips();