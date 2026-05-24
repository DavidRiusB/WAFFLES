"use client";

import { Alert } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { statusVariant } from "@/src/lib/appointment-status";
import { formatDay } from "@/src/lib/formatters";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type AppointmentStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

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

type AppointmentUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  addresses: Address[];
};

type AppointmentDetail = {
  id: number;
  date: string;
  slot: string;
  status: AppointmentStatus;
  notes: string | null;
  user: AppointmentUser;
};

const ALL_STATUSES: AppointmentStatus[] = [
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchAppointment = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/appointments/${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to load appointment");
      }
      const data = await res.json();
      setAppointment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const changeStatus = async (newStatus: AppointmentStatus) => {
    if (!appointment) return;

    const confirmed = window.confirm(
      `Change status from ${appointment.status} to ${newStatus}?`,
    );
    if (!confirmed) return;

    setUpdateError(null);
    setUpdating(true);

    try {
      const url =
        newStatus === "CANCELLED"
          ? `${API_BASE}/appointments/${id}/cancel`
          : `${API_BASE}/appointments/${id}`;

      const init: RequestInit = {
        method: "PATCH",
        credentials: "include",
      };

      if (newStatus !== "CANCELLED") {
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify({ status: newStatus });
      }

      const res = await fetch(url, init);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update appointment");
      }

      await fetchAppointment();
    } catch (err) {
      setUpdateError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!appointment) return null;

  const primaryAddress =
    appointment.user.addresses?.find((a) => a.isPrimary) ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointment</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-sm hover:underline text-center underline hover:opacity-70 transition-opacity"
        >
          ← Back
        </button>
      </div>

      {/* Status + actions */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Current status:</span>
          <Badge variant={statusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <Button
              key={s}
              variant={s === "CANCELLED" ? "danger" : "ghost"}
              size="sm"
              onClick={() => changeStatus(s)}
              disabled={updating || appointment.status === s}
            >
              {updating ? "…" : `Set to ${s}`}
            </Button>
          ))}
        </div>

        {updateError && <Alert variant="danger">{updateError}</Alert>}
      </section>

      {/* Appointment details */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Details</h2>
        <Card className="flex flex-col gap-1">
          <p>
            <span className="text-muted">Date: </span>
            {formatDay(appointment.date, "long")}
          </p>
          <p>
            <span className="text-muted">Time slot: </span>
            {appointment.slot}
          </p>
          {appointment.notes ? (
            <p>
              <span className="text-muted">Notes: </span>
              {appointment.notes}
            </p>
          ) : (
            <p className="text-muted text-sm">No notes.</p>
          )}
        </Card>
      </section>

      {/* Customer */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Customer</h2>
        <Card className="flex flex-col gap-1">
          <p className="font-bold">
            {appointment.user.firstName} {appointment.user.lastName}
          </p>
          <p>
            <span className="text-muted">Email: </span>
            {appointment.user.email}
          </p>
          <p>
            <span className="text-muted">Phone: </span>
            {appointment.user.telephone}
          </p>
          <Link
            href={`/admin/users/${appointment.user.id}`}
            className="text-sm text-accent hover:underline self-start mt-1"
          >
            View customer profile →
          </Link>
        </Card>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Service address</h2>
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
    </div>
  );
}
