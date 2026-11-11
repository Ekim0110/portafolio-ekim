import type { NextConfig } from "next";

// 🛡️ CABECERAS DE SEGURIDAD
// Son instrucciones que el servidor le envía al navegador en cada respuesta,
// para que el navegador bloquee ataques comunes. Es la misma receta que usa
// la app agentes-seguridad.
const esDesarrollo = process.env.NODE_ENV === "development";

// Política de contenido (CSP): la lista de lugares desde donde el navegador
// puede cargar cosas. Lo que no esté en la lista, se bloquea.
const politicaDeContenido = [
  "default-src 'self'",
  // Next.js necesita scripts en línea; en desarrollo también 'unsafe-eval'.
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""}`,
  // El panel de Keystatic usa la letra "Inter" de Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Fotos de perfil de GitHub y vistas previas de imágenes en el panel.
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  // El panel guarda y lee tu contenido hablando con GitHub.
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Nadie puede meter tu página dentro de otra (protección contra clickjacking).
  "frame-ancestors 'none'",
].join("; ");

const cabecerasDeSeguridad = [
  { key: "Content-Security-Policy", value: politicaDeContenido },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Ocultamos "X-Powered-By: Next.js" para no contar qué tecnología usamos.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: cabecerasDeSeguridad }];
  },
};

export default nextConfig;
