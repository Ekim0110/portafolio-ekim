"use client";
// "use client": tiene interacción (pasar el mouse por la gráfica, elegir herramientas)
// y pequeñas animaciones que corren en el navegador.

/**
 * 📊 TU OPERACIÓN, EN UN TABLERO
 * Una cuadrícula tipo "bento" (inspirada en un componente de 21st.dev) que muestra
 * en pequeño cómo se ve el trabajo terminado:
 *  - Gráfica de cumplimiento semanal: al pasar el mouse muestra cada semana.
 *  - Bitácora de actualización: el Ciclo Señal escrito como un proceso automático.
 *  - Anillos de calidad de datos y barras de reportes que llegan "en vivo".
 *  - Herramientas reales: al elegir una aparece para qué la uso.
 * Las cifras son de ejemplo (lo dice la etiqueta); las herramientas son reales.
 * Las animaciones solo corren con la sección en pantalla y se detienen con
 * "menos movimiento".
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SENAL = "#34d8a8"; // verde del logo de RumboLab

/* ---------- Datos de ejemplo ---------- */
const semanas = [78, 80, 79, 83, 85, 84, 87, 89, 88, 91, 93, 95];
const proyectos = [
  { nombre: "Norte", valor: 97, color: SENAL },
  { nombre: "Centro", valor: 95, color: "#3b8ee6" },
  { nombre: "Andino", valor: 93, color: "#f08a5d" },
  { nombre: "Costa", valor: 91, color: "#d99a1e" },
];
const bitacora: { tipo: "cmd" | "ok" | "info" | "fin"; texto: string }[] = [
  { tipo: "cmd", texto: "rumbolab actualizar --flota" },
  { tipo: "ok", texto: "12 hojas de Excel leídas" },
  { tipo: "ok", texto: "3 listas de SharePoint conectadas" },
  { tipo: "info", texto: "Validando placas y fechas…" },
  { tipo: "ok", texto: "37 registros duplicados eliminados" },
  { tipo: "ok", texto: "214 fechas corregidas" },
  { tipo: "ok", texto: "Modelo de datos actualizado" },
  { tipo: "cmd", texto: "rumbolab publicar tablero" },
  { tipo: "ok", texto: "Tablero publicado" },
  { tipo: "fin", texto: "8 personas notificadas" },
];
const anillos = [
  { valor: 98, etiqueta: "Calidad" },
  { valor: 96, etiqueta: "Puntualidad" },
  { valor: 100, etiqueta: "Cobertura" },
];

/* ---------- Herramientas reales ---------- */
const herramientas = [
  { nombre: "Power BI", logo: "/herramientas/power-bi.svg", uso: "Tableros de indicadores y estados de resultados que se actualizan solos cada vez que cambia la base de datos." },
  { nombre: "Excel", logo: "/herramientas/excel.svg", uso: "La base de origen: la limpio, la consolido y la convierto en un modelo confiable." },
  { nombre: "SharePoint", logo: null, uso: "Listas y carpetas donde los equipos de campo cargan la información que después se analiza." },
  { nombre: "HTML", logo: "/herramientas/html.svg", uso: "Informes interactivos que se abren en cualquier navegador, sin instalar nada." },
  { nombre: "Next.js", logo: "/herramientas/nextjs.svg", uso: "Sitios y herramientas web, como este portafolio." },
  { nombre: "TypeScript", logo: "/herramientas/typescript.svg", uso: "Código con tipos, para que las herramientas no fallen cuando llegan datos raros." },
  { nombre: "Tailwind", logo: "/herramientas/tailwind.svg", uso: "Diseño rápido y consistente en las páginas web." },
  { nombre: "Vercel", logo: "/herramientas/vercel.svg", uso: "Publicación de sitios y demos en minutos, con su propia dirección web." },
];

/* ¿Está la sección en pantalla? (para no animar fuera de la vista) */
function useEnPantalla<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, visible] as const;
}
function usePocoMovimiento() {
  const [poco, setPoco] = useState(false);
  useEffect(() => setPoco(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return poco;
}

/* ---------- Tarjeta con brillo que sigue el mouse ---------- */
function Tarjeta({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`tarjeta-vivo rounded-3xl border border-linea bg-superficie/70 p-5 sm:p-6 ${className}`}>{children}</div>;
}

/* ---------- A. Gráfica de cumplimiento semanal ---------- */
function GraficaCumplimiento() {
  const [activa, setActiva] = useState<number | null>(null);
  const W = 560, H = 190, min = 70, max = 100;
  const x = (i: number) => 8 + (i / (semanas.length - 1)) * (W - 16);
  const y = (v: number) => H - 10 - ((v - min) / (max - min)) * (H - 30);
  const linea = semanas.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${linea} L${x(semanas.length - 1)} ${H} L${x(0)} ${H} Z`;
  const i = activa ?? semanas.length - 1;

  const alMover = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - r.left) / r.width) * W;
    setActiva(Math.max(0, Math.min(semanas.length - 1, Math.round(((rel - 8) / (W - 16)) * (semanas.length - 1)))));
  };

  return (
    <Tarjeta className="flex flex-col lg:col-span-6 lg:row-span-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-tenue">Cumplimiento semanal</h3>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: SENAL }}>
          <span className="pulso-vivo h-1.5 w-1.5 rounded-full" style={{ background: SENAL }} aria-hidden="true" />
          Actualizado
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="tabular font-display text-5xl font-semibold tracking-tight">{semanas[i]}%</span>
        <span className="text-sm text-tenue">
          semana {i + 1} · <span style={{ color: SENAL }}>▲ +{semanas[semanas.length - 1] - semanas[0]} p.p. en 12 semanas</span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 h-auto w-full cursor-crosshair touch-pan-y"
        onPointerMove={alMover}
        onPointerLeave={() => setActiva(null)}
        role="img"
        aria-label={`Cumplimiento semanal de ejemplo: sube de ${semanas[0]} % a ${semanas[semanas.length - 1]} % en 12 semanas.`}
      >
        <defs>
          <linearGradient id="area-vivo" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={SENAL} stopOpacity="0.35" />
            <stop offset="1" stopColor={SENAL} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[75, 85, 95].map((v) => (
          <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="var(--linea)" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="url(#area-vivo)" />
        <path d={linea} fill="none" stroke={SENAL} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {activa !== null && (
          <>
            <line x1={x(i)} x2={x(i)} y1="0" y2={H} stroke="var(--tenue)" strokeOpacity="0.5" strokeDasharray="2 4" />
            <g transform={`translate(${Math.min(Math.max(x(i), 52), W - 52)} ${Math.max(y(semanas[i]) - 30, 14)})`}>
              <rect x="-44" y="-14" width="88" height="24" rx="6" fill="var(--fondo)" stroke="var(--linea)" />
              <text textAnchor="middle" y="3" fontSize="11" fill="var(--tinta)">Sem. {i + 1} · {semanas[i]}%</text>
            </g>
          </>
        )}
        <circle cx={x(i)} cy={y(semanas[i])} r="5" fill={SENAL} stroke="var(--fondo)" strokeWidth="2" />
      </svg>
      <ul className="mt-auto grid gap-x-6 gap-y-2 pt-5 text-sm sm:grid-cols-2">
        {proyectos.map((p) => (
          <li key={p.nombre} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-tenue">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
              Proyecto {p.nombre}
            </span>
            <span className="tabular" style={{ color: p.color }}>{p.valor}%</span>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}

/* ---------- B. Bitácora de actualización (el Ciclo Señal como proceso) ---------- */
function Bitacora({ activo, quieto }: { activo: boolean; quieto: boolean }) {
  const [mostradas, setMostradas] = useState(quieto ? bitacora.length : 0);
  useEffect(() => {
    if (quieto) { setMostradas(bitacora.length); return; }
    if (!activo) return;
    // Una línea cada 0,55 s; al terminar espera 3 s y vuelve a empezar.
    const t = setTimeout(() => setMostradas((n) => (n >= bitacora.length ? 0 : n + 1)), mostradas >= bitacora.length ? 3000 : 550);
    return () => clearTimeout(t);
  }, [activo, quieto, mostradas]);

  const marca = { cmd: "$", ok: "✓", info: "·", fin: "→" } as const;
  const color = { cmd: "text-acento", ok: "", info: "text-tenue", fin: "text-tinta" } as const;
  return (
    <Tarjeta className="flex flex-col lg:col-span-3 lg:row-span-2">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm text-tenue">actualizar.log</h3>
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
      </div>
      <ol className="mt-4 min-h-[17rem] space-y-1.5 font-mono text-[12.5px] leading-relaxed" aria-label="Bitácora de una actualización de ejemplo">
        {bitacora.slice(0, mostradas).map((l, n) => (
          <li key={n} className={`linea-log flex gap-2 ${color[l.tipo]}`}>
            <span aria-hidden="true" style={l.tipo === "ok" ? { color: SENAL } : undefined}>{marca[l.tipo]}</span>
            <span>{l.texto}</span>
          </li>
        ))}
        {mostradas < bitacora.length && <li className="cursor-log h-4 w-2 bg-tenue/70" aria-hidden="true" />}
      </ol>
    </Tarjeta>
  );
}

/* ---------- C. Anillos de calidad de datos ---------- */
function Anillos() {
  const r = 22, c = 2 * Math.PI * r;
  return (
    <Tarjeta className="lg:col-span-3">
      <h3 className="text-sm font-medium text-tenue">Calidad de los datos</h3>
      <ul className="mt-4 flex justify-between gap-2">
        {anillos.map((a) => (
          <li key={a.etiqueta} className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 56 56" className="anillo-vivo h-16 w-16" role="img" aria-label={`${a.etiqueta}: ${a.valor} %`}>
              <circle cx="28" cy="28" r={r} fill="none" stroke="var(--linea)" strokeWidth="4" />
              <circle cx="28" cy="28" r={r} fill="none" stroke={SENAL} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(a.valor / 100) * c} ${c}`} transform="rotate(-90 28 28)" />
              <text x="28" y="32.5" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--tinta)">{a.valor}</text>
            </svg>
            <span className="text-xs text-tenue">{a.etiqueta}</span>
          </li>
        ))}
      </ul>
    </Tarjeta>
  );
}

/* ---------- D. Reportes que llegan "en vivo" ---------- */
function ReportesEnVivo({ activo, quieto }: { activo: boolean; quieto: boolean }) {
  const [barras, setBarras] = useState([14, 18, 16, 21, 19, 24, 22, 26, 23, 27, 25, 29, 28, 31]);
  const [total, setTotal] = useState(47);
  useEffect(() => {
    if (!activo || quieto) return;
    let s = 7;
    const t = setInterval(() => {
      s = (s * 9301 + 49297) % 233280;
      const nuevo = 22 + Math.round((s / 233280) * 12);
      setBarras((b) => [...b.slice(1), nuevo]);
      setTotal((n) => n + 1);
    }, 1800);
    return () => clearInterval(t);
  }, [activo, quieto]);
  const max = 36;
  return (
    <Tarjeta className="lg:col-span-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-tenue">Reportes de hoy</h3>
        <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: SENAL }}>
          <span className="pulso-vivo h-1.5 w-1.5 rounded-full" style={{ background: SENAL }} aria-hidden="true" />
          En vivo
        </span>
      </div>
      <p className="tabular mt-2 font-display text-4xl font-semibold tracking-tight" aria-live="off">{total}</p>
      <div className="mt-3 flex h-14 items-end gap-1" aria-hidden="true">
        {barras.map((v, n) => (
          <span
            key={n}
            className="barra-vivo flex-1 rounded-sm"
            style={{ height: `${(v / max) * 100}%`, background: n === barras.length - 1 ? SENAL : "color-mix(in oklab, #34d8a8 35%, transparent)" }}
          />
        ))}
      </div>
    </Tarjeta>
  );
}

/* ---------- E. Herramientas (reales) ---------- */
function Herramientas() {
  const [elegida, setElegida] = useState(0);
  const h = herramientas[elegida];
  return (
    <Tarjeta className="md:col-span-2 lg:col-span-12">
      <h3 className="text-sm font-medium text-tenue">Herramientas con las que trabajo</h3>
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8" role="group" aria-label="Elige una herramienta para ver para qué la uso">
        {herramientas.map((t, n) => (
          <button
            key={t.nombre}
            type="button"
            onClick={() => setElegida(n)}
            onPointerEnter={() => setElegida(n)}
            aria-pressed={elegida === n}
            className={`presionable flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-1 py-3 text-xs ${
              elegida === n ? "border-[#34d8a8]/60 bg-[#34d8a8]/10 text-tinta" : "border-linea bg-fondo/60 text-tenue hover:border-tenue hover:text-tinta"
            }`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-tinta">
              {t.logo ? (
                <Image src={t.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0c0b0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                </svg>
              )}
            </span>
            {t.nombre}
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-12 text-sm text-tenue sm:text-base" aria-live="polite">
        <span className="font-medium text-tinta">{h.nombre}:</span> {h.uso}
      </p>
    </Tarjeta>
  );
}

/* ---------- La sección ---------- */
export function TableroVivo() {
  const [ref, visible] = useEnPantalla<HTMLDivElement>();
  const quieto = usePocoMovimiento();

  // Brillo del borde que sigue al mouse: guarda su posición en cada tarjeta.
  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    for (const t of e.currentTarget.querySelectorAll<HTMLElement>(".tarjeta-vivo")) {
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
  };

  return (
    <section id="tablero" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 lg:pb-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 className="titulo-seccion">
            Tu operación, <span style={{ color: SENAL }}>en un tablero</span>
          </h2>
          <div>
            <p className="max-w-[48ch] text-base text-tenue sm:text-lg">
              Así se ve el trabajo cuando los datos están en orden: el proceso se actualiza solo y el
              equipo ve lo que importa.
            </p>
            <p className="mt-3 text-xs text-tenue/80">Cifras de ejemplo · las herramientas son las que uso de verdad.</p>
          </div>
        </div>

        <div ref={ref} onPointerMove={alMover} className="bento-vivo mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-12">
          <GraficaCumplimiento />
          <Bitacora activo={visible} quieto={quieto} />
          <Anillos />
          <ReportesEnVivo activo={visible} quieto={quieto} />
          <Herramientas />
        </div>
      </div>
    </section>
  );
}
