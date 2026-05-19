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
  verified: boolean;
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

// Convert an Address from the API into the string-based form shape
function addressToForm(a: Address) {
  return {
    number: String(a.number),
    cardinalDirection: a.cardinalDirection ?? "",
    streetName: a.streetName,
    suffix: a.suffix,
    city: a.city,
    state: a.state,
    zipCode: a.zipCode,
    notes: a.notes ?? "",
  };
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Email verification UI state
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Phone edit state
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Address form state (used for both add and edit)
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

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

  // ----- Email handlers -----
  const handleResend = async () => {
    setResendMsg(null);
    setResending(true);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Could not resend verification email");
      }
      setResendMsg({
        type: "ok",
        text: "Verification email sent — check your inbox.",
      });
    } catch (err) {
      setResendMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    setEmailSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-email`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailInput }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Could not change email");
      }
      setEmailMsg({
        type: "ok",
        text: "Email updated. We sent a verification link to the new address.",
      });
      setEditingEmail(false);
      await fetchUser(); // refresh so the displayed email + status update
    } catch (err) {
      setEmailMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setEmailSubmitting(false);
    }
  };

  // ----- Phone handlers -----
  const startEditingPhone = () => {
    setPhoneInput(user?.telephone ?? "");
    setPhoneError(null);
    setEditingPhone(true);
  };

  const cancelEditingPhone = () => {
    setEditingPhone(false);
    setPhoneError(null);
  };

  const savePhone = async () => {
    setPhoneError(null);
    setSavingPhone(true);
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ telephone: phoneInput }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update phone");
      }
      await fetchUser();
      setEditingPhone(false);
    } catch (err) {
      setPhoneError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSavingPhone(false);
    }
  };

  // ----- Address handlers -----
  const startAddingAddress = () => {
    setAddressForm(emptyAddressForm);
    setAddressError(null);
    setEditingAddress(true);
  };

  const startEditingAddress = (a: Address) => {
    setAddressForm(addressToForm(a));
    setAddressError(null);
    setEditingAddress(true);
  };

  const cancelEditingAddress = () => {
    setEditingAddress(false);
    setAddressError(null);
  };

  const handleAddressFieldChange = (key: string, value: string) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    setSavingAddress(true);

    const primaryAddress = user?.addresses.find((a) => a.isPrimary) ?? null;
    const isEdit = primaryAddress !== null;

    const url = isEdit
      ? `${API_BASE}/addresses/${primaryAddress.id}`
      : `${API_BASE}/addresses`;
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          number: Number(addressForm.number),
          cardinalDirection: addressForm.cardinalDirection || undefined,
          streetName: addressForm.streetName,
          suffix: addressForm.suffix,
          city: addressForm.city,
          state: addressForm.state,
          zipCode: addressForm.zipCode,
          notes: addressForm.notes || undefined,
          isPrimary: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to save address");
      }

      await fetchUser();
      setEditingAddress(false);
    } catch (err) {
      setAddressError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSavingAddress(false);
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
        <div className="border rounded p-4 flex flex-col gap-2">
          <p>
            <span className="text-gray-500">Name: </span>
            {user.firstName} {user.lastName}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-500">Email:</span>
              <span>{user.email}</span>
              {user.verified ? (
                <span className="text-green-700 text-sm border border-green-600 rounded px-2 py-0.5">
                  Verified
                </span>
              ) : (
                <span className="text-amber-700 text-sm border border-amber-600 rounded px-2 py-0.5">
                  Not verified
                </span>
              )}
            </div>

            {/* Unverified-only actions */}
            {!user.verified && (
              <div className="flex flex-col gap-2 border-l-2 border-amber-300 pl-3">
                <p className="text-sm text-gray-500">
                  Verify your email to enable booking. Wrong email? Fix it
                  below.
                </p>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="border rounded px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    {resending ? "Sending…" : "Resend verification email"}
                  </button>
                  {!editingEmail && (
                    <button
                      onClick={() => {
                        setEmailInput(user.email);
                        setEmailMsg(null);
                        setEditingEmail(true);
                      }}
                      className="border rounded px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Change email
                    </button>
                  )}
                </div>

                {resendMsg && (
                  <p
                    className={`text-sm ${resendMsg.type === "ok" ? "text-green-700" : "text-red-600"}`}
                  >
                    {resendMsg.text}
                  </p>
                )}

                {editingEmail && (
                  <form
                    onSubmit={handleChangeEmail}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      disabled={emailSubmitting}
                      className="border rounded p-2"
                      placeholder="new@email.com"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={emailSubmitting}
                        className="bg-black text-white rounded px-3 py-1 text-sm disabled:opacity-50"
                      >
                        {emailSubmitting ? "Saving…" : "Save new email"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEmail(false)}
                        disabled={emailSubmitting}
                        className="border rounded px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {emailMsg && (
                  <p
                    className={`text-sm ${emailMsg.type === "ok" ? "text-green-700" : "text-red-600"}`}
                  >
                    {emailMsg.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Phone row */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Phone:</span>

            {editingPhone ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled={savingPhone}
                  className="border rounded p-1"
                />
                <button
                  onClick={savePhone}
                  disabled={savingPhone}
                  className="bg-black text-white rounded px-3 py-1 text-sm disabled:opacity-50"
                >
                  {savingPhone ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={cancelEditingPhone}
                  disabled={savingPhone}
                  className="border rounded px-3 py-1 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{user.telephone}</span>
                <button
                  onClick={startEditingPhone}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
        </div>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-gray-500">Address</h2>

        {editingAddress ? (
          <form
            onSubmit={saveAddress}
            className="border rounded p-4 flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Number</span>
                <input
                  type="number"
                  value={addressForm.number}
                  onChange={(e) =>
                    handleAddressFieldChange("number", e.target.value)
                  }
                  required
                  disabled={savingAddress}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">
                  Direction (optional)
                </span>
                <select
                  value={addressForm.cardinalDirection}
                  onChange={(e) =>
                    handleAddressFieldChange(
                      "cardinalDirection",
                      e.target.value,
                    )
                  }
                  disabled={savingAddress}
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
                  value={addressForm.streetName}
                  onChange={(e) =>
                    handleAddressFieldChange("streetName", e.target.value)
                  }
                  required
                  disabled={savingAddress}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Suffix</span>
                <select
                  value={addressForm.suffix}
                  onChange={(e) =>
                    handleAddressFieldChange("suffix", e.target.value)
                  }
                  required
                  disabled={savingAddress}
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
                  value={addressForm.city}
                  onChange={(e) =>
                    handleAddressFieldChange("city", e.target.value)
                  }
                  required
                  disabled={savingAddress}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">State</span>
                <select
                  value={addressForm.state}
                  onChange={(e) =>
                    handleAddressFieldChange("state", e.target.value)
                  }
                  required
                  disabled={savingAddress}
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
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    handleAddressFieldChange("zipCode", e.target.value)
                  }
                  required
                  disabled={savingAddress}
                  className="border rounded p-2"
                />
              </label>

              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-sm text-gray-500">Notes (optional)</span>
                <textarea
                  value={addressForm.notes}
                  onChange={(e) =>
                    handleAddressFieldChange("notes", e.target.value)
                  }
                  disabled={savingAddress}
                  rows={2}
                  className="border rounded p-2"
                />
              </label>
            </div>

            {addressError && (
              <p className="text-red-600 text-sm">{addressError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingAddress}
                className="bg-black text-white rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingAddress ? "Saving…" : "Save address"}
              </button>
              <button
                type="button"
                onClick={cancelEditingAddress}
                disabled={savingAddress}
                className="border rounded p-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : primaryAddress ? (
          <div className="border rounded p-4 flex flex-col gap-2">
            <div>
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
            <button
              onClick={() => startEditingAddress(primaryAddress)}
              className="text-sm text-blue-600 hover:underline self-start"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="border border-dashed rounded p-4 flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              You don't have an address on file. Add one to start booking.
            </p>
            <button
              onClick={startAddingAddress}
              className="bg-black text-white rounded p-2 self-start"
            >
              Add address
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
