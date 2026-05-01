"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { status?: string; slot?: string; date?: string }) => void;
};

export function FilterPanel({ isOpen, onClose, onApply }: Props) {
  const [status, setStatus] = useState("");
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");

  const [filters, setFilters] = useState<{
    status?: string;
    slot?: string;
    date?: string;
  }>({});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-80 h-full bg-white shadow-xl p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold">Filters</h2>

        {/* Status */}
        <div>
          <label className="text-sm text-gray-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full mt-1"
          >
            <option value="">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Slot */}
        <div>
          <label className="text-sm text-gray-500">Slot</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="border p-2 w-full mt-1"
          >
            <option value="">All</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm text-gray-500">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full mt-1"
          />
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            className="flex-1 border p-2 rounded"
            onClick={() => {
              setStatus("");
              setSlot("");
              setDate("");
            }}
          >
            Reset
          </button>

          <button
            className="flex-1 bg-yellow-400 text-black p-2 rounded"
            onClick={() => {
              onApply({
                status: status || undefined,
                slot: slot || undefined,
                date: date || undefined,
              });

              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
