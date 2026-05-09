"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AppointmentCard } from "@/src/components/appointments/appointment-card";
import type { Appointment } from "@/src/types/appointment";
import { FilterPanel } from "@/src/components/appointments/filter-panel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function EmptyState() {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center">
      <p className="text-gray-500 mb-4">You have no appointments yet</p>

      <Link href="/appointments/new">
        <Button>Create your first appointment</Button>
      </Link>
    </div>
  );
}

function buildQuery(params: Record<string, any>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  return query.toString();
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<{
    status?: string;
    slot?: string;
    date?: string;
  }>({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setError(null);
        const query = buildQuery(filters);
        const res = await fetch(`${API_BASE}/appointments?${query}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to fetch appointments");
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

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>

        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(true)}
            className="border px-3 py-2 rounded hover:bg-gray-100"
          >
            ⚙️ Filters
          </button>

          {/* New appointment */}
          <Link href="/appointments/new">
            <Button>New Appointment</Button>
          </Link>
        </div>
      </div>

      {/* Content */}

      {loading ? (
        <div className="text-gray-500 p-6">Loading appointments…</div>
      ) : error ? (
        <div className="text-red-600 p-6">Error: {error}</div>
      ) : appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
}
