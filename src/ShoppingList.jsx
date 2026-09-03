import { useEffect, useMemo, useState } from "react";

const SHOPPING_DATABASE = {
  // ============================================================
  // KEEP YOUR COMPLETE SHOPPING_DATABASE HERE EXACTLY AS IT IS
  // ============================================================

  "Civil & Masonry": {
    "Bricks": {
      types: ["Red Clay Brick", "Fly Ash Brick", "Concrete Brick", "AAC Block"],
      unit: "pcs",
    },
    "Cement": {
      types: ["OPC 43 Grade", "OPC 53 Grade", "PPC", "PSC", "White Cement"],
      unit: "bags",
    },
    "Sand": {
      types: ["River Sand", "M-Sand", "Plaster Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    "Aggregate": {
      types: ["10 mm", "20 mm", "40 mm", "Coarse Aggregate"],
      unit: "cu.ft",
    },
    "Concrete": {
      types: ["PCC", "RCC", "M10", "M15", "M20", "M25", "M30"],
      unit: "cu.ft",
    },
    "AAC Blocks": {
      types: ["4 inch", "6 inch", "8 inch", "9 inch"],
      unit: "pcs",
    },
    "Fly Ash Blocks": {
      types: ["4 inch", "6 inch", "8 inch", "9 inch"],
      unit: "pcs",
    },
    "Mortar": {
      types: ["Cement Mortar", "Ready Mortar", "Polymer Mortar"],
      unit: "bags",
    },
    "Ready-Mix Concrete": {
      types: ["M15", "M20", "M25", "M30", "M35"],
      unit: "cu.m",
    },
    "Binding Wire": {
      types: ["18 Gauge", "20 Gauge", "22 Gauge"],
      unit: "kg",
    },
    "Steel / TMT Bars": {
      types: ["8 mm", "10 mm", "12 mm", "16 mm", "20 mm", "25 mm", "32 mm"],
      unit: "kg",
    },
    "Reinforcement Mesh": {
      types: ["Welded Mesh", "GI Mesh", "MS Mesh", "BRC Mesh"],
      unit: "sq.ft",
    },
    "GI Wire": {
      types: ["18 Gauge", "20 Gauge", "22 Gauge", "24 Gauge"],
      unit: "kg",
    },
    "Construction Chemicals": {
      types: [
        "Bonding Agent",
        "Plasticizer",
        "Admixture",
        "Curing Compound",
        "Repair Chemical",
      ],
      unit: "litre",
    },
  },

  "Wall & Surface": {
    "Cement": {
      types: ["OPC 43 Grade", "OPC 53 Grade", "PPC", "White Cement"],
      unit: "bags",
    },
    "Sand": {
      types: ["River Sand", "M-Sand", "Plaster Sand", "Fine Sand"],
      unit: "cu.ft",
    },
    "Plaster Material": {
      types: [
        "Cement Plaster",
        "Ready Mix Plaster",
        "Gypsum Plaster",
        "Polymer Plaster",
      ],
      unit: "bags",
    },
    "Wall Putty": {
      types: ["Cement Based", "Acrylic", "White Cement Putty", "Premium Putty"],
      unit: "kg",
    },
    "Primer": {
      types: [
        "Interior Primer",
        "Exterior Primer",
        "Wall Primer",
        "Alkali Resistant Primer",
      ],
      unit: "litre",
    },
    "Interior Paint": {
      types: [
        "Economy Emulsion",
        "Premium Emulsion",
        "Luxury Emulsion",
        "Acrylic Emulsion",
      ],
      unit: "litre",
    },
    "Exterior Paint": {
      types: [
        "Exterior Emulsion",
        "Weather Coat",
        "Acrylic Exterior",
        "Weatherproof Paint",
      ],
      unit: "litre",
    },
    "Texture Paint": {
      types: [
        "Sand Texture",
        "Roller Texture",
        "Stone Texture",
        "Designer Texture",
      ],
      unit: "kg",
    },
    "Waterproofing Material": {
      types: ["Cementitious", "Acrylic", "PU", "Integral Waterproofing"],
      unit: "kg",
    },
    "Crack Filler": {
      types: [
        "Wall Crack Filler",
        "Acrylic Crack Filler",
        "Cement Crack Filler",
      ],
      unit: "kg",
    },
    "Sealant": {
      types: ["Acrylic", "Silicone", "PU", "Construction Sealant"],
      unit: "tube",
    },
    "POP": {
      types: ["POP Powder", "POP Plaster", "POP Cornice"],
      unit: "kg",
    },
    "Gypsum": {
      types: ["Gypsum Plaster", "Gypsum Powder", "Gypsum Board"],
      unit: "kg",
    },
    "Joint Compound": {
      types: ["Ready Mix", "Powder", "Gypsum Joint Compound"],
      unit: "kg",
    },
    "Wall Panels": {
      types: ["PVC", "WPC", "MDF", "Wood", "3D Panel"],
      unit: "sq.ft",
    },
  },

  "Flooring": {
    "Floor Tiles": {
      types: ["Ceramic", "Vitrified", "Porcelain", "Digital", "Anti-Skid"],
      unit: "sq.ft",
    },
    "Wall Tiles": {
      types: ["Ceramic", "Vitrified", "Porcelain", "Digital", "Glossy", "Matt"],
      unit: "sq.ft",
    },
    "Marble": {
      types: ["White Marble", "Indian Marble", "Imported Marble"],
      unit: "sq.ft",
    },
    "Granite": {
      types: ["Black Granite", "White Granite", "Grey Granite", "Galaxy Granite"],
      unit: "sq.ft",
    },
    "Vitrified Tiles": {
      types: ["Glossy", "Matt", "Double Charge", "Full Body", "Digital"],
      unit: "sq.ft",
    },
    "Ceramic Tiles": {
      types: ["Glossy", "Matt", "Wall Ceramic", "Floor Ceramic"],
      unit: "sq.ft",
    },
    "Kota Stone": {
      types: ["Kota Blue", "Kota Brown", "Kota Green"],
      unit: "sq.ft",
    },
    "Wooden Flooring": {
      types: ["Laminate", "Engineered Wood", "Solid Wood"],
      unit: "sq.ft",
    },
    "Vinyl Flooring": {
      types: ["PVC Vinyl", "SPC", "LVT", "Vinyl Plank"],
      unit: "sq.ft",
    },
    "Tile Adhesive": {
      types: ["Regular", "Heavy Duty", "Flexible", "Large Format"],
      unit: "bags",
    },
    "Tile Grout": {
      types: ["Cement Grout", "Epoxy Grout", "Colored Grout"],
      unit: "kg",
    },
    "Spacers": {
      types: ["1 mm", "2 mm", "3 mm", "5 mm", "8 mm", "10 mm"],
      unit: "pcs",
    },
    "Leveling Clips": {
      types: ["1 mm", "2 mm", "3 mm", "5 mm"],
      unit: "pcs",
    },
    "Skirting": {
      types: [
        "Tile Skirting",
        "Marble Skirting",
        "Granite Skirting",
        "PVC Skirting",
      ],
      unit: "running ft",
    },
    "Flooring Adhesive": {
      types: ["PU", "Epoxy", "Acrylic", "Wood Adhesive"],
      unit: "kg",
    },
  },

  // ------------------------------------------------------------
  // IMPORTANT:
  // Paste the remaining categories from your existing file here:
  //
  // Bathroom
  // Plumbing
  // Electrical
  // Kitchen
  // Doors & Windows
  // Painting
  // False Ceiling & Gypsum
  // Waterproofing
  // Hardware & Miscellaneous
  //
  // Do not change their contents.
  // ------------------------------------------------------------
};

const UNITS = [
  "pcs",
  "nos",
  "bags",
  "kg",
  "g",
  "ton",
  "m",
  "ft",
  "running ft",
  "sq.ft",
  "sq.m",
  "cu.ft",
  "cu.m",
  "litre",
  "ml",
  "box",
  "roll",
  "bundle",
  "sheet",
  "set",
  "pair",
  "tube",
  "load",
  "truck",
];

const STORAGE_KEY = "renovatecalc_shopping_list";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

function ShoppingList({ onBack, onBOQ }) {
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [customType, setCustomType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [price, setPrice] = useState("");

  const [shoppingItems, setShoppingItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(shoppingItems)
    );
  }, [shoppingItems]);

  const categories = Object.keys(SHOPPING_DATABASE);

  const itemNames = category
    ? Object.keys(SHOPPING_DATABASE[category])
    : [];

  const availableTypes =
    category && item
      ? SHOPPING_DATABASE[category][item]?.types || []
      : [];

  const resetForm = () => {
    setCategory("");
    setItem("");
    setType("");
    setCustomType("");
    setQuantity("");
    setUnit("pcs");
    setPrice("");
    setEditingId(null);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setItem("");
    setType("");
    setCustomType("");
    setUnit("pcs");
  };

  const handleItemChange = (value) => {
    setItem(value);
    setType("");
    setCustomType("");

    const defaultUnit =
      SHOPPING_DATABASE[category]?.[value]?.unit || "pcs";

    setUnit(defaultUnit);
  };

  const effectiveType =
    type === "__custom__" ? customType.trim() : type;

  const itemTotal =
    (Number(quantity) || 0) *
    (Number(price) || 0);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!item) {
      alert("Please select an item.");
      return;
    }

    if (!effectiveType) {
      alert(
        "Please select or enter the material type/specification."
      );
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (price === "" || Number(price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      category,
      item,
      type: effectiveType,
      quantity: Number(quantity),
      unit,
      price: Number(price),
      total: itemTotal,
    };

    if (editingId) {
      setShoppingItems((current) =>
        current.map((row) =>
          row.id === editingId ? newItem : row
        )
      );
    } else {
      setShoppingItems((current) => [
        ...current,
        newItem,
      ]);
    }

    resetForm();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setCategory(row.category);
    setItem(row.item);
    setUnit(row.unit);
    setQuantity(String(row.quantity));
    setPrice(String(row.price));

    const types =
      SHOPPING_DATABASE[row.category]?.[row.item]?.types ||
      [];

    if (types.includes(row.type)) {
      setType(row.type);
      setCustomType("");
    } else {
      setType("__custom__");
      setCustomType(row.type);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    setShoppingItems((current) =>
      current.filter((row) => row.id !== id)
    );
  };

  const handleClearAll = () => {
    if (shoppingItems.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear the complete shopping list?"
    );

    if (confirmed) {
      setShoppingItems([]);
      resetForm();
    }
  };

  const grandTotal = useMemo(
    () =>
      shoppingItems.reduce(
        (sum, row) =>
          sum +
          Number(row.quantity || 0) *
            Number(row.price || 0),
        0
      ),
    [shoppingItems]
  );

  const totalItems = shoppingItems.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-blue-800">
                Renovate
                <span className="text-slate-800">
                  Calc
                </span>
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Renovation & construction shopping list
              </p>
            </div>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
              >
                ← Back to Materials
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50/50 px-6 py-10">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Shopping List
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Renovation & Construction Materials
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Select materials, specifications, quantities and prices.
              RenovateCalc automatically calculates each item total and
              the complete shopping budget.
            </p>
          </div>

          {/* ADD ITEM */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.06]">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {editingId
                  ? "Edit Shopping Item"
                  : "Add Shopping Item"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add materials manually or use this list for calculated
                requirements later.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      handleCategoryChange(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ITEM */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Material / Item
                  </label>

                  <select
                    value={item}
                    onChange={(e) =>
                      handleItemChange(e.target.value)
                    }
                    disabled={!category}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      Select item
                    </option>

                    {itemNames.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TYPE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Type / Size / Specification
                  </label>

                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value)
                    }
                    disabled={!item}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">
                      Select type
                    </option>

                    {availableTypes.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}

                    {item && (
                      <option value="__custom__">
                        + Custom Type / Specification
                      </option>
                    )}
                  </select>
                </div>

                {/* CUSTOM TYPE */}
                {type === "__custom__" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Custom Type / Specification
                    </label>

                    <input
                      type="text"
                      value={customType}
                      onChange={(e) =>
                        setCustomType(e.target.value)
                      }
                      placeholder="Example: Premium SS 304"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                )}

                {/* QUANTITY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value)
                    }
                    placeholder="Enter quantity"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* UNIT */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Unit
                  </label>

                  <select
                    value={unit}
                    onChange={(e) =>
                      setUnit(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  >
                    {UNITS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRICE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price / Unit (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    placeholder="Enter price"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* ITEM TOTAL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Item Total
                  </label>

                  <div className="flex min-h-[48px] items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-lg font-extrabold text-blue-800">
                    {formatCurrency(itemTotal)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-800 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  {editingId
                    ? "Update Item"
                    : "+ Add to Shopping List"}
                </button>

                {(editingId || category || item) && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* SUMMARY */}
          <section className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                Total Items
              </p>

              <p className="mt-2 text-3xl font-extrabold text-blue-800">
                {totalItems}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-800 p-6 text-white shadow-lg">
              <p className="text-sm font-semibold text-blue-100">
                Grand Total
              </p>

              <p className="mt-2 text-3xl font-extrabold">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </section>

          {/* SHOPPING TABLE */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/[0.06]">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  Shopping List
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {totalItems === 0
                    ? "No items added yet."
                    : `${totalItems} item${
                        totalItems === 1 ? "" : "s"
                      } added to your list.`}
                </p>
              </div>

              {shoppingItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear All
                </button>
              )}
            </div>

            {shoppingItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  🛒
                </div>

                <h4 className="mt-4 text-lg font-bold text-slate-900">
                  Your shopping list is empty
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Select a category and material above to start adding
                  renovation items.
                </p>
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-4">
                          Category
                        </th>
                        <th className="px-5 py-4">
                          Item
                        </th>
                        <th className="px-5 py-4">
                          Type / Specification
                        </th>
                        <th className="px-5 py-4 text-right">
                          Qty
                        </th>
                        <th className="px-5 py-4">
                          Unit
                        </th>
                        <th className="px-5 py-4 text-right">
                          Price
                        </th>
                        <th className="px-5 py-4 text-right">
                          Total
                        </th>
                        <th className="px-5 py-4">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {shoppingItems.map((row) => (
                        <tr
                          key={row.id}
                          className="transition hover:bg-blue-50/40"
                        >
                          <td className="px-5 py-4 font-semibold text-slate-700">
                            {row.category}
                          </td>

                          <td className="px-5 py-4 font-bold text-slate-950">
                            {row.item}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {row.type}
                          </td>

                          <td className="px-5 py-4 text-right font-semibold">
                            {row.quantity}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {row.unit}
                          </td>

                          <td className="px-5 py-4 text-right">
                            {formatCurrency(row.price)}
                          </td>

                          <td className="px-5 py-4 text-right font-extrabold text-blue-800">
                            {formatCurrency(
                              row.quantity * row.price
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(row)
                                }
                                className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(row.id)
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr className="border-t-2 border-blue-100 bg-blue-50">
                        <td
                          colSpan="6"
                          className="px-5 py-5 text-right text-lg font-bold text-blue-900"
                        >
                          Grand Total
                        </td>

                        <td className="px-5 py-5 text-right text-xl font-extrabold text-blue-800">
                          {formatCurrency(grandTotal)}
                        </td>

                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="space-y-4 p-4 lg:hidden">
                  {shoppingItems.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            {row.category}
                          </p>

                          <h4 className="mt-1 font-bold text-slate-950">
                            {row.item}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            {row.type}
                          </p>
                        </div>

                        <p className="text-lg font-extrabold text-blue-800">
                          {formatCurrency(
                            row.quantity * row.price
                          )}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-500">
                            Quantity
                          </p>

                          <p className="font-bold">
                            {row.quantity}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Unit
                          </p>

                          <p className="font-bold">
                            {row.unit}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Rate
                          </p>

                          <p className="font-bold">
                            {formatCurrency(row.price)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(row)
                          }
                          className="flex-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(row.id)
                          }
                          className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-xl bg-blue-800 p-5 text-white">
                    <p className="text-sm text-blue-100">
                      Grand Total
                    </p>

                    <p className="mt-1 text-2xl font-extrabold">
                      {formatCurrency(grandTotal)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ==================================================
              BOQ BUTTON
              ================================================== */}

          {shoppingItems.length > 0 && onBOQ && (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => onBOQ(shoppingItems)}
                className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                📋 Generate BOQ & Estimate
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-blue-950 px-6 py-10 text-center text-blue-100">
        <p className="text-xl font-bold">
          Renovate
          <span className="text-white">
            Calc
          </span>
        </p>

        <p className="mt-2 text-sm text-blue-200">
          Smart renovation material estimation and shopping management.
        </p>
      </footer>
    </div>
  );
}

export default ShoppingList;