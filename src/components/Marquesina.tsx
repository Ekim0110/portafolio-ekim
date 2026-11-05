import { IconoDestello } from "./Iconos";

// Banda de texto que se desplaza sin fin (inspirada en la página de referencia).
// Repetimos la lista dos veces para que el bucle no tenga "saltos".
const palabras = ["Power BI", "Procesos", "Finanzas", "Proyectos", "Datos", "Web"];

export function Marquesina() {
  const lista = [...palabras, ...palabras];
  return (
    <div className="overflow-hidden bg-acento py-5 text-fondo sm:py-7" aria-hidden="true">
      <div className="animate-marquesina flex w-max gap-10 whitespace-nowrap font-display text-3xl font-semibold tracking-[-0.03em] sm:gap-14 sm:text-5xl">
        {lista.map((p, i) => (
          <span key={i} className="flex items-center gap-10 sm:gap-14">
            {p}
            <IconoDestello className="h-5 w-5 sm:h-7 sm:w-7" />
          </span>
        ))}
      </div>
    </div>
  );
}
