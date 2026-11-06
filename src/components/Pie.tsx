import { perfil } from "@/data/perfil";
import { LogoSimbolo, LogoTexto } from "./LogoMarca";

// Pie de página con la firma gigante de la marca. Se usa en todas las páginas.
export function Pie() {
  return (
    <footer className="overflow-hidden border-t border-linea">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 pt-8 text-sm text-tenue sm:flex-row sm:items-center sm:px-6">
        <p className="flex items-center gap-2.5">
          <LogoSimbolo id="logo-pie" className="h-6 w-12" />
          <span>
            © {new Date().getFullYear()} {perfil.marca} · {perfil.nombre}
          </span>
        </p>
        <p>Hecho con Next.js y Tailwind</p>
      </div>
      {/* Firma gigante: la marca como cierre visual de la página */}
      <p
        aria-hidden="true"
        className="mx-auto max-w-6xl select-none px-4 pt-6 font-display text-[clamp(3rem,13vw,10rem)] font-semibold leading-[0.78] tracking-[-0.04em] text-linea sm:px-6"
      >
        <LogoTexto marca={perfil.marca} heredaColor />
      </p>
    </footer>
  );
}
