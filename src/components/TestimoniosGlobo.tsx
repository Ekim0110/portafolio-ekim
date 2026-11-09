"use client";
// El globo de la portada con los testimonios encima.
//  - Si no hay testimonios publicados (con permiso), muestra solo el globo.
//  - Si hay, el globo gira hasta el país de cada persona, lo marca en naranja y
//    aparece su tarjeta. Cambia cada 7 s; al pasar el mouse se detiene.
//  - Con "menos movimiento" no cambia sola: se navega con los puntos.

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Testimonio } from "@/data/perfil";
import { GloboRed } from "./GloboRed";

function Iniciales({ nombre }: { nombre: string }) {
  const ini = nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acento/20 text-sm font-semibold text-acento">{ini}</span>
  );
}

export function TestimoniosGlobo({ testimonios }: { testimonios: Testimonio[] }) {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [quieto, setQuieto] = useState(false);
  useEffect(() => setQuieto(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const hay = testimonios.length > 0;
  useEffect(() => {
    if (!hay || pausa || quieto || testimonios.length < 2) return;
    const t = setTimeout(() => setActual((n) => (n + 1) % testimonios.length), 7000);
    return () => clearTimeout(t);
  }, [hay, pausa, quieto, actual, testimonios.length]);

  if (!hay) return <GloboRed />;

  const t = testimonios[actual];
  const paises = new Set(testimonios.map((x) => x.pais)).size;

  return (
    <div
      className="relative w-full max-w-[560px]"
      onPointerEnter={() => setPausa(true)}
      onPointerLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
    >
      <GloboRed enfoque={t.pais} />
      <figure className="absolute inset-x-2 bottom-0 rounded-2xl border border-linea bg-fondo/85 p-4 backdrop-blur-md sm:inset-x-6" aria-live="polite">
        <div key={actual} className="testimonio-entra">
          <blockquote className="text-sm leading-relaxed text-tinta sm:text-[15px]">“{t.frase}”</blockquote>
          <figcaption className="mt-3 flex items-center gap-3">
            {t.foto ? (
              <Image src={t.foto} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
            ) : (
              <Iniciales nombre={t.nombre} />
            )}
            <span className="min-w-0 text-xs leading-snug">
              <span className="block font-semibold text-tinta">{t.nombre}</span>
              <span className="block text-tenue">{t.cargo} · {t.ciudad}</span>
            </span>
          </figcaption>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-linea pt-3">
          <span className="text-xs text-tenue">
            {testimonios.length} {testimonios.length === 1 ? "opinión" : "opiniones"} · {paises} {paises === 1 ? "país" : "países"}
          </span>
          {testimonios.length > 1 && (
            <span className="flex gap-1.5">
              {testimonios.map((x, n) => (
                <button
                  key={x.nombre + n}
                  type="button"
                  onClick={() => setActual(n)}
                  aria-label={`Ver opinión de ${x.nombre}`}
                  aria-current={n === actual}
                  className="grid h-6 w-6 place-items-center"
                >
                  <span className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${n === actual ? "w-5 bg-acento" : "w-1.5 bg-tenue/50"}`} />
                </button>
              ))}
            </span>
          )}
        </div>
      </figure>
    </div>
  );
}
