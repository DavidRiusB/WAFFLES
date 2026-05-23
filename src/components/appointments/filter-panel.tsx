"use client";

import { useState } from "react";
import { Select } from "../ui/select-component";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { status?: string; slot?: string; date?: string }) => void;
};

export function FilterPanel({ isOpen, onClose, onApply }: Props) {
  const [status, setStatus] = useState("");
  const [slot, setSlot] = useState("");
  const [date, setDate] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-80 h-full bg-surface border-l border-border p-6 flex flex-col gap-6">
        <h2 className="text-lg font-bold">Filters</h2>

        {/* Status */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted">Status</span>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </label>

        {/* Slot */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted">Slot</span>
          <Select value={slot} onChange={(e) => setSlot(e.target.value)}>
            <option value="">All</option>
            <option value="MORNING">Morning</option>
            <option value="MIDDAY">Afternoon</option>
            <option value="AFTERNOON">Evening</option>
          </Select>
        </label>

        {/* Date */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted">Date</span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={() => {
              setStatus("");
              setSlot("");
              setDate("");
            }}
          >
            Reset
          </Button>

          <Button
            fullWidth
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
          </Button>
        </div>
      </div>
    </div>
  );
}
