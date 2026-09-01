import { useMemo, useState } from "react";

export default function PuttyCalculation() {
  // =========================================================
  // PUTTY TYPE
  // =========================================================

  const [puttyType, setPuttyType] = useState("wall");

  // =========================================================
  // ROOM DIMENSIONS
  // =========================================================

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [lengthUnit, setLengthUnit] = useState("ft");
  const [widthUnit, setWidthUnit] = useState("ft");
  const [heightUnit, setHeightUnit] = useState("ft");

  // =========================================================
  // DOORS
  // Used only for Wall Putty / Wall + Ceiling
  // =========================================================

  const [doorCount, setDoorCount] = useState("");
  const [doorWidth, setDoorWidth] = useState("");
  const [doorHeight, setDoorHeight] = useState("");

  const [doorWidthUnit, setDoorWidthUnit] = useState("ft");
  const [doorHeightUnit, setDoorHeightUnit] = useState("ft");

  // =========================================================
  // WINDOWS
  // Used only for Wall Putty / Wall + Ceiling
  // =========================================================

  const [windowCount, setWindowCount] = useState("");
  const [windowWidth, setWindowWidth] = useState("");
  const [windowHeight, setWindowHeight] = useState("");

  const [windowWidthUnit, setWindowWidthUnit] = useState("ft");
  const [windowHeightUnit, setWindowHeightUnit] = useState("ft");

  // =========================================================
  // PUTTY SETTINGS
  // =========================================================

  const [consumption, setConsumption] = useState("1.5");
  const [coats, setCoats] = useState("2");
  const [wastage, setWastage] = useState("");
  const [rate, setRate] = useState("");

  // =========================================================
  // HELPER FLAGS
  // =========================================================

  const isWall = puttyType === "wall";
  const isCeiling = puttyType === "ceiling";
  const isWallCeiling = puttyType === "wall_ceiling";

  const needsWallDimensions = isWall || isWallCeiling;
  const needsCeilingDimensions = isCeiling || isWallCeiling;
  const needsOpenings = isWall || isWallCeiling;

  // =========================================================
  // CALCULATION
  // =========================================================

  const calculation = useMemo(() => {
    // -------------------------------------------------------
    // CONVERT DIMENSIONS TO FEET
    // -------------------------------------------------------

    const L = lengthToFeet(length, lengthUnit);
    const W = lengthToFeet(width, widthUnit);
    const H = lengthToFeet(height, heightUnit);

    // -------------------------------------------------------
    // FOUR WALL AREA
    //
    // 2 × (Length + Width) × Height
    //
    // This calculates all four walls:
    //
    // 2 × Length × Height
    // +
    // 2 × Width × Height
    // -------------------------------------------------------

    let grossWallArea = 0;

    if (needsWallDimensions) {
      grossWallArea = 2 * (L + W) * H;
    }

    // -------------------------------------------------------
    // DOOR AREA
    // Only applicable to walls
    // -------------------------------------------------------

    let doorArea = 0;

    if (needsOpenings) {
      const doors = Number(doorCount) || 0;

      const convertedDoorWidth = lengthToFeet(
        doorWidth,
        doorWidthUnit
      );

      const convertedDoorHeight = lengthToFeet(
        doorHeight,
        doorHeightUnit
      );

      doorArea =
        doors *
        convertedDoorWidth *
        convertedDoorHeight;
    }

    // -------------------------------------------------------
    // WINDOW AREA
    // Only applicable to walls
    // -------------------------------------------------------

    let windowArea = 0;

    if (needsOpenings) {
      const windows = Number(windowCount) || 0;

      const convertedWindowWidth = lengthToFeet(
        windowWidth,
        windowWidthUnit
      );

      const convertedWindowHeight = lengthToFeet(
        windowHeight,
        windowHeightUnit
      );

      windowArea =
        windows *
        convertedWindowWidth *
        convertedWindowHeight;
    }

    // -------------------------------------------------------
    // NET WALL AREA
    // -------------------------------------------------------

    const netWallArea = needsWallDimensions
      ? Math.max(
          grossWallArea -
            doorArea -
            windowArea,
          0
        )
      : 0;

    // -------------------------------------------------------
    // CEILING AREA
    //
    // Length × Width
    //
    // Ceiling does NOT require height.
    // -------------------------------------------------------

    const ceilingArea = needsCeilingDimensions
      ? L * W
      : 0;

    // -------------------------------------------------------
    // SELECT FINAL AREA
    // -------------------------------------------------------

    let selectedArea = 0;

    if (isWall) {
      selectedArea = netWallArea;
    }

    if (isCeiling) {
      selectedArea = ceilingArea;
    }

    if (isWallCeiling) {
      selectedArea =
        netWallArea +
        ceilingArea;
    }

    // -------------------------------------------------------
    // SQ FT TO SQ M
    // -------------------------------------------------------

    const selectedAreaM2 =
      selectedArea * 0.09290304;

    // -------------------------------------------------------
    // PUTTY QUANTITY
    //
    // Area × Consumption × Coats
    // -------------------------------------------------------

    const consumptionRate =
      Number(consumption) || 0;

    const numberOfCoats =
      Number(coats) || 0;

    const basePuttyKg =
      selectedAreaM2 *
      consumptionRate *
      numberOfCoats;

    // -------------------------------------------------------
    // WASTAGE
    // -------------------------------------------------------

    const wastagePercent =
      Number(wastage) || 0;

    const wastageKg =
      basePuttyKg *
      (wastagePercent / 100);

    const finalPuttyKg =
      basePuttyKg +
      wastageKg;

    // -------------------------------------------------------
    // COST
    // -------------------------------------------------------

    const puttyRate =
      Number(rate) || 0;

    const materialCost =
      finalPuttyKg *
      puttyRate;

    return {
      L,
      W,
      H,

      grossWallArea,
      doorArea,
      windowArea,
      netWallArea,

      ceilingArea,

      selectedArea,
      selectedAreaM2,

      consumptionRate,
      numberOfCoats,

      basePuttyKg,

      wastagePercent,
      wastageKg,

      finalPuttyKg,

      puttyRate,
      materialCost,
    };
  }, [
    puttyType,

    length,
    width,
    height,

    lengthUnit,
    widthUnit,
    heightUnit,

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

    consumption,
    coats,
    wastage,
    rate,

    needsWallDimensions,
    needsCeilingDimensions,
    needsOpenings,
    isWall,
    isCeiling,
    isWallCeiling,
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
  // PUTTY TYPE NAME
  // =========================================================

  const puttyTypeName = {
    wall: "Wall Putty",
    ceiling: "Ceiling Putty",
    wall_ceiling: "Wall + Ceiling Putty",
  };

  // =========================================================
  // CHANGE PUTTY TYPE
  // =========================================================

  const handlePuttyTypeChange = (value) => {
    setPuttyType(value);

    // Clear height when switching to ceiling.
    if (value === "ceiling") {
      setHeight("");
    }

    // Clear wall opening information for ceiling.
    if (value === "ceiling") {
      setDoorCount("");
      setDoorWidth("");
      setDoorHeight("");

      setWindowCount("");
      setWindowWidth("");
      setWindowHeight("");
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b bg-white shadow-sm">
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

          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Putty Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Putty Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Select the putty application and enter only the
            measurements required for that application.
          </p>

        </div>

        {/* =================================================
            PUTTY TYPE
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <h3 className="text-xl font-bold text-gray-900">
            Putty Application
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Choose where the putty will be applied.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-bold text-gray-700">
              Putty Type
            </label>

            <select
              value={puttyType}
              onChange={(e) =>
                handlePuttyTypeChange(e.target.value)
              }
              className="mt-2 w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >

              <option value="wall">
                Wall Putty
              </option>

              <option value="ceiling">
                Ceiling Putty
              </option>

              <option value="wall_ceiling">
                Wall + Ceiling Putty
              </option>

            </select>

          </div>

          {/* APPLICATION DESCRIPTION */}

          <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">

            {isWall && (
              <>
                <p className="font-bold text-blue-900">
                  Wall Putty
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  Calculates all four walls using Length,
                  Width and Height. Doors and windows are
                  deducted from the wall area.
                </p>
              </>
            )}

            {isCeiling && (
              <>
                <p className="font-bold text-indigo-900">
                  Ceiling Putty
                </p>

                <p className="mt-1 text-sm text-indigo-700">
                  Calculates only the ceiling using Length
                  × Width. Height, doors and windows are not
                  required.
                </p>
              </>
            )}

            {isWallCeiling && (
              <>
                <p className="font-bold text-purple-900">
                  Wall + Ceiling Putty
                </p>

                <p className="mt-1 text-sm text-purple-700">
                  Calculates all four walls plus the ceiling.
                  Doors and windows are deducted from the
                  wall area.
                </p>
              </>
            )}

          </div>

        </section>

        {/* =================================================
            ROOM DIMENSIONS
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <h3 className="text-xl font-bold text-gray-900">
            {isCeiling
              ? "Ceiling Dimensions"
              : "Room Dimensions"}
          </h3>

          <p className="mt-1 text-sm text-gray-500">

            {isWall &&
              "Enter the room length, width and height for all four walls."}

            {isCeiling &&
              "Enter only the ceiling length and width."}

            {isWallCeiling &&
              "Enter room length, width and height for the four walls and ceiling."}

          </p>

          {/* =================================================
              DIMENSIONS
          ================================================= */}

          <div
            className={`mt-6 grid gap-5 ${
              isCeiling
                ? "md:grid-cols-2"
                : "md:grid-cols-3"
            }`}
          >

            {/* LENGTH */}

            <InputWithUnit
              label={
                isCeiling
                  ? "Ceiling Length"
                  : "Room Length"
              }
              value={length}
              onChange={setLength}
              unit={lengthUnit}
              onUnitChange={setLengthUnit}
              placeholder="Example: 20"
              units={lengthUnits()}
            />

            {/* WIDTH */}

            <InputWithUnit
              label={
                isCeiling
                  ? "Ceiling Width"
                  : "Room Width"
              }
              value={width}
              onChange={setWidth}
              unit={widthUnit}
              onUnitChange={setWidthUnit}
              placeholder="Example: 10"
              units={lengthUnits()}
            />

            {/* HEIGHT
                ONLY WALL / WALL + CEILING */}

            {needsWallDimensions && (
              <InputWithUnit
                label="Room Height"
                value={height}
                onChange={setHeight}
                unit={heightUnit}
                onUnitChange={setHeightUnit}
                placeholder="Example: 10"
                units={lengthUnits()}
              />
            )}

          </div>

          {/* =================================================
              FORMULA DISPLAY
          ================================================= */}

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

            <p className="font-bold text-blue-900">
              Area Formula
            </p>

            {isWall && (
              <div className="mt-2 text-sm text-blue-800">
                <p>
                  <strong>Four Wall Area</strong> =
                  2 × (Length + Width) × Height
                </p>

                <p className="mt-1 text-xs">
                  Door and window areas are deducted.
                </p>
              </div>
            )}

            {isCeiling && (
              <div className="mt-2 text-sm text-blue-800">
                <p>
                  <strong>Ceiling Area</strong> =
                  Length × Width
                </p>

                <p className="mt-1 text-xs">
                  No height is required.
                </p>
              </div>
            )}

            {isWallCeiling && (
              <div className="mt-2 text-sm text-blue-800">
                <p>
                  <strong>Wall Area</strong> =
                  2 × (Length + Width) × Height
                </p>

                <p className="mt-1">
                  <strong>Ceiling Area</strong> =
                  Length × Width
                </p>

                <p className="mt-1">
                  <strong>Total</strong> =
                  Net Wall Area + Ceiling Area
                </p>
              </div>
            )}

          </div>

        </section>

        {/* =================================================
            DOORS
            ONLY WALL / WALL + CEILING
        ================================================= */}

        {needsOpenings && (

          <section className="mt-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-lg">

            <h3 className="text-xl font-bold text-gray-900">
              Doors
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Door area will be deducted from the four-wall
              surface automatically.
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

        {/* =================================================
            WINDOWS
            ONLY WALL / WALL + CEILING
        ================================================= */}

        {needsOpenings && (

          <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-lg">

            <h3 className="text-xl font-bold text-gray-900">
              Windows
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Window area will be deducted from the four-wall
              surface automatically.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of Windows"
                value={windowCount}
                onChange={setWindowCount}
                placeholder="Example: 3"
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

        {/* =================================================
            PUTTY SETTINGS
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <h3 className="text-xl font-bold text-gray-900">
            Putty Settings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter the product consumption, coats, wastage
            and material rate.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Putty Consumption (kg/m²/coat)"
              value={consumption}
              onChange={setConsumption}
              placeholder="Example: 1.5"
            />

            <Input
              label="Number of Coats"
              value={coats}
              onChange={setCoats}
              placeholder="Example: 2"
            />

            <Input
              label="Putty Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
            />

            <Input
              label="Putty Rate (₹ per kg)"
              value={rate}
              onChange={setRate}
              placeholder="Example: 30"
            />

          </div>

          {/* PUTTY FORMULA */}

          <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

            <p className="font-bold text-blue-900">
              Putty Quantity Formula
            </p>

            <p className="mt-2 text-sm text-blue-800">
              Putty Required =
              Area × Consumption × Number of Coats
            </p>

            <p className="mt-1 text-sm text-blue-800">
              Final Putty =
              Putty Before Wastage + Wastage
            </p>

          </div>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {puttyTypeName[puttyType]}
          </h3>

          <div className="mt-6 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 p-5">

            <div className="space-y-4">

              {/* =================================================
                  WALL RESULTS
              ================================================= */}

              {needsWallDimensions && (
                <>

                  <ResultRow
                    label="Gross Four-Wall Area"
                    value={`${calculation.grossWallArea.toFixed(2)} sq ft`}
                  />

                  <ResultRow
                    label="Door Area Deducted"
                    value={`- ${calculation.doorArea.toFixed(2)} sq ft`}
                  />

                  <ResultRow
                    label="Window Area Deducted"
                    value={`- ${calculation.windowArea.toFixed(2)} sq ft`}
                  />

                  <ResultRow
                    label="Net Wall Area"
                    value={`${calculation.netWallArea.toFixed(2)} sq ft`}
                    bold
                  />

                </>
              )}

              {/* =================================================
                  CEILING RESULT
              ================================================= */}

              {needsCeilingDimensions && (
                <ResultRow
                  label="Ceiling Area"
                  value={`${calculation.ceilingArea.toFixed(2)} sq ft`}
                  bold={isCeiling}
                />
              )}

              {/* =================================================
                  TOTAL AREA
              ================================================= */}

              <div className="border-t border-blue-200 pt-4">

                <ResultRow
                  label="Total Putty Area"
                  value={`${calculation.selectedArea.toFixed(2)} sq ft`}
                  bold
                />

              </div>

              <ResultRow
                label="Total Putty Area"
                value={`${calculation.selectedAreaM2.toFixed(2)} m²`}
              />

              {/* =================================================
                  CONSUMPTION
              ================================================= */}

              <ResultRow
                label="Consumption"
                value={`${calculation.consumptionRate.toFixed(2)} kg/m²/coat`}
              />

              <ResultRow
                label="Number of Coats"
                value={`${calculation.numberOfCoats}`}
              />

              {/* =================================================
                  BASE PUTTY
              ================================================= */}

              <ResultRow
                label="Putty Before Wastage"
                value={`${calculation.basePuttyKg.toFixed(2)} kg`}
              />

              {/* =================================================
                  WASTAGE
              ================================================= */}

              <ResultRow
                label={`Putty Wastage (${wastage || 0}%)`}
                value={`+ ${calculation.wastageKg.toFixed(2)} kg`}
              />

              {/* =================================================
                  FINAL PUTTY
              ================================================= */}

              <div className="border-t border-blue-200 pt-4">

                <div className="rounded-xl bg-blue-700 p-4 text-white">

                  <div className="flex items-center justify-between gap-4">

                    <span className="font-bold">
                      Final Putty Required
                    </span>

                    <span className="text-2xl font-bold">
                      {calculation.finalPuttyKg.toFixed(2)} kg
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  COST
              ================================================= */}

              <div className="border-t border-blue-200 pt-4">

                <ResultRow
                  label="Putty Material Cost"
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

      <label className="block text-sm font-bold text-gray-700">
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
        className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />

      <label className="mt-2 block text-xs font-bold text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) =>
          onUnitChange(e.target.value)
        }
        className="mt-1 w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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

      <label className="block text-sm font-bold text-gray-700">
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
        className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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