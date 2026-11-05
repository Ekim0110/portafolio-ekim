import Image from "next/image";
import { perfil } from "@/data/perfil";
import { Nav } from "@/components/Nav";
import { Marquesina } from "@/components/Marquesina";
import { Proyectos } from "@/components/Proyectos";
import { Servicios } from "@/components/Servicios";
import { EtiquetaEjemplo } from "@/components/Etiqueta";
import { GloboRed } from "@/components/GloboRed";
import { CopiarCorreo } from "@/components/CopiarCorreo";
import { IconoFlechaAbajo, IconoFlechaDiagonal } from "@/components/Iconos";

// Atajo para dar el orden de entrada (--i) a cada elemento animado.
const orden = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Página principal: junta todas las secciones en orden, de arriba hacia abajo.
export default function Inicio() {
  const [primerParrafo, ...restoSobreMi] = perfil.sobreMi;

  return (
    <>
      <Nav />
      <main id="inicio">
        {/* 1. Portada (hero): nombre gigante + rol + globo + llamada a la acción */}
        <section className="relative isolate overflow-hidden">
          {/* Fondo: un brillo cálido detrás del globo */}
          <div aria-hidden="true" className="brillo pointer-events-none absolute -z-10 right-[-10%] top-[8%] h-[640px] w-[640px] max-w-full opacity-70" />

          <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-center gap-6 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pt-6">
            {/* Columna izquierda: texto. Columna derecha: globo (debajo en móvil). */}
            <div>
              <h1 className="font-display text-[clamp(3.5rem,11vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
                <span className="mascara"><span className="sube" style={orden(0)}>Hola, soy</span></span>
                <span className="mascara"><span className="sube text-acento" style={orden(1)}>{perfil.nombreCorto}.</span></span>
              </h1>
              <p className="entrada mt-8 max-w-[22ch] font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl" style={orden(4)}>
                {perfil.rol}.
              </p>
              <p className="entrada mt-4 max-w-[48ch] text-base text-tenue sm:text-lg" style={orden(5)}>{perfil.frase}</p>
              <div className="entrada mt-10 flex flex-wrap gap-3" style={orden(6)}>
                <a href="#proyectos" className="presionable inline-flex min-h-12 items-center gap-2 rounded-full bg-acento px-6 text-sm font-semibold text-fondo hover:bg-tinta">
                  Ver proyectos
                  <IconoFlechaAbajo className="flecha h-4 w-4" />
                </a>
                <a href="#contacto" className="presionable inline-flex min-h-12 items-center rounded-full border border-linea px-6 text-sm font-medium hover:border-tinta">
                  Hablemos
                </a>
              </div>
            </div>
            <div className="llega-globo flex justify-center">
              <GloboRed />
            </div>
          </div>
        </section>

        {/* 2. Banda animada */}
        <Marquesina />

        {/* 3. Proyectos con filtro */}
        <Proyectos />

        {/* 4. Servicios */}
        <Servicios />

        {/* 5. Sobre mí */}
        <section id="sobre-mi" className="scroll-mt-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:py-32">
            <div>
              <h2 className="titulo-seccion">
                Sobre mí{perfil.sobreMiEjemplo && <EtiquetaEjemplo />}
              </h2>
              {/* next/image optimiza la foto: la comprime y la sirve al tamaño justo para cada pantalla */}
              <div className="group mt-10 max-w-sm overflow-hidden rounded-3xl ring-1 ring-linea">
                <Image
                  src="/ekim.png"
                  alt={`Foto de ${perfil.nombre}`}
                  width={480}
                  height={480}
                  className="aspect-square w-full object-cover grayscale-[35%] transition-[filter,transform] duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
            </div>
            <div className="max-w-[60ch] md:pt-28">
              <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{primerParrafo}</p>
              {restoSobreMi.map((p) => (
                <p key={p} className="mt-6 text-base leading-relaxed text-tenue sm:text-lg">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Contacto */}
        <section id="contacto" className="scroll-mt-20 border-t border-linea bg-superficie">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
            <h2 className="max-w-4xl font-display text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
              ¿Tienes un proyecto <span className="text-acento">en mente?</span>
            </h2>
            <a
              href={`mailto:${perfil.email}`}
              className="subrayado-grueso mt-12 inline-block break-all pb-2 font-display text-[clamp(1.5rem,4.5vw,3rem)] font-medium tracking-tight hover:text-acento"
            >
              {perfil.email}
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopiarCorreo correo={perfil.email} />
              <a
                href={perfil.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="presionable group inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-medium hover:border-tinta"
              >
                LinkedIn
                <IconoFlechaDiagonal className="flecha flecha-diagonal h-4 w-4" />
              </a>
              {perfil.contactoEjemplo && <EtiquetaEjemplo />}
            </div>
          </div>
        </section>
      </main>

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
    </>
  );
}
