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
  imagen?: string; // captura del proyecto, guardada en /public/proyectos/
  ejemplo?: boolean;
};

export type Servicio = {
  titulo: string;
  descripcion: string;
};

export const perfil = {
  nombre: "Mike Bernal Gomez",
  nombreCorto: "Mike",
  rol: "Operaciones, procesos y datos",
  frase:
    "Conectando estrategia, tecnología y personas para optimizar procesos críticos y liderar operaciones ágiles y de alto rendimiento.",
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
    titulo: "Equipos TSG",
    categoria: "Power BI",
    descripcion: "Tablero con gráficas de seguimiento de los equipos del proyecto TSG.",
    herramientas: ["Power BI"],
    // imagen: "/proyectos/equipos-tsg.png", ← activar cuando subamos la captura
    ejemplo: true,
  },
  {
    titulo: "Informes preoperacionales Tibacuy",
    categoria: "Power BI",
    descripcion: "Informes de las inspecciones preoperacionales para la operación en Tibacuy.",
    herramientas: ["Power BI"],
    // imagen: "/proyectos/preoperacionales-tibacuy.png",
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
