"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

type Appointment = {
  id: number;
  date: string;
  slot: string;
  status: string;
  notes: string | null;
};

type CustomerProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  role: string;
  addresses: Address[];
  appointments: Appointment[];
};

function formatDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Failed to load customer");
        }
        const data = await res.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!customer) return null;

  const primaryAddress = customer.addresses.find((a) => a.isPrimary) ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-3xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {customer.firstName} {customer.lastName}
        </h1>
        <Link
          href="/admin/users"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to search
        </Link>
      </div>

      {/* Contact */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Contact</h2>
        <div className="border rounded p-4 flex flex-col gap-1">
          <p>
            <span className="text-gray-500">Email: </span>
            {customer.email}
          </p>
          <p>
            <span className="text-gray-500">Phone: </span>
            {customer.telephone}
          </p>
        </div>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Primary address</h2>
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

      {/* Appointments */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">
          Appointments ({customer.appointments.length})
        </h2>
        {customer.appointments.length === 0 ? (
          <div className="border border-dashed rounded p-4 text-gray-500 text-sm">
            This customer has no appointments yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {customer.appointments.map((appt) => (
              <Link
                key={appt.id}
                href={`/admin/appointments/${appt.id}`}
                className="border rounded p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{formatDay(appt.date)}</span>
                  <span className="text-sm text-gray-500">
                    {appt.slot}
                    {appt.notes ? " · has notes" : ""}
                  </span>
                </div>
                <span className="text-sm uppercase tracking-wide">
                  {appt.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
