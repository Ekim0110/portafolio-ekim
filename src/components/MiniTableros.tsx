/**
 * 🖼️ MINI-TABLEROS para las tarjetas de proyectos sin captura.
 * Dibujados en SVG (se ven nítidos a cualquier tamaño) con los colores del sitio.
 * Cada uno tiene un pequeño movimiento en bucle de 3–4 s que se reinicia al
 * pasar el mouse por la tarjeta; con "menos movimiento" quedan quietos.
 * Son decorativos (aria-hidden): el título y la descripción de la tarjeta
 * cuentan de qué trata el proyecto.
 */

const C = {
  fondo: "#0c0b0a",
  panel: "#181614",
  panel2: "#211e1b",
  linea: "#2e2d2a",
  tinta: "#f5f3ee",
  tenue: "#a8a397",
  acento: "#f08a5d",
  teal: "#4fe0c8",
  rojo: "#e2604a",
};

const svgBase = {
  viewBox: "0 0 400 300",
  preserveAspectRatio: "xMidYMid slice",
  className: "mini-tablero h-full w-full",
  "aria-hidden": true,
} as const;

/* ---------- 1. Seguimiento de proyectos (Power BI): indicadores + Gantt ---------- */
export function MiniGantt() {
  const filas = [
    { inicio: 40, ancho: 150, color: C.teal, hito: 190 },
    { inicio: 80, ancho: 170, color: C.acento, hito: 250 },
    { inicio: 120, ancho: 110, color: C.acento, hito: 230 },
    { inicio: 60, ancho: 200, color: C.rojo, hito: 260 },
    { inicio: 150, ancho: 120, color: C.teal, hito: 270 },
  ];
  const kpis = [
    { valor: "12", etiqueta: "Proyectos", color: C.tinta },
    { valor: "68%", etiqueta: "Avance", color: C.teal },
    { valor: "2", etiqueta: "En riesgo", color: C.rojo },
  ];
  return (
    <svg {...svgBase}>
      <rect width="400" height="300" fill={C.panel} />
      <text x="24" y="32" className="mini-t" fill={C.tinta} fontSize="13" fontWeight="600">Portafolio de proyectos</text>
      <text x="376" y="32" className="mini-t" fill={C.tenue} fontSize="10" textAnchor="end">Q3 · 2026</text>

      {kpis.map((k, i) => (
        <g key={k.etiqueta} transform={`translate(${24 + i * 120} 46)`}>
          <rect width="110" height="52" rx="10" fill={C.panel2} stroke={C.linea} />
          <text x="12" y="27" className="mini-t" fill={k.color} fontSize="20" fontWeight="700">{k.valor}</text>
          <text x="12" y="42" className="mini-t" fill={C.tenue} fontSize="9.5">{k.etiqueta}</text>
        </g>
      ))}

      {/* Rejilla de semanas */}
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <line key={s} x1={24 + s * 64} x2={24 + s * 64} y1="118" y2="282" stroke={C.linea} strokeWidth="1" />
      ))}
      {/* Barras del Gantt: se llenan de izquierda a derecha, una tras otra */}
      {filas.map((f, i) => {
        const y = 128 + i * 31;
        return (
          <g key={i}>
            <rect x={f.inicio} y={y} width={f.ancho} height="14" rx="7" fill={C.linea} />
            <rect
              x={f.inicio} y={y} width={f.ancho} height="14" rx="7" fill={f.color}
              className="mini-crece" style={{ animationDelay: `${i * 140}ms` }}
            />
            <path d={`M${f.hito} ${y - 2} l7 9 -7 9 -7 -9z`} fill={C.tinta} opacity="0.9" />
          </g>
        );
      })}
      {/* Línea de "hoy" */}
      <line x1="232" x2="232" y1="116" y2="284" stroke={C.acento} strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="216" y="106" width="32" height="14" rx="7" fill={C.acento} />
      <text x="232" y="116" className="mini-t" fill={C.fondo} fontSize="8.5" fontWeight="700" textAnchor="middle">HOY</text>
    </svg>
  );
}

/* ---------- 2. Página de presentación (HTML): un sitio web con cursor que hace clic ---------- */
export function MiniSitio() {
  return (
    <svg {...svgBase}>
      <defs>
        <radialGradient id="mini-sitio-imagen" cx="35%" cy="35%" r="80%">
          <stop offset="0" stopColor={C.acento} />
          <stop offset="0.55" stopColor="#b8577a" />
          <stop offset="1" stopColor="#1f3d5c" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={C.panel} />
      {/* Ventana del navegador */}
      <rect x="18" y="16" width="364" height="268" rx="12" fill={C.fondo} stroke={C.linea} />
      <circle cx="34" cy="31" r="4" fill="#ff5f57" />
      <circle cx="47" cy="31" r="4" fill="#febc2e" />
      <circle cx="60" cy="31" r="4" fill="#28c840" />
      <rect x="120" y="24" width="160" height="14" rx="7" fill={C.panel2} />
      <text x="200" y="34" className="mini-t" fill={C.tenue} fontSize="8.5" textAnchor="middle">mi-sitio.example</text>
      <line x1="18" x2="382" y1="46" y2="46" stroke={C.linea} />

      {/* Héroe: texto a la izquierda, imagen a la derecha */}
      <rect x="38" y="70" width="150" height="16" rx="4" fill={C.tinta} />
      <rect x="38" y="92" width="110" height="16" rx="4" fill={C.tinta} />
      <rect x="38" y="118" width="160" height="6" rx="3" fill={C.linea} />
      <rect x="38" y="130" width="130" height="6" rx="3" fill={C.linea} />
      <g className="mini-boton">
        <rect x="38" y="148" width="78" height="24" rx="12" fill={C.acento} />
        <text x="77" y="164" className="mini-t" fill={C.fondo} fontSize="9.5" fontWeight="700" textAnchor="middle">Contactar</text>
      </g>
      <rect x="222" y="64" width="140" height="112" rx="12" fill="url(#mini-sitio-imagen)" />

      {/* Tres tarjetas */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${38 + i * 110} 194)`}>
          <rect width="98" height="72" rx="10" fill={C.panel2} stroke={C.linea} />
          <circle cx="18" cy="20" r="8" fill={i === 1 ? C.teal : C.acento} opacity="0.85" />
          <rect x="10" y="38" width="64" height="6" rx="3" fill={C.tinta} opacity="0.8" />
          <rect x="10" y="50" width="78" height="5" rx="2.5" fill={C.linea} />
        </g>
      ))}

      {/* Cursor que llega al botón y hace clic */}
      <g className="mini-cursor">
        <path d="M0 0 L0 17 L4.5 13 L8 20 L11 18.5 L7.5 11.8 L13 11.8 Z" fill={C.tinta} stroke={C.fondo} strokeWidth="1.2" />
      </g>
    </svg>
  );
}

/* ---------- 3. Este portafolio: la portada en miniatura con globo y satélite ---------- */
export function MiniPortafolio() {
  const estrellas = [
    [30, 70], [70, 40], [120, 260], [180, 30], [200, 280], [250, 50], [370, 70], [380, 250], [330, 30], [20, 220], [150, 200], [95, 150],
  ];
  return (
    <svg {...svgBase}>
      <defs>
        <radialGradient id="mini-globo" cx="35%" cy="32%" r="75%">
          <stop offset="0" stopColor="#1f5f8f" />
          <stop offset="1" stopColor="#071a2e" />
        </radialGradient>
        <radialGradient id="mini-halo">
          <stop offset="0.6" stopColor={C.teal} stopOpacity="0.25" />
          <stop offset="1" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill={C.fondo} />
      {estrellas.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill={C.tinta} className="mini-estrella" style={{ animationDelay: `${(i % 4) * 600}ms` }} />
      ))}
      {/* Una constelación */}
      <path d="M44 40 L70 58 L96 46 L118 70" fill="none" stroke={C.acento} strokeOpacity="0.5" />
      {/* Menú */}
      <rect x="24" y="18" width="16" height="16" rx="4" fill={C.acento} />
      <rect x="46" y="23" width="54" height="6" rx="3" fill={C.tinta} opacity="0.8" />
      <rect x="320" y="19" width="56" height="14" rx="7" fill={C.tinta} />
      {/* Saludo */}
      <rect x="24" y="104" width="128" height="22" rx="5" fill={C.tinta} />
      <rect x="24" y="132" width="76" height="22" rx="5" fill={C.acento} />
      <rect x="24" y="166" width="140" height="7" rx="3.5" fill={C.tenue} opacity="0.6" />
      <rect x="24" y="190" width="62" height="20" rx="10" fill={C.acento} />
      <rect x="92" y="190" width="54" height="20" rx="10" fill="none" stroke={C.linea} />
      {/* Globo con halo, meridianos y órbita */}
      <circle cx="285" cy="160" r="96" fill="url(#mini-halo)" />
      <circle cx="285" cy="160" r="66" fill="url(#mini-globo)" stroke={C.teal} strokeWidth="2" />
      <ellipse cx="285" cy="160" rx="28" ry="66" fill="none" stroke={C.teal} strokeOpacity="0.25" />
      <ellipse cx="285" cy="160" rx="66" ry="22" fill="none" stroke={C.teal} strokeOpacity="0.25" />
      <path d="M248 142 Q285 110 322 150" fill="none" stroke={C.acento} strokeWidth="1.5" strokeDasharray="3 4" className="mini-flujo" />
      <circle cx="248" cy="142" r="3" fill={C.tinta} />
      <circle cx="322" cy="150" r="3" fill={C.tinta} />
      <circle cx="290" cy="185" r="3" fill={C.tinta} />
      <g transform="rotate(-18 285 160)">
        <ellipse cx="285" cy="160" rx="92" ry="26" fill="none" stroke={C.acento} strokeWidth="1.6" strokeOpacity="0.8" />
        {/* Satélite que recorre la órbita (estático si se pidió menos movimiento) */}
        <rect x="-5" y="-2" width="10" height="4" rx="1" fill={C.teal} className="mini-satelite">
          <animateMotion dur="4s" repeatCount="indefinite" path="M377 160 A92 26 0 1 1 193 160 A92 26 0 1 1 377 160" />
        </rect>
        <rect x="372" y="158" width="10" height="4" rx="1" fill={C.teal} className="mini-satelite-quieto" />
      </g>
    </svg>
  );
}

// Elige el mini-tablero según el proyecto (por título, y si no, por categoría).
export function MiniTablero({ titulo, categoria }: { titulo: string; categoria: string }) {
  const t = titulo.toLowerCase();
  if (t.includes("portafolio")) return <MiniPortafolio />;
  if (t.includes("presentación") || t.includes("pagina") || t.includes("página")) return <MiniSitio />;
  if (categoria === "Tableros" || t.includes("seguimiento")) return <MiniGantt />;
  return <MiniSitio />;
}
