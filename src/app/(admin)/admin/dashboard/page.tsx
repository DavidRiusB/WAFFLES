"use client";

import { Alert } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { addDays, formatDay, toIso } from "@/src/lib/formatters";
import { statusVariant, AppointmentStatus } from "@/src/lib/appointment-status";
import { CalendarPlus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AdminAppointment = {
  id: number;
  date: string;
  slot: string;
  status: AppointmentStatus;
  notes: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    telephone: string;
  };
};

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date();
        const startDate = toIso(today);
        const endDate = toIso(addDays(today, 7));

        const res = await fetch(
          `${API_BASE}/appointments?startDate=${startDate}&endDate=${endDate}&limit=100`,
          { credentials: "include" },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load appointments");
        }
        const result = await res.json();
        setAppointments(result.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const todayStr = toIso(new Date());
  const todays = appointments.filter((a) => a.date === todayStr);
  const upcoming = appointments.filter((a) => a.date > todayStr);

  // Group upcoming by date
  const groupedUpcoming = upcoming.reduce<Record<string, AdminAppointment[]>>(
    (acc, appt) => {
      (acc[appt.date] ??= []).push(appt);
      return acc;
    },
    {},
  );
  const sortedUpcomingDates = Object.keys(groupedUpcoming).sort();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Quick actions */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Quick actions</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => router.push("/admin/appointments/new")}>
            <CalendarPlus size={16} className="inline mr-2" />
            New appointment
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push("/admin/users")}
          >
            <Search size={16} className="inline mr-2" />
            Find customer
          </Button>
        </div>
      </section>

      {/* Today */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Today</h2>
        {todays.length === 0 ? (
          <Card className="border-dashed">
            <p className="text-muted text-sm">No appointments today.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {todays.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </section>

      {/* Rest of this week */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">This week</h2>
        {sortedUpcomingDates.length === 0 ? (
          <Card className="border-dashed">
            <p className="text-muted text-sm">No appointments scheduled.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedUpcomingDates.map((date) => (
              <div key={date} className="flex flex-col gap-2">
                <h3 className="text-xs text-muted">
                  {formatDay(date, "long")}
                </h3>
                {groupedUpcoming[date].map((appt) => (
                  <AppointmentRow key={appt.id} appt={appt} />
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AppointmentRow({ appt }: { appt: AdminAppointment }) {
  return (
    <Link
      href={`/admin/appointments/${appt.id}`}
      className="block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-bold">
            {appt.user.firstName} {appt.user.lastName} · {appt.user.telephone}
          </span>
          <span className="text-sm text-muted">
            {appt.slot}
            {appt.notes
              ? ` · "${appt.notes.slice(0, 60)}${appt.notes.length > 60 ? "…" : ""}"`
              : ""}
          </span>
        </div>
        <Badge variant={statusVariant(appt.status)}>{appt.status}</Badge>
      </div>
    </Link>
  );
}
