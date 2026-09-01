import { useMemo, useState } from "react";

export default function PlumbingCalculation() {
  // =========================================================
  // PLUMBING USAGE TYPE
  // =========================================================

  const [plumbingType, setPlumbingType] = useState("water_supply");

  // =========================================================
  // GENERAL PIPE INPUTS
  // =========================================================

  const [pipeLength, setPipeLength] = useState("");
  const [pipeLengthUnit, setPipeLengthUnit] = useState("ft");

  const [pipeDiameter, setPipeDiameter] = useState("");
  const [pipeDiameterUnit, setPipeDiameterUnit] = useState("mm");

  // =========================================================
  // FIXTURES
  // =========================================================

  const [toilets, setToilets] = useState("");
  const [washBasins, setWashBasins] = useState("");
  const [showers, setShowers] = useState("");
  const [kitchenSinks, setKitchenSinks] = useState("");
  const [floorDrains, setFloorDrains] = useState("");
  const [washingMachines, setWashingMachines] = useState("");
  const [waterTaps, setWaterTaps] = useState("");

  // =========================================================
  // DRAINAGE INPUTS
  // =========================================================

  const [soilPipeLength, setSoilPipeLength] = useState("");
  const [soilPipeDiameter, setSoilPipeDiameter] = useState("110");

  const [wastePipeLength, setWastePipeLength] = useState("");
  const [wastePipeDiameter, setWastePipeDiameter] = useState("50");

  // =========================================================
  // WATER TANK
  // =========================================================

  const [tankCapacity, setTankCapacity] = useState("");
  const [tankUnit, setTankUnit] = useState("litre");

  // =========================================================
  // WATER PUMP
  // =========================================================

  const [pumpCount, setPumpCount] = useState("");
  const [pumpPower, setPumpPower] = useState("");
  const [pumpPowerUnit, setPumpPowerUnit] = useState("HP");

  // =========================================================
  // VALVES / FITTINGS
  // =========================================================

  const [valves, setValves] = useState("");
  const [fittingsPercent, setFittingsPercent] = useState("10");

  // =========================================================
  // WASTAGE / RATE
  // =========================================================

  const [wastage, setWastage] = useState("5");
  const [pipeRate, setPipeRate] = useState("");

  const [fixtureRate, setFixtureRate] = useState("");

  // =========================================================
  // CALCULATION
  // =========================================================

  const calculation = useMemo(() => {
    // -------------------------------------------------------
    // CONVERT MAIN PIPE LENGTH TO FEET
    // -------------------------------------------------------

    const mainPipeFeet = lengthToFeet(
      pipeLength,
      pipeLengthUnit
    );

    // -------------------------------------------------------
    // WATER SUPPLY PIPE
    // -------------------------------------------------------

    const fittings =
      Number(fittingsPercent) || 0;

    const pipeFittingsLength =
      mainPipeFeet *
      (fittings / 100);

    const pipeBeforeWastage =
      mainPipeFeet +
      pipeFittingsLength;

    const pipeWastagePercent =
      Number(wastage) || 0;

    const pipeWastage =
      pipeBeforeWastage *
      (pipeWastagePercent / 100);

    const finalPipeLength =
      pipeBeforeWastage +
      pipeWastage;

    // -------------------------------------------------------
    // DRAINAGE
    // -------------------------------------------------------

    const soilFeet =
      lengthToFeet(
        soilPipeLength,
        pipeLengthUnit
      );

    const wasteFeet =
      lengthToFeet(
        wastePipeLength,
        pipeLengthUnit
      );

    const totalDrainagePipe =
      soilFeet +
      wasteFeet;

    const drainageFittings =
      totalDrainagePipe *
      (fittings / 100);

    const drainageBeforeWastage =
      totalDrainagePipe +
      drainageFittings;

    const drainageWastage =
      drainageBeforeWastage *
      (pipeWastagePercent / 100);

    const finalDrainagePipe =
      drainageBeforeWastage +
      drainageWastage;

    // -------------------------------------------------------
    // FIXTURE COUNT
    // -------------------------------------------------------

    const toiletCount =
      Number(toilets) || 0;

    const basinCount =
      Number(washBasins) || 0;

    const showerCount =
      Number(showers) || 0;

    const sinkCount =
      Number(kitchenSinks) || 0;

    const floorDrainCount =
      Number(floorDrains) || 0;

    const washingMachineCount =
      Number(washingMachines) || 0;

    const tapCount =
      Number(waterTaps) || 0;

    const totalFixtures =
      toiletCount +
      basinCount +
      showerCount +
      sinkCount +
      floorDrainCount +
      washingMachineCount +
      tapCount;

    // -------------------------------------------------------
    // FIXTURE WASTAGE
    // -------------------------------------------------------

    const fixtureWastage =
      totalFixtures *
      (pipeWastagePercent / 100);

    const finalFixtureCount =
      totalFixtures +
      fixtureWastage;

    // -------------------------------------------------------
    // WATER TANK
    // -------------------------------------------------------

    const tank =
      Number(tankCapacity) || 0;

    // -------------------------------------------------------
    // PUMP
    // -------------------------------------------------------

    const pumps =
      Number(pumpCount) || 0;

    const pumpPowerValue =
      Number(pumpPower) || 0;

    // -------------------------------------------------------
    // VALVES
    // -------------------------------------------------------

    const valveCount =
      Number(valves) || 0;

    // -------------------------------------------------------
    // PIPE COST
    // -------------------------------------------------------

    const rate =
      Number(pipeRate) || 0;

    const pipeCost =
      finalPipeLength *
      rate;

    const drainageCost =
      finalDrainagePipe *
      rate;

    // -------------------------------------------------------
    // FIXTURE COST
    // -------------------------------------------------------

    const fixtureUnitRate =
      Number(fixtureRate) || 0;

    const fixtureCost =
      finalFixtureCount *
      fixtureUnitRate;

    // -------------------------------------------------------
    // TOTAL COST
    // -------------------------------------------------------

    const totalCost =
      pipeCost +
      drainageCost +
      fixtureCost;

    return {
      mainPipeFeet,

      pipeFittingsLength,

      pipeBeforeWastage,

      pipeWastage,

      finalPipeLength,

      soilFeet,
      wasteFeet,

      totalDrainagePipe,

      drainageFittings,

      drainageBeforeWastage,

      drainageWastage,

      finalDrainagePipe,

      toiletCount,
      basinCount,
      showerCount,
      sinkCount,
      floorDrainCount,
      washingMachineCount,
      tapCount,

      totalFixtures,

      fixtureWastage,

      finalFixtureCount,

      tank,

      pumps,
      pumpPowerValue,

      valveCount,

      pipeCost,
      drainageCost,
      fixtureCost,

      totalCost,
    };
  }, [
    plumbingType,

    pipeLength,
    pipeLengthUnit,

    pipeDiameter,
    pipeDiameterUnit,

    toilets,
    washBasins,
    showers,
    kitchenSinks,
    floorDrains,
    washingMachines,
    waterTaps,

    soilPipeLength,
    soilPipeDiameter,

    wastePipeLength,
    wastePipeDiameter,

    tankCapacity,
    tankUnit,

    pumpCount,
    pumpPower,
    pumpPowerUnit,

    valves,
    fittingsPercent,

    wastage,
    pipeRate,
    fixtureRate,
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
  // TYPE NAME
  // =========================================================

  const plumbingTypeName = {
    water_supply: "Water Supply Plumbing",
    drainage: "Drainage Plumbing",
    fixtures: "Plumbing Fixtures",
    complete: "Complete Plumbing",
    tank_pump: "Water Tank & Pump",
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-gray-800">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b bg-white shadow-sm">

        <div className="mx-auto max-w-6xl px-6 py-5">

          <h1 className="text-3xl font-extrabold text-blue-800">
            Renovate
            <span className="text-gray-800">
              Calc
            </span>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Smart Renovation Material Calculator
          </p>

        </div>

      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* =================================================
            TITLE
        ================================================= */}

        <div>

          <p className="text-sm font-bold uppercase tracking-widest text-cyan-600">
            Plumbing Calculator
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Plumbing Material Calculation
          </h2>

          <p className="mt-3 max-w-3xl text-gray-600">
            Select the plumbing application and RenovateCalc
            will show only the measurements and inputs required
            for that plumbing work.
          </p>

        </div>

        {/* =================================================
            PLUMBING TYPE
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              🔧
            </div>

            <div>

              <h3 className="text-xl font-bold text-gray-900">
                Plumbing Usage Type
              </h3>

              <p className="text-sm text-gray-500">
                Select what you want to calculate.
              </p>

            </div>

          </div>

          <div className="mt-6">

            <label className="block text-sm font-bold text-gray-700">
              Plumbing Type
            </label>

            <select
              value={plumbingType}
              onChange={(e) =>
                setPlumbingType(e.target.value)
              }
              className="mt-2 w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >

              <option value="water_supply">
                💧 Water Supply Plumbing
              </option>

              <option value="drainage">
                🚿 Drainage / Waste Plumbing
              </option>

              <option value="fixtures">
                🚽 Plumbing Fixtures
              </option>

              <option value="complete">
                🏠 Complete Plumbing
              </option>

              <option value="tank_pump">
                🛢️ Water Tank & Pump
              </option>

            </select>

            <p className="mt-2 text-xs font-medium text-blue-600">
              💡 Choose the application first. The required
              inputs will automatically change.
            </p>

          </div>

        </section>

        {/* =================================================
            WATER SUPPLY
        ================================================= */}

        {(plumbingType === "water_supply" ||
          plumbingType === "complete") && (

          <section className="mt-8 rounded-2xl border border-cyan-100 bg-white p-6 shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-xl text-white">
                💧
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Water Supply Pipe
                </h3>

                <p className="text-sm text-gray-500">
                  Calculate pipe requirement for fresh water
                  supply.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Pipe Length"
                value={pipeLength}
                onChange={setPipeLength}
                unit={pipeLengthUnit}
                onUnitChange={setPipeLengthUnit}
                units={lengthUnits()}
                placeholder="Example: 150"
                hint="Enter the total approximate pipe route length."
              />

              <Input
                label="Pipe Diameter"
                value={pipeDiameter}
                onChange={setPipeDiameter}
                placeholder="Example: 25"
                hint="Common water supply sizes include 15 mm, 20 mm, 25 mm and 32 mm."
              />

              <Input
                label="Fittings Allowance (%)"
                value={fittingsPercent}
                onChange={setFittingsPercent}
                placeholder="Example: 10"
                hint="Allows extra length for elbows, tees, joints and connections."
              />

              <Input
                label="Pipe Wastage (%)"
                value={wastage}
                onChange={setWastage}
                placeholder="Example: 5"
                hint="Extra material allowance for cutting and installation losses."
              />

              <Input
                label="Pipe Rate (₹ per ft)"
                value={pipeRate}
                onChange={setPipeRate}
                placeholder="Example: 35"
                hint="Enter the actual pipe purchase rate per foot."
              />

            </div>

          </section>

        )}

        {/* =================================================
            DRAINAGE
        ================================================= */}

        {(plumbingType === "drainage" ||
          plumbingType === "complete") && (

          <section className="mt-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
                🚿
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Drainage Pipes
                </h3>

                <p className="text-sm text-gray-500">
                  Calculate soil and waste pipe requirements.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Soil Pipe Length"
                value={soilPipeLength}
                onChange={setSoilPipeLength}
                placeholder="Example: 60"
                hint="Used for toilet discharge and soil waste lines."
              />

              <Input
                label="Soil Pipe Diameter (mm)"
                value={soilPipeDiameter}
                onChange={setSoilPipeDiameter}
                placeholder="Example: 110"
                hint="110 mm is commonly used for main soil/drain lines."
              />

              <Input
                label="Waste Pipe Length"
                value={wastePipeLength}
                onChange={setWastePipeLength}
                placeholder="Example: 80"
                hint="Used for wash basin, shower, sink and other wastewater."
              />

              <Input
                label="Waste Pipe Diameter (mm)"
                value={wastePipeDiameter}
                onChange={setWastePipeDiameter}
                placeholder="Example: 50"
                hint="50 mm is commonly used for smaller waste connections."
              />

              <Input
                label="Fittings Allowance (%)"
                value={fittingsPercent}
                onChange={setFittingsPercent}
                placeholder="Example: 10"
                hint="Extra allowance for bends, tees, sockets and joints."
              />

              <Input
                label="Pipe Wastage (%)"
                value={wastage}
                onChange={setWastage}
                placeholder="Example: 5"
                hint="Accounts for cutting and installation wastage."
              />

              <Input
                label="Pipe Rate (₹ per ft)"
                value={pipeRate}
                onChange={setPipeRate}
                placeholder="Example: 45"
                hint="Enter your actual drainage pipe rate."
              />

            </div>

          </section>

        )}

        {/* =================================================
            FIXTURES
        ================================================= */}

        {(plumbingType === "fixtures" ||
          plumbingType === "complete") && (

          <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-xl text-white">
                🚽
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Plumbing Fixtures
                </h3>

                <p className="text-sm text-gray-500">
                  Enter the number of fixtures required.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Toilets / WC"
                value={toilets}
                onChange={setToilets}
                placeholder="Example: 2"
                hint="Enter the total number of toilets/WCs."
              />

              <Input
                label="Wash Basins"
                value={washBasins}
                onChange={setWashBasins}
                placeholder="Example: 2"
                hint="Enter the number of wash basins."
              />

              <Input
                label="Showers"
                value={showers}
                onChange={setShowers}
                placeholder="Example: 2"
                hint="Enter the number of shower points."
              />

              <Input
                label="Kitchen Sinks"
                value={kitchenSinks}
                onChange={setKitchenSinks}
                placeholder="Example: 1"
                hint="Enter the number of kitchen sinks."
              />

              <Input
                label="Floor Drains"
                value={floorDrains}
                onChange={setFloorDrains}
                placeholder="Example: 3"
                hint="Enter floor drain points for bathrooms and utility areas."
              />

              <Input
                label="Washing Machine Points"
                value={washingMachines}
                onChange={setWashingMachines}
                placeholder="Example: 1"
                hint="Enter the number of washing machine plumbing points."
              />

              <Input
                label="Water Taps"
                value={waterTaps}
                onChange={setWaterTaps}
                placeholder="Example: 6"
                hint="Include individual water tap points."
              />

              <Input
                label="Fixture Rate (₹ per unit)"
                value={fixtureRate}
                onChange={setFixtureRate}
                placeholder="Example: 500"
                hint="Use this if you want a basic average fixture installation/material rate."
              />

            </div>

          </section>

        )}

        {/* =================================================
            WATER TANK & PUMP
        ================================================= */}

        {(plumbingType === "tank_pump" ||
          plumbingType === "complete") && (

          <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
                🛢️
              </div>

              <div>

                <h3 className="text-xl font-bold text-gray-900">
                  Water Tank & Pump
                </h3>

                <p className="text-sm text-gray-500">
                  Enter storage and pumping requirements.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <InputWithUnit
                label="Water Tank Capacity"
                value={tankCapacity}
                onChange={setTankCapacity}
                unit={tankUnit}
                onUnitChange={setTankUnit}
                units={[
                  ["litre", "Litres"],
                  ["kl", "Kilolitres"],
                ]}
                placeholder="Example: 2000"
                hint="Enter the storage capacity of the overhead/underground tank."
              />

              <Input
                label="Number of Pumps"
                value={pumpCount}
                onChange={setPumpCount}
                placeholder="Example: 1"
                hint="Enter the number of water pumps required."
              />

              <Input
                label="Pump Power"
                value={pumpPower}
                onChange={setPumpPower}
                placeholder="Example: 1"
                hint="Enter the pump motor power. Selection can be HP or kW."
              />

              <div>

                <label className="block text-sm font-bold text-gray-700">
                  Pump Power Unit
                </label>

                <select
                  value={pumpPowerUnit}
                  onChange={(e) =>
                    setPumpPowerUnit(e.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >

                  <option value="HP">
                    Horsepower (HP)
                  </option>

                  <option value="kW">
                    Kilowatt (kW)
                  </option>

                </select>

                <p className="mt-2 text-xs text-gray-500">
                  💡 Select the unit shown on the pump/motor specification.
                </p>

              </div>

              <Input
                label="Number of Valves"
                value={valves}
                onChange={setValves}
                placeholder="Example: 8"
                hint="Include isolation, control and other required valves."
              />

            </div>

          </section>

        )}

        {/* =================================================
            CALCULATION METHOD
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">

          <h3 className="text-xl font-bold text-blue-900">
            📐 Calculation Method
          </h3>

          <div className="mt-4 space-y-3 text-sm text-blue-900">

            {(plumbingType === "water_supply" ||
              plumbingType === "complete") && (
              <>
                <p>
                  <strong>Pipe + Fittings:</strong>{" "}
                  Pipe Length × (1 + Fittings %)
                </p>

                <p>
                  <strong>Final Pipe:</strong>{" "}
                  Pipe + Fittings + Wastage
                </p>
              </>
            )}

            {(plumbingType === "drainage" ||
              plumbingType === "complete") && (
              <>
                <p>
                  <strong>Drainage Pipe:</strong>{" "}
                  Soil Pipe + Waste Pipe
                </p>

                <p>
                  Fittings and wastage are added separately.
                </p>
              </>
            )}

            {(plumbingType === "fixtures" ||
              plumbingType === "complete") && (
              <p>
                <strong>Total Fixtures:</strong>{" "}
                Toilets + Basins + Showers + Sinks +
                Floor Drains + Washing Machine Points +
                Taps
              </p>
            )}

            <p>
              <strong>Cost:</strong>{" "}
              Final Quantity × Rate
            </p>

          </div>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-xl">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-xl text-white">
              📊
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Calculation Result
              </p>

              <h3 className="text-2xl font-extrabold text-gray-900">
                {plumbingTypeName[plumbingType]}
              </h3>

            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-5">

            <div className="space-y-4">

              {/* =================================================
                  WATER SUPPLY RESULTS
              ================================================= */}

              {(plumbingType === "water_supply" ||
                plumbingType === "complete") && (

                <>

                  <ResultRow
                    label="Main Pipe Length"
                    value={`${calculation.mainPipeFeet.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Fittings Allowance"
                    value={`+ ${calculation.pipeFittingsLength.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Pipe Before Wastage"
                    value={`${calculation.pipeBeforeWastage.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label={`Pipe Wastage (${wastage || 0}%)`}
                    value={`+ ${calculation.pipeWastage.toFixed(2)} ft`}
                  />

                  <div className="rounded-xl bg-cyan-100 p-4">

                    <ResultRow
                      label="Final Water Supply Pipe"
                      value={`${calculation.finalPipeLength.toFixed(2)} ft`}
                      bold
                    />

                  </div>

                </>

              )}

              {/* =================================================
                  DRAINAGE RESULTS
              ================================================= */}

              {(plumbingType === "drainage" ||
                plumbingType === "complete") && (

                <>

                  <ResultRow
                    label="Soil Pipe"
                    value={`${calculation.soilFeet.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Waste Pipe"
                    value={`${calculation.wasteFeet.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Total Drainage Pipe"
                    value={`${calculation.totalDrainagePipe.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Drainage Fittings"
                    value={`+ ${calculation.drainageFittings.toFixed(2)} ft`}
                  />

                  <ResultRow
                    label="Drainage Wastage"
                    value={`+ ${calculation.drainageWastage.toFixed(2)} ft`}
                  />

                  <div className="rounded-xl bg-orange-100 p-4">

                    <ResultRow
                      label="Final Drainage Pipe"
                      value={`${calculation.finalDrainagePipe.toFixed(2)} ft`}
                      bold
                    />

                  </div>

                </>

              )}

              {/* =================================================
                  FIXTURE RESULTS
              ================================================= */}

              {(plumbingType === "fixtures" ||
                plumbingType === "complete") && (

                <>

                  <ResultRow
                    label="Toilets / WC"
                    value={`${calculation.toiletCount}`}
                  />

                  <ResultRow
                    label="Wash Basins"
                    value={`${calculation.basinCount}`}
                  />

                  <ResultRow
                    label="Showers"
                    value={`${calculation.showerCount}`}
                  />

                  <ResultRow
                    label="Kitchen Sinks"
                    value={`${calculation.sinkCount}`}
                  />

                  <ResultRow
                    label="Floor Drains"
                    value={`${calculation.floorDrainCount}`}
                  />

                  <ResultRow
                    label="Washing Machine Points"
                    value={`${calculation.washingMachineCount}`}
                  />

                  <ResultRow
                    label="Water Taps"
                    value={`${calculation.tapCount}`}
                  />

                  <ResultRow
                    label="Total Fixtures"
                    value={`${calculation.totalFixtures}`}
                    bold
                  />

                  <ResultRow
                    label={`Fixture Wastage (${wastage || 0}%)`}
                    value={`+ ${calculation.fixtureWastage.toFixed(2)}`}
                  />

                  <div className="rounded-xl bg-purple-100 p-4">

                    <ResultRow
                      label="Final Fixture Quantity"
                      value={`${calculation.finalFixtureCount.toFixed(2)} units`}
                      bold
                    />

                  </div>

                </>

              )}

              {/* =================================================
                  TANK & PUMP RESULTS
              ================================================= */}

              {(plumbingType === "tank_pump" ||
                plumbingType === "complete") && (

                <>

                  <ResultRow
                    label="Water Tank Capacity"
                    value={`${calculation.tank.toFixed(0)} ${tankUnit === "kl" ? "kL" : "litres"}`}
                  />

                  <ResultRow
                    label="Number of Pumps"
                    value={`${calculation.pumps}`}
                  />

                  <ResultRow
                    label="Pump Power"
                    value={`${calculation.pumpPowerValue} ${pumpPowerUnit}`}
                  />

                  <ResultRow
                    label="Number of Valves"
                    value={`${calculation.valveCount}`}
                  />

                </>

              )}

              {/* =================================================
                  COST
              ================================================= */}

              <div className="border-t pt-5">

                {(plumbingType === "water_supply" ||
                  plumbingType === "complete") && (

                  <ResultRow
                    label="Water Supply Pipe Cost"
                    value={money(calculation.pipeCost)}
                  />

                )}

                {(plumbingType === "drainage" ||
                  plumbingType === "complete") && (

                  <ResultRow
                    label="Drainage Pipe Cost"
                    value={money(calculation.drainageCost)}
                  />

                )}

                {(plumbingType === "fixtures" ||
                  plumbingType === "complete") && (

                  <ResultRow
                    label="Fixture Cost"
                    value={money(calculation.fixtureCost)}
                  />

                )}

              </div>

              <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-5 text-white">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-lg font-bold">
                    Estimated Material Cost
                  </span>

                  <span className="text-2xl font-extrabold">
                    {money(calculation.totalCost)}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-16 bg-blue-950 px-6 py-8 text-center text-blue-100">

        <p className="text-xl font-extrabold">
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
  hint,
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
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />

      <label className="mt-2 block text-xs font-bold text-gray-500">
        Unit
      </label>

      <select
        value={unit}
        onChange={(e) =>
          onUnitChange(e.target.value)
        }
        className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
        <p className="mt-2 text-xs leading-5 text-gray-500">
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
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />

      {hint && (
        <p className="mt-2 text-xs leading-5 text-gray-500">
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
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span
        className={
          bold
            ? "font-extrabold text-gray-900"
            : "text-gray-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-extrabold text-gray-900"
            : "font-semibold text-gray-800"
        }
      >
        {value}
      </span>

    </div>
  );
}