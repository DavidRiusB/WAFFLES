"use client";

import { useUser } from "@/src/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/appointments");
    }
  }, [user, router]);

  // While we don't know who the user is yet, or they're being redirected
  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
