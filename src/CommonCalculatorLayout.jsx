/*
=============================================================
RENOVATECALC - COMMON CALCULATOR UI
=============================================================
ONE COMMON LAYOUT FOR ALL MATERIAL CALCULATORS
=============================================================
*/

export default function CommonCalculatorLayout({
  materialName = "Material",
  subtitle = "Renovation Material Calculator",
  children,
  resultTitle = "Calculation Result",
  resultContent,
  onBack,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-800">
              Renovate
              <span className="text-gray-900">
                Calc
              </span>
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-500">
              {subtitle}
            </p>
          </div>

          {/* COMMON BACK BUTTON */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/15 transition duration-200 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-900/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-px"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Materials
            </button>
          )}

        </div>

      </header>


      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE TITLE */}
        <div className="mb-8">

          <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-800">
            {materialName} Calculator
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {materialName} Calculation
          </h2>

          <p className="mt-3 max-w-3xl text-gray-600">
            Enter your project measurements and material
            requirements. RenovateCalc will calculate the
            required quantity, wastage and estimated cost.
          </p>

        </div>


        {/* CALCULATOR INPUT AREA */}
        <div className="space-y-7">
          {children}
        </div>


        {/* RESULTS */}
        {resultContent && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg">

            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-5 text-white">

              <p className="text-xs font-bold uppercase tracking-widest text-blue-100">
                {materialName}
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                {resultTitle}
              </h3>

            </div>

            <div className="p-6">
              {resultContent}
            </div>

          </section>
        )}

      </main>


      {/* FOOTER */}
      <footer className="mt-16 bg-gradient-to-r from-blue-950 to-indigo-950 px-6 py-10 text-center text-blue-100">

        <p className="text-2xl font-extrabold">
          Renovate
          <span className="text-white">
            Calc
          </span>
        </p>

        <p className="mt-2 text-sm text-blue-200">
          Smart renovation material estimation.
        </p>

        <p className="mt-4 text-xs text-blue-300">
          Measure → Calculate → Estimate → Plan
        </p>

      </footer>

    </div>
  );
}


/*
=============================================================
CALCULATOR SECTION
=============================================================
*/

export function CalculatorSection({
  title,
  description,
  children,
  icon = "📐",
}) {
  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-md transition hover:shadow-lg">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
          {icon}
        </div>

        <div>

          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </p>
          )}

        </div>

      </div>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}


/*
=============================================================
INPUT
=============================================================
*/

export function CalculatorInput({
  label,
  value,
  onChange,
  placeholder = "Enter value",
  hint,
  type = "number",
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />

      {hint && (
        <p className="mt-2 text-xs leading-5 text-gray-500">
          💡 {hint}
        </p>
      )}

    </div>
  );
}


/*
=============================================================
INPUT WITH UNIT
=============================================================
*/

export function CalculatorInputWithUnit({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  units,
  placeholder = "Enter value",
  hint,
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="mt-2 flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

        <input
          type="number"
          min="0"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 px-4 py-3.5 text-gray-900 outline-none placeholder:text-gray-400"
        />

        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="border-l border-gray-200 bg-blue-50 px-3 py-3.5 text-sm font-bold text-blue-800 outline-none"
        >

          {units.map(([unitValue, unitLabel]) => (
            <option
              key={unitValue}
              value={unitValue}
            >
              {unitLabel}
            </option>
          ))}

        </select>

      </div>

      {hint && (
        <p className="mt-2 text-xs leading-5 text-gray-500">
          💡 {hint}
        </p>
      )}

    </div>
  );
}


/*
=============================================================
DROPDOWN
=============================================================
*/

export function CalculatorSelect({
  label,
  value,
  onChange,
  options,
  hint,
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 font-semibold text-gray-800 shadow-sm outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      >

        {options.map((option) => {

          const item =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;

          return (
            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>
          );

        })}

      </select>

      {hint && (
        <p className="mt-2 text-xs leading-5 text-gray-500">
          💡 {hint}
        </p>
      )}

    </div>
  );
}


/*
=============================================================
RESULT ROW
=============================================================
*/

export function CalculatorResultRow({
  label,
  value,
  bold = false,
  highlight = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-5 rounded-lg px-4 py-3 ${
        highlight
          ? "bg-blue-50"
          : "bg-gray-50"
      }`}
    >

      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "text-gray-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "text-right font-extrabold text-blue-800"
            : "text-right font-semibold text-gray-800"
        }
      >
        {value}
      </span>

    </div>
  );
}


/*
=============================================================
RESULT SUMMARY CARD
=============================================================
*/

export function CalculatorSummary({
  title,
  value,
  unit,
  description,
}) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">

      <p className="text-sm font-semibold text-blue-700">
        {title}
      </p>

      <div className="mt-2 flex items-baseline gap-2">

        <span className="text-4xl font-extrabold text-blue-900">
          {value}
        </span>

        {unit && (
          <span className="text-lg font-bold text-blue-700">
            {unit}
          </span>
        )}

      </div>

      {description && (
        <p className="mt-2 text-sm text-blue-700">
          {description}
        </p>
      )}

    </div>
  );
}


/*
=============================================================
FORMULA / HINT BOX
=============================================================
*/

export function CalculationHint({
  title = "Calculation Method",
  children,
}) {
  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

      <div className="flex gap-3">

        <div className="text-xl">
          💡
        </div>

        <div>

          <p className="font-bold text-blue-900">
            {title}
          </p>

          <div className="mt-2 text-sm leading-6 text-blue-800">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}


/*
=============================================================
BUTTON
=============================================================
*/

export function CalculatorButton({
  children = "Calculate",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-blue-800 hover:to-indigo-800 hover:shadow-xl active:scale-[0.99]"
    >
      {children}
    </button>
  );
}


/*
=============================================================
COMMON LENGTH UNITS
=============================================================
*/

export const LENGTH_UNITS = [
  ["ft", "Feet"],
  ["m", "Meter"],
  ["cm", "Centimeter"],
  ["mm", "Millimeter"],
  ["inch", "Inch"],
];


/*
=============================================================
COMMON AREA UNITS
=============================================================
*/

export const AREA_UNITS = [
  ["sqft", "Sq. Feet"],
  ["sqm", "Sq. Meter"],
  ["sqyd", "Sq. Yard"],
];


/*
=============================================================
COMMON WEIGHT UNITS
=============================================================
*/

export const WEIGHT_UNITS = [
  ["kg", "Kilogram"],
  ["ton", "Ton"],
  ["gram", "Gram"],
];


/*
=============================================================
COMMON QUANTITY UNITS
=============================================================
*/

export const QUANTITY_UNITS = [
  ["pcs", "Pieces"],
  ["nos", "Numbers"],
];
