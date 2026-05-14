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

type Filter = "today" | "week" | "all";

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("today");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const startDate = todayIso();
        const endDate = addDaysIso(14);
        const url = `${API_BASE}/appointments?startDate=${startDate}&endDate=${endDate}&limit=100`;
        const res = await fetch(url, { credentials: "include" });
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
  }, []);

  // Compute filtered list
  const today = todayIso();
  const weekEnd = addDaysIso(7);

  const filtered = appointments.filter((a) => {
    if (filter === "today") return a.date === today;
    if (filter === "week") return a.date >= today && a.date <= weekEnd;
    return true; // 'all'
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, AdminAppointment[]>>(
    (acc, appt) => {
      if (!acc[appt.date]) acc[appt.date] = [];
      acc[appt.date].push(appt);
      return acc;
    },
    {},
  );

  const sortedDates = Object.keys(grouped).sort();

  // Counts for filter buttons (always based on full data, not filtered)
  const counts = {
    today: appointments.filter((a) => a.date === today).length,
    week: appointments.filter((a) => a.date >= today && a.date <= weekEnd)
      .length,
    all: appointments.length,
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6 max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Appointments</h1>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {(["today", "week", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded border text-sm ${
              filter === f ? "bg-black text-white" : "bg-white hover:bg-gray-50"
            }`}
          >
            {f === "today"
              ? "Today"
              : f === "week"
                ? "This week"
                : "All upcoming"}{" "}
            ({counts[f]})
          </button>
        ))}
      </div>

      {/* Grouped list */}
      {sortedDates.length === 0 ? (
        <div className="border border-dashed rounded p-6 text-gray-500 text-sm">
          No appointments in this view.
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
