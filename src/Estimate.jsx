import React, { useMemo, useState } from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

/* =========================================================
   HELPERS
========================================================= */

const isLabourItem = (item) => {
  const category = String(item?.category || "")
    .toLowerCase()
    .trim();

  const itemName = String(
    item?.item || item?.material || ""
  )
    .toLowerCase()
    .trim();

  return (
    category === "labour" ||
    itemName === "labour"
  );
};

const getItemAmount = (item) => {
  const directAmount = Number(
    item?.amount ?? item?.cost
  );

  if (
    Number.isFinite(directAmount) &&
    directAmount > 0
  ) {
    return directAmount;
  }

  const quantity = Number(
    item?.finalQuantity ??
      item?.quantity ??
      item?.qty ??
      0
  );

  const rate = Number(
    item?.rate ??
      item?.price ??
      0
  );

  return quantity * rate;
};

/* =========================================================
   COMPONENT
========================================================= */

function Estimate({
  items = [],
  labourTotal = 0,
}) {
  const [transport, setTransport] = useState("");
  const [otherCharges, setOtherCharges] = useState("");
  const [contingencyPercent, setContingencyPercent] =
    useState("0");

  /* =======================================================
     REFRESH ESTIMATE INPUTS
     
     IMPORTANT:
     This does NOT reload the browser.
     It resets only the editable inputs on this page.
  ======================================================= */

  const handleRefresh = () => {
    setTransport("");
    setOtherCharges("");
    setContingencyPercent("0");
  };

  /* =======================================================
     SEPARATE MATERIALS AND LABOUR
  ======================================================= */

  const materialItems = useMemo(() => {
    return items.filter(
      (item) => !isLabourItem(item)
    );
  }, [items]);

  const labourItems = useMemo(() => {
    return items.filter(isLabourItem);
  }, [items]);

  /* =======================================================
     MATERIAL TOTAL
  ======================================================= */

  const materialSubtotal = useMemo(() => {
    return materialItems.reduce(
      (total, item) =>
        total + getItemAmount(item),
      0
    );
  }, [materialItems]);

  /* =======================================================
     LABOUR TOTAL
  ======================================================= */

  const savedLabourTotal = useMemo(() => {
    return labourItems.reduce(
      (total, item) =>
        total + getItemAmount(item),
      0
    );
  }, [labourItems]);

  /*
    If labour exists in BOQ, use the saved BOQ labour total.

    Otherwise use labourTotal supplied by App.
  */

  const labourAmount =
    labourItems.length > 0
      ? savedLabourTotal
      : Number(labourTotal) || 0;

  /* =======================================================
     OTHER COSTS
  ======================================================= */

  const transportAmount =
    Number(transport) || 0;

  const otherAmount =
    Number(otherCharges) || 0;

  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal =
    materialSubtotal +
    labourAmount +
    transportAmount +
    otherAmount;

  /* =======================================================
     CONTINGENCY
  ======================================================= */

  const contingencyRate =
    Number(contingencyPercent) || 0;

  const contingencyAmount =
    (subtotal * contingencyRate) / 100;

  /* =======================================================
     GRAND TOTAL
  ======================================================= */

  const grandTotal =
    subtotal + contingencyAmount;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                Project Estimate
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Complete Cost Estimate
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Review materials, labour and additional
                project costs.
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* REFRESH BUTTON */}

             
              {/* TOTAL ESTIMATE */}

              <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Total Estimate
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {formatCurrency(grandTotal)}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* =================================================
            GRAND TOTAL CARD
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

          <div className="bg-blue-700 px-6 py-5 text-white">

            <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
              Estimated Project Cost
            </p>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

              <h2 className="text-3xl font-bold">
                {formatCurrency(grandTotal)}
              </h2>

              <p className="text-sm text-blue-100">
                Including contingency
              </p>

            </div>

          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Materials
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(materialSubtotal)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Labour
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(labourAmount)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Additional Costs
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {formatCurrency(
                  transportAmount + otherAmount
                )}
              </p>
            </div>

          </div>
        </section>

        {/* =================================================
            COST BREAKDOWN
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* =================================================
              MATERIAL COST
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-5 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Material Cost
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Materials added to your project BOQ.
                  </p>
                </div>

                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {materialItems.length} items
                </div>

              </div>

            </div>

            {materialItems.length === 0 ? (

              <div className="px-5 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  📦
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No materials added
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Complete a material calculation and save
                  it to your project.
                </p>

              </div>

            ) : (

              <>

                <div className="divide-y divide-slate-100">

                  {materialItems.map(
                    (item, index) => {

                      const quantity = Number(
                        item?.finalQuantity ??
                          item?.quantity ??
                          item?.qty ??
                          0
                      );

                      const rate = Number(
                        item?.rate ??
                          item?.price ??
                          0
                      );

                      const amount =
                        getItemAmount(item);

                      return (
                        <div
                          key={
                            item.id ||
                            `${item.item}-${index}`
                          }
                          className="px-5 py-4"
                        >

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">

                              <p className="font-semibold text-slate-900">
                                {item.item ||
                                  item.material ||
                                  "Material"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {item.category ||
                                  "Materials"}

                                {item.specification
                                  ? ` • ${item.specification}`
                                  : ""}
                              </p>

                              {item.description && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {item.description}
                                </p>
                              )}

                            </div>

                            <div className="text-left sm:text-right">

                              <p className="text-sm font-semibold text-slate-700">
                                {quantity}{" "}
                                {item.unit || "unit"} ×{" "}
                                {formatCurrency(rate)}
                              </p>

                              <p className="mt-1 font-bold text-blue-700">
                                {formatCurrency(amount)}
                              </p>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-slate-700">
                      Material Subtotal
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(
                        materialSubtotal
                      )}
                    </span>

                  </div>

                </div>

              </>
            )}

          </section>

          {/* =================================================
              ADDITIONAL COSTS
          ================================================= */}

          <section className="space-y-4">

            {/* =================================================
                LABOUR
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="font-bold text-slate-900">
                    Labour Cost
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Labour saved in the project BOQ.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-3 py-2 text-right">

                  <p className="text-xs font-semibold text-blue-600">
                    Labour
                  </p>

                  <p className="font-bold text-blue-700">
                    {formatCurrency(
                      labourAmount
                    )}
                  </p>

                </div>

              </div>

              {labourItems.length > 0 && (

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">

                  {labourItems.map(
                    (item, index) => (

                      <div
                        key={
                          item.id ||
                          `labour-${index}`
                        }
                        className="flex items-center justify-between gap-3 text-sm"
                      >

                        <div>

                          <p className="font-medium text-slate-700">
                            {item.item ||
                              item.material ||
                              "Labour"}
                          </p>

                          {item.specification && (
                            <p className="text-xs text-slate-500">
                              {item.specification}
                            </p>
                          )}

                        </div>

                        <span className="font-semibold text-slate-800">
                          {formatCurrency(
                            getItemAmount(item)
                          )}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* =================================================
                TRANSPORT
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <label className="block">

                <span className="font-bold text-slate-900">
                  Transport
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Add transportation or delivery charges.
                </span>

                <div className="relative mt-3">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={transport}
                    onChange={(event) =>
                      setTransport(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </label>

            </div>

            {/* =================================================
                OTHER CHARGES
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <label className="block">

                <span className="font-bold text-slate-900">
                  Other Charges
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Add miscellaneous project expenses.
                </span>

                <div className="relative mt-3">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={otherCharges}
                    onChange={(event) =>
                      setOtherCharges(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </label>

            </div>

            {/* =================================================
                CONTINGENCY
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <label className="block">

                <span className="font-bold text-slate-900">
                  Contingency
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Optional percentage for unexpected costs.
                </span>

                <div className="relative mt-3">

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={contingencyPercent}
                    onChange={(event) =>
                      setContingencyPercent(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pr-10 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    %
                  </span>

                </div>

                <div className="mt-3 flex items-center justify-between text-sm">

                  <span className="text-slate-500">
                    Contingency Amount
                  </span>

                  <span className="font-bold text-slate-800">
                    {formatCurrency(
                      contingencyAmount
                    )}
                  </span>

                </div>

              </label>

            </div>

          </section>

        </div>

        {/* =================================================
            FINAL SUMMARY
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Final Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete estimated project cost.
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            <div className="flex items-center justify-between px-5 py-4">

              <span className="text-slate-600">
                Materials
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  materialSubtotal
                )}
              </span>

            </div>

            <div className="flex items-center justify-between px-5 py-4">

              <span className="text-slate-600">
                Labour
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  labourAmount
                )}
              </span>

            </div>

            <div className="flex items-center justify-between px-5 py-4">

              <span className="text-slate-600">
                Transport
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  transportAmount
                )}
              </span>

            </div>

            <div className="flex items-center justify-between px-5 py-4">

              <span className="text-slate-600">
                Other Charges
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  otherAmount
                )}
              </span>

            </div>

            <div className="flex items-center justify-between bg-slate-50 px-5 py-4">

              <span className="font-bold text-slate-800">
                Subtotal
              </span>

              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(subtotal)}
              </span>

            </div>

            <div className="flex items-center justify-between px-5 py-4">

              <span className="text-slate-600">
                Contingency ({contingencyRate}%)
              </span>

              <span className="font-semibold text-slate-900">
                {formatCurrency(
                  contingencyAmount
                )}
              </span>

            </div>

            <div className="flex items-center justify-between bg-blue-700 px-5 py-5 text-white">

              <span className="text-lg font-bold">
                Grand Total
              </span>

              <span className="text-2xl font-bold">
                {formatCurrency(grandTotal)}
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-800">
            Estimate Note
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            This estimate is calculated from the materials
            and labour saved in your project BOQ. Transport,
            other charges and contingency can be adjusted
            above before finalizing the project estimate.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Estimate;