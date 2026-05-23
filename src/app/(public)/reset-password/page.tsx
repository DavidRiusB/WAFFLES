"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Alert } from "@/src/components/ui/alert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing its token.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "This reset link is invalid or expired.",
        );
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Missing token — don't even show the form
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col gap-4 text-center">
          <h1 className="text-xl font-bold">Invalid reset link</h1>
          <p className="text-muted">
            This link is missing its token. Request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="text-sm text-accent hover:underline mt-2"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col gap-4 text-center">
          <h1 className="text-xl font-bold">Password reset ✅</h1>
          <p className="text-muted">
            Your password has been updated. You can now log in with your new
            password.
          </p>
          <Link
            href="/login"
            className="text-sm text-accent hover:underline mt-2"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  // The form
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold">Set a new password</h1>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
        />

        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={submitting}
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>
    </div>
  );
}
