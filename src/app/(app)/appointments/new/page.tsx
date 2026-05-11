"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AvailabilityDay = {
  date: string;
  slots: { slot: string; available: boolean }[];
};

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function NewAppointmentPage() {
  // Availability
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);

  // Address gate
  const [hasAddress, setHasAddress] = useState(false);

  // Shared load state for both fetches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        // Fetch in parallel
        const [availRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/appointments/availability`, {
            credentials: "include",
          }),
          fetch(`${API_BASE}/users/me`, { credentials: "include" }),
        ]);

        if (!availRes.ok) {
          const data = await availRes.json().catch(() => null);
          throw new Error(data?.message || "Failed to load availability");
        }
        if (!userRes.ok) {
          const data = await userRes.json().catch(() => null);
          throw new Error(data?.message || "Failed to load profile");
        }

        const availData = await availRes.json();
        const userData = await userRes.json();

        setAvailability(availData);
        setHasAddress((userData.addresses?.length ?? 0) > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: selectedDate,
          slot: selectedSlot,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to create appointment");
      }

      router.push("/appointments");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  // ⬇️ Address gate
  if (!hasAddress) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl p-6">
        <h1 className="text-2xl font-bold">Book a visit</h1>
        <div className="border border-dashed rounded p-6 flex flex-col gap-3">
          <p>
            You need to add an address before booking. The technician needs to
            know where to go.
          </p>
          <Link
            href="/account"
            className="bg-black text-white rounded p-2 self-start"
          >
            Add address
          </Link>
        </div>
      </div>
    );
  }

  const dayData = availability.find((d) => d.date === selectedDate);

  return (
    <div className="flex flex-col gap-8 max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Book a visit</h1>

      {/* Step 1: Date strip */}
      <section>
        <h2 className="text-sm text-gray-500 mb-2">Pick a date</h2>
        <div className="flex gap-2 overflow-x-auto">
          {availability.map((day) => (
            <button
              key={day.date}
              onClick={() => {
                setSelectedDate(day.date);
                setSelectedSlot(null);
              }}
              className={`px-4 py-2 rounded border ${
                selectedDate === day.date ? "bg-black text-white" : "bg-white"
              }`}
            >
              {formatDay(day.date)}
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: Slot cards */}
      {selectedDate && dayData && (
        <section>
          <h2 className="text-sm text-gray-500 mb-2">Pick a slot</h2>
          <div className="grid grid-cols-3 gap-2">
            {dayData.slots.map((s) => (
              <button
                key={s.slot}
                disabled={!s.available}
                onClick={() => setSelectedSlot(s.slot)}
                className={`p-4 rounded border ${
                  !s.available
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selectedSlot === s.slot
                      ? "bg-black text-white"
                      : "bg-white"
                }`}
              >
                {s.slot}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 3: Notes + confirm */}
      {selectedSlot && (
        <section className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border rounded p-2"
            rows={3}
          />

          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="bg-black text-white rounded p-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating…" : "Confirm appointment"}
          </button>
        </section>
      )}
    </div>
  );
}
