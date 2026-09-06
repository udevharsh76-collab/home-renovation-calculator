import React from "react";

function NavigationHeader({
  title,
  subtitle,
  screen,
  onBack,
  onHome,
  onNavigate,
  calculatorSelector = null,
}) {
  const navigationItems = [
    {
      id: "database",
      label: "Calculator",
    },
    {
      id: "boq",
      label: "BOQ",
    },
    {
      id: "calculation-records",
      label: "Records",
    },
    {
      id: "room-management",
      label: "Projects",
    },
    {
      id: "estimate",
      label: "Estimate",
    },
    {
      id: "field",
      label: "Field Mode",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">

        {/* =====================================================
            BRAND
        ===================================================== */}

        


        {/* =====================================================
            MAIN NAVIGATION
        ===================================================== */}

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">

          {navigationItems.map((item) => {
            const isActive =
              item.id === screen ||
              (
                item.id === "database" &&
                [
                  "database",
                  "bricks",
                  "tiles",
                  "cement",
                  "sand",
                  "paint",
                  "putty",
                  "flooring",
                  "steel",
                  "electrical",
                  "plumbing",
                  "labour",
                ].includes(screen)
              );

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-blue-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}

        </nav>


        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Calculator Selector */}

          {calculatorSelector}


          {/* Back */}

          <button
            type="button"
            onClick={onBack}
            className="hidden min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:inline-flex"
          >
            ← Back
          </button>


          {/* Home */}

          <button
            type="button"
            onClick={onHome}
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-blue-800 px-3.5 text-sm font-bold text-white shadow-sm shadow-blue-950/15 transition hover:bg-blue-900 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            ⌂
            <span className="ml-1 hidden sm:inline">
              Home
            </span>
          </button>

        </div>

      </div>


      {/* =====================================================
          MOBILE NAVIGATION
      ===================================================== */}

      <div className="border-t border-slate-100 bg-white px-3 py-2 lg:hidden">

        <div className="flex gap-1 overflow-x-auto">

          {navigationItems.map((item) => {
            const isActive =
              item.id === screen ||
              (
                item.id === "database" &&
                [
                  "database",
                  "bricks",
                  "tiles",
                  "cement",
                  "sand",
                  "paint",
                  "putty",
                  "flooring",
                  "steel",
                  "electrical",
                  "plumbing",
                  "labour",
                ].includes(screen)
              );

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-800 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}

        </div>

      </div>

    </header>
  );
}

export default NavigationHeader;