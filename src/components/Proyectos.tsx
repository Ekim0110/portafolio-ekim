"use client";
// "use client" = este componente corre en el navegador, porque tiene
// interacción (los botones de filtro guardan un estado).

import { useLayoutEffect, useRef, useState } from "react";
import { proyectos, type Proyecto } from "@/data/perfil";
import { TarjetaProyecto } from "./TarjetaProyecto";
import { Revelar } from "./Revelar";

type Filtro = "Todos" | Proyecto["categoria"];
const filtros: Filtro[] = ["Todos", "Power BI", "HTML"];

export function Proyectos() {
  // useState guarda qué filtro está activo; al cambiarlo, React redibuja la lista.
  const [activo, setActivo] = useState<Filtro>("Todos");
  const visibles = activo === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === activo);

  // "Píldora" que se desliza detrás del botón activo. Medimos dónde está ese
  // botón y movemos la píldora hasta allí con una transición suave.
  const botones = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pildora, setPildora] = useState({ x: 0, ancho: 0 });
  useLayoutEffect(() => {
    const medir = () => {
      const b = botones.current[activo];
      if (b) setPildora({ x: b.offsetLeft, ancho: b.offsetWidth });
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [activo]);

  return (
    <section id="proyectos" className="scroll-mt-20">
      <Revelar className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="entrada">
            <p className="text-sm font-medium uppercase tracking-widest text-acento">Trabajo</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Proyectos</h2>
          </div>
          <div
            role="group"
            aria-label="Filtrar proyectos"
            className="entrada relative flex gap-1 self-start rounded-full border border-linea p-1"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-0 rounded-full bg-tinta transition-[transform,width] duration-300 ease-[var(--ease-out)]"
              style={{ width: pildora.ancho, transform: `translateX(${pildora.x}px)` }}
            />
            {filtros.map((f) => (
              <button
                key={f}
                ref={(el) => {
                  botones.current[f] = el;
                }}
                type="button"
                onClick={() => setActivo(f)}
                aria-pressed={activo === f}
                className={`presionable relative min-h-10 rounded-full px-4 text-sm ${
                  activo === f ? "text-fondo" : "text-tenue hover:text-tinta"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {/* key={activo}: al cambiar el filtro React crea la lista de nuevo,
            y así las tarjetas vuelven a entrar una tras otra. */}
        <div key={activo} className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p, i) => (
            <div key={p.titulo} className="entrada" style={{ "--i": i + 2 } as React.CSSProperties}>
              <TarjetaProyecto proyecto={p} />
            </div>
          ))}
        </div>
      </Revelar>
    </section>
  );
}
