import { servicios } from "@/data/perfil";

// Lista numerada de servicios, al estilo editorial de la referencia.
export function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-20 bg-superficie">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-acento">Cómo puedo ayudarte</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Servicios</h2>
        <ol className="mt-12 divide-y divide-linea border-y border-linea">
          {servicios.map((s, i) => (
            <li key={s.titulo} className="grid gap-2 py-8 sm:grid-cols-[4rem_1fr_1.5fr] sm:gap-8">
              <span className="font-mono text-sm text-tenue">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-xl font-semibold">{s.titulo}</h3>
              <p className="text-tenue">{s.descripcion}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
