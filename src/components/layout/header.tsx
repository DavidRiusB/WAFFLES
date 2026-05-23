"use client";

import Link from "next/link";
import { useUser } from "@/src/context/user-context";

export function Header() {
  const { user, logout } = useUser();

  return (
    <header className="h-16 bg-secondary flex items-center justify-between px-6">
      {/* Brand */}
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-on-secondary hover:opacity-90"
      >
        Egalisys<span className="text-accent">Tech</span>
      </Link>

      {/* Right */}
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-on-secondary/70">
            {user.firstName} {user.lastName}
          </span>

          <button
            onClick={logout}
            className="text-sm text-on-secondary border border-on-secondary/40 px-3 py-1 rounded hover:bg-on-secondary hover:text-secondary transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
