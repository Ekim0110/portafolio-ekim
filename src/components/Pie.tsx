import { perfil } from "@/data/perfil";

// Pie de página con la firma gigante del nombre. Se usa en todas las páginas.
export function Pie() {
  return (
    <footer className="overflow-hidden border-t border-linea">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 pt-8 text-sm text-tenue sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} {perfil.nombre}</p>
        <p>Hecho con Next.js y Tailwind · Proyecto Orbix</p>
      </div>
      {/* Firma gigante: el nombre como cierre visual de la página */}
      <p
        aria-hidden="true"
        className="mx-auto max-w-6xl select-none px-4 pt-6 font-display text-[clamp(3.5rem,14vw,12rem)] font-semibold leading-[0.78] tracking-[-0.04em] text-linea sm:px-6"
      >
        {perfil.nombre.split(" ").slice(0, 2).join(" ")}
      </p>
    </footer>
  );
}
