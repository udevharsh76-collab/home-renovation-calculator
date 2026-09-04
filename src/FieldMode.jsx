import React from "react";

function FieldMode({
  onMeasurement,
  onMaterial,
  onLabour,
  onPhoto,
  onCalculate,
  onBOQ,
  onEstimate,
  projectName = "Renovation Project",
  estimatedCost = 0,
  materialTotal = 0,
  labourTotal = 0,
  otherTotal = 0,
}) {
  const formatCurrency = (value) => {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ActionButton = ({
    icon,
    title,
    description,
    onClick,
    primary = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
        primary
          ? "border-blue-700 bg-blue-800 text-white hover:bg-blue-900"
          : "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${
            primary
              ? "bg-white/15"
              : "bg-blue-50"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div
            className={`text-lg font-extrabold ${
              primary ? "text-white" : "text-slate-950"
            }`}
          >
            {title}
          </div>

          <div
            className={`mt-1 text-sm ${
              primary ? "text-blue-100" : "text-slate-500"
            }`}
          >
            {description}
          </div>
        </div>

        <div
          className={`ml-auto text-xl ${
            primary ? "text-blue-100" : "text-slate-400"
          }`}
        >
          ›
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-extrabold tracking-tight text-blue-800">
                Renovate<span className="text-slate-900">Calc</span>
              </div>

              <div className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Field Mode
              </div>
            </div>

            <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              ● Site Ready
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 pb-10">
        {/* Project Summary */}
        <section className="overflow-hidden rounded-2xl bg-blue-800 shadow-lg shadow-blue-900/10">
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">
              Current Project
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-white">
              {projectName}
            </h1>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                Estimated Project Cost
              </p>

              <p className="mt-1 text-3xl font-extrabold text-white">
                {formatCurrency(estimatedCost)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <div className="p-4">
              <p className="text-[11px] font-semibold text-blue-200">
                Materials
              </p>
              <p className="mt-1 text-sm font-extrabold text-white">
                {formatCurrency(materialTotal)}
              </p>
            </div>

            <div className="border-l border-white/10 p-4">
              <p className="text-[11px] font-semibold text-blue-200">
                Labour
              </p>
              <p className="mt-1 text-sm font-extrabold text-white">
                {formatCurrency(labourTotal)}
              </p>
            </div>

            <div className="border-l border-white/10 p-4">
              <p className="text-[11px] font-semibold text-blue-200">
                Other
              </p>
              <p className="mt-1 text-sm font-extrabold text-white">
                {formatCurrency(otherTotal)}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-6">
          <div className="mb-3">
            <h2 className="text-lg font-extrabold text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Use these tools while working at the construction site.
            </p>
          </div>

          <div className="space-y-3">
            <ActionButton
              icon="📐"
              title="Add Measurement"
              description="Record room, wall, floor and site measurements"
              onClick={onMeasurement}
              primary
            />

            <ActionButton
              icon="🧱"
              title="Add Material"
              description="Add materials, accessories, quantities and prices"
              onClick={onMaterial}
            />

            <ActionButton
              icon="👷"
              title="Add Labour"
              description="Record workers, working days and labour cost"
              onClick={onLabour}
            />

            <ActionButton
              icon="📷"
              title="Take Photo"
              description="Capture a photo of the current site work"
              onClick={onPhoto}
            />

            <ActionButton
              icon="🧮"
              title="Calculate"
              description="Calculate material quantities and project costs"
              onClick={onCalculate}
            />

            <ActionButton
              icon="📋"
              title="BOQ"
              description="View and generate the project Bill of Quantities"
              onClick={onBOQ}
            />

            <ActionButton
              icon="💰"
              title="Estimate"
              description="View the complete project cost estimate"
              onClick={onEstimate}
            />
          </div>
        </section>

        {/* Field Tip */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <div className="text-xl">💡</div>

            <div>
              <h3 className="text-sm font-extrabold text-blue-900">
                Field Mode
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Designed for quick one-hand use at the construction site.
                Measurements, materials, labour and site information will
                eventually be connected to the same project.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onMeasurement}
            className="rounded-xl bg-blue-50 px-2 py-3 text-center text-xs font-bold text-blue-800"
          >
            📐
            <span className="mt-1 block">Measure</span>
          </button>

          <button
            type="button"
            onClick={onMaterial}
            className="rounded-xl bg-green-50 px-2 py-3 text-center text-xs font-bold text-green-700"
          >
            🛒
            <span className="mt-1 block">Materials</span>
          </button>

          <button
            type="button"
            onClick={onBOQ}
            className="rounded-xl bg-slate-100 px-2 py-3 text-center text-xs font-bold text-slate-700"
          >
            📋
            <span className="mt-1 block">BOQ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FieldMode;