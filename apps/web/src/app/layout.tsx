import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "La Crónica Nacional",
  description: "Hechos que el poder no puede ocultar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <Navigation />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
