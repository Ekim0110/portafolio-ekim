"use client";
// La captura de un proyecto se puede abrir en grande:
//  - al pasar el mouse aparece el botón "Ampliar";
//  - el visor se abre centrado, creciendo un poco desde 96 % (nunca desde cero);
//  - dentro del visor, un clic acerca la imagen al doble justo en ese punto, y
//    mover el mouse la recorre; otro clic la vuelve a su tamaño;
//  - se cierra con Esc, con la ✕ o haciendo clic fuera de la imagen.
// Usamos <dialog>, que ya trae del navegador el foco y la tecla Esc.

import Image from "next/image";
import { useRef, useState } from "react";

export function ImagenAmpliable({ src, alt, titulo }: { src: string; alt: string; titulo: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(false);
  const [origen, setOrigen] = useState("50% 50%");

  // Calcula el punto del mouse dentro de la imagen, en porcentaje.
  const puntoEn = (e: React.PointerEvent | React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    return `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`;
  };

  const abrir = () => {
    setZoom(false);
    dialogo.current?.showModal();
  };
  const cerrar = () => dialogo.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        aria-label={`Ampliar la captura de ${titulo}`}
        className="relative block h-full w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
        <span className="ampliar-pista pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-fondo/85 px-3.5 py-2 text-xs font-medium text-tinta backdrop-blur">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
          Ampliar
        </span>
      </button>

      <dialog
        ref={dialogo}
        aria-label={`Captura de ${titulo}`}
        onClick={(e) => {
          // Clic en el fondo oscuro (fuera de la imagen): cerrar.
          if (e.target === e.currentTarget) cerrar();
        }}
        onClose={() => setZoom(false)}
        className="visor m-auto max-h-[92svh] w-[min(1200px,94vw)] overflow-visible bg-transparent p-0 text-tinta"
      >
        <div className="flex items-center justify-between gap-4 pb-3">
          <p className="font-display text-lg font-semibold tracking-tight">{titulo}</p>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-tenue sm:inline">
              {zoom ? "Mueve el mouse para recorrer · clic para alejar" : "Clic en la imagen para acercar"}
            </span>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="presionable grid h-10 w-10 place-items-center rounded-full border border-linea bg-fondo hover:border-tinta"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className={`overflow-hidden rounded-2xl ring-1 ring-linea ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={(e) => {
            setOrigen(puntoEn(e));
            setZoom((z) => !z);
          }}
          onPointerMove={(e) => {
            if (zoom) setOrigen(puntoEn(e));
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={1050}
            sizes="94vw"
            className="visor-imagen block h-auto max-h-[80svh] w-full object-contain"
            style={{ transform: zoom ? "scale(2)" : "none", transformOrigin: origen }}
          />
        </div>
      </dialog>
    </>
  );
}
