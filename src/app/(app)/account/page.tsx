"use client";

import { useEffect, useState } from "react";
import {
  AddressSuffix,
  CardinalDirection,
  State,
} from "@/src/lib/address-enums";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Alert } from "@/src/components/ui/alert";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

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
        <h2 className="text-sm text-muted">Personal info</h2>

        <Card className="flex flex-col gap-2">
          <p>
            <span className="text-muted">Name: </span>
            {user.firstName} {user.lastName}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-muted">Email:</span>
              <span>{user.email}</span>
              {user.verified ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="warning">Not verified</Badge>
              )}
            </div>

            {!user.verified && (
              <div className="flex flex-col gap-2 border-l-2 border-warning pl-3">
                <p className="text-sm text-muted">
                  Verify your email to enable booking. Wrong email? Fix it
                  below.
                </p>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResend}
                    disabled={resending}
                  >
                    {resending ? "Sending…" : "Resend verification email"}
                  </Button>
                  {!editingEmail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmailInput(user.email);
                        setEmailMsg(null);
                        setEditingEmail(true);
                      }}
                    >
                      Change email
                    </Button>
                  )}
                </div>

                {resendMsg && (
                  <Alert
                    variant={resendMsg.type === "ok" ? "success" : "danger"}
                  >
                    {resendMsg.text}
                  </Alert>
                )}

                {editingEmail && (
                  <form
                    onSubmit={handleChangeEmail}
                    className="flex flex-col gap-2 mt-1"
                  >
                    <Input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      disabled={emailSubmitting}
                      placeholder="new@email.com"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={emailSubmitting}
                      >
                        {emailSubmitting ? "Saving…" : "Save new email"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingEmail(false)}
                        disabled={emailSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {emailMsg && (
                  <Alert
                    variant={emailMsg.type === "ok" ? "success" : "danger"}
                  >
                    {emailMsg.text}
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* Phone row */}
          <div className="flex items-center gap-3">
            <span className="text-muted">Phone:</span>

            {editingPhone ? (
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled={savingPhone}
                  className="w-auto"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={savePhone}
                  disabled={savingPhone}
                >
                  {savingPhone ? "Saving…" : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={cancelEditingPhone}
                  disabled={savingPhone}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{user.telephone}</span>
                <button
                  onClick={startEditingPhone}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {phoneError && <Alert variant="danger">{phoneError}</Alert>}
        </Card>
      </section>

      {/* Address */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Address</h2>

        {editingAddress ? (
          <Card as="section">
            <form onSubmit={saveAddress} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm text-muted">Number</span>
                  <Input
                    type="number"
                    value={addressForm.number}
                    onChange={(e) =>
                      handleAddressFieldChange("number", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-muted">
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
                    className="border border-border rounded bg-surface px-3 py-2 text-base focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent disabled:opacity-50"
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
                  <span className="text-sm text-muted">Street name</span>
                  <Input
                    type="text"
                    value={addressForm.streetName}
                    onChange={(e) =>
                      handleAddressFieldChange("streetName", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-muted">Suffix</span>
                  <select
                    value={addressForm.suffix}
                    onChange={(e) =>
                      handleAddressFieldChange("suffix", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                    className="border border-border rounded bg-surface px-3 py-2 text-base focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent disabled:opacity-50"
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
                  <span className="text-sm text-muted">City</span>
                  <Input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      handleAddressFieldChange("city", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm text-muted">State</span>
                  <select
                    value={addressForm.state}
                    onChange={(e) =>
                      handleAddressFieldChange("state", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                    className="border border-border rounded bg-surface px-3 py-2 text-base focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent disabled:opacity-50"
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
                  <span className="text-sm text-muted">Zip code</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={addressForm.zipCode}
                    onChange={(e) =>
                      handleAddressFieldChange("zipCode", e.target.value)
                    }
                    required
                    disabled={savingAddress}
                  />
                </label>

                <label className="flex flex-col gap-1 col-span-2">
                  <span className="text-sm text-muted">Notes (optional)</span>
                  <textarea
                    value={addressForm.notes}
                    onChange={(e) =>
                      handleAddressFieldChange("notes", e.target.value)
                    }
                    disabled={savingAddress}
                    rows={2}
                    className="border border-border rounded bg-surface px-3 py-2 text-base focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent disabled:opacity-50"
                  />
                </label>
              </div>

              {addressError && <Alert variant="danger">{addressError}</Alert>}

              <div className="flex gap-2">
                <Button type="submit" disabled={savingAddress}>
                  {savingAddress ? "Saving…" : "Save address"}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={cancelEditingAddress}
                  disabled={savingAddress}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : primaryAddress ? (
          <Card className="flex flex-col gap-2">
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
                <p className="text-sm text-muted">
                  Notes: {primaryAddress.notes}
                </p>
              )}
            </div>
            <button
              onClick={() => startEditingAddress(primaryAddress)}
              className="text-sm text-accent hover:underline self-start"
            >
              Edit
            </button>
          </Card>
        ) : (
          <Card className="border-dashed flex flex-col gap-2">
            <p className="text-sm text-muted">
              You don&apos;t have an address on file. Add one to start booking.
            </p>
            <Button onClick={startAddingAddress} className="self-start">
              Add address
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}
