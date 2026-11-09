import Link from "next/link";
import { compromisos } from "@/data/perfil";
import { IconoFlecha } from "./Iconos";

/**
 * 🤝 CÓMO ES TRABAJAR CONMIGO
 * Compromisos propios en vez de opiniones de terceros: cosas que Mike controla y
 * que nadie puede desmentir. Cada uno lleva una cifra grande para leerse de un
 * vistazo. Se editan en el panel: "Cómo es trabajar conmigo".
 */
export function TrabajarConmigo() {
  return (
    <section id="trabajar-conmigo" className="scroll-mt-20 bg-superficie">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="titulo-seccion">Cómo es trabajar conmigo</h2>
          <p className="mt-6 max-w-[40ch] text-base text-tenue sm:text-lg">
            Lo que puedes esperar desde el primer mensaje hasta la entrega.
          </p>
          <Link
            href="/#contacto"
            className="presionable mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-acento px-6 text-sm font-semibold text-fondo hover:bg-tinta"
          >
            Empezar un proyecto
            <IconoFlecha className="flecha h-4 w-4" />
          </Link>
        </div>

        <ol className="border-t border-linea">
          {compromisos.map((c) => (
            <li key={c.titulo} className="compromiso grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-b border-linea py-8 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
              <span className="compromiso-valor tabular font-display text-3xl font-semibold leading-none tracking-tight text-acento sm:text-4xl">
                {c.valor}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{c.titulo}</h3>
                <p className="mt-2 max-w-[52ch] text-tenue">{c.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
