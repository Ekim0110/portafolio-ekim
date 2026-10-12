/**
 * 📝 DATOS DE LA PÁGINA
 * Los textos ya no se escriben aquí: se editan desde el panel en /keystatic,
 * que los guarda en la carpeta /content. Este archivo los lee y les da su
 * "molde" (type) para que los componentes los usen.
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

// El contenido vive en /content (archivos JSON) y se edita desde el panel /keystatic.
import perfilJson from "../../content/perfil.json";
import serviciosJson from "../../content/servicios.json";
import proyectosJson from "../../content/proyectos.json";

export const perfil = perfilJson;

export const servicios: Servicio[] = serviciosJson.lista;

// El panel guarda "null" cuando un campo opcional está vacío; aquí lo convertimos en "sin dato".
export const proyectos: Proyecto[] = proyectosJson.lista.map((p) => ({
  titulo: p.titulo,
  categoria: p.categoria as Proyecto["categoria"],
  descripcion: p.descripcion,
  herramientas: p.herramientas,
  enlace: p.enlace ?? undefined,
  imagen: p.imagen ?? undefined,
  ejemplo: p.ejemplo,
}));
