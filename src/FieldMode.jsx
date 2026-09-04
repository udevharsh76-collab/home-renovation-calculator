import React, { useEffect, useState } from "react";

import { getRooms } from "./ProjectStorage";

function FieldMode({
  onMeasurement,
  onMaterial,
  onLabour,
  onPhoto,
  onCalculate,
  onBOQ,
  onEstimate,
  selectedRoom,
  onRoomSelect,
  onManageRooms,
}) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const savedRooms = getRooms();
    setRooms(Array.isArray(savedRooms) ? savedRooms : []);
  }, []);

  const handleRoomChange = (event) => {
    const roomId = event.target.value;

    if (!roomId) {
      onRoomSelect?.(null);
      return;
    }

    const room = rooms.find((item) => String(item.id) === String(roomId));

    if (room) {
      onRoomSelect?.(room);
    }
  };

  const fieldActions = [
    {
      title: "Measurements",
      description: "Record room and site measurements",
      icon: "📐",
      action: onMeasurement,
    },
    {
      title: "Materials",
      description: "Calculate required materials",
      icon: "🧱",
      action: onMaterial,
    },
    {
      title: "Labour",
      description: "Add labour types and quantities",
      icon: "👷",
      action: onLabour,
    },
    {
      title: "Site Photos",
      description: "Capture before, during and after photos",
      icon: "📷",
      action: onPhoto,
    },
    {
      title: "Calculate",
      description: "Calculate project quantities and costs",
      icon: "🧮",
      action: onCalculate,
    },
    {
      title: "BOQ",
      description: "Prepare bill of quantities",
      icon: "📋",
      action: onBOQ,
    },
    {
      title: "Estimate",
      description: "View complete project estimate",
      icon: "💰",
      action: onEstimate,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7">

        {/* HEADER */}
        <section className="mb-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Site Field Mode
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Quickly record measurements, materials, labour and
              site information while working on a project.
            </p>
          </div>
        </section>

        {/* ROOM SELECTION */}
        <section className="mb-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">

            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Current Room
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select the room you are currently working in.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onManageRooms?.()}
                className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Manage Rooms
              </button>
            </div>

            <select
              value={selectedRoom?.id || ""}
              onChange={handleRoomChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                General Site
              </option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>

            {selectedRoom ? (
              <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold text-blue-600">
                  Working in
                </p>

                <p className="mt-1 text-sm font-bold text-blue-900">
                  {selectedRoom.name}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                No room selected. Information will be recorded under
                General Site.
              </p>
            )}
          </div>
        </section>

        {/* FIELD ACTIONS */}
        <section>
          <div className="mb-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Field Tools
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select what you want to record or calculate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {fieldActions.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                disabled={!item.action}
                className={`group rounded-2xl border border-blue-100 bg-white p-4 text-left shadow-sm transition ${
                  item.action
                    ? "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                    : "cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <span className="text-lg text-slate-300 transition group-hover:text-blue-500">
                        →
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                </div>
              </button>
            ))}

          </div>
        </section>

        {/* CURRENT ROOM STATUS */}
        <section className="mt-5">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                📍
              </div>

              <div>
                <p className="text-xs font-semibold text-blue-600">
                  Field Mode Active
                </p>

                <p className="text-sm font-bold text-blue-900">
                  {selectedRoom?.name || "General Site"}
                </p>
              </div>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default FieldMode;