import Sidebar from "@/src/components/layout/sidebar";
import { PageContainer } from "@/src/components/ui/PageContainer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
