"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/src/components/ui/alert";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMsg("This verification link is missing its token.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(
            data?.message || "This verification link is invalid or expired.",
          );
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-4 text-center">
        {status === "verifying" && (
          <>
            <h1 className="text-xl font-bold">Verifying your email…</h1>
            <p className="text-muted">Hang tight, this only takes a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-xl font-bold">Email verified ✅</h1>
            <p className="text-muted">
              Your email is confirmed. You can now book appointments.
            </p>
            <Link
              href="/login"
              className="text-sm text-accent hover:underline mt-2"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-xl font-bold">Verification failed</h1>
            <Alert variant="danger">{errorMsg}</Alert>
            <p className="text-sm text-muted">
              The link may have expired or already been used. Log in and request
              a new verification email.
            </p>
            <Link href="/login" className="text-sm hover:underline mt-2">
              Go to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
