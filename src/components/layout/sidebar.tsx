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
    <aside className="w-64 h-screen bg-[#242423] text-[#e8eddfff] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#333533] flex items-center gap-3">
        <Image src="/logo.png" alt="WAFFLES logo" width={64} height={64} />
        <span className={`${brandFont.className} text-lg font-semibold`}>
          Egalisys<span className="text-[#f5cb5c]">Tech</span>
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
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150
                ${
                  isActive
                    ? "bg-[#333533] text-white border-l-4 border-[#f5cb5c]"
                    : "text-[#cfdbd5ff] hover:bg-[#333533] hover:text-white"
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
      <div className="mt-auto px-6 py-4 text-sm text-[#cfdbd5] opacity-70">
        v1.0
      </div>
    </aside>
  );
}
