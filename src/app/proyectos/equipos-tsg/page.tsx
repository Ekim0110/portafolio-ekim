import Link from "next/link";
import type { Metadata } from "next";
import { casoTsg as caso, perfil } from "@/data/perfil";
import { Nav } from "@/components/Nav";
import { Pie } from "@/components/Pie";
import { EtiquetaEjemplo } from "@/components/Etiqueta";
import { ImagenAmpliable } from "@/components/ImagenAmpliable";
import { IconoCheck, IconoFlecha } from "@/components/Iconos";

/**
 * 📄 CASO DE ESTUDIO: EQUIPOS TSG
 * La historia completa de un proyecto: el reto, cómo se resolvió paso a paso
 * con el Ciclo Señal, qué resultó y qué se aprendió.
 * Los textos se editan en el panel /keystatic → "Caso de estudio: Equipos TSG".
 */

export const metadata: Metadata = {
  title: `${caso.titulo} · Caso de estudio · ${perfil.nombre}`,
  description: caso.resumen,
};

// Los cinco pasos del Ciclo Señal, en orden, con la clave de su texto en el contenido.
const pasos = [
  { nombre: "Escuchar", clave: "escuchar" },
  { nombre: "Captar", clave: "captar" },
  { nombre: "Filtrar", clave: "filtrar" },
  { nombre: "Transmitir", clave: "transmitir" },
  { nombre: "Ajustar", clave: "ajustar" },
] as const;

export default function CasoEquiposTsg() {
  return (
    <>
      <Nav />
      <main>
        {/* 1. Encabezado: título, resumen y datos rápidos */}
        <header className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pt-16">
          <Link href="/#proyectos" className="group inline-flex min-h-10 items-center gap-2 text-sm text-tenue transition-colors duration-200 hover:text-tinta">
            <IconoFlecha className="h-4 w-4 rotate-180" />
            <span className="subrayado pb-0.5">Volver a proyectos</span>
          </Link>
          <h1 className="entrada mt-8 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
            {caso.titulo}
            {caso.ejemplo && <EtiquetaEjemplo />}
          </h1>
          <p className="entrada mt-6 max-w-[46ch] font-display text-xl font-medium leading-snug tracking-tight text-tinta/90 sm:text-2xl" style={{ "--i": 1 } as React.CSSProperties}>
            {caso.resumen}
          </p>

          <dl className="entrada mt-12 grid gap-6 border-t border-linea pt-6 sm:grid-cols-3" style={{ "--i": 2 } as React.CSSProperties}>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-tenue">Contexto</dt>
              <dd className="mt-2">{caso.contexto}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-tenue">Mi rol</dt>
              <dd className="mt-2">{caso.rol}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-tenue">Herramientas</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {caso.herramientas.map((h) => (
                  <span key={h} className="rounded-full border border-linea px-2.5 py-0.5 text-sm">{h}</span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        {/* 2. La captura en grande (se puede ampliar) */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="group aspect-[16/10] overflow-hidden rounded-3xl bg-superficie ring-1 ring-linea">
            <ImagenAmpliable src="/proyectos/equipos-tsg.png" alt={`Captura del informe ${caso.titulo}`} titulo={caso.titulo} />
          </div>
        </div>

        {/* 3. El reto */}
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-24 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:py-32">
          <h2 className="titulo-seccion">El reto</h2>
          <p className="max-w-[56ch] text-lg leading-relaxed text-tenue sm:text-xl md:pt-3">{caso.reto}</p>
        </section>

        {/* 4. Cómo lo resolví, paso a paso con el Ciclo Señal */}
        <section className="bg-superficie">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="titulo-seccion">Cómo lo resolví</h2>
              <Link href="/#metodo" className="group inline-flex min-h-10 items-center gap-2 text-sm text-tenue transition-colors duration-200 hover:text-tinta">
                <span className="subrayado pb-0.5">Así funciona el Ciclo Señal</span>
                <IconoFlecha className="flecha h-4 w-4" />
              </Link>
            </div>
            <ol className="mt-14 border-t border-linea">
              {pasos.map((p, i) => (
                <li key={p.clave} className="grid gap-3 border-b border-linea py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-10">
                  <div className="flex items-baseline gap-4">
                    <span className="tabular font-mono text-sm text-acento">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{p.nombre}</h3>
                  </div>
                  <p className="max-w-[60ch] text-base leading-relaxed text-tenue sm:text-lg">{caso.pasos[p.clave]}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Resultados */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:py-32">
          <h2 className="titulo-seccion">Resultados</h2>
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-linea bg-linea sm:grid-cols-2">
            {caso.resultados.map((r) => (
              <li key={r} className="flex items-start gap-3 bg-fondo p-6 sm:odd:last:col-span-2">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-acento/15 text-acento">
                  <IconoCheck className="h-4 w-4" />
                </span>
                <span className="text-base leading-snug sm:text-lg">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. Lo que aprendí */}
        <section className="border-t border-linea">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
            <h2 className="font-mono text-sm uppercase tracking-widest text-acento">Lo que aprendí</h2>
            <p className="mt-6 max-w-[36ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              {caso.aprendizaje}
            </p>
          </div>
        </section>

        {/* 7. Cierre: invitación a hablar */}
        <section className="border-t border-linea bg-superficie">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              ¿Tienes un proyecto <span className="text-acento">parecido?</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/#contacto" className="presionable inline-flex min-h-12 items-center gap-2 rounded-full bg-acento px-6 text-sm font-semibold text-fondo hover:bg-tinta">
                Hablemos
                <IconoFlecha className="flecha h-4 w-4" />
              </Link>
              <Link href="/#proyectos" className="presionable inline-flex min-h-12 items-center rounded-full border border-linea px-6 text-sm font-medium hover:border-tinta">
                Ver más proyectos
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Pie />
    </>
  );
}
