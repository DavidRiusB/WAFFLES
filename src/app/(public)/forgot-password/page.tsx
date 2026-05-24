"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Alert } from "@/src/components/ui/alert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Something went wrong");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-80 flex flex-col gap-4 text-center">
          <h1 className="text-xl font-bold">Check your email</h1>
          <p className="text-muted">
            If an account exists for that email, we&apos;ve sent a password
            reset link. It expires in 1 hour.
          </p>
          <Link
            href="/login"
            className="text-sm hover:underline text-center underline hover:opacity-70 transition-opacity"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-bold">Forgot password</h1>
        <p className="text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send reset link"}
        </Button>

        <Link
          href="/login"
          className="text-sm hover:underline text-center underline hover:opacity-70 transition-opacity"
        >
          Back to login
        </Link>
      </form>
    </div>
  );
}
