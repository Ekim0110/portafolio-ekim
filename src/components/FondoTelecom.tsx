"use client";
// "use client": dibuja y anima en el navegador.

import { useEffect, useRef } from "react";

/**
 * 📡 FONDO DE TELECOMUNICACIONES (detrás de la portada)
 *  - Nodos que flotan despacio y se unen con líneas finas cuando están cerca (la red).
 *  - Algunas "antenas" emiten ondas de señal que se expanden y se desvanecen.
 *  - Paquetes de datos que viajan por los enlaces, con una pequeña estela.
 * Todo es tenue a propósito: acompaña al globo sin competir con el texto.
 * Se detiene cuando sale de pantalla, y queda quieto si la persona pidió menos movimiento.
 */

type Nodo = { x: number; y: number; vx: number; vy: number; antena: boolean; fase: number };
type Paquete = { a: number; b: number; t: number; vel: number; teal: boolean };

const TINTA = "245,243,238";
const ACENTO = "240,138,93";
const TEAL = "79,224,200";

export function FondoTelecom() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const ctx = lienzo?.getContext("2d");
    if (!lienzo || !ctx) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ancho = 0;
    let alto = 0;
    let nodos: Nodo[] = [];
    let paquetes: Paquete[] = [];
    let enlaces: [number, number][] = [];
    let distancia = 170;
    let frame = 0;
    let visible = true;
    let ultimo = performance.now();
    let proximoPaquete = 0;

    // Crea la red según el tamaño: más área, más nodos (con un tope para no gastar batería).
    const crearRed = () => {
      const cantidad = Math.max(22, Math.min(64, Math.round((ancho * alto) / 20000)));
      distancia = Math.max(130, Math.min(190, ancho / 8));
      nodos = Array.from({ length: cantidad }, (_, i) => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        antena: i % 9 === 0, // uno de cada nueve es una antena que emite ondas
        fase: Math.random(),
      }));
      paquetes = [];
    };

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ancho = lienzo.clientWidth;
      alto = lienzo.clientHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      crearRed();
    };

    const dibujar = (t: number, dt: number) => {
      ctx.clearRect(0, 0, ancho, alto);

      // 1) Mover nodos (rebotan suavemente en los bordes).
      if (!quieto) {
        for (const n of nodos) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          if (n.x < 0 || n.x > ancho) n.vx *= -1;
          if (n.y < 0 || n.y > alto) n.vy *= -1;
        }
      }

      // 2) Enlaces entre nodos cercanos: más cerca, más visibles.
      enlaces = [];
      ctx.lineWidth = 1;
      for (let i = 0; i < nodos.length; i++) {
        for (let j = i + 1; j < nodos.length; j++) {
          const dx = nodos[i].x - nodos[j].x;
          const dy = nodos[i].y - nodos[j].y;
          const d = Math.hypot(dx, dy);
          if (d > distancia) continue;
          enlaces.push([i, j]);
          ctx.strokeStyle = `rgba(${TINTA},${0.11 * (1 - d / distancia)})`;
          ctx.beginPath();
          ctx.moveTo(nodos[i].x, nodos[i].y);
          ctx.lineTo(nodos[j].x, nodos[j].y);
          ctx.stroke();
        }
      }

      // 3) Ondas de señal: tres anillos por antena que crecen y se apagan (ciclo de 3,6 s).
      for (const n of nodos) {
        if (!n.antena) continue;
        for (let k = 0; k < 3; k++) {
          const p = quieto ? (k + 1) / 4 : (t / 3600 + n.fase + k / 3) % 1;
          ctx.strokeStyle = `rgba(${ACENTO},${0.35 * (1 - p)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6 + p * 90, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 4) Nodos: puntos pequeños; las antenas, más brillantes y con un mástil.
      for (const n of nodos) {
        if (n.antena) {
          ctx.fillStyle = `rgba(${ACENTO},0.95)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `rgba(${ACENTO},0.6)`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n.x - 6, n.y + 14);
          ctx.lineTo(n.x, n.y + 3);
          ctx.lineTo(n.x + 6, n.y + 14);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${TINTA},0.35)`;
          ctx.fillRect(n.x - 1, n.y - 1, 2, 2);
        }
      }

      // 5) Paquetes de datos: aparecen cada ~350 ms en un enlace al azar.
      if (!quieto && enlaces.length && t > proximoPaquete && paquetes.length < 14) {
        const [a, b] = enlaces[Math.floor(Math.random() * enlaces.length)];
        const ida = Math.random() < 0.5;
        paquetes.push({ a: ida ? a : b, b: ida ? b : a, t: 0, vel: 0.0009 + Math.random() * 0.0006, teal: Math.random() < 0.6 });
        proximoPaquete = t + 350;
      }
      paquetes = paquetes.filter((p) => p.t <= 1);
      for (const p of paquetes) {
        p.t += p.vel * dt;
        const A = nodos[p.a];
        const B = nodos[p.b];
        const color = p.teal ? TEAL : ACENTO;
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const cola = Math.max(0, p.t - 0.18);
        const grad = ctx.createLinearGradient(A.x + (B.x - A.x) * cola, A.y + (B.y - A.y) * cola, x, y);
        grad.addColorStop(0, `rgba(${color},0)`);
        grad.addColorStop(1, `rgba(${color},0.9)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(A.x + (B.x - A.x) * cola, A.y + (B.y - A.y) * cola);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${color},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animar = (t: number) => {
      // dt en "fotogramas de 16 ms", con tope por si la pestaña estuvo pausada.
      const dt = Math.min(3, (t - ultimo) / 16.67);
      ultimo = t;
      dibujar(t, dt);
      if (visible && !document.hidden) frame = requestAnimationFrame(animar);
    };

    const arrancar = () => {
      cancelAnimationFrame(frame);
      ultimo = performance.now();
      frame = requestAnimationFrame(animar);
    };

    ajustar();
    if (quieto) {
      dibujar(0, 0); // un solo dibujo fijo
    } else {
      arrancar();
    }

    const redimension = new ResizeObserver(() => {
      ajustar();
      if (quieto) dibujar(0, 0);
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

  return <canvas ref={lienzoRef} aria-hidden="true" className="fondo-telecom pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
