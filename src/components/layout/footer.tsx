"use client";

import Link from "next/link";
import { useUser } from "@/src/context/user-context";

export function Footer() {
  const { user, logout } = useUser();
  const isSignedIn = !!user;

  return (
    <footer className="bg-secondary text-on-secondary/60">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row gap-8 justify-between items-start text-sm">
        <div>
          <Link
            href="/"
            className="text-white font-semibold tracking-tight hover:opacity-90"
          >
            Egalisys<span className="text-accent">Tech</span> LLC
          </Link>
          <div className="mt-1">Tooele, Utah</div>
          <div className="mt-1">By appointment</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-on-secondary transition-colors">Contact</div>
          <a
            href="mailto:support@egalisystech.com"
            className="hover:text-white"
          >
            support@egalisystech.com
          </a>
          {isSignedIn && (
            <>
              <a
                href="mailto:scheduling@egalisystech.com"
                className="hover:text-white"
              >
                scheduling@egalisystech.com
              </a>
              <a href="tel:+14356811363" className="hover:text-white">
                (435) 681-1363
              </a>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 items-start sm:items-end">
          {isSignedIn ? (
            <button onClick={logout} className="hover:text-white">
              Log out
            </button>
          ) : (
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
          )}
          <div>© {new Date().getFullYear()} EgalisysTech LLC</div>
        </div>
      </div>
    </footer>
  );
}
