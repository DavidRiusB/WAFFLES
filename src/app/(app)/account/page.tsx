"use client";

import { useEffect, useState } from "react";
import {
  AddressSuffix,
  CardinalDirection,
  State,
} from "@/src/lib/address-enums";

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
  notes: string | null;
  isPrimary: boolean;
};

type User = {
  id: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  addresses: Address[];
};

const emptyAddressForm = {
  number: "",
  cardinalDirection: "",
  streetName: "",
  suffix: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Address form state
  const [form, setForm] = useState(emptyAddressForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to load profile");
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          number: Number(form.number),
          cardinalDirection: form.cardinalDirection || undefined,
          streetName: form.streetName,
          suffix: form.suffix,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          notes: form.notes || undefined,
          isPrimary: true, // MVP: always primary, only one address
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to save address");
      }

      // Reset form, refetch user to show the new address
      setForm(emptyAddressForm);
      await fetchUser();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!user) return null;

  const primaryAddress = user.addresses.find((a) => a.isPrimary) ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl p-6">
      <h1 className="text-2xl font-bold">My Account</h1>

      {/* Personal info */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Personal info</h2>
        <div className="border rounded p-4 flex flex-col gap-1">
          <p>
            <span className="text-gray-500">Name: </span>
            {user.firstName} {user.lastName}
          </p>
          <p>
            <span className="text-gray-500">Email: </span>
            {user.email}
          </p>
          <p>
            <span className="text-gray-500">Phone: </span>
            {user.telephone}
          </p>
        </div>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Address</h2>

        {primaryAddress ? (
          <div className="border rounded p-4 flex flex-col gap-1">
            <p>
              {primaryAddress.number} {primaryAddress.cardinalDirection}{" "}
              {primaryAddress.streetName} {primaryAddress.suffix}
            </p>
            <p>
              {primaryAddress.city}, {primaryAddress.state}{" "}
              {primaryAddress.zipCode}
            </p>
            {primaryAddress.notes && (
              <p className="text-sm text-gray-500">
                Notes: {primaryAddress.notes}
              </p>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleAddAddress}
            className="border rounded p-4 flex flex-col gap-3"
          >
            <p className="text-sm text-gray-500">
              You don't have an address on file. Add one to start booking.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Number</span>
                <input
                  type="number"
                  value={form.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">
                  Direction (optional)
                </span>
                <select
                  value={form.cardinalDirection}
                  onChange={(e) =>
                    handleChange("cardinalDirection", e.target.value)
                  }
                  disabled={submitting}
                  className="border rounded p-2"
                >
                  <option value="">—</option>
                  {Object.entries(CardinalDirection).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-sm text-gray-500">Street name</span>
                <input
                  type="text"
                  value={form.streetName}
                  onChange={(e) => handleChange("streetName", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Suffix</span>
                <select
                  value={form.suffix}
                  onChange={(e) => handleChange("suffix", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                >
                  <option value="">Select…</option>
                  {Object.entries(AddressSuffix).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">City</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">State</span>
                <select
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                >
                  <option value="">Select…</option>
                  {Object.entries(State).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Zip code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  required
                  disabled={submitting}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-sm text-gray-500">Notes (optional)</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  disabled={submitting}
                  rows={2}
                  className="border rounded p-2"
                />
              </label>
            </div>

            {submitError && (
              <p className="text-red-600 text-sm">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-black text-white rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving…" : "Save address"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
