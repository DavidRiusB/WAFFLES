"use client";

import { Alert } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { formatDay, formatSlot } from "@/src/lib/formatters";
import { statusVariant, AppointmentStatus } from "@/src/lib/appointment-status";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

type CurrentUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  verified: boolean;
  addresses: Address[];
};

type DashboardAppointment = {
  id: number;
  date: string;
  slot: string;
  status: AppointmentStatus;
  notes: string | null;
};

const ACTIVE_STATUSES: AppointmentStatus[] = ["SCHEDULED", "CONFIRMED"];

function todayIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resend verification (mirrors booking-page banner)
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, apptRes] = await Promise.all([
          fetch(`${API_BASE}/users/me`, { credentials: "include" }),
          fetch(`${API_BASE}/appointments?limit=10`, {
            credentials: "include",
          }),
        ]);

        if (!userRes.ok) {
          const data = await userRes.json().catch(() => null);
          throw new Error(data?.message || "Failed to load profile");
        }
        if (!apptRes.ok) {
          const data = await apptRes.json().catch(() => null);
          throw new Error(data?.message || "Failed to load appointments");
        }

        const userData: CurrentUser = await userRes.json();
        const apptResult = await apptRes.json();

        setUser(userData);
        // findAppointments returns paginated: { data: [...], total, ... }
        setAppointments(apptResult.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return null;

  const today = todayIso();
  const upcomingActive =
    appointments.find(
      (a) => ACTIVE_STATUSES.includes(a.status) && a.date >= today,
    ) ?? null;

  // Recent = everything except the one in the hero
  const recent = appointments
    .filter((a) => a.id !== upcomingActive?.id)
    .slice(0, 3);

  const primaryAddress = user.addresses?.find((a) => a.isPrimary) ?? null;
  const hasAddress = (user.addresses?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <h1 className="text-2xl font-bold">Welcome, {user.firstName}</h1>

      {/* Verification banner */}
      {!user.verified && (
        <Alert variant="warning" title="Verify your email">
          We sent a verification link to <strong>{user.email}</strong>. Verify
          your email before booking your first visit.
          <div className="mt-2 flex flex-col gap-2">
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Sending…" : "Resend verification email"}
              </Button>
            </div>
            {resendMsg && (
              <p
                className={
                  resendMsg.type === "ok"
                    ? "text-sm text-success-text"
                    : "text-sm text-danger-text"
                }
              >
                {resendMsg.text}
              </p>
            )}
          </div>
        </Alert>
      )}

      {/* HERO */}
      {upcomingActive ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-muted">Your next visit</h2>
          <Card className="flex flex-col gap-3">
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold">
                  {formatDay(upcomingActive.date, "long")}
                </span>
                <span className="text-muted">
                  {formatSlot(upcomingActive.slot.toLowerCase())}
                </span>
                {upcomingActive.notes && (
                  <span className="text-sm text-muted mt-1">
                    Notes: {upcomingActive.notes}
                  </span>
                )}
              </div>
              <Badge variant={statusVariant(upcomingActive.status)}>
                {upcomingActive.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/appointments`}
                className="text-sm underline decoration-foreground hover:decoration-accent transition-colors"
              >
                View all appointments →
              </Link>
            </div>
          </Card>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <Card className="flex flex-col gap-3 items-start">
            <div>
              <h2 className="text-xl font-bold">Book a visit</h2>
              <p className="text-muted mt-1">
                Schedule your next service appointment.
              </p>
            </div>
            <Button
              onClick={() => router.push("/appointments/new")}
              disabled={!user.verified || !hasAddress}
            >
              {!user.verified
                ? "Verify email to book"
                : !hasAddress
                  ? "Add address to book"
                  : "Book a visit"}
            </Button>
            {!hasAddress && user.verified && (
              <p className="text-sm text-muted">
                You need an address on file before booking.{" "}
                <Link
                  href="/account"
                  className="underline decoration-foreground hover:decoration-accent transition-colors"
                >
                  Add one now →
                </Link>
              </p>
            )}
          </Card>
        </section>
      )}

      {/* Account snapshot */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm text-muted">Account</h2>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted">Email:</span>
            <span>{user.email}</span>
            {user.verified ? (
              <Badge variant="success">Verified</Badge>
            ) : (
              <Badge variant="warning">Not verified</Badge>
            )}
          </div>
          {primaryAddress ? (
            <p>
              <span className="text-muted">Address: </span>
              {primaryAddress.number} {primaryAddress.cardinalDirection}{" "}
              {primaryAddress.streetName} {primaryAddress.suffix},{" "}
              {primaryAddress.city}, {primaryAddress.state}{" "}
              {primaryAddress.zipCode}
            </p>
          ) : (
            <p className="text-sm text-muted">No address on file.</p>
          )}
          <Link
            href="/account"
            className="text-sm underline decoration-foreground hover:decoration-accent transition-colors self-start mt-1"
          >
            Manage account →
          </Link>
        </Card>
      </section>

      {/* Recent appointments */}
      {recent.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm text-muted">Recent appointments</h2>
          <div className="flex flex-col gap-2">
            {recent.map((appt) => (
              <Link
                key={appt.id}
                href={`/appointments`}
                className="block rounded-lg border border-border bg-surface p-4 hover:border-foreground transition-colors"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold">{formatDay(appt.date)}</span>
                    <span className="text-sm text-muted">
                      {formatSlot(appt.slot.toLowerCase())}
                    </span>
                  </div>
                  <Badge variant={statusVariant(appt.status)}>
                    {appt.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
