import { useState } from "react";

import MaterialDatabase from "./MaterialDatabase";
import CalculatorLayout from "./CalculatorLayout";

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

function App() {
  const [screen, setScreen] = useState("database");

  const handleCalculate = (materials) => {
    if (materials.includes("bricks")) {
      setScreen("bricks");
      return;
    }

    if (materials.includes("tiles")) {
      setScreen("tiles");
      return;
    }

    if (materials.includes("cement")) {
      setScreen("cement");
      return;
    }

    if (materials.includes("sand")) {
      setScreen("sand");
      return;
    }

    if (materials.includes("paint")) {
      setScreen("paint");
      return;
    }

    if (materials.includes("putty")) {
      setScreen("putty");
      return;
    }

    if (materials.includes("flooring")) {
      setScreen("flooring");
      return;
    }

    if (materials.includes("steel")) {
      setScreen("steel");
      return;
    }

    if (materials.includes("electrical")) {
      setScreen("electrical");
      return;
    }

    if (materials.includes("plumbing")) {
      setScreen("plumbing");
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
  };

  if (calculators[screen]) {
    const Calculator = calculators[screen];

    return (
      <CalculatorLayout
        onBack={() => setScreen("database")}
      >
        <Calculator />
      </CalculatorLayout>
    );
  }

  return (
    <MaterialDatabase
      onCalculate={handleCalculate}
    />
  );
}

export default App;