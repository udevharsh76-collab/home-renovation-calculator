import { MATERIALS } from "./data/materials";

function MaterialDatabase({
  onCalculate,
  onShoppingList,
  onBOQ,
  onFieldMode,
  onResetProject,
  selectedMaterials,
  onSelectedMaterialsChange,
})

{
  const toggleMaterial = (id) => {
    onSelectedMaterialsChange((current) => {
      if (current.includes(id)) {
        return current.filter((material) => material !== id);
      }

      return [...current, id];
    });
  };

  const handleCalculate = () => {
    if (selectedMaterials.length > 0) {
      onCalculate();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">

          <h1 className="text-2xl font-extrabold tracking-tight text-blue-800">
            Renovate<span className="text-slate-800">Calc</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Smart renovation material calculator
          </p>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50/50 px-6 py-12">

        <div className="mx-auto max-w-6xl">

          {/* PAGE TITLE */}
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Material database
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Select Materials
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Select one or more materials to prepare estimates for your
              renovation project.
            </p>

          </div>

          {/* SHOPPING LIST - TOP GREEN BUTTON */}
          {/* TOP ACTION BUTTONS */}
<div className="mt-8">

  <div className="grid grid-cols-3 gap-3">

    <button
      type="button"
      onClick={onShoppingList}
      className="rounded-lg bg-green-600 px-3 py-3 text-sm font-bold text-white shadow-md transition hover:bg-green-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
    >
      🛒 Shopping List
    </button>

    <button
      type="button"
      onClick={onFieldMode}
      className="rounded-lg bg-slate-900 px-3 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
    >
      📱 Field Mode
    </button>

    <button
      type="button"
      onClick={onResetProject}
      className="rounded-lg bg-red-600 px-3 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
    >
      🔄 Reset
    </button>

  </div>

  <p className="mt-2 text-center text-xs text-slate-500">
    Add materials, accessories, quantities, specifications and
    prices manually.
  </p>

</div>

          {/* MATERIAL SELECTION BOX */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">

            {/* MATERIAL GRID */}
            <div className="grid gap-5 md:grid-cols-2">

              {MATERIALS.map((material) => {
                const selected = selectedMaterials.includes(material.id);

                return (
                  <button
                    key={material.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleMaterial(material.id)}
                    className={`flex min-h-28 items-start gap-4 rounded-xl border p-5 text-left transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                      selected
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >

                    {/* CHECKBOX */}
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition ${
                        selected
                          ? "border-blue-700 bg-blue-700 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {selected && (
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>

                    {/* MATERIAL DETAILS */}
                    <span>

                      <span className="block font-bold text-slate-950">
                        {material.name}
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-slate-500">
                        {material.description}
                      </span>

                    </span>

                  </button>
                );
              })}

            </div>

            {/* SELECTED MATERIALS */}
            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

              <p className="text-sm font-semibold text-blue-900">
                Selected Materials
              </p>

              <p className="mt-1 text-3xl font-extrabold text-blue-800">
                {selectedMaterials.length}
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Select one or more materials to continue.
              </p>

            </div>

            {/* CALCULATE BUTTON */}
            <button
              type="button"
              onClick={handleCalculate}
              disabled={selectedMaterials.length === 0}
              className="mt-6 w-full rounded-lg bg-blue-800 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              Calculate Now
            </button>

          </section>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-blue-950 px-6 py-10 text-center text-blue-100">

        <p className="text-xl font-bold">
          Renovate<span className="text-white">Calc</span>
        </p>

        <p className="mt-2 text-sm text-blue-200">
          Smart renovation material estimation.
        </p>

      </footer>

    </div>
  );
}

export default MaterialDatabase;