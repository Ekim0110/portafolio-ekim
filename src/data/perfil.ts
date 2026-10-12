/**
 * 📝 ARCHIVO DE CONTENIDO
 * Aquí vive TODO el texto de la página. Si quieres cambiar tu nombre, tus
 * servicios o tus proyectos, solo editas este archivo: los componentes leen
 * estos datos y se actualizan solos.
 *
 * `ejemplo: true` marca contenido de relleno (placeholder). La página le pone
 * una etiqueta "Ejemplo" para que se note. Cuando tengas el dato real,
 * reemplázalo y borra esa línea.
 */

// Un "type" en TypeScript es como un molde: dice qué campos debe tener cada proyecto.
export type Proyecto = {
  titulo: string;
  categoria: "Power BI" | "HTML";
  descripcion: string;
  herramientas: string[];
  enlace?: string; // el "?" significa que es opcional
  ejemplo?: boolean;
};

export type Servicio = {
  titulo: string;
  descripcion: string;
};

export const perfil = {
  nombre: "Ekim",
  rol: "Operaciones, procesos y datos",
  frase:
    "Convierto datos y procesos en decisiones claras: tableros en Power BI, mejora de procesos y páginas web sencillas.",
  sobreMi: [
    "Perfil de operaciones, ingeniería de procesos, gestión de proyectos y finanzas.",
    "Me apasiona ordenar la información para que los equipos decidan mejor, y ahora estoy aprendiendo desarrollo web para construir mis propias herramientas.",
  ],
  sobreMiEjemplo: true,
  ubicacion: "Tu ciudad, País",
  email: "tu-correo@ejemplo.com",
  linkedin: "https://www.linkedin.com/",
  contactoEjemplo: true,
};

export const servicios: Servicio[] = [
  {
    titulo: "Tableros en Power BI",
    descripcion:
      "Diseño de dashboards que muestran los indicadores clave de tu negocio en un solo lugar, actualizados y fáciles de leer.",
  },
  {
    titulo: "Análisis financiero",
    descripcion:
      "Modelos de costos, presupuestos y seguimiento de resultados para entender a dónde va el dinero y por qué.",
  },
  {
    titulo: "Mejora de procesos",
    descripcion:
      "Mapeo de procesos, detección de cuellos de botella y propuestas para trabajar con menos pasos y menos errores.",
  },
  {
    titulo: "Gestión de proyectos",
    descripcion:
      "Planificación, seguimiento y reportes de avance para que los proyectos lleguen a tiempo y dentro del presupuesto.",
  },
  {
    titulo: "Automatización de reportes",
    descripcion:
      "Paso de hojas de cálculo manuales a reportes automáticos que se actualizan solos.",
  },
  {
    titulo: "Páginas web sencillas",
    descripcion:
      "Sitios en HTML y Next.js para presentar un negocio, un servicio o un portafolio.",
  },
];

export const proyectos: Proyecto[] = [
  {
    titulo: "Tablero de ventas",
    categoria: "Power BI",
    descripcion: "Indicadores de ventas por región y mes con filtros interactivos.",
    herramientas: ["Power BI", "DAX", "Excel"],
    ejemplo: true,
  },
  {
    titulo: "Control de costos operativos",
    categoria: "Power BI",
    descripcion: "Seguimiento de presupuesto contra gasto real por centro de costo.",
    herramientas: ["Power BI", "Power Query"],
    ejemplo: true,
  },
  {
    titulo: "Seguimiento de proyectos",
    categoria: "Power BI",
    descripcion: "Avance, hitos y riesgos de un portafolio de proyectos.",
    herramientas: ["Power BI", "SharePoint"],
    ejemplo: true,
  },
  {
    titulo: "Página de presentación",
    categoria: "HTML",
    descripcion: "Primera página web hecha con HTML y CSS durante el aprendizaje.",
    herramientas: ["HTML", "CSS"],
    ejemplo: true,
  },
  {
    titulo: "Este portafolio",
    categoria: "HTML",
    descripcion: "Sitio personal hecho con Next.js, TypeScript y Tailwind, publicado en Vercel.",
    herramientas: ["Next.js", "TypeScript", "Tailwind"],
  },
];
