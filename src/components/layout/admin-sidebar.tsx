"use client";

import { Calendar, CalendarPlus, LayoutDashboard, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Exo_2 } from "next/font/google";

const brandFont = Exo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/appointments", label: "Appointments", icon: Calendar },
    {
      href: "/admin/appointments/new",
      label: "New Appointment",
      icon: CalendarPlus,
    },
    { href: "/admin/users", label: "Customers", icon: Users },
  ];

  return (
    <aside className="w-64 h-screen bg-secondary text-on-secondary flex flex-col">
      {/* Brand + Admin label */}
      <div className="px-6 py-6 border-b border-muted flex items-center gap-3">
        <Image src="/logo.png" alt="EgalisysTech logo" width={48} height={48} />
        <div className="flex flex-col">
          <span className={`${brandFont.className} text-base font-bold`}>
            Egalisys<span className="text-accent">Tech</span>
          </span>
          <span className="text-xs text-on-secondary/60 uppercase tracking-wide">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-muted text-on-secondary border-l-4 border-accent"
                    : "text-on-secondary/70 hover:bg-muted hover:text-on-secondary"
                }
              `}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-6 py-4 text-sm text-on-secondary/50">v1.0</div>
    </aside>
  );
}
