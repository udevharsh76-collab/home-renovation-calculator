// ============================================================
// RenovateCalc - Formula Engine
// ============================================================
//
// Material calculation pipeline:
//
// Measurement
//      ↓
// Formula
//      ↓
// Base Quantity
//      ↓
// Wastage
//      ↓
// Final Quantity
//      ↓
// Rate
//      ↓
// Material Cost
//
// This file contains the calculation rules.
// ============================================================

import {
  convertLength,
  convertArea,
  convertVolume,
  convertWeight,
} from "./unitConversion";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const positive = (
  value,
  fallback = 0
) => {
  const number =
    toNumber(value);

  return number > 0
    ? number
    : fallback;
};

const round = (
  value,
  decimals = 4
) => {
  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      value * multiplier
    ) / multiplier
  );
};

// ------------------------------------------------------------
// Formula definitions
// ------------------------------------------------------------

export const FORMULAS = {
  DIRECT: {
    label: "Direct Quantity",
    description:
      "Uses the selected measurement directly.",
  },

  AREA_WASTAGE: {
    label: "Area + Wastage",
    description:
      "Uses the selected area measurement.",
  },

  PAINT: {
    label: "Paint Coverage",
    description:
      "Area ÷ coverage × coats.",
  },

  FACTOR: {
    label: "Measurement × Factor",
    description:
      "Multiplies the measurement by a configurable factor.",
  },

  VOLUME_FACTOR: {
    label: "Volume × Factor",
    description:
      "Multiplies volume by a configurable factor.",
  },

  CUSTOM: {
    label: "Custom Factor",
    description:
      "Measurement × custom factor.",
  },

  TILE: {
    label: "Tile Area",
    description:
      "Area ÷ tile coverage × wastage.",
  },

  BRICK: {
    label: "Brick / Block Count",
    description:
      "Wall area ÷ face area × wastage.",
  },

  CEMENT_BAGS: {
    label: "Cement Bags",
    description:
      "Volume × cement factor ÷ bag weight.",
  },

  STEEL_WEIGHT: {
    label: "Steel Weight",
    description:
      "Steel length × unit weight.",
  },
};

// ------------------------------------------------------------
// Measurement resolver
// ------------------------------------------------------------

export function resolveMeasurement(
  source,
  home = {},
  measurements = {}
) {
  switch (source) {
    case "FLOOR_AREA":
      return home.floorArea || 0;

    case "CEILING_AREA":
      return home.ceilingArea || 0;

    case "WALL_AREA":
      return home.wallArea || 0;

    case "NET_WALL_AREA":
      return home.netWallArea || 0;

    case "PERIMETER":
      return home.perimeter || 0;

    case "DOOR_AREA":
      return home.doorArea || 0;

    case "WINDOW_AREA":
      return home.windowArea || 0;

    case "COUNTERTOP_AREA":
      return (
        home.countertopArea || 0
      );

    case "BACKSPLASH_AREA":
      return (
        home.backsplashArea || 0
      );

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

// ------------------------------------------------------------
// DIRECT
// ------------------------------------------------------------

export function calculateDirect({
  measurement,
}) {
  const quantity =
    positive(measurement);

  return {
    quantity,
    explanation:
      `${quantity.toFixed(
        2
      )} × direct quantity`,
  };
}

// ------------------------------------------------------------
// AREA
// ------------------------------------------------------------

export function calculateArea({
  measurement,
}) {
  const quantity =
    positive(measurement);

  return {
    quantity,
    explanation:
      `${quantity.toFixed(
        2
      )} sq ft`,
  };
}

// ------------------------------------------------------------
// PAINT
// ------------------------------------------------------------

export function calculatePaint({
  area,
  coverage,
  coats = 1,
}) {
  const usableCoverage =
    positive(coverage);

  const usableCoats =
    positive(coats, 1);

  if (
    area <= 0 ||
    usableCoverage <= 0
  ) {
    return null;
  }

  const quantity =
    (area /
      usableCoverage) *
    usableCoats;

  return {
    quantity,

    explanation:
      `${area.toFixed(
        2
      )} sq ft ÷ ${usableCoverage} sq ft/unit × ${usableCoats} coats`,
  };
}

// ------------------------------------------------------------
// FACTOR
// ------------------------------------------------------------

export function calculateFactor({
  measurement,
  factor,
}) {
  const usableFactor =
    positive(factor, 1);

  if (measurement <= 0) {
    return null;
  }

  const quantity =
    measurement *
    usableFactor;

  return {
    quantity,

    explanation:
      `${measurement.toFixed(
        2
      )} × ${usableFactor}`,
  };
}

// ------------------------------------------------------------
// VOLUME FACTOR
// ------------------------------------------------------------

export function calculateVolumeFactor({
  volume,
  factor,
}) {
  const usableFactor =
    positive(factor, 1);

  if (volume <= 0) {
    return null;
  }

  const quantity =
    volume *
    usableFactor;

  return {
    quantity,

    explanation:
      `${volume.toFixed(
        2
      )} cu ft × ${usableFactor}`,
  };
}

// ------------------------------------------------------------
// TILE
// ------------------------------------------------------------

export function calculateTile({
  area,
  tileLength,
  tileWidth,
  tileLengthUnit = "ft",
  tileWidthUnit = "ft",
}) {
  if (
    area <= 0 ||
    tileLength <= 0 ||
    tileWidth <= 0
  ) {
    return null;
  }

  const lengthFt =
    convertLength(
      tileLength,
      tileLengthUnit,
      "ft"
    );

  const widthFt =
    convertLength(
      tileWidth,
      tileWidthUnit,
      "ft"
    );

  const tileArea =
    lengthFt * widthFt;

  if (tileArea <= 0) {
    return null;
  }

  const quantity =
    area / tileArea;

  return {
    quantity,

    explanation:
      `${area.toFixed(
        2
      )} sq ft ÷ ${tileArea.toFixed(
        4
      )} sq ft/tile`,
  };
}

// ------------------------------------------------------------
// BRICK / BLOCK
// ------------------------------------------------------------

export function calculateBrick({
  wallArea,
  brickLength,
  brickHeight,
  lengthUnit = "inch",
  heightUnit = "inch",
}) {
  if (
    wallArea <= 0 ||
    brickLength <= 0 ||
    brickHeight <= 0
  ) {
    return null;
  }

  const lengthFt =
    convertLength(
      brickLength,
      lengthUnit,
      "ft"
    );

  const heightFt =
    convertLength(
      brickHeight,
      heightUnit,
      "ft"
    );

  const faceArea =
    lengthFt * heightFt;

  if (faceArea <= 0) {
    return null;
  }

  const quantity =
    wallArea / faceArea;

  return {
    quantity,

    explanation:
      `${wallArea.toFixed(
        2
      )} sq ft ÷ ${faceArea.toFixed(
        4
      )} sq ft/brick`,
  };
}

// ------------------------------------------------------------
// CEMENT BAGS
// ------------------------------------------------------------

export function calculateCementBags({
  volume,
  cementFactor,
  bagWeightKg = 50,
}) {
  const factor =
    positive(
      cementFactor
    );

  const bagWeight =
    positive(
      bagWeightKg,
      50
    );

  if (
    volume <= 0 ||
    factor <= 0
  ) {
    return null;
  }

  // Cement factor represents kg of cement
  // required per cubic foot of work.
  const cementKg =
    volume * factor;

  const bags =
    cementKg / bagWeight;

  return {
    quantity: bags,

    explanation:
      `${volume.toFixed(
        2
      )} cu ft × ${factor} kg/cu ft ÷ ${bagWeight} kg/bag`,
  };
}

// ------------------------------------------------------------
// STEEL WEIGHT
// ------------------------------------------------------------

export function calculateSteelWeight({
  length,
  lengthUnit = "ft",
  diameterMm,
  quantity = 1,
}) {
  const usableLength =
    positive(length);

  const diameter =
    positive(diameterMm);

  const bars =
    positive(quantity, 1);

  if (
    usableLength <= 0 ||
    diameter <= 0
  ) {
    return null;
  }

  const lengthM =
    convertLength(
      usableLength,
      lengthUnit,
      "m"
    );

  // Standard steel unit weight:
  //
  // Weight kg/m =
  // diameter² / 162
  //
  const unitWeight =
    (diameter *
      diameter) /
    162;

  const totalWeight =
    lengthM *
    unitWeight *
    bars;

  return {
    quantity: totalWeight,

    explanation:
      `${bars} bar(s) × ${lengthM.toFixed(
        2
      )} m × (${diameter}² ÷ 162) kg/m`,
  };
}

// ------------------------------------------------------------
// WASTAGE
// ------------------------------------------------------------

export function applyWastage(
  quantity,
  wastage = 0
) {
  const usableQuantity =
    Math.max(
      0,
      toNumber(quantity)
    );

  const wastagePercent =
    Math.max(
      0,
      toNumber(wastage)
    );

  const wastageQuantity =
    usableQuantity *
    (wastagePercent / 100);

  const finalQuantity =
    usableQuantity +
    wastageQuantity;

  return {
    quantity:
      usableQuantity,

    wastage:
      wastagePercent,

    wastageQuantity,

    finalQuantity,
  };
}

// ------------------------------------------------------------
// COST
// ------------------------------------------------------------

export function calculateCost(
  quantity,
  rate
) {
  const usableQuantity =
    Math.max(
      0,
      toNumber(quantity)
    );

  const usableRate =
    Math.max(
      0,
      toNumber(rate)
    );

  return (
    usableQuantity *
    usableRate
  );
}

// ------------------------------------------------------------
// MAIN MATERIAL FORMULA
// ------------------------------------------------------------

export function calculateFormula(
  product,
  measurement,
  home = {},
  measurements = {}
) {
  const formula =
    product.formula ||
    "DIRECT";

  let calculation = null;

  switch (formula) {
    case "DIRECT":
      calculation =
        calculateDirect({
          measurement,
        });
      break;

    case "AREA_WASTAGE":
      calculation =
        calculateArea({
          measurement,
        });
      break;

    case "PAINT":
      calculation =
        calculatePaint({
          area: measurement,
          coverage:
            product.coverage,
          coats:
            product.coats,
        });
      break;

    case "FACTOR":
    case "CUSTOM":
      calculation =
        calculateFactor({
          measurement,
          factor:
            product.factor,
        });
      break;

    case "VOLUME_FACTOR":
      calculation =
        calculateVolumeFactor({
          volume: measurement,
          factor:
            product.factor,
        });
      break;

    case "TILE":
      calculation =
        calculateTile({
          area: measurement,

          tileLength:
            product.tileLength,

          tileWidth:
            product.tileWidth,

          tileLengthUnit:
            product.tileLengthUnit ||
            "ft",

          tileWidthUnit:
            product.tileWidthUnit ||
            "ft",
        });
      break;

    case "BRICK":
      calculation =
        calculateBrick({
          wallArea:
            measurement,

          brickLength:
            product.brickLength,

          brickHeight:
            product.brickHeight,

          lengthUnit:
            product.brickLengthUnit ||
            "inch",

          heightUnit:
            product.brickHeightUnit ||
            "inch",
        });
      break;

    case "CEMENT_BAGS":
      calculation =
        calculateCementBags({
          volume:
            measurement,

          cementFactor:
            product.cementFactor,

          bagWeightKg:
            product.bagWeightKg ||
            50,
        });
      break;

    case "STEEL_WEIGHT":
      calculation =
        calculateSteelWeight({
          length:
            measurement,

          lengthUnit:
            product.lengthUnit ||
            "ft",

          diameterMm:
            product.diameterMm,

          quantity:
            product.barQuantity ||
            1,
        });
      break;

    default:
      calculation =
        calculateDirect({
          measurement,
        });
      break;
  }

  if (!calculation) {
    return null;
  }

  const wastageResult =
    applyWastage(
      calculation.quantity,
      product.wastage
    );

  const cost =
    calculateCost(
      wastageResult.finalQuantity,
      product.rate
    );

  return {
    formula,

    baseQuantity:
      round(
        calculation.quantity
      ),

    quantity:
      round(
        calculation.quantity
      ),

    wastage:
      wastageResult.wastage,

    wastageQuantity:
      round(
        wastageResult.wastageQuantity
      ),

    finalQuantity:
      round(
        wastageResult.finalQuantity
      ),

    rate:
      Math.max(
        0,
        toNumber(
          product.rate
        )
      ),

    cost:
      round(cost),

    materialCost:
      round(cost),

    explanation:
      calculation.explanation,
  };
}

// ------------------------------------------------------------
// Complete product calculation
// ------------------------------------------------------------

export function calculateMaterial(
  product,
  home = {},
  measurements = {}
) {
  if (!product) {
    return null;
  }

  const measurement =
    resolveMeasurement(
      product.measurementSource,
      home,
      measurements
    );

  if (measurement <= 0) {
    return null;
  }

  const result =
    calculateFormula(
      product,
      measurement,
      home,
      measurements
    );

  if (!result) {
    return null;
  }

  return {
    ...product,
    ...result,

    measurementSource:
      product.measurementSource,

    formulaLabel:
      product.formulaLabel ||
      FORMULAS[
        product.formula ||
          "DIRECT"
      ]?.label ||
      product.formula ||
      "Direct Quantity",

    unit:
      product.unit ||
      "unit",
  };
}

// ------------------------------------------------------------
// Calculate all selected materials
// ------------------------------------------------------------

export function calculateMaterials({
  products = [],
  selectedProducts = [],
  home = {},
  measurements = {},
}) {
  const selected =
    products.filter(
      (product) =>
        selectedProducts.includes(
          product.id
        )
    );

  const results =
    selected
      .map((product) =>
        calculateMaterial(
          product,
          home,
          measurements
        )
      )
      .filter(Boolean);

  const categoryTotals =
    {};

  results.forEach(
    (item) => {
      const category =
        item.category ||
        "Other";

      if (
        !categoryTotals[
          category
        ]
      ) {
        categoryTotals[
          category
        ] = 0;
      }

      categoryTotals[
        category
      ] += item.cost;
    }
  );

  const total =
    results.reduce(
      (sum, item) =>
        sum + item.cost,
      0
    );

  return {
    results,

    categoryTotals,

    total,

    materialSubtotal:
      total,
  };
}