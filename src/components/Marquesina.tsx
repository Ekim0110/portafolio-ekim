// Banda de palabras grandes que se desplaza sin fin. Las letras van "huecas"
// (solo el contorno) y una de cada tres se rellena en naranja.
// Repetimos la lista dos veces para que el bucle no tenga "saltos".
const palabras = ["Power BI", "Procesos", "Finanzas", "Proyectos", "Datos", "Web"];

export function Marquesina() {
  const lista = [...palabras, ...palabras];
  return (
    <div className="banda-contorno overflow-hidden border-y border-linea py-5 sm:py-6" aria-hidden="true">
      <div className="animate-marquesina flex w-max gap-10 whitespace-nowrap font-display text-3xl font-semibold leading-none tracking-[-0.03em] sm:gap-14 sm:text-5xl">
        {lista.map((p, i) => (
          <span key={i} className={i % 3 === 0 ? "text-acento" : "palabra-hueca"}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
