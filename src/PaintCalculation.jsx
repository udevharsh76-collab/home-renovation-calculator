import { useMemo, useState } from "react";

export default function PaintCalculation() {
  // =========================
  // PAINT WORK TYPE
  // =========================

  const [workType, setWorkType] = useState("interior_wall");

  // =========================
  // WALL INPUTS
  // =========================

  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");

  const [wallLengthUnit, setWallLengthUnit] = useState("ft");
  const [wallHeightUnit, setWallHeightUnit] = useState("ft");

  // Number of walls
  const [wallCount, setWallCount] = useState("1");

  // =========================
  // CEILING INPUTS
  // =========================

  const [ceilingLength, setCeilingLength] = useState("");
  const [ceilingWidth, setCeilingWidth] = useState("");

  const [ceilingLengthUnit, setCeilingLengthUnit] =
    useState("ft");

  const [ceilingWidthUnit, setCeilingWidthUnit] =
    useState("ft");

  // =========================
  // DOORS
  // =========================

  const [doorCount, setDoorCount] = useState("");
  const [doorWidth, setDoorWidth] = useState("");
  const [doorHeight, setDoorHeight] = useState("");

  const [doorWidthUnit, setDoorWidthUnit] =
    useState("ft");

  const [doorHeightUnit, setDoorHeightUnit] =
    useState("ft");

  // =========================
  // WINDOWS
  // =========================

  const [windowCount, setWindowCount] =
    useState("");

  const [windowWidth, setWindowWidth] =
    useState("");

  const [windowHeight, setWindowHeight] =
    useState("");

  const [windowWidthUnit, setWindowWidthUnit] =
    useState("ft");

  const [windowHeightUnit, setWindowHeightUnit] =
    useState("ft");

  // =========================
  // PAINT SETTINGS
  // =========================

  const [coats, setCoats] = useState("2");

  const [coverage, setCoverage] =
    useState("100");

  const [wastage, setWastage] =
    useState("5");

  const [rate, setRate] =
    useState("");

  // =========================
  // CALCULATION
  // =========================

  const calculation = useMemo(() => {
    let grossAreaSqFt = 0;

    // =========================
    // WALL PAINT
    // =========================

    if (
      workType === "interior_wall" ||
      workType === "exterior_wall"
    ) {
      const length =
        lengthToFeet(
          wallLength,
          wallLengthUnit
        );

      const height =
        lengthToFeet(
          wallHeight,
          wallHeightUnit
        );

      const count =
        Number(wallCount) || 0;

      grossAreaSqFt =
        length *
        height *
        count;
    }

    // =========================
    // CEILING PAINT
    // =========================

    if (workType === "ceiling") {
      const length =
        lengthToFeet(
          ceilingLength,
          ceilingLengthUnit
        );

      const width =
        lengthToFeet(
          ceilingWidth,
          ceilingWidthUnit
        );

      grossAreaSqFt =
        length *
        width;
    }

    // =========================
    // DOOR AREA
    // =========================

    const doors =
      Number(doorCount) || 0;

    const doorW =
      lengthToFeet(
        doorWidth,
        doorWidthUnit
      );

    const doorH =
      lengthToFeet(
        doorHeight,
        doorHeightUnit
      );

    const doorAreaSqFt =
      doors *
      doorW *
      doorH;

    // =========================
    // WINDOW AREA
    // =========================

    const windows =
      Number(windowCount) || 0;

    const windowW =
      lengthToFeet(
        windowWidth,
        windowWidthUnit
      );

    const windowH =
      lengthToFeet(
        windowHeight,
        windowHeightUnit
      );

    const windowAreaSqFt =
      windows *
      windowW *
      windowH;

    // =========================
    // NET AREA
    // =========================

    const deductionSqFt =
      doorAreaSqFt +
      windowAreaSqFt;

    const netAreaSqFt =
      Math.max(
        0,
        grossAreaSqFt -
          deductionSqFt
      );

    // =========================
    // COATS
    // =========================

    const numberOfCoats =
      Math.max(
        0,
        Number(coats) || 0
      );

    const totalPaintAreaSqFt =
      netAreaSqFt *
      numberOfCoats;

    // =========================
    // COVERAGE
    // =========================

    const coverageRate =
      Math.max(
        0,
        Number(coverage) || 0
      );

    let paintBeforeWastage = 0;

    if (coverageRate > 0) {
      paintBeforeWastage =
        totalPaintAreaSqFt /
        coverageRate;
    }

    // =========================
    // WASTAGE
    // =========================

    const wastagePercent =
      Math.max(
        0,
        Number(wastage) || 0
      );

    const wastageLitres =
      paintBeforeWastage *
      (wastagePercent / 100);

    const finalPaintLitres =
      paintBeforeWastage +
      wastageLitres;

    // =========================
    // COST
    // =========================

    const paintRate =
      Math.max(
        0,
        Number(rate) || 0
      );

    const materialCost =
      finalPaintLitres *
      paintRate;

    return {
      grossAreaSqFt,
      doorAreaSqFt,
      windowAreaSqFt,
      deductionSqFt,
      netAreaSqFt,
      numberOfCoats,
      totalPaintAreaSqFt,
      coverageRate,
      paintBeforeWastage,
      wastagePercent,
      wastageLitres,
      finalPaintLitres,
      paintRate,
      materialCost,
    };
  }, [
    workType,

    wallLength,
    wallHeight,
    wallLengthUnit,
    wallHeightUnit,
    wallCount,

    ceilingLength,
    ceilingWidth,
    ceilingLengthUnit,
    ceilingWidthUnit,

    doorCount,
    doorWidth,
    doorHeight,
    doorWidthUnit,
    doorHeightUnit,

    windowCount,
    windowWidth,
    windowHeight,
    windowWidthUnit,
    windowHeightUnit,

    coats,
    coverage,
    wastage,
    rate,
  ]);

  // =========================
  // WORK TYPE NAME
  // =========================

  const workTypeName = {
    interior_wall: "Interior Wall Paint",
    exterior_wall: "Exterior Wall Paint",
    ceiling: "Ceiling Paint",
  };

  // =========================
  // MONEY FORMAT
  // =========================

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

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

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* =========================
            TITLE
        ========================= */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Paint Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Paint Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Calculate paint requirements using surface
            area, doors, windows, number of coats,
            coverage, wastage and paint rate.
          </p>

        </div>

        {/* =========================
            WORK TYPE
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Paint Usage
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Select the type of surface you want to paint.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Paint Work Type
            </label>

            <select
              value={workType}
              onChange={(e) =>
                setWorkType(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >

              <option value="interior_wall">
                Interior Wall Paint
              </option>

              <option value="exterior_wall">
                Exterior Wall Paint
              </option>

              <option value="ceiling">
                Ceiling Paint
              </option>

            </select>

          </div>

        </section>

        {/* =========================
            WALL INPUTS
        ========================= */}

        {(workType === "interior_wall" ||
          workType === "exterior_wall") && (

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Wall Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter the wall dimensions to calculate
              the total paintable wall area.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

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

              <Input
                label="Number of Walls"
                value={wallCount}
                onChange={setWallCount}
                placeholder="Example: 4"
              />

            </div>

          </section>
        )}

        {/* =========================
            CEILING INPUTS
        ========================= */}

        {workType === "ceiling" && (

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Ceiling Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter the ceiling length and width.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Ceiling Length"
                value={ceilingLength}
                onChange={setCeilingLength}
                unit={ceilingLengthUnit}
                onUnitChange={setCeilingLengthUnit}
                placeholder="Example: 20"
                units={lengthUnits()}
              />

              <InputWithUnit
                label="Ceiling Width"
                value={ceilingWidth}
                onChange={setCeilingWidth}
                unit={ceilingWidthUnit}
                onUnitChange={setCeilingWidthUnit}
                placeholder="Example: 20"
                units={lengthUnits()}
              />

            </div>

          </section>
        )}

        {/* =========================
            DOORS
        ========================= */}

        {(workType === "interior_wall" ||
          workType === "exterior_wall") && (

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Doors
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Door area will be deducted from the total
              wall area.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of Doors"
                value={doorCount}
                onChange={setDoorCount}
                placeholder="Example: 2"
              />

              <InputWithUnit
                label="Door Width"
                value={doorWidth}
                onChange={setDoorWidth}
                unit={doorWidthUnit}
                onUnitChange={setDoorWidthUnit}
                placeholder="Example: 3"
                units={lengthUnits()}
              />

              <InputWithUnit
                label="Door Height"
                value={doorHeight}
                onChange={setDoorHeight}
                unit={doorHeightUnit}
                onUnitChange={setDoorHeightUnit}
                placeholder="Example: 7"
                units={lengthUnits()}
              />

            </div>

          </section>
        )}

        {/* =========================
            WINDOWS
        ========================= */}

        {(workType === "interior_wall" ||
          workType === "exterior_wall") && (

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Windows
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Window area will be deducted from the total
              wall area.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of Windows"
                value={windowCount}
                onChange={setWindowCount}
                placeholder="Example: 4"
              />

              <InputWithUnit
                label="Window Width"
                value={windowWidth}
                onChange={setWindowWidth}
                unit={windowWidthUnit}
                onUnitChange={setWindowWidthUnit}
                placeholder="Example: 4"
                units={lengthUnits()}
              />

              <InputWithUnit
                label="Window Height"
                value={windowHeight}
                onChange={setWindowHeight}
                unit={windowHeightUnit}
                onUnitChange={setWindowHeightUnit}
                placeholder="Example: 4"
                units={lengthUnits()}
              />

            </div>

          </section>
        )}

        {/* =========================
            PAINT SETTINGS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Paint Settings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter the paint application details.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Number of Coats"
              value={coats}
              onChange={setCoats}
              placeholder="Example: 2"
            />

            <Input
              label="Paint Coverage (sq ft per litre)"
              value={coverage}
              onChange={setCoverage}
              placeholder="Example: 100"
            />

            <Input
              label="Paint Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
            />

            <Input
              label="Paint Rate (₹ per litre)"
              value={rate}
              onChange={setRate}
              placeholder="Example: 450"
            />

          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">

            <strong>Paint formula:</strong>

            <br />

            Paint Required =
            {" "}
            (Net Paintable Area × Coats)
            ÷ Coverage

            <br />

            <span className="text-xs">
              Doors and windows are deducted before
              calculating paint quantity.
            </span>

          </div>

        </section>

        {/* =========================
            RESULTS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {workTypeName[workType]}
          </h3>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <div className="space-y-4">

              <ResultRow
                label="Gross Surface Area"
                value={`${calculation.grossAreaSqFt.toFixed(
                  2
                )} sq ft`}
              />

              {(workType === "interior_wall" ||
                workType === "exterior_wall") && (
                <>
                  <ResultRow
                    label="Door Area Deducted"
                    value={`− ${calculation.doorAreaSqFt.toFixed(
                      2
                    )} sq ft`}
                  />

                  <ResultRow
                    label="Window Area Deducted"
                    value={`− ${calculation.windowAreaSqFt.toFixed(
                      2
                    )} sq ft`}
                  />

                  <ResultRow
                    label="Total Deduction"
                    value={`− ${calculation.deductionSqFt.toFixed(
                      2
                    )} sq ft`}
                  />
                </>
              )}

              <ResultRow
                label="Net Paintable Area"
                value={`${calculation.netAreaSqFt.toFixed(
                  2
                )} sq ft`}
                bold
              />

              <ResultRow
                label="Number of Coats"
                value={`${calculation.numberOfCoats}`}
              />

              <ResultRow
                label="Total Paint Area"
                value={`${calculation.totalPaintAreaSqFt.toFixed(
                  2
                )} sq ft`}
              />

              <ResultRow
                label="Paint Coverage"
                value={`${calculation.coverageRate.toFixed(
                  2
                )} sq ft/L`}
              />

              <ResultRow
                label="Paint Before Wastage"
                value={`${calculation.paintBeforeWastage.toFixed(
                  2
                )} litres`}
              />

              <ResultRow
                label={`Paint Wastage (${calculation.wastagePercent}%)`}
                value={`+ ${calculation.wastageLitres.toFixed(
                  2
                )} litres`}
              />

              <div className="border-t pt-4">

                <ResultRow
                  label="Final Paint Required"
                  value={`${calculation.finalPaintLitres.toFixed(
                    2
                  )} litres`}
                  bold
                />

              </div>

              <div className="border-t pt-4">

                <ResultRow
                  label="Paint Material Cost"
                  value={money(
                    calculation.materialCost
                  )}
                  bold
                />

              </div>

            </div>

          </div>

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

// =========================
// LENGTH CONVERSION
// =========================

function lengthToFeet(value, unit) {
  const number = Number(value) || 0;

  if (unit === "ft") {
    return number;
  }

  if (unit === "m") {
    return number * 3.280839895;
  }

  if (unit === "cm") {
    return number * 0.03280839895;
  }

  if (unit === "mm") {
    return number * 0.003280839895;
  }

  if (unit === "inch") {
    return number / 12;
  }

  return number;
}

// =========================
// LENGTH UNITS
// =========================

function lengthUnits() {
  return [
    ["ft", "Feet"],
    ["m", "Meter"],
    ["cm", "Centimeter"],
    ["mm", "Millimeter"],
    ["inch", "Inch"],
  ];
}

// =========================
// INPUT WITH UNIT
// =========================

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
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      />

      <label className="mt-2 block text-xs font-semibold text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) =>
          onUnitChange(e.target.value)
        }
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      >

        {units.map(([value, label]) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ))}

      </select>

    </div>
  );
}

// =========================
// NORMAL INPUT
// =========================

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
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}

// =========================
// RESULT ROW
// =========================

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