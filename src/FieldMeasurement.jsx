import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "renovatecalc_field_measurements";

const LENGTH_UNITS = [
  { value: "ft", label: "Feet (ft)" },
  { value: "m", label: "Meter (m)" },
  { value: "cm", label: "Centimeter (cm)" },
  { value: "mm", label: "Millimeter (mm)" },
  { value: "inch", label: "Inch (in)" },
];

const TYPES = [
  { value: "room", label: "Room" },
  { value: "wall", label: "Wall" },
  { value: "floor", label: "Floor" },
  { value: "ceiling", label: "Ceiling" },
  { value: "custom", label: "Custom" },
];

const initialForm = {
  name: "",
  type: "room",

  length: "",
  lengthUnit: "ft",

  width: "",
  widthUnit: "ft",

  height: "",
  heightUnit: "ft",

  doorCount: "",
  doorWidth: "",
  doorWidthUnit: "ft",
  doorHeight: "",
  doorHeightUnit: "ft",

  windowCount: "",
  windowWidth: "",
  windowWidthUnit: "ft",
  windowHeight: "",
  windowHeightUnit: "ft",

  notes: "",
};

function FieldMeasurement({
  onBack,
  onMeasurementsChange,
}) {
  const [measurements, setMeasurements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(initialForm);
  const [showOpenings, setShowOpenings] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(measurements)
    );

    if (onMeasurementsChange) {
      onMeasurementsChange(measurements);
    }
  }, [measurements, onMeasurementsChange]);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const toFeet = (value, unit) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return 0;
    }

    switch (unit) {
      case "m":
        return number * 3.280839895;

      case "cm":
        return number * 0.03280839895;

      case "mm":
        return number * 0.003280839895;

      case "inch":
        return number / 12;

      case "ft":
      default:
        return number;
    }
  };

  const formatNumber = (value, decimals = 2) => {
    if (!Number.isFinite(Number(value))) {
      return "0";
    }

    return Number(value).toFixed(decimals);
  };

  const calculation = useMemo(() => {
    const length = toFeet(form.length, form.lengthUnit);
    const width = toFeet(form.width, form.widthUnit);
    const height = toFeet(form.height, form.heightUnit);

    let floorArea = 0;
    let ceilingArea = 0;
    let wallArea = 0;
    let perimeter = 0;

    if (form.type === "room") {
      floorArea = length * width;
      ceilingArea = floorArea;
      perimeter = 2 * (length + width);
      wallArea = perimeter * height;
    }

    if (form.type === "floor") {
      floorArea = length * width;
      ceilingArea = 0;
      wallArea = 0;
      perimeter = 2 * (length + width);
    }

    if (form.type === "ceiling") {
      ceilingArea = length * width;
      floorArea = 0;
      wallArea = 0;
      perimeter = 2 * (length + width);
    }

    if (form.type === "wall") {
      wallArea = length * height;
      perimeter = length;
      floorArea = 0;
      ceilingArea = 0;
    }

    if (form.type === "custom") {
      if (length > 0 && width > 0) {
        floorArea = length * width;
      }

      if (length > 0 && height > 0) {
        wallArea = length * height;
      }

      if (length > 0 && width > 0) {
        perimeter = 2 * (length + width);
      }

      ceilingArea = floorArea;
    }

    const doorCount = Number(form.doorCount) || 0;
    const doorWidth = toFeet(
      form.doorWidth,
      form.doorWidthUnit
    );
    const doorHeight = toFeet(
      form.doorHeight,
      form.doorHeightUnit
    );

    const windowCount = Number(form.windowCount) || 0;
    const windowWidth = toFeet(
      form.windowWidth,
      form.windowWidthUnit
    );
    const windowHeight = toFeet(
      form.windowHeight,
      form.windowHeightUnit
    );

    const doorArea =
      doorCount > 0
        ? doorCount * doorWidth * doorHeight
        : 0;

    const windowArea =
      windowCount > 0
        ? windowCount * windowWidth * windowHeight
        : 0;

    const openingArea = doorArea + windowArea;

    const netWallArea =
      wallArea > 0
        ? Math.max(0, wallArea - openingArea)
        : 0;

    return {
      length,
      width,
      height,
      floorArea,
      ceilingArea,
      wallArea,
      perimeter,
      doorCount,
      doorArea,
      windowCount,
      windowArea,
      openingArea,
      netWallArea,
    };
  }, [form]);

  const handleSave = () => {
    if (!form.name.trim()) {
      setError("Please enter a room or measurement name.");
      return;
    }

    if (!form.length || Number(form.length) <= 0) {
      setError("Please enter a valid length.");
      return;
    }

    if (
      ["room", "floor", "ceiling"].includes(form.type) &&
      (!form.width || Number(form.width) <= 0)
    ) {
      setError("Please enter a valid width.");
      return;
    }

    if (
      ["room", "wall"].includes(form.type) &&
      (!form.height || Number(form.height) <= 0)
    ) {
      setError("Please enter a valid height.");
      return;
    }

    const newMeasurement = {
      id: Date.now(),

      name: form.name.trim(),
      type: form.type,

      dimensions: {
        length: Number(form.length),
        lengthUnit: form.lengthUnit,

        width: Number(form.width) || 0,
        widthUnit: form.widthUnit,

        height: Number(form.height) || 0,
        heightUnit: form.heightUnit,
      },

      openings: {
        doorCount: calculation.doorCount,
        doorArea: calculation.doorArea,

        windowCount: calculation.windowCount,
        windowArea: calculation.windowArea,

        openingArea: calculation.openingArea,
      },

      calculated: {
        floorArea: calculation.floorArea,
        ceilingArea: calculation.ceilingArea,
        wallArea: calculation.wallArea,
        netWallArea: calculation.netWallArea,
        perimeter: calculation.perimeter,
      },

      notes: form.notes.trim(),

      createdAt: new Date().toISOString(),
    };

    setMeasurements((previous) => [
      newMeasurement,
      ...previous,
    ]);

    setForm(initialForm);
    setShowOpenings(false);
    setError("");
  };

  const deleteMeasurement = (id) => {
    setMeasurements((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearAllMeasurements = () => {
    if (measurements.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Delete all saved field measurements?"
    );

    if (!confirmed) {
      return;
    }

    setMeasurements([]);
  };

  const typeLabel = (type) => {
    const found = TYPES.find(
      (item) => item.value === type
    );

    return found ? found.label : "Custom";
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-semibold text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  const unitClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3 py-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">

          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl font-bold text-slate-700 active:scale-95"
            aria-label="Back to Field Mode"
          >
            ←
          </button>

          <div className="min-w-0">
            <div className="text-xl font-extrabold tracking-tight text-blue-800">
              Renovate<span className="text-slate-900">Calc</span>
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Field Measurement
            </div>
          </div>

          <div className="ml-auto rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {measurements.length} Saved
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 pb-12">

        {/* Page heading */}
        <section className="mb-5">
          <h1 className="text-2xl font-extrabold text-slate-950">
            Add Measurement
          </h1>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Record measurements directly from the construction site.
          </p>
        </section>

        {/* Measurement Form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-950">
              Measurement Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the basic dimensions of the area.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Room / Area Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Example: Master Bedroom"
              className={inputClass}
            />
          </div>

          {/* Type */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Measurement Type
            </label>

            <select
              value={form.type}
              onChange={(event) =>
                updateField("type", event.target.value)
              }
              className={inputClass}
            >
              {TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Length
            </label>

            <div className="grid grid-cols-[1fr_120px] gap-2">
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                value={form.length}
                onChange={(event) =>
                  updateField("length", event.target.value)
                }
                placeholder="0"
                className={inputClass}
              />

              <select
                value={form.lengthUnit}
                onChange={(event) =>
                  updateField(
                    "lengthUnit",
                    event.target.value
                  )
                }
                className={unitClass}
              >
                {LENGTH_UNITS.map((unit) => (
                  <option
                    key={unit.value}
                    value={unit.value}
                  >
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Width */}
          {form.type !== "wall" && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Width
              </label>

              <div className="grid grid-cols-[1fr_120px] gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={form.width}
                  onChange={(event) =>
                    updateField("width", event.target.value)
                  }
                  placeholder="0"
                  className={inputClass}
                />

                <select
                  value={form.widthUnit}
                  onChange={(event) =>
                    updateField(
                      "widthUnit",
                      event.target.value
                    )
                  }
                  className={unitClass}
                >
                  {LENGTH_UNITS.map((unit) => (
                    <option
                      key={unit.value}
                      value={unit.value}
                    >
                      {unit.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Height */}
          {(form.type === "room" ||
            form.type === "wall" ||
            form.type === "custom") && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Height
              </label>

              <div className="grid grid-cols-[1fr_120px] gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={form.height}
                  onChange={(event) =>
                    updateField("height", event.target.value)
                  }
                  placeholder="0"
                  className={inputClass}
                />

                <select
                  value={form.heightUnit}
                  onChange={(event) =>
                    updateField(
                      "heightUnit",
                      event.target.value
                    )
                  }
                  className={unitClass}
                >
                  {LENGTH_UNITS.map((unit) => (
                    <option
                      key={unit.value}
                      value={unit.value}
                    >
                      {unit.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Doors & Windows */}
          <div className="mt-6 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={() =>
                setShowOpenings((previous) => !previous)
              }
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-4 text-left"
            >
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  🚪 Doors & Windows
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Subtract openings from wall area
                </div>
              </div>

              <span className="text-xl text-slate-400">
                {showOpenings ? "⌃" : "⌄"}
              </span>
            </button>

            {showOpenings && (
              <div className="mt-4 space-y-5">

                {/* Door */}
                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="mb-3 text-sm font-extrabold text-slate-800">
                    Door
                  </div>

                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Number of Doors
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.doorCount}
                    onChange={(event) =>
                      updateField(
                        "doorCount",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className={inputClass}
                  />

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Width
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={form.doorWidth}
                        onChange={(event) =>
                          updateField(
                            "doorWidth",
                            event.target.value
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Height
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={form.doorHeight}
                        onChange={(event) =>
                          updateField(
                            "doorHeight",
                            event.target.value
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">

                    <select
                      value={form.doorWidthUnit}
                      onChange={(event) =>
                        updateField(
                          "doorWidthUnit",
                          event.target.value
                        )
                      }
                      className={unitClass}
                    >
                      {LENGTH_UNITS.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.value}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.doorHeightUnit}
                      onChange={(event) =>
                        updateField(
                          "doorHeightUnit",
                          event.target.value
                        )
                      }
                      className={unitClass}
                    >
                      {LENGTH_UNITS.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.value}
                        </option>
                      ))}
                    </select>

                  </div>

                </div>

                {/* Window */}
                <div className="rounded-xl border border-slate-200 p-4">

                  <div className="mb-3 text-sm font-extrabold text-slate-800">
                    Window
                  </div>

                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Number of Windows
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={form.windowCount}
                    onChange={(event) =>
                      updateField(
                        "windowCount",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className={inputClass}
                  />

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Width
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={form.windowWidth}
                        onChange={(event) =>
                          updateField(
                            "windowWidth",
                            event.target.value
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Height
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={form.windowHeight}
                        onChange={(event) =>
                          updateField(
                            "windowHeight",
                            event.target.value
                          )
                        }
                        placeholder="0"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">

                    <select
                      value={form.windowWidthUnit}
                      onChange={(event) =>
                        updateField(
                          "windowWidthUnit",
                          event.target.value
                        )
                      }
                      className={unitClass}
                    >
                      {LENGTH_UNITS.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.value}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.windowHeightUnit}
                      onChange={(event) =>
                        updateField(
                          "windowHeightUnit",
                          event.target.value
                        )
                      }
                      className={unitClass}
                    >
                      {LENGTH_UNITS.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                        >
                          {unit.value}
                        </option>
                      ))}
                    </select>

                  </div>

                </div>

              </div>
            )}

          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateField("notes", event.target.value)
              }
              placeholder="Example: Wall needs plaster repair..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Live Calculation */}
          <div className="mt-6 rounded-2xl bg-blue-50 p-4">

            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-blue-900">
                  Calculated Area
                </div>

                <div className="text-xs text-blue-700">
                  Automatically converted to sq.ft
                </div>
              </div>

              <div className="text-xl">
                🧮
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">

              {calculation.floorArea > 0 && (
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Floor Area
                  </div>

                  <div className="mt-1 text-lg font-extrabold text-slate-900">
                    {formatNumber(
                      calculation.floorArea
                    )}{" "}
                    <span className="text-xs text-slate-500">
                      sq.ft
                    </span>
                  </div>
                </div>
              )}

              {calculation.ceilingArea > 0 && (
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Ceiling Area
                  </div>

                  <div className="mt-1 text-lg font-extrabold text-slate-900">
                    {formatNumber(
                      calculation.ceilingArea
                    )}{" "}
                    <span className="text-xs text-slate-500">
                      sq.ft
                    </span>
                  </div>
                </div>
              )}

              {calculation.wallArea > 0 && (
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Wall Area
                  </div>

                  <div className="mt-1 text-lg font-extrabold text-slate-900">
                    {formatNumber(
                      calculation.wallArea
                    )}{" "}
                    <span className="text-xs text-slate-500">
                      sq.ft
                    </span>
                  </div>
                </div>
              )}

              {calculation.netWallArea > 0 &&
                calculation.openingArea > 0 && (
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Net Wall Area
                    </div>

                    <div className="mt-1 text-lg font-extrabold text-green-700">
                      {formatNumber(
                        calculation.netWallArea
                      )}{" "}
                      <span className="text-xs text-slate-500">
                        sq.ft
                      </span>
                    </div>
                  </div>
                )}

              {calculation.perimeter > 0 && (
                <div className="rounded-xl bg-white p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Perimeter
                  </div>

                  <div className="mt-1 text-lg font-extrabold text-slate-900">
                    {formatNumber(
                      calculation.perimeter
                    )}{" "}
                    <span className="text-xs text-slate-500">
                      ft
                    </span>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            className="mt-6 w-full rounded-2xl bg-blue-800 px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-900 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            ✓ Save Measurement
          </button>

        </section>

        {/* Saved Measurements */}
        <section className="mt-6">

          <div className="mb-3 flex items-end justify-between gap-3">

            <div>
              <h2 className="text-lg font-extrabold text-slate-950">
                Saved Measurements
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Measurements saved on this device.
              </p>
            </div>

            {measurements.length > 0 && (
              <button
                type="button"
                onClick={clearAllMeasurements}
                className="rounded-lg px-2 py-2 text-xs font-bold text-red-600"
              >
                Clear All
              </button>
            )}

          </div>

          {measurements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">

              <div className="text-4xl">
                📐
              </div>

              <div className="mt-3 text-base font-extrabold text-slate-800">
                No measurements yet
              </div>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Add your first room, wall, floor or ceiling measurement above.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {measurements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      📐
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {item.name}
                          </h3>

                          <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-blue-700">
                            {typeLabel(item.type)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteMeasurement(item.id)
                          }
                          className="rounded-lg px-2 py-1 text-lg text-red-500"
                          aria-label={`Delete ${item.name}`}
                        >
                          ×
                        </button>

                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">

                        {item.calculated.floorArea > 0 && (
                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <div className="text-[10px] font-bold uppercase text-slate-400">
                              Floor
                            </div>

                            <div className="mt-0.5 text-sm font-extrabold text-slate-800">
                              {formatNumber(
                                item.calculated.floorArea
                              )}{" "}
                              sq.ft
                            </div>
                          </div>
                        )}

                        {item.calculated.wallArea > 0 && (
                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <div className="text-[10px] font-bold uppercase text-slate-400">
                              Wall
                            </div>

                            <div className="mt-0.5 text-sm font-extrabold text-slate-800">
                              {formatNumber(
                                item.calculated.wallArea
                              )}{" "}
                              sq.ft
                            </div>
                          </div>
                        )}

                        {item.calculated.netWallArea > 0 && (
                          <div className="rounded-lg bg-green-50 p-2.5">
                            <div className="text-[10px] font-bold uppercase text-green-600">
                              Net Wall
                            </div>

                            <div className="mt-0.5 text-sm font-extrabold text-green-700">
                              {formatNumber(
                                item.calculated.netWallArea
                              )}{" "}
                              sq.ft
                            </div>
                          </div>
                        )}

                        {item.calculated.ceilingArea > 0 && (
                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <div className="text-[10px] font-bold uppercase text-slate-400">
                              Ceiling
                            </div>

                            <div className="mt-0.5 text-sm font-extrabold text-slate-800">
                              {formatNumber(
                                item.calculated.ceilingArea
                              )}{" "}
                              sq.ft
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="mt-3 text-xs text-slate-500">
                        {item.dimensions.length}{" "}
                        {item.dimensions.lengthUnit}

                        {item.dimensions.width > 0 &&
                          ` × ${item.dimensions.width} ${item.dimensions.widthUnit}`}

                        {item.dimensions.height > 0 &&
                          ` × ${item.dimensions.height} ${item.dimensions.heightUnit}`}
                      </div>

                      {item.openings.openingArea > 0 && (
                        <div className="mt-2 text-xs font-semibold text-slate-500">
                          Openings deducted:{" "}
                          {formatNumber(
                            item.openings.openingArea
                          )}{" "}
                          sq.ft
                        </div>
                      )}

                      {item.notes && (
                        <div className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-xs leading-5 text-yellow-800">
                          <span className="font-bold">
                            Note:
                          </span>{" "}
                          {item.notes}
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default FieldMeasurement;