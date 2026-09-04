import { useState } from "react";

import MaterialDatabase from "./MaterialDatabase";

import BrickCalculation from "./BrickCalculation";
import TileCalculation from "./TileCalculation";
import CementCalculation from "./CementCalculation";
import SandCalculation from "./SandCalculation";
import PaintCalculation from "./PaintCalculation";
import PuttyCalculation from "./PuttyCalculation";
import FlooringCalculation from "./FlooringCalculation";
import SteelCalculation from "./SteelCalculation";
import ElectricalCalculation from "./ElectricalCalculation";
import PlumbingCalculation from "./PlumbingCalculation";
import LabourCalculation from "./LabourCalculation";

import ShoppingList from "./ShoppingList";
import BOQ from "./BOQ";

import FieldMode from "./FieldMode";
import FieldMeasurement from "./FieldMeasurement";
import FieldPhoto from "./FieldPhoto";


function App() {
  const [screen, setScreen] = useState("database");

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [boqItems, setBoqItems] = useState([]);

  /*
   * LABOUR TOTAL
   *
   * This stores the total calculated by LabourCalculation.jsx.
   * BOQ receives this value automatically.
   */
  const [labourTotal, setLabourTotal] = useState(0);

  const handleCalculate = () => {
    if (selectedMaterials.includes("bricks")) {
      setScreen("bricks");
      return;
    }

    if (selectedMaterials.includes("tiles")) {
      setScreen("tiles");
      return;
    }

    if (selectedMaterials.includes("cement")) {
      setScreen("cement");
      return;
    }

    if (selectedMaterials.includes("sand")) {
      setScreen("sand");
      return;
    }

    if (selectedMaterials.includes("paint")) {
      setScreen("paint");
      return;
    }

    if (selectedMaterials.includes("putty")) {
      setScreen("putty");
      return;
    }

    if (selectedMaterials.includes("flooring")) {
      setScreen("flooring");
      return;
    }

    if (selectedMaterials.includes("steel")) {
      setScreen("steel");
      return;
    }

    if (selectedMaterials.includes("electrical")) {
      setScreen("electrical");
      return;
    }

    if (selectedMaterials.includes("plumbing")) {
      setScreen("plumbing");
      return;
    }

    if (selectedMaterials.includes("labour")) {
      setScreen("labour");
      return;
    }

    
  };

  const calculators = {
    bricks: BrickCalculation,
    tiles: TileCalculation,
    cement: CementCalculation,
    sand: SandCalculation,
    paint: PaintCalculation,
    putty: PuttyCalculation,
    flooring: FlooringCalculation,
    steel: SteelCalculation,
    electrical: ElectricalCalculation,
    plumbing: PlumbingCalculation,
    labour: LabourCalculation,
  };

  const materialNames = {
    bricks: "Bricks",
    tiles: "Tiles",
    cement: "Cement",
    sand: "Sand",
    paint: "Paint",
    putty: "Putty",
    flooring: "Flooring",
    steel: "Steel",
    electrical: "Electrical",
    plumbing: "Plumbing",
    labour: "Labour",
  };

  if (screen === "field-photo") {
   return (
     <FieldPhoto
      onBack={() => setScreen("field")}
    />
  );
}

  /*
 * ============================================================
 * FIELD MODE
 * ============================================================
 */

if (screen === "field") {
  return (
    <FieldMode
      onMeasurement={() => {
        setScreen("field-measurement");
      }}
      onMaterial={() => {
        setScreen("shopping-list");
      }}
      onLabour={() => {
        setScreen("labour");
      }}
      onPhoto={() => {
        setScreen("field-photo");
      }}
      onCalculate={() => {
        if (selectedMaterials.length > 0) {
          handleCalculate();
        } else {
          alert("Please select materials first.");
        }
      }}
      onBOQ={() => {
        setScreen("boq");
      }}
      onEstimate={() => {
        alert("Project estimate feature coming next.");
      }}
    />
  );
}

/*
 * ============================================================
 * FIELD MEASUREMENT
 * ============================================================
 */

if (screen === "field-measurement") {
  return (
    <FieldMeasurement
      onBack={() => setScreen("field")}
    />
  );
}

  /*
   * ============================================================
   * SHOPPING LIST
   * ============================================================
   */

  if (screen === "shopping-list") {
    return (
      <ShoppingList
        onBack={() => setScreen("database")}
        onBOQ={(items) => {
          setBoqItems(items);
          setScreen("boq");
        }}
      />
    );
  }

  /*
   * ============================================================
   * BOQ
   * ============================================================
   */

  if (screen === "boq") {
    return (
      <BOQ
        items={boqItems}
        labourTotal={labourTotal}
        onBack={() => setScreen("shopping-list")}
      />
    );
  }

  /*
   * ============================================================
   * MATERIAL CALCULATORS
   * ============================================================
   */

  if (calculators[screen]) {
    const Calculator = calculators[screen];

    return (
      <div className="calculator-shell relative">

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">

          <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-6 py-3 sm:py-4">

            {selectedMaterials.length > 1 && (
              <label className="pointer-events-auto hidden items-center gap-2 rounded-md border border-slate-200 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur lg:flex">

                Calculator

                <select
                  value={screen}
                  onChange={(event) =>
                    setScreen(event.target.value)
                  }
                  className="bg-transparent font-semibold text-slate-800 outline-none"
                  aria-label="Choose a selected material calculator"
                >

                  {selectedMaterials.map((material) => (
                    <option
                      key={material}
                      value={material}
                    >
                      {materialNames[material]}
                    </option>
                  ))}

                </select>

              </label>
            )}

            <button
              type="button"
              onClick={() => setScreen("database")}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md bg-blue-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-950/15 transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              ← Materials
            </button>

          </div>

        </div>

        {screen === "labour" ? (
          <LabourCalculation
            onResult={setLabourTotal}
          />
        ) : (
          <Calculator />
        )}

      </div>
    );
  }

  /*
   * ============================================================
   * MATERIAL DATABASE
   * ============================================================
   */

 return (
  <MaterialDatabase
    onCalculate={handleCalculate}
    selectedMaterials={selectedMaterials}
    onSelectedMaterialsChange={setSelectedMaterials}
    onShoppingList={() =>
      setScreen("shopping-list")
    }
    onFieldMode={() =>
      setScreen("field")
    }
  />
);

}

export default App;