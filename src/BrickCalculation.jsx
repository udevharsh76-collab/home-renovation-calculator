import { useMemo, useState } from "react";

function lengthToMm(value, unit) {
  const number = Number(value) || 0;

  switch (unit) {
    case "ft":
      return number * 304.8;
    case "m":
      return number * 1000;
    case "cm":
      return number * 10;
    case "inch":
      return number * 25.4;
    case "mm":
    default:
      return number;
  }
}

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function lengthUnits() {
  return [
    ["ft", "Feet"],
    ["m", "Meter"],
    ["cm", "Centimeter"],
    ["mm", "Millimeter"],
    ["inch", "Inch"],
  ];
}

function InputWithUnit({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  units,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      />

      <label className="mt-2 block text-xs font-semibold text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      >
        {units.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "text-gray-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "font-semibold text-gray-800"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function BrickCalculation() {
  const [wallLength, setWallLength] = useState("");
  const [wallLengthUnit, setWallLengthUnit] = useState("ft");

  const [wallHeight, setWallHeight] = useState("");
  const [wallHeightUnit, setWallHeightUnit] = useState("ft");

  const [wallThickness, setWallThickness] = useState("");
  const [wallThicknessUnit, setWallThicknessUnit] = useState("inch");

  const [brickLength, setBrickLength] = useState("");
  const [brickLengthUnit, setBrickLengthUnit] = useState("mm");

  const [brickWidth, setBrickWidth] = useState("");
  const [brickWidthUnit, setBrickWidthUnit] = useState("mm");

  const [brickHeight, setBrickHeight] = useState("");
  const [brickHeightUnit, setBrickHeightUnit] = useState("mm");

  const [brickRate, setBrickRate] = useState("");
  const [brickWastage, setBrickWastage] = useState("");

  const calculation = useMemo(() => {
    // -------------------------
    // WALL DIMENSIONS
    // -------------------------

    const wallLengthMm = lengthToMm(
      wallLength,
      wallLengthUnit
    );

    const wallHeightMm = lengthToMm(
      wallHeight,
      wallHeightUnit
    );

    const wallThicknessMm = lengthToMm(
      wallThickness,
      wallThicknessUnit
    );

    // -------------------------
    // BRICK DIMENSIONS
    // -------------------------

    const brickLengthMm = lengthToMm(
      brickLength,
      brickLengthUnit
    );

    const brickWidthMm = lengthToMm(
      brickWidth,
      brickWidthUnit
    );

    const brickHeightMm = lengthToMm(
      brickHeight,
      brickHeightUnit
    );

    // -------------------------
    // MORTAR ALLOWANCE
    // -------------------------

    const mortarThicknessMm = 10;

    const brickLengthWithMortarMm =
      brickLengthMm + mortarThicknessMm;

    const brickWidthWithMortarMm =
      brickWidthMm + mortarThicknessMm;

    const brickHeightWithMortarMm =
      brickHeightMm + mortarThicknessMm;

    // -------------------------
    // WALL VOLUME
    // -------------------------

    const wallVolumeMm3 =
      wallLengthMm *
      wallHeightMm *
      wallThicknessMm;

    const wallVolume =
      wallVolumeMm3 / 28316846.592;

    // -------------------------
    // BRICK VOLUME
    // -------------------------

    const brickVolumeMm3 =
      brickLengthWithMortarMm *
      brickWidthWithMortarMm *
      brickHeightWithMortarMm;

    const brickVolume =
      brickVolumeMm3 / 28316846.592;

    // -------------------------
    // BRICKS REQUIRED
    // -------------------------

    const baseBrickQuantity =
      brickVolumeMm3 > 0
        ? wallVolumeMm3 / brickVolumeMm3
        : 0;

    // -------------------------
    // WASTAGE
    // -------------------------

    const brickWastageQuantity =
      baseBrickQuantity *
      ((Number(brickWastage) || 0) / 100);

    const finalBrickQuantity =
      baseBrickQuantity +
      brickWastageQuantity;

    const finalBricksRequired =
      Math.ceil(finalBrickQuantity);

    // -------------------------
    // COST
    // -------------------------

    const brickCost =
      finalBricksRequired *
      (Number(brickRate) || 0);

    return {
      wallLengthMm,
      wallHeightMm,
      wallThicknessMm,

      brickLengthMm,
      brickWidthMm,
      brickHeightMm,

      mortarThicknessMm,

      brickLengthWithMortarMm,
      brickWidthWithMortarMm,
      brickHeightWithMortarMm,

      wallVolume,
      brickVolume,
      brickVolumeMm3,

      baseBrickQuantity,
      brickWastageQuantity,
      finalBrickQuantity,
      finalBricksRequired,

      brickCost,
    };
  }, [
    wallLength,
    wallLengthUnit,
    wallHeight,
    wallHeightUnit,
    wallThickness,
    wallThicknessUnit,

    brickLength,
    brickLengthUnit,
    brickWidth,
    brickWidthUnit,
    brickHeight,
    brickHeightUnit,

    brickRate,
    brickWastage,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* =========================
          HEADER
      ========================= */}

      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">

          <h1 className="text-3xl font-bold text-blue-800">
            Renovate
            <span className="text-gray-800">
              Calc
            </span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Renovation Material Calculator
          </p>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Renovation Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Brick Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Enter your wall dimensions, brick dimensions,
            brick rate and wastage. RenovateCalc will
            calculate the required bricks and material cost.
          </p>
        </div>

        {/* =========================
            BRICK INPUTS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Wall & Brick Measurements
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter all measurements using the unit you prefer.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <InputWithUnit
              label="Wall Length"
              value={wallLength}
              onChange={setWallLength}
              unit={wallLengthUnit}
              onUnitChange={setWallLengthUnit}
              placeholder="Example: 20"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Wall Height"
              value={wallHeight}
              onChange={setWallHeight}
              unit={wallHeightUnit}
              onUnitChange={setWallHeightUnit}
              placeholder="Example: 10"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Wall Thickness"
              value={wallThickness}
              onChange={setWallThickness}
              unit={wallThicknessUnit}
              onUnitChange={setWallThicknessUnit}
              placeholder="Example: 9"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Brick Length"
              value={brickLength}
              onChange={setBrickLength}
              unit={brickLengthUnit}
              onUnitChange={setBrickLengthUnit}
              placeholder="Example: 190"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Brick Width"
              value={brickWidth}
              onChange={setBrickWidth}
              unit={brickWidthUnit}
              onUnitChange={setBrickWidthUnit}
              placeholder="Example: 90"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Brick Height"
              value={brickHeight}
              onChange={setBrickHeight}
              unit={brickHeightUnit}
              onUnitChange={setBrickHeightUnit}
              placeholder="Example: 90"
              units={lengthUnits()}
            />

            <Input
              label="Brick Rate (₹ per brick)"
              value={brickRate}
              onChange={setBrickRate}
              placeholder="Example: 10"
            />

            <Input
              label="Brick Wastage (%)"
              value={brickWastage}
              onChange={setBrickWastage}
              placeholder="Example: 5"
            />

          </div>

          {/* =========================
              MORTAR
          ========================= */}

          <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">

            <strong>Mortar Allowance:</strong>{" "}
            10 mm is automatically added to the length,
            width and height of each brick.

          </div>

        </section>

        {/* =========================
            RESULTS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Brick Calculation
          </h3>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <div className="space-y-4 text-sm">

              <ResultRow
                label="Wall Volume"
                value={`${calculation.wallVolume.toFixed(
                  3
                )} cu ft`}
              />

              <ResultRow
                label="Actual Brick Size"
                value={`${calculation.brickLengthMm.toFixed(
                  0
                )} × ${calculation.brickWidthMm.toFixed(
                  0
                )} × ${calculation.brickHeightMm.toFixed(
                  0
                )} mm`}
              />

              <ResultRow
                label="Mortar Allowance"
                value="10 mm per dimension"
              />

              <ResultRow
                label="Brick Length + Mortar"
                value={`${calculation.brickLengthWithMortarMm.toFixed(
                  0
                )} mm`}
              />

              <ResultRow
                label="Brick Width + Mortar"
                value={`${calculation.brickWidthWithMortarMm.toFixed(
                  0
                )} mm`}
              />

              <ResultRow
                label="Brick Height + Mortar"
                value={`${calculation.brickHeightWithMortarMm.toFixed(
                  0
                )} mm`}
              />

              <ResultRow
                label="Brick Volume Including Mortar"
                value={`${calculation.brickVolume.toFixed(
                  5
                )} cu ft`}
              />

              <ResultRow
                label="Bricks Before Wastage"
                value={`${calculation.baseBrickQuantity.toFixed(
                  2
                )} bricks`}
              />

              <ResultRow
                label={`Brick Wastage (${
                  brickWastage || 0
                }%)`}
                value={`+ ${calculation.brickWastageQuantity.toFixed(
                  2
                )} bricks`}
              />

              <div className="border-t pt-4">

                <ResultRow
                  label="Final Bricks Required"
                  value={`${calculation.finalBricksRequired} bricks`}
                  bold
                />

              </div>

              <ResultRow
                label="Brick Material Cost"
                value={money(calculation.brickCost)}
                bold
              />

            </div>

          </div>

        </section>

        {/* =========================
            FINAL COST
        ========================= */}

        <section className="mt-8 rounded-2xl bg-blue-800 p-8 text-white shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
            Material Estimate
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            Total Brick Material Cost
          </h3>

          <p className="mt-4 text-5xl font-bold">
            {money(calculation.brickCost)}
          </p>

        </section>

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="mt-16 bg-blue-950 px-6 py-8 text-center text-blue-100">

        <p className="text-xl font-bold">
          Renovate
          <span className="text-white">
            Calc
          </span>
        </p>

        <p className="mt-2 text-sm">
          Smart renovation material estimation.
        </p>

      </footer>

    </div>
  );
}