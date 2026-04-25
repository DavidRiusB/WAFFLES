"use client";

import { useUser } from "@/src/context/user-context";

export default function Page() {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in.</p>;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-2 p-6 border rounded-lg w-80">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}
