"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, User, FileText } from "lucide-react";
import { Exo_2 } from "next/font/google";

const brandFont = Exo_2({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/account", label: "Account", icon: User },
    { href: "/invoices", label: "Invoices", icon: FileText },
  ];

  return (
    <aside className="w-64 h-screen bg-secondary text-on-secondary flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-muted flex items-center gap-3">
        <Image src="/logo.png" alt="EgalisysTech logo" width={64} height={64} />
        <span className={`${brandFont.className} text-lg font-bold`}>
          Egalisys<span className="text-accent">Tech</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
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
