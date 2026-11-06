"use client";
// "use client" = este componente corre en el navegador, porque tiene
// interacción (los botones de filtro guardan un estado).

import { useLayoutEffect, useRef, useState } from "react";
import { proyectos, type Proyecto } from "@/data/perfil";
import { TarjetaProyecto } from "./TarjetaProyecto";

type Filtro = "Todos" | Proyecto["categoria"];
const filtros: Filtro[] = ["Todos", "Tableros", "Informes", "Web"];

export function Proyectos() {
  // useState guarda qué filtro está activo; al cambiarlo, React redibuja la lista.
  const [activo, setActivo] = useState<Filtro>("Todos");
  const visibles = activo === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === activo);

  // Los proyectos con captura real van "destacados" (más grandes, dos por fila).
  // Los demás se reparten en filas de tres, o de dos si así no queda un hueco.
  const restantes = visibles.filter((p) => !p.imagen).length;
  const anchoResto = restantes % 3 !== 0 && restantes % 2 === 0 ? "sm:col-span-3" : "sm:col-span-2";

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
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="titulo-seccion">
            Lo que he construido
            {/* Cuántos proyectos se ven con el filtro actual */}
            <sup className="tabular ml-2 align-super font-mono text-base font-normal tracking-normal text-acento sm:text-lg">
              ({String(visibles.length).padStart(2, "0")})
            </sup>
          </h2>
          <div
            role="group"
            aria-label="Filtrar proyectos"
            className="relative flex gap-1 self-start rounded-full border border-linea p-1 sm:self-auto"
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
            y así las tarjetas vuelven a entrar una tras otra (muestra el cambio). */}
        <div key={activo} className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-6 lg:gap-x-8">
          {visibles.map((p, i) => (
            <div
              key={p.titulo}
              className={`entrada ${p.imagen ? "sm:col-span-3" : anchoResto}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <TarjetaProyecto proyecto={p} destacado={!!p.imagen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
