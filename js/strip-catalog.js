/*
 * Shared strip catalog.
 * Paths are workspace-relative so each page can resolve them from its own URL.
 */
(function createStripCatalog(global) {
  const designs = [
    {
      layout: "Layout 1",
      captureCount: 4,
      width: 430,
      height: 1330,
      category: "Classic 4-photo strips",
      ids: [
        ["layout1-design1", "Classic Blue", "blue-pattern-4xs.jpeg"],
        ["layout1-design2", "Classic Green", "green-pattern-4xs.jpeg"],
        ["layout1-design3", "Classic Red", "red-pattern-4xs.jpeg"],
        ["layout1-design4", "Classic Yellow", "yellow-pattern-4xs.jpeg"],
        ["layout1-design6", "Cat", "cat-4xs.jpg"],
        ["layout1-design7", "Cat Two", "cat2-4xs.jpg"],
      ],
    },
    {
      layout: "Layout 2",
      captureCount: 4,
      width: 600,
      height: 1200,
      category: "2x4 layouts",
      ids: [
        ["layout2-design1", "2x4 Blue", "blue-pattern-8xs.jpeg"],
        ["layout2-design2", "2x4 Green", "green-pattern-8xs.jpeg"],
        ["layout2-design3", "2x4 Red", "red-pattern-8xs.jpeg"],
        ["layout2-design4", "2x4 Yellow", "yellow-pattern-8xs.jpeg"],
      ],
    },
    {
      layout: "Layout 3",
      captureCount: 4,
      width: 650,
      height: 650,
      category: "Grid layouts",
      ids: [
        ["layout3-design1", "Grid Blue", "blue-pattern-4xg.jpeg"],
        ["layout3-design2", "Grid Green", "green-pattern-4xg.jpeg"],
        ["layout3-design3", "Grid Red", "red-pattern-4xg.jpeg"],
        ["layout3-design4", "Grid Yellow", "yellow-pattern-4xg.jpeg"],
      ],
    },
    {
      layout: "Layout 4",
      captureCount: 3,
      width: 350,
      height: 1050,
      category: "3-photo strips",
      ids: [
        ["layout4-design1", "Three Blue", "blue-pattern-3xs.jpeg"],
        ["layout4-design2", "Three Green", "green-pattern-3xs.jpeg"],
        ["layout4-design3", "Three Red", "red-pattern-3xs.jpeg"],
        ["layout4-design4", "Three Yellow", "yellow-pattern-3xs.jpeg"],
      ],
    },
    {
      layout: "Layout 5",
      captureCount: 1,
      width: 970,
      height: 1139,
      category: "Instax",
      ids: [
        ["layout5-design1", "Instax Blue", "blue-pattern-instax.jpeg"],
        ["layout5-design2", "Instax Green", "green-pattern-instax.jpeg"],
        ["layout5-design3", "Instax Red", "red-pattern-instax.jpeg"],
        ["layout5-design4", "Instax Yellow", "yellow-pattern-instax.jpeg"],
      ],
    },
  ];

  const entries = designs.flatMap((group) =>
    group.ids.map(([id, name, fileName]) => ({
      id,
      name,
      layout: group.layout,
      captureCount: group.captureCount,
      width: group.width,
      height: group.height,
      category: group.category,
      assetPath: `assets/strip design/${fileName}`,
      previewImage: `assets/strip design/${fileName}`,
      outputTemplate: `assets/strip design/${fileName}`,
    })),
  );

  const dimensionOverrides = {
    "layout1-design1": [426, 1332],
    "layout1-design2": [424, 1313],
    "layout1-design3": [430, 1313],
    "layout1-design4": [475, 1330],
  };

  entries.forEach((entry) => {
    const dimensions = dimensionOverrides[entry.id];

    if (dimensions) {
      [entry.width, entry.height] = dimensions;
    }

    if (entry.id === "layout1-design6" || entry.id === "layout1-design7") {
      entry.category = "Cat designs";
    }
  });

  for (let imageNumber = 1; imageNumber <= 13; imageNumber += 1) {
    entries.push({
      id: `layout1-design${imageNumber + 7}`,
      name: `Numbered ${String(imageNumber).padStart(2, "0")}`,
      layout: "Layout 1",
      captureCount: 4,
      width: 450,
      height: 1300,
      category: "Numbered collection",
      assetPath: `assets/strip design/${imageNumber}.png`,
      previewImage: `assets/strip design/${imageNumber}.png`,
      outputTemplate: `assets/strip design/${imageNumber}.png`,
    });
  }

  const byId = Object.fromEntries(entries.map((entry) => [entry.id, entry]));

  global.MemoryLaneStripCatalog = Object.freeze({
    all() {
      return entries.slice();
    },
    get(id) {
      return byId[id] || null;
    },
    forLayout(layout) {
      return entries.filter((entry) => entry.layout === layout);
    },
    resolveAsset(pagePath, assetPath) {
      return `${pagePath}${assetPath}`;
    },
  });
})(window);
