import Image from "next/image";
import { perfil } from "@/data/perfil";
import { Nav } from "@/components/Nav";
import { Marquesina } from "@/components/Marquesina";
import { Proyectos } from "@/components/Proyectos";
import { Servicios } from "@/components/Servicios";
import { EtiquetaEjemplo } from "@/components/Etiqueta";
import { GloboRed } from "@/components/GloboRed";
import { Revelar } from "@/components/Revelar";

// Atajo para dar el orden de entrada (--i) a cada elemento animado.
const orden = (i: number) => ({ "--i": i }) as React.CSSProperties;

// Página principal: junta todas las secciones en orden, de arriba hacia abajo.
export default function Inicio() {
  return (
    <>
      <Nav />
      <main id="inicio">
        {/* 1. Portada (hero): nombre grande + rol + llamada a la acción */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr]">
          {/* Columna izquierda: texto. Columna derecha: globo (debajo en móvil). */}
          <div>
            <p className="entrada text-sm font-medium uppercase tracking-widest text-acento" style={orden(0)}>{perfil.rol}</p>
            <h1 style={orden(1)} className="entrada mt-4 text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[0.95] tracking-tighter">
              Hola, soy {perfil.nombreCorto}.
            </h1>
            <p className="entrada mt-6 max-w-[48ch] text-base text-tenue sm:text-lg" style={orden(2)}>{perfil.frase}</p>
            <div className="entrada mt-10 flex flex-wrap gap-3" style={orden(3)}>
              <a href="#proyectos" className="presionable inline-flex min-h-11 items-center rounded-full bg-tinta px-6 text-sm font-medium text-fondo hover:opacity-85">
                Ver proyectos
              </a>
              <a href="#contacto" className="presionable inline-flex min-h-11 items-center rounded-full border border-tinta px-6 text-sm font-medium hover:bg-tinta hover:text-fondo">
                Hablemos
              </a>
            </div>
          </div>
          <div className="entrada flex justify-center" style={orden(2)}>
            <GloboRed />
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
          <Revelar className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.5fr]">
          <div className="entrada" style={orden(0)}>
            <p className="text-sm font-medium uppercase tracking-widest text-acento">Perfil</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Sobre mí{perfil.sobreMiEjemplo && <EtiquetaEjemplo />}
            </h2>
            {/* next/image optimiza la foto: la comprime y la sirve al tamaño justo para cada pantalla */}
            <Image
              src="/ekim.png"
              alt={`Foto de ${perfil.nombre}`}
              width={200}
              height={200}
              className="mt-8 aspect-square w-full max-w-xs rounded-2xl object-cover"
            />
          </div>
          <div className="max-w-[65ch] space-y-6 text-base leading-relaxed sm:text-lg md:pt-16">
            {perfil.sobreMi.map((p, i) => (
              <p key={p} className="entrada" style={orden(i + 1)}>{p}</p>
            ))}
          </div>
          </Revelar>
        </section>

        {/* 6. Contacto */}
        <section id="contacto" className="scroll-mt-20 border-t border-linea bg-superficie">
          <Revelar className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <p className="entrada text-sm font-medium uppercase tracking-widest text-acento" style={orden(0)}>Contacto</p>
            <h2 style={orden(1)} className="entrada mt-2 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
              ¿Tienes un proyecto en mente?
            </h2>
            <div className="entrada mt-10 flex flex-col gap-4 text-lg sm:flex-row sm:gap-10" style={orden(2)}>
              <a href={`mailto:${perfil.email}`} className="underline decoration-acento underline-offset-4 transition-colors duration-200 hover:text-acento">
                {perfil.email}
              </a>
              <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-acento underline-offset-4 transition-colors duration-200 hover:text-acento">
                LinkedIn
              </a>
              {perfil.contactoEjemplo && <EtiquetaEjemplo />}
            </div>
          </Revelar>
        </section>
      </main>

      <footer className="border-t border-linea">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-8 text-sm text-tenue sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {perfil.nombre}</p>
          <p>Hecho con Next.js y Tailwind · Proyecto Orbix</p>
        </div>
      </footer>
    </>
  );
}
