# Portafolio de Ekim

Página web personal: perfil, servicios y proyectos (Power BI y HTML). Parte del proyecto **Orbix**.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · publicado en Vercel.

## Cómo ejecutarlo en tu computadora

1. Instala [Node.js](https://nodejs.org) (versión 20 o superior).
2. Descarga el código: `git clone https://github.com/Ekim0110/portafolio-ekim.git`
3. Entra a la carpeta: `cd portafolio-ekim`
4. Instala las dependencias (las librerías que usa el proyecto): `npm install`
5. Arranca el servidor de desarrollo: `npm run dev`
6. Abre http://localhost:3000 en el navegador. Cada vez que guardas un archivo, la página se actualiza sola.

## Dónde cambiar cada cosa

| Quiero cambiar…                     | Archivo                              |
| ----------------------------------- | ------------------------------------ |
| Nombre, frase, servicios, proyectos | `src/data/perfil.ts`                 |
| Colores                             | `src/app/globals.css` (`:root`)      |
| Título para Google                  | `src/app/layout.tsx` (`metadata`)    |
| Orden de las secciones              | `src/app/page.tsx`                   |

El contenido marcado con `ejemplo: true` es de relleno y aparece con la etiqueta **Ejemplo** hasta que pongas el dato real.

## Publicación

Cada pull request genera una **vista previa** en Vercel. Al aprobar y hacer merge a `main`, Vercel publica la versión final.
