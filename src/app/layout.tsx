import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Ekim · Operaciones, procesos y datos",
  description:
    "Portafolio de Ekim: tableros en Power BI, mejora de procesos, finanzas y páginas web.",
  openGraph: {
    title: "Ekim · Operaciones, procesos y datos",
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
      </body>
    </html>
  );
}
