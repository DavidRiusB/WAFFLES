"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Alert } from "@/src/components/ui/alert";
import { statusVariant, AppointmentStatus } from "@/src/lib/appointment-status";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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

type UserAppointment = {
  id: number;
  date: string;
  slot: string;
  status: AppointmentStatus;
  notes: string | null;
};

type UserDetail = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  verified: boolean;
  addresses: Address[];
  appointments: UserAppointment[];
};

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE}/users/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load customer");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return null;

  const primaryAddress = user.addresses?.find((a) => a.isPrimary) ?? null;
  const appointments = user.appointments ?? [];

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-accent hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Contact */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Contact</h2>
        <Card className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted">Email:</span>
            <span>{user.email}</span>
            {user.verified ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Badge variant="warning">Not verified</Badge>
            )}
          </div>
          <p>
            <span className="text-muted">Phone: </span>
            {user.telephone}
          </p>
        </Card>
      </section>

      {/* Primary address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Primary address</h2>
        {primaryAddress ? (
          <Card>
            <p>
              {primaryAddress.number} {primaryAddress.cardinalDirection}{" "}
              {primaryAddress.streetName} {primaryAddress.suffix}
            </p>
            <p>
              {primaryAddress.city}, {primaryAddress.state}{" "}
              {primaryAddress.zipCode}
            </p>
          </Card>
        ) : (
          <Card className="border-dashed">
            <p className="text-muted text-sm">No primary address on file.</p>
          </Card>
        )}
      </section>

      {/* Appointment history */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Appointments</h2>
        {appointments.length === 0 ? (
          <Card className="border-dashed">
            <p className="text-muted text-sm">No appointments yet.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {appointments.map((appt) => (
              <Link
                key={appt.id}
                href={`/admin/appointments/${appt.id}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{formatDay(appt.date)}</span>
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
        )}
      </section>
    </div>
  );
}
