import type { Proyecto } from "@/data/perfil";
import { EtiquetaEjemplo } from "./Etiqueta";

// Mientras no tengamos capturas reales, dibujamos una "miniatura" con CSS:
// barras para Power BI y una ventana de navegador para HTML.
function Miniatura({ categoria, semilla }: { categoria: Proyecto["categoria"]; semilla: number }) {
  if (categoria === "Power BI") {
    // Rotamos la lista según la "semilla" para que cada tarjeta tenga barras distintas.
    const base = [40, 65, 50, 85, 60, 95, 75];
    const alturas = base.map((_, i) => base[(i + semilla) % base.length]);
    return (
      <div className="flex h-full items-end gap-2 p-6">
        {alturas.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-acento/80 transition-all duration-500 group-hover:bg-acento"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="m-6 flex h-[calc(100%-3rem)] flex-col overflow-hidden rounded-lg border border-linea bg-fondo">
      <div className="flex gap-1.5 border-b border-linea p-2">
        <span className="h-2 w-2 rounded-full bg-linea" />
        <span className="h-2 w-2 rounded-full bg-linea" />
        <span className="h-2 w-2 rounded-full bg-linea" />
      </div>
      <div className="space-y-2 p-3">
        <div className="h-3 w-2/3 rounded bg-tinta/80" />
        <div className="h-2 w-full rounded bg-linea" />
        <div className="h-2 w-5/6 rounded bg-linea" />
        <div className="mt-3 h-6 w-1/3 rounded bg-acento/80" />
      </div>
    </div>
  );
}

export function TarjetaProyecto({ proyecto }: { proyecto: Proyecto }) {
  const contenido = (
    <article className="group flex h-full flex-col">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-superficie transition-transform duration-300 group-hover:-translate-y-1">
        <Miniatura categoria={proyecto.categoria} semilla={proyecto.titulo.length} />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-tenue">
        {proyecto.categoria}
      </p>
      <h3 className="mt-1 text-lg font-semibold">
        {proyecto.titulo}
        {proyecto.ejemplo && <EtiquetaEjemplo />}
      </h3>
      <p className="mt-1 text-sm text-tenue">{proyecto.descripcion}</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Herramientas">
        {proyecto.herramientas.map((h) => (
          <li key={h} className="rounded-full border border-linea px-2.5 py-0.5 text-xs">
            {h}
          </li>
        ))}
      </ul>
    </article>
  );

  // Si el proyecto tiene enlace, toda la tarjeta se vuelve clicable.
  return proyecto.enlace ? (
    <a href={proyecto.enlace} target="_blank" rel="noopener noreferrer">
      {contenido}
    </a>
  ) : (
    contenido
  );
}
