import { useMemo, useState } from "react";

const PROJECT_STORAGE_KEY = "renovatecalc_project";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

/*
 * ============================================================
 * IDENTIFY LABOUR
 * ============================================================
 */

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
    category === "labor" ||
    itemName === "labour" ||
    itemName === "labor"
  );
};

/*
 * ============================================================
 * GET ITEM AMOUNT
 * ============================================================
 */

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

function BOQ({
  items = [],
  labourTotal = 0,
  onBack,
  onItemsChange,
}) {
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
   * MATERIAL ITEMS ONLY
   * ============================================================
   *
   * Labour is deliberately excluded from Material BOQ.
   */

  const materialItems = useMemo(() => {
    return items.filter(
      (item) => !isLabourItem(item)
    );
  }, [items]);

  /*
   * ============================================================
   * MATERIAL SUBTOTAL
   * ============================================================
   */

  const materialSubtotal = useMemo(() => {
    return materialItems.reduce(
      (total, item) =>
        total + getItemAmount(item),
      0
    );
  }, [materialItems]);

  /*
   * ============================================================
   * LABOUR TOTAL
   * ============================================================
   *
   * Labour comes separately from LabourCalculation.jsx.
   */

  const labourAmount =
    Number(labourTotal) || 0;

  /*
   * ============================================================
   * ADDITIONAL CHARGES
   * ============================================================
   */

  const transportAmount =
    Number(transport) || 0;

  const otherAmount =
    Number(otherCharges) || 0;

  /*
   * ============================================================
   * FINAL TOTAL
   * ============================================================
   */

  const grandTotal =
    materialSubtotal +
    labourAmount +
    transportAmount +
    otherAmount;

  /*
   * ============================================================
   * DELETE MATERIAL ITEM
   * ============================================================
   */

  const handleDeleteItem = (itemId) => {
    if (!itemId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this material from the project BOQ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const savedProject =
        JSON.parse(
          localStorage.getItem(
            PROJECT_STORAGE_KEY
          )
        ) || {};

      const existingItems =
        Array.isArray(
          savedProject.boqItems
        )
          ? savedProject.boqItems
          : [];

      const updatedItems =
        existingItems.filter(
          (item) =>
            item.id !== itemId
        );

      const updatedProject = {
        ...savedProject,
        boqItems: updatedItems,
      };

      localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify(updatedProject)
      );

      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
    } catch (error) {
      console.error(
        "Failed to delete BOQ item:",
        error
      );

      alert(
        "Unable to delete the item. Please try again."
      );
    }
  };

  /*
   * ============================================================
   * CLEAR ALL MATERIAL ITEMS
   * ============================================================
   */

  const handleClearAll = () => {
    if (materialItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove all material items from the BOQ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const savedProject =
        JSON.parse(
          localStorage.getItem(
            PROJECT_STORAGE_KEY
          )
        ) || {};

      const existingItems =
        Array.isArray(
          savedProject.boqItems
        )
          ? savedProject.boqItems
          : [];

      /*
       * IMPORTANT:
       * Only materials are removed.
       * Labour is preserved.
       */

      const updatedItems =
        existingItems.filter(
          (item) =>
            isLabourItem(item)
        );

      const updatedProject = {
        ...savedProject,
        boqItems: updatedItems,
      };

      localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify(updatedProject)
      );

      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
    } catch (error) {
      console.error(
        "Failed to clear material BOQ:",
        error
      );

      alert(
        "Unable to clear the material BOQ."
      );
    }
  };

  /*
   * ============================================================
   * REFRESH
   * ============================================================
   */

 const handleRefresh = () => {
  try {
    const savedProject = JSON.parse(
      localStorage.getItem(PROJECT_STORAGE_KEY)
    );

    const refreshedItems = Array.isArray(savedProject?.boqItems)
      ? savedProject.boqItems
      : [];

    if (onItemsChange) {
      onItemsChange(refreshedItems);
    }
  } catch (error) {
    console.error("Failed to refresh BOQ:", error);
  }
};

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

  if (
    !items ||
    items.length === 0
  ) {
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

            

          </div>

        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
              📋
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
              No BOQ Items
            </h2>

            <p className="mt-3 text-slate-500">
              Add and save material calculations first,
              then generate the BOQ.
            </p>


          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ======================================================
          HEADER
      ======================================================= */}

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
              Bill of Quantities
            </p>

          </div>

          <div className="flex flex-wrap justify-end gap-2">

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              ← Back
            </button>

          </div>

        </div>

      </header>

      <main className="px-6 py-10">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              TITLE
          =================================================== */}

          <div className="mb-8">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                  BOQ & Billing
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                  Bill of Quantities
                </h2>

                <p className="mt-2 max-w-3xl text-slate-500">
                  Materials and labour are billed separately.
                  Labour is never included in the Material
                  Subtotal.
                </p>

              </div>

              <div className="rounded-2xl border border-blue-100 bg-white px-6 py-4 shadow-sm">

                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Current BOQ Total
                </p>

                <p className="mt-1 text-2xl font-extrabold text-blue-800">
                  {formatCurrency(grandTotal)}
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              PROJECT INFORMATION
          =================================================== */}

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
                    setProjectName(
                      e.target.value
                    )
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
                    setClientName(
                      e.target.value
                    )
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
                    setSiteLocation(
                      e.target.value
                    )
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
                    setEstimateNo(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              MATERIAL BOQ
          =================================================== */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-xl font-bold text-slate-950">
                  Material BOQ
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {materialItems.length} material item
                  {materialItems.length === 1
                    ? ""
                    : "s"}.
                  Labour is excluded from this section.
                </p>

              </div>

              {materialItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 print:hidden"
                >
                  🗑 Clear Materials
                </button>
              )}

            </div>

            {materialItems.length === 0 ? (

              <div className="px-6 py-12 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                  📦
                </div>

                <h4 className="mt-4 font-bold text-slate-800">
                  No material items
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Material calculations saved to the project
                  will appear here.
                </p>

              </div>

            ) : (

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
                        Specification
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

                      <th className="px-4 py-4 text-center print:hidden">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {materialItems.map(
                      (item, index) => {

                        const quantity =
                          Number(
                            item?.finalQuantity ??
                              item?.quantity ??
                              item?.qty ??
                              0
                          );

                        const rate =
                          Number(
                            item?.rate ??
                              item?.price ??
                              0
                          );

                        const amount =
                          getItemAmount(item);

                        return (
                          <tr
                            key={
                              item.id ||
                              `material-${index}`
                            }
                            className="hover:bg-blue-50/40"
                          >

                            <td className="px-4 py-4 font-semibold text-slate-500">
                              {index + 1}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {item.category ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 font-bold text-slate-950">
                              {item.item ||
                                item.material ||
                                "Material"}
                            </td>

                            <td className="px-4 py-4 text-slate-600">

                              {item.specification ||
                                item.type ||
                                "—"}

                              {item.description && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {item.description}
                                </p>
                              )}

                            </td>

                            <td className="px-4 py-4 text-right font-semibold">
                              {quantity}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {item.unit ||
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-right">
                              {formatCurrency(
                                rate
                              )}
                            </td>

                            <td className="px-4 py-4 text-right font-extrabold text-blue-800">
                              {formatCurrency(
                                amount
                              )}
                            </td>

                            <td className="px-4 py-4 text-center print:hidden">

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteItem(
                                    item.id
                                  )
                                }
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                              >
                                🗑 Delete
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

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
                        {formatCurrency(
                          materialSubtotal
                        )}
                      </td>

                      <td className="print:hidden" />

                    </tr>

                  </tfoot>

                </table>

              </div>

            )}

          </section>

          {/* ==================================================
              LABOUR BOQ
          =================================================== */}

          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:shadow-none">

            <div className="border-b border-slate-200 bg-blue-50 p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                    Labour BOQ
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    Labour Cost
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Labour is calculated separately from
                    the material BOQ.
                  </p>

                </div>

                <div className="rounded-xl bg-white px-6 py-4 text-right shadow-sm">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total Labour
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-blue-800">
                    {formatCurrency(
                      labourAmount
                    )}
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              {labourAmount > 0 ? (

                <div className="overflow-x-auto">

                  <table className="min-w-full text-left text-sm">

                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">

                      <tr>

                        <th className="px-4 py-4">
                          Description
                        </th>

                        <th className="px-4 py-4">
                          Source
                        </th>

                        <th className="px-4 py-4 text-right">
                          Total
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      <tr className="border-t border-slate-100">

                        <td className="px-4 py-5">

                          <p className="font-bold text-slate-900">
                            Labour Requirement
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Labour calculated from the Labour
                            Calculator.
                          </p>

                        </td>

                        <td className="px-4 py-5 text-slate-600">
                          Labour Calculator
                        </td>

                        <td className="px-4 py-5 text-right font-extrabold text-blue-800">
                          {formatCurrency(
                            labourAmount
                          )}
                        </td>

                      </tr>

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                  <p className="font-semibold text-slate-700">
                    No labour cost added
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete the Labour Calculator to add
                    labour to this BOQ.
                  </p>

                </div>

              )}

            </div>

          </section>

          {/* ==================================================
              ADDITIONAL CHARGES
          =================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

            <h3 className="text-xl font-bold text-slate-950">
              Additional Charges
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              These charges are added after materials and
              labour.
            </p>

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
                    setTransport(
                      e.target.value
                    )
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
                    setOtherCharges(
                      e.target.value
                    )
                  }
                  placeholder="₹ 0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              BILLING SUMMARY
          =================================================== */}

          <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-6">

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                Billing Summary
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-950">
                Project Cost Breakdown
              </h3>

            </div>

            <div className="divide-y divide-slate-100">

              <div className="flex items-center justify-between px-6 py-5">

                <div>

                  <p className="font-semibold text-slate-800">
                    Material Subtotal
                  </p>

                  <p className="text-xs text-slate-500">
                    Materials only
                  </p>

                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(
                    materialSubtotal
                  )}
                </p>

              </div>

              <div className="flex items-center justify-between px-6 py-5">

                <div>

                  <p className="font-semibold text-slate-800">
                    Labour
                  </p>

                  <p className="text-xs text-slate-500">
                    Labour Calculator
                  </p>

                </div>

                <p className="font-bold text-blue-800">
                  {formatCurrency(
                    labourAmount
                  )}
                </p>

              </div>

              <div className="flex items-center justify-between px-6 py-5">

                <div>

                  <p className="font-semibold text-slate-800">
                    Transport
                  </p>

                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(
                    transportAmount
                  )}
                </p>

              </div>

              <div className="flex items-center justify-between px-6 py-5">

                <div>

                  <p className="font-semibold text-slate-800">
                    Other Charges
                  </p>

                </div>

                <p className="font-bold text-slate-900">
                  {formatCurrency(
                    otherAmount
                  )}
                </p>

              </div>

              <div className="flex items-center justify-between bg-slate-50 px-6 py-5">

                <p className="text-lg font-bold text-slate-900">
                  Total Before Contingency
                </p>

                <p className="text-xl font-extrabold text-slate-950">
                  {formatCurrency(
                    materialSubtotal +
                      labourAmount +
                      transportAmount +
                      otherAmount
                  )}
                </p>

              </div>

              <div className="flex items-center justify-between bg-blue-800 px-6 py-6 text-white">

                <p className="text-xl font-extrabold">
                  Final Grand Total
                </p>

                <p className="text-3xl font-extrabold">
                  {formatCurrency(
                    grandTotal
                  )}
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              NOTES
          =================================================== */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none">

            <h3 className="text-xl font-bold text-slate-950">
              Notes / Terms
            </h3>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows="5"
              placeholder="Add project notes, payment terms, material specifications, validity, exclusions, etc."
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

          </section>

          {/* ==================================================
              SIGNATURE
          =================================================== */}

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

          {/* ==================================================
              ACTION BUTTONS
          =================================================== */}

          <div className="mt-8 flex flex-wrap justify-end gap-3 print:hidden">

            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Back
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

      {/* ======================================================
          PRINT STYLES
      ======================================================= */}

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