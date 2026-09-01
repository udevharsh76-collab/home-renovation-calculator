import { useState } from "react";

import {
  FORMULA_DEFINITIONS,
  MEASUREMENT_SOURCES,
  getFormulaLabel,
  getSourceLabel,
} from "./calculationEngine";

const STORAGE_KEY = "renovatecalc_products";

const EMPTY_FORM = {
  category: "",
  product: "",
  formula: "DIRECT",
  measurementSource: "FLOOR_AREA",
  rate: "",
  unit: "",
  wastage: "0",
  quality: "Standard",
  status: "Active",
  coverage: "",
  coats: "1",
  factor: "",
};

function loadProducts() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function PricingAdmin({ onBack }) {
  const [products, setProducts] =
    useState(loadProducts);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
    });

    setEditingId(null);
  };

  const saveProducts = (updated) => {
    setProducts(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  const saveProduct = () => {
    if (!form.category.trim()) {
      alert("Please enter a category.");
      return;
    }

    if (!form.product.trim()) {
      alert("Please enter a material name.");
      return;
    }

    if (
      form.rate === "" ||
      Number(form.rate) < 0
    ) {
      alert("Please enter a valid rate.");
      return;
    }

    if (!form.unit.trim()) {
      alert("Please enter the material unit.");
      return;
    }

    if (
      form.formula === "PAINT" &&
      Number(form.coverage) <= 0
    ) {
      alert(
        "Paint coverage must be greater than zero."
      );
      return;
    }

    if (
      [
        "FACTOR",
        "VOLUME_FACTOR",
        "CUSTOM",
      ].includes(form.formula) &&
      Number(form.factor) <= 0
    ) {
      alert(
        "Please enter a calculation factor."
      );
      return;
    }

    const formula =
      FORMULA_DEFINITIONS.find(
        (item) =>
          item.value === form.formula
      );

    const product = {
      id:
        editingId ||
        createId(),

      category:
        form.category.trim(),

      product:
        form.product.trim(),

      formula:
        form.formula,

      formulaLabel:
        formula?.label ||
        getFormulaLabel(form.formula),

      measurementSource:
        form.measurementSource,

      rate:
        Number(form.rate),

      unit:
        form.unit.trim(),

      wastage:
        Number(form.wastage) || 0,

      quality:
        form.quality,

      status:
        form.status,

      coverage:
        form.coverage === ""
          ? null
          : Number(form.coverage),

      coats:
        Number(form.coats) || 1,

      factor:
        form.factor === ""
          ? null
          : Number(form.factor),
    };

    const updated =
      editingId
        ? products.map((item) =>
            item.id === editingId
              ? product
              : item
          )
        : [
            ...products,
            product,
          ];

    saveProducts(updated);

    resetForm();
    setShowForm(false);
  };

  const editProduct = (product) => {
    setForm({
      category:
        product.category || "",

      product:
        product.product || "",

      formula:
        product.formula || "DIRECT",

      measurementSource:
        product.measurementSource ||
        "FLOOR_AREA",

      rate:
        product.rate ?? "",

      unit:
        product.unit || "",

      wastage:
        product.wastage ?? 0,

      quality:
        product.quality ||
        "Standard",

      status:
        product.status ||
        "Active",

      coverage:
        product.coverage ?? "",

      coats:
        product.coats ?? 1,

      factor:
        product.factor ?? "",
    });

    setEditingId(product.id);
    setShowForm(true);
  };

  const deleteProduct = (id) => {
    if (
      !window.confirm(
        "Delete this material?"
      )
    ) {
      return;
    }

    saveProducts(
      products.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const duplicateProduct = (product) => {
    const copy = {
      ...product,
      id: createId(),
      product:
        `${product.product} Copy`,
    };

    saveProducts([
      ...products,
      copy,
    ]);
  };

  const startNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Renovate
              <span className="text-gray-800">
                Calc
              </span>
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Material & Formula Management
            </p>
          </div>

          <button
            onClick={onBack}
            className="rounded-lg border px-5 py-2.5 font-semibold hover:bg-blue-50"
          >
            ← Back to Calculator
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Materials Database
            </h2>

            <p className="mt-2 text-gray-600">
              Create and control all renovation materials,
              rates and calculation rules.
            </p>
          </div>

          <button
            onClick={startNew}
            className="rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white hover:bg-blue-900"
          >
            + Add Material
          </button>
        </div>

        {showForm && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {editingId
                    ? "Edit Material"
                    : "Add Material"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Everything entered here becomes available
                  to the calculator.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="text-2xl text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) =>
                    updateForm(
                      "category",
                      e.target.value
                    )
                  }
                  placeholder="Example: Painting"
                  className="input"
                />
              </Field>

              <Field label="Material Name">
                <input
                  value={form.product}
                  onChange={(e) =>
                    updateForm(
                      "product",
                      e.target.value
                    )
                  }
                  placeholder="Example: Interior Emulsion Paint"
                  className="input"
                />
              </Field>

              <Field label="Calculation Formula">
                <select
                  value={form.formula}
                  onChange={(e) =>
                    updateForm(
                      "formula",
                      e.target.value
                    )
                  }
                  className="input"
                >
                  {FORMULA_DEFINITIONS.map(
                    (formula) => (
                      <option
                        key={formula.value}
                        value={formula.value}
                      >
                        {formula.label}
                      </option>
                    )
                  )}
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  {
                    FORMULA_DEFINITIONS.find(
                      (item) =>
                        item.value ===
                        form.formula
                    )?.description
                  }
                </p>
              </Field>

              <Field label="Measurement Source">
                <select
                  value={
                    form.measurementSource
                  }
                  onChange={(e) =>
                    updateForm(
                      "measurementSource",
                      e.target.value
                    )
                  }
                  className="input"
                >
                  <optgroup label="Calculated">
                    {MEASUREMENT_SOURCES
                      .filter(
                        (item) =>
                          item.group ===
                          "Calculated"
                      )
                      .map((source) => (
                        <option
                          key={source.value}
                          value={source.value}
                        >
                          {source.label}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Manual">
                    {MEASUREMENT_SOURCES
                      .filter(
                        (item) =>
                          item.group ===
                          "Manual"
                      )
                      .map((source) => (
                        <option
                          key={source.value}
                          value={source.value}
                        >
                          {source.label}
                        </option>
                      ))}
                  </optgroup>
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  The calculator will ask the customer only
                  for measurements required by this source.
                </p>
              </Field>

              <Field label="Rate">
                <div className="flex">
                  <span className="flex items-center rounded-l-lg border border-r-0 bg-gray-50 px-4">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.rate}
                    onChange={(e) =>
                      updateForm(
                        "rate",
                        e.target.value
                      )
                    }
                    placeholder="450"
                    className="input rounded-l-none"
                  />
                </div>
              </Field>

              <Field label="Rate Unit">
                <input
                  value={form.unit}
                  onChange={(e) =>
                    updateForm(
                      "unit",
                      e.target.value
                    )
                  }
                  placeholder="litre / kg / bag / sq ft / piece"
                  className="input"
                />
              </Field>

              <Field label="Wastage %">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.wastage}
                  onChange={(e) =>
                    updateForm(
                      "wastage",
                      e.target.value
                    )
                  }
                  className="input"
                />
              </Field>

              <Field label="Quality">
                <select
                  value={form.quality}
                  onChange={(e) =>
                    updateForm(
                      "quality",
                      e.target.value
                    )
                  }
                  className="input"
                >
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value
                    )
                  }
                  className="input"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>
            </div>

            {form.formula === "PAINT" && (
              <div className="mt-8 rounded-2xl bg-blue-50 p-6">
                <h4 className="font-bold text-blue-900">
                  Paint Calculation
                </h4>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Coverage per Unit">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.coverage}
                      onChange={(e) =>
                        updateForm(
                          "coverage",
                          e.target.value
                        )
                      }
                      placeholder="120"
                      className="input"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Example: 120 sq ft per litre
                    </p>
                  </Field>

                  <Field label="Number of Coats">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.coats}
                      onChange={(e) =>
                        updateForm(
                          "coats",
                          e.target.value
                        )
                      }
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            )}

            {[
              "FACTOR",
              "VOLUME_FACTOR",
              "CUSTOM",
            ].includes(form.formula) && (
              <div className="mt-8 rounded-2xl bg-gray-50 p-6">
                <h4 className="font-bold">
                  Calculation Factor
                </h4>

                <div className="mt-4 max-w-md">
                  <Field label="Factor">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.factor}
                      onChange={(e) =>
                        updateForm(
                          "factor",
                          e.target.value
                        )
                      }
                      placeholder="Example: 0.15"
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-8 rounded-xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-900">
                Calculation Preview
              </p>

              <p className="mt-2 text-sm text-blue-800">
                {getSourceLabel(
                  form.measurementSource
                )}{" "}
                →{" "}
                {getFormulaLabel(
                  form.formula
                )}{" "}
                → Wastage → Rate
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={saveProduct}
                className="rounded-lg bg-blue-800 px-7 py-3 font-semibold text-white"
              >
                {editingId
                  ? "Update Material"
                  : "Save Material"}
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="rounded-lg border px-7 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {products.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No Materials Added
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first material using the
                button above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead className="bg-gray-50">
                  <tr className="border-b text-left text-sm">
                    <th className="px-5 py-4">
                      Material
                    </th>
                    <th className="px-5 py-4">
                      Category
                    </th>
                    <th className="px-5 py-4">
                      Formula
                    </th>
                    <th className="px-5 py-4">
                      Measurement
                    </th>
                    <th className="px-5 py-4">
                      Rate
                    </th>
                    <th className="px-5 py-4">
                      Wastage
                    </th>
                    <th className="px-5 py-4">
                      Status
                    </th>
                    <th className="px-5 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-b"
                      >
                        <td className="px-5 py-5">
                          <p className="font-bold">
                            {product.product}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.quality}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          {product.category}
                        </td>

                        <td className="px-5 py-5">
                          {product.formulaLabel ||
                            product.formula}

                          {product.formula ===
                            "PAINT" && (
                            <p className="mt-1 text-xs text-gray-500">
                              {
                                product.coverage
                              }{" "}
                              sq ft/unit ×{" "}
                              {
                                product.coats
                              }{" "}
                              coats
                            </p>
                          )}

                          {product.factor !=
                            null && (
                            <p className="mt-1 text-xs text-gray-500">
                              Factor:{" "}
                              {
                                product.factor
                              }
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm">
                          {getSourceLabel(
                            product.measurementSource
                          )}
                        </td>

                        <td className="px-5 py-5 font-semibold">
                          ₹
                          {Number(
                            product.rate ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                          <span className="ml-1 text-xs font-normal text-gray-500">
                            /{" "}
                            {
                              product.unit
                            }
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          {product.wastage ||
                            0}
                          %
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.status ===
                              "Active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {
                              product.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                editProduct(
                                  product
                                )
                              }
                              className="font-semibold text-blue-800"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                duplicateProduct(
                                  product
                                )
                              }
                              className="font-semibold text-gray-600"
                            >
                              Copy
                            </button>

                            <button
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              className="font-semibold text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

export default PricingAdmin;