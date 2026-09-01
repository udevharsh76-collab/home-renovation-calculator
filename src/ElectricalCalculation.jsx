import { useMemo, useState } from "react";

export default function ElectricalCalculation() {
  // =========================================================
  // ELECTRICAL USAGE TYPE
  // =========================================================

  const [usageType, setUsageType] = useState("complete");

  // =========================================================
  // BASIC ELECTRICAL SETTINGS
  // =========================================================

  const [voltage, setVoltage] = useState("230");
  const [phase, setPhase] = useState("single");
  const [powerFactor, setPowerFactor] = useState("0.85");

  // =========================================================
  // LIGHTS
  // =========================================================

  const [lightCount, setLightCount] = useState("");
  const [lightWatt, setLightWatt] = useState("12");

  // =========================================================
  // FANS
  // =========================================================

  const [fanCount, setFanCount] = useState("");
  const [fanWatt, setFanWatt] = useState("75");

  // =========================================================
  // SOCKETS
  // =========================================================

  const [socketCount, setSocketCount] = useState("");
  const [socketWatt, setSocketWatt] = useState("1000");
  const [socketType, setSocketType] = useState("6A");

  // =========================================================
  // AC
  // =========================================================

  const [acCount, setAcCount] = useState("");
  const [acWatt, setAcWatt] = useState("1500");
  const [acTon, setAcTon] = useState("1.5");

  // =========================================================
  // GEYSER
  // =========================================================

  const [geyserCount, setGeyserCount] = useState("");
  const [geyserWatt, setGeyserWatt] = useState("2000");

  // =========================================================
  // REFRIGERATOR
  // =========================================================

  const [fridgeCount, setFridgeCount] = useState("");
  const [fridgeWatt, setFridgeWatt] = useState("250");

  // =========================================================
  // WASHING MACHINE
  // =========================================================

  const [washingCount, setWashingCount] = useState("");
  const [washingWatt, setWashingWatt] = useState("500");

  // =========================================================
  // MOTOR / WATER PUMP
  // =========================================================

  const [motorCount, setMotorCount] = useState("");
  const [motorHP, setMotorHP] = useState("1");

  // =========================================================
  // OTHER LOAD
  // =========================================================

  const [otherCount, setOtherCount] = useState("");
  const [otherWatt, setOtherWatt] = useState("");

  // =========================================================
  // WIRE SETTINGS
  // =========================================================

  const [wireType, setWireType] = useState("FR");
  const [wireLength, setWireLength] = useState("");
  const [wireSize, setWireSize] = useState("2.5");
  const [wireRate, setWireRate] = useState("");

  // =========================================================
  // MCB SETTINGS
  // =========================================================

  const [mcbType, setMcbType] = useState("SP");
  const [mcbRating, setMcbRating] = useState("16");
  const [mcbCount, setMcbCount] = useState("");
  const [mcbRate, setMcbRate] = useState("");

  // =========================================================
  // ACCESSORIES / POINT COST
  // =========================================================

  const [switchCount, setSwitchCount] = useState("");
  const [switchRate, setSwitchRate] = useState("");

  const [socketUnitCount, setSocketUnitCount] = useState("");
  const [socketUnitRate, setSocketUnitRate] = useState("");

  // =========================================================
  // WASTAGE
  // =========================================================

  const [wastage, setWastage] = useState("5");

  // =========================================================
  // USAGE TYPE NAME
  // =========================================================

  const usageTypeNames = {
    complete: "Complete House Electrical",
    lighting: "Lighting",
    fan: "Fans",
    socket: "Sockets",
    ac: "Air Conditioner",
    geyser: "Geyser",
    motor: "Water Pump / Motor",
    appliances: "Home Appliances",
  };

  // =========================================================
  // CALCULATION
  // =========================================================

  const calculation = useMemo(() => {
    // -------------------------------------------------------
    // COUNTS
    // -------------------------------------------------------

    const lights = Number(lightCount) || 0;
    const fans = Number(fanCount) || 0;
    const sockets = Number(socketCount) || 0;
    const acs = Number(acCount) || 0;
    const geysers = Number(geyserCount) || 0;
    const fridges = Number(fridgeCount) || 0;
    const washingMachines = Number(washingCount) || 0;
    const motors = Number(motorCount) || 0;
    const others = Number(otherCount) || 0;

    // -------------------------------------------------------
    // WATTAGE
    // -------------------------------------------------------

    const lightPower =
      lights * (Number(lightWatt) || 0);

    const fanPower =
      fans * (Number(fanWatt) || 0);

    const socketPower =
      sockets * (Number(socketWatt) || 0);

    const acPower =
      acs * (Number(acWatt) || 0);

    const geyserPower =
      geysers * (Number(geyserWatt) || 0);

    const refrigeratorPower =
      fridges * (Number(fridgeWatt) || 0);

    const washingMachinePower =
      washingMachines * (Number(washingWatt) || 0);

    // -------------------------------------------------------
    // MOTOR HP TO WATTS
    //
    // 1 HP = 746 watts
    // -------------------------------------------------------

    const motorPower =
      motors *
      (Number(motorHP) || 0) *
      746;

    const otherPower =
      others *
      (Number(otherWatt) || 0);

    // -------------------------------------------------------
    // SELECT LOAD ACCORDING TO USAGE TYPE
    // -------------------------------------------------------

    let selectedLoad = 0;

    if (usageType === "complete") {
      selectedLoad =
        lightPower +
        fanPower +
        socketPower +
        acPower +
        geyserPower +
        refrigeratorPower +
        washingMachinePower +
        motorPower +
        otherPower;
    }

    if (usageType === "lighting") {
      selectedLoad = lightPower;
    }

    if (usageType === "fan") {
      selectedLoad = fanPower;
    }

    if (usageType === "socket") {
      selectedLoad = socketPower;
    }

    if (usageType === "ac") {
      selectedLoad = acPower;
    }

    if (usageType === "geyser") {
      selectedLoad = geyserPower;
    }

    if (usageType === "motor") {
      selectedLoad = motorPower;
    }

    if (usageType === "appliances") {
      selectedLoad =
        refrigeratorPower +
        washingMachinePower +
        otherPower;
    }

    // -------------------------------------------------------
    // POWER FACTOR
    // -------------------------------------------------------

    const pf =
      Number(powerFactor) || 1;

    // -------------------------------------------------------
    // CURRENT
    //
    // Single phase:
    //
    // I = P / (V × PF)
    //
    // Three phase:
    //
    // I = P / (√3 × V × PF)
    // -------------------------------------------------------

    const V =
      Number(voltage) || 230;

    let current = 0;

    if (phase === "single") {
      current =
        selectedLoad /
        (V * pf);
    } else {
      current =
        selectedLoad /
        (Math.sqrt(3) * V * pf);
    }

    // -------------------------------------------------------
    // RECOMMENDED MCB
    // -------------------------------------------------------

    let recommendedMCB = 6;

    if (current <= 6) {
      recommendedMCB = 6;
    } else if (current <= 10) {
      recommendedMCB = 10;
    } else if (current <= 16) {
      recommendedMCB = 16;
    } else if (current <= 20) {
      recommendedMCB = 20;
    } else if (current <= 25) {
      recommendedMCB = 25;
    } else if (current <= 32) {
      recommendedMCB = 32;
    } else if (current <= 40) {
      recommendedMCB = 40;
    } else if (current <= 50) {
      recommendedMCB = 50;
    } else if (current <= 63) {
      recommendedMCB = 63;
    } else {
      recommendedMCB = 80;
    }

    // -------------------------------------------------------
    // RECOMMENDED WIRE SIZE
    // Approximate copper cable selection
    // -------------------------------------------------------

    let recommendedWire = "1.5";

    if (current <= 10) {
      recommendedWire = "1.5";
    } else if (current <= 16) {
      recommendedWire = "2.5";
    } else if (current <= 25) {
      recommendedWire = "4";
    } else if (current <= 32) {
      recommendedWire = "6";
    } else if (current <= 40) {
      recommendedWire = "10";
    } else if (current <= 50) {
      recommendedWire = "16";
    } else if (current <= 63) {
      recommendedWire = "25";
    } else {
      recommendedWire = "35";
    }

    // -------------------------------------------------------
    // WASTAGE
    // -------------------------------------------------------

    const wastagePercent =
      Number(wastage) || 0;

    const loadAfterWastage =
      selectedLoad *
      (1 + wastagePercent / 100);

    // -------------------------------------------------------
    // WIRE COST
    // -------------------------------------------------------

    const wireMeters =
      Number(wireLength) || 0;

    const wireCost =
      wireMeters *
      (Number(wireRate) || 0);

    // -------------------------------------------------------
    // MCB COST
    // -------------------------------------------------------

    const mcbUnits =
      Number(mcbCount) || 0;

    const mcbCost =
      mcbUnits *
      (Number(mcbRate) || 0);

    // -------------------------------------------------------
    // SWITCH COST
    // -------------------------------------------------------

    const switches =
      Number(switchCount) || 0;

    const switchCost =
      switches *
      (Number(switchRate) || 0);

    // -------------------------------------------------------
    // SOCKET COST
    // -------------------------------------------------------

    const socketUnits =
      Number(socketUnitCount) || 0;

    const socketAccessoryCost =
      socketUnits *
      (Number(socketUnitRate) || 0);

    // -------------------------------------------------------
    // TOTAL MATERIAL COST
    // -------------------------------------------------------

    const materialCost =
      wireCost +
      mcbCost +
      switchCost +
      socketAccessoryCost;

    return {
      lights,
      fans,
      sockets,
      acs,
      geysers,
      fridges,
      washingMachines,
      motors,
      others,

      lightPower,
      fanPower,
      socketPower,
      acPower,
      geyserPower,
      refrigeratorPower,
      washingMachinePower,
      motorPower,
      otherPower,

      selectedLoad,
      loadAfterWastage,

      current,

      recommendedMCB,
      recommendedWire,

      wireMeters,
      wireCost,

      mcbUnits,
      mcbCost,

      switchCost,
      socketAccessoryCost,

      materialCost,
    };
  }, [
    usageType,

    voltage,
    phase,
    powerFactor,

    lightCount,
    lightWatt,

    fanCount,
    fanWatt,

    socketCount,
    socketWatt,
    socketType,

    acCount,
    acWatt,
    acTon,

    geyserCount,
    geyserWatt,

    fridgeCount,
    fridgeWatt,

    washingCount,
    washingWatt,

    motorCount,
    motorHP,

    otherCount,
    otherWatt,

    wireType,
    wireLength,
    wireSize,
    wireRate,

    mcbType,
    mcbRating,
    mcbCount,
    mcbRate,

    switchCount,
    switchRate,

    socketUnitCount,
    socketUnitRate,

    wastage,
  ]);

  // =========================================================
  // MONEY
  // =========================================================

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

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
            Smart Electrical Material Calculator
          </p>

        </div>

      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* =================================================
            TITLE
        ================================================= */}

        <div>

          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Electrical Calculator
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Electrical Load & Material Calculation
          </h2>

          <p className="mt-3 text-gray-600">
            Calculate electrical load, current, wire size,
            MCB requirement and material cost.
          </p>

        </div>

        {/* =================================================
            USAGE TYPE
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">

          <h3 className="text-xl font-bold text-gray-900">
            Electrical Usage Type
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Choose what type of electrical installation you
            want to calculate.
          </p>

          <select
            value={usageType}
            onChange={(e) =>
              setUsageType(e.target.value)
            }
            className="mt-5 w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >

            <option value="complete">
              Complete House Electrical
            </option>

            <option value="lighting">
              Lighting
            </option>

            <option value="fan">
              Fans
            </option>

            <option value="socket">
              Sockets
            </option>

            <option value="ac">
              Air Conditioner
            </option>

            <option value="geyser">
              Geyser
            </option>

            <option value="motor">
              Water Pump / Motor
            </option>

            <option value="appliances">
              Home Appliances
            </option>

          </select>

          <p className="mt-2 text-xs text-blue-600">
            Currently calculating:{" "}
            <strong>
              {usageTypeNames[usageType]}
            </strong>
          </p>

        </section>

        {/* =================================================
            BASIC ELECTRICAL SETTINGS
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-md">

          <h3 className="text-xl font-bold text-gray-900">
            Electrical Supply
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <Input
              label="Supply Voltage"
              value={voltage}
              onChange={setVoltage}
              placeholder="Example: 230"
              hint="Normal domestic supply in India is commonly around 230V."
            />

            <SelectInput
              label="Phase"
              value={phase}
              onChange={setPhase}
              options={[
                ["single", "Single Phase"],
                ["three", "Three Phase"],
              ]}
              hint="Single phase is common for homes; three phase is used for higher loads."
            />

            <Input
              label="Power Factor"
              value={powerFactor}
              onChange={setPowerFactor}
              placeholder="Example: 0.85"
              hint="Used to estimate current for motors and appliances."
            />

          </div>

        </section>

        {/* =================================================
            LIGHTS
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "lighting") && (

          <section className="mt-8 rounded-2xl border border-yellow-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-yellow-700">
              💡 Lighting Load
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Number of Light Points"
                value={lightCount}
                onChange={setLightCount}
                placeholder="Example: 12"
                hint="Enter the total number of light points."
              />

              <Input
                label="Wattage per Light (W)"
                value={lightWatt}
                onChange={setLightWatt}
                placeholder="Example: 12"
                hint="Typical LED light may be around 9W–15W."
              />

            </div>

          </section>

        )}

        {/* =================================================
            FANS
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "fan") && (

          <section className="mt-8 rounded-2xl border border-green-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-green-700">
              🌀 Fan Load
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Number of Fans"
                value={fanCount}
                onChange={setFanCount}
                placeholder="Example: 5"
                hint="Enter the number of ceiling or exhaust fans."
              />

              <Input
                label="Fan Wattage (W)"
                value={fanWatt}
                onChange={setFanWatt}
                placeholder="Example: 75"
                hint="Check the fan nameplate for actual wattage."
              />

            </div>

          </section>

        )}

        {/* =================================================
            SOCKETS
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "socket") && (

          <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-purple-700">
              🔌 Socket Load
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of Sockets"
                value={socketCount}
                onChange={setSocketCount}
                placeholder="Example: 10"
                hint="Enter the number of socket points."
              />

              <SelectInput
                label="Socket Type"
                value={socketType}
                onChange={setSocketType}
                options={[
                  ["6A", "6A Socket"],
                  ["16A", "16A Heavy Socket"],
                ]}
                hint="6A is commonly used for normal appliances; 16A is for higher-load appliances."
              />

              <Input
                label="Design Load per Socket (W)"
                value={socketWatt}
                onChange={setSocketWatt}
                placeholder="Example: 1000"
                hint="This is an estimated design load, not necessarily actual consumption."
              />

            </div>

          </section>

        )}

        {/* =================================================
            AC
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "ac") && (

          <section className="mt-8 rounded-2xl border border-cyan-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-cyan-700">
              ❄️ Air Conditioner
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <Input
                label="Number of AC Units"
                value={acCount}
                onChange={setAcCount}
                placeholder="Example: 2"
                hint="Enter the number of AC units."
              />

              <Input
                label="AC Capacity (Ton)"
                value={acTon}
                onChange={setAcTon}
                placeholder="Example: 1.5"
                hint="Common residential AC sizes are 1 ton, 1.5 ton and 2 ton."
              />

              <Input
                label="AC Electrical Load (W)"
                value={acWatt}
                onChange={setAcWatt}
                placeholder="Example: 1500"
                hint="Use the rated input power from the AC specification plate."
              />

            </div>

          </section>

        )}

        {/* =================================================
            GEYSER
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "geyser") && (

          <section className="mt-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-orange-700">
              🚿 Geyser
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Number of Geysers"
                value={geyserCount}
                onChange={setGeyserCount}
                placeholder="Example: 2"
                hint="Enter the number of geysers."
              />

              <Input
                label="Geyser Load (W)"
                value={geyserWatt}
                onChange={setGeyserWatt}
                placeholder="Example: 2000"
                hint="Many domestic geysers are around 1500W–2500W."
              />

            </div>

          </section>

        )}

        {/* =================================================
            APPLIANCES
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "appliances") && (

          <section className="mt-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-pink-700">
              🏠 Home Appliances
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Refrigerator Quantity"
                value={fridgeCount}
                onChange={setFridgeCount}
                placeholder="Example: 1"
                hint="Enter refrigerator quantity."
              />

              <Input
                label="Refrigerator Load (W)"
                value={fridgeWatt}
                onChange={setFridgeWatt}
                placeholder="Example: 250"
                hint="Use the rated input wattage where available."
              />

              <Input
                label="Washing Machine Quantity"
                value={washingCount}
                onChange={setWashingCount}
                placeholder="Example: 1"
                hint="Enter washing machine quantity."
              />

              <Input
                label="Washing Machine Load (W)"
                value={washingWatt}
                onChange={setWashingWatt}
                placeholder="Example: 500"
                hint="Check the machine nameplate for rated input."
              />

              <Input
                label="Other Appliance Quantity"
                value={otherCount}
                onChange={setOtherCount}
                placeholder="Example: 2"
                hint="Use this for appliances not listed above."
              />

              <Input
                label="Other Appliance Load (W)"
                value={otherWatt}
                onChange={setOtherWatt}
                placeholder="Example: 300"
                hint="Enter the wattage of each appliance."
              />

            </div>

          </section>

        )}

        {/* =================================================
            MOTOR
        ================================================= */}

        {(usageType === "complete" ||
          usageType === "motor") && (

          <section className="mt-8 rounded-2xl border border-red-100 bg-white p-6 shadow-md">

            <h3 className="text-xl font-bold text-red-700">
              ⚙️ Water Pump / Motor
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <Input
                label="Number of Motors"
                value={motorCount}
                onChange={setMotorCount}
                placeholder="Example: 1"
                hint="Enter the number of pumps or motors."
              />

              <Input
                label="Motor Rating (HP)"
                value={motorHP}
                onChange={setMotorHP}
                placeholder="Example: 1"
                hint="Common domestic pumps may be 0.5 HP, 1 HP or 1.5 HP."
              />

            </div>

            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              <strong>Motor calculation:</strong> 1 HP =
              approximately 746 watts for basic load estimation.
            </div>

          </section>

        )}

        {/* =================================================
            WIRE
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-md">

          <h3 className="text-xl font-bold text-blue-700">
            🔵 Wire Details
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <SelectInput
              label="Wire Type"
              value={wireType}
              onChange={setWireType}
              options={[
                ["FR", "FR PVC Wire"],
                ["FRLS", "FRLS Wire"],
                ["HRFR", "HRFR Wire"],
              ]}
              hint="Select the insulation/fire-retardant type required for your installation."
            />

            <SelectInput
              label="Wire Size (mm²)"
              value={wireSize}
              onChange={setWireSize}
              options={[
                ["1.0", "1.0 mm²"],
                ["1.5", "1.5 mm²"],
                ["2.5", "2.5 mm²"],
                ["4", "4 mm²"],
                ["6", "6 mm²"],
                ["10", "10 mm²"],
                ["16", "16 mm²"],
                ["25", "25 mm²"],
                ["35", "35 mm²"],
              ]}
              hint="Select the conductor cross-sectional area."
            />

            <Input
              label="Wire Length (meters)"
              value={wireLength}
              onChange={setWireLength}
              placeholder="Example: 250"
              hint="Enter the estimated total wire length."
            />

            <Input
              label="Wire Rate (₹ per meter)"
              value={wireRate}
              onChange={setWireRate}
              placeholder="Example: 12"
              hint="Enter the current purchase rate per meter."
            />

          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-5">

            <p className="font-bold text-blue-900">
              Recommended Wire
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {calculation.recommendedWire} mm²
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Based on estimated calculated current. Final cable
              selection should consider installation method,
              cable length, voltage drop and applicable electrical
              standards.
            </p>

          </div>

        </section>

        {/* =================================================
            MCB
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-md">

          <h3 className="text-xl font-bold text-indigo-700">
            🛡️ MCB Details
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <SelectInput
              label="MCB Type"
              value={mcbType}
              onChange={setMcbType}
              options={[
                ["SP", "SP - Single Pole"],
                ["DP", "DP - Double Pole"],
                ["TP", "TP - Triple Pole"],
                ["TPN", "TPN - Three Pole + Neutral"],
              ]}
              hint="Choose according to the circuit and supply arrangement."
            />

            <SelectInput
              label="MCB Rating (A)"
              value={mcbRating}
              onChange={setMcbRating}
              options={[
                ["6", "6A"],
                ["10", "10A"],
                ["16", "16A"],
                ["20", "20A"],
                ["25", "25A"],
                ["32", "32A"],
                ["40", "40A"],
                ["50", "50A"],
                ["63", "63A"],
              ]}
              hint="Select the actual MCB rating you plan to install."
            />

            <Input
              label="Number of MCBs"
              value={mcbCount}
              onChange={setMcbCount}
              placeholder="Example: 8"
              hint="Enter the number of MCB units required."
            />

            <Input
              label="MCB Rate (₹ per unit)"
              value={mcbRate}
              onChange={setMcbRate}
              placeholder="Example: 250"
              hint="Enter the purchase price per MCB."
            />

          </div>

          <div className="mt-5 rounded-xl bg-indigo-50 p-5">

            <p className="font-bold text-indigo-900">
              Calculated Recommended MCB
            </p>

            <p className="mt-1 text-2xl font-bold text-indigo-700">
              {calculation.recommendedMCB}A
            </p>

            <p className="mt-1 text-xs text-indigo-700">
              This is an estimation from calculated load current.
              Circuit-specific protection must be selected by a
              qualified electrician.
            </p>

          </div>

        </section>

        {/* =================================================
            ACCESSORIES
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-md">

          <h3 className="text-xl font-bold text-gray-900">
            Switch & Socket Accessories
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <Input
              label="Switch Quantity"
              value={switchCount}
              onChange={setSwitchCount}
              placeholder="Example: 20"
              hint="Enter total switch quantity."
            />

            <Input
              label="Switch Rate (₹ per unit)"
              value={switchRate}
              onChange={setSwitchRate}
              placeholder="Example: 50"
              hint="Enter price per switch."
            />

            <Input
              label="Socket Accessories Quantity"
              value={socketUnitCount}
              onChange={setSocketUnitCount}
              placeholder="Example: 10"
              hint="Enter socket/accessory units for costing."
            />

            <Input
              label="Socket Accessory Rate (₹ per unit)"
              value={socketUnitRate}
              onChange={setSocketUnitRate}
              placeholder="Example: 120"
              hint="Enter price per socket/accessory unit."
            />

            <Input
              label="Electrical Wastage (%)"
              value={wastage}
              onChange={setWastage}
              placeholder="Example: 5"
              hint="Common estimation allowance can be entered here."
            />

          </div>

        </section>

        {/* =================================================
            CALCULATION METHOD
        ================================================= */}

        <section className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">

          <h3 className="text-xl font-bold text-green-900">
            Calculation Method
          </h3>

          <div className="mt-4 space-y-2 text-sm text-green-900">

            <p>
              <strong>Total Load:</strong>{" "}
              Sum of selected appliance loads.
            </p>

            <p>
              <strong>Single Phase Current:</strong>{" "}
              I = P ÷ (V × Power Factor)
            </p>

            <p>
              <strong>Three Phase Current:</strong>{" "}
              I = P ÷ (√3 × V × Power Factor)
            </p>

            <p>
              <strong>Motor:</strong>{" "}
              HP × 746 = approximate watts.
            </p>

            <p>
              <strong>Wastage Load:</strong>{" "}
              Load × (1 + Wastage ÷ 100)
            </p>

          </div>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-xl">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Calculation Result
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {usageTypeNames[usageType]}
          </h3>

          <div className="mt-6 space-y-4 rounded-xl bg-gray-50 p-5">

            <ResultRow
              label="Lighting Load"
              value={`${calculation.lightPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Fan Load"
              value={`${calculation.fanPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Socket Load"
              value={`${calculation.socketPower.toFixed(2)} W`}
            />

            <ResultRow
              label="AC Load"
              value={`${calculation.acPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Geyser Load"
              value={`${calculation.geyserPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Refrigerator Load"
              value={`${calculation.refrigeratorPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Washing Machine Load"
              value={`${calculation.washingMachinePower.toFixed(2)} W`}
            />

            <ResultRow
              label="Motor Load"
              value={`${calculation.motorPower.toFixed(2)} W`}
            />

            <ResultRow
              label="Other Appliance Load"
              value={`${calculation.otherPower.toFixed(2)} W`}
            />

            <div className="border-t pt-4">

              <ResultRow
                label="Selected Connected Load"
                value={`${calculation.selectedLoad.toFixed(2)} W`}
                bold
              />

            </div>

            <ResultRow
              label={`Load After ${wastage || 0}% Wastage`}
              value={`${calculation.loadAfterWastage.toFixed(2)} W`}
            />

            <div className="border-t pt-4">

              <ResultRow
                label="Estimated Current"
                value={`${calculation.current.toFixed(2)} A`}
                bold
              />

            </div>

            <ResultRow
              label="Recommended Wire"
              value={`${calculation.recommendedWire} mm²`}
              bold
            />

            <ResultRow
              label="Recommended MCB"
              value={`${calculation.recommendedMCB} A`}
              bold
            />

            <div className="border-t pt-4">

              <ResultRow
                label="Wire Material Cost"
                value={money(calculation.wireCost)}
              />

              <div className="mt-4">

                <ResultRow
                  label="MCB Cost"
                  value={money(calculation.mcbCost)}
                />

              </div>

              <div className="mt-4">

                <ResultRow
                  label="Switch Cost"
                  value={money(calculation.switchCost)}
                />

              </div>

              <div className="mt-4">

                <ResultRow
                  label="Socket Accessory Cost"
                  value={money(calculation.socketAccessoryCost)}
                />

              </div>

            </div>

            <div className="mt-4 rounded-xl bg-blue-800 p-5 text-white">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold">
                  Total Electrical Material Cost
                </span>

                <span className="text-2xl font-bold">
                  {money(calculation.materialCost)}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SAFETY NOTE
        ================================================= */}

        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-900">

          <strong>Important:</strong>{" "}
          This calculator provides an estimation for material
          planning. Actual wire size, MCB rating, circuit
          arrangement, earthing and protection should be verified
          by a qualified electrician according to the applicable
          electrical standards and the actual appliance nameplates.

        </div>

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
// INPUT COMPONENT
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
        className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
// SELECT COMPONENT
// =============================================================

function SelectInput({
  label,
  value,
  onChange,
  options,
  hint,
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      >

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}

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
// RESULT ROW
// =============================================================

function ResultRow({
  label,
  value,
  bold = false,
}) {
  return (
    <div className="flex items-center justify-between gap-5">

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