import React from "react";

function FieldMode({
  onMeasurement,
  onMaterial,
  onLabour,
  onPhoto,
  onCalculate,
  onBOQ,
  onEstimate,
}) {
  return (
    <div className="bg-slate-50 text-slate-900">

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-3xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7">

        {/* PAGE INTRO */}
        <section className="mb-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🏗️
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Site Field Mode
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Quickly record measurements, materials, labour and
                  site information while working on a project.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* PROJECT SUMMARY */}
        <section className="mb-6">

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Project Summary
            </h2>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              Active Project
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            {/* ESTIMATED COST */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl">
                💰
              </div>

              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Estimated Cost
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                ₹0
              </div>
            </div>

            {/* MATERIALS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl">
                🧱
              </div>

              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Materials
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                0
              </div>
            </div>

            {/* LABOUR */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl">
                👷
              </div>

              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Labour
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                ₹0
              </div>
            </div>

            {/* OTHER */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xl">
                📦
              </div>

              <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Other
              </div>

              <div className="mt-1 text-lg font-extrabold text-slate-900">
                ₹0
              </div>
            </div>

          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>

          <div className="mb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Tap an action to continue.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {/* ADD MEASUREMENT */}
            <button
              type="button"
              onClick={onMeasurement}
              className="group min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📐
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">
                Add Measurement
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Record site dimensions
              </div>
            </button>

            {/* ADD MATERIAL */}
            <button
              type="button"
              onClick={onMaterial}
              className="group min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🧱
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">
                Add Material
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Add materials to project
              </div>
            </button>

            {/* ADD LABOUR */}
            <button
              type="button"
              onClick={onLabour}
              className="group min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                👷
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">
                Add Labour
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Record labour costs
              </div>
            </button>

            {/* TAKE PHOTO */}
            <button
              type="button"
              onClick={onPhoto}
              className="group min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📷
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">
                Take Photo
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Capture site photos
              </div>
            </button>

            {/* CALCULATE */}
            <button
              type="button"
              onClick={onCalculate}
              className="group min-h-[120px] rounded-2xl bg-blue-800 p-5 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-900 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                🧮
              </div>

              <div className="mt-4 text-sm font-extrabold">
                Calculate
              </div>

              <div className="mt-1 text-xs text-blue-100">
                Calculate material quantities
              </div>
            </button>

            {/* BOQ */}
            <button
              type="button"
              onClick={onBOQ}
              className="group min-h-[120px] rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📋
              </div>

              <div className="mt-4 text-sm font-extrabold text-slate-900">
                BOQ
              </div>

              <div className="mt-1 text-xs text-slate-500">
                View quantity summary
              </div>
            </button>

            {/* ESTIMATE */}
            <button
              type="button"
              onClick={onEstimate}
              className="group col-span-2 min-h-[120px] rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-md active:scale-[0.98] sm:col-span-3"
            >
              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  💰
                </div>

                <div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Estimate
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Generate the complete project estimate
                  </div>
                </div>

              </div>
            </button>

          </div>
        </section>

        {/* INFORMATION */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="text-lg">
              ℹ️
            </div>

            <div>
              <div className="text-sm font-bold text-slate-800">
                Designed for site work
              </div>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Field Mode is optimized for phones and tablets so
                measurements, materials, labour and photos can be
                recorded quickly while working at the site.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default FieldMode;