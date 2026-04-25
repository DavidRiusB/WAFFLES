"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/user-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      console.error("Missing credentials");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data);
        router.push("/dashboard");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />

        <button type="submit" className="bg-black text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}
