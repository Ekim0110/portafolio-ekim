import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO básico: el título y la descripción que muestran Google y las redes sociales.
export const metadata: Metadata = {
  title: "Mike Bernal Gomez · Operaciones, procesos y datos",
  description:
    "Portafolio de Mike Bernal Gomez: tableros en Power BI, mejora de procesos, finanzas y páginas web.",
  openGraph: {
    title: "Mike Bernal Gomez · Operaciones, procesos y datos",
    description: "Tableros en Power BI, mejora de procesos, finanzas y páginas web.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Cuenta las visitas para el panel de estadísticas de Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
