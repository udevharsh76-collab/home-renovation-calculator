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

  if (screen === "bricks") {
    return <BrickCalculation />;
  }

  if (screen === "tiles") {
    return <TileCalculation />;
  }

  if (screen === "cement") {
    return <CementCalculation />;
  }

  if (screen === "sand") {
    return <SandCalculation />;
  }

  if (screen === "paint") {
    return <PaintCalculation />;
  }

  if (screen === "putty") {
    return <PuttyCalculation />;
  }

   if (screen === "flooring") {
    return <FlooringCalculation />;
  }

  if (screen === "steel") {
    return <SteelCalculation />;
  }

  if (screen === "electrical") {
    return <ElectricalCalculation />;
  }

  if (screen === "plumbing") {
     return <PlumbingCalculation />;
  }

    
  return (
    <MaterialDatabase
      onCalculate={handleCalculate}
    />
  );
}

export default App;