import { useState } from "react";
import { MATERIALS } from "./data/materials";

function MaterialDatabase({ onCalculate }) {
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const toggleMaterial = (id) => {
    setSelectedMaterials((current) => {
      if (current.includes(id)) {
        return current.filter(
          (material) => material !== id
        );
      }

      return [...current, id];
    });
  };

  const handleCalculate = () => {
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material to calculate.");
      return;
    }

    onCalculate(selectedMaterials);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

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

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Material Database
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Select Materials
          </h2>

          <p className="mt-3 text-gray-600">
            Select everything you want to calculate.
            RenovateCalc will show the selected calculations.
          </p>
        </div>

        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">

          <div className="grid gap-5 md:grid-cols-2">

            {MATERIALS.map((material) => {

              const selected =
                selectedMaterials.includes(material.id);

              return (
                <button
                  key={material.id}
                  onClick={() =>
                    toggleMaterial(material.id)
                  }
                  className={`text-left rounded-xl border p-5 transition ${
                    selected
                      ? "border-blue-700 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                        selected
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {selected && "✓"}
                    </div>

                    <div>

                      <h3 className="font-bold text-gray-900">
                        {material.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {material.description}
                      </p>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

          <div className="mt-8 rounded-xl bg-blue-50 p-5">

            <p className="text-sm font-semibold text-blue-900">
              Selected Materials
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-800">
              {selectedMaterials.length}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Select one or more materials to continue.
            </p>

          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full rounded-lg bg-blue-800 px-6 py-4 font-semibold text-white transition hover:bg-blue-900"
          >
            Calculate Now
          </button>

        </section>

      </main>

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

export default MaterialDatabase;