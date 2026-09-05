import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getProject } from "./ProjectStorage";

const PROJECT_STORAGE_KEY =
  "renovatecalc_project";


/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);


const getItemName = (item) =>
  item?.item ||
  item?.material ||
  item?.name ||
  "Material";


const getItemAmount = (item) => {
  const directAmount = Number(
    item?.amount ??
    item?.cost
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


const getQuantity = (item) =>
  Number(
    item?.finalQuantity ??
    item?.quantity ??
    item?.qty ??
    0
  );


const getRate = (item) =>
  Number(
    item?.rate ??
    item?.price ??
    0
  );


const isLabourItem = (item) => {
  const category = String(
    item?.category || ""
  )
    .toLowerCase()
    .trim();

  const itemName = String(
    item?.item ||
    item?.material ||
    ""
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


const getWastage = (item) => {
  const wastage =
    item?.wastage ??
    item?.wastagePercent ??
    item?.wastagePercentage;

  if (
    wastage === undefined ||
    wastage === null ||
    wastage === ""
  ) {
    return null;
  }

  const value = Number(wastage);

  return Number.isFinite(value)
    ? value
    : null;
};


const formatDate = (value) => {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


/* =========================================================
   COMPONENT
========================================================= */

function CalculationRecords({
  items = [],
  onItemsChange,
}) {
  /* =======================================================
     RECORDS
  ======================================================= */

  const [records, setRecords] = useState(
    Array.isArray(items)
      ? items
      : []
  );


  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");


  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");


  /* =======================================================
     KEEP RECORDS SYNCHRONIZED WITH APP
  ======================================================= */

  useEffect(() => {
    setRecords(
      Array.isArray(items)
        ? items
        : []
    );
  }, [items]);


  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    try {
      const project = getProject();

      const updatedItems =
        Array.isArray(project?.boqItems)
          ? project.boqItems
          : [];

      setRecords(updatedItems);

      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
    } catch (error) {
      console.error(
        "Failed to refresh calculation records:",
        error
      );

      setRecords([]);

      if (onItemsChange) {
        onItemsChange([]);
      }
    }
  };


  /* =======================================================
     DELETE RECORD
  ======================================================= */

  const handleDelete = (recordId) => {
    if (!recordId) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this calculation record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const project = getProject();

      const currentItems =
        Array.isArray(project?.boqItems)
          ? project.boqItems
          : [];

      const updatedItems =
        currentItems.filter(
          (item) => item.id !== recordId
        );

      localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify({
          ...project,
          boqItems: updatedItems,
        })
      );

      /*
        Update local Calculation Records state.
      */

      setRecords(updatedItems);

      /*
        IMPORTANT:

        Tell App.jsx that the BOQ items
        have changed.

        This keeps:

        Calculation Records
              ↓
             BOQ

        synchronized.
      */

      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
    } catch (error) {
      console.error(
        "Failed to delete calculation:",
        error
      );

      alert(
        "Unable to delete this calculation."
      );
    }
  };


  /* =======================================================
     CLEAR MATERIAL RECORDS
  ======================================================= */

  const handleClearMaterials = () => {
    if (materialRecords.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Clear all material calculation records? Labour records will be kept."
    );

    if (!confirmed) {
      return;
    }

    try {
      const project = getProject();

      const currentItems =
        Array.isArray(project?.boqItems)
          ? project.boqItems
          : [];

      /*
        Keep labour records.

        Remove only material records.
      */

      const updatedItems =
        currentItems.filter(
          isLabourItem
        );

      localStorage.setItem(
        PROJECT_STORAGE_KEY,
        JSON.stringify({
          ...project,
          boqItems: updatedItems,
        })
      );

      setRecords(updatedItems);

      /*
        Synchronize App.jsx / BOQ.
      */

      if (onItemsChange) {
        onItemsChange(updatedItems);
      }
    } catch (error) {
      console.error(
        "Failed to clear material records:",
        error
      );

      alert(
        "Unable to clear material records."
      );
    }
  };


  /* =======================================================
     MATERIAL RECORDS
  ======================================================= */

  const materialRecords = useMemo(
    () =>
      records.filter(
        (item) => !isLabourItem(item)
      ),
    [records]
  );


  /* =======================================================
     LABOUR RECORDS
  ======================================================= */

  const labourRecords = useMemo(
    () =>
      records.filter(
        isLabourItem
      ),
    [records]
  );


  /* =======================================================
     MATERIAL TOTAL
  ======================================================= */

  const materialTotal = useMemo(
    () =>
      materialRecords.reduce(
        (total, item) =>
          total +
          getItemAmount(item),
        0
      ),
    [materialRecords]
  );


  /* =======================================================
     LABOUR TOTAL
  ======================================================= */

  const labourTotal = useMemo(
    () =>
      labourRecords.reduce(
        (total, item) =>
          total +
          getItemAmount(item),
        0
      ),
    [labourRecords]
  );


  /* =======================================================
     OVERALL TOTAL
  ======================================================= */

  const overallTotal =
    materialTotal +
    labourTotal;


  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const categorySet =
      new Set();

    records.forEach((item) => {
      if (isLabourItem(item)) {
        categorySet.add(
          "Labour"
        );

        return;
      }

      if (item?.category) {
        categorySet.add(
          String(item.category)
        );
      }
    });

    return [
      "All",
      ...Array.from(
        categorySet
      ).sort(),
    ];
  }, [records]);


  /* =======================================================
     FILTERED RECORDS
  ======================================================= */

  const filteredRecords = useMemo(() => {
    const searchText =
      search
        .toLowerCase()
        .trim();

    return records.filter(
      (item) => {
        const name =
          getItemName(item)
            .toLowerCase();

        const category =
          String(
            item?.category ||
            "Materials"
          ).toLowerCase();

        const specification =
          String(
            item?.specification ||
            ""
          ).toLowerCase();

        const matchesSearch =
          !searchText ||
          name.includes(
            searchText
          ) ||
          category.includes(
            searchText
          ) ||
          specification.includes(
            searchText
          );

        const matchesCategory =
          categoryFilter ===
          "All" ||
          (
            categoryFilter ===
            "Labour"
              ? isLabourItem(item)
              : !isLabourItem(item) &&
                category ===
                  categoryFilter.toLowerCase()
          );

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    records,
    search,
    categoryFilter,
  ]);


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                Project Records
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Calculation Records
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                View all calculated materials and labour saved in this project.
              </p>

            </div>


            <div className="flex flex-wrap items-center gap-3">

              {/* Refresh */}

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-95"
              >

                <span className="text-base">
                  ↻
                </span>

                Refresh

              </button>


              {/* Clear Materials */}

              <button
                type="button"
                onClick={
                  handleClearMaterials
                }
                disabled={
                  materialRecords.length ===
                  0
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                🗑 Clear Materials

              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


          {/* Total Records */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Total Records
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {records.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Saved calculations
            </p>

          </div>


          {/* Materials */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Materials
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {materialRecords.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatCurrency(
                materialTotal
              )}
            </p>

          </div>


          {/* Labour */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Labour
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {labourRecords.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatCurrency(
                labourTotal
              )}
            </p>

          </div>


          {/* Overall */}

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Calculated Total
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-700">
              {formatCurrency(
                overallTotal
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Materials + Labour
            </p>

          </div>

        </section>


        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">


            {/* Search */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Search Calculations
              </label>

              <div className="relative mt-2">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search material, category or specification..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* Category */}

            <div>

              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </label>

              <select
                value={
                  categoryFilter
                }
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                className="mt-2 min-w-48 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>


        {/* =================================================
            RECORDS
        ================================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">


          {/* Records Header */}

          <div className="border-b border-slate-200 px-5 py-5">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Saved Calculations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredRecords.length}{" "}
                  records displayed
                </p>

              </div>


              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">

                {formatCurrency(
                  filteredRecords.reduce(
                    (total, item) =>
                      total +
                      getItemAmount(
                        item
                      ),
                    0
                  )
                )}

              </div>

            </div>

          </div>


          {/* Empty State */}

          {filteredRecords.length ===
          0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📋
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No calculation records
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Complete a material or labour calculation and save it to your project. The calculation will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredRecords.map(
                (item, index) => {

                  const quantity =
                    getQuantity(item);

                  const rate =
                    getRate(item);

                  const amount =
                    getItemAmount(item);

                  const wastage =
                    getWastage(item);

                  const labour =
                    isLabourItem(item);

                  return (

                    <div
                      key={
                        item.id ||
                        `${getItemName(item)}-${index}`
                      }
                      className="px-5 py-5 transition hover:bg-slate-50"
                    >

                      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center">


                        {/* =================================================
                            NAME
                        ================================================= */}

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-slate-900">
                              {getItemName(
                                item
                              )}
                            </h3>


                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                labour
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {labour
                                ? "Labour"
                                : item.category ||
                                  "Material"}
                            </span>

                          </div>


                          {item.specification && (
                            <p className="mt-2 text-sm text-slate-600">
                              {
                                item.specification
                              }
                            </p>
                          )}


                          {item.description && (
                            <p className="mt-1 text-xs text-slate-500">
                              {
                                item.description
                              }
                            </p>
                          )}


                          <p className="mt-2 text-xs text-slate-400">

                            Calculated:{" "}

                            {formatDate(
                              item.savedAt ||
                              item.createdAt ||
                              item.updatedAt
                            )}

                          </p>

                        </div>


                        {/* =================================================
                            CALCULATION DETAILS
                        ================================================= */}

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">


                          {/* Quantity */}

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Quantity
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                              {quantity || 0}{" "}

                              {item.unit ||
                                "unit"}

                            </p>

                          </div>


                          {/* Rate */}

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Rate
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                              {formatCurrency(
                                rate
                              )}

                            </p>

                          </div>


                          {/* Wastage */}

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Wastage
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                              {wastage ===
                              null
                                ? "—"
                                : `${wastage}%`}

                            </p>

                          </div>


                          {/* Final Quantity */}

                          <div className="rounded-xl bg-slate-50 p-3">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Final Qty
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">

                              {item.finalQuantity ??
                                quantity}{" "}

                              {item.unit ||
                                "unit"}

                            </p>

                          </div>

                        </div>


                        {/* =================================================
                            AMOUNT / DELETE
                        ================================================= */}

                        <div className="flex items-center justify-between gap-4 lg:block lg:text-right">


                          <div>

                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Calculated Cost
                            </p>

                            <p className="mt-1 text-xl font-bold text-blue-700">
                              {formatCurrency(
                                amount
                              )}
                            </p>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="mt-0 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 lg:mt-3"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =================================================
            TOTAL SUMMARY
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-blue-100 bg-white shadow-sm">


          <div className="border-b border-slate-200 px-5 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Calculation Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current calculated values stored in the project.
            </p>

          </div>


          <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">


            {/* Material Total */}

            <div className="p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Material Total
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  materialTotal
                )}
              </p>

            </div>


            {/* Labour Total */}

            <div className="p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Labour Total
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  labourTotal
                )}
              </p>

            </div>


            {/* Overall */}

            <div className="bg-blue-700 p-5 text-white sm:rounded-r-2xl">

              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Calculated Total
              </p>

              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(
                  overallTotal
                )}
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            NOTE
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

          <p className="text-sm font-semibold text-blue-800">
            Calculation Records
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Every saved calculation is stored with the project and can be reviewed here before preparing the final BOQ or Estimate.
          </p>

        </div>

      </div>

    </div>
  );
}


export default CalculationRecords;