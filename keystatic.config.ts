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
        marca: fields.text({ label: "Marca", description: "Nombre de marca que va en el menú y en el pie de página." }),
        eslogan: fields.text({ label: "Eslogan (primera línea)", description: "Va en grande en la portada, en blanco." }),
        esloganAcento: fields.text({ label: "Eslogan (segunda línea)", description: "Va debajo, en naranja." }),
        rol: fields.text({ label: "Rol", description: "Va en la portada debajo del eslogan." }),
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
    compromisos: singleton({
      label: "Cómo es trabajar conmigo",
      path: "content/compromisos",
      format: { data: "json" },
      schema: {
        lista: fields.array(
          fields.object({
            valor: fields.text({ label: "Cifra grande", description: "Corta, por ejemplo 24 h o 100 %." }),
            titulo: fields.text({ label: "Compromiso" }),
            descripcion: fields.text({ label: "Explicación", multiline: true }),
          }),
          { label: "Compromisos", itemLabel: (c) => `${c.fields.valor.value} · ${c.fields.titulo.value}` },
        ),
      },
    }),
    testimonios: singleton({
      label: "Testimonios",
      path: "content/testimonios",
      format: { data: "json" },
      schema: {
        lista: fields.array(
          fields.object({
            frase: fields.text({ label: "Lo que dijo", description: "2 o 3 líneas, con sus palabras.", multiline: true }),
            nombre: fields.text({ label: "Nombre" }),
            cargo: fields.text({ label: "Cargo y empresa", description: "Por ejemplo: Jefe de operaciones, Empresa X." }),
            ciudad: fields.text({ label: "Ciudad" }),
            pais: fields.select({
              label: "País (para girar el globo)",
              options: [
                { label: "Colombia", value: "Colombia" },
                { label: "México", value: "México" },
                { label: "Brasil", value: "Brasil" },
                { label: "Chile", value: "Chile" },
                { label: "España", value: "España" },
                { label: "EE. UU.", value: "EE. UU." },
              ],
              defaultValue: "Colombia",
            }),
            foto: fields.image({
              label: "Foto (opcional)",
              description: "Cuadrada. Si no hay, se muestran sus iniciales.",
              directory: "public/testimonios",
              publicPath: "/testimonios/",
            }),
            permiso: fields.checkbox({
              label: "Tengo su permiso para publicarlo",
              description: "Solo se muestran los testimonios con esta casilla marcada.",
            }),
          }),
          { label: "Testimonios", itemLabel: (t) => t.fields.nombre.value || "Testimonio" },
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
                { label: "Tableros", value: "Tableros" },
                { label: "Informes", value: "Informes" },
                { label: "Web", value: "Web" },
              ],
              defaultValue: "Tableros",
            }),
            descripcion: fields.text({ label: "Descripción", multiline: true }),
            herramientas: fields.array(fields.text({ label: "Herramienta" }), {
              label: "Herramientas",
              itemLabel: (h) => h.value || "Herramienta",
            }),
            enlace: fields.url({ label: "Enlace (opcional)" }),
            caso: fields.text({
              label: "Caso de estudio (opcional)",
              description: "Ruta de la página del caso, por ejemplo /proyectos/instalacion-equipos. Déjalo vacío si no tiene.",
            }),
            demo: fields.text({
              label: "Versión interactiva (opcional)",
              description: "Ruta de un tablero que se puede usar, por ejemplo /demos/flota.html. Solo con datos anonimizados.",
            }),
            metricas: fields.array(
              fields.object({
                valor: fields.text({ label: "Cifra", description: "Por ejemplo 998 o 68,7 %." }),
                etiqueta: fields.text({ label: "Qué mide", description: "Por ejemplo inspecciones analizadas." }),
              }),
              {
                label: "Cifras del proyecto",
                description: "Hasta 3 cifras reales que se ven en la tarjeta. Nunca inventadas.",
                itemLabel: (m) => `${m.fields.valor.value} ${m.fields.etiqueta.value}`.trim() || "Cifra",
              },
            ),
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
    casoInstalacion: singleton({
      label: "Caso de estudio: Instalación de equipos",
      path: "content/casos/instalacion-equipos",
      format: { data: "json" },
      schema: {
        titulo: fields.text({ label: "Título" }),
        resumen: fields.text({ label: "Resumen", description: "Una o dos frases bajo el título.", multiline: true }),
        contexto: fields.text({ label: "Contexto", description: "Tipo de proyecto o empresa (sin datos privados)." }),
        rol: fields.text({ label: "Mi rol" }),
        herramientas: fields.array(fields.text({ label: "Herramienta" }), {
          label: "Herramientas",
          itemLabel: (h) => h.value || "Herramienta",
        }),
        reto: fields.text({ label: "El reto", description: "Qué problema había antes.", multiline: true }),
        pasos: fields.object(
          {
            escuchar: fields.text({ label: "1. Escuchar", multiline: true }),
            captar: fields.text({ label: "2. Captar", multiline: true }),
            filtrar: fields.text({ label: "3. Filtrar", multiline: true }),
            transmitir: fields.text({ label: "4. Transmitir", multiline: true }),
            ajustar: fields.text({ label: "5. Ajustar", multiline: true }),
          },
          { label: "Cómo lo resolví (Ciclo Señal)" },
        ),
        resultados: fields.array(fields.text({ label: "Resultado" }), {
          label: "Resultados",
          description: "Si tienes cifras reales (horas ahorradas, % de avance), ponlas aquí.",
          itemLabel: (r) => r.value || "Resultado",
        }),
        aprendizaje: fields.text({ label: "Lo que aprendí", multiline: true }),
        ejemplo: fields.checkbox({
          label: "Mostrar etiqueta \"Ejemplo\"",
          description: "Desmárcala cuando los textos ya sean los reales.",
        }),
      },
    }),
  },
});
