"use client";
// Botón que copia el correo al portapapeles y confirma con un ✓.
// El cambio de ícono y texto se hace con un leve desenfoque: así se ve como
// una sola transformación y no como dos cosas que se reemplazan de golpe.

import { useEffect, useState } from "react";
import { IconoCheck, IconoCopiar } from "./Iconos";

export function CopiarCorreo({ correo }: { correo: string }) {
  const [copiado, setCopiado] = useState(false);

  // Tras 1,8 s vuelve al estado normal.
  useEffect(() => {
    if (!copiado) return;
    const t = setTimeout(() => setCopiado(false), 1800);
    return () => clearTimeout(t);
  }, [copiado]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo);
      setCopiado(true);
    } catch {
      // Si el navegador no deja copiar, abrimos el correo como alternativa.
      window.location.href = `mailto:${correo}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copiar}
      className="presionable inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-medium text-tinta hover:border-tinta"
    >
      <span className="relative grid h-5 w-5 place-items-center">
        {[false, true].map((estado) => (
          <span
            key={String(estado)}
            className="absolute inset-0 grid place-items-center transition-[opacity,filter,transform] duration-200 ease-[var(--ease-out)]"
            style={{
              opacity: copiado === estado ? 1 : 0,
              filter: copiado === estado ? "none" : "blur(4px)",
              transform: copiado === estado ? "none" : "scale(0.8)",
            }}
          >
            {estado ? <IconoCheck className="h-[18px] w-[18px] text-acento" /> : <IconoCopiar className="h-[18px] w-[18px]" />}
          </span>
        ))}
      </span>
      <span aria-live="polite">{copiado ? "Correo copiado" : "Copiar correo"}</span>
    </button>
  );
}
