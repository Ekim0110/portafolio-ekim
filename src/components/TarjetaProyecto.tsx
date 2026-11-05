import Image from "next/image";
import type { Proyecto } from "@/data/perfil";
import { EtiquetaEjemplo } from "./Etiqueta";
import { IconoFlechaDiagonal } from "./Iconos";
import { ImagenAmpliable } from "./ImagenAmpliable";

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
            className="flex-1 origin-bottom rounded-t bg-acento/70 transition-[transform,background-color] duration-500 ease-[var(--ease-out)] group-hover:scale-y-[1.06] group-hover:bg-acento"
            style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
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

export function TarjetaProyecto({ proyecto, destacado = false }: { proyecto: Proyecto; destacado?: boolean }) {
  const contenido = (
    <article className="group flex h-full flex-col">
      <div
        className={`relative overflow-hidden rounded-2xl bg-superficie ring-1 ring-linea transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:ring-acento/40 group-hover:shadow-[0_24px_48px_-24px_rgba(240,138,93,0.4)] ${
          destacado ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        {/* Si hay captura real, la mostramos (y se puede ampliar); si no, la miniatura
            dibujada con CSS. Si toda la tarjeta ya es un enlace, la captura no lleva
            botón propio (un botón dentro de un enlace no es válido). */}
        {proyecto.imagen && !proyecto.enlace ? (
          <ImagenAmpliable src={proyecto.imagen} alt={`Captura del proyecto ${proyecto.titulo}`} titulo={proyecto.titulo} />
        ) : proyecto.imagen ? (
          <Image
            src={proyecto.imagen}
            alt={`Captura del proyecto ${proyecto.titulo}`}
            width={1200}
            height={750}
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <Miniatura categoria={proyecto.categoria} semilla={proyecto.titulo.length} />
        )}
        {/* Si el proyecto tiene enlace, aparece una flecha en la esquina al pasar el mouse. */}
        {proyecto.enlace && (
          <span className="absolute right-4 top-4 grid h-10 w-10 scale-90 place-items-center rounded-full bg-tinta text-fondo opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-out)] group-hover:scale-100 group-hover:opacity-100">
            <IconoFlechaDiagonal className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-tenue">
        <span className="h-1.5 w-1.5 rounded-full bg-acento" aria-hidden="true" />
        {proyecto.categoria}
      </div>
      <h3 className={`mt-2 font-display font-semibold tracking-tight ${destacado ? "text-2xl sm:text-3xl" : "text-xl"}`}>
        {proyecto.titulo}
        {proyecto.ejemplo && <EtiquetaEjemplo />}
      </h3>
      <p className={`mt-2 max-w-[62ch] text-tenue ${destacado ? "text-base" : "text-sm"}`}>{proyecto.descripcion}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Herramientas">
        {proyecto.herramientas.map((h) => (
          <li key={h} className="rounded-full border border-linea px-2.5 py-0.5 text-xs text-tenue">
            {h}
          </li>
        ))}
      </ul>
    </article>
  );

  // Si el proyecto tiene enlace, toda la tarjeta se vuelve clicable.
  return proyecto.enlace ? (
    <a href={proyecto.enlace} target="_blank" rel="noopener noreferrer" className="block h-full">
      {contenido}
    </a>
  ) : (
    contenido
  );
}
