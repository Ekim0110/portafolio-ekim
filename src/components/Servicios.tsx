import { servicios } from "@/data/perfil";
import { IconoFlecha } from "./Iconos";

// Lista de servicios en filas grandes, al estilo editorial. Al pasar el mouse,
// la fila se llena de naranja de abajo hacia arriba (ver .fila-servicio en globals.css).
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
              <IconoFlecha className="flecha hidden h-6 w-6 text-acento sm:block" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
