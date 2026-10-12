import { perfil } from "@/data/perfil";

// Menú superior. Es "sticky": se queda pegado arriba al hacer scroll.
const enlaces = [
  { href: "#proyectos", texto: "Proyectos" },
  { href: "#servicios", texto: "Servicios" },
  { href: "#sobre-mi", texto: "Sobre mí" },
  { href: "#contacto", texto: "Contacto" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-linea bg-fondo/85 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
      >
        <a href="#inicio" className="flex items-center gap-2 font-semibold">
          {/* Logo simple: la inicial dentro de un cuadro */}
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-md bg-tinta text-sm text-fondo"
          >
            {perfil.nombre.charAt(0)}
          </span>
          {perfil.nombre}
        </a>
        <ul className="flex gap-4 text-sm sm:gap-6">
          {enlaces.map((e) => (
            <li key={e.href} className={e.href === "#sobre-mi" ? "hidden sm:block" : ""}>
              <a href={e.href} className="text-tenue transition-colors hover:text-tinta">
                {e.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
