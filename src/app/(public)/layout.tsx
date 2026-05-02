export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      {children}
    </main>
  );
}
