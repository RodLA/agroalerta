import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDepartments } from "@/actions/action";
import StoreInitializer from "@/components/commons/StoreInitializer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroAlerta Perú",
  description: "Plataforma de vigilancia agroclimática para agricultores peruanos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const departments = await getDepartments();

  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <StoreInitializer departments={departments} />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
