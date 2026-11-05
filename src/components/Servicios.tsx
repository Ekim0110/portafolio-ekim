import { servicios } from "@/data/perfil";
import { Revelar } from "./Revelar";

// Lista numerada de servicios, al estilo editorial de la referencia.
export function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-20 bg-superficie">
      <Revelar className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-acento">Cómo puedo ayudarte</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Servicios</h2>
        <ol className="mt-12 divide-y divide-linea border-y border-linea">
          {servicios.map((s, i) => (
            <li
              key={s.titulo}
              className="entrada group grid gap-2 py-8 sm:grid-cols-[4rem_1fr_1.5fr] sm:gap-8"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="tabular font-mono text-sm text-tenue transition-colors duration-300 group-hover:text-acento">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-lg font-semibold transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1">{s.titulo}</h3>
              <p className="max-w-[60ch] text-tenue">{s.descripcion}</p>
            </li>
          ))}
        </ol>
      </Revelar>
    </section>
  );
}
