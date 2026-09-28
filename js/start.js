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

const sessionStep = document.getElementById("sessionStep");

const layoutStep = document.getElementById("layoutStep");

const groupOptions = document.getElementById("groupOptions");

const sessionAvailabilityMessage = document.getElementById(
  "sessionAvailabilityMessage",
);

const sessionContinue = document.getElementById("sessionContinue");

const layoutContinue = document.getElementById("layoutContinue");

const layoutBack = document.getElementById("layoutBack");

const selectedCaptureCount = document.getElementById("selectedCaptureCount");

const layoutChoices = document.querySelectorAll(".layout-choice");

const designHint = document.getElementById("designHint");

const designFilters = document.getElementById("designFilters");

let selectedDesignCategory = "";

/* ==========================================
   SESSION SELECTION
========================================== */

const sessionCards = document.querySelectorAll(".session-card");

sessionCards.forEach((card) => {
  card.setAttribute(
    "aria-pressed",
    String(card.classList.contains("selected")),
  );

  card.addEventListener("click", () => {
    if (card.disabled) {
      return;
    }

    /*
            Remove previous selection.
        */

    sessionCards.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });

    /*
            Select clicked session.
        */

    card.classList.add("selected");
    card.setAttribute("aria-pressed", "true");

    /*
            Save session choice.
        */

    sessionChoice = card.dataset.session;

    /*
            Duo / Group are not available yet.
        */

    if (sessionChoice === "Group" || sessionChoice === "Duo") {
      if (groupOptions) {
        groupOptions.classList.add("show");
      }

      if (sessionContinue) {
        sessionContinue.disabled = true;
      }

      if (sessionAvailabilityMessage) {
        sessionAvailabilityMessage.textContent = `${sessionChoice} sessions are coming soon.`;
      }
    } else {
      if (groupOptions) {
        groupOptions.classList.remove("show");
      }

      if (sessionContinue) {
        sessionContinue.disabled = false;
      }
    }
  });
});

/* ==========================================
   SESSION → LAYOUT
========================================== */

if (sessionContinue) {
  sessionContinue.addEventListener("click", () => {
    /*
                Only Solo is currently available.
            */

    if (sessionChoice !== "Solo") {
      return;
    }

    sessionStep.classList.remove("active");

    layoutStep.classList.add("active");
  });
}

/* ==========================================
   STRIP SELECTION
========================================== */

const stripScroller = document.getElementById("layoutScroller");

function renderCatalogOptions() {
  if (!stripScroller || !window.MemoryLaneStripCatalog) {
    return;
  }

  stripScroller.replaceChildren();

  window.MemoryLaneStripCatalog.all().forEach((entry) => {
    const option = document.createElement("button");
    const preview = document.createElement("div");
    const image = document.createElement("img");

    option.type = "button";
    option.className = "strip-option";
    option.dataset.layout = entry.layout;
    option.dataset.design = entry.name;
    option.dataset.strip = entry.id;
    option.dataset.captures = String(entry.captureCount);
    option.dataset.category = entry.category;
    option.setAttribute(
      "aria-label",
      `${entry.name}, ${entry.captureCount} photos`,
    );

    preview.className = "strip-preview";
    image.src = `../${entry.previewImage}`;
    image.alt = `${entry.name} preview`;
    preview.appendChild(image);
    option.appendChild(preview);
    stripScroller.appendChild(option);
  });
}

function renderDesignFilters(selectedLayout) {
  if (!designFilters) {
    return;
  }

  const categories = [
    ...new Set(
      Array.from(stripOptions || [])
        .filter((option) => option.dataset.layout === selectedLayout)
        .map((option) => option.dataset.category),
    ),
  ];

  const preferredCategory =
    selectedLayout === "Layout 1" && categories.includes("Numbered collection")
      ? "Numbered collection"
      : categories[0];

  designFilters.replaceChildren();

  categories.forEach((category, index) => {
    const filter = document.createElement("button");
    filter.type = "button";
    filter.className = "design-filter";
    filter.textContent = category;
    filter.dataset.category = category;
    filter.setAttribute("aria-pressed", String(category === preferredCategory));
    filter.addEventListener("click", () => {
      selectedDesignCategory = category;
      designFilters.querySelectorAll(".design-filter").forEach((item) => {
        item.classList.toggle("selected", item === filter);
        item.setAttribute("aria-pressed", String(item === filter));
      });
      filterDesigns(selectedLayout, selectedDesignCategory);
    });
    if (category === preferredCategory) {
      filter.classList.add("selected");
      selectedDesignCategory = category;
    }
    designFilters.appendChild(filter);
  });
}

renderCatalogOptions();

const stripOptions = document.querySelectorAll(".strip-option");

function filterDesigns(selectedLayout, category = selectedDesignCategory) {
  stripOptions.forEach((option) => {
    option.hidden =
      option.dataset.layout !== selectedLayout ||
      (category && option.dataset.category !== category);
  });

  const selectedOption = Array.from(stripOptions).find(
    (option) =>
      option.dataset.layout === selectedLayout &&
      (!category || option.dataset.category === category),
  );

  stripOptions.forEach((option) => option.classList.remove("selected"));

  if (selectedOption) {
    selectedOption.classList.add("selected");
    layoutChoice = selectedOption.dataset.layout || selectedLayout;
    designChoice = selectedOption.dataset.design || "Blue";
    stripChoice = selectedOption.dataset.strip || "layout1-design1";
    captureChoice = Number(selectedOption.dataset.captures) || 4;
    updateCaptureDisplay();
  }

  if (designHint) {
    designHint.textContent = category || `${selectedLayout} designs`;
  }
}

layoutChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    layoutChoices.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });

    choice.classList.add("selected");
    choice.setAttribute("aria-pressed", "true");
    const selectedLayout = choice.dataset.layoutFilter || "Layout 1";
    renderDesignFilters(selectedLayout);
    filterDesigns(selectedLayout);
  });
});

stripOptions.forEach((option) => {
  option.addEventListener("click", () => {
    /*
                Remove previous selection.
            */

    stripOptions.forEach((item) => {
      item.classList.remove("selected");
    });

    /*
                Select clicked strip.
            */

    option.classList.add("selected");

    /*
                Save layout.
            */

    layoutChoice = option.dataset.layout || "Layout 1";

    /*
                Save design.
            */

    designChoice = option.dataset.design || "Blue";

    /*
                Save strip identifier.
            */

    stripChoice = option.dataset.strip || "layout1-design1";

    /*
                Get the number of photos
                from the selected strip.
            */

    captureChoice = Number(option.dataset.captures) || 4;

    option.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    /*
                Update visible count.
            */

    updateCaptureDisplay();

    /*
                Debug.
            */

    console.log("Selected Strip:", stripChoice);

    console.log("Layout:", layoutChoice);

    console.log("Design:", designChoice);

    console.log("Captures:", captureChoice);
  });
});

renderDesignFilters(layoutChoice);
filterDesigns(layoutChoice);

/* ==========================================
   UPDATE PHOTO COUNT
========================================== */

function updateCaptureDisplay() {
  if (!selectedCaptureCount) {
    return;
  }

  selectedCaptureCount.textContent = captureChoice;
}

/* ==========================================
   INITIAL PHOTO COUNT
========================================== */

updateCaptureDisplay();

/* ==========================================
   HORIZONTAL STRIP SCROLL
========================================== */

const layoutScroller = document.getElementById("layoutScroller");

const layoutLeft = document.getElementById("layoutLeft");

const layoutRight = document.getElementById("layoutRight");

/*
    Scroll left.
*/

if (layoutLeft && layoutScroller) {
  layoutLeft.addEventListener("click", () => {
    layoutScroller.scrollBy({
      left: -Math.max(260, layoutScroller.clientWidth * 0.7),

      behavior: "smooth",
    });
  });
}

/*
    Scroll right.
*/

if (layoutRight && layoutScroller) {
  layoutRight.addEventListener("click", () => {
    layoutScroller.scrollBy({
      left: Math.max(260, layoutScroller.clientWidth * 0.7),

      behavior: "smooth",
    });
  });
}

/* ==========================================
   BACK → SESSION
========================================== */

if (layoutBack) {
  layoutBack.addEventListener("click", () => {
    layoutStep.classList.remove("active");

    sessionStep.classList.add("active");
  });
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

function clearPreviousSession() {
  let previousSession = null;

  try {
    previousSession = JSON.parse(
      sessionStorage.getItem("memoryLaneSession") || "null",
    );
  } catch (error) {
    console.warn("Unable to inspect the previous session.", error);
  }

  window.MemoryLanePhotoStorage?.remove(previousSession?.id)?.catch(() => {});
  localStorage.removeItem("memoryLanePhotos");

  sessionStorage.removeItem("memoryLaneSession");

  console.log("Previous Memory Lane session cleared.");
}

/* ==========================================
   SAVE SESSION
========================================== */

function saveSession() {
  /*
        IMPORTANT:
        Start with a completely clean
        photo/session state.
    */

  clearPreviousSession();

  const memoryLaneSession = {
    id: globalThis.crypto?.randomUUID?.() || `session-${Date.now()}`,
    session: sessionChoice,

    layout: layoutChoice,

    design: designChoice,

    strip: stripChoice,

    captures: captureChoice,

    photoCount: captureChoice,
  };

  sessionStorage.setItem(
    "memoryLaneSession",

    JSON.stringify(memoryLaneSession),
  );

  /*
        Make absolutely sure there are
        no old photos.
    */

  console.log("New Memory Lane Session Saved:", memoryLaneSession);
}

/* ==========================================
   STRIP → CAMERA
========================================== */

if (layoutContinue) {
  layoutContinue.addEventListener("click", () => {
    /*
                Find the currently selected strip.
            */

    const selectedStrip = document.querySelector(".strip-option.selected");

    /*
                Make sure a strip exists.
            */

    if (!selectedStrip) {
      alert("Please choose a strip first.");

      return;
    }

    /*
                Read the current selection
                one final time.
            */

    layoutChoice = selectedStrip.dataset.layout || "Layout 1";

    designChoice = selectedStrip.dataset.design || "Blue";

    stripChoice = selectedStrip.dataset.strip || "layout1-design1";

    captureChoice = Number(selectedStrip.dataset.captures) || 4;

    /*
                IMPORTANT:

                Start a completely fresh session.
            */

    saveSession();

    /*
                Debug information.
            */

    console.log("-------------------------");

    console.log("NEW SESSION");

    console.log("Session:", sessionChoice);

    console.log("Layout:", layoutChoice);

    console.log("Design:", designChoice);

    console.log("Strip:", stripChoice);

    console.log("Captures:", captureChoice);

    console.log("Photos:", 0);

    console.log("-------------------------");

    /*
                Go to camera.
            */

    document.body.classList.add("leaving-page");

    window.setTimeout(
      () => {
        window.location.href = "../pages/camera.html";
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420,
    );
  });
}
