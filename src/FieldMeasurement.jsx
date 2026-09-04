import { useEffect, useMemo, useState } from "react";
import { saveProjectMeasurements } from "./ProjectStorage";

const STORAGE_KEY = "renovatecalc_field_measurements";

const LENGTH_UNITS = [
  ["ft", "Feet"],
  ["m", "Meter"],
  ["cm", "Centimeter"],
  ["mm", "Millimeter"],
  ["inch", "Inch"],
];

const TYPES = [
  ["room", "Room"],
  ["wall", "Wall"],
  ["floor", "Floor"],
  ["ceiling", "Ceiling"],
  ["custom", "Custom"],
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

function FieldMeasurement({ onMeasurementsChange }) {
  /* =========================================================
     LOAD SAVED MEASUREMENTS
  ========================================================= */

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

  /* =========================================================
     FORM
  ========================================================= */

  const [form, setForm] = useState(initialForm);

  const [showOpenings, setShowOpenings] = useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     SAVE MEASUREMENTS
     
     Keeps the old localStorage key and also synchronizes
     measurements with ProjectStorage.
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(measurements)
    );

    saveProjectMeasurements(measurements);

    if (onMeasurementsChange) {
      onMeasurementsChange(measurements);
    }
  }, [measurements, onMeasurementsChange]);

  /* =========================================================
     UPDATE FORM
  ========================================================= */

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  /* =========================================================
     UNIT CONVERSION
  ========================================================= */

  const toFeet = (value, unit) => {
    const number = Number(value) || 0;

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

  /* =========================================================
     FORMAT NUMBER
  ========================================================= */

  const formatNumber = (value, decimals = 2) => {
    const number = Number(value) || 0;

    return number.toFixed(decimals);
  };

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const calculation = useMemo(() => {
    const length = toFeet(
      form.length,
      form.lengthUnit
    );

    const width = toFeet(
      form.width,
      form.widthUnit
    );

    const height = toFeet(
      form.height,
      form.heightUnit
    );

    let floorArea = 0;
    let ceilingArea = 0;
    let wallArea = 0;
    let perimeter = 0;

    /* -------------------------------------------------------
       ROOM
    ------------------------------------------------------- */

    if (form.type === "room") {
      if (length > 0 && width > 0) {
        floorArea = length * width;

        ceilingArea = floorArea;

        perimeter =
          2 * (length + width);

        if (height > 0) {
          wallArea =
            perimeter * height;
        }
      }
    }

    /* -------------------------------------------------------
       FLOOR
    ------------------------------------------------------- */

    if (form.type === "floor") {
      if (length > 0 && width > 0) {
        floorArea = length * width;

        perimeter =
          2 * (length + width);
      }
    }

    /* -------------------------------------------------------
       CEILING
    ------------------------------------------------------- */

    if (form.type === "ceiling") {
      if (length > 0 && width > 0) {
        ceilingArea = length * width;

        perimeter =
          2 * (length + width);
      }
    }

    /* -------------------------------------------------------
       WALL
    ------------------------------------------------------- */

    if (form.type === "wall") {
      if (length > 0 && height > 0) {
        wallArea = length * height;

        perimeter = length;
      }
    }

    /* -------------------------------------------------------
       CUSTOM
    ------------------------------------------------------- */

    if (form.type === "custom") {
      if (length > 0 && width > 0) {
        floorArea = length * width;

        ceilingArea = floorArea;

        perimeter =
          2 * (length + width);
      }

      if (length > 0 && height > 0) {
        wallArea = length * height;
      }
    }

    /* =======================================================
       DOORS
    ======================================================= */

    const doorCount =
      Number(form.doorCount) || 0;

    const doorWidth = toFeet(
      form.doorWidth,
      form.doorWidthUnit
    );

    const doorHeight = toFeet(
      form.doorHeight,
      form.doorHeightUnit
    );

    const doorArea =
      doorCount > 0 &&
      doorWidth > 0 &&
      doorHeight > 0
        ? doorCount *
          doorWidth *
          doorHeight
        : 0;

    /* =======================================================
       WINDOWS
    ======================================================= */

    const windowCount =
      Number(form.windowCount) || 0;

    const windowWidth = toFeet(
      form.windowWidth,
      form.windowWidthUnit
    );

    const windowHeight = toFeet(
      form.windowHeight,
      form.windowHeightUnit
    );

    const windowArea =
      windowCount > 0 &&
      windowWidth > 0 &&
      windowHeight > 0
        ? windowCount *
          windowWidth *
          windowHeight
        : 0;

    /* =======================================================
       OPENINGS
    ======================================================= */

    const openingArea =
      doorArea + windowArea;

    /* =======================================================
       NET WALL AREA
    ======================================================= */

    const netWallArea = Math.max(
      0,
      wallArea - openingArea
    );

    return {
      length,
      width,
      height,

      floorArea,
      ceilingArea,
      wallArea,
      netWallArea,
      perimeter,

      doorCount,
      doorArea,

      windowCount,
      windowArea,

      openingArea,
    };
  }, [form]);

  /* =========================================================
     SAVE MEASUREMENT
  ========================================================= */

  const handleSave = () => {
    setError("");

    /* -------------------------------------------------------
       NAME
    ------------------------------------------------------- */

    if (!form.name.trim()) {
      setError(
        "Please enter a room or area name."
      );

      return;
    }

    /* -------------------------------------------------------
       LENGTH
    ------------------------------------------------------- */

    if (
      !form.length ||
      Number(form.length) <= 0
    ) {
      setError(
        "Please enter a valid length."
      );

      return;
    }

    /* -------------------------------------------------------
       WIDTH
    ------------------------------------------------------- */

    if (
      ["room", "floor", "ceiling"].includes(
        form.type
      )
    ) {
      if (
        !form.width ||
        Number(form.width) <= 0
      ) {
        setError(
          "Please enter a valid width."
        );

        return;
      }
    }

    /* -------------------------------------------------------
       HEIGHT
    ------------------------------------------------------- */

    if (
      ["room", "wall"].includes(
        form.type
      )
    ) {
      if (
        !form.height ||
        Number(form.height) <= 0
      ) {
        setError(
          "Please enter a valid height."
        );

        return;
      }
    }

    /* =======================================================
       CREATE MEASUREMENT
    ======================================================= */

    const newMeasurement = {
      id: Date.now(),

      name: form.name.trim(),

      type: form.type,

      dimensions: {
        length: Number(form.length),
        lengthUnit: form.lengthUnit,

        width:
          Number(form.width) || 0,

        widthUnit: form.widthUnit,

        height:
          Number(form.height) || 0,

        heightUnit: form.heightUnit,
      },

      openings: {
        doorCount:
          calculation.doorCount,

        doorArea:
          calculation.doorArea,

        windowCount:
          calculation.windowCount,

        windowArea:
          calculation.windowArea,

        openingArea:
          calculation.openingArea,
      },

      calculated: {
        floorArea:
          calculation.floorArea,

        ceilingArea:
          calculation.ceilingArea,

        wallArea:
          calculation.wallArea,

        netWallArea:
          calculation.netWallArea,

        perimeter:
          calculation.perimeter,
      },

      notes:
        form.notes.trim(),

      createdAt:
        new Date().toISOString(),
    };

    /* =======================================================
       ADD TO LIST
    ======================================================= */

    setMeasurements((previous) => [
      newMeasurement,
      ...previous,
    ]);

    /* =======================================================
       RESET FORM
    ======================================================= */

    setForm(initialForm);

    setShowOpenings(false);
  };

  /* =========================================================
     DELETE MEASUREMENT
  ========================================================= */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Delete this measurement?"
    );

    if (!confirmed) {
      return;
    }

    setMeasurements((previous) =>
      previous.filter(
        (measurement) =>
          measurement.id !== id
      )
    );
  };

  /* =========================================================
     CLEAR ALL
  ========================================================= */

  const handleClearAll = () => {
    if (measurements.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Delete all saved measurements?"
    );

    if (!confirmed) {
      return;
    }

    setMeasurements([]);
  };

  /* =========================================================
     UNIT SELECT COMPONENT
  ========================================================= */

  const UnitSelect = ({
    value,
    onChange,
  }) => (
    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
    >
      {LENGTH_UNITS.map(
        ([unit, label]) => (
          <option
            key={unit}
            value={unit}
          >
            {label}
          </option>
        )
      )}
    </select>
  );

  /* =========================================================
     INPUT COMPONENT
  ========================================================= */

  const Input = ({
    label,
    value,
    onChange,
    placeholder,
  }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              Field Mode
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Add Measurement
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Record actual site measurements and
              automatically calculate floor area,
              ceiling area, wall area, openings and
              net wall area.
            </p>
          </div>

          {/* =================================================
              MEASUREMENT FORM
          ================================================= */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5">
              <h2 className="text-xl font-bold text-slate-950">
                Measurement Details
              </h2>

              <p className="text-sm text-slate-500">
                Enter dimensions exactly as measured
                at the site.
              </p>
            </div>

            {/* =================================================
                BASIC DETAILS
            ================================================= */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Room / Area Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Example: Living Room"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Measurement Type
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      "type",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  {TYPES.map(
                    ([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* =================================================
                DIMENSIONS
            ================================================= */}

            <div className="mt-6">

              <h3 className="text-base font-bold text-slate-900">
                Dimensions
              </h3>

              <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* LENGTH */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Length
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={form.length}
                      onChange={(event) =>
                        updateField(
                          "length",
                          event.target.value
                        )
                      }
                      placeholder="Enter length"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />

                    <UnitSelect
                      value={
                        form.lengthUnit
                      }
                      onChange={(value) =>
                        updateField(
                          "lengthUnit",
                          value
                        )
                      }
                    />
                  </div>
                </div>

                {/* WIDTH */}

                {(form.type === "room" ||
                  form.type === "floor" ||
                  form.type === "ceiling" ||
                  form.type === "custom") && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Width
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={form.width}
                        onChange={(event) =>
                          updateField(
                            "width",
                            event.target.value
                          )
                        }
                        placeholder="Enter width"
                        className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      />

                      <UnitSelect
                        value={
                          form.widthUnit
                        }
                        onChange={(value) =>
                          updateField(
                            "widthUnit",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* HEIGHT */}

                {(form.type === "room" ||
                  form.type === "wall" ||
                  form.type === "custom") && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Height
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={form.height}
                        onChange={(event) =>
                          updateField(
                            "height",
                            event.target.value
                          )
                        }
                        placeholder="Enter height"
                        className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                      />

                      <UnitSelect
                        value={
                          form.heightUnit
                        }
                        onChange={(value) =>
                          updateField(
                            "heightUnit",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                DOORS & WINDOWS
            ================================================= */}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50">

              <button
                type="button"
                onClick={() =>
                  setShowOpenings(
                    (previous) =>
                      !previous
                  )
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    Doors & Windows
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Used automatically to calculate
                    Net Wall Area.
                  </p>
                </div>

                <span className="text-lg font-bold text-blue-700">
                  {showOpenings
                    ? "−"
                    : "+"}
                </span>
              </button>

              {showOpenings && (
                <div className="border-t border-slate-200 p-5">

                  {/* =================================================
                      DOORS
                  ================================================= */}

                  <div>
                    <h4 className="font-bold text-slate-900">
                      Doors
                    </h4>

                    <div className="mt-4 grid gap-5 md:grid-cols-3">

                      <Input
                        label="Number of Doors"
                        value={
                          form.doorCount
                        }
                        onChange={(value) =>
                          updateField(
                            "doorCount",
                            value
                          )
                        }
                        placeholder="Example: 2"
                      />

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Door Width
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={
                              form.doorWidth
                            }
                            onChange={(event) =>
                              updateField(
                                "doorWidth",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Width"
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          />

                          <UnitSelect
                            value={
                              form.doorWidthUnit
                            }
                            onChange={(value) =>
                              updateField(
                                "doorWidthUnit",
                                value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Door Height
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={
                              form.doorHeight
                            }
                            onChange={(event) =>
                              updateField(
                                "doorHeight",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Height"
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          />

                          <UnitSelect
                            value={
                              form.doorHeightUnit
                            }
                            onChange={(value) =>
                              updateField(
                                "doorHeightUnit",
                                value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      WINDOWS
                  ================================================= */}

                  <div className="mt-8 border-t border-slate-200 pt-6">

                    <h4 className="font-bold text-slate-900">
                      Windows
                    </h4>

                    <div className="mt-4 grid gap-5 md:grid-cols-3">

                      <Input
                        label="Number of Windows"
                        value={
                          form.windowCount
                        }
                        onChange={(value) =>
                          updateField(
                            "windowCount",
                            value
                          )
                        }
                        placeholder="Example: 3"
                      />

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Window Width
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={
                              form.windowWidth
                            }
                            onChange={(event) =>
                              updateField(
                                "windowWidth",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Width"
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          />

                          <UnitSelect
                            value={
                              form.windowWidthUnit
                            }
                            onChange={(value) =>
                              updateField(
                                "windowWidthUnit",
                                value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Window Height
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={
                              form.windowHeight
                            }
                            onChange={(event) =>
                              updateField(
                                "windowHeight",
                                event.target
                                  .value
                              )
                            }
                            placeholder="Height"
                            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                          />

                          <UnitSelect
                            value={
                              form.windowHeightUnit
                            }
                            onChange={(value) =>
                              updateField(
                                "windowHeightUnit",
                                value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OPENING SUMMARY */}

                  <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="grid gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Door Area
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-slate-900">
                          {formatNumber(
                            calculation.doorArea
                          )}{" "}
                          sq.ft
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Window Area
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-slate-900">
                          {formatNumber(
                            calculation.windowArea
                          )}{" "}
                          sq.ft
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Total Opening
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-blue-800">
                          {formatNumber(
                            calculation.openingArea
                          )}{" "}
                          sq.ft
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                NOTES
            ================================================= */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Example: Existing floor to be removed. Wall has dampness near window."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* =================================================
                LIVE CALCULATION
            ================================================= */}

            <div className="mt-8">

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Live Calculation
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Calculated automatically from your
                  measurements.
                </p>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                {/* FLOOR */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Floor Area
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {formatNumber(
                      calculation.floorArea
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    sq.ft
                  </p>
                </div>

                {/* CEILING */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Ceiling Area
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {formatNumber(
                      calculation.ceilingArea
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    sq.ft
                  </p>
                </div>

                {/* WALL */}

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Wall Area
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {formatNumber(
                      calculation.wallArea
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    sq.ft
                  </p>
                </div>

                {/* NET WALL */}

                <div className="rounded-2xl border border-blue-200 bg-blue-100 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                    Net Wall Area
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-blue-900">
                    {formatNumber(
                      calculation.netWallArea
                    )}
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    after openings
                  </p>
                </div>

                {/* PERIMETER */}

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Perimeter
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-slate-950">
                    {formatNumber(
                      calculation.perimeter
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    running ft
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                SAVE BUTTON
            ================================================= */}

            <div className="mt-8 flex justify-end">

              <button
                type="button"
                onClick={handleSave}
                className="w-full rounded-xl bg-blue-800 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 sm:w-auto"
              >
                ✓ Save Measurement
              </button>

            </div>
          </section>

          {/* =================================================
              SAVED MEASUREMENTS
          ================================================= */}

          <section className="mt-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                  Saved Data
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                  Saved Measurements
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  These measurements are saved to the
                  current RenovateCalc project.
                </p>
              </div>

              {measurements.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear All
                </button>
              )}

            </div>

            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {measurements.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  📐
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No Measurements Saved
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first site measurement above.
                </p>

              </div>
            ) : (
              <div className="mt-5 space-y-4">

                {measurements.map(
                  (measurement) => (
                    <div
                      key={measurement.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      {/* =================================================
                          CARD HEADER
                      ================================================= */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-extrabold text-slate-950">
                              {measurement.name}
                            </h3>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-700">
                              {measurement.type}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            Saved{" "}
                            {measurement.createdAt
                              ? new Date(
                                  measurement.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : ""}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              measurement.id
                            )
                          }
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                      {/* =================================================
                          DIMENSIONS
                      ================================================= */}

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Length
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {measurement.dimensions?.length ||
                              0}{" "}
                            {measurement.dimensions
                              ?.lengthUnit || "ft"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Width
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {measurement.dimensions?.width ||
                              0}{" "}
                            {measurement.dimensions
                              ?.widthUnit || "ft"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Height
                          </p>

                          <p className="mt-1 font-bold text-slate-900">
                            {measurement.dimensions?.height ||
                              0}{" "}
                            {measurement.dimensions
                              ?.heightUnit || "ft"}
                          </p>
                        </div>

                      </div>

                      {/* =================================================
                          CALCULATED RESULTS
                      ================================================= */}

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                        <div>
                          <p className="text-xs text-slate-500">
                            Floor Area
                          </p>

                          <p className="font-bold text-slate-900">
                            {formatNumber(
                              measurement.calculated
                                ?.floorArea
                            )}{" "}
                            sq.ft
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Ceiling Area
                          </p>

                          <p className="font-bold text-slate-900">
                            {formatNumber(
                              measurement.calculated
                                ?.ceilingArea
                            )}{" "}
                            sq.ft
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Wall Area
                          </p>

                          <p className="font-bold text-slate-900">
                            {formatNumber(
                              measurement.calculated
                                ?.wallArea
                            )}{" "}
                            sq.ft
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Net Wall Area
                          </p>

                          <p className="font-bold text-blue-800">
                            {formatNumber(
                              measurement.calculated
                                ?.netWallArea
                            )}{" "}
                            sq.ft
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Perimeter
                          </p>

                          <p className="font-bold text-slate-900">
                            {formatNumber(
                              measurement.calculated
                                ?.perimeter
                            )}{" "}
                            ft
                          </p>
                        </div>

                      </div>

                      {/* =================================================
                          OPENINGS
                      ================================================= */}

                      {(Number(
                        measurement.openings
                          ?.doorCount
                      ) > 0 ||
                        Number(
                          measurement.openings
                            ?.windowCount
                        ) > 0) && (
                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Openings
                          </p>

                          <div className="mt-3 flex flex-wrap gap-5 text-sm">

                            <span>
                              <strong>
                                Doors:
                              </strong>{" "}
                              {measurement.openings
                                ?.doorCount || 0}
                            </span>

                            <span>
                              <strong>
                                Door Area:
                              </strong>{" "}
                              {formatNumber(
                                measurement.openings
                                  ?.doorArea
                              )}{" "}
                              sq.ft
                            </span>

                            <span>
                              <strong>
                                Windows:
                              </strong>{" "}
                              {measurement.openings
                                ?.windowCount || 0}
                            </span>

                            <span>
                              <strong>
                                Window Area:
                              </strong>{" "}
                              {formatNumber(
                                measurement.openings
                                  ?.windowArea
                              )}{" "}
                              sq.ft
                            </span>

                            <span className="font-bold text-blue-800">
                              Total Opening:{" "}
                              {formatNumber(
                                measurement.openings
                                  ?.openingArea
                              )}{" "}
                              sq.ft
                            </span>

                          </div>
                        </div>
                      )}

                      {/* =================================================
                          NOTES
                      ================================================= */}

                      {measurement.notes && (
                        <div className="mt-4 border-t border-slate-100 pt-4">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Notes
                          </p>

                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                            {measurement.notes}
                          </p>

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}

export default FieldMeasurement;