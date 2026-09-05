import { useEffect, useMemo, useState } from "react";

const LABOUR_TYPES = [
  { name: "Mason", rate: 800 },
  { name: "Helper", rate: 600 },
  { name: "Painter", rate: 700 },
  { name: "Painter Helper", rate: 550 },
  { name: "Plumber", rate: 900 },
  { name: "Plumber Helper", rate: 600 },
  { name: "Electrician", rate: 900 },
  { name: "Electrician Helper", rate: 600 },
  { name: "Carpenter", rate: 900 },
  { name: "Carpenter Helper", rate: 600 },
  { name: "Tile Worker", rate: 800 },
  { name: "Tile Helper", rate: 600 },
  { name: "Flooring Worker", rate: 800 },
  { name: "Flooring Helper", rate: 600 },
  { name: "Welder", rate: 900 },
  { name: "Fabricator", rate: 900 },
  { name: "Gypsum / False Ceiling Worker", rate: 850 },
  { name: "Waterproofing Worker", rate: 800 },
  { name: "Demolition Worker", rate: 700 },
  { name: "General Labour", rate: 600 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function LabourCalculation({ onResult }) {
  const [labourType, setLabourType] = useState("Mason");
  const [numberOfLabourers, setNumberOfLabourers] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [rate, setRate] = useState(800);

  const [labourRows, setLabourRows] = useState([]);

  const selectedLabour = LABOUR_TYPES.find(
    (labour) => labour.name === labourType
  );

  const handleLabourTypeChange = (event) => {
    const selectedType = event.target.value;

    setLabourType(selectedType);

    const selected = LABOUR_TYPES.find(
      (labour) => labour.name === selectedType
    );

    if (selected) {
      setRate(selected.rate);
    }
  };

  const handleAddLabour = () => {
    const workers = Number(numberOfLabourers) || 0;
    const days = Number(workingDays) || 0;
    const dailyRate = Number(rate) || 0;

    if (workers <= 0 || days <= 0 || dailyRate <= 0) {
      return;
    }

    const total = workers * days * dailyRate;

    const newRow = {
      id: Date.now(),
      labourType,
      numberOfLabourers: workers,
      workingDays: days,
      rate: dailyRate,
      total,
    };

    setLabourRows((current) => [...current, newRow]);

    setNumberOfLabourers("");
    setWorkingDays("");
  };

  const handleDeleteLabour = (id) => {
    setLabourRows((current) =>
      current.filter((row) => row.id !== id)
    );
  };

  const totalLabourCost = useMemo(() => {
    return labourRows.reduce(
      (total, row) => total + row.total,
      0
    );
  }, [labourRows]);

  const totalWorkers = useMemo(() => {
    return labourRows.reduce(
      (total, row) => total + row.numberOfLabourers,
      0
    );
  }, [labourRows]);

  const totalWorkingDays = useMemo(() => {
    return labourRows.reduce(
      (total, row) =>
        total + row.numberOfLabourers * row.workingDays,
      0
    );
  }, [labourRows]);

  /*
   * Send the current labour total to App.jsx.
   *
   * This is what connects the Labour Calculator
   * to the BOQ.
   */
  /*
 * Send structured labour data to App.jsx.
 *
 * Labour cost:
 * Labourers × Working Days × Rate / Day
 *
 * BOQ quantity:
 * Total Labour Man-Days
 *
 * This prevents the total labour cost from being
 * incorrectly treated as both quantity and rate.
 */
useEffect(() => {
  if (onResult) {
    const manDays = totalWorkingDays;

    const averageRate =
      manDays > 0
        ? totalLabourCost / manDays
        : 0;

    onResult({
      material:
        labourRows.length === 1
          ? labourRows[0].labourType
          : "Labour",

      item:
        labourRows.length === 1
          ? labourRows[0].labourType
          : "Labour",

      category: "Labour",

      specification:
        labourRows.length === 1
          ? `${labourRows[0].numberOfLabourers} labourers × ${labourRows[0].workingDays} days`
          : `${labourRows.length} labour entries`,

      description: "Labour requirement",

      quantity: manDays,

      finalQuantity: manDays,

      unit: "man-days",

      rate: averageRate,

      amount: totalLabourCost,

      cost: totalLabourCost,
    });
  }
}, [
  totalLabourCost,
  totalWorkingDays,
  labourRows,
  onResult,
]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">

          <h1 className="text-2xl font-extrabold tracking-tight text-blue-800">
            Renovate<span className="text-slate-800">Calc</span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Smart renovation labour estimation
          </p>

        </div>
      </header>

      {/* MAIN */}
      <main className="bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50/50 px-6 py-10">

        <div className="mx-auto max-w-6xl">

          {/* TITLE */}
          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Labour calculator
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Calculate Labour Cost
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Add different types of workers, enter the number of
              labourers and working days, and calculate the total
              labour cost automatically.
            </p>

          </div>

          {/* CALCULATOR */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">

            <div className="grid gap-6 md:grid-cols-2">

              {/* LABOUR TYPE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Type of Labour
                </label>

                <select
                  value={labourType}
                  onChange={handleLabourTypeChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  {LABOUR_TYPES.map((labour) => (
                    <option
                      key={labour.name}
                      value={labour.name}
                    >
                      {labour.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-500">
                  Default rate:{" "}
                  {formatCurrency(selectedLabour?.rate || 0)} per day
                </p>
              </div>

              {/* NUMBER OF LABOURERS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Number of Labourers
                </label>

                <input
                  type="number"
                  min="1"
                  value={numberOfLabourers}
                  onChange={(event) =>
                    setNumberOfLabourers(event.target.value)
                  }
                  placeholder="e.g. 2"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* WORKING DAYS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Working Days
                </label>

                <input
                  type="number"
                  min="1"
                  value={workingDays}
                  onChange={(event) =>
                    setWorkingDays(event.target.value)
                  }
                  placeholder="e.g. 10"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* RATE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Rate ₹ / Day
                </label>

                <input
                  type="number"
                  min="0"
                  value={rate}
                  onChange={(event) =>
                    setRate(event.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  You can edit the default rate.
                </p>
              </div>

            </div>

            {/* PREVIEW CALCULATION */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Current Labour Cost
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    Labourers × Days × Rate / Day
                  </p>
                </div>

                <p className="text-2xl font-extrabold text-blue-800">
                  {formatCurrency(
                    (Number(numberOfLabourers) || 0) *
                      (Number(workingDays) || 0) *
                      (Number(rate) || 0)
                  )}
                </p>

              </div>

            </div>

            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={handleAddLabour}
              disabled={
                (Number(numberOfLabourers) || 0) <= 0 ||
                (Number(workingDays) || 0) <= 0 ||
                (Number(rate) || 0) <= 0
              }
              className="mt-6 w-full rounded-lg bg-blue-800 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              + Add Labour
            </button>

          </section>

          {/* ADDED LABOUR */}
          {labourRows.length > 0 && (
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                    Labour Schedule
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold text-slate-950">
                    Added Labour
                  </h3>
                </div>

                <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
                  {labourRows.length}{" "}
                  {labourRows.length === 1
                    ? "entry"
                    : "entries"}
                </div>

              </div>

              {/* DESKTOP TABLE */}
              <div className="mt-6 hidden overflow-x-auto md:block">

                <table className="w-full min-w-[800px] border-collapse">

                  <thead>
                    <tr className="border-b border-slate-200 text-left">

                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Labour Type
                      </th>

                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Labourers
                      </th>

                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Days
                      </th>

                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Rate / Day
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Total
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {labourRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-100"
                      >

                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {row.labourType}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {row.numberOfLabourers}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {row.workingDays}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {formatCurrency(row.rate)}
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-slate-900">
                          {formatCurrency(row.total)}
                        </td>

                        <td className="px-4 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteLabour(row.id)
                            }
                            className="rounded-md px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              {/* MOBILE CARDS */}
              <div className="mt-6 space-y-4 md:hidden">

                {labourRows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="font-bold text-slate-950">
                          {row.labourType}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {row.numberOfLabourers} labourers ×{" "}
                          {row.workingDays} days
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteLabour(row.id)
                        }
                        className="rounded-md px-2 py-1 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs text-slate-500">
                          Rate / Day
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          {formatCurrency(row.rate)}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs text-slate-500">
                          Total
                        </p>

                        <p className="mt-1 font-bold text-blue-800">
                          {formatCurrency(row.total)}
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* SUMMARY */}
          <section className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Labour Entries
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {labourRows.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Labourers
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {totalWorkers}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Across all labour entries
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Labour Man-Days
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {totalWorkingDays}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Labourers × working days
              </p>
            </div>

          </section>

          {/* TOTAL */}
          <section className="mt-6 rounded-2xl bg-blue-800 p-6 text-white shadow-lg shadow-blue-900/20">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-blue-100">
                  Total Labour Cost
                </p>

                <p className="mt-1 text-sm text-blue-200">
                  Automatically connected to BOQ
                </p>
              </div>

              <p className="text-3xl font-extrabold">
                {formatCurrency(totalLabourCost)}
              </p>

            </div>

          </section>

          {/* FORMULA */}
          <section className="mt-6 rounded-xl border border-blue-100 bg-white p-5">

            <p className="text-sm font-bold text-slate-900">
              Calculation Formula
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Labour Cost = Number of Labourers × Working Days ×
              Rate per Day
            </p>

            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">

              <p>
                Example:
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                2 Masons × 10 Days × ₹800/day = ₹16,000
              </p>

            </div>

          </section>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-blue-950 px-6 py-10 text-center text-blue-100">

        <p className="text-xl font-bold">
          Renovate<span className="text-white">Calc</span>
        </p>

        <p className="mt-2 text-sm text-blue-200">
          Smart renovation labour estimation.
        </p>

      </footer>

    </div>
  );
}

export default LabourCalculation;