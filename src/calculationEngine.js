const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const positive = (value, fallback = 0) => {
  const number = toNumber(value);
  return number > 0 ? number : fallback;
};

export const MEASUREMENT_DEFINITIONS = [
  {
    id: "ROOMS",
    label: "Rooms / Spaces",
    description: "Length, width and wall height",
    fields: ["length", "width", "height"],
    calculated: true,
  },
  {
    id: "DOORS",
    label: "Doors",
    description: "Door count, width and height",
    fields: ["doorCount", "doorWidth", "doorHeight"],
    calculated: true,
  },
  {
    id: "WINDOWS",
    label: "Windows",
    description: "Window count, width and height",
    fields: ["windowCount", "windowWidth", "windowHeight"],
    calculated: true,
  },
  {
    id: "COUNTERTOP",
    label: "Countertop",
    description: "Countertop length and depth",
    fields: ["countertopLength", "countertopDepth"],
    calculated: true,
  },
  {
    id: "BACKSPLASH",
    label: "Backsplash",
    description: "Backsplash length and height",
    fields: ["backsplashLength", "backsplashHeight"],
    calculated: true,
  },
  {
    id: "RUNNING_FEET",
    label: "Running Feet",
    description: "Required running length",
    fields: ["runningFeet"],
    calculated: false,
  },
  {
    id: "QUANTITY",
    label: "Quantity",
    description: "Number of pieces/items/points",
    fields: ["quantity"],
    calculated: false,
  },
  {
    id: "LENGTH",
    label: "Length",
    description: "Required length",
    fields: ["lengthInput"],
    calculated: false,
  },
  {
    id: "WIDTH",
    label: "Width",
    description: "Required width",
    fields: ["widthInput"],
    calculated: false,
  },
  {
    id: "HEIGHT",
    label: "Height",
    description: "Required height",
    fields: ["heightInput"],
    calculated: false,
  },
  {
    id: "VOLUME",
    label: "Volume",
    description: "Required volume",
    fields: ["volume"],
    calculated: false,
  },
];

export const MEASUREMENT_SOURCES = [
  {
    value: "FLOOR_AREA",
    label: "Floor Area",
    group: "Calculated",
  },
  {
    value: "CEILING_AREA",
    label: "Ceiling Area",
    group: "Calculated",
  },
  {
    value: "WALL_AREA",
    label: "Wall Area",
    group: "Calculated",
  },
  {
    value: "NET_WALL_AREA",
    label: "Net Wall Area",
    group: "Calculated",
  },
  {
    value: "PERIMETER",
    label: "Wall Perimeter",
    group: "Calculated",
  },
  {
    value: "DOOR_AREA",
    label: "Door Area",
    group: "Calculated",
  },
  {
    value: "WINDOW_AREA",
    label: "Window Area",
    group: "Calculated",
  },
  {
    value: "COUNTERTOP_AREA",
    label: "Countertop Area",
    group: "Calculated",
  },
  {
    value: "BACKSPLASH_AREA",
    label: "Backsplash Area",
    group: "Calculated",
  },
  {
    value: "RUNNING_FEET",
    label: "Running Feet",
    group: "Manual",
  },
  {
    value: "QUANTITY",
    label: "Quantity",
    group: "Manual",
  },
  {
    value: "LENGTH",
    label: "Length",
    group: "Manual",
  },
  {
    value: "WIDTH",
    label: "Width",
    group: "Manual",
  },
  {
    value: "HEIGHT",
    label: "Height",
    group: "Manual",
  },
  {
    value: "VOLUME",
    label: "Volume",
    group: "Manual",
  },
];

export const FORMULA_DEFINITIONS = [
  {
    value: "DIRECT",
    label: "Direct Quantity",
    description:
      "Uses the selected measurement directly.",
  },
  {
    value: "AREA_WASTAGE",
    label: "Area + Wastage",
    description:
      "Uses the selected measurement directly and applies wastage.",
  },
  {
    value: "PAINT",
    label: "Paint Coverage",
    description:
      "Area ÷ coverage × coats.",
  },
  {
    value: "FACTOR",
    label: "Measurement × Factor",
    description:
      "Multiplies the measurement by a configurable factor.",
  },
  {
    value: "VOLUME_FACTOR",
    label: "Volume × Factor",
    description:
      "Multiplies volume by a configurable factor.",
  },
  {
    value: "CUSTOM",
    label: "Custom Factor",
    description:
      "Measurement × custom factor.",
  },
];

export function getHomeMeasurements(
  rooms = [],
  measurements = {}
) {
  let floorArea = 0;
  let wallArea = 0;
  let perimeter = 0;

  rooms.forEach((room) => {
    const length = toNumber(room.length);
    const width = toNumber(room.width);
    const height = toNumber(room.height);

    if (length > 0 && width > 0) {
      floorArea += length * width;
    }

    if (length > 0 && width > 0) {
      perimeter += 2 * (length + width);
    }

    if (
      length > 0 &&
      width > 0 &&
      height > 0
    ) {
      wallArea +=
        2 * (length + width) * height;
    }
  });

  const doorCount = toNumber(
    measurements.doorCount
  );

  const doorWidth = toNumber(
    measurements.doorWidth
  );

  const doorHeight = toNumber(
    measurements.doorHeight
  );

  const windowCount = toNumber(
    measurements.windowCount
  );

  const windowWidth = toNumber(
    measurements.windowWidth
  );

  const windowHeight = toNumber(
    measurements.windowHeight
  );

  const doorArea =
    doorCount *
    doorWidth *
    doorHeight;

  const windowArea =
    windowCount *
    windowWidth *
    windowHeight;

  const countertopLength =
    toNumber(
      measurements.countertopLength
    );

  const countertopDepth =
    toNumber(
      measurements.countertopDepth
    );

  const countertopArea =
    countertopLength *
    countertopDepth;

  const backsplashLength =
    toNumber(
      measurements.backsplashLength
    );

  const backsplashHeight =
    toNumber(
      measurements.backsplashHeight
    );

  const backsplashArea =
    backsplashLength *
    backsplashHeight;

  const netWallArea = Math.max(
    0,
    wallArea -
      doorArea -
      windowArea
  );

  return {
    floorArea,
    ceilingArea: floorArea,
    wallArea,
    netWallArea,
    perimeter,
    doorArea,
    windowArea,
    countertopArea,
    backsplashArea,
  };
}

export function getMeasurementValue(
  source,
  home,
  measurements = {}
) {
  switch (source) {
    case "FLOOR_AREA":
      return home.floorArea;

    case "CEILING_AREA":
      return home.ceilingArea;

    case "WALL_AREA":
      return home.wallArea;

    case "NET_WALL_AREA":
      return home.netWallArea;

    case "PERIMETER":
      return home.perimeter;

    case "DOOR_AREA":
      return home.doorArea;

    case "WINDOW_AREA":
      return home.windowArea;

    case "COUNTERTOP_AREA":
      return home.countertopArea;

    case "BACKSPLASH_AREA":
      return home.backsplashArea;

    case "RUNNING_FEET":
      return toNumber(
        measurements.runningFeet
      );

    case "QUANTITY":
      return toNumber(
        measurements.quantity
      );

    case "LENGTH":
      return toNumber(
        measurements.lengthInput
      );

    case "WIDTH":
      return toNumber(
        measurements.widthInput
      );

    case "HEIGHT":
      return toNumber(
        measurements.heightInput
      );

    case "VOLUME":
      return toNumber(
        measurements.volume
      );

    default:
      return 0;
  }
}

export function getRequiredMeasurements(
  products = []
) {
  return [
    ...new Set(
      products
        .map(
          (product) =>
            product.measurementSource
        )
        .filter(Boolean)
    ),
  ];
}

export function sourceNeedsRooms(
  source
) {
  return [
    "FLOOR_AREA",
    "CEILING_AREA",
    "WALL_AREA",
    "NET_WALL_AREA",
    "PERIMETER",
  ].includes(source);
}

export function sourceNeedsDoors(
  source
) {
  return (
    source === "DOOR_AREA" ||
    source === "NET_WALL_AREA"
  );
}

export function sourceNeedsWindows(
  source
) {
  return (
    source === "WINDOW_AREA" ||
    source === "NET_WALL_AREA"
  );
}

export function sourceNeedsCountertop(
  source
) {
  return source === "COUNTERTOP_AREA";
}

export function sourceNeedsBacksplash(
  source
) {
  return source === "BACKSPLASH_AREA";
}

function calculateBaseQuantity(
  product,
  baseMeasurement
) {
  const formula =
    product.formula || "DIRECT";

  switch (formula) {
    case "PAINT": {
      const coverage = positive(
        product.coverage
      );

      if (coverage <= 0) {
        return {
          quantity: 0,
          explanation:
            "Paint coverage is not configured.",
          valid: false,
        };
      }

      const coats = positive(
        product.coats,
        1
      );

      const quantity =
        (baseMeasurement /
          coverage) *
        coats;

      return {
        quantity,
        explanation:
          `${baseMeasurement.toFixed(
            2
          )} ÷ ${coverage} × ${coats}`,
        valid: true,
      };
    }

    case "FACTOR": {
      const factor = positive(
        product.factor
      );

      if (factor <= 0) {
        return {
          quantity: 0,
          explanation:
            "Calculation factor is not configured.",
          valid: false,
        };
      }

      const quantity =
        baseMeasurement * factor;

      return {
        quantity,
        explanation:
          `${baseMeasurement.toFixed(
            2
          )} × ${factor}`,
        valid: true,
      };
    }

    case "VOLUME_FACTOR": {
      const factor = positive(
        product.factor
      );

      if (factor <= 0) {
        return {
          quantity: 0,
          explanation:
            "Volume factor is not configured.",
          valid: false,
        };
      }

      const quantity =
        baseMeasurement * factor;

      return {
        quantity,
        explanation:
          `${baseMeasurement.toFixed(
            2
          )} × ${factor}`,
        valid: true,
      };
    }

    case "CUSTOM": {
      const factor = positive(
        product.factor
      );

      if (factor <= 0) {
        return {
          quantity: 0,
          explanation:
            "Custom factor is not configured.",
          valid: false,
        };
      }

      const quantity =
        baseMeasurement * factor;

      return {
        quantity,
        explanation:
          `${baseMeasurement.toFixed(
            2
          )} × ${factor}`,
        valid: true,
      };
    }

    case "AREA_WASTAGE":
    case "DIRECT":
    default:
      return {
        quantity: baseMeasurement,
        explanation:
          `${baseMeasurement.toFixed(
            2
          )} ${product.measurementSource}`,
        valid: true,
      };
  }
}

export function calculateProduct(
  product,
  home,
  measurements = {}
) {
  const baseMeasurement =
    getMeasurementValue(
      product.measurementSource,
      home,
      measurements
    );

  if (baseMeasurement <= 0) {
    return null;
  }

  const calculation =
    calculateBaseQuantity(
      product,
      baseMeasurement
    );

  if (!calculation.valid) {
    return null;
  }

  const quantity =
    calculation.quantity;

  const wastage = Math.max(
    0,
    toNumber(product.wastage)
  );

  const wastageQuantity =
    quantity *
    (wastage / 100);

  const finalQuantity =
    quantity +
    wastageQuantity;

  const rate = Math.max(
    0,
    toNumber(product.rate)
  );

  const materialCost =
    finalQuantity * rate;

  return {
    id: product.id,

    product:
      product.product ||
      "Material",

    category:
      product.category ||
      "General",

    quality:
      product.quality ||
      "Standard",

    formula:
      product.formula ||
      "DIRECT",

    formulaLabel:
      product.formulaLabel ||
      getFormulaLabel(
        product.formula
      ),

    measurementSource:
      product.measurementSource,

    measurementLabel:
      getSourceLabel(
        product.measurementSource
      ),

    baseMeasurement,

    baseQuantity: quantity,

    quantity,

    wastage,

    wastageQuantity,

    finalQuantity,

    rate,

    unit:
      product.unit ||
      "unit",

    materialCost,

    cost: materialCost,

    explanation:
      calculation.explanation,
  };
}

export function calculateEstimate(
  products = [],
  selectedProducts = [],
  rooms = [],
  measurements = {}
) {
  const selectedObjects =
    products.filter(
      (product) =>
        selectedProducts.includes(
          product.id
        )
    );

  const home =
    getHomeMeasurements(
      rooms,
      measurements
    );

  const results =
    selectedObjects
      .map((product) =>
        calculateProduct(
          product,
          home,
          measurements
        )
      )
      .filter(Boolean);

  const categoryTotals = {};

  results.forEach((item) => {
    if (
      !categoryTotals[
        item.category
      ]
    ) {
      categoryTotals[
        item.category
      ] = 0;
    }

    categoryTotals[
      item.category
    ] += item.materialCost;
  });

  const total =
    results.reduce(
      (sum, item) =>
        sum + item.materialCost,
      0
    );

  return {
    home,
    results,
    categoryTotals,
    total,
  };
}

export function getSourceLabel(
  source
) {
  const found =
    MEASUREMENT_SOURCES.find(
      (item) =>
        item.value === source
    );

  return (
    found?.label ||
    source ||
    "Measurement"
  );
}

export function getFormulaLabel(
  formula
) {
  const found =
    FORMULA_DEFINITIONS.find(
      (item) =>
        item.value === formula
    );

  return (
    found?.label ||
    formula ||
    "Formula"
  );
}