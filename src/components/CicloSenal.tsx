/**
 * 📶 CICLO SEÑAL — mi método de trabajo
 * La idea viene de las telecomunicaciones: los datos de una operación llegan
 * con mucho "ruido" (repetidos, incompletos, regados en mil archivos) y el
 * trabajo es convertirlos en una "señal" clara que se pueda leer y usar.
 * Arriba, una onda que empieza ruidosa y termina limpia; un pulso de luz la
 * recorre cada 4 s. Debajo, los cinco pasos con lo que entrega cada uno y un
 * ejemplo real tomado del proyecto de preoperacionales de flota.
 */

const pasos = [
  {
    nombre: "Escuchar",
    texto: "Entiendo cómo funciona la operación hoy y cuál es la pregunta que hay que responder.",
    entrega: "Mapa del proceso y pregunta clave",
    ejemplo: "¿Qué vehículos no están reportando su inspección diaria?",
  },
  {
    nombre: "Captar",
    texto: "Reúno los datos donde estén: hojas de Excel, listas de SharePoint, sistemas o formatos en papel.",
    entrega: "Inventario de fuentes",
    ejemplo: "Formularios de campo y hojas de Excel de cada mes.",
  },
  {
    nombre: "Filtrar",
    texto: "Quito el ruido: datos repetidos, vacíos o mal escritos. Lo uno todo en un solo modelo confiable.",
    entrega: "Modelo de datos limpio",
    ejemplo: "Placas duplicadas y fechas mal escritas.",
  },
  {
    nombre: "Transmitir",
    texto: "Muestro la respuesta en un tablero o informe que se entiende en segundos, en Power BI o HTML.",
    entrega: "Tablero o informe",
    ejemplo: "Tablero de cumplimiento por placa y conductor.",
  },
  {
    nombre: "Ajustar",
    texto: "Reviso con el equipo cómo lo usa y lo afino. En cada vuelta del ciclo la señal sale más clara.",
    entrega: "Mejoras según el uso real",
    ejemplo: "Filtros por proyecto y tipo de vehículo.",
  },
];

// Dibuja la onda: a la izquierda mucho ruido, a la derecha una curva limpia.
// Se calcula una sola vez (es igual para todos), con valores fijos para que
// el servidor y el navegador dibujen exactamente lo mismo.
function crearOnda() {
  const ancho = 1000;
  const medio = 60;
  const puntos: string[] = [];
  for (let x = 0; x <= ancho; x += 4) {
    const avance = x / ancho; // 0 = inicio ruidoso, 1 = final limpio
    const ruido =
      (Math.sin(x * 0.37) * 0.6 + Math.sin(x * 0.91 + 1.3) * 0.4 + Math.sin(x * 1.73 + 0.7) * 0.3) *
      Math.pow(1 - avance, 1.4) * 34;
    const senal = Math.sin(x * 0.045) * 26 * (0.35 + 0.65 * avance);
    puntos.push(`${x === 0 ? "M" : "L"}${x} ${(medio + ruido + senal).toFixed(1)}`);
  }
  return puntos.join(" ");
}
const onda = crearOnda();

export function CicloSenal() {
  return (
    <section id="metodo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 className="titulo-seccion">
            Ciclo <span className="text-acento">Señal</span>
          </h2>
          <p className="max-w-[48ch] text-base text-tenue sm:text-lg">
            Mi forma de trabajar. Los datos de una operación llegan con mucho ruido; el trabajo es
            convertirlos en una señal clara para decidir.
          </p>
        </div>

        {/* La onda: de ruido a señal */}
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="mt-14 h-24 w-full sm:h-28" aria-hidden="true">
          <defs>
            <linearGradient id="onda-color" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--tenue)" stopOpacity="0.35" />
              <stop offset="0.55" stopColor="var(--tenue)" stopOpacity="0.6" />
              <stop offset="1" stopColor="var(--acento)" />
            </linearGradient>
          </defs>
          <path d={onda} fill="none" stroke="url(#onda-color)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d={onda} className="pulso-onda" pathLength={100} vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-2 flex justify-between font-mono text-xs uppercase tracking-widest text-tenue">
          <span>Ruido</span>
          <span className="text-acento">Señal</span>
        </div>

        {/* Los cinco pasos */}
        <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-linea bg-linea sm:grid-cols-2 lg:grid-cols-5">
          {pasos.map((p, i) => (
            <li key={p.nombre} className="paso-ciclo flex flex-col bg-fondo p-6 sm:max-lg:last:col-span-2 lg:p-7">
              <span className="tabular font-mono text-sm text-acento">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{p.nombre}</h3>
              <p className="mt-3 text-sm leading-relaxed text-tenue">{p.texto}</p>
              {/* Un ejemplo real, tomado del proyecto de preoperacionales de flota */}
              <p className="mt-4 border-l border-acento/60 pl-3 text-sm italic leading-snug text-tinta/80">{p.ejemplo}</p>
              <p className="mt-auto pt-6 text-xs text-tenue">
                <span className="block font-mono uppercase tracking-widest text-tinta/70">Entrega</span>
                <span className="mt-1 block text-sm text-tinta">{p.entrega}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
