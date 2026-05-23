"use client";

import { useUser } from "@/src/context/user-context";
import { Card } from "@/src/components/ui/card";

export default function Page() {
  const { user, loading } = useUser();

  if (loading) return <p className="p-6 text-muted">Loading…</p>;
  if (!user) return <p className="p-6 text-muted">Not logged in.</p>;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="flex flex-col gap-2 w-80">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-muted">{user.email}</p>
      </Card>
    </div>
  );
}
