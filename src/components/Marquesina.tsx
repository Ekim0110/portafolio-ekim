// Banda de texto que se desplaza sin fin (inspirada en la página de referencia).
// Repetimos la lista dos veces para que el bucle no tenga "saltos".
const palabras = ["Power BI", "Procesos", "Finanzas", "Proyectos", "Datos", "Web"];

export function Marquesina() {
  const lista = [...palabras, ...palabras];
  return (
    <div className="overflow-hidden border-y border-linea bg-tinta py-4 text-fondo" aria-hidden="true">
      <div className="animate-marquesina flex w-max gap-10 whitespace-nowrap text-2xl font-semibold tracking-tight sm:text-4xl">
        {lista.map((p, i) => (
          <span key={i} className="flex items-center gap-10">
            {p}
            <span className="text-acento">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
