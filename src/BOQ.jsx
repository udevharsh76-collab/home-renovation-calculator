import { useMemo, useState } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function BOQ({ items = [], labourTotal = 0, onBack }) {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [estimateNo, setEstimateNo] = useState(
    `EST-${Date.now().toString().slice(-6)}`
  );

  const [transport, setTransport] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [notes, setNotes] = useState("");

  /*
   * ============================================================
   * SHOPPING LIST TOTAL
   * ============================================================
   */

  const materialSubtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.price) || 0;

      return total + quantity * rate;
    }, 0);
  }, [items]);

  /*
   * ============================================================
   * AUTOMATIC LABOUR TOTAL
   * ============================================================
   *
   * Labour comes directly from LabourCalculation.jsx.
   */

  const labourAmount = Number(labourTotal) || 0;

  const transportAmount = Number(transport) || 0;

  const otherAmount = Number(otherCharges) || 0;

  const grandTotal =
    materialSubtotal +
    labourAmount +
    transportAmount +
    otherAmount;

  /*
   * ============================================================
   * PRINT
   * ============================================================
   */

  const handlePrint = () => {
    window.print();
  };

  /*
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">

        <header className="border-b border-slate-200 bg-white">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <div>

              <h1 className="text-2xl font-extrabold text-blue-800">
                Renovate
                <span className="text-slate-800">
                  Calc
                </span>
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                BOQ & Estimate
              </p>

            </div>

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              ← Back to Shopping List
            </button>

          </div>

        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
              📋
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
              No Shopping List Items
            </h2>

            <p className="mt-3 text-slate-500">
              Add materials to your Shopping List first, then generate
              the BOQ & Estimate.
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 rounded-xl bg-blue-800 px-6 py-3 font-semibold text-white transition hover:bg-blue-900"
            >
              ← Go to Shopping List
            </button>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white print:hidden">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">

          <div>

            <h1 className="text-2xl font-extrabold text-blue-800">
              Renovate
              <span className="text-slate-800">
                Calc
              </span>
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Bill of Quantities & Estimate
            </p>

          </div>

          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            ← Back to Shopping List
          </button>

        </div>

      </header>

      <main className="px-6 py-10">

        <div className="mx-auto max-w-7xl">

          {/* TITLE */}
          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              BOQ & Estimate
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Bill of Quantities
            </h2>

            <p className="mt-2 text-slate-500">
              This BOQ is generated directly from your Shopping List.
              Quantities and rates are carried forward automatically.
            </p>

          </div>

          {/* PROJECT INFORMATION */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

            <h3 className="text-xl font-bold text-slate-950">
              Project Information
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                  placeholder="Example: House Renovation"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Client Name
                </label>

                <input
                  type="text"
                  value={clientName}
                  onChange={(e) =>
                    setClientName(e.target.value)
                  }
                  placeholder="Client name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Site Location
                </label>

                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) =>
                    setSiteLocation(e.target.value)
                  }
                  placeholder="Site location"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estimate No.
                </label>

                <input
                  type="text"
                  value={estimateNo}
                  onChange={(e) =>
                    setEstimateNo(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* MATERIAL BOQ */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none">

            <div className="border-b border-slate-200 p-6">

              <h3 className="text-xl font-bold text-slate-950">
                Material BOQ
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {items.length} material item
                {items.length === 1 ? "" : "s"} from Shopping List
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full text-left text-sm">

                <thead className="bg-blue-50 text-xs uppercase tracking-wide text-blue-900">

                  <tr>

                    <th className="px-4 py-4">
                      Sr.
                    </th>

                    <th className="px-4 py-4">
                      Category
                    </th>

                    <th className="px-4 py-4">
                      Material / Item
                    </th>

                    <th className="px-4 py-4">
                      Type / Specification
                    </th>

                    <th className="px-4 py-4 text-right">
                      Quantity
                    </th>

                    <th className="px-4 py-4">
                      Unit
                    </th>

                    <th className="px-4 py-4 text-right">
                      Rate
                    </th>

                    <th className="px-4 py-4 text-right">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {items.map((item, index) => {

                    const quantity =
                      Number(item.quantity) || 0;

                    const rate =
                      Number(item.price) || 0;

                    const amount =
                      quantity * rate;

                    return (
                      <tr
                        key={item.id || index}
                        className="hover:bg-blue-50/40"
                      >

                        <td className="px-4 py-4 font-semibold text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {item.category || "—"}
                        </td>

                        <td className="px-4 py-4 font-bold text-slate-950">
                          {item.item || "—"}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {item.type || "—"}
                        </td>

                        <td className="px-4 py-4 text-right font-semibold">
                          {quantity}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {item.unit || "—"}
                        </td>

                        <td className="px-4 py-4 text-right">
                          {formatCurrency(rate)}
                        </td>

                        <td className="px-4 py-4 text-right font-extrabold text-blue-800">
                          {formatCurrency(amount)}
                        </td>

                      </tr>
                    );

                  })}

                </tbody>

                <tfoot>

                  <tr className="border-t-2 border-blue-100 bg-blue-50">

                    <td
                      colSpan="7"
                      className="px-4 py-5 text-right text-lg font-bold text-blue-950"
                    >
                      Material Subtotal
                    </td>

                    <td className="px-4 py-5 text-right text-xl font-extrabold text-blue-800">
                      {formatCurrency(materialSubtotal)}
                    </td>

                  </tr>

                </tfoot>

              </table>

            </div>

          </section>

          {/* AUTOMATIC LABOUR */}
          <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm print:border-slate-300 print:bg-white">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                  Labour Cost
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-950">
                  Labour Calculator Total
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Automatically calculated from the Labour Calculator.
                  No manual entry required.
                </p>

              </div>

              <div className="rounded-xl bg-white px-6 py-4 text-right shadow-sm">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Labour
                </p>

                <p className="mt-1 text-2xl font-extrabold text-blue-800">
                  {formatCurrency(labourAmount)}
                </p>

              </div>

            </div>

          </section>

          {/* OTHER CHARGES */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

            <h3 className="text-xl font-bold text-slate-950">
              Additional Charges
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transport
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transport}
                  onChange={(e) =>
                    setTransport(e.target.value)
                  }
                  placeholder="₹ 0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Other Charges
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={otherCharges}
                  onChange={(e) =>
                    setOtherCharges(e.target.value)
                  }
                  placeholder="₹ 0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* TOTAL SUMMARY */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

              <h3 className="text-xl font-bold text-slate-950">
                Estimate Summary
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-600">
                    Material Subtotal
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(materialSubtotal)}
                  </span>

                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-600">
                    Labour
                  </span>

                  <span className="font-bold text-blue-800">
                    {formatCurrency(labourAmount)}
                  </span>

                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-600">
                    Transport
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(transportAmount)}
                  </span>

                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-3">

                  <span className="text-slate-600">
                    Other Charges
                  </span>

                  <span className="font-bold text-slate-900">
                    {formatCurrency(otherAmount)}
                  </span>

                </div>

              </div>

            </div>

            {/* GRAND TOTAL */}
            <div className="rounded-2xl bg-blue-800 p-8 text-white shadow-lg print:border print:border-blue-800 print:bg-white print:text-blue-900">

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-100 print:text-blue-800">
                Final Grand Total
              </p>

              <p className="mt-3 text-4xl font-extrabold tracking-tight">
                {formatCurrency(grandTotal)}
              </p>

              <p className="mt-4 text-sm leading-6 text-blue-100 print:text-slate-600">
                This amount includes the complete Shopping List
                material total, automatically calculated labour,
                transport and other charges.
              </p>

            </div>

          </section>

          {/* NOTES */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

            <h3 className="text-xl font-bold text-slate-950">
              Notes / Terms
            </h3>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows="5"
              placeholder="Add project notes, payment terms, material specifications, validity, exclusions, etc."
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

          </section>

          {/* SIGNATURE */}
          <section className="mt-8 grid gap-10 md:grid-cols-2 print:mt-12">

            <div>

              <div className="h-16 border-b border-slate-400" />

              <p className="mt-2 text-sm font-semibold text-slate-600">
                Prepared By
              </p>

            </div>

            <div>

              <div className="h-16 border-b border-slate-400" />

              <p className="mt-2 text-sm font-semibold text-slate-600">
                Client / Authorized Signature
              </p>

            </div>

          </section>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-wrap justify-end gap-3 print:hidden">

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Shopping List
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900"
            >
              🖨️ Print / Save PDF
            </button>

          </div>

        </div>

      </main>

      {/* PRINT STYLES */}
      <style>{`
        @media print {

          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          .print\\\\:hidden {
            display: none !important;
          }

          input,
          textarea {
            border: none !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          section {
            page-break-inside: avoid;
          }
        }
      `}</style>

    </div>
  );
}

export default BOQ;