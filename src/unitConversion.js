// ============================================================
// RenovateCalc - Unit Conversion Engine
// ============================================================
//
// Base units used internally:
// Length  -> feet (ft)
// Area    -> square feet (sq ft)
// Volume  -> cubic feet (cu ft)
// Weight  -> kg
// Liquid  -> litre
//
// The user can enter measurements in different units,
// while the calculation engine works with consistent units.
// ============================================================

const LENGTH_TO_FEET = {
  mm: 0.003280839895013123,
  cm: 0.03280839895013123,
  m: 3.280839895013123,
  inch: 1 / 12,
  in: 1 / 12,
  ft: 1,
  metre: 3.280839895013123,
  meter: 3.280839895013123,
  feet: 1,
};

const AREA_TO_SQFT = {
  "sq mm": 0.000010763910416709722,
  "sq cm": 0.0010763910416709722,
  "sq m": 10.763910416709722,
  "sq ft": 1,
  "sq inch": 1 / 144,
  "sq in": 1 / 144,
};

const VOLUME_TO_CUFT = {
  "cu mm": 0.00000000003531466672148859,
  "cu cm": 0.00003531466672148859,
  "cu m": 35.31466672148859,
  "cu ft": 1,
  litre: 0.03531466672148859,
  liter: 0.03531466672148859,
};

const WEIGHT_TO_KG = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  tonne: 1000,
  ton: 1000,
};

const LENGTH_UNITS = [
  {
    value: "mm",
    label: "Millimetre (mm)",
    type: "length",
  },
  {
    value: "cm",
    label: "Centimetre (cm)",
    type: "length",
  },
  {
    value: "m",
    label: "Metre (m)",
    type: "length",
  },
  {
    value: "inch",
    label: "Inch (in)",
    type: "length",
  },
  {
    value: "ft",
    label: "Feet (ft)",
    type: "length",
  },
];

const AREA_UNITS = [
  {
    value: "sq ft",
    label: "Square Feet (sq ft)",
    type: "area",
  },
  {
    value: "sq m",
    label: "Square Metres (sq m)",
    type: "area",
  },
  {
    value: "sq inch",
    label: "Square Inches",
    type: "area",
  },
  {
    value: "sq cm",
    label: "Square Centimetres",
    type: "area",
  },
  {
    value: "sq mm",
    label: "Square Millimetres",
    type: "area",
  },
];

const VOLUME_UNITS = [
  {
    value: "cu ft",
    label: "Cubic Feet (cu ft)",
    type: "volume",
  },
  {
    value: "cu m",
    label: "Cubic Metres (cu m)",
    type: "volume",
  },
  {
    value: "litre",
    label: "Litre",
    type: "volume",
  },
];

const WEIGHT_UNITS = [
  {
    value: "kg",
    label: "Kilogram (kg)",
    type: "weight",
  },
  {
    value: "tonne",
    label: "Tonne",
    type: "weight",
  },
  {
    value: "g",
    label: "Gram (g)",
    type: "weight",
  },
];

const OTHER_UNITS = [
  {
    value: "bag",
    label: "Bag",
    type: "quantity",
  },
  {
    value: "piece",
    label: "Piece",
    type: "quantity",
  },
  {
    value: "point",
    label: "Point",
    type: "quantity",
  },
  {
    value: "running ft",
    label: "Running Feet",
    type: "running-length",
  },
  {
    value: "running m",
    label: "Running Metre",
    type: "running-length",
  },
];

export const UNIT_DEFINITIONS = [
  ...LENGTH_UNITS,
  ...AREA_UNITS,
  ...VOLUME_UNITS,
  ...WEIGHT_UNITS,
  ...OTHER_UNITS,
];

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

export function normalizeUnit(unit) {
  if (!unit) {
    return "";
  }

  return String(unit)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

// ------------------------------------------------------------
// Length
// ------------------------------------------------------------

export function convertLength(
  value,
  fromUnit,
  toUnit = "ft"
) {
  const number = toNumber(value);

  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (!LENGTH_TO_FEET[from]) {
    throw new Error(
      `Unsupported length unit: ${fromUnit}`
    );
  }

  if (!LENGTH_TO_FEET[to]) {
    throw new Error(
      `Unsupported length unit: ${toUnit}`
    );
  }

  const feet =
    number * LENGTH_TO_FEET[from];

  return (
    feet / LENGTH_TO_FEET[to]
  );
}

// ------------------------------------------------------------
// Area
// ------------------------------------------------------------

export function convertArea(
  value,
  fromUnit,
  toUnit = "sq ft"
) {
  const number = toNumber(value);

  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (
    !Object.prototype.hasOwnProperty.call(
      AREA_TO_SQFT,
      from
    )
  ) {
    throw new Error(
      `Unsupported area unit: ${fromUnit}`
    );
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      AREA_TO_SQFT,
      to
    )
  ) {
    throw new Error(
      `Unsupported area unit: ${toUnit}`
    );
  }

  const sqft =
    number * AREA_TO_SQFT[from];

  return (
    sqft / AREA_TO_SQFT[to]
  );
}

// ------------------------------------------------------------
// Volume
// ------------------------------------------------------------

export function convertVolume(
  value,
  fromUnit,
  toUnit = "cu ft"
) {
  const number = toNumber(value);

  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (
    !Object.prototype.hasOwnProperty.call(
      VOLUME_TO_CUFT,
      from
    )
  ) {
    throw new Error(
      `Unsupported volume unit: ${fromUnit}`
    );
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      VOLUME_TO_CUFT,
      to
    )
  ) {
    throw new Error(
      `Unsupported volume unit: ${toUnit}`
    );
  }

  const cubicFeet =
    number * VOLUME_TO_CUFT[from];

  return (
    cubicFeet / VOLUME_TO_CUFT[to]
  );
}

// ------------------------------------------------------------
// Weight
// ------------------------------------------------------------

export function convertWeight(
  value,
  fromUnit,
  toUnit = "kg"
) {
  const number = toNumber(value);

  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (
    !Object.prototype.hasOwnProperty.call(
      WEIGHT_TO_KG,
      from
    )
  ) {
    throw new Error(
      `Unsupported weight unit: ${fromUnit}`
    );
  }

  if (
    !Object.prototype.hasOwnProperty.call(
      WEIGHT_TO_KG,
      to
    )
  ) {
    throw new Error(
      `Unsupported weight unit: ${toUnit}`
    );
  }

  const kg =
    number * WEIGHT_TO_KG[from];

  return (
    kg / WEIGHT_TO_KG[to]
  );
}

// ------------------------------------------------------------
// Running length
// ------------------------------------------------------------

export function convertRunningLength(
  value,
  fromUnit,
  toUnit = "running ft"
) {
  const number = toNumber(value);

  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (
    !["running ft", "running m"].includes(
      from
    )
  ) {
    throw new Error(
      `Unsupported running length unit: ${fromUnit}`
    );
  }

  if (
    !["running ft", "running m"].includes(
      to
    )
  ) {
    throw new Error(
      `Unsupported running length unit: ${toUnit}`
    );
  }

  if (from === to) {
    return number;
  }

  if (
    from === "running ft" &&
    to === "running m"
  ) {
    return number * 0.3048;
  }

  if (
    from === "running m" &&
    to === "running ft"
  ) {
    return number * 3.280839895013123;
  }

  return number;
}

// ------------------------------------------------------------
// Generic converter
// ------------------------------------------------------------

export function convertUnit(
  value,
  fromUnit,
  toUnit
) {
  const from = normalizeUnit(fromUnit);
  const to = normalizeUnit(toUnit);

  if (!from || !to || from === to) {
    return toNumber(value);
  }

  if (
    Object.prototype.hasOwnProperty.call(
      LENGTH_TO_FEET,
      from
    ) &&
    Object.prototype.hasOwnProperty.call(
      LENGTH_TO_FEET,
      to
    )
  ) {
    return convertLength(
      value,
      from,
      to
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      AREA_TO_SQFT,
      from
    ) &&
    Object.prototype.hasOwnProperty.call(
      AREA_TO_SQFT,
      to
    )
  ) {
    return convertArea(
      value,
      from,
      to
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      VOLUME_TO_CUFT,
      from
    ) &&
    Object.prototype.hasOwnProperty.call(
      VOLUME_TO_CUFT,
      to
    )
  ) {
    return convertVolume(
      value,
      from,
      to
    );
  }

  if (
    Object.prototype.hasOwnProperty.call(
      WEIGHT_TO_KG,
      from
    ) &&
    Object.prototype.hasOwnProperty.call(
      WEIGHT_TO_KG,
      to
    )
  ) {
    return convertWeight(
      value,
      from,
      to
    );
  }

  if (
    ["running ft", "running m"].includes(
      from
    ) &&
    ["running ft", "running m"].includes(
      to
    )
  ) {
    return convertRunningLength(
      value,
      from,
      to
    );
  }

  // Pieces, bags, points, etc.
  // cannot be mathematically converted.
  if (
    from === to
  ) {
    return toNumber(value);
  }

  throw new Error(
    `Cannot convert ${fromUnit} to ${toUnit}`
  );
}

// ------------------------------------------------------------
// Unit helpers
// ------------------------------------------------------------

export function getUnitDefinition(unit) {
  const normalized =
    normalizeUnit(unit);

  return UNIT_DEFINITIONS.find(
    (item) =>
      normalizeUnit(item.value) ===
      normalized
  );
}

export function getUnitsByType(type) {
  return UNIT_DEFINITIONS.filter(
    (item) =>
      item.type === type
  );
}

export function isAreaUnit(unit) {
  return Object.prototype.hasOwnProperty.call(
    AREA_TO_SQFT,
    normalizeUnit(unit)
  );
}

export function isLengthUnit(unit) {
  return Object.prototype.hasOwnProperty.call(
    LENGTH_TO_FEET,
    normalizeUnit(unit)
  );
}

export function isVolumeUnit(unit) {
  return Object.prototype.hasOwnProperty.call(
    VOLUME_TO_CUFT,
    normalizeUnit(unit)
  );
}

export function isWeightUnit(unit) {
  return Object.prototype.hasOwnProperty.call(
    WEIGHT_TO_KG,
    normalizeUnit(unit)
  );
}