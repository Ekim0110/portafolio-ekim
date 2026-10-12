import Image from "next/image";
import { perfil } from "@/data/perfil";
import { Nav } from "@/components/Nav";
import { Marquesina } from "@/components/Marquesina";
import { Proyectos } from "@/components/Proyectos";
import { Servicios } from "@/components/Servicios";
import { EtiquetaEjemplo } from "@/components/Etiqueta";

// Página principal: junta todas las secciones en orden, de arriba hacia abajo.
export default function Inicio() {
  return (
    <>
      <Nav />
      <main id="inicio">
        {/* 1. Portada (hero): nombre grande + rol + llamada a la acción */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-28">
          <p className="text-sm font-medium uppercase tracking-widest text-acento">{perfil.rol}</p>
          <h1 className="mt-4 text-6xl font-semibold leading-[0.95] tracking-tighter sm:text-8xl lg:text-9xl">
            Hola, soy {perfil.nombre}.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-tenue sm:text-xl">{perfil.frase}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#proyectos" className="rounded-full bg-tinta px-6 py-3 text-sm font-medium text-fondo transition-opacity hover:opacity-85">
              Ver proyectos
            </a>
            <a href="#contacto" className="rounded-full border border-tinta px-6 py-3 text-sm font-medium transition-colors hover:bg-tinta hover:text-fondo">
              Hablemos
            </a>
          </div>
        </section>

        {/* 2. Banda animada */}
        <Marquesina />

        {/* 3. Proyectos con filtro */}
        <Proyectos />

        {/* 4. Servicios */}
        <Servicios />

        {/* 5. Sobre mí */}
        <section id="sobre-mi" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-acento">Perfil</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
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
          <div className="space-y-6 text-lg leading-relaxed md:pt-16">
            {perfil.sobreMi.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {/* 6. Contacto */}
        <section id="contacto" className="scroll-mt-20 bg-tinta text-fondo">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <p className="text-sm font-medium uppercase tracking-widest text-acento">Contacto</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              ¿Tienes un proyecto en mente?
            </h2>
            <div className="mt-10 flex flex-col gap-4 text-lg sm:flex-row sm:gap-10">
              <a href={`mailto:${perfil.email}`} className="underline decoration-acento underline-offset-4 hover:text-acento">
                {perfil.email}
              </a>
              <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-acento underline-offset-4 hover:text-acento">
                LinkedIn
              </a>
              {perfil.contactoEjemplo && <EtiquetaEjemplo />}
            </div>
          </div>
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
