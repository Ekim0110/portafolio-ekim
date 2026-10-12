/**
 * 🛠️ CONFIGURACIÓN DEL PANEL (Keystatic)
 * Aquí se define qué se puede editar desde /keystatic y cómo se ve cada formulario.
 * Cada "singleton" es una pantalla del panel y guarda su contenido en un archivo
 * JSON dentro de la carpeta /content.
 *
 * - En la web publicada guarda en GitHub ("github"): cada vez que le das Guardar,
 *   se crea un commit en main y Vercel vuelve a publicar la página sola.
 *   Necesita la conexión con tu GitHub App (variables de entorno en Vercel).
 * - Mientras esa conexión no exista, o en tu computador (npm run dev), guarda
 *   directo en los archivos ("local"). Así la web se sigue publicando sin errores.
 */
import { config, fields, singleton } from "@keystatic/core";

export default config({
  storage:
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
      ? { kind: "github", repo: { owner: "Ekim0110", name: "portafolio-ekim" } }
      : { kind: "local" },
  ui: {
    brand: { name: "Panel de Mike" },
  },
  singletons: {
    perfil: singleton({
      label: "Perfil y contacto",
      path: "content/perfil",
      format: { data: "json" },
      schema: {
        nombre: fields.text({ label: "Nombre completo" }),
        nombreCorto: fields.text({ label: "Nombre corto", description: "Se usa en el saludo y en el menú del celular." }),
        rol: fields.text({ label: "Rol", description: "La línea pequeña en naranja encima del saludo." }),
        frase: fields.text({ label: "Frase principal", multiline: true }),
        sobreMi: fields.array(fields.text({ label: "Párrafo", multiline: true }), {
          label: "Sobre mí",
          itemLabel: (p) => p.value.slice(0, 60) || "Párrafo",
        }),
        sobreMiEjemplo: fields.checkbox({
          label: "Mostrar etiqueta \"Ejemplo\" en Sobre mí",
          description: "Desmárcala cuando el texto ya sea el real.",
        }),
        ubicacion: fields.text({ label: "Ubicación" }),
        email: fields.text({ label: "Correo" }),
        linkedin: fields.text({ label: "Enlace de LinkedIn" }),
        contactoEjemplo: fields.checkbox({
          label: "Mostrar etiqueta \"Ejemplo\" en Contacto",
          description: "Desmárcala cuando el correo y LinkedIn sean los reales.",
        }),
      },
    }),
    servicios: singleton({
      label: "Servicios",
      path: "content/servicios",
      format: { data: "json" },
      schema: {
        lista: fields.array(
          fields.object({
            titulo: fields.text({ label: "Título" }),
            descripcion: fields.text({ label: "Descripción", multiline: true }),
          }),
          { label: "Servicios", itemLabel: (s) => s.fields.titulo.value || "Servicio" },
        ),
      },
    }),
    proyectos: singleton({
      label: "Proyectos",
      path: "content/proyectos",
      format: { data: "json" },
      schema: {
        lista: fields.array(
          fields.object({
            titulo: fields.text({ label: "Título" }),
            categoria: fields.select({
              label: "Categoría",
              options: [
                { label: "Power BI", value: "Power BI" },
                { label: "HTML", value: "HTML" },
              ],
              defaultValue: "Power BI",
            }),
            descripcion: fields.text({ label: "Descripción", multiline: true }),
            herramientas: fields.array(fields.text({ label: "Herramienta" }), {
              label: "Herramientas",
              itemLabel: (h) => h.value || "Herramienta",
            }),
            enlace: fields.url({ label: "Enlace (opcional)" }),
            imagen: fields.image({
              label: "Imagen (opcional)",
              description: "Captura del proyecto. Mejor horizontal, en proporción 4:3. Revisa que no muestre datos privados.",
              directory: "public/proyectos",
              publicPath: "/proyectos/",
            }),
            ejemplo: fields.checkbox({ label: "Es un ejemplo (muestra la etiqueta \"Ejemplo\")" }),
          }),
          { label: "Proyectos", itemLabel: (p) => p.fields.titulo.value || "Proyecto" },
        ),
      },
    }),
  },
});
