import React from "react";

export default function CommonCalculatorLayout({
  materialName = "Material",
  subtitle = "Renovation Material Calculator",
  children,
  resultTitle = "Calculation Result",
  resultContent,
  onBack,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-200 px-4 py-2 text-slate-600"
            >
              ←
            </button>
          )}

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {materialName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

        </div>
      </header>

      {/* INPUTS → CALCULATE → RESULT */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <section>
          {children}
        </section>

        {/* RESULT */}
        {resultContent && (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 bg-blue-50 px-6 py-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                {resultTitle}
              </h2>
            </div>

            <div className="p-6">
              {resultContent}
            </div>

          </section>
        )}

      </main>

      {/* SAVE TO PROJECT */}
      <div
        id="calculator-save-slot"
        className="mx-auto max-w-7xl px-6 pb-8"
      />

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-blue-950 to-indigo-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">

          <h3 className="text-lg font-extrabold">
            RenovateCalc
          </h3>

          <p className="mt-1 text-sm text-blue-200">
            Smart renovation material & cost calculation
          </p>

          <p className="mt-4 text-xs text-blue-300">
            © {new Date().getFullYear()} RenovateCalc
          </p>

        </div>
      </footer>

    </div>
  );
}


/* =========================================================
   CALCULATOR SECTION
========================================================= */

export function CalculatorSection({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section
      className={`mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">

          {title && (
            <h3 className="text-base font-extrabold text-slate-900">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}

        </div>
      )}

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   CALCULATOR INPUT
========================================================= */

export function CalculatorInput({
  label,
  value,
  onChange,
  type = "number",
  placeholder = "",
  required = false,
  disabled = false,
  min,
  step = "any",
  className = "",
}) {
  return (
    <div className={className}>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        step={step}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

    </div>
  );
}


/* =========================================================
   INPUT + UNIT
========================================================= */

export function CalculatorInputWithUnit({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  units = [],
  type = "number",
  placeholder = "",
  required = false,
  disabled = false,
  min,
  step = "any",
  className = "",
}) {
  return (
    <div className={className}>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          step={step}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none"
        />

        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          disabled={disabled}
          className="border-l border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none"
        >
          {units.map((item) => (
            <option
              key={item.value ?? item}
              value={item.value ?? item}
            >
              {item.label ?? item}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
}


/* =========================================================
   SELECT
========================================================= */

export function CalculatorSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className={className}>

      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((item) => (
          <option
            key={item.value ?? item}
            value={item.value ?? item}
          >
            {item.label ?? item}
          </option>
        ))}
      </select>

    </div>
  );
}


/* =========================================================
   RESULT ROW
========================================================= */

export function CalculatorResultRow({
  label,
  value,
  unit = "",
  highlight = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-slate-100 py-4 ${
        highlight ? "rounded-xl bg-blue-50 px-4" : ""
      }`}
    >

      <span
        className={
          highlight
            ? "font-extrabold text-blue-900"
            : "font-medium text-slate-600"
        }
      >
        {label}
      </span>

      <span
        className={
          highlight
            ? "text-lg font-extrabold text-blue-700"
            : "font-bold text-slate-900"
        }
      >
        {value}

        {unit && (
          <span className="ml-1 text-xs text-slate-500">
            {unit}
          </span>
        )}
      </span>

    </div>
  );
}


/* =========================================================
   SUMMARY
========================================================= */

export function CalculatorSummary({
  title = "Total",
  value,
  unit = "",
}) {
  return (
    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {title}
          </p>

          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {value}
          </p>
        </div>

        {unit && (
          <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            {unit}
          </span>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   CALCULATION HINT
========================================================= */

export function CalculationHint({ children }) {
  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">

      <span className="font-extrabold">
        Tip:
      </span>{" "}

      {children}

    </div>
  );
}


/* =========================================================
   CALCULATOR BUTTON
========================================================= */

export function CalculatorButton({
  children = "Calculate",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:bg-slate-300 sm:w-auto ${className}`}
    >
      {children}
    </button>
  );
}


/* =========================================================
   UNIT LISTS
========================================================= */

export const LENGTH_UNITS = [
  { value: "mm", label: "mm" },
  { value: "cm", label: "cm" },
  { value: "m", label: "m" },
  { value: "ft", label: "ft" },
  { value: "inch", label: "inch" },
];

export const AREA_UNITS = [
  { value: "sqft", label: "sq ft" },
  { value: "sqm", label: "sq m" },
];

export const WEIGHT_UNITS = [
  { value: "kg", label: "kg" },
  { value: "ton", label: "ton" },
];

export const QUANTITY_UNITS = [
  { value: "nos", label: "Nos" },
  { value: "pcs", label: "Pieces" },
  { value: "bags", label: "Bags" },
  { value: "kg", label: "Kg" },
  { value: "litre", label: "Litre" },
  { value: "sqft", label: "Sq Ft" },
  { value: "sqm", label: "Sq M" },
  { value: "rft", label: "Running Ft" },
];