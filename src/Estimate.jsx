import React, { useMemo, useState } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function Estimate({ items = [], labourTotal = 0 }) {
  const [transport, setTransport] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [contingencyPercent, setContingencyPercent] = useState("0");

  // -----------------------------------------
  // MATERIAL TOTAL
  // -----------------------------------------
  const materialSubtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.price) || 0;

      return total + quantity * rate;
    }, 0);
  }, [items]);

  // -----------------------------------------
  // LABOUR
  // -----------------------------------------
  const labourAmount = Number(labourTotal) || 0;

  // -----------------------------------------
  // OTHER COSTS
  // -----------------------------------------
  const transportAmount = Number(transport) || 0;
  const otherAmount = Number(otherCharges) || 0;

  // -----------------------------------------
  // SUBTOTAL
  // -----------------------------------------
  const subtotal =
    materialSubtotal +
    labourAmount +
    transportAmount +
    otherAmount;

  // -----------------------------------------
  // CONTINGENCY
  // -----------------------------------------
  const contingencyRate = Number(contingencyPercent) || 0;

  const contingencyAmount =
    (subtotal * contingencyRate) / 100;

  // -----------------------------------------
  // GRAND TOTAL
  // -----------------------------------------
  const grandTotal = subtotal + contingencyAmount;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* PAGE TITLE */}
        <div className="mb-6">
          <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Project Estimate
          </div>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Complete Project Estimate
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review material, labour and additional project costs.
          </p>
        </div>

        {/* GRAND TOTAL */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
          <div className="bg-blue-800 px-5 py-5 text-white sm:px-6">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
              Estimated Project Cost
            </div>

            <div className="mt-2 text-3xl font-extrabold sm:text-4xl">
              {formatCurrency(grandTotal)}
            </div>

            <div className="mt-1 text-xs text-blue-100">
              Includes materials, labour and additional charges
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
            <div className="p-4">
              <div className="text-xs font-bold text-slate-400">
                Materials
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {formatCurrency(materialSubtotal)}
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-bold text-slate-400">
                Labour
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {formatCurrency(labourAmount)}
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-bold text-slate-400">
                Transport
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {formatCurrency(transportAmount)}
              </div>
            </div>

            <div className="p-4">
              <div className="text-xs font-bold text-slate-400">
                Other
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                {formatCurrency(otherAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* COST BREAKDOWN */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* MATERIALS */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Material Cost
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Materials added to your Shopping List
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-800">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <div className="text-4xl">🧱</div>

                <div className="mt-3 text-sm font-extrabold text-slate-900">
                  No material items yet
                </div>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                  Add materials to the Shopping List and generate the BOQ
                  to include them in the project estimate.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-100">
                  {items.map((item, index) => {
                    const quantity = Number(item.quantity) || 0;
                    const rate = Number(item.price) || 0;
                    const amount = quantity * rate;

                    return (
                      <div
                        key={item.id || index}
                        className="px-5 py-4 sm:px-6"
                      >
                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">
                            <div className="font-bold text-slate-900">
                              {item.item ||
                                item.material ||
                                "Material"}
                            </div>

                            {item.category && (
                              <div className="mt-0.5 text-xs font-semibold text-blue-600">
                                {item.category}
                              </div>
                            )}

                            {item.specification && (
                              <div className="mt-1 text-xs text-slate-500">
                                {item.specification}
                              </div>
                            )}

                            <div className="mt-2 text-xs text-slate-500">
                              Qty:{" "}
                              <span className="font-bold text-slate-700">
                                {quantity}
                              </span>{" "}
                              {item.unit || ""}
                              {" × "}
                              <span className="font-bold text-slate-700">
                                {formatCurrency(rate)}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-sm font-extrabold text-slate-900">
                              {formatCurrency(amount)}
                            </div>

                            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Amount
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                  <span className="text-sm font-bold text-slate-600">
                    Material Subtotal
                  </span>

                  <span className="text-lg font-extrabold text-blue-800">
                    {formatCurrency(materialSubtotal)}
                  </span>
                </div>
              </>
            )}
          </section>

          {/* ADDITIONAL COSTS */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                Additional Costs
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Add project expenses that are not in the material list.
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* LABOUR */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  👷 Labour Cost
                </label>

                <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <span className="text-sm font-bold text-slate-400">
                    ₹
                  </span>

                  <span className="ml-2 text-sm font-extrabold text-slate-900">
                    {labourAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* TRANSPORT */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  🚚 Transport / Delivery
                </label>

                <input
                  type="number"
                  min="0"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  placeholder="Enter transport cost"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* OTHER */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  🧾 Other Charges
                </label>

                <input
                  type="number"
                  min="0"
                  value={otherCharges}
                  onChange={(e) => setOtherCharges(e.target.value)}
                  placeholder="Enter other charges"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* CONTINGENCY */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  📊 Contingency / Extra %
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={contingencyPercent}
                    onChange={(e) =>
                      setContingencyPercent(e.target.value)
                    }
                    placeholder="0"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    %
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Useful for unexpected site expenses or price changes.
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* FINAL SUMMARY */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Estimate Summary
            </h2>
          </div>

          <div className="space-y-3 px-5 py-5 sm:px-6">

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-500">
                Materials
              </span>

              <span className="font-bold text-slate-900">
                {formatCurrency(materialSubtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-500">
                Labour
              </span>

              <span className="font-bold text-slate-900">
                {formatCurrency(labourAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-500">
                Transport
              </span>

              <span className="font-bold text-slate-900">
                {formatCurrency(transportAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-500">
                Other Charges
              </span>

              <span className="font-bold text-slate-900">
                {formatCurrency(otherAmount)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-slate-700">
                  Subtotal
                </span>

                <span className="font-extrabold text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {contingencyRate > 0 && (
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-slate-500">
                  Contingency ({contingencyRate}%)
                </span>

                <span className="font-bold text-slate-900">
                  {formatCurrency(contingencyAmount)}
                </span>
              </div>
            )}

          </div>

          {/* GRAND TOTAL */}
          <div className="border-t border-blue-200 bg-blue-50 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">

              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
                  Grand Total
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Final estimated project cost
                </div>
              </div>

              <div className="text-2xl font-extrabold text-blue-800 sm:text-3xl">
                {formatCurrency(grandTotal)}
              </div>

            </div>
          </div>

        </section>

        {/* NOTE */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          <span className="font-extrabold">Note:</span>{" "}
          This is an estimated project cost. Actual expenses may vary based
          on material rates, labor rates, wastage, transportation and site
          conditions.
        </div>

      </div>
    </div>
  );
}

export default Estimate;