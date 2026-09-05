import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

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
import Estimate from "./Estimate";
import NavigationHeader from "./NavigationHeader";
import CalculationRecords from "./CalculationRecords";



import {
  getProject,
  saveBOQItem,
} from "./ProjectStorage";


function App() {
  /* =========================================================
     CURRENT SCREEN
  ========================================================= */

  const [screen, setScreenState] = useState(() => {
    return (
      localStorage.getItem("renovatecalc_current_screen") ||
      "database"
    );
  });


  /* =========================================================
     NAVIGATION HISTORY
  ========================================================= */

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(
        "renovatecalc_navigation_history"
      );

      return savedHistory
        ? JSON.parse(savedHistory)
        : [];
    } catch {
      return [];
    }
  });


  /* =========================================================
     SET SCREEN
  ========================================================= */

  const setScreen = (nextScreen) => {
    if (!nextScreen || nextScreen === screen) {
      return;
    }

    /*
      When moving to another calculator/page,
      clear the previous unsaved calculator result.
    */
    setCurrentCalculation(null);

    setHistory((previousHistory) => {
      const updatedHistory = [
        ...previousHistory,
        screen,
      ];

      localStorage.setItem(
        "renovatecalc_navigation_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    setScreenState(nextScreen);
  };


  /* =========================================================
     BACK
  ========================================================= */

  const goBack = () => {
    setHistory((previousHistory) => {
      if (previousHistory.length === 0) {
        setCurrentCalculation(null);

        setScreenState("database");

        localStorage.setItem(
          "renovatecalc_current_screen",
          "database"
        );

        return [];
      }

      const updatedHistory = [
        ...previousHistory,
      ];

      const previousScreen = updatedHistory.pop();

      setCurrentCalculation(null);

      localStorage.setItem(
        "renovatecalc_navigation_history",
        JSON.stringify(updatedHistory)
      );

      setScreenState(previousScreen);

      return updatedHistory;
    });
  };


  /* =========================================================
     HOME
  ========================================================= */

  const goHome = () => {
    setCurrentCalculation(null);

    setHistory([]);

    localStorage.removeItem(
      "renovatecalc_navigation_history"
    );

    setScreenState("database");

    localStorage.setItem(
      "renovatecalc_current_screen",
      "database"
    );
  };


  /* =========================================================
     SAVE CURRENT SCREEN
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "renovatecalc_current_screen",
      screen
    );
  }, [screen]);


  /* =========================================================
     SELECTED MATERIALS
  ========================================================= */

  const [selectedMaterials, setSelectedMaterials] =
    useState([]);


  /* =========================================================
     BOQ ITEMS
  ========================================================= */

  const [boqItems, setBoqItems] = useState(() => {
    try {
      const project = getProject();

      return Array.isArray(project?.boqItems)
        ? project.boqItems
        : [];
    } catch {
      return [];
    }
  });


  /* =========================================================
     LABOUR TOTAL
  ========================================================= */

  const [labourTotal, setLabourTotal] = useState(0);


  /* =========================================================
     CURRENT CALCULATOR RESULT
  ========================================================= */

  /*
    Every calculator sends its result here.

    The Save button uses this single piece of state.

    Example:

    CementCalculation
          ↓
    onResult(result)
          ↓
    currentCalculation
          ↓
    SAVE TO PROJECT
          ↓
    ProjectStorage
          ↓
    BOQ
  */

  const [
    currentCalculation,
    setCurrentCalculation,
  ] = useState(null);


  /* =========================================================
     SAVE CALCULATOR RESULT TO PROJECT
  ========================================================= */

  const handleSaveCurrentCalculation = () => {
    if (!currentCalculation) {
      alert(
        "Please complete the calculation before saving."
      );

      return;
    }

    /*
      Labour can return a simple number through onResult.
      Convert it into the same structure used by
      the common Save system.
    */

    let result = currentCalculation;

    if (
      typeof currentCalculation === "number"
    ) {
      result = {
        material: "Labour",
        category: "Labour",
        specification: "Labour",
        description: "Labour requirement",

        quantity: currentCalculation,
        finalQuantity: currentCalculation,

        unit: "job",

        rate: currentCalculation,

        amount: currentCalculation,
        cost: currentCalculation,
      };
    }

    /*
      Find the best quantity.

      Calculators such as Cement provide:

      quantity = before wastage
      finalQuantity = after wastage

      BOQ should use the final quantity.
    */

    const quantity = Number(
      result.finalQuantity ??
      result.quantity ??
      result.qty ??
      0
    );

    /*
      Find the rate.

      Different calculators may use:
      rate
      price
    */

    const price = Number(
      result.rate ??
      result.price ??
      0
    );

    /*
      Find amount.

      Prefer calculator's calculated amount.
      Otherwise calculate quantity × rate.
    */

    const amount = Number(
      result.amount ??
      result.cost ??
      (
        quantity * price
      )
    ) || 0;


    /*
      Generate the ID ONLY when Save is clicked.

      This is important.

      We do NOT generate the ID inside the calculator's
      onResult because onResult may run every time the
      user changes an input.
    */

    const boqId =
      result.id &&
      String(result.id).startsWith("BOQ-")
        ? result.id
        : `BOQ-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`;


    /*
      Convert calculator result into the standard
      RenovateCalc BOQ structure.
    */

    const boqItem = {
      ...result,

      id: boqId,

      /*
        Standard BOQ fields
      */

      item:
        result.item ||
        result.material ||
        "Material",

      material:
        result.material ||
        result.item ||
        "Material",

      category:
        result.category ||
        "Materials",

      specification:
        result.specification ||
        "",

      description:
        result.description ||
        "",

      /*
        IMPORTANT:

        BOQ uses final quantity.
      */

      quantity,

      finalQuantity:
        result.finalQuantity ??
        result.quantity ??
        quantity,

      unit:
        result.unit ||
        "unit",

      /*
        IMPORTANT:

        ProjectStorage / BOQ expects price.
      */

      price,

      /*
        Keep rate as well because your calculators
        already use it.
      */

      rate: price,

      /*
        Standard calculated amount
      */

      amount,

      cost: amount,

      /*
        Mark the source.
      */

      source: "calculator",

      savedAt:
        new Date().toISOString(),
    };


    /*
      Save into ProjectStorage.

      saveBOQItem() returns the complete updated project.
    */

    const updatedProject =
      saveBOQItem(boqItem);


    /*
      Immediately update App state so the BOQ page
      sees the newly saved item without refreshing.
    */

    setBoqItems(
      Array.isArray(
        updatedProject?.boqItems
      )
        ? updatedProject.boqItems
        : []
    );


    /*
      If this was labour, keep labour total updated.
    */

    if (
      result.material === "Labour" ||
      result.item === "Labour" ||
      typeof currentCalculation === "number"
    ) {
      setLabourTotal(
        amount
      );
    }


    /*
      Keep the result in state but mark it as saved.
    */

    setCurrentCalculation({
      ...result,

      __saved: true,

      __savedBoqId: boqId,
    });


    alert(
      `${result.material || result.item || "Calculation"} saved to project and BOQ.`
    );
  };


  /* =========================================================
     CALCULATE
  ========================================================= */

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

    alert(
      "Please select at least one material."
    );
  };


  /* =========================================================
     CALCULATORS
  ========================================================= */

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


  /* =========================================================
     MATERIAL NAMES
  ========================================================= */

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
    "calculation-records": "Calculation Records",
  };


  /* =========================================================
     CALCULATOR SELECTOR
  ========================================================= */

  const calculatorSelector =
    selectedMaterials.length > 1 ? (
      <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm lg:flex">

        <span>
          Calculator
        </span>

        <select
          value={screen}
          onChange={(event) => {
            setScreen(event.target.value);
          }}
          className="bg-transparent font-bold text-slate-800 outline-none"
          aria-label="Choose a selected material calculator"
        >

          {selectedMaterials.map(
            (material) => (
              <option
                key={material}
                value={material}
              >
                {materialNames[material]}
              </option>
            )
          )}

        </select>

      </label>
    ) : null;


  /* =========================================================
     PAGE CONTENT
  ========================================================= */

  let pageContent = null;


  /* =========================================================
     FIELD PHOTO
  ========================================================= */

  if (screen === "field-photo") {
    pageContent = (
      <FieldPhoto />
    );
  }


  /* =========================================================
     FIELD MODE
  ========================================================= */

  else if (screen === "field") {
    pageContent = (
      <FieldMode
        onMeasurement={() => {
          setScreen(
            "field-measurement"
          );
        }}

        onMaterial={() => {
          setScreen(
            "shopping-list"
          );
        }}

        onLabour={() => {
          setScreen("labour");
        }}

        onPhoto={() => {
          setScreen(
            "field-photo"
          );
        }}

        onCalculate={() => {
          if (
            selectedMaterials.length > 0
          ) {
            handleCalculate();
          } else {
            alert(
              "Please select materials first."
            );
          }
        }}

        onBOQ={() => {
          setScreen("boq");
        }}

        onEstimate={() => {
          setScreen("estimate");
        }}
      />
    );
  }


  /* =========================================================
     FIELD MEASUREMENT
  ========================================================= */

  else if (
    screen === "field-measurement"
  ) {
    pageContent = (
      <FieldMeasurement />
    );
  }


  /* =========================================================
     SHOPPING LIST
  ========================================================= */

  else if (
    screen === "shopping-list"
  ) {
    pageContent = (
      <ShoppingList
        onBOQ={(items) => {
          setBoqItems(items);

          setScreen("boq");
        }}
      />
    );
  }

  else if (
  screen === "calculation-records"
) {
  pageContent = (
    <CalculationRecords
      items={boqItems}
      onItemsChange={(updatedItems) => {
        setBoqItems(updatedItems);
      }}
    />
  );
} 

  /* =========================================================
     BOQ
  ========================================================= */

 else if (
  screen === "boq"
) {
  pageContent = (
    <BOQ
      items={boqItems}
      labourTotal={labourTotal}
      onItemsChange={(updatedItems) => {
        setBoqItems(updatedItems);
      }}
    />
  );
}

  /* =========================================================
     ESTIMATE
  ========================================================= */

  else if (
    screen === "estimate"
  ) {
    pageContent = (
      <Estimate
        items={boqItems}
        labourTotal={labourTotal}
      />
    );
  }


  /* =========================================================
     CALCULATOR PAGES
  ========================================================= */

  else if (
    calculators[screen]
  ) {
    const Calculator =
      calculators[screen];


    /*
      LABOUR

      Labour previously returned only a number.

      We now convert it into currentCalculation so
      the same Save button can be used.
    */

    if (screen === "labour") {
      pageContent = (
        <Calculator
          onResult={(result) => {

            /*
              If LabourCalculation returns a number,
              keep compatibility with existing code.
            */

            if (
              typeof result === "number"
            ) {
              setLabourTotal(
                Number(result) || 0
              );

              setCurrentCalculation(
                result
              );

              return;
            }


            /*
              If LabourCalculation already returns
              an object, use it directly.
            */

            if (
              result &&
              typeof result === "object"
            ) {
              setLabourTotal(
                Number(
                  result.amount ??
                  result.total ??
                  result.cost ??
                  0
                ) || 0
              );

              setCurrentCalculation(
                result
              );

              return;
            }


            setLabourTotal(0);

            setCurrentCalculation(
              null
            );
          }}
        />
      );
    }

    /*
      ALL MATERIAL CALCULATORS

      Cement
      Sand
      Bricks
      Tiles
      Paint
      Putty
      Flooring
      Steel
      Electrical
      Plumbing

      all use exactly the same onResult system.
    */

    else {
      pageContent = (
        <Calculator
          onResult={
            setCurrentCalculation
          }
        />
      );
    }
  }


  /* =========================================================
     MAIN MATERIAL DATABASE
  ========================================================= */

  else {
    pageContent = (
      <MaterialDatabase
        onCalculate={
          handleCalculate
        }

        selectedMaterials={
          selectedMaterials
        }

        onSelectedMaterialsChange={
          setSelectedMaterials
        }

        onShoppingList={() => {
          setScreen(
            "shopping-list"
          );
        }}

        onFieldMode={() => {
          setScreen("field");
        }}
      />
    );
  }


  /* =========================================================
     HOME SCREEN
     NO COMMON HEADER NEEDED
  ========================================================= */



  /* =========================================================
     SHOULD SHOW COMMON SAVE BUTTON?
  ========================================================= */

  const isCalculatorPage =
    Boolean(
      calculators[screen]
    );


  /* =========================================================
     GLOBAL APP LAYOUT
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">

      <NavigationHeader
        title={
          materialNames[screen] ||
          ""
        }

        subtitle={
          screen === "field"
            ? "Site Field Mode"
            : screen ===
              "field-measurement"
            ? "Field Measurement"
            : screen ===
              "field-photo"
            ? "Field Photo"
            : screen ===
              "shopping-list"
            ? "Shopping List"
            : screen === "boq"
            ? "Bill of Quantities"
            : screen ===
              "estimate"
            ? "Project Estimate"
            : materialNames[
                screen
              ] || ""
        }

        onBack={goBack}

        onHome={goHome}

        onNavigate={(nextScreen) => {
         setScreen(nextScreen);
        }
      }

        calculatorSelector={
          calculatorSelector
        }
      />


      <main>
        {pageContent}
      </main>


      {/* =====================================================
          ONE COMMON SAVE BUTTON
          =====================================================

          This button exists in App.jsx only.

          We do NOT put Save buttons inside every calculator.

          Every calculator sends its result to:

              currentCalculation

          This button saves that result.
      */}

      {isCalculatorPage && (
        <div className="border-t border-slate-200 bg-white px-6 py-6">

          <div className="mx-auto max-w-6xl">

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                    Project Save
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {currentCalculation
                      ? (
                      currentCalculation.material ||
                      currentCalculation.item ||
                      (screen === "labour"
                      ? "Labour"
                      : "Calculation")
                      )
                      : "Calculation Not Saved"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">

                    {currentCalculation
                      ? currentCalculation.__saved
                        ? "This calculation has been saved to your project BOQ."
                        : "Save this calculation to include it in your project BOQ."
                      : "Complete the calculation first, then save it to the project."}

                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    handleSaveCurrentCalculation
                  }
                  disabled={
                    !currentCalculation
                  }
                  className={`rounded-xl px-7 py-3 text-sm font-bold shadow-sm transition ${
                    !currentCalculation
                      ? "cursor-not-allowed bg-slate-300 text-slate-500"
                      : currentCalculation.__saved
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-blue-700 text-white hover:bg-blue-800"
                  }`}
                >

                  {!currentCalculation
                    ? "Save to Project"
                    : currentCalculation.__saved
                    ? "✓ Saved to Project"
                    : "Save to Project"}

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


export default App;