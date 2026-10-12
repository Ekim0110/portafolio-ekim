"use client";
// "use client" = este componente corre en el navegador, porque tiene
// interacción (los botones de filtro guardan un estado).

import { useState } from "react";
import { proyectos, type Proyecto } from "@/data/perfil";
import { TarjetaProyecto } from "./TarjetaProyecto";

type Filtro = "Todos" | Proyecto["categoria"];
const filtros: Filtro[] = ["Todos", "Power BI", "HTML"];

export function Proyectos() {
  // useState guarda qué filtro está activo; al cambiarlo, React redibuja la lista.
  const [activo, setActivo] = useState<Filtro>("Todos");
  const visibles = activo === "Todos" ? proyectos : proyectos.filter((p) => p.categoria === activo);

  return (
    <section id="proyectos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-acento">Trabajo</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Proyectos</h2>
        </div>
        <div role="group" aria-label="Filtrar proyectos" className="flex gap-2">
          {filtros.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActivo(f)}
              aria-pressed={activo === f}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                activo === f ? "border-tinta bg-tinta text-fondo" : "border-linea hover:border-tinta"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => (
          <TarjetaProyecto key={p.titulo} proyecto={p} />
        ))}
      </div>
    </section>
  );
}
