import React from "react";


function NavigationHeader({
  title,
  subtitle,
  onBack,
  onHome,
  calculatorSelector = null,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* BACK */}

          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            ← Back
          </button>


          {/* BRAND */}

          <div className="min-w-0">

            <div className="text-xl font-extrabold tracking-tight text-blue-800 sm:text-2xl">
              Renovate<span className="text-slate-900">Calc</span>
            </div>

            {subtitle && (
              <div className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                {subtitle}
              </div>
            )}

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="flex shrink-0 items-center gap-2">

          {/* CALCULATOR SELECTOR */}

          {calculatorSelector}


          {/* HOME */}

          <button
            type="button"
            onClick={onHome}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-800 px-3.5 text-sm font-bold text-white shadow-sm shadow-blue-950/15 transition hover:bg-blue-900 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            ⌂ Home
          </button>

        </div>

      </div>

    </header>
  );
}


export default NavigationHeader;