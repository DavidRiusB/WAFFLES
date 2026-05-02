"use client";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select } from "@/src/components/ui/select-component";
import { Textarea } from "@/src/components/ui/textarea";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function NewAppointmentPage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          date,
          slot,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create appointment");
      }
      router.push("/appointments");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
      {/* Header */}
      <h1 className="text-2xl font-bold">New Appointment</h1>

      {/* Date */}
      <div>
        <label className="text-sm text-gray-500">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Slot */}
      <div>
        <label className="text-sm text-gray-500">Time Slot</label>
        <Select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="border p-2 w-full mt-1 rounded"
        >
          <option value="">Select a slot</option>
          <option value="MORNING">Morning ☀️</option>
          <option value="MIDDAY">Midday 🌤️</option>
          <option value="AFTERNOON">Afternoon 🌇</option>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm text-gray-500">Notes (optional)</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full mt-1 rounded"
          rows={3}
        />
      </div>

      {/* Submit */}
      <Button type="submit">Create Appointment</Button>
    </form>
  );
}
