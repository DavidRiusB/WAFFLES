"use client";

import { Alert } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import clsx from "clsx";
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
        <h2 className="text-sm text-muted mb-2">Pick a date</h2>
        <div className="flex gap-2 overflow-x-auto">
          {availability.map((day) => {
            const isSelected = selectedDate === day.date;
            return (
              <button
                key={day.date}
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedSlot(null);
                }}
                className={clsx(
                  "px-4 py-2 rounded border whitespace-nowrap",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isSelected
                    ? "bg-secondary text-on-secondary border-secondary"
                    : "bg-surface text-foreground border-border hover:border-foreground",
                )}
              >
                {formatDay(day.date)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Slot cards */}
      {selectedDate && dayData && (
        <section>
          <h2 className="text-sm text-muted mb-2">Pick a slot</h2>
          <div className="grid grid-cols-3 gap-2">
            {dayData.slots.map((s) => {
              const isSelected = selectedSlot === s.slot;
              const isDisabled = !s.available;
              return (
                <button
                  key={s.slot}
                  disabled={isDisabled}
                  onClick={() => setSelectedSlot(s.slot)}
                  className={clsx(
                    "p-4 rounded border text-base font-bold",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isDisabled
                      ? "bg-border/40 text-muted/60 border-border cursor-not-allowed"
                      : isSelected
                        ? "bg-secondary text-on-secondary border-secondary"
                        : "bg-surface text-foreground border-border hover:border-foreground",
                  )}
                >
                  {s.slot}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 3: Notes + confirm */}
      {selectedSlot && (
        <section className="flex flex-col gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Notes (optional)</span>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </label>

          {submitError && <Alert variant="danger">{submitError}</Alert>}

          <Button
            onClick={handleConfirm}
            disabled={submitting}
            className="mt-2"
          >
            {submitting ? "Creating…" : "Confirm appointment"}
          </Button>
        </section>
      )}
    </div>
  );
}
