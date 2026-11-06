import Image from "next/image";
import Link from "next/link";
import type { Proyecto } from "@/data/perfil";
import { EtiquetaEjemplo } from "./Etiqueta";
import { IconoFlecha, IconoFlechaDiagonal } from "./Iconos";
import { ImagenAmpliable } from "./ImagenAmpliable";
import { MiniTablero } from "./MiniTableros";

export function TarjetaProyecto({ proyecto, destacado = false }: { proyecto: Proyecto; destacado?: boolean }) {
  const contenido = (
    <article className="group flex h-full flex-col">
      <div
        className={`relative overflow-hidden rounded-2xl bg-superficie ring-1 ring-linea transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:ring-acento/40 group-hover:shadow-[0_24px_48px_-24px_rgba(240,138,93,0.4)] ${
          destacado ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        {/* Si hay captura real, la mostramos (y se puede ampliar); si no, la miniatura
            dibujado en SVG. Si toda la tarjeta ya es un enlace, la captura no lleva
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
          <MiniTablero titulo={proyecto.titulo} categoria={proyecto.categoria} />
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
      <h3 className={`mt-2 font-display font-semibold tracking-tight ${destacado ? "text-xl sm:text-2xl" : "text-lg"}`}>
        {proyecto.titulo}
        {proyecto.ejemplo && <EtiquetaEjemplo />}
      </h3>
      <p className={`mt-2 max-w-[62ch] text-tenue ${destacado ? "text-base" : "text-sm"}`}>{proyecto.descripcion}</p>
      {/* Cifras reales del proyecto (se editan en el panel: "Cifras del proyecto"). */}
      {proyecto.metricas.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-linea py-4">
          {proyecto.metricas.slice(0, 3).map((m) => (
            <div key={m.etiqueta}>
              <dt className="sr-only">{m.etiqueta}</dt>
              <dd className="tabular font-display text-xl font-semibold tracking-tight sm:text-2xl">{m.valor}</dd>
              <dd className="mt-1 text-xs leading-snug text-tenue">{m.etiqueta}</dd>
            </div>
          ))}
        </dl>
      )}
      {/* Enlaces: caso de estudio completo y/o versión interactiva del tablero. */}
      {!proyecto.enlace && (proyecto.caso || proyecto.demo) && (
        <div className="mt-3 flex flex-wrap gap-x-6">
          {proyecto.caso && (
            <Link href={proyecto.caso} className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-acento">
              <span className="subrayado pb-0.5">Ver caso de estudio</span>
              <IconoFlecha className="flecha h-4 w-4" />
            </Link>
          )}
          {proyecto.demo && (
            <a href={proyecto.demo} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-acento">
              <span className="subrayado pb-0.5">Abrir tablero interactivo</span>
              <IconoFlechaDiagonal className="flecha flecha-diagonal h-4 w-4" />
            </a>
          )}
        </div>
      )}
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
