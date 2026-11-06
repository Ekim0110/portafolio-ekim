import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Montserrat } from "next/font/google";
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

// Letra de los títulos grandes: una grotesca con carácter, para que la portada
// no se vea como cualquier plantilla.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Letra del logo de RumboLab (la misma del logo original), solo pesos fino y negrita.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "700"],
});

// SEO básico: el título y la descripción que muestran Google y las redes sociales.
export const metadata: Metadata = {
  // Dirección pública: sirve para que la imagen al compartir el enlace tenga la URL completa.
  metadataBase: new URL("https://portafolio-ekim.vercel.app"),
  title: "RumboLab · Mike Bernal Gomez · Operaciones, procesos y datos",
  description:
    "RumboLab, de Mike Bernal Gomez: del ruido a la decisión. Tableros en Power BI, informes, mejora de procesos y páginas web.",
  openGraph: {
    title: "RumboLab · Mike Bernal Gomez · Operaciones, procesos y datos",
    description: "Del ruido a la decisión. Tableros, informes, mejora de procesos y páginas web.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${montserrat.variable} antialiased`}
      >
        {children}
        {/* Cuenta las visitas para el panel de estadísticas de Vercel. */}
        <Analytics />
      </body>
    </html>
  );
}
