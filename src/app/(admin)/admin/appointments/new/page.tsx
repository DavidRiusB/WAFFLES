"use client";

import { Alert } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { formatDay } from "@/src/lib/formatters";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AvailabilityDay = {
  date: string;
  slots: { slot: string; available: boolean }[];
};

type SearchUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
};

type Address = {
  id: number;
  number: number;
  cardinalDirection: string | null;
  streetName: string;
  suffix: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
};

type UserDetail = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  verified: boolean;
  addresses: Address[];
};

export default function AdminNewAppointmentPage() {
  // Availability
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Customer search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Selected customer (hydrated with full details)
  const [selectedCustomer, setSelectedCustomer] = useState<UserDetail | null>(
    null,
  );
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  // Booking selection
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  // Load availability on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/appointments/availability`, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load availability");
        }
        const data = await res.json();
        setAvailability(data);
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Something went wrong",
        );
      } finally {
        setLoadingAvailability(false);
      }
    };
    load();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);

    if (query.trim().length < 2) {
      setSearchError("Type at least 2 characters");
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `${API_BASE}/users/search?q=${encodeURIComponent(query.trim())}`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Search failed");
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCustomer = async (userId: number) => {
    setLoadingCustomer(true);
    setSearchError(null);
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to load customer");
      }
      const data = await res.json();
      setSelectedCustomer(data);
      // Clear search UI
      setSearchResults(null);
      setQuery("");
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleChangeCustomer = () => {
    setSelectedCustomer(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setNotes("");
    setSubmitError(null);
  };

  const handleConfirm = async () => {
    if (!selectedCustomer || !selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedCustomer.id,
          date: selectedDate,
          slot: selectedSlot,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to create appointment");
      }

      router.push("/admin/appointments");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAvailability) return <p className="text-muted">Loading…</p>;
  if (loadError) return <Alert variant="danger">{loadError}</Alert>;

  const dayData = availability.find((d) => d.date === selectedDate);
  const primaryAddress =
    selectedCustomer?.addresses?.find((a) => a.isPrimary) ?? null;
  const customerHasAddress = (selectedCustomer?.addresses?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create appointment</h1>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {/* Step 1: Customer */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm text-muted">Customer</h2>

        {selectedCustomer ? (
          <Card className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-bold">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </p>
                <p className="text-sm text-muted">
                  {selectedCustomer.email} · {selectedCustomer.telephone}
                </p>
                {primaryAddress ? (
                  <p className="text-sm">
                    {primaryAddress.number} {primaryAddress.cardinalDirection}{" "}
                    {primaryAddress.streetName} {primaryAddress.suffix},{" "}
                    {primaryAddress.city}, {primaryAddress.state}{" "}
                    {primaryAddress.zipCode}
                  </p>
                ) : (
                  <p className="text-sm text-warning-text">
                    No address on file
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleChangeCustomer}>
                Change
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or phone"
                disabled={searching || loadingCustomer}
              />
              <Button type="submit" disabled={searching || loadingCustomer}>
                {searching ? "Searching…" : "Search"}
              </Button>
            </form>

            {searchError && <Alert variant="danger">{searchError}</Alert>}

            {searchResults !== null && (
              <div className="flex flex-col gap-2">
                {searchResults.length === 0 ? (
                  <Card className="border-dashed">
                    <p className="text-muted text-sm">No customers found.</p>
                  </Card>
                ) : (
                  searchResults.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer.id)}
                      disabled={loadingCustomer}
                      className="text-left block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors disabled:opacity-50"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {customer.firstName} {customer.lastName}
                        </span>
                        <span className="text-sm text-muted">
                          {customer.email} · {customer.telephone}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Address gate */}
      {selectedCustomer && !customerHasAddress && (
        <Alert variant="warning" title="Address required">
          This customer doesn't have an address on file. Add one before creating
          an appointment.
          <div className="mt-2">
            <Link
              href={`/admin/users/${selectedCustomer.id}`}
              className="text-sm underline decoration-foreground hover:decoration-accent transition-colors"
            >
              Open customer profile →
            </Link>
          </div>
        </Alert>
      )}

      {/* Step 2: Date — only if a customer with address is selected */}
      {selectedCustomer && customerHasAddress && (
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
      )}

      {/* Step 3: Slot */}
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

      {/* Step 4: Notes + confirm */}
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

          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={submitting}>
              {submitting ? "Creating…" : "Create appointment"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
