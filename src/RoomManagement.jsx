import React, { useEffect, useState } from "react";

import {
  getRooms,
  saveRoom,
  updateRoom,
  removeRoom,
} from "./ProjectStorage";

const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Toilet",
  "Dining Room",
  "Balcony",
  "Pooja Room",
  "Store Room",
  "Office",
  "Other",
];

export default function RoomManagement({ onBack, onHome, onRoomSelect, }) {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("Bedroom");

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [error, setError] = useState("");

  const loadRooms = () => {
    setRooms(getRooms());
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const resetForm = () => {
    setRoomName("");
    setRoomType("Bedroom");
    setEditingRoom(null);
    setError("");
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = roomName.trim();

    if (!cleanName) {
      setError("Please enter a room name.");
      return;
    }

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        name: cleanName,
        type: roomType,
      });
    } else {
      saveRoom({
        name: cleanName,
        type: roomType,
      });
    }

    loadRooms();
    resetForm();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setRoomType(room.type || "Other");
    setError("");
    setShowForm(true);
  };

  const handleDelete = (room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${room.name}"?`
    );

    if (!confirmed) return;

    removeRoom(room.id);

    if (selectedRoomId === room.id) {
      setSelectedRoomId(null);
    }

    loadRooms();
  };

 const handleSelect = (room) => {
  setSelectedRoomId(room.id);

  onRoomSelect?.(room);

  onBack?.();
};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-blue-800">
              Renovate<span className="text-slate-900">Calc</span>
            </div>

            <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Room-wise Renovation
            </div>
          </div>

        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Manage Rooms
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage rooms for this renovation project.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Room
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the room details below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Room Name
                  </label>

                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Example: Master Bedroom"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Room Type
                  </label>

                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {ROOM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700"
                >
                  {editingRoom ? "Update Room" : "Save Room"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Room List */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-extrabold text-slate-900">
              Project Rooms
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {rooms.length} room{rooms.length !== 1 ? "s" : ""} added
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {rooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
                <div className="text-4xl">🏠</div>

                <h3 className="mt-3 text-lg font-extrabold text-slate-800">
                  No rooms added yet
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  Add rooms such as Living Room, Bedroom, Kitchen or Bathroom
                  to organize your renovation work room-by-room.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
                >
                  + Add First Room
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;

                  return (
                    <div
                      key={room.id}
                      className={`rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                          🏠
                        </div>

                        {isSelected && (
                          <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                            Selected
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {room.name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-blue-600">
                          {room.type}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelect(room)}
                          className={`rounded-lg px-3 py-2 text-xs font-extrabold transition ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          Select
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(room)}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(room)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Future Feature Notice */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <div className="text-xl">💡</div>

            <div>
              <h3 className="font-extrabold text-blue-900">
                Room-wise renovation is being prepared
              </h3>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                In the next step, measurements, materials, labour and BOQ
                items can be connected to the selected room.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}