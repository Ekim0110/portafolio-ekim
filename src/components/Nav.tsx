import Link from "next/link";
import { perfil } from "@/data/perfil";
import { LogoSimbolo, LogoTexto } from "./LogoMarca";

// Menú superior. Es "sticky": se queda pegado arriba al hacer scroll.
const enlaces = [
  { href: "/#proyectos", texto: "Proyectos" },
  { href: "/#servicios", texto: "Servicios" },
  { href: "/#metodo", texto: "Método" },
  { href: "/#sobre-mi", texto: "Sobre mí" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-linea/70 bg-fondo/75 backdrop-blur-md">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/#inicio"
          aria-label={`${perfil.marca}, por ${perfil.nombre}: ir al inicio`}
          className="logo-rumbo presionable flex items-center gap-2.5"
        >
          {/* Logo de la marca: símbolo + nombre; "por Mike Bernal" solo en pantallas anchas */}
          <LogoSimbolo id="logo-menu" />
          <LogoTexto marca={perfil.marca} className="text-lg" />
          <span className="hidden border-l border-linea pl-2.5 text-xs text-tenue md:inline">
            por {perfil.nombre.split(" ").slice(0, 2).join(" ")}
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-7">
          <ul className="flex items-center gap-4 text-sm sm:gap-7">
            {enlaces.map((e) => (
              <li key={e.href} className={e.href === "/#proyectos" ? "" : "hidden sm:block"}>
                <Link href={e.href} className="group inline-flex min-h-10 items-center text-tenue transition-colors duration-200 hover:text-tinta">
                  <span className="subrayado pb-0.5">{e.texto}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#contacto"
            className="presionable inline-flex min-h-10 items-center rounded-full bg-tinta px-4 text-sm font-medium text-fondo hover:bg-acento"
          >
            Hablemos
          </Link>
        </div>
      </nav>
    </header>
  );
}
