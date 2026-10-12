"use client";
// "use client": este componente dibuja y anima en el navegador, así que no puede
// generarse solo en el servidor.

import { useEffect, useRef } from "react";

/**
 * 🌐 GLOBO DE TELECOMUNICACIONES
 * Dibujamos en un <canvas> (un lienzo donde se pinta con código):
 *  - una esfera hecha de puntos que gira sola,
 *  - ciudades conectadas por arcos, como enlaces de una red,
 *  - "paquetes de datos" (puntos de luz) que viajan por cada arco.
 * Puedes arrastrarlo con el ratón o el dedo para girarlo.
 * No usamos librerías: es pura matemática de 3D proyectada en 2D.
 */

// Ciudades en [latitud, longitud] (grados).
const ciudades: [number, number][] = [
  [4.7, -74.1], // Bogotá
  [19.4, -99.1], // Ciudad de México
  [40.7, -74.0], // Nueva York
  [-23.5, -46.6], // São Paulo
  [40.4, -3.7], // Madrid
  [51.5, -0.1], // Londres
  [43.7, -79.4], // Toronto
  [6.5, 3.4], // Lagos
  [25.2, 55.3], // Dubái
  [35.7, 139.7], // Tokio
  [1.35, 103.8], // Singapur
  [-33.9, 151.2], // Sídney
];

// Qué ciudades se conectan entre sí (índices de la lista de arriba).
const enlaces: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [1, 6], [2, 5], [4, 7],
  [5, 8], [8, 10], [9, 10], [10, 11], [3, 7], [1, 0],
];

type Vec = [number, number, number];

// Convierte latitud/longitud en un punto 3D sobre una esfera de radio 1.
function aVector(lat: number, lon: number): Vec {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

// Interpolación esférica: un punto intermedio entre a y b siguiendo la curva de la Tierra.
function slerp(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const ang = Math.acos(dot);
  if (ang < 1e-6) return a;
  const s = Math.sin(ang);
  const k1 = Math.sin((1 - t) * ang) / s;
  const k2 = Math.sin(t * ang) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

// Puntos repartidos de forma uniforme sobre la esfera ("espiral de Fibonacci").
function puntosEsfera(n: number): Vec[] {
  const pts: Vec[] = [];
  const oro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    pts.push([Math.cos(oro * i) * r, y, Math.sin(oro * i) * r]);
  }
  return pts;
}

export function GloboRed() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const ctx = lienzo?.getContext("2d");
    if (!lienzo || !ctx) return;

    // Leemos los colores de las variables CSS para que el globo combine con la página.
    const css = getComputedStyle(document.documentElement);
    const acento = css.getPropertyValue("--acento").trim() || "#f08a5d";
    const tinta = css.getPropertyValue("--tinta").trim() || "#f5f3ee";

    const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const esfera = puntosEsfera(900);
    const nodos = ciudades.map(([la, lo]) => aVector(la, lo));

    // Estado de la rotación (en radianes).
    let rotY = 1.6; // empieza mirando a América
    let rotX = -0.35;
    let velY = menosMovimiento ? 0 : 0.0025;
    let arrastrando = false;
    let ultimoX = 0;
    let ultimoY = 0;
    let ancho = 0;
    let alto = 0;
    let visible = true;
    let frame = 0;

    // Ajusta el tamaño del lienzo a su caja y a la densidad de la pantalla (nitidez).
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = lienzo.clientWidth;
      alto = lienzo.clientHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Gira un punto 3D según la rotación actual y devuelve [x, y, profundidad].
    const proyectar = (v: Vec): Vec => {
      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      const x1 = v[0] * cy - v[2] * sy;
      const z1 = v[0] * sy + v[2] * cy;
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      const y2 = v[1] * cx - z1 * sx;
      const z2 = v[1] * sx + z1 * cx;
      return [x1, y2, z2];
    };

    // Un punto se ve si está delante (z ≥ 0) o si, estando detrás, sobresale del borde del globo.
    const seVe = (p: Vec) => p[2] >= 0 || p[0] * p[0] + p[1] * p[1] > 1;

    const dibujar = (t: number) => {
      const R = Math.min(ancho, alto) * 0.42;
      const ox = ancho / 2;
      const oy = alto / 2;
      ctx.clearRect(0, 0, ancho, alto);

      // Halo suave detrás del globo.
      const halo = ctx.createRadialGradient(ox, oy, R * 0.6, ox, oy, R * 1.35);
      halo.addColorStop(0, acento + "22");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, ancho, alto);

      // 1) Puntos de la esfera: más brillantes los de delante.
      ctx.fillStyle = tinta;
      for (const p of esfera) {
        const [x, y, z] = proyectar(p);
        if (z < 0) continue;
        ctx.globalAlpha = 0.18 + z * 0.6;
        ctx.fillRect(ox + x * R, oy - y * R, 1.6, 1.6);
      }

      // 2) Arcos entre ciudades, elevados sobre la superficie, con un paquete viajando.
      ctx.lineWidth = 1.2;
      enlaces.forEach(([a, b], i) => {
        const va = nodos[a];
        const vb = nodos[b];
        const pasos = 48;
        // Los enlaces más largos se elevan más, como un satélite.
        const angulo = Math.acos(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]);
        const altura = 0.06 + 0.22 * (angulo / Math.PI);
        const puntos: Vec[] = [];
        for (let s = 0; s <= pasos; s++) {
          const k = s / pasos;
          const p = slerp(va, vb, k);
          const elev = 1 + altura * Math.sin(Math.PI * k);
          puntos.push(proyectar([p[0] * elev, p[1] * elev, p[2] * elev]));
        }
        ctx.strokeStyle = acento;
        for (let s = 0; s < pasos; s++) {
          const p1 = puntos[s];
          const p2 = puntos[s + 1];
          if (!seVe(p1)) continue; // tramo oculto detrás del globo
          ctx.globalAlpha = 0.25 + Math.max(0, p1[2]) * 0.45;
          ctx.beginPath();
          ctx.moveTo(ox + p1[0] * R, oy - p1[1] * R);
          ctx.lineTo(ox + p2[0] * R, oy - p2[1] * R);
          ctx.stroke();
        }
        // Paquete de datos: avanza por el arco y vuelve a empezar.
        const avance = ((t / 2600 + i * 0.37) % 1) * pasos;
        const pq = puntos[Math.floor(avance)];
        if (seVe(pq)) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = tinta;
          ctx.beginPath();
          ctx.arc(ox + pq[0] * R, oy - pq[1] * R, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3) Ciudades: un punto con un anillo que "late".
      nodos.forEach((n, i) => {
        const [x, y, z] = proyectar(n);
        if (z < 0) return;
        const px = ox + x * R;
        const py = oy - y * R;
        const pulso = ((t / 1800 + i * 0.21) % 1);
        ctx.globalAlpha = (1 - pulso) * 0.7;
        ctx.strokeStyle = acento;
        ctx.beginPath();
        ctx.arc(px, py, 3 + pulso * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = acento;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    // Bucle de animación: unas 60 veces por segundo.
    const animar = (t: number) => {
      if (!arrastrando) {
        rotY += velY;
        // Tras soltar, la velocidad vuelve poco a poco al giro automático.
        const base = menosMovimiento ? 0 : 0.0025;
        velY += (base - velY) * 0.02;
      }
      dibujar(t);
      if (visible) frame = requestAnimationFrame(animar);
    };

    // Arrastrar con ratón o dedo (los "pointer events" sirven para ambos).
    const alPresionar = (e: PointerEvent) => {
      arrastrando = true;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      lienzo.setPointerCapture(e.pointerId);
    };
    const alMover = (e: PointerEvent) => {
      if (!arrastrando) return;
      const dx = e.clientX - ultimoX;
      const dy = e.clientY - ultimoY;
      ultimoX = e.clientX;
      ultimoY = e.clientY;
      rotY += dx * 0.006;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.006));
      velY = dx * 0.006; // al soltar, conserva un poco de impulso
      if (menosMovimiento) dibujar(performance.now());
    };
    const alSoltar = () => {
      arrastrando = false;
    };

    // Solo animamos cuando el globo está en pantalla (ahorra batería).
    const observador = new IntersectionObserver(([entrada]) => {
      const antes = visible;
      visible = entrada.isIntersecting;
      if (visible && !antes) frame = requestAnimationFrame(animar);
    });

    const redimension = new ResizeObserver(() => {
      ajustar();
      dibujar(performance.now());
    });

    ajustar();
    redimension.observe(lienzo);
    observador.observe(lienzo);
    lienzo.addEventListener("pointerdown", alPresionar);
    lienzo.addEventListener("pointermove", alMover);
    lienzo.addEventListener("pointerup", alSoltar);
    lienzo.addEventListener("pointercancel", alSoltar);
    frame = requestAnimationFrame(animar);

    // Limpieza: al salir de la página, paramos todo.
    return () => {
      cancelAnimationFrame(frame);
      redimension.disconnect();
      observador.disconnect();
      lienzo.removeEventListener("pointerdown", alPresionar);
      lienzo.removeEventListener("pointermove", alMover);
      lienzo.removeEventListener("pointerup", alSoltar);
      lienzo.removeEventListener("pointercancel", alSoltar);
    };
  }, []);

  return (
    <canvas
      ref={lienzoRef}
      role="img"
      aria-label="Globo terráqueo animado con ciudades conectadas por enlaces de telecomunicaciones. Puedes arrastrarlo para girarlo."
      className="aspect-square w-full max-w-[520px] cursor-grab touch-pan-y active:cursor-grabbing"
    />
  );
}
