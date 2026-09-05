import { useEffect, useMemo, useState } from "react";

export default function TileCalculation({ onResult })  {
  // =========================
  // COMMON
  // =========================

  const [rateMode, setRateMode] = useState("tile");
  const [rate, setRate] = useState("");
  const [wastage, setWastage] = useState("5");

  // =========================
  // FLOOR
  // =========================

  const [floorLength, setFloorLength] = useState("");
  const [floorWidth, setFloorWidth] = useState("");

  const [floorLengthUnit, setFloorLengthUnit] = useState("ft");
  const [floorWidthUnit, setFloorWidthUnit] = useState("ft");

  // =========================
  // OPENINGS
  // =========================

  const [openingArea, setOpeningArea] = useState("");
  const [openingAreaUnit, setOpeningAreaUnit] = useState("sqft");

  // =========================
  // TILE SIZE
  // =========================

  const [tileLength, setTileLength] = useState("");
  const [tileWidth, setTileWidth] = useState("");

  const [tileLengthUnit, setTileLengthUnit] = useState("mm");
  const [tileWidthUnit, setTileWidthUnit] = useState("mm");

  const [tilesPerBox, setTilesPerBox] = useState("");

  // =========================
  // TILE THICKNESS
  // =========================

  const [tileThickness, setTileThickness] = useState("");
  const [tileThicknessUnit, setTileThicknessUnit] =
    useState("mm");

  // =========================
  // ADHESIVE / BEDDING
  // =========================

  const [installationMethod, setInstallationMethod] =
    useState("adhesive");

  const [adhesiveCoverage, setAdhesiveCoverage] =
    useState("3");

  const [adhesiveWastage, setAdhesiveWastage] =
    useState("5");

  const [adhesiveRate, setAdhesiveRate] =
    useState("");

  // =========================
  // CALCULATION
  // =========================

  const calculation = useMemo(() => {
    // =========================
    // FLOOR AREA
    // =========================

    const length = lengthToFeet(
      floorLength,
      floorLengthUnit
    );

    const width = lengthToFeet(
      floorWidth,
      floorWidthUnit
    );

    const grossFloorArea =
      length * width;

    // =========================
    // OPENINGS
    // =========================

    const openingsSqFt =
      areaToSqFt(
        openingArea,
        openingAreaUnit
      );

    const netFloorArea = Math.max(
      grossFloorArea - openingsSqFt,
      0
    );

    // =========================
    // TILE AREA
    // =========================

    const tileL = lengthToFeet(
      tileLength,
      tileLengthUnit
    );

    const tileW = lengthToFeet(
      tileWidth,
      tileWidthUnit
    );

    const tileAreaSqFt =
      tileL * tileW;

    // =========================
    // TILES BEFORE WASTAGE
    // =========================

    const tilesBeforeWastage =
      tileAreaSqFt > 0
        ? netFloorArea / tileAreaSqFt
        : 0;

    // =========================
    // WASTAGE
    // =========================

    const wastagePercent =
      Number(wastage) || 0;

    const wastageTiles =
      tilesBeforeWastage *
      (wastagePercent / 100);

    const tilesRequiredExact =
      tilesBeforeWastage +
      wastageTiles;

    // Tiles cannot be purchased
    // as a fraction of a tile.

    const finalTiles =
      Math.ceil(tilesRequiredExact);

    // =========================
    // BOX CALCULATION
    // =========================

    const boxCount =
      Number(tilesPerBox) || 0;

    const boxesRequired =
      boxCount > 0
        ? Math.ceil(finalTiles / boxCount)
        : 0;

    const tilesPurchased =
      boxCount > 0
        ? boxesRequired * boxCount
        : finalTiles;

    // =========================
    // TILE COST
    // =========================

    const tileRate =
      Number(rate) || 0;

    let tileMaterialCost = 0;

    if (rateMode === "tile") {
      tileMaterialCost =
        tilesPurchased * tileRate;
    } else {
      tileMaterialCost =
        boxesRequired * tileRate;
    }

    // =========================
    // ADHESIVE
    // =========================

    const coverage =
      Number(adhesiveCoverage) || 0;

    const adhesiveWastagePercent =
      Number(adhesiveWastage) || 0;

    let adhesiveQuantity = 0;
    let adhesiveWastageQuantity = 0;
    let finalAdhesiveQuantity = 0;
    let adhesiveCost = 0;

    if (
      installationMethod === "adhesive" &&
      coverage > 0
    ) {
      adhesiveQuantity =
        netFloorArea / coverage;

      adhesiveWastageQuantity =
        adhesiveQuantity *
        (adhesiveWastagePercent / 100);

      finalAdhesiveQuantity =
        adhesiveQuantity +
        adhesiveWastageQuantity;

      adhesiveCost =
        finalAdhesiveQuantity *
        (Number(adhesiveRate) || 0);
    }

    return {
      grossFloorArea,
      openingsSqFt,
      netFloorArea,

      tileAreaSqFt,

      tilesBeforeWastage,
      wastageTiles,
      tilesRequiredExact,

      finalTiles,

      tilesPerBox: boxCount,
      boxesRequired,
      tilesPurchased,

      tileMaterialCost,

      adhesiveQuantity,
      adhesiveWastageQuantity,
      finalAdhesiveQuantity,
      adhesiveCost,

      totalMaterialCost:
        tileMaterialCost +
        adhesiveCost,
    };
  }, [
    floorLength,
    floorWidth,
    floorLengthUnit,
    floorWidthUnit,

    openingArea,
    openingAreaUnit,

    tileLength,
    tileWidth,
    tileLengthUnit,
    tileWidthUnit,

    tilesPerBox,

    tileThickness,
    tileThicknessUnit,

    rateMode,
    rate,
    wastage,

    installationMethod,
    adhesiveCoverage,
    adhesiveWastage,
    adhesiveRate,
  ]);


  // =========================
  // SEND RESULT TO APP
  // =========================

  useEffect(() => {
    if (typeof onResult !== "function") {
      return;
    }

    const hasValidCalculation =
      calculation.netFloorArea > 0 &&
      calculation.tileAreaSqFt > 0 &&
      calculation.finalTiles > 0 &&
      Number(rate) > 0;

    if (!hasValidCalculation) {
      onResult(null);
      return;
    }

    const isBoxRate = rateMode === "box";

    onResult({
      material: "Tiles",
      item: "Tiles",
      category: "Materials",

      specification: isBoxRate
        ? `${calculation.boxesRequired} boxes required`
        : `${calculation.tilesPurchased} tiles required`,

      description:
        `Floor area ${calculation.netFloorArea.toFixed(2)} sq ft, ` +
        `tile size ${tileLength || 0} × ${tileWidth || 0} ${tileLengthUnit}`,

      quantity: isBoxRate
        ? calculation.boxesRequired
        : calculation.tilesPurchased,

      finalQuantity: isBoxRate
        ? calculation.boxesRequired
        : calculation.tilesPurchased,

      unit: isBoxRate
        ? "boxes"
        : "tiles",

      rate: Number(rate) || 0,

      amount: calculation.tileMaterialCost,

      cost: calculation.tileMaterialCost,

      wastage: Number(wastage) || 0,

      source: "Tile Calculator",

      calculationDetails: {
        grossFloorArea:
          calculation.grossFloorArea,

        openingsSqFt:
          calculation.openingsSqFt,

        netFloorArea:
          calculation.netFloorArea,

        tileAreaSqFt:
          calculation.tileAreaSqFt,

        tilesBeforeWastage:
          calculation.tilesBeforeWastage,

        wastageTiles:
          calculation.wastageTiles,

        finalTiles:
          calculation.finalTiles,

        tilesPerBox:
          calculation.tilesPerBox,

        boxesRequired:
          calculation.boxesRequired,

        tilesPurchased:
          calculation.tilesPurchased,

        installationMethod,

        adhesiveQuantity:
          calculation.adhesiveQuantity,

        finalAdhesiveQuantity:
          calculation.finalAdhesiveQuantity,

        adhesiveCost:
          calculation.adhesiveCost,

        totalMaterialCost:
          calculation.totalMaterialCost,
      },
    });
  }, [
    onResult,
    calculation,
    rate,
    rateMode,
    wastage,
    tileLength,
    tileWidth,
    tileLengthUnit,
    installationMethod,
  ]);

  // =========================
  // MONEY FORMAT
  // =========================

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  // =========================
  // UI
  // =========================

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
            Flooring Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Tile Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Calculate tiles required from floor area,
            tile size, openings and wastage.
          </p>

        </div>

        {/* =========================
            FLOOR AREA
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Floor Measurement
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter the floor dimensions.
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
              placeholder="Example: 20"
              units={lengthUnits()}
            />

          </div>

        </section>

        {/* =========================
            OPENINGS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Floor Openings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            If there are areas where tiles will not be
            installed, enter their total area.
          </p>

          <div className="mt-6 max-w-md">

            <InputWithUnit
              label="Opening / Deduction Area"
              value={openingArea}
              onChange={setOpeningArea}
              unit={openingAreaUnit}
              onUnitChange={setOpeningAreaUnit}
              placeholder="Example: 20"
              units={[
                ["sqft", "Square Feet"],
                ["sqm", "Square Metres"],
              ]}
            />

          </div>

        </section>

        {/* =========================
            TILE DETAILS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Tile Details
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter the actual tile dimensions printed on
            the tile or its packaging.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <InputWithUnit
              label="Tile Length"
              value={tileLength}
              onChange={setTileLength}
              unit={tileLengthUnit}
              onUnitChange={setTileLengthUnit}
              placeholder="Example: 600"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Tile Width"
              value={tileWidth}
              onChange={setTileWidth}
              unit={tileWidthUnit}
              onUnitChange={setTileWidthUnit}
              placeholder="Example: 600"
              units={lengthUnits()}
            />

            <InputWithUnit
              label="Tile Thickness"
              value={tileThickness}
              onChange={setTileThickness}
              unit={tileThicknessUnit}
              onUnitChange={setTileThicknessUnit}
              placeholder="Example: 8"
              units={lengthUnits()}
            />

            <Input
              label="Tiles Per Box"
              value={tilesPerBox}
              onChange={setTilesPerBox}
              placeholder="Example: 4"
            />

          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">

            <strong>Important:</strong>{" "}
            Tile size is used to calculate the actual area
            covered by one tile.

          </div>

        </section>

        {/* =========================
            TILE RATE
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Tile Price
          </h3>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Rate Based On
            </label>

            <select
              value={rateMode}
              onChange={(e) =>
                setRateMode(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >

              <option value="tile">
                Rate per Tile
              </option>

              <option value="box">
                Rate per Box
              </option>

            </select>

          </div>

          <div className="mt-5 max-w-md">

            <Input
              label={
                rateMode === "tile"
                  ? "Tile Rate (₹ per tile)"
                  : "Box Rate (₹ per box)"
              }
              value={rate}
              onChange={setRate}
              placeholder={
                rateMode === "tile"
                  ? "Example: 85"
                  : "Example: 340"
              }
            />

          </div>

          <div className="mt-5 max-w-md">

            <Input
              label="Tile Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
            />

          </div>

        </section>

        {/* =========================
            INSTALLATION
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Tile Installation Material
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Tile material and installation material are
            calculated separately.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Installation Method
            </label>

            <select
              value={installationMethod}
              onChange={(e) =>
                setInstallationMethod(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >

              <option value="adhesive">
                Tile Adhesive
              </option>

              <option value="cement_sand">
                Cement + Sand Bedding
              </option>

            </select>

          </div>

          {installationMethod === "adhesive" && (
            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Coverage (sq ft per unit)"
                value={adhesiveCoverage}
                onChange={setAdhesiveCoverage}
                placeholder="Example: 3"
              />

              <Input
                label="Adhesive Wastage (%)"
                value={adhesiveWastage}
                onChange={setAdhesiveWastage}
                placeholder="Example: 5"
              />

              <Input
                label="Adhesive Rate (₹ per unit)"
                value={adhesiveRate}
                onChange={setAdhesiveRate}
                placeholder="Example: 500"
              />

            </div>
          )}

          {installationMethod === "cement_sand" && (
            <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">

              <strong>
                Cement + Sand Bedding
              </strong>

              <p className="mt-1">
                Use the separate Cement and Sand
                calculators for bedding material.
                This prevents the tile cost from being
                mixed with the bedding calculation.
              </p>

            </div>
          )}

        </section>

        {/* =========================
            RESULTS
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-xl font-bold">
            Flooring / Tiles
          </h3>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <div className="space-y-4">

              <ResultRow
                label="Gross Floor Area"
                value={`${calculation.grossFloorArea.toFixed(
                  2
                )} sq ft`}
              />

              <ResultRow
                label="Opening / Deduction"
                value={`- ${calculation.openingsSqFt.toFixed(
                  2
                )} sq ft`}
              />

              <ResultRow
                label="Net Tile Area"
                value={`${calculation.netFloorArea.toFixed(
                  2
                )} sq ft`}
                bold
              />

              <div className="border-t pt-4">

                <ResultRow
                  label="Area of One Tile"
                  value={`${calculation.tileAreaSqFt.toFixed(
                    4
                  )} sq ft`}
                />

                <ResultRow
                  label="Tiles Before Wastage"
                  value={`${calculation.tilesBeforeWastage.toFixed(
                    2
                  )} tiles`}
                />

                <ResultRow
                  label={`Tile Wastage (${wastage || 0}%)`}
                  value={`+ ${calculation.wastageTiles.toFixed(
                    2
                  )} tiles`}
                />

                <ResultRow
                  label="Tiles Required"
                  value={`${calculation.finalTiles} tiles`}
                  bold
                />

              </div>

              <div className="border-t pt-4">

                <ResultRow
                  label="Tiles Per Box"
                  value={
                    calculation.tilesPerBox > 0
                      ? `${calculation.tilesPerBox} tiles`
                      : "Not entered"
                  }
                />

                <ResultRow
                  label="Boxes Required"
                  value={
                    calculation.boxesRequired > 0
                      ? `${calculation.boxesRequired} boxes`
                      : "—"
                  }
                  bold
                />

                {calculation.tilesPerBox > 0 && (
                  <ResultRow
                    label="Tiles Purchased"
                    value={`${calculation.tilesPurchased} tiles`}
                  />
                )}

              </div>

              <div className="border-t pt-4">

                <ResultRow
                  label="Tile Material Cost"
                  value={money(
                    calculation.tileMaterialCost
                  )}
                  bold
                />

              </div>

              {installationMethod === "adhesive" && (
                <div className="border-t pt-4">

                  <h4 className="mb-4 font-bold text-gray-900">
                    Tile Adhesive
                  </h4>

                  <ResultRow
                    label="Adhesive Before Wastage"
                    value={`${calculation.adhesiveQuantity.toFixed(
                      2
                    )} units`}
                  />

                  <ResultRow
                    label={`Adhesive Wastage (${adhesiveWastage || 0}%)`}
                    value={`+ ${calculation.adhesiveWastageQuantity.toFixed(
                      2
                    )} units`}
                  />

                  <ResultRow
                    label="Final Adhesive Required"
                    value={`${calculation.finalAdhesiveQuantity.toFixed(
                      2
                    )} units`}
                    bold
                  />

                  <ResultRow
                    label="Adhesive Cost"
                    value={money(
                      calculation.adhesiveCost
                    )}
                  />

                </div>
              )}

              <div className="border-t pt-4">

                <ResultRow
                  label="Total Material Cost"
                  value={money(
                    calculation.totalMaterialCost
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
// AREA CONVERSION
// =========================

function areaToSqFt(value, unit) {
  const number = Number(value) || 0;

  if (unit === "sqft") {
    return number;
  }

  if (unit === "sqm") {
    return number * 10.7639104167;
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