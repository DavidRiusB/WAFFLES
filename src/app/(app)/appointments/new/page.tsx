"use client";

import { Alert } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { formatDay } from "@/src/lib/formatters";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AvailabilityDay = {
  date: string;
  slots: { slot: string; available: boolean }[];
};

type CurrentUser = {
  id: number;
  email: string;
  verified: boolean;
  addresses?: { id: number; isPrimary: boolean }[];
};

export default function NewAppointmentPage() {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Resend verification
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
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
        const userData: CurrentUser = await userRes.json();

        setAvailability(availData);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleResend = async () => {
    setResendMsg(null);
    setResending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Could not resend verification email");
      }
      setResendMsg({
        type: "ok",
        text: "Verification email sent — check your inbox.",
      });
    } catch (err) {
      setResendMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setResending(false);
    }
  };

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

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return null;

  const hasAddress = (user.addresses?.length ?? 0) > 0;

  // Address gate
  if (!hasAddress) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-2xl font-bold">Book a visit</h1>
        <Alert variant="warning" title="Address required">
          You need to add an address before booking. The technician needs to
          know where to go.
          <div className="mt-2">
            <Link
              href="/account"
              className="inline-flex items-center justify-center rounded font-bold px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition-opacity"
            >
              Add address
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  const dayData = availability.find((d) => d.date === selectedDate);
  const isVerified = user.verified;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Book a visit</h1>

      <button
        onClick={() => router.push("/appointments")}
        className="text-sm text-accent hover:underline"
      >
        ← Back
      </button>

      {!isVerified && (
        <Alert variant="warning" title="Verify your email to book">
          We sent a verification link to <strong>{user.email}</strong>. Check
          your inbox before confirming a booking.
          <div className="mt-2 flex flex-col gap-2">
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Sending…" : "Resend verification email"}
              </Button>
            </div>
            {resendMsg && (
              <p
                className={clsx(
                  "text-sm",
                  resendMsg.type === "ok"
                    ? "text-success-text"
                    : "text-danger-text",
                )}
              >
                {resendMsg.text}
              </p>
            )}
          </div>
        </Alert>
      )}

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
            disabled={submitting || !isVerified}
            className="mt-2"
          >
            {submitting
              ? "Creating…"
              : isVerified
                ? "Confirm appointment"
                : "Verify email to confirm"}
          </Button>
        </section>
      )}
    </div>
  );
}
