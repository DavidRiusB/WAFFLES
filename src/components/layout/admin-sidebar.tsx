"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarPlus,
  LayoutDashboard,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Exo_2 } from "next/font/google";
import { useSidebarCollapsed } from "@/src/hooks/useSidebarCollapsed";
import clsx from "clsx";

const brandFont = Exo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarCollapsed();

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
    <aside
      className={clsx(
        "h-screen bg-secondary text-on-secondary flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Brand + Admin label + toggle */}
      <div
        className={clsx(
          "py-6 border-b border-muted flex items-center gap-3",
          collapsed ? "justify-center px-3" : "px-6",
        )}
      >
        {collapsed ? (
          <button
            onClick={toggle}
            aria-label="Expand sidebar"
            className="p-2 rounded hover:bg-muted transition-colors"
          >
            <ChevronsRight size={18} />
          </button>
        ) : (
          <>
            <Image
              src="/logo.png"
              alt="EgalisysTech logo"
              width={48}
              height={48}
            />
            <div className="flex flex-col flex-1">
              <span className={`${brandFont.className} text-base font-bold`}>
                Egalisys<span className="text-accent">Tech</span>
              </span>
              <span className="text-xs text-on-secondary/60 uppercase tracking-wide">
                Admin
              </span>
            </div>
            <button
              onClick={toggle}
              aria-label="Collapse sidebar"
              className="p-2 rounded hover:bg-muted transition-colors"
            >
              <ChevronsLeft size={18} />
            </button>
          </>
        )}
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
              title={collapsed ? link.label : undefined}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                collapsed && "justify-center",
                isActive
                  ? "bg-muted text-on-secondary border-l-4 border-accent"
                  : "text-on-secondary/70 hover:bg-muted hover:text-on-secondary",
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto px-6 py-4 text-sm text-on-secondary/50">
          v1.0
        </div>
      )}
    </aside>
  );
}
