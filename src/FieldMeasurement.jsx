import { useEffect, useMemo, useState } from "react";

import {
  getRooms,
  saveProjectMeasurements,
} from "./ProjectStorage";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
  "renovatecalc_field_measurements";

/* =========================================================
   UNITS
========================================================= */

const LENGTH_UNITS = [
  ["ft", "Feet"],
  ["m", "Meter"],
  ["cm", "Centimeter"],
  ["mm", "Millimeter"],
  ["inch", "Inch"],
];

/* =========================================================
   MEASUREMENT TYPES
========================================================= */

const TYPES = [
  ["room", "Room"],
  ["wall", "Wall"],
  ["floor", "Floor"],
  ["ceiling", "Ceiling"],
  ["custom", "Custom"],
];

/* =========================================================
   INITIAL FORM
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const positiveNumber = (value) => {
  const number = toNumber(value);

  return number > 0
    ? number
    : 0;
};

const formatNumber = (value, decimals = 2) => {
  const number = toNumber(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits:
        number % 1 === 0
          ? 0
          : Math.min(decimals, 2),

      maximumFractionDigits:
        decimals,
    }
  );
};

/* =========================================================
   LENGTH CONVERSION
   Convert any supported length unit to feet.
========================================================= */

const toFeet = (
  value,
  unit
) => {
  const number = positiveNumber(value);

  if (!number) {
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

/* =========================================================
   UNIT SELECT
========================================================= */

function UnitSelect({
  value,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
}

/* =========================================================
   INPUT
========================================================= */

function FieldInput({
  label,
  value,
  onChange,
  type = "number",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
      />
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

function FieldMeasurement({
  selectedRoom: fieldModeRoom = null,
  onMeasurementsChange,
}) {
  /* -------------------------------------------------------
     SAVED MEASUREMENTS
  ------------------------------------------------------- */

  const [measurements, setMeasurements] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (!saved) {
          return [];
        }

        const parsed =
          JSON.parse(saved);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    });

  /* -------------------------------------------------------
     ROOMS
  ------------------------------------------------------- */

  const [rooms, setRooms] =
    useState(() => {
      try {
        const savedRooms =
          getRooms();

        return Array.isArray(
          savedRooms
        )
          ? savedRooms
          : [];
      } catch {
        return [];
      }
    });

  /* -------------------------------------------------------
     SELECTED ROOM
  ------------------------------------------------------- */

  const [selectedRoomId, setSelectedRoomId] =
    useState(
      fieldModeRoom?.id || ""
    );

  /* -------------------------------------------------------
     FORM
  ------------------------------------------------------- */

  const [form, setForm] =
    useState(initialForm);

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ROOMS
  ======================================================= */

  useEffect(() => {
    try {
      const savedRooms =
        getRooms();

      setRooms(
        Array.isArray(
          savedRooms
        )
          ? savedRooms
          : []
      );
    } catch {
      setRooms([]);
    }
  }, []);

  /* =======================================================
     SYNC FIELD MODE ROOM
  ======================================================= */

  useEffect(() => {
    if (!fieldModeRoom?.id) {
      return;
    }

    setSelectedRoomId(
      String(fieldModeRoom.id)
    );

    setForm((previous) => ({
      ...previous,

      name:
        fieldModeRoom.name ||
        previous.name,
    }));
  }, [fieldModeRoom]);

  /* =======================================================
     SELECTED ROOM OBJECT
  ======================================================= */

  const selectedRoom =
    useMemo(() => {
      if (!selectedRoomId) {
        return null;
      }

      return (
        rooms.find(
          (room) =>
            String(room.id) ===
            String(selectedRoomId)
        ) || null
      );
    }, [
      rooms,
      selectedRoomId,
    ]);

  /* =======================================================
     SAVE MEASUREMENTS
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          measurements
        )
      );
    } catch {
      // Ignore localStorage errors.
    }

    try {
      saveProjectMeasurements(
        measurements
      );
    } catch {
      // Ignore project-storage errors.
    }

    if (onMeasurementsChange) {
      onMeasurementsChange(
        measurements
      );
    }
  }, [
    measurements,
    onMeasurementsChange,
  ]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  /* =======================================================
     CALCULATION
  ======================================================= */

  const calculation =
    useMemo(() => {
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

      /* ---------------------------------------------------
         ROOM / FLOOR
      --------------------------------------------------- */

      const floorArea =
        length > 0 &&
        width > 0
          ? length * width
          : 0;

      const ceilingArea =
        floorArea;

      const perimeter =
        length > 0 &&
        width > 0
          ? 2 * (length + width)
          : 0;

      const wallArea =
        perimeter > 0 &&
        height > 0
          ? perimeter * height
          : 0;

      /* ---------------------------------------------------
         WALL TYPE
      --------------------------------------------------- */

      const singleWallArea =
        length > 0 &&
        height > 0
          ? length * height
          : 0;

      /* ---------------------------------------------------
         DOORS
      --------------------------------------------------- */

      const doorCount =
        Math.max(
          0,
          Math.floor(
            positiveNumber(
              form.doorCount
            )
          )
        );

      const doorWidth =
        toFeet(
          form.doorWidth,
          form.doorWidthUnit
        );

      const doorHeight =
        toFeet(
          form.doorHeight,
          form.doorHeightUnit
        );

      const singleDoorArea =
        doorWidth > 0 &&
        doorHeight > 0
          ? doorWidth *
            doorHeight
          : 0;

      const doorArea =
        singleDoorArea *
        doorCount;

      /* ---------------------------------------------------
         WINDOWS
      --------------------------------------------------- */

      const windowCount =
        Math.max(
          0,
          Math.floor(
            positiveNumber(
              form.windowCount
            )
          )
        );

      const windowWidth =
        toFeet(
          form.windowWidth,
          form.windowWidthUnit
        );

      const windowHeight =
        toFeet(
          form.windowHeight,
          form.windowHeightUnit
        );

      const singleWindowArea =
        windowWidth > 0 &&
        windowHeight > 0
          ? windowWidth *
            windowHeight
          : 0;

      const windowArea =
        singleWindowArea *
        windowCount;

      /* ---------------------------------------------------
         OPENINGS
      --------------------------------------------------- */

      const openingArea =
        doorArea +
        windowArea;

      /* ---------------------------------------------------
         NET WALL AREA
      --------------------------------------------------- */

      const netWallArea =
        Math.max(
          0,
          wallArea -
            openingArea
        );

      /* ---------------------------------------------------
         CUSTOM
      --------------------------------------------------- */

      let customArea = 0;

      if (
        form.type ===
        "custom"
      ) {
        customArea =
          floorArea;
      }

      /* ---------------------------------------------------
         RESULT AREA BASED ON TYPE
      --------------------------------------------------- */

      let primaryArea = 0;

      if (
        form.type ===
        "room"
      ) {
        primaryArea =
          floorArea;
      } else if (
        form.type ===
        "floor"
      ) {
        primaryArea =
          floorArea;
      } else if (
        form.type ===
        "ceiling"
      ) {
        primaryArea =
          ceilingArea;
      } else if (
        form.type ===
        "wall"
      ) {
        primaryArea =
          singleWallArea;
      } else if (
        form.type ===
        "custom"
      ) {
        primaryArea =
          customArea;
      }

      return {
        length,
        width,
        height,

        floorArea,
        ceilingArea,

        perimeter,
        wallArea,
        singleWallArea,

        doorCount,
        doorArea,

        windowCount,
        windowArea,

        openingArea,
        netWallArea,

        customArea,
        primaryArea,
      };
    }, [form]);

  /* =======================================================
     SAVE MEASUREMENT
  ======================================================= */

  const handleSaveMeasurement =
    () => {
      setError("");

      if (
        !form.name.trim()
      ) {
        setError(
          "Please enter a measurement name."
        );

        return;
      }

      if (
        !positiveNumber(
          form.length
        )
      ) {
        setError(
          "Please enter a valid length."
        );

        return;
      }

      if (
        (
          form.type ===
            "room" ||
          form.type ===
            "floor"
        ) &&
        !positiveNumber(
          form.width
        )
      ) {
        setError(
          "Please enter a valid width."
        );

        return;
      }

      if (
        (
          form.type ===
            "room" ||
          form.type ===
            "wall"
        ) &&
        !positiveNumber(
          form.height
        )
      ) {
        setError(
          "Please enter a valid height."
        );

        return;
      }

      const newMeasurement = {
        id: Date.now(),

        roomId:
          selectedRoom?.id ||
          null,

        roomName:
          selectedRoom?.name ||
          null,

        roomType:
          selectedRoom?.type ||
          null,

        name:
          form.name.trim(),

        type:
          form.type,

        dimensions: {
          length:
            Number(
              form.length
            ),

          lengthUnit:
            form.lengthUnit,

          width:
            Number(
              form.width
            ) || 0,

          widthUnit:
            form.widthUnit,

          height:
            Number(
              form.height
            ) || 0,

          heightUnit:
            form.heightUnit,
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

      setMeasurements(
        (previous) => [
          newMeasurement,
          ...previous,
        ]
      );

      setForm({
        ...initialForm,

        name:
          selectedRoom?.name ||
          "",

        type:
          "room",
      });
    };

  /* =======================================================
     DELETE MEASUREMENT
  ======================================================= */

  const handleDeleteMeasurement =
    (id) => {
      setMeasurements(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );
    };

  /* =======================================================
     CLEAR ALL
  ======================================================= */

  const handleClearAll =
    () => {
      if (
        measurements.length ===
        0
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Clear all saved field measurements?"
        );

      if (!confirmed) {
        return;
      }

      setMeasurements([]);
    };

  /* =======================================================
     ROOM CHANGE
  ======================================================= */

  const handleRoomChange =
    (event) => {
      const roomId =
        event.target.value;

      setSelectedRoomId(
        roomId
      );

      const room =
        rooms.find(
          (item) =>
            String(
              item.id
            ) ===
            String(roomId)
        );

      if (room) {
        setForm(
          (previous) => ({
            ...previous,

            name:
              room.name ||
              previous.name,
          })
        );
      }

      setError("");
    };

  /* =======================================================
     TYPE CHANGE
  ======================================================= */

  const handleTypeChange =
    (event) => {
      updateField(
        "type",
        event.target.value
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-4xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Field Measurement
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Enter site measurements and
                calculate areas automatically.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-4 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500">
                Saved
              </p>

              <p className="text-lg font-extrabold text-blue-700">
                {measurements.length}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ROOM MANAGEMENT LINK
        ================================================= */}

        <section className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-blue-900">
                Room Management Link
              </h2>

              <p className="mt-1 text-xs text-blue-700">
                Link this field measurement to a
                managed project room.
              </p>
            </div>

            {selectedRoom && (
              <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                {selectedRoom.name}
              </div>
            )}
          </div>

          <select
            value={
              selectedRoomId
            }
            onChange={
              handleRoomChange
            }
            className="w-full rounded-xl border border-blue-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              General Site
            </option>

            {rooms.map(
              (room) => (
                <option
                  key={room.id}
                  value={room.id}
                >
                  {room.name}
                  {room.type
                    ? ` — ${room.type}`
                    : ""}
                </option>
              )
            )}
          </select>

          {selectedRoom && (
            <div className="mt-3 rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
              <span className="font-bold text-blue-700">
                Linked room:
              </span>{" "}
              {selectedRoom.name}

              {selectedRoom.type && (
                <>
                  {" "}
                  ·{" "}
                  {selectedRoom.type}
                </>
              )}
            </div>
          )}
        </section>

        {/* =================================================
            MEASUREMENT FORM
        ================================================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="text-base font-extrabold text-slate-900">
              Measurement Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add dimensions, openings and notes.
            </p>
          </div>

          {/* -----------------------------------------------
              NAME + TYPE
          ----------------------------------------------- */}

          <div className="grid gap-4 sm:grid-cols-2">

            <FieldInput
              label="Measurement Name"
              type="text"
              value={form.name}
              onChange={(value) =>
                updateField(
                  "name",
                  value
                )
              }
              placeholder="Example: Master Bedroom"
            />

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">
                Measurement Type
              </label>

              <select
                value={
                  form.type
                }
                onChange={
                  handleTypeChange
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          {/* -----------------------------------------------
              DIMENSIONS
          ----------------------------------------------- */}

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-extrabold text-slate-800">
              Dimensions
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* LENGTH */}

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Length
                </label>

                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.length
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "length",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <UnitSelect
                    value={
                      form.lengthUnit
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "lengthUnit",
                        value
                      )
                    }
                  />
                </div>
              </div>

              {/* WIDTH */}

              {(form.type ===
                "room" ||
                form.type ===
                  "floor" ||
                form.type ===
                  "ceiling" ||
                form.type ===
                  "custom") && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Width
                  </label>

                  <div className="grid grid-cols-[1fr_120px] gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        form.width
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "width",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <UnitSelect
                      value={
                        form.widthUnit
                      }
                      onChange={(
                        value
                      ) =>
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

              {(form.type ===
                "room" ||
                form.type ===
                  "wall") && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-600">
                    Height
                  </label>

                  <div className="grid grid-cols-[1fr_120px] gap-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        form.height
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "height",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {/* FIXED */}
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
              DOORS
          ================================================= */}

          <div className="mt-7 border-t border-slate-100 pt-6">
            <h3 className="mb-3 text-sm font-extrabold text-slate-800">
              Doors
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">

              <FieldInput
                label="Door Count"
                value={
                  form.doorCount
                }
                onChange={(value) =>
                  updateField(
                    "doorCount",
                    value
                  )
                }
                placeholder="0"
              />

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Door Width
                </label>

                <div className="grid grid-cols-[1fr_110px] gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.doorWidth
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "doorWidth",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <UnitSelect
                    value={
                      form.doorWidthUnit
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "doorWidthUnit",
                        value
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Door Height
                </label>

                <div className="grid grid-cols-[1fr_110px] gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.doorHeight
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "doorHeight",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <UnitSelect
                    value={
                      form.doorHeightUnit
                    }
                    onChange={(
                      value
                    ) =>
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

          <div className="mt-7 border-t border-slate-100 pt-6">
            <h3 className="mb-3 text-sm font-extrabold text-slate-800">
              Windows
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">

              <FieldInput
                label="Window Count"
                value={
                  form.windowCount
                }
                onChange={(value) =>
                  updateField(
                    "windowCount",
                    value
                  )
                }
                placeholder="0"
              />

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Window Width
                </label>

                <div className="grid grid-cols-[1fr_110px] gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.windowWidth
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "windowWidth",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <UnitSelect
                    value={
                      form.windowWidthUnit
                    }
                    onChange={(
                      value
                    ) =>
                      updateField(
                        "windowWidthUnit",
                        value
                      )
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-600">
                  Window Height
                </label>

                <div className="grid grid-cols-[1fr_110px] gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      form.windowHeight
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "windowHeight",
                        event.target.value
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <UnitSelect
                    value={
                      form.windowHeightUnit
                    }
                    onChange={(
                      value
                    ) =>
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

          {/* =================================================
              NOTES
          ================================================= */}

          <div className="mt-7 border-t border-slate-100 pt-6">
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Notes
            </label>

            <textarea
              value={
                form.notes
              }
              onChange={(
                event
              ) =>
                updateField(
                  "notes",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Add site notes, special conditions, dimensions, etc."
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-4 text-sm font-extrabold text-blue-900">
              Live Calculation
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Floor Area
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.floorArea
                  )}{" "}
                  sq ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Ceiling Area
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.ceilingArea
                  )}{" "}
                  sq ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Wall Area
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.wallArea
                  )}{" "}
                  sq ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Net Wall Area
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.netWallArea
                  )}{" "}
                  sq ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Perimeter
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.perimeter
                  )}{" "}
                  ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Openings
                </p>

                <p className="mt-1 text-lg font-extrabold text-slate-900">
                  {formatNumber(
                    calculation.openingArea
                  )}{" "}
                  sq ft
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-bold text-slate-500">
                  Doors
                </p>

                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {calculation.doorCount}{" "}
                  ×{" "}
                  {formatNumber(
                    calculation.doorArea
                  )}{" "}
                  sq ft
                </p>
              </div>

              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-bold text-slate-500">
                  Windows
                </p>

                <p className="mt-1 text-sm font-extrabold text-slate-900">
                  {calculation.windowCount}{" "}
                  ×{" "}
                  {formatNumber(
                    calculation.windowArea
                  )}{" "}
                  sq ft
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={
              handleSaveMeasurement
            }
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Save Measurement
          </button>
        </section>

        {/* =================================================
            SAVED MEASUREMENTS
        ================================================= */}

        <section className="mt-6">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Saved Measurements
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Measurements saved in this project.
              </p>
            </div>

            {measurements.length >
              0 && (
              <button
                type="button"
                onClick={
                  handleClearAll
                }
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
              >
                Clear All
              </button>
            )}
          </div>

          {measurements.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
              <div className="text-3xl">
                📐
              </div>

              <p className="mt-3 text-sm font-bold text-slate-700">
                No measurements saved yet.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Enter your site dimensions above and
                save the measurement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {measurements.map(
                (measurement) => (
                  <div
                    key={
                      measurement.id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >

                    {/* CARD HEADER */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-900">
                            {
                              measurement.name
                            }
                          </h3>

                          <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                            {
                              TYPES.find(
                                (item) =>
                                  item[0] ===
                                  measurement.type
                              )?.[1] ||
                                measurement.type
                            }
                          </span>

                          {measurement.roomName && (
                            <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                              🏠{" "}
                              {
                                measurement.roomName
                              }
                            </span>
                          )}
                        </div>

                        {measurement.roomType && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              measurement.roomType
                            }
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteMeasurement(
                            measurement.id
                          )
                        }
                        className="self-start rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>

                    {/* DIMENSIONS */}

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Length
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-slate-900">
                          {
                            measurement.dimensions
                              ?.length
                          }{" "}
                          {
                            measurement.dimensions
                              ?.lengthUnit
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Width
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-slate-900">
                          {
                            measurement.dimensions
                              ?.width
                          }{" "}
                          {
                            measurement.dimensions
                              ?.widthUnit
                          }
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Height
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-slate-900">
                          {
                            measurement.dimensions
                              ?.height
                          }{" "}
                          {
                            measurement.dimensions
                              ?.heightUnit
                          }
                        </p>
                      </div>
                    </div>

                    {/* CALCULATED VALUES */}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                          Floor
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-blue-900">
                          {formatNumber(
                            measurement
                              .calculated
                              ?.floorArea
                          )}{" "}
                          sq ft
                        </p>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                          Ceiling
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-blue-900">
                          {formatNumber(
                            measurement
                              .calculated
                              ?.ceilingArea
                          )}{" "}
                          sq ft
                        </p>
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                          Wall
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-blue-900">
                          {formatNumber(
                            measurement
                              .calculated
                              ?.wallArea
                          )}{" "}
                          sq ft
                        </p>
                      </div>

                      <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-green-600">
                          Net Wall
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-green-900">
                          {formatNumber(
                            measurement
                              .calculated
                              ?.netWallArea
                          )}{" "}
                          sq ft
                        </p>
                      </div>
                    </div>

                    {/* OPENINGS */}

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <div className="grid gap-3 sm:grid-cols-3">

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Doors
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {
                              measurement.openings
                                ?.doorCount
                            }{" "}
                            doors
                          </p>

                          <p className="text-xs text-slate-500">
                            {formatNumber(
                              measurement
                                .openings
                                ?.doorArea
                            )}{" "}
                            sq ft
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Windows
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {
                              measurement.openings
                                ?.windowCount
                            }{" "}
                            windows
                          </p>

                          <p className="text-xs text-slate-500">
                            {formatNumber(
                              measurement
                                .openings
                                ?.windowArea
                            )}{" "}
                            sq ft
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Total Openings
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-slate-800">
                            {formatNumber(
                              measurement
                                .openings
                                ?.openingArea
                            )}{" "}
                            sq ft
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* NOTES */}

                    {measurement.notes && (
                      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Notes
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm text-amber-900">
                          {
                            measurement.notes
                          }
                        </p>
                      </div>
                    )}

                    {/* DATE */}

                    {measurement.createdAt && (
                      <p className="mt-3 text-right text-[10px] text-slate-400">
                        Saved{" "}
                        {new Date(
                          measurement.createdAt
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   ONLY DEFAULT EXPORT
========================================================= */

export default FieldMeasurement;