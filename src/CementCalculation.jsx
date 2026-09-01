import { useMemo, useState } from "react";

export default function CementCalculation() {
  const [workType, setWorkType] = useState("rcc");

  // =========================
  // COMMON
  // =========================

  const [rate, setRate] = useState("");
  const [wastage, setWastage] = useState("");

  // =========================
  // RCC / CONCRETE
  // =========================

  const [rccLength, setRccLength] = useState("");
  const [rccWidth, setRccWidth] = useState("");
  const [rccDepth, setRccDepth] = useState("");

  const [rccLengthUnit, setRccLengthUnit] = useState("ft");
  const [rccWidthUnit, setRccWidthUnit] = useState("ft");
  const [rccDepthUnit, setRccDepthUnit] = useState("inch");

  const [rccCementParts, setRccCementParts] = useState("1");
  const [rccSandParts, setRccSandParts] = useState("2");
  const [rccAggregateParts, setRccAggregateParts] = useState("4");

  // =========================
  // BRICK MASONRY
  // =========================

  const [wallLength, setWallLength] = useState("");
  const [wallHeight, setWallHeight] = useState("");
  const [wallThickness, setWallThickness] = useState("");

  const [wallLengthUnit, setWallLengthUnit] = useState("ft");
  const [wallHeightUnit, setWallHeightUnit] = useState("ft");
  const [wallThicknessUnit, setWallThicknessUnit] = useState("inch");

  const [brickLength, setBrickLength] = useState("");
  const [brickWidth, setBrickWidth] = useState("");
  const [brickHeight, setBrickHeight] = useState("");

  const [brickLengthUnit, setBrickLengthUnit] = useState("mm");
  const [brickWidthUnit, setBrickWidthUnit] = useState("mm");
  const [brickHeightUnit, setBrickHeightUnit] = useState("mm");

  const [brickMortar, setBrickMortar] = useState("10");

  const [masonryCementParts, setMasonryCementParts] = useState("1");
  const [masonrySandParts, setMasonrySandParts] = useState("6");

  // =========================
  // PLASTER
  // =========================

  const [plasterArea, setPlasterArea] = useState("");
  const [plasterAreaUnit, setPlasterAreaUnit] = useState("sqft");

  const [plasterThickness, setPlasterThickness] = useState("12");
  const [plasterThicknessUnit, setPlasterThicknessUnit] = useState("mm");

  const [plasterCementParts, setPlasterCementParts] = useState("1");
  const [plasterSandParts, setPlasterSandParts] = useState("4");

  // =========================
  // FLOOR SCREED
  // =========================

  const [screedArea, setScreedArea] = useState("");
  const [screedAreaUnit, setScreedAreaUnit] = useState("sqft");

  const [screedThickness, setScreedThickness] = useState("25");
  const [screedThicknessUnit, setScreedThicknessUnit] = useState("mm");

  const [screedCementParts, setScreedCementParts] = useState("1");
  const [screedSandParts, setScreedSandParts] = useState("4");

  // =========================
  // TILE BEDDING
  // =========================

  const [tileArea, setTileArea] = useState("");
  const [tileAreaUnit, setTileAreaUnit] = useState("sqft");

  const [tileThickness, setTileThickness] = useState("20");
  const [tileThicknessUnit, setTileThicknessUnit] = useState("mm");

  const [tileCementParts, setTileCementParts] = useState("1");
  const [tileSandParts, setTileSandParts] = useState("4");

  // =========================
  // CALCULATION
  // =========================

  const calculation = useMemo(() => {
    let wetVolumeFt3 = 0;
    let dryVolumeFt3 = 0;
    let cementVolumeFt3 = 0;

    // =========================
    // RCC / CONCRETE
    // =========================

    if (workType === "rcc") {
      const length = lengthToFeet(
        rccLength,
        rccLengthUnit
      );

      const width = lengthToFeet(
        rccWidth,
        rccWidthUnit
      );

      const depth = lengthToFeet(
        rccDepth,
        rccDepthUnit
      );

      wetVolumeFt3 = length * width * depth;

      // Dry volume factor for concrete
      dryVolumeFt3 = wetVolumeFt3 * 1.54;

      const cementParts =
        Number(rccCementParts) || 0;

      const sandParts =
        Number(rccSandParts) || 0;

      const aggregateParts =
        Number(rccAggregateParts) || 0;

      const totalParts =
        cementParts +
        sandParts +
        aggregateParts;

      if (totalParts > 0) {
        cementVolumeFt3 =
          dryVolumeFt3 *
          (cementParts / totalParts);
      }
    }

    // =========================
    // BRICK MASONRY
    // =========================

    if (workType === "brick_masonry") {
      const length = lengthToFeet(
        wallLength,
        wallLengthUnit
      );

      const height = lengthToFeet(
        wallHeight,
        wallHeightUnit
      );

      const thickness = lengthToFeet(
        wallThickness,
        wallThicknessUnit
      );

      const brickL = lengthToFeet(
        brickLength,
        brickLengthUnit
      );

      const brickW = lengthToFeet(
        brickWidth,
        brickWidthUnit
      );

      const brickH = lengthToFeet(
        brickHeight,
        brickHeightUnit
      );

      const mortar = lengthToFeet(
        brickMortar,
        "mm"
      );

      wetVolumeFt3 =
        length *
        height *
        thickness;

      // Brick volume including mortar allowance
      const brickWithMortarVolume =
        (brickL + mortar) *
        (brickW + mortar) *
        (brickH + mortar);

      const brickCount =
        brickWithMortarVolume > 0
          ? wetVolumeFt3 / brickWithMortarVolume
          : 0;

      // Actual volume occupied by bricks
      const actualBrickVolume =
        brickL *
        brickW *
        brickH;

      const totalBrickVolume =
        brickCount *
        actualBrickVolume;

      // Wet mortar volume
      const mortarWetVolume =
        Math.max(
          wetVolumeFt3 -
            totalBrickVolume,
          0
        );

      // Dry mortar volume factor
      dryVolumeFt3 =
        mortarWetVolume * 1.33;

      const cementParts =
        Number(masonryCementParts) || 0;

      const sandParts =
        Number(masonrySandParts) || 0;

      const totalParts =
        cementParts +
        sandParts;

      if (totalParts > 0) {
        cementVolumeFt3 =
          dryVolumeFt3 *
          (cementParts / totalParts);
      }
    }

    // =========================
    // PLASTER
    // =========================

    if (workType === "plaster") {
      const areaSqFt =
        areaToSqFt(
          plasterArea,
          plasterAreaUnit
        );

      const thicknessFt =
        lengthToFeet(
          plasterThickness,
          plasterThicknessUnit
        );

      wetVolumeFt3 =
        areaSqFt *
        thicknessFt;

      // Dry mortar factor
      dryVolumeFt3 =
        wetVolumeFt3 * 1.33;

      const cementParts =
        Number(plasterCementParts) || 0;

      const sandParts =
        Number(plasterSandParts) || 0;

      const totalParts =
        cementParts +
        sandParts;

      if (totalParts > 0) {
        cementVolumeFt3 =
          dryVolumeFt3 *
          (cementParts / totalParts);
      }
    }

    // =========================
    // FLOOR SCREED
    // =========================

    if (workType === "floor_screed") {
      const areaSqFt =
        areaToSqFt(
          screedArea,
          screedAreaUnit
        );

      const thicknessFt =
        lengthToFeet(
          screedThickness,
          screedThicknessUnit
        );

      wetVolumeFt3 =
        areaSqFt *
        thicknessFt;

      dryVolumeFt3 =
        wetVolumeFt3 * 1.33;

      const cementParts =
        Number(screedCementParts) || 0;

      const sandParts =
        Number(screedSandParts) || 0;

      const totalParts =
        cementParts +
        sandParts;

      if (totalParts > 0) {
        cementVolumeFt3 =
          dryVolumeFt3 *
          (cementParts / totalParts);
      }
    }

    // =========================
    // TILE BEDDING
    // =========================

    if (workType === "tile_bedding") {
      const areaSqFt =
        areaToSqFt(
          tileArea,
          tileAreaUnit
        );

      const thicknessFt =
        lengthToFeet(
          tileThickness,
          tileThicknessUnit
        );

      wetVolumeFt3 =
        areaSqFt *
        thicknessFt;

      dryVolumeFt3 =
        wetVolumeFt3 * 1.33;

      const cementParts =
        Number(tileCementParts) || 0;

      const sandParts =
        Number(tileSandParts) || 0;

      const totalParts =
        cementParts +
        sandParts;

      if (totalParts > 0) {
        cementVolumeFt3 =
          dryVolumeFt3 *
          (cementParts / totalParts);
      }
    }

    // =========================
    // CONVERT CEMENT VOLUME
    // =========================

    // cementVolumeFt3 is in cubic feet.
    // Convert to cubic metres before calculating bags.

    const cementVolumeM3 =
      cementVolumeFt3 *
      0.028316846592;

    // Approximate bulk density of cement
    // 1 m3 cement ≈ 1440 kg

    const baseCementKg =
      cementVolumeM3 * 1440;

    const baseCementBags =
      baseCementKg / 50;

    // =========================
    // WASTAGE
    // =========================

    const wastagePercent =
      Number(wastage) || 0;

    const wastageKg =
      baseCementKg *
      (wastagePercent / 100);

    const wastageBags =
      wastageKg / 50;

    const finalKg =
      baseCementKg +
      wastageKg;

    const finalBags =
      finalKg / 50;

    // =========================
    // COST
    // =========================

    const cementRate =
      Number(rate) || 0;

    const materialCost =
      finalBags * cementRate;

    return {
      wetVolumeFt3,
      dryVolumeFt3,
      cementVolumeFt3,
      cementVolumeM3,
      baseCementKg,
      baseCementBags,
      wastageKg,
      wastageBags,
      finalKg,
      finalBags,
      materialCost,
    };
  }, [
    workType,

    rccLength,
    rccWidth,
    rccDepth,
    rccLengthUnit,
    rccWidthUnit,
    rccDepthUnit,
    rccCementParts,
    rccSandParts,
    rccAggregateParts,

    wallLength,
    wallHeight,
    wallThickness,
    wallLengthUnit,
    wallHeightUnit,
    wallThicknessUnit,
    brickLength,
    brickWidth,
    brickHeight,
    brickLengthUnit,
    brickWidthUnit,
    brickHeightUnit,
    brickMortar,
    masonryCementParts,
    masonrySandParts,

    plasterArea,
    plasterAreaUnit,
    plasterThickness,
    plasterThicknessUnit,
    plasterCementParts,
    plasterSandParts,

    screedArea,
    screedAreaUnit,
    screedThickness,
    screedThicknessUnit,
    screedCementParts,
    screedSandParts,

    tileArea,
    tileAreaUnit,
    tileThickness,
    tileThicknessUnit,
    tileCementParts,
    tileSandParts,

    rate,
    wastage,
  ]);

  // =========================
  // WORK TYPE NAME
  // =========================

  const workTypeName = {
    rcc: "RCC / Concrete",
    brick_masonry: "Brick Masonry",
    plaster: "Plaster",
    floor_screed: "Floor Screed",
    tile_bedding: "Tile Bedding",
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
            Cement Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Cement Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Select the construction work. RenovateCalc
            will use the appropriate cement calculation
            method for that work.
          </p>

        </div>

        {/* =========================
            WORK TYPE
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Cement Usage
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Cement requirements change according to the
            type of construction work.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Work Type
            </label>

            <select
              value={workType}
              onChange={(e) =>
                setWorkType(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
            >

              <option value="rcc">
                RCC / Concrete
              </option>

              <option value="brick_masonry">
                Brick Masonry
              </option>

              <option value="plaster">
                Plaster
              </option>

              <option value="floor_screed">
                Floor Screed
              </option>

              <option value="tile_bedding">
                Tile Bedding
              </option>

            </select>

          </div>

        </section>

        {/* =========================
            RCC
        ========================= */}

        {workType === "rcc" && (
          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              RCC / Concrete
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate cement from concrete volume and
              selected concrete mix ratio.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <InputWithUnit
                label="Length"
                value={rccLength}
                onChange={setRccLength}
                unit={rccLengthUnit}
                onUnitChange={setRccLengthUnit}
                placeholder="Example: 20"
                units={lengthUnits()}
              />

              <InputWithUnit
                label="Width"
                value={rccWidth}
                onChange={setRccWidth}
                unit={rccWidthUnit}
                onUnitChange={setRccWidthUnit}
                placeholder="Example: 10"
                units={lengthUnits()}
              />

              <InputWithUnit
                label="Depth"
                value={rccDepth}
                onChange={setRccDepth}
                unit={rccDepthUnit}
                onUnitChange={setRccDepthUnit}
                placeholder="Example: 6"
                units={lengthUnits()}
              />

            </div>

            <div className="mt-6">

              <h4 className="font-bold">
                Mix Ratio
              </h4>

              <div className="mt-4 grid gap-5 md:grid-cols-3">

                <Input
                  label="Cement Parts"
                  value={rccCementParts}
                  onChange={setRccCementParts}
                  placeholder="1"
                />

                <Input
                  label="Sand Parts"
                  value={rccSandParts}
                  onChange={setRccSandParts}
                  placeholder="2"
                />

                <Input
                  label="Aggregate Parts"
                  value={rccAggregateParts}
                  onChange={setRccAggregateParts}
                  placeholder="4"
                />

              </div>

            </div>

          </section>
        )}

        {/* =========================
            BRICK MASONRY
        ========================= */}

        {workType === "brick_masonry" && (
          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Brick Masonry
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Cement is calculated from the mortar volume
              between the bricks.
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

              <InputWithUnit
                label="Mortar Thickness"
                value={brickMortar}
                onChange={setBrickMortar}
                unit="mm"
                onUnitChange={() => {}}
                placeholder="Example: 10"
                units={[
                  ["mm", "Millimeter"],
                ]}
              />

            </div>

            <div className="mt-6">

              <h4 className="font-bold">
                Mortar Mix Ratio
              </h4>

              <div className="mt-4 grid gap-5 md:grid-cols-2">

                <Input
                  label="Cement Parts"
                  value={masonryCementParts}
                  onChange={setMasonryCementParts}
                  placeholder="1"
                />

                <Input
                  label="Sand Parts"
                  value={masonrySandParts}
                  onChange={setMasonrySandParts}
                  placeholder="6"
                />

              </div>

            </div>

          </section>
        )}

        {/* =========================
            PLASTER
        ========================= */}

        {workType === "plaster" && (
          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Plaster
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate cement according to plaster area,
              thickness and mortar ratio.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Plaster Area"
                value={plasterArea}
                onChange={setPlasterArea}
                unit={plasterAreaUnit}
                onUnitChange={setPlasterAreaUnit}
                placeholder="Example: 500"
                units={[
                  ["sqft", "sq ft"],
                  ["sqm", "sq m"],
                ]}
              />

              <InputWithUnit
                label="Plaster Thickness"
                value={plasterThickness}
                onChange={setPlasterThickness}
                unit={plasterThicknessUnit}
                onUnitChange={setPlasterThicknessUnit}
                placeholder="Example: 12"
                units={lengthUnits()}
              />

              <Input
                label="Cement Parts"
                value={plasterCementParts}
                onChange={setPlasterCementParts}
                placeholder="1"
              />

              <Input
                label="Sand Parts"
                value={plasterSandParts}
                onChange={setPlasterSandParts}
                placeholder="4"
              />

            </div>

          </section>
        )}

        {/* =========================
            FLOOR SCREED
        ========================= */}

        {workType === "floor_screed" && (
          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Floor Screed
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate cement from floor area, screed
              thickness and mix ratio.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Floor Area"
                value={screedArea}
                onChange={setScreedArea}
                unit={screedAreaUnit}
                onUnitChange={setScreedAreaUnit}
                placeholder="Example: 400"
                units={[
                  ["sqft", "sq ft"],
                  ["sqm", "sq m"],
                ]}
              />

              <InputWithUnit
                label="Screed Thickness"
                value={screedThickness}
                onChange={setScreedThickness}
                unit={screedThicknessUnit}
                onUnitChange={setScreedThicknessUnit}
                placeholder="Example: 25"
                units={lengthUnits()}
              />

              <Input
                label="Cement Parts"
                value={screedCementParts}
                onChange={setScreedCementParts}
                placeholder="1"
              />

              <Input
                label="Sand Parts"
                value={screedSandParts}
                onChange={setScreedSandParts}
                placeholder="4"
              />

            </div>

          </section>
        )}

        {/* =========================
            TILE BEDDING
        ========================= */}

        {workType === "tile_bedding" && (
          <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold">
              Tile Bedding
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate cement used in the cement-sand
              bedding layer below tiles.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Tile Area"
                value={tileArea}
                onChange={setTileArea}
                unit={tileAreaUnit}
                onUnitChange={setTileAreaUnit}
                placeholder="Example: 400"
                units={[
                  ["sqft", "sq ft"],
                  ["sqm", "sq m"],
                ]}
              />

              <InputWithUnit
                label="Bedding Thickness"
                value={tileThickness}
                onChange={setTileThickness}
                unit={tileThicknessUnit}
                onUnitChange={setTileThicknessUnit}
                placeholder="Example: 20"
                units={lengthUnits()}
              />

              <Input
                label="Cement Parts"
                value={tileCementParts}
                onChange={setTileCementParts}
                placeholder="1"
              />

              <Input
                label="Sand Parts"
                value={tileSandParts}
                onChange={setTileSandParts}
                placeholder="4"
              />

            </div>

          </section>
        )}

        {/* =========================
            COMMON RATE / WASTAGE
        ========================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold">
            Rate & Wastage
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Cement Rate (₹ per bag)"
              value={rate}
              onChange={setRate}
              placeholder="Example: 400"
            />

            <Input
              label="Cement Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
            />

          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">

            <strong>Standard conversion:</strong>{" "}
            1 cement bag = 50 kg.

            <br />

            <span className="text-xs">
              Cement volume is converted from cubic feet
              to cubic metres before calculating weight.
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
                label="Wet Volume"
                value={`${calculation.wetVolumeFt3.toFixed(4)} cu ft`}
              />

              <ResultRow
                label="Dry Volume"
                value={`${calculation.dryVolumeFt3.toFixed(4)} cu ft`}
              />

              <ResultRow
                label="Cement Volume"
                value={`${calculation.cementVolumeFt3.toFixed(5)} cu ft`}
              />

              <ResultRow
                label="Cement Volume"
                value={`${calculation.cementVolumeM3.toFixed(5)} m³`}
              />

              <ResultRow
                label="Cement Before Wastage"
                value={`${calculation.baseCementKg.toFixed(2)} kg`}
              />

              <ResultRow
                label="Cement Before Wastage"
                value={`${calculation.baseCementBags.toFixed(2)} bags`}
              />

              <ResultRow
                label={`Cement Wastage (${wastage || 0}%)`}
                value={`+ ${calculation.wastageKg.toFixed(2)} kg`}
              />

              <ResultRow
                label="Cement Wastage"
                value={`+ ${calculation.wastageBags.toFixed(2)} bags`}
              />

              <div className="border-t pt-4">

                <ResultRow
                  label="Final Cement Required"
                  value={`${calculation.finalKg.toFixed(2)} kg`}
                  bold
                />

                <div className="mt-3">

                  <ResultRow
                    label="Final Cement Bags"
                    value={`${calculation.finalBags.toFixed(2)} bags`}
                    bold
                  />

                </div>

              </div>

              <div className="border-t pt-4">

                <ResultRow
                  label="Cement Material Cost"
                  value={money(calculation.materialCost)}
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