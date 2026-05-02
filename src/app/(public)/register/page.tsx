"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useUser } from "@/src/context/user-context";

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

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Register error:", error);
        throw new Error(error.message || "Register failed");
      }

      const data = await res.json();
      login(data);
      console.log("REGISTER RESPONSE:", data);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
      <h1 className="text-2xl font-bold">Create Account</h1>

      {/* Username */}
      <Input
        placeholder="Username"
        value={form.userName}
        onChange={(e) => handleChange("userName", e.target.value)}
      />

      {/* First Name */}
      <Input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />

      {/* Last Name */}
      <Input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />

      {/* Email */}
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      {/* Phone */}
      <Input
        placeholder="Phone"
        value={form.telephone}
        onChange={(e) => handleChange("telephone", e.target.value)}
      />

      {/* Password */}
      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      {/* Confirm Password */}
      <Input
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />

      <Button type="submit">Register</Button>
    </form>
  );
}
