import { perfil, servicios } from "@/data/perfil";
import { IconoFlecha } from "./Iconos";

// Lista de servicios en filas grandes, al estilo editorial. Al pasar el mouse,
// la fila se llena de naranja de abajo hacia arriba (ver .fila-servicio en globals.css).
// Cada fila tiene "Cotizar", que abre un correo con el asunto ya escrito.
export function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-20 bg-superficie">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <h2 className="titulo-seccion max-w-3xl">Servicios</h2>
        <ul className="mt-14 border-t border-linea">
          {servicios.map((s) => (
            <li
              key={s.titulo}
              className="fila-servicio grid gap-3 border-b border-linea px-1 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-center sm:gap-10 sm:px-4"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-200 sm:text-2xl">
                {s.titulo}
              </h3>
              <p className="max-w-[56ch] text-tenue transition-colors duration-200">{s.descripcion}</p>
              {/* Abre el correo con el asunto ya escrito: "Cotización: <servicio>" */}
              <a
                href={`mailto:${perfil.email}?subject=${encodeURIComponent(`Cotización: ${s.titulo}`)}`}
                aria-label={`Cotizar ${s.titulo}`}
                className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-medium text-acento transition-colors duration-200 sm:self-center"
              >
                Cotizar
                <IconoFlecha className="flecha h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
