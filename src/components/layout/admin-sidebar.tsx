"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/appointments", label: "Appointments" },
    { href: "/admin/reports", label: "Reports" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#242423] text-[#e8eddfff] flex flex-col">
      <div className="px-6 py-6 border-b border-[#333533]">
        <h1 className="text-lg font-semibold">ADMIN</h1>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-[#333533] border-l-4 border-[#f5cb5c]"
                    : "hover:bg-[#333533]"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
