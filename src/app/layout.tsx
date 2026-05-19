import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/src/context/user-context";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Egalisys Tech",
  description: "Book an appointment with Egalisys Tech.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${atkinson.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
