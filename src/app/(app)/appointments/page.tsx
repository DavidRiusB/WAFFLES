"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AppointmentCard } from "@/src/components/appointments/appointment-card";
import type { Appointment } from "@/src/types/appointment";
import { FilterPanel } from "@/src/components/appointments/filter-panel";
import { Alert } from "@/src/components/ui/alert";
import { Card } from "@/src/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function EmptyState() {
  return (
    <Card className="border-dashed p-8 text-center flex flex-col items-center gap-4">
      <p className="text-muted">You have no appointments yet</p>
      <Link href="/appointments/new">
        <Button>Create your first appointment</Button>
      </Link>
    </Card>
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
          <Button variant="ghost" onClick={() => setShowFilters(true)}>
            ⚙️ Filters
          </Button>

          <Link href="/appointments/new">
            <Button>New Appointment</Button>
          </Link>
        </div>
      </div>
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      {/* Content */}
      {loading ? (
        <p className="text-muted p-6">Loading appointments…</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
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
