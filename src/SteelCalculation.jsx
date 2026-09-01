import { useMemo, useState } from "react";

export default function SteelCalculation() {
  // =========================================================
  // STEEL USAGE TYPE
  // =========================================================

  const [usageType, setUsageType] = useState("slab");

  // =========================================================
  // COMMON INPUTS
  // =========================================================

  const [wastage, setWastage] = useState("5");
  const [rate, setRate] = useState("");

  // =========================================================
  // RCC SLAB
  // =========================================================

  const [slabLength, setSlabLength] = useState("");
  const [slabWidth, setSlabWidth] = useState("");
  const [slabThickness, setSlabThickness] = useState("");

  const [slabLengthUnit, setSlabLengthUnit] = useState("ft");
  const [slabWidthUnit, setSlabWidthUnit] = useState("ft");
  const [slabThicknessUnit, setSlabThicknessUnit] =
    useState("inch");

  const [slabSteelPercentage, setSlabSteelPercentage] =
    useState("1");

  // =========================================================
  // RCC BEAM
  // =========================================================

  const [beamLength, setBeamLength] = useState("");
  const [beamWidth, setBeamWidth] = useState("");
  const [beamDepth, setBeamDepth] = useState("");

  const [beamLengthUnit, setBeamLengthUnit] = useState("ft");
  const [beamWidthUnit, setBeamWidthUnit] = useState("inch");
  const [beamDepthUnit, setBeamDepthUnit] = useState("inch");

  const [beamSteelPercentage, setBeamSteelPercentage] =
    useState("2");

  // =========================================================
  // RCC COLUMN
  // =========================================================

  const [columnCount, setColumnCount] = useState("");
  const [columnWidth, setColumnWidth] = useState("");
  const [columnDepth, setColumnDepth] = useState("");
  const [columnHeight, setColumnHeight] = useState("");

  const [columnWidthUnit, setColumnWidthUnit] =
    useState("inch");

  const [columnDepthUnit, setColumnDepthUnit] =
    useState("inch");

  const [columnHeightUnit, setColumnHeightUnit] =
    useState("ft");

  const [columnSteelPercentage, setColumnSteelPercentage] =
    useState("2.5");

  // =========================================================
  // FOOTING
  // =========================================================

  const [footingCount, setFootingCount] = useState("");
  const [footingLength, setFootingLength] = useState("");
  const [footingWidth, setFootingWidth] = useState("");
  const [footingThickness, setFootingThickness] =
    useState("");

  const [footingLengthUnit, setFootingLengthUnit] =
    useState("ft");

  const [footingWidthUnit, setFootingWidthUnit] =
    useState("ft");

  const [footingThicknessUnit, setFootingThicknessUnit] =
    useState("inch");

  const [footingSteelPercentage, setFootingSteelPercentage] =
    useState("1");

  // =========================================================
  // STEEL BAR / REBAR
  // =========================================================

  const [barCount, setBarCount] = useState("");
  const [barLength, setBarLength] = useState("");
  const [barDiameter, setBarDiameter] = useState("");

  const [barLengthUnit, setBarLengthUnit] =
    useState("ft");

  const [barDiameterUnit, setBarDiameterUnit] =
    useState("mm");

  // =========================================================
  // CALCULATION
  // =========================================================

  const calculation = useMemo(() => {
    let concreteVolumeM3 = 0;
    let steelPercentage = 0;
    let directSteelKg = 0;

    // -------------------------------------------------------
    // RCC SLAB
    // -------------------------------------------------------

    if (usageType === "slab") {
      const L = lengthToMeter(
        slabLength,
        slabLengthUnit
      );

      const W = lengthToMeter(
        slabWidth,
        slabWidthUnit
      );

      const T = lengthToMeter(
        slabThickness,
        slabThicknessUnit
      );

      concreteVolumeM3 = L * W * T;

      steelPercentage =
        Number(slabSteelPercentage) || 0;
    }

    // -------------------------------------------------------
    // RCC BEAM
    // -------------------------------------------------------

    if (usageType === "beam") {
      const L = lengthToMeter(
        beamLength,
        beamLengthUnit
      );

      const W = lengthToMeter(
        beamWidth,
        beamWidthUnit
      );

      const D = lengthToMeter(
        beamDepth,
        beamDepthUnit
      );

      concreteVolumeM3 = L * W * D;

      steelPercentage =
        Number(beamSteelPercentage) || 0;
    }

    // -------------------------------------------------------
    // RCC COLUMN
    // -------------------------------------------------------

    if (usageType === "column") {
      const count =
        Number(columnCount) || 0;

      const W = lengthToMeter(
        columnWidth,
        columnWidthUnit
      );

      const D = lengthToMeter(
        columnDepth,
        columnDepthUnit
      );

      const H = lengthToMeter(
        columnHeight,
        columnHeightUnit
      );

      concreteVolumeM3 =
        count * W * D * H;

      steelPercentage =
        Number(columnSteelPercentage) || 0;
    }

    // -------------------------------------------------------
    // FOOTING
    // -------------------------------------------------------

    if (usageType === "footing") {
      const count =
        Number(footingCount) || 0;

      const L = lengthToMeter(
        footingLength,
        footingLengthUnit
      );

      const W = lengthToMeter(
        footingWidth,
        footingWidthUnit
      );

      const T = lengthToMeter(
        footingThickness,
        footingThicknessUnit
      );

      concreteVolumeM3 =
        count * L * W * T;

      steelPercentage =
        Number(footingSteelPercentage) || 0;
    }

    // -------------------------------------------------------
    // STEEL BAR / REBAR
    // -------------------------------------------------------

    if (usageType === "bar") {
      const count =
        Number(barCount) || 0;

      const length =
        lengthToMeter(
          barLength,
          barLengthUnit
        );

      const diameter =
        lengthToMeter(
          barDiameter,
          barDiameterUnit
        );

      // Steel volume
      const volume =
        count *
        length *
        Math.PI *
        Math.pow(diameter / 2, 2);

      // Steel density ≈ 7850 kg/m³
      directSteelKg =
        volume * 7850;
    }

    // -------------------------------------------------------
    // RCC STEEL CALCULATION
    //
    // Steel volume =
    // Concrete volume × Steel percentage
    //
    // Steel weight =
    // Steel volume × 7850
    // -------------------------------------------------------

    let baseSteelKg = 0;

    if (usageType !== "bar") {
      const steelVolume =
        concreteVolumeM3 *
        (steelPercentage / 100);

      baseSteelKg =
        steelVolume * 7850;
    } else {
      baseSteelKg = directSteelKg;
    }

    // -------------------------------------------------------
    // WASTAGE
    // -------------------------------------------------------

    const wastagePercent =
      Number(wastage) || 0;

    const wastageKg =
      baseSteelKg *
      (wastagePercent / 100);

    const finalSteelKg =
      baseSteelKg + wastageKg;

    // -------------------------------------------------------
    // COST
    // -------------------------------------------------------

    const steelRate =
      Number(rate) || 0;

    const materialCost =
      finalSteelKg * steelRate;

    return {
      concreteVolumeM3,
      steelPercentage,
      baseSteelKg,
      wastagePercent,
      wastageKg,
      finalSteelKg,
      steelRate,
      materialCost,
    };
  }, [
    usageType,

    slabLength,
    slabWidth,
    slabThickness,
    slabLengthUnit,
    slabWidthUnit,
    slabThicknessUnit,
    slabSteelPercentage,

    beamLength,
    beamWidth,
    beamDepth,
    beamLengthUnit,
    beamWidthUnit,
    beamDepthUnit,
    beamSteelPercentage,

    columnCount,
    columnWidth,
    columnDepth,
    columnHeight,
    columnWidthUnit,
    columnDepthUnit,
    columnHeightUnit,
    columnSteelPercentage,

    footingCount,
    footingLength,
    footingWidth,
    footingThickness,
    footingLengthUnit,
    footingWidthUnit,
    footingThicknessUnit,
    footingSteelPercentage,

    barCount,
    barLength,
    barDiameter,
    barLengthUnit,
    barDiameterUnit,

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
  // USAGE NAME
  // =========================================================

  const usageNames = {
    slab: "RCC Slab Steel",
    beam: "RCC Beam Steel",
    column: "RCC Column Steel",
    footing: "Footing Steel",
    bar: "Steel Bar / Rebar",
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
            Steel Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Steel Bar / Reinforcement Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Select the type of steel usage and enter the
            required dimensions. RenovateCalc will calculate
            steel quantity, wastage and material cost.
          </p>

        </div>

        {/* =================================================
            USAGE TYPE
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Steel Usage Type
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Different RCC components require different
            calculation methods.
          </p>

          <div className="mt-6">

            <label className="block text-sm font-semibold text-gray-700">
              Select Steel Usage
            </label>

            <select
              value={usageType}
              onChange={(e) =>
                setUsageType(e.target.value)
              }
              className="mt-2 w-full rounded-lg border-2 border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >

              <option value="slab">
                RCC Slab
              </option>

              <option value="beam">
                RCC Beam
              </option>

              <option value="column">
                RCC Column
              </option>

              <option value="footing">
                Footing
              </option>

              <option value="bar">
                Steel Bar / Rebar
              </option>

            </select>

            <p className="mt-2 text-xs text-blue-600">
              Choose the RCC component or steel bar
              calculation you want to perform.
            </p>

          </div>

        </section>

        {/* =================================================
            SLAB INPUTS
        ================================================= */}

        {usageType === "slab" && (

          <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-blue-900">
              RCC Slab Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Steel is estimated from slab concrete volume
              and reinforcement percentage.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <InputWithUnit
                label="Slab Length"
                value={slabLength}
                onChange={setSlabLength}
                unit={slabLengthUnit}
                onUnitChange={setSlabLengthUnit}
                units={lengthUnits()}
                placeholder="Example: 20"
                hint="Enter the total length of the slab."
              />

              <InputWithUnit
                label="Slab Width"
                value={slabWidth}
                onChange={setSlabWidth}
                unit={slabWidthUnit}
                onUnitChange={setSlabWidthUnit}
                units={lengthUnits()}
                placeholder="Example: 10"
                hint="Enter the total width of the slab."
              />

              <InputWithUnit
                label="Slab Thickness"
                value={slabThickness}
                onChange={setSlabThickness}
                unit={slabThicknessUnit}
                onUnitChange={setSlabThicknessUnit}
                units={lengthUnits()}
                placeholder="Example: 6"
                hint="Typical slab thickness may be around 4–6 inches, depending on design."
              />

            </div>

            <div className="mt-6">

              <Input
                label="Steel Percentage"
                value={slabSteelPercentage}
                onChange={setSlabSteelPercentage}
                placeholder="Example: 1"
                hint="Enter the reinforcement percentage used for estimation."
              />

            </div>

          </section>

        )}

        {/* =================================================
            BEAM INPUTS
        ================================================= */}

        {usageType === "beam" && (

          <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-purple-900">
              RCC Beam Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Enter beam dimensions and estimated
              reinforcement percentage.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <InputWithUnit
                label="Beam Length"
                value={beamLength}
                onChange={setBeamLength}
                unit={beamLengthUnit}
                onUnitChange={setBeamLengthUnit}
                units={lengthUnits()}
                placeholder="Example: 20"
                hint="Total length of the beam."
              />

              <InputWithUnit
                label="Beam Width"
                value={beamWidth}
                onChange={setBeamWidth}
                unit={beamWidthUnit}
                onUnitChange={setBeamWidthUnit}
                units={lengthUnits()}
                placeholder="Example: 9"
                hint="Width of the beam section."
              />

              <InputWithUnit
                label="Beam Depth"
                value={beamDepth}
                onChange={setBeamDepth}
                unit={beamDepthUnit}
                onUnitChange={setBeamDepthUnit}
                units={lengthUnits()}
                placeholder="Example: 12"
                hint="Overall depth/height of the beam."
              />

            </div>

            <div className="mt-6">

              <Input
                label="Steel Percentage"
                value={beamSteelPercentage}
                onChange={setBeamSteelPercentage}
                placeholder="Example: 2"
                hint="Enter the reinforcement percentage for estimation."
              />

            </div>

          </section>

        )}

        {/* =================================================
            COLUMN INPUTS
        ================================================= */}

        {usageType === "column" && (

          <section className="mt-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-orange-900">
              RCC Column Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate steel for multiple columns using
              column dimensions and height.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-4">

              <Input
                label="Number of Columns"
                value={columnCount}
                onChange={setColumnCount}
                placeholder="Example: 8"
                hint="Enter how many columns are being constructed."
              />

              <InputWithUnit
                label="Column Width"
                value={columnWidth}
                onChange={setColumnWidth}
                unit={columnWidthUnit}
                onUnitChange={setColumnWidthUnit}
                units={lengthUnits()}
                placeholder="Example: 9"
                hint="Width of one column."
              />

              <InputWithUnit
                label="Column Depth"
                value={columnDepth}
                onChange={setColumnDepth}
                unit={columnDepthUnit}
                onUnitChange={setColumnDepthUnit}
                units={lengthUnits()}
                placeholder="Example: 12"
                hint="Depth of one column."
              />

              <InputWithUnit
                label="Column Height"
                value={columnHeight}
                onChange={setColumnHeight}
                unit={columnHeightUnit}
                onUnitChange={setColumnHeightUnit}
                units={lengthUnits()}
                placeholder="Example: 10"
                hint="Height of one column."
              />

            </div>

            <div className="mt-6">

              <Input
                label="Steel Percentage"
                value={columnSteelPercentage}
                onChange={setColumnSteelPercentage}
                placeholder="Example: 2.5"
                hint="Enter estimated reinforcement percentage."
              />

            </div>

          </section>

        )}

        {/* =================================================
            FOOTING INPUTS
        ================================================= */}

        {usageType === "footing" && (

          <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-green-900">
              Footing Dimensions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate estimated steel requirement for
              multiple footings.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-4">

              <Input
                label="Number of Footings"
                value={footingCount}
                onChange={setFootingCount}
                placeholder="Example: 8"
                hint="Enter the total number of footings."
              />

              <InputWithUnit
                label="Footing Length"
                value={footingLength}
                onChange={setFootingLength}
                unit={footingLengthUnit}
                onUnitChange={setFootingLengthUnit}
                units={lengthUnits()}
                placeholder="Example: 5"
                hint="Length of one footing."
              />

              <InputWithUnit
                label="Footing Width"
                value={footingWidth}
                onChange={setFootingWidth}
                unit={footingWidthUnit}
                onUnitChange={setFootingWidthUnit}
                units={lengthUnits()}
                placeholder="Example: 5"
                hint="Width of one footing."
              />

              <InputWithUnit
                label="Footing Thickness"
                value={footingThickness}
                onChange={setFootingThickness}
                unit={footingThicknessUnit}
                onUnitChange={setFootingThicknessUnit}
                units={lengthUnits()}
                placeholder="Example: 12"
                hint="Overall thickness of the footing."
              />

            </div>

            <div className="mt-6">

              <Input
                label="Steel Percentage"
                value={footingSteelPercentage}
                onChange={setFootingSteelPercentage}
                placeholder="Example: 1"
                hint="Enter estimated reinforcement percentage."
              />

            </div>

          </section>

        )}

        {/* =================================================
            BAR INPUTS
        ================================================= */}

        {usageType === "bar" && (

          <section className="mt-8 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

            <h3 className="text-xl font-bold text-red-900">
              Steel Bar / Rebar
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Calculate steel weight directly from the
              number, length and diameter of bars.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of Bars"
                value={barCount}
                onChange={setBarCount}
                placeholder="Example: 20"
                hint="Enter the total number of steel bars."
              />

              <InputWithUnit
                label="Bar Length"
                value={barLength}
                onChange={setBarLength}
                unit={barLengthUnit}
                onUnitChange={setBarLengthUnit}
                units={lengthUnits()}
                placeholder="Example: 12"
                hint="Enter the length of one bar."
              />

              <InputWithUnit
                label="Bar Diameter"
                value={barDiameter}
                onChange={setBarDiameter}
                unit={barDiameterUnit}
                onUnitChange={setBarDiameterUnit}
                units={diameterUnits()}
                placeholder="Example: 12"
                hint="Enter the diameter of the steel bar, commonly specified in mm."
              />

            </div>

            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">

              <p className="font-bold">
                Bar Weight Formula
              </p>

              <p className="mt-1">
                Weight = Volume × 7850 kg/m³
              </p>

              <p className="mt-1 text-xs">
                Volume is calculated from bar diameter,
                length and quantity.
              </p>

            </div>

          </section>

        )}

        {/* =================================================
            WASTAGE + RATE
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900">
            Steel Pricing & Wastage
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Enter wastage and your local steel purchase rate.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Steel Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
              hint="Extra steel allowance for cutting, bending and site wastage."
            />

            <Input
              label="Steel Rate (₹ per kg)"
              value={rate}
              onChange={setRate}
              placeholder="Example: 65"
              hint="Enter your current local steel price per kilogram."
            />

          </div>

        </section>

        {/* =================================================
            CALCULATION METHOD
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-blue-50 p-6">

          <h3 className="text-lg font-bold text-blue-900">
            Calculation Method
          </h3>

          {usageType !== "bar" && (

            <div className="mt-3 space-y-2 text-sm text-blue-900">

              <p>
                Concrete Volume = Length × Width × Height/Thickness
              </p>

              <p>
                Steel Volume = Concrete Volume × Steel %
              </p>

              <p>
                Steel Weight = Steel Volume × 7850 kg/m³
              </p>

            </div>

          )}

          {usageType === "bar" && (

            <div className="mt-3 space-y-2 text-sm text-blue-900">

              <p>
                Bar Volume = π × Radius² × Length × Quantity
              </p>

              <p>
                Steel Weight = Bar Volume × 7850 kg/m³
              </p>

            </div>

          )}

          <p className="mt-3 text-sm font-semibold text-blue-800">
            Final Steel = Base Steel + Wastage
          </p>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {usageNames[usageType]}
          </h3>

          <div className="mt-6 rounded-xl bg-gray-50 p-5">

            <div className="space-y-4">

              {usageType !== "bar" && (

                <ResultRow
                  label="Concrete Volume"
                  value={`${calculation.concreteVolumeM3.toFixed(3)} m³`}
                />

              )}

              {usageType !== "bar" && (

                <ResultRow
                  label="Steel Percentage"
                  value={`${calculation.steelPercentage.toFixed(2)} %`}
                />

              )}

              <ResultRow
                label="Steel Before Wastage"
                value={`${calculation.baseSteelKg.toFixed(2)} kg`}
              />

              <ResultRow
                label={`Steel Wastage (${wastage || 0}%)`}
                value={`+ ${calculation.wastageKg.toFixed(2)} kg`}
              />

              <div className="border-t pt-4">

                <ResultRow
                  label="Final Steel Required"
                  value={`${calculation.finalSteelKg.toFixed(2)} kg`}
                  bold
                  highlight
                />

              </div>

              <div className="border-t pt-4">

                <ResultRow
                  label="Steel Material Cost"
                  value={money(calculation.materialCost)}
                  bold
                  highlight
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
// LENGTH TO METERS
// =============================================================

function lengthToMeter(value, unit) {
  const number = Number(value) || 0;

  if (unit === "m") {
    return number;
  }

  if (unit === "ft") {
    return number * 0.3048;
  }

  if (unit === "cm") {
    return number / 100;
  }

  if (unit === "mm") {
    return number / 1000;
  }

  if (unit === "inch") {
    return number * 0.0254;
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
// DIAMETER UNITS
// =============================================================

function diameterUnits() {
  return [
    ["mm", "Millimeter"],
    ["cm", "Centimeter"],
    ["inch", "Inch"],
    ["m", "Meter"],
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
  hint,
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
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
      />

      <label className="mt-2 block text-xs font-semibold text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) =>
          onUnitChange(e.target.value)
        }
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
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

      {hint && (

        <p className="mt-2 text-xs leading-5 text-blue-600">
          💡 {hint}
        </p>

      )}

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
  hint,
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
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
      />

      {hint && (

        <p className="mt-2 text-xs leading-5 text-blue-600">
          💡 {hint}
        </p>

      )}

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
  highlight = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        highlight
          ? "rounded-lg bg-blue-50 px-4 py-3"
          : ""
      }`}
    >

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