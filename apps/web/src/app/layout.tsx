import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
