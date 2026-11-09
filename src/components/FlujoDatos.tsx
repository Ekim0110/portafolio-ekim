/**
 * 🔀 DE DATO A DECISIÓN
 * Un diagrama que cuenta el trabajo en segundos, en cuatro columnas:
 *   fuentes (Excel, SharePoint) → análisis y modelo (Power BI) →
 *   entregables (tableros en Power BI y HTML, informe, reporte) → decisión.
 * Unos pulsos de luz recorren las líneas cada 3,2 s, de izquierda a derecha.
 */

// Lo que sale del análisis. "logo" usa un logo real; "icono" un dibujo simple de línea.
const entregables: { texto: string; logo?: string; icono?: "documento" | "repetir" }[] = [
  { texto: "Tablero en Power BI", logo: "/herramientas/power-bi.svg" },
  { texto: "Tablero en HTML", logo: "/herramientas/html.svg" },
  { texto: "Informe de análisis", icono: "documento" },
  { texto: "Reporte automático", icono: "repetir" },
];

// Una "caja" del diagrama dibujada en SVG.
function Nodo({ x, y, w, h, destacado }: { x: number; y: number; w: number; h: number; destacado?: boolean }) {
  return <rect className={destacado ? "nodo nodo-destacado" : "nodo"} x={x} y={y} width={w} height={h} rx={14} />;
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

// Ícono de 20 px dentro de un entregable: logo real o dibujo de línea.
function IconoEntregable({ e, x, y }: { e: (typeof entregables)[number]; x: number; y: number }) {
  if (e.logo) return <image href={e.logo} x={x} y={y} width={20} height={20} />;
  return (
    <g className="flujo-icono" transform={`translate(${x} ${y}) scale(0.833)`}>
      {e.icono === "documento" ? (
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h6" />
      ) : (
        <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
      )}
    </g>
  );
}

// Fuente de datos: logo de Excel o etiqueta de texto para SharePoint (no tiene logo libre).
function Fuente({ x, y, w, h, texto, sub }: { x: number; y: number; w: number; h: number; texto: string; sub: string }) {
  const conLogo = texto === "Excel";
  const tx = conLogo ? x + 56 : x + 20;
  return (
    <g>
      <Nodo x={x} y={y} w={w} h={h} />
      {conLogo && <image href="/herramientas/excel.svg" x={x + 16} y={y + h / 2 - 16} width={32} height={32} />}
      <text className="flujo-t" x={tx} y={y + h / 2 - 3}>{texto}</text>
      <text className="flujo-ts" x={tx} y={y + h / 2 + 16}>{sub}</text>
    </g>
  );
}

// Versión ancha (tablet y computador): de izquierda a derecha, en cuatro columnas.
function DiagramaAncho() {
  const filaY = (i: number) => 40 + i * 80; // arriba de cada entregable
  const centro = 180; // altura del centro del diagrama
  return (
    <svg viewBox="0 0 1100 360" className="hidden h-auto w-full md:block" role="img" aria-labelledby="flujo-titulo">
      {/* Fuentes → análisis */}
      <Via d="M200 126 C 250 126 250 170 300 170" retraso={0} color="teal" />
      <Via d="M200 234 C 250 234 250 190 300 190" retraso={120} color="teal" />
      {/* Análisis → entregables → decisión */}
      {entregables.map((_, i) => {
        const y = filaY(i) + 26;
        return (
          <g key={i}>
            <Via d={`M490 ${centro} C 545 ${centro} 545 ${y} 600 ${y}`} retraso={700 + i * 100} />
            <Via d={`M830 ${y} C 875 ${y} 875 ${centro} 920 ${centro}`} retraso={1500 + i * 100} />
          </g>
        );
      })}

      <Fuente x={20} y={90} w={180} h={72} texto="Excel" sub="Hojas de cálculo" />
      <Fuente x={20} y={198} w={180} h={72} texto="SharePoint" sub="Listas y carpetas" />

      <Nodo x={300} y={128} w={190} h={104} destacado />
      <image href="/herramientas/power-bi.svg" x={318} y={162} width={30} height={36} />
      <text className="flujo-t" x={360} y={176}>Análisis</text>
      <text className="flujo-ts" x={360} y={196}>Modelo de datos</text>

      {entregables.map((e, i) => (
        <g key={e.texto}>
          <Nodo x={600} y={filaY(i)} w={230} h={52} />
          <IconoEntregable e={e} x={618} y={filaY(i) + 16} />
          <text className="flujo-t" x={650} y={filaY(i) + 31}>{e.texto}</text>
        </g>
      ))}

      <Nodo x={920} y={146} w={160} h={68} destacado />
      <text className="flujo-t flujo-destacado" x={1000} y={186} textAnchor="middle">Decisión</text>
    </svg>
  );
}

// Versión angosta (celular): de arriba hacia abajo, para que nada quede diminuto.
function DiagramaAngosto() {
  const filaY = (i: number) => 252 + i * 58;
  return (
    <svg viewBox="0 0 340 600" className="mx-auto h-auto w-full max-w-sm md:hidden" role="img" aria-labelledby="flujo-titulo">
      {/* Fuentes → análisis */}
      <Via d="M87 76 C 87 108 170 100 170 130" retraso={0} color="teal" />
      <Via d="M253 76 C 253 108 170 100 170 130" retraso={120} color="teal" />
      {entregables.map((_, i) => {
        const y = filaY(i) + 23;
        return (
          <g key={i}>
            {/* Bajan por un "tronco" a la izquierda y entran a cada entregable */}
            <Via d={`M120 214 C 120 232 26 226 26 246 L26 ${y} L44 ${y}`} retraso={700 + i * 100} />
            {/* Salen por la derecha y bajan hasta la decisión */}
            <Via d={`M296 ${y} L314 ${y} L314 556 L250 556`} retraso={1500 + i * 100} />
          </g>
        );
      })}

      <Fuente x={10} y={10} w={155} h={66} texto="Excel" sub="Hojas" />
      <Fuente x={175} y={10} w={155} h={66} texto="SharePoint" sub="Listas" />

      <Nodo x={70} y={130} w={200} h={84} destacado />
      <image href="/herramientas/power-bi.svg" x={88} y={154} width={30} height={36} />
      <text className="flujo-t" x={130} y={168}>Análisis</text>
      <text className="flujo-ts" x={130} y={188}>Modelo de datos</text>

      {entregables.map((e, i) => (
        <g key={e.texto}>
          <Nodo x={44} y={filaY(i)} w={252} h={46} />
          <IconoEntregable e={e} x={60} y={filaY(i) + 13} />
          <text className="flujo-t" x={90} y={filaY(i) + 28}>{e.texto}</text>
        </g>
      ))}

      <Nodo x={90} y={526} w={160} h={60} destacado />
      <text className="flujo-t flujo-destacado" x={170} y={562} textAnchor="middle">Decisión</text>
    </svg>
  );
}

export function FlujoDatos() {
  return (
    <section id="como-trabajo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 lg:pt-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="flujo-titulo" className="titulo-seccion">De dato a decisión</h2>
          <p className="max-w-[48ch] text-base text-tenue sm:text-lg">
            Junto la información que está regada en hojas y carpetas, la analizo en un modelo y la
            convierto en tableros, informes y reportes que ayudan a decidir.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-linea bg-superficie/40 p-5 sm:p-10">
          <DiagramaAncho />
          <DiagramaAngosto />
        </div>
      </div>

    </section>
  );
}
