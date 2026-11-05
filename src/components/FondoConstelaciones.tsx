"use client";
// "use client": dibuja y anima en el navegador.

import { useEffect, useRef } from "react";

/**
 * ✨ FONDO DE CONSTELACIONES (detrás de la portada)
 *  - Un cielo de estrellas pequeñas que titilan y se desplazan muy despacio.
 *  - Constelaciones reales (Cruz del Sur, Orión, Osa Mayor, Casiopea, Escorpio, Leo y Lira):
 *    sus líneas se dibujan, se quedan un rato con su nombre y se desvanecen,
 *    cada una a su propio ritmo.
 *  - Cometas con cola de color que cruzan el cielo cada pocos segundos.
 * Todo es tenue a propósito: acompaña al globo sin competir con el texto.
 * Se detiene fuera de pantalla y queda quieto si la persona pidió menos movimiento.
 */

type Constelacion = {
  nombre: string;
  // Posición y tamaño dentro del lienzo, en proporción (0 a 1).
  x: number;
  y: number;
  tam: number;
  // Estrellas en coordenadas propias (0 a 1) y las líneas que las unen.
  estrellas: [number, number][];
  lineas: [number, number][];
  desfase: number; // en qué momento del ciclo arranca
  destacada?: boolean; // siempre trazada, más brillante y con un brillo que late
};

// Formas simplificadas de constelaciones reales.
const CONSTELACIONES: Constelacion[] = [
  {
    nombre: "Cruz del Sur",
    x: 0.9, y: 0.6, tam: 0.1, desfase: 0,
    estrellas: [[0.5, 0], [0.5, 1], [0.12, 0.42], [0.88, 0.52], [0.66, 0.7]],
    lineas: [[0, 1], [2, 3]],
  },
  {
    nombre: "Orión",
    x: 0.42, y: 0.05, tam: 0.13, desfase: 0.2,
    estrellas: [[0.18, 0.12], [0.7, 0.18], [0.38, 0.5], [0.47, 0.47], [0.56, 0.44], [0.26, 0.92], [0.78, 0.86], [0.44, 0]],
    lineas: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 7], [1, 7]],
  },
  {
    nombre: "Osa Mayor",
    x: 0.78, y: 0.05, tam: 0.15, desfase: 0.45,
    estrellas: [[0, 0.2], [0.18, 0.25], [0.33, 0.36], [0.48, 0.42], [0.52, 0.66], [0.8, 0.74], [0.84, 0.46]],
    lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    nombre: "Casiopea",
    x: 0.06, y: 0.08, tam: 0.14, desfase: 0.65,
    estrellas: [[0, 0.3], [0.25, 0.7], [0.5, 0.4], [0.75, 0.78], [1, 0.25]],
    lineas: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    nombre: "Escorpio",
    x: 0.3, y: 0.79, tam: 0.12, desfase: 0.85,
    estrellas: [[0, 0.1], [0.12, 0.24], [0.22, 0.34], [0.3, 0.5], [0.32, 0.66], [0.42, 0.8], [0.56, 0.9], [0.7, 0.86], [0.78, 0.72], [0.72, 0.62]],
    lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  {
    // Leo: la "hoz" (melena) y el triángulo del cuerpo.
    nombre: "Leo",
    x: 0.04, y: 0.78, tam: 0.13, desfase: 0.32,
    estrellas: [[0.22, 0.05], [0.08, 0.12], [0.04, 0.3], [0.14, 0.45], [0.28, 0.55], [0.3, 0.75], [0.8, 0.5], [0.95, 0.72], [0.72, 0.68]],
    lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 7], [7, 8], [8, 5]],
  },
  {
    // Lira: la brillante Vega y un pequeño paralelogramo.
    nombre: "Lira",
    x: 0.92, y: 0.3, tam: 0.06, desfase: 0.55,
    estrellas: [[0.5, 0], [0.35, 0.3], [0.62, 0.36], [0.3, 0.75], [0.58, 0.82]],
    lineas: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]],
  },
  {
    // Libra, la constelación de Mike: la balanza (triángulo de arriba y sus dos platos).
    // Va junto a Escorpio, su vecina en el cielo real, y siempre se ve resaltada.
    nombre: "Libra",
    x: 0.47, y: 0.74, tam: 0.11, desfase: 0, destacada: true,
    estrellas: [[0.55, 0], [0.12, 0.42], [0.88, 0.36], [0.2, 0.92], [0.8, 0.8], [0.92, 1]],
    lineas: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [4, 5]],
  },
];

// Ciclo de cada constelación: se dibuja, se queda, se apaga y descansa.
const CICLO = 12000; // ms
const DIBUJO = 0.16; // fracción del ciclo que tarda en trazarse
const PERMANENCIA = 0.62; // hasta aquí se queda visible
const APAGADO = 0.76; // hasta aquí termina de desvanecerse

const TINTA = "245,243,238";
const ACENTO = "240,138,93";
const TEAL = "79,224,200";

// "ease-out" fuerte: el trazo arranca rápido y frena suave.
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

type Estrella = { x: number; y: number; r: number; brillo: number; fase: number; vel: number };
type Cometa = { x: number; y: number; vx: number; vy: number; vida: number; dura: number; largo: number; color: string };

export function FondoConstelaciones() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const ctx = lienzo?.getContext("2d");
    if (!lienzo || !ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fuente = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";
    let ancho = 0;
    let alto = 0;
    let estrellas: Estrella[] = [];
    let cometas: Cometa[] = [];
    let proximoCometa = 1500;
    let frame = 0;
    let visible = true;

    const crearCielo = () => {
      const cantidad = Math.max(120, Math.min(420, Math.round((ancho * alto) / 2600)));
      estrellas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        r: Math.random() < 0.9 ? 0.4 + Math.random() * 0.6 : 1 + Math.random() * 0.6,
        brillo: 0.15 + Math.random() * 0.5,
        fase: Math.random() * Math.PI * 2,
        vel: 0.0006 + Math.random() * 0.0014,
      }));
    };

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ancho = lienzo.clientWidth;
      alto = lienzo.clientHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crearCielo();
    };

    // Convierte una estrella de la constelación a píxeles del lienzo.
    const aPixel = (c: Constelacion, [ex, ey]: [number, number]) => {
      const lado = c.tam * Math.max(ancho, alto * 1.2);
      return [c.x * ancho + ex * lado, c.y * alto + ey * lado] as const;
    };

    const dibujar = (t: number) => {
      ctx.clearRect(0, 0, ancho, alto);

      // 1) Cielo de fondo: estrellas que titilan y derivan muy despacio hacia la izquierda.
      const deriva = quieto ? 0 : (t * 0.004) % ancho;
      for (const e of estrellas) {
        const titileo = quieto ? 1 : 0.65 + 0.35 * Math.sin(e.fase + t * e.vel);
        let x = e.x - deriva;
        if (x < 0) x += ancho;
        ctx.fillStyle = `rgba(${TINTA},${e.brillo * titileo})`;
        ctx.beginPath();
        ctx.arc(x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2) Constelaciones.
      ctx.font = `11px ${fuente}`;
      ctx.textBaseline = "top";
      for (const c of CONSTELACIONES) {
        // p: momento del ciclo (0 a 1). Con menos movimiento, todas visibles y fijas.
        // La destacada (Libra) no hace el ciclo: siempre trazada, con un brillo que late.
        const p = quieto || c.destacada ? DIBUJO + 0.01 : (t / CICLO + c.desfase) % 1;
        const trazo = p < DIBUJO ? easeOut(p / DIBUJO) : p < APAGADO ? 1 : 0;
        const opacidad =
          p < PERMANENCIA ? 1 : p < APAGADO ? 1 - (p - PERMANENCIA) / (APAGADO - PERMANENCIA) : 0;
        const late = c.destacada && !quieto ? 0.75 + 0.25 * Math.sin(t / 900) : 1;
        const puntos = c.estrellas.map((e) => aPixel(c, e));

        // Líneas: se van trazando una tras otra.
        if (trazo > 0 && opacidad > 0) {
          ctx.save();
          if (c.destacada) {
            ctx.strokeStyle = `rgba(${ACENTO},${0.9 * late})`;
            ctx.lineWidth = 1.6;
            ctx.shadowColor = `rgba(${ACENTO},0.9)`;
            ctx.shadowBlur = 10 * late;
          } else {
            ctx.strokeStyle = `rgba(${ACENTO},${0.45 * opacidad})`;
            ctx.lineWidth = 1;
          }
          const total = c.lineas.length;
          c.lineas.forEach(([a, b], i) => {
            const avance = Math.min(1, Math.max(0, trazo * total - i));
            if (avance <= 0) return;
            const [x1, y1] = puntos[a];
            const [x2, y2] = puntos[b];
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + (x2 - x1) * avance, y1 + (y2 - y1) * avance);
            ctx.stroke();
          });
          ctx.restore();
          // Nombre de la constelación, junto a su primera estrella. Si no cabe a la
          // derecha (constelación pegada al borde), va a la izquierda de la estrella.
          const nombre = c.nombre.toUpperCase();
          const [nx, ny] = puntos[0];
          const cabe = nx + 10 + ctx.measureText(nombre).width < ancho - 8;
          ctx.textAlign = cabe ? "left" : "right";
          if (c.destacada) {
            ctx.font = `600 12px ${fuente}`;
            ctx.fillStyle = `rgba(${ACENTO},${0.95 * late})`;
          } else {
            ctx.font = `11px ${fuente}`;
            ctx.fillStyle = `rgba(${TINTA},${0.35 * opacidad * trazo})`;
          }
          ctx.fillText(nombre, cabe ? nx + 10 : nx - 10, ny + 6);
          ctx.textAlign = "left";
        }

        // Estrellas de la constelación: siempre visibles, más brillantes cuando está trazada.
        // Las de la destacada son más grandes y con un halo cálido.
        const brillo = 0.55 + 0.45 * opacidad * trazo;
        const radioHalo = c.destacada ? 13 : 7;
        const colorHalo = c.destacada ? ACENTO : TINTA;
        for (const [x, y] of puntos) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, radioHalo);
          halo.addColorStop(0, `rgba(${colorHalo},${(c.destacada ? 0.55 * late : 0.35) * brillo})`);
          halo.addColorStop(1, `rgba(${colorHalo},0)`);
          ctx.fillStyle = halo;
          ctx.fillRect(x - radioHalo, y - radioHalo, radioHalo * 2, radioHalo * 2);
          ctx.fillStyle = `rgba(${TINTA},${brillo})`;
          ctx.beginPath();
          ctx.arc(x, y, c.destacada ? 2.4 : 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3) Cometas: uno cada 2,5 a 5 segundos (hasta tres a la vez), con cola
      //    larga en blanco, naranja o verde agua y una cabeza brillante.
      if (!quieto) {
        if (cometas.length < 3 && t > proximoCometa) {
          const angulo = 0.35 + Math.random() * 0.35; // inclinación hacia abajo
          const rapidez = 0.7 + Math.random() * 0.5; // px por ms
          cometas.push({
            x: ancho * (0.25 + Math.random() * 0.75),
            y: alto * Math.random() * 0.45,
            vx: -Math.cos(angulo) * rapidez,
            vy: Math.sin(angulo) * rapidez,
            vida: 0,
            dura: 900 + Math.random() * 700,
            largo: 140 + Math.random() * 120,
            color: [TINTA, ACENTO, TEAL][Math.floor(Math.random() * 3)],
          });
          proximoCometa = t + 2500 + Math.random() * 2500;
        }
        cometas = cometas.filter((c) => c.vida < c.dura);
        for (const c of cometas) {
          c.vida += 16;
          const avance = c.vida / c.dura;
          // Aparece y se apaga suave, más brillante a mitad de camino.
          const luz = Math.sin(Math.PI * Math.min(1, avance));
          const x = c.x + c.vx * c.vida;
          const y = c.y + c.vy * c.vida;
          const rapidez = Math.hypot(c.vx, c.vy);
          const colaX = x - (c.vx / rapidez) * c.largo;
          const colaY = y - (c.vy / rapidez) * c.largo;
          const grad = ctx.createLinearGradient(x, y, colaX, colaY);
          grad.addColorStop(0, `rgba(${c.color},${0.95 * luz})`);
          grad.addColorStop(0.25, `rgba(${c.color},${0.45 * luz})`);
          grad.addColorStop(1, `rgba(${c.color},0)`);
          ctx.strokeStyle = grad;
          ctx.lineCap = "round";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(colaX, colaY);
          ctx.stroke();
          // Cabeza: un núcleo blanco con un resplandor del color del cometa.
          const halo = ctx.createRadialGradient(x, y, 0, x, y, 10);
          halo.addColorStop(0, `rgba(${c.color},${0.7 * luz})`);
          halo.addColorStop(1, `rgba(${c.color},0)`);
          ctx.fillStyle = halo;
          ctx.fillRect(x - 10, y - 10, 20, 20);
          ctx.fillStyle = `rgba(255,255,255,${luz})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.lineCap = "butt";
      }
    };

    const animar = (t: number) => {
      dibujar(t);
      if (visible && !document.hidden) frame = requestAnimationFrame(animar);
    };
    const arrancar = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(animar);
    };

    ajustar();
    if (quieto) dibujar(0);
    else arrancar();

    const redimension = new ResizeObserver(() => {
      ajustar();
      if (quieto) dibujar(0);
    });
    redimension.observe(lienzo);

    // Solo animamos cuando la portada está en pantalla y la pestaña visible.
    const observador = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !quieto) arrancar();
    });
    observador.observe(lienzo);
    const alCambiarPestaña = () => {
      if (!document.hidden && visible && !quieto) arrancar();
    };
    document.addEventListener("visibilitychange", alCambiarPestaña);

    return () => {
      cancelAnimationFrame(frame);
      redimension.disconnect();
      observador.disconnect();
      document.removeEventListener("visibilitychange", alCambiarPestaña);
    };
  }, []);

  return <canvas ref={lienzoRef} aria-hidden="true" className="fondo-cielo pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
