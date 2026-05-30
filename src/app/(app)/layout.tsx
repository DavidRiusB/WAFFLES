"use client";

import Sidebar from "@/src/components/layout/sidebar";
import { PageContainer } from "@/src/components/ui/PageContainer";
import { useUser } from "@/src/context/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
