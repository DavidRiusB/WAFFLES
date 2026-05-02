"use client";

import { useUser } from "@/src/context/user-context";

export function Header() {
  const { user, logout } = useUser();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Left */}
      <div className="font-bold text-lg">EgalisysTech</div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-700">
              {user.firstName} {user.lastName}
            </span>

            <button
              onClick={logout}
              className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
