"use client";

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

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

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

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!appointment) return null;

  const primaryAddress =
    appointment.user.addresses?.find((a) => a.isPrimary) ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointment</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Status + actions */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Current status:</span>
          <span className="text-sm uppercase tracking-wide font-medium">
            {appointment.status}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              disabled={updating || appointment.status === s}
              className="border rounded px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {updating ? "…" : `Set to ${s}`}
            </button>
          ))}
        </div>

        {updateError && <p className="text-red-600 text-sm">{updateError}</p>}
      </section>

      {/* Appointment details */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Details</h2>
        <div className="border rounded p-4 flex flex-col gap-1">
          <p>
            <span className="text-gray-500">Date: </span>
            {formatDay(appointment.date)}
          </p>
          <p>
            <span className="text-gray-500">Time slot: </span>
            {appointment.slot}
          </p>
          {appointment.notes ? (
            <p>
              <span className="text-gray-500">Notes: </span>
              {appointment.notes}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">No notes.</p>
          )}
        </div>
      </section>

      {/* Customer */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Customer</h2>
        <div className="border rounded p-4 flex flex-col gap-1">
          <p className="font-medium">
            {appointment.user.firstName} {appointment.user.lastName}
          </p>
          <p>
            <span className="text-gray-500">Email: </span>
            {appointment.user.email}
          </p>
          <p>
            <span className="text-gray-500">Phone: </span>
            {appointment.user.telephone}
          </p>
          <Link
            href={`/admin/users/${appointment.user.id}`}
            className="text-sm text-blue-600 hover:underline self-start mt-1"
          >
            View customer profile →
          </Link>
        </div>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Service address</h2>
        {primaryAddress ? (
          <div className="border rounded p-4">
            <p>
              {primaryAddress.number} {primaryAddress.cardinalDirection}{" "}
              {primaryAddress.streetName} {primaryAddress.suffix}
            </p>
            <p>
              {primaryAddress.city}, {primaryAddress.state}{" "}
              {primaryAddress.zipCode}
            </p>
          </div>
        ) : (
          <div className="border border-dashed rounded p-4 text-gray-500 text-sm">
            No primary address on file.
          </div>
        )}
      </section>
    </div>
  );
}
