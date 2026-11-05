"use client";
// "use client": dibuja y anima en el navegador.

import { useEffect, useRef } from "react";

/**
 * ✨ FONDO DE CONSTELACIONES (detrás de la portada)
 *  - Un cielo de estrellas pequeñas que titilan y se desplazan muy despacio.
 *  - Constelaciones reales (Cruz del Sur, Orión, Osa Mayor, Casiopea, Escorpio):
 *    sus líneas se dibujan, se quedan un rato con su nombre y se desvanecen,
 *    cada una a su propio ritmo.
 *  - De vez en cuando, una estrella fugaz.
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
    x: 0.36, y: 0.79, tam: 0.12, desfase: 0.85,
    estrellas: [[0, 0.1], [0.12, 0.24], [0.22, 0.34], [0.3, 0.5], [0.32, 0.66], [0.42, 0.8], [0.56, 0.9], [0.7, 0.86], [0.78, 0.72], [0.72, 0.62]],
    lineas: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
];

// Ciclo de cada constelación: se dibuja, se queda, se apaga y descansa.
const CICLO = 12000; // ms
const DIBUJO = 0.16; // fracción del ciclo que tarda en trazarse
const PERMANENCIA = 0.62; // hasta aquí se queda visible
const APAGADO = 0.76; // hasta aquí termina de desvanecerse

const TINTA = "245,243,238";
const ACENTO = "240,138,93";

// "ease-out" fuerte: el trazo arranca rápido y frena suave.
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

type Estrella = { x: number; y: number; r: number; brillo: number; fase: number; vel: number };
type Fugaz = { x: number; y: number; vx: number; vy: number; vida: number };

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
    let fugaz: Fugaz | null = null;
    let proximaFugaz = 4000;
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
        const p = quieto ? DIBUJO + 0.01 : (t / CICLO + c.desfase) % 1;
        const trazo = p < DIBUJO ? easeOut(p / DIBUJO) : p < APAGADO ? 1 : 0;
        const opacidad =
          p < PERMANENCIA ? 1 : p < APAGADO ? 1 - (p - PERMANENCIA) / (APAGADO - PERMANENCIA) : 0;
        const puntos = c.estrellas.map((e) => aPixel(c, e));

        // Líneas: se van trazando una tras otra.
        if (trazo > 0 && opacidad > 0) {
          ctx.strokeStyle = `rgba(${ACENTO},${0.45 * opacidad})`;
          ctx.lineWidth = 1;
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
          // Nombre de la constelación, junto a su primera estrella. Si no cabe a la
          // derecha (constelación pegada al borde), va a la izquierda de la estrella.
          const nombre = c.nombre.toUpperCase();
          const [nx, ny] = puntos[0];
          const cabe = nx + 10 + ctx.measureText(nombre).width < ancho - 8;
          ctx.textAlign = cabe ? "left" : "right";
          ctx.fillStyle = `rgba(${TINTA},${0.35 * opacidad * trazo})`;
          ctx.fillText(nombre, cabe ? nx + 10 : nx - 10, ny + 6);
          ctx.textAlign = "left";
        }

        // Estrellas de la constelación: siempre visibles, más brillantes cuando está trazada.
        const brillo = 0.55 + 0.45 * opacidad * trazo;
        for (const [x, y] of puntos) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, 7);
          halo.addColorStop(0, `rgba(${TINTA},${0.35 * brillo})`);
          halo.addColorStop(1, `rgba(${TINTA},0)`);
          ctx.fillStyle = halo;
          ctx.fillRect(x - 7, y - 7, 14, 14);
          ctx.fillStyle = `rgba(${TINTA},${brillo})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3) Estrella fugaz cada 6 a 11 segundos.
      if (!quieto) {
        if (!fugaz && t > proximaFugaz) {
          fugaz = { x: ancho * (0.3 + Math.random() * 0.6), y: alto * Math.random() * 0.35, vx: -0.9, vy: 0.45, vida: 0 };
          proximaFugaz = t + 6000 + Math.random() * 5000;
        }
        if (fugaz) {
          fugaz.vida += 16;
          const avance = fugaz.vida / 900; // dura 0,9 s
          const x = fugaz.x + fugaz.vx * fugaz.vida;
          const y = fugaz.y + fugaz.vy * fugaz.vida;
          const largo = 90;
          const grad = ctx.createLinearGradient(x, y, x - fugaz.vx * largo, y - fugaz.vy * largo);
          grad.addColorStop(0, `rgba(${TINTA},${0.9 * (1 - avance)})`);
          grad.addColorStop(1, `rgba(${TINTA},0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - fugaz.vx * largo, y - fugaz.vy * largo);
          ctx.stroke();
          if (avance >= 1) fugaz = null;
        }
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
