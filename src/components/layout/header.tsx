"use client";

import Link from "next/link";
import { useUser } from "@/src/context/user-context";

export function Header() {
  const { user, logout } = useUser();

  return (
    <header className="h-16 bg-black border-b border-black flex items-center justify-between px-6">
      {/* Left */}
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-white hover:opacity-90"
      >
        Egalisys<span className="text-yellow-400">Tech</span>
      </Link>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-300">
              {user.firstName} {user.lastName}
            </span>

            <button
              onClick={logout}
              className="text-sm border border-gray-500 text-white px-3 py-1 rounded hover:bg-white hover:text-black"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
