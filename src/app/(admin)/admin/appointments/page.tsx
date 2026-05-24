"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { Alert } from "@/src/components/ui/alert";
import { statusVariant, AppointmentStatus } from "@/src/lib/appointment-status";
import { formatDay, toIso, addDays } from "@/src/lib/formatters";

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
  status: AppointmentStatus;
  notes: string | null;
  user: AppointmentUser;
};

const STATUSES = ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
const SLOTS = ["MORNING", "AFTERNOON", "EVENING"] as const;

type Filters = {
  startDate: string;
  endDate: string;
  status: string;
  slot: string;
};

const PRESETS = [
  { key: "next14", label: "Next 14 days" },
  { key: "thisWeek", label: "This week" },
  { key: "lastWeek", label: "Last week" },
  { key: "thisMonth", label: "This month" },
  { key: "lastMonth", label: "Last month" },
];

function presetRange(preset: string): { startDate: string; endDate: string } {
  const today = new Date();

  switch (preset) {
    case "next14": {
      return { startDate: toIso(today), endDate: toIso(addDays(today, 14)) };
    }
    case "thisWeek": {
      const day = today.getDay();
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
          { credentials: "include" },
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

  const grouped = appointments.reduce<Record<string, AdminAppointment[]>>(
    (acc, appt) => {
      (acc[appt.date] ??= []).push(appt);
      return acc;
    },
    {},
  );
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Appointments</h1>

      {/* Preset buttons */}
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((p) => (
          <Button
            key={p.key}
            variant="ghost"
            size="sm"
            onClick={() => applyPreset(p.key)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Custom range + filters */}
      <Card className="flex gap-3 flex-wrap items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">From</span>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            className="w-auto"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">To</span>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            className="w-auto"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Status</span>
          <Select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="w-auto"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Slot</span>
          <Select
            value={filters.slot}
            onChange={(e) => updateFilter("slot", e.target.value)}
            className="w-auto"
          >
            <option value="">All</option>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </label>
      </Card>

      {/* Results */}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : sortedDates.length === 0 ? (
        <Card className="border-dashed">
          <p className="text-muted text-sm">
            No appointments match these filters.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedDates.map((date) => (
            <section key={date} className="flex flex-col gap-2">
              <h2 className="text-sm text-muted">{formatDay(date, "long")}</h2>
              <div className="flex flex-col gap-2">
                {grouped[date].map((appt) => (
                  <Link
                    key={appt.id}
                    href={`/admin/appointments/${appt.id}`}
                    className="block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">
                          {appt.user.firstName} {appt.user.lastName} ·{" "}
                          {appt.user.telephone}
                        </span>
                        <span className="text-sm text-muted">
                          {appt.slot}
                          {appt.notes
                            ? ` · "${appt.notes.slice(0, 60)}${appt.notes.length > 60 ? "…" : ""}"`
                            : ""}
                        </span>
                      </div>
                      <Badge variant={statusVariant(appt.status)}>
                        {appt.status}
                      </Badge>
                    </div>
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
