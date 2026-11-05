import Image from "next/image";

/**
 * 🔀 DE DATO A DECISIÓN
 * Un diagrama que cuenta el trabajo en segundos: los datos sueltos (Excel,
 * SharePoint) entran a un modelo en Power BI y salen tableros, reportes y
 * decisiones. Unos pulsos de luz recorren las líneas cada 3,2 s.
 * Debajo, una fila con los logos reales de las herramientas que uso.
 */

// Herramientas con su logo oficial (guardados en /public/herramientas).
const herramientas = [
  { nombre: "Power BI", logo: "/herramientas/power-bi.svg" },
  { nombre: "Excel", logo: "/herramientas/excel.svg" },
  { nombre: "HTML", logo: "/herramientas/html.svg" },
  { nombre: "Next.js", logo: "/herramientas/nextjs.svg" },
  { nombre: "TypeScript", logo: "/herramientas/typescript.svg" },
  { nombre: "Tailwind", logo: "/herramientas/tailwind.svg" },
  { nombre: "Vercel", logo: "/herramientas/vercel.svg" },
];

const salidas = ["Tablero", "Reporte automático", "Decisión"];

// Una "caja" del diagrama dibujada en SVG.
function Nodo({ x, y, w, h, destacado }: { x: number; y: number; w: number; h: number; destacado?: boolean }) {
  return <rect className={destacado ? "nodo nodo-destacado" : "nodo"} x={x} y={y} width={w} height={h} rx={16} />;
}

// Una línea con su pulso de luz encima. pathLength=100 hace que el pulso
// mida lo mismo en líneas cortas y largas.
function Via({ d, retraso, color = "acento" }: { d: string; retraso: number; color?: "acento" | "teal" }) {
  return (
    <>
      <path className="via" d={d} />
      <path className={`pulso pulso-${color}`} d={d} pathLength={100} style={{ animationDelay: `${retraso}ms` }} />
    </>
  );
}

// Versión ancha (tablet y computador): de izquierda a derecha.
function DiagramaAncho() {
  return (
    <svg viewBox="0 0 1000 260" className="hidden h-auto w-full md:block" role="img" aria-labelledby="flujo-titulo">
      <Via d="M200 130 C 300 130 320 130 420 130" retraso={0} color="teal" />
      {salidas.map((_, i) => {
        const y = 50 + i * 80;
        return <Via key={i} d={`M580 130 C 680 130 680 ${y} 780 ${y}`} retraso={900 + i * 120} />;
      })}

      <Nodo x={20} y={90} w={180} h={80} />
      <image href="/herramientas/excel.svg" x={40} y={112} width={36} height={36} />
      <text className="flujo-t" x={88} y={126}>Excel</text>
      <text className="flujo-ts" x={88} y={148}>SharePoint</text>

      <Nodo x={420} y={78} w={160} h={104} destacado />
      <image href="/herramientas/power-bi.svg" x={440} y={112} width={30} height={36} />
      <text className="flujo-t" x={482} y={126}>Modelo</text>
      <text className="flujo-ts" x={482} y={148}>Power BI</text>

      {salidas.map((s, i) => (
        <g key={s}>
          <Nodo x={780} y={22 + i * 80} w={200} h={56} />
          <text className="flujo-t" x={804} y={56 + i * 80}>{s}</text>
        </g>
      ))}
    </svg>
  );
}

// Versión angosta (celular): de arriba hacia abajo, para que nada quede diminuto.
function DiagramaAngosto() {
  return (
    <svg viewBox="0 0 340 470" className="mx-auto h-auto w-full max-w-sm md:hidden" role="img" aria-labelledby="flujo-titulo">
      <Via d="M170 84 L170 168" retraso={0} color="teal" />
      {salidas.map((_, i) => {
        // Bajan por un "tronco" a la izquierda y entran a cada caja por su borde.
        const y = 300 + i * 64;
        return <Via key={i} d={`M120 252 C 120 272 34 266 34 290 L34 ${y} L60 ${y}`} retraso={900 + i * 120} />;
      })}

      <Nodo x={70} y={10} w={200} h={74} />
      <image href="/herramientas/excel.svg" x={90} y={29} width={36} height={36} />
      <text className="flujo-t" x={138} y={43}>Excel</text>
      <text className="flujo-ts" x={138} y={64}>SharePoint</text>

      <Nodo x={80} y={168} w={180} h={84} destacado />
      <image href="/herramientas/power-bi.svg" x={100} y={192} width={30} height={36} />
      <text className="flujo-t" x={142} y={206}>Modelo</text>
      <text className="flujo-ts" x={142} y={228}>Power BI</text>

      {salidas.map((s, i) => (
        <g key={s}>
          <Nodo x={60} y={276 + i * 64} w={270} h={48} />
          <text className="flujo-t" x={82} y={306 + i * 64}>{s}</text>
        </g>
      ))}
    </svg>
  );
}

export function FlujoDatos() {
  // La fila se repite dos veces para que el deslizamiento no tenga saltos.
  const fila = [...herramientas, ...herramientas];

  return (
    <section id="como-trabajo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="flujo-titulo" className="titulo-seccion">De dato a decisión</h2>
          <p className="max-w-[48ch] text-base text-tenue sm:text-lg">
            Junto la información que está regada en hojas y carpetas, la ordeno en un modelo y la
            convierto en tableros y reportes que ayudan a decidir.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-linea bg-superficie/40 p-6 sm:p-10">
          <DiagramaAncho />
          <DiagramaAngosto />
        </div>
      </div>

      {/* Fila de herramientas: logos oficiales, se pausa al pasar el mouse */}
      <div className="fila-herramientas overflow-hidden pb-24 lg:pb-32">
        <ul aria-label="Herramientas con las que trabajo" className="animate-herramientas flex w-max gap-4">
          {fila.map((h, i) => (
            <li
              key={i}
              aria-hidden={i >= herramientas.length}
              className="flex items-center gap-3 rounded-2xl border border-linea bg-superficie py-3 pl-3 pr-5 font-medium whitespace-nowrap transition-[border-color,transform] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-acento/50"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-tinta">
                <Image src={h.logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
              </span>
              {h.nombre}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
