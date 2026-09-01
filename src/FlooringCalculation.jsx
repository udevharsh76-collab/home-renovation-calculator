import { useMemo, useState } from "react";

export default function FlooringCalculation() {
  // =========================================================
  // FLOORING TYPE
  // =========================================================

  const [flooringType, setFlooringType] = useState("tiles");

  // =========================================================
  // FLOOR DIMENSIONS
  // =========================================================

  const [floorLength, setFloorLength] = useState("");
  const [floorWidth, setFloorWidth] = useState("");

  const [floorLengthUnit, setFloorLengthUnit] = useState("ft");
  const [floorWidthUnit, setFloorWidthUnit] = useState("ft");

  // =========================================================
  // TILE / MATERIAL DIMENSIONS
  // =========================================================

  const [materialLength, setMaterialLength] = useState("");
  const [materialWidth, setMaterialWidth] = useState("");

  const [materialLengthUnit, setMaterialLengthUnit] =
    useState("mm");

  const [materialWidthUnit, setMaterialWidthUnit] =
    useState("mm");

  // =========================================================
  // WASTAGE & RATE
  // =========================================================

  const [wastage, setWastage] = useState("");
  const [rate, setRate] = useState("");

  // =========================================================
  // CALCULATION
  // =========================================================

  const calculation = useMemo(() => {
    // -------------------------------------------------------
    // FLOOR DIMENSIONS
    // -------------------------------------------------------

    const L = lengthToFeet(
      floorLength,
      floorLengthUnit
    );

    const W = lengthToFeet(
      floorWidth,
      floorWidthUnit
    );

    // -------------------------------------------------------
    // FLOOR AREA
    // -------------------------------------------------------

    const floorArea = L * W;

    // -------------------------------------------------------
    // WASTAGE
    // -------------------------------------------------------

    const wastagePercent =
      Number(wastage) || 0;

    const wastageArea =
      floorArea *
      (wastagePercent / 100);

    // -------------------------------------------------------
    // FINAL REQUIRED AREA
    // -------------------------------------------------------

    const finalRequiredArea =
      floorArea + wastageArea;

    // -------------------------------------------------------
    // MATERIAL AREA
    // -------------------------------------------------------

    const materialL = lengthToFeet(
      materialLength,
      materialLengthUnit
    );

    const materialW = lengthToFeet(
      materialWidth,
      materialWidthUnit
    );

    const materialArea =
      materialL * materialW;

    // -------------------------------------------------------
    // MATERIAL QUANTITY
    // -------------------------------------------------------

    let materialQuantity = 0;

    if (
      flooringType === "tiles" &&
      materialArea > 0
    ) {
      materialQuantity = Math.ceil(
        finalRequiredArea / materialArea
      );
    }

    // -------------------------------------------------------
    // COST
    // -------------------------------------------------------

    const flooringRate =
      Number(rate) || 0;

    const materialCost =
      finalRequiredArea *
      flooringRate;

    return {
      L,
      W,

      floorArea,

      wastagePercent,
      wastageArea,

      finalRequiredArea,

      materialL,
      materialW,
      materialArea,

      materialQuantity,

      flooringRate,
      materialCost,
    };
  }, [
    flooringType,

    floorLength,
    floorWidth,

    floorLengthUnit,
    floorWidthUnit,

    materialLength,
    materialWidth,

    materialLengthUnit,
    materialWidthUnit,

    wastage,
    rate,
  ]);

  // =========================================================
  // MONEY FORMAT
  // =========================================================

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  // =========================================================
  // FLOORING TYPE NAME
  // =========================================================

  const flooringTypeName = {
    tiles: "Floor Tiles",
    wood: "Wooden / Laminate Flooring",
    vinyl: "Vinyl Flooring",
    marble: "Marble / Granite",
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* =====================================================
          HEADER
      ===================================================== */}

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

        {/* =================================================
            TITLE
        ================================================= */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Flooring Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Flooring Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Calculate flooring quantity, wastage and
            material cost according to the selected
            flooring type.
          </p>

        </div>

        {/* =================================================
            FLOORING TYPE
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Flooring Type
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Select the type of flooring you want to install.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Select Flooring
            </label>

            <select
              value={flooringType}
              onChange={(e) =>
                setFlooringType(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >

              <option value="tiles">
                Floor Tiles
              </option>

              <option value="wood">
                Wooden / Laminate Flooring
              </option>

              <option value="vinyl">
                Vinyl Flooring
              </option>

              <option value="marble">
                Marble / Granite
              </option>

            </select>

          </div>

        </section>

        {/* =================================================
            FLOOR DIMENSIONS
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Floor Dimensions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter the length and width of the floor area.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <InputWithUnit
              label="Floor Length"
              value={floorLength}
              onChange={setFloorLength}
              unit={floorLengthUnit}
              onUnitChange={setFloorLengthUnit}
              placeholder="Example: 20"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Floor Width"
              value={floorWidth}
              onChange={setFloorWidth}
              unit={floorWidthUnit}
              onUnitChange={setFloorWidthUnit}
              placeholder="Example: 10"
              units={lengthUnits()}
            />

          </div>

        </section>

        {/* =================================================
            MATERIAL DIMENSIONS
            ONLY WHEN MATERIAL SIZE IS REQUIRED
        ================================================= */}

        {(flooringType === "tiles" ||
          flooringType === "wood" ||
          flooringType === "vinyl") && (

          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-gray-900">
              Material Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter the size of one flooring piece.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label={
                  flooringType === "tiles"
                    ? "Tile Length"
                    : "Material Length"
                }
                value={materialLength}
                onChange={setMaterialLength}
                unit={materialLengthUnit}
                onUnitChange={setMaterialLengthUnit}
                placeholder={
                  flooringType === "tiles"
                    ? "Example: 600"
                    : "Example: 1200"
                }
                units={lengthUnits()}
              />

              <InputWithUnit
                label={
                  flooringType === "tiles"
                    ? "Tile Width"
                    : "Material Width"
                }
                value={materialWidth}
                onChange={setMaterialWidth}
                unit={materialWidthUnit}
                onUnitChange={setMaterialWidthUnit}
                placeholder={
                  flooringType === "tiles"
                    ? "Example: 600"
                    : "Example: 200"
                }
                units={lengthUnits()}
              />

            </div>

          </section>

        )}

        {/* =================================================
            WASTAGE & RATE
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Flooring Settings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter wastage and flooring material rate.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Flooring Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
            />

            <Input
              label="Flooring Rate (₹ per sq ft)"
              value={rate}
              onChange={setRate}
              placeholder="Example: 80"
            />

          </div>

          {/* =================================================
              CALCULATION METHOD
          ================================================= */}

          <div className="mt-5 rounded-xl bg-blue-50 p-5 text-sm text-blue-900">

            <p className="font-bold">
              Calculation Method
            </p>

            <p className="mt-2">
              Floor Area = Length × Width
            </p>

            <p className="mt-1">
              Wastage = Floor Area × Wastage %
            </p>

            <p className="mt-1">
              Final Required Area = Floor Area + Wastage
            </p>

            {flooringType === "tiles" && (
              <p className="mt-1">
                Tiles Required = Final Required Area ÷
                Area of One Tile, rounded up.
              </p>
            )}

            <p className="mt-1">
              Material Cost = Final Required Area × Rate
            </p>

          </div>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-xl font-bold text-gray-900">
            {flooringTypeName[flooringType]}
          </h3>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <div className="space-y-4">

              {/* FLOOR AREA */}

              <ResultRow
                label="Floor Area"
                value={`${calculation.floorArea.toFixed(2)} sq ft`}
                bold
              />

              {/* WASTAGE */}

              <ResultRow
                label={`Wastage (${wastage || 0}%)`}
                value={`+ ${calculation.wastageArea.toFixed(2)} sq ft`}
              />

              {/* FINAL AREA */}

              <div className="border-t pt-4">

                <ResultRow
                  label="Final Required Area"
                  value={`${calculation.finalRequiredArea.toFixed(2)} sq ft`}
                  bold
                />

              </div>

              {/* MATERIAL AREA */}

              {(flooringType === "tiles" ||
                flooringType === "wood" ||
                flooringType === "vinyl") && (

                <ResultRow
                  label={
                    flooringType === "tiles"
                      ? "Area of One Tile"
                      : "Area of One Material Piece"
                  }
                  value={`${calculation.materialArea.toFixed(4)} sq ft`}
                />

              )}

              {/* TILE QUANTITY */}

              {flooringType === "tiles" && (

                <div className="border-t pt-4">

                  <ResultRow
                    label="Tiles Required"
                    value={`${calculation.materialQuantity} tiles`}
                    bold
                  />

                </div>

              )}

              {/* RATE */}

              <ResultRow
                label="Flooring Rate"
                value={`₹${calculation.flooringRate.toFixed(2)} / sq ft`}
              />

              {/* COST */}

              <div className="border-t pt-4">

                <ResultRow
                  label="Flooring Material Cost"
                  value={money(calculation.materialCost)}
                  bold
                />

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

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


// =============================================================
// LENGTH CONVERSION
// =============================================================

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


// =============================================================
// LENGTH UNITS
// =============================================================

function lengthUnits() {

  return [
    ["ft", "Feet"],
    ["m", "Meter"],
    ["cm", "Centimeter"],
    ["mm", "Millimeter"],
    ["inch", "Inch"],
  ];

}


// =============================================================
// INPUT WITH UNIT
// =============================================================

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


// =============================================================
// NORMAL INPUT
// =============================================================

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


// =============================================================
// RESULT ROW
// =============================================================

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
            ? "font-bold text-blue-800"
            : "font-semibold text-gray-800"
        }
      >
        {value}
      </span>

    </div>

  );

}