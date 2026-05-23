"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useUser } from "@/src/context/user-context";
import { FormField } from "@/src/components/ui/form-field";
import { Card } from "@/src/components/ui/card";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser();

  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const { confirmPassword, ...payload } = form;

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Registration failed");
      }

      const data = await res.json();
      login(data);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm flex flex-col gap-5"
    >
      <h1 className="text-2xl font-bold">Create Account</h1>

      <FormField label="Username">
        <Input
          value={form.userName}
          onChange={(e) => handleChange("userName", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="First Name">
        <Input
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Last Name">
        <Input
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Email">
        <Input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Phone">
        <Input
          value={form.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Password">
        <Input
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      <FormField label="Confirm Password">
        <Input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          disabled={submitting}
        />
      </FormField>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={submitting}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Creating account…" : "Register"}
      </Button>

      <p className="text-sm text-center text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
