"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AppointmentUser = {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
};

type AdminAppointment = {
  id: number;
  date: string;
  slot: string;
  status: string;
  notes: string | null;
  user: AppointmentUser;
};

// Match your backend enums
const STATUSES = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
const SLOTS = ["MORNING", "AFTERNOON", "EVENING"] as const;

type Filters = {
  startDate: string;
  endDate: string;
  status: string; // "" = all
  slot: string; // "" = all
};

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

// Preset range generators
function presetRange(preset: string): { startDate: string; endDate: string } {
  const today = new Date();

  switch (preset) {
    case "next14": {
      return { startDate: toIso(today), endDate: toIso(addDays(today, 14)) };
    }
    case "thisWeek": {
      const day = today.getDay(); // 0 = Sun
      const monday = addDays(today, day === 0 ? -6 : 1 - day);
      const sunday = addDays(monday, 6);
      return { startDate: toIso(monday), endDate: toIso(sunday) };
    }
    case "lastWeek": {
      const day = today.getDay();
      const thisMonday = addDays(today, day === 0 ? -6 : 1 - day);
      const lastMonday = addDays(thisMonday, -7);
      const lastSunday = addDays(lastMonday, 6);
      return { startDate: toIso(lastMonday), endDate: toIso(lastSunday) };
    }
    case "thisMonth": {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { startDate: toIso(first), endDate: toIso(last) };
    }
    case "lastMonth": {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate: toIso(first), endDate: toIso(last) };
    }
    default:
      return { startDate: toIso(today), endDate: toIso(addDays(today, 14)) };
  }
}

export default function AdminAppointmentsPage() {
  const initial = presetRange("next14");

  const [filters, setFilters] = useState<Filters>({
    startDate: initial.startDate,
    endDate: initial.endDate,
    status: "",
    slot: "",
  });

  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("startDate", filters.startDate);
        params.set("endDate", filters.endDate);
        params.set("limit", "100");
        if (filters.status) params.set("status", filters.status);
        if (filters.slot) params.set("slot", filters.slot);

        const res = await fetch(
          `${API_BASE}/appointments?${params.toString()}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load appointments");
        }
        const result = await res.json();
        setAppointments(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filters]);

  const applyPreset = (preset: string) => {
    const range = presetRange(preset);
    setFilters((prev) => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate,
    }));
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Group by date
  const grouped = appointments.reduce<Record<string, AdminAppointment[]>>(
    (acc, appt) => {
      (acc[appt.date] ??= []).push(appt);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-6 max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Appointments</h1>

      {/* Preset buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "next14", label: "Next 14 days" },
          { key: "thisWeek", label: "This week" },
          { key: "lastWeek", label: "Last week" },
          { key: "thisMonth", label: "This month" },
          { key: "lastMonth", label: "Last month" },
        ].map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className="px-3 py-2 rounded border text-sm bg-white hover:bg-gray-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom range + filters */}
      <div className="flex gap-3 flex-wrap items-end border rounded p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-500">From</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-500">To</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            className="border rounded p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-500">Status</span>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-500">Slot</span>
          <select
            value={filters.slot}
            onChange={(e) => updateFilter("slot", e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All</option>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-gray-500 p-6">Loading…</div>
      ) : error ? (
        <div className="text-red-600 p-6">Error: {error}</div>
      ) : sortedDates.length === 0 ? (
        <div className="border border-dashed rounded p-6 text-gray-500 text-sm">
          No appointments match these filters.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedDates.map((date) => (
            <section key={date} className="flex flex-col gap-2">
              <h2 className="text-sm text-gray-500">{formatDay(date)}</h2>
              <div className="flex flex-col gap-2">
                {grouped[date].map((appt) => (
                  <Link
                    key={appt.id}
                    href={`/admin/appointments/${appt.id}`}
                    className="border rounded p-4 hover:bg-gray-50 flex justify-between items-start"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {appt.user.firstName} {appt.user.lastName} ·{" "}
                        {appt.user.telephone}
                      </span>
                      <span className="text-sm text-gray-500">
                        {appt.slot}
                        {appt.notes
                          ? ` · "${appt.notes.slice(0, 60)}${appt.notes.length > 60 ? "…" : ""}"`
                          : ""}
                      </span>
                    </div>
                    <span className="text-sm uppercase tracking-wide">
                      {appt.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
