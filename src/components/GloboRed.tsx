"use client";
// "use client": este componente dibuja y anima en el navegador, así que no puede
// generarse solo en el servidor.

import { useEffect, useRef } from "react";
import { ALTO_MAPA, ANCHO_MAPA, MAPA_TIERRA } from "@/data/tierra";

/**
 * 🌐 GLOBO DE TELECOMUNICACIONES
 * Dibujamos en un <canvas> (un lienzo donde se pinta con código):
 *  - un océano azul con borde brillante,
 *  - los continentes hechos de puntos (usando el mapa de src/data/tierra.ts),
 *  - un anillo de órbita de colores con un satélite que da vueltas,
 *  - países conectados por arcos, con datos que fluyen y "cometas" de ida y vuelta.
 * Puedes arrastrarlo con el ratón o el dedo para girarlo.
 * No usamos librerías: es matemática de 3D proyectada en 2D.
 */

type Vec = [number, number, number];
type Ciudad = { nombre: string; lat: number; lon: number };

// Países que se muestran con su nombre, como en la referencia.
const ciudades: Ciudad[] = [
  { nombre: "México", lat: 19.4, lon: -99.1 },
  { nombre: "Colombia", lat: 4.7, lon: -74.1 },
  { nombre: "Brasil", lat: -15.8, lon: -47.9 },
  { nombre: "Chile", lat: -33.4, lon: -70.6 },
  { nombre: "España", lat: 40.4, lon: -3.7 },
  { nombre: "EE. UU.", lat: 40.7, lon: -74.0 },
];

// Enlaces: Colombia es el centro de la red (índices de la lista de arriba).
const enlaces: [number, number][] = [
  [1, 0], [1, 2], [1, 3], [1, 4], [1, 5], [0, 5], [2, 4],
];

// Colores de la escena (azules y verde azulado, con toques cálidos).
const COLOR = {
  oceanoCentro: "#1f5f8f",
  oceanoBorde: "#071a2e",
  borde: "#4fe0c8",
  tierraFria: [120, 220, 170], // verde menta (RGB)
  tierraCalida: [240, 160, 90], // naranja (desiertos)
};

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

// Punto intermedio entre dos posiciones del arco, para que el movimiento sea suave.
function punto(puntos: Vec[], s: number): Vec {
  const i = Math.min(Math.floor(s), puntos.length - 2);
  const f = s - i;
  const [a, b] = [puntos[i], puntos[i + 1]];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

// Lee el mapa de bits y devuelve una función que dice si en esa latitud/longitud hay tierra.
function crearEsTierra() {
  const bytes = Uint8Array.from(atob(MAPA_TIERRA), (c) => c.charCodeAt(0));
  return (lat: number, lon: number) => {
    const x = Math.min(ANCHO_MAPA - 1, Math.floor(lon + 180));
    const y = Math.min(ALTO_MAPA - 1, Math.floor(90 - lat));
    const i = y * ANCHO_MAPA + x;
    return (bytes[i >> 3] & (1 << (i & 7))) !== 0;
  };
}

// Puntos de tierra: repartimos muchos puntos uniformes sobre la esfera
// ("espiral de Fibonacci") y nos quedamos solo con los que caen en tierra.
function puntosTierra(n: number) {
  const esTierra = crearEsTierra();
  const pts: { v: Vec; calido: boolean }[] = [];
  const oro = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const v: Vec = [Math.cos(oro * i) * r, y, Math.sin(oro * i) * r];
    const lat = (Math.asin(v[1]) * 180) / Math.PI;
    const lon = (Math.atan2(v[0], v[2]) * 180) / Math.PI;
    if (!esTierra(lat, lon)) continue;
    // Zona "cálida" aproximada: Sahara y Arabia (para darle color como en la referencia).
    const calido = lat > 12 && lat < 33 && lon > -17 && lon < 60;
    pts.push({ v, calido });
  }
  return pts;
}

export function GloboRed() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const ctx = lienzo?.getContext("2d");
    if (!lienzo || !ctx) return;

    const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tierra = puntosTierra(24000);
    const nodos = ciudades.map((c) => aVector(c.lat, c.lon));
    const fuente = getComputedStyle(document.body).fontFamily;

    // Estado de la rotación (en radianes). Empieza mirando a Latinoamérica.
    let rotY = -1.25; // longitud central ≈ -72° (Colombia)
    let rotX = -0.12;
    const giroBase = menosMovimiento ? 0 : 0.0018;
    let velY = giroBase;
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

    // Anillo de órbita: una elipse inclinada alrededor del globo.
    // La mitad de arriba pasa por detrás del globo y la de abajo por delante,
    // por eso se dibuja en dos partes: antes y después del globo.
    const dibujarOrbita = (ox: number, oy: number, R: number, t: number, mitad: "atras" | "delante") => {
      const rx = R * 1.32;
      const ry = R * 0.36;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(-0.32);
      const grad = ctx.createLinearGradient(-rx, 0, rx, 0);
      grad.addColorStop(0, "#ff9a3c");
      grad.addColorStop(0.5, "#ff5fa2");
      grad.addColorStop(1, COLOR.borde);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = COLOR.borde;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      if (mitad === "atras") ctx.ellipse(0, 0, rx, ry, 0, Math.PI, Math.PI * 2);
      else ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
      ctx.stroke();
      // Satélite que recorre la órbita.
      const a = (t / 4000) * Math.PI * 2;
      const delante = Math.sin(a) > 0;
      if ((mitad === "delante") === delante) {
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(Math.cos(a) * rx, Math.sin(a) * ry, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const dibujar = (t: number) => {
      const R = Math.min(ancho, alto) * 0.34;
      const ox = ancho / 2;
      const oy = alto / 2;
      ctx.clearRect(0, 0, ancho, alto);

      // 1) Halo exterior de luz.
      const halo = ctx.createRadialGradient(ox, oy, R * 0.9, ox, oy, R * 1.45);
      halo.addColorStop(0, "rgba(79,224,200,0.28)");
      halo.addColorStop(1, "rgba(79,224,200,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, ancho, alto);

      // 2) Parte trasera de la órbita (queda tapada por el globo).
      dibujarOrbita(ox, oy, R, t, "atras");

      // 3) Océano: un círculo con degradado para dar volumen.
      const oceano = ctx.createRadialGradient(ox - R * 0.35, oy - R * 0.35, R * 0.1, ox, oy, R);
      oceano.addColorStop(0, COLOR.oceanoCentro);
      oceano.addColorStop(1, COLOR.oceanoBorde);
      ctx.fillStyle = oceano;
      ctx.beginPath();
      ctx.arc(ox, oy, R, 0, Math.PI * 2);
      ctx.fill();

      // 4) Continentes de puntos: más brillantes los del centro.
      for (const p of tierra) {
        const [x, y, z] = proyectar(p.v);
        if (z < 0) continue;
        const [r1, g1, b1] = p.calido ? COLOR.tierraCalida : COLOR.tierraFria;
        ctx.fillStyle = `rgba(${r1},${g1},${b1},${0.35 + z * 0.65})`;
        ctx.fillRect(ox + x * R - 1, oy - y * R - 1, 2, 2);
      }

      // 5) Borde brillante del globo.
      ctx.save();
      ctx.strokeStyle = COLOR.borde;
      ctx.lineWidth = 2;
      ctx.shadowColor = COLOR.borde;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(ox, oy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 6) Arcos entre países, elevados sobre la superficie, con datos en movimiento.
      enlaces.forEach(([a, b], i) => {
        const va = nodos[a];
        const vb = nodos[b];
        const pasos = 64;
        // Los enlaces más largos se elevan más, como una señal de satélite.
        const angulo = Math.acos(va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]);
        const altura = 0.05 + 0.25 * (angulo / Math.PI);
        const puntos: Vec[] = [];
        for (let s = 0; s <= pasos; s++) {
          const k = s / pasos;
          const p = slerp(va, vb, k);
          const elev = 1 + altura * Math.sin(Math.PI * k);
          puntos.push(proyectar([p[0] * elev, p[1] * elev, p[2] * elev]));
        }
        // Un solo trazo con todos los tramos visibles (así la línea punteada no se corta).
        const trazo = new Path2D();
        for (let s = 0; s < pasos; s++) {
          const p1 = puntos[s];
          const p2 = puntos[s + 1];
          if (!seVe(p1)) continue; // tramo oculto detrás del globo
          trazo.moveTo(ox + p1[0] * R, oy - p1[1] * R);
          trazo.lineTo(ox + p2[0] * R, oy - p2[1] * R);
        }
        // Línea base tenue.
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.stroke(trazo);
        // Rayas que fluyen a lo largo del enlace: parece una corriente de datos.
        ctx.save();
        ctx.setLineDash([3, 7]);
        ctx.lineDashOffset = -t * 0.03;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = "rgba(120,240,215,0.7)";
        ctx.stroke(trazo);
        ctx.restore();

        // Dos "cometas" por enlace, uno de ida y otro de vuelta, con estela brillante.
        for (const sentido of [1, -1]) {
          const fase = (t / 2600 + i * 0.29 + (sentido < 0 ? 0.5 : 0)) % 1;
          const cabeza = (sentido > 0 ? fase : 1 - fase) * pasos;
          const largo = 20; // tramos que ocupa la estela
          for (let j = 0; j < largo; j++) {
            const s1 = cabeza - sentido * j;
            const s2 = cabeza - sentido * (j + 1);
            if (s1 < 0 || s1 > pasos || s2 < 0 || s2 > pasos) continue;
            const p1 = punto(puntos, s1);
            const p2 = punto(puntos, s2);
            if (!seVe(p1)) continue;
            const fuerza = 1 - j / largo;
            ctx.strokeStyle = sentido > 0 ? `rgba(79,224,200,${fuerza})` : `rgba(255,154,60,${fuerza})`;
            ctx.lineWidth = 0.8 + 2.4 * fuerza;
            ctx.beginPath();
            ctx.moveTo(ox + p1[0] * R, oy - p1[1] * R);
            ctx.lineTo(ox + p2[0] * R, oy - p2[1] * R);
            ctx.stroke();
          }
          const pq = punto(puntos, cabeza);
          if (seVe(pq)) {
            ctx.save();
            const color = sentido > 0 ? COLOR.borde : "#ff9a3c";
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = color;
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(ox + pq[0] * R, oy - pq[1] * R, 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      });

      // 7) Países: punto, anillo que "late" y nombre.
      ctx.font = `600 ${Math.max(11, R * 0.085)}px ${fuente}`;
      ctx.textBaseline = "middle";
      nodos.forEach((n, i) => {
        const [x, y, z] = proyectar(n);
        if (z < 0.05) return;
        const px = ox + x * R;
        const py = oy - y * R;
        const pulso = (t / 1800 + i * 0.21) % 1;
        ctx.globalAlpha = (1 - pulso) * 0.8;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 3 + pulso * 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = Math.min(1, z * 3);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        // El nombre va a la izquierda o a la derecha según el lado del globo.
        const derecha = x >= 0;
        ctx.textAlign = derecha ? "left" : "right";
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 4;
        ctx.fillText(ciudades[i].nombre, px + (derecha ? 8 : -8), py);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // 8) Parte delantera de la órbita (pasa por encima del globo).
      dibujarOrbita(ox, oy, R, t, "delante");
    };

    // Bucle de animación: unas 60 veces por segundo.
    const animar = (t: number) => {
      if (!arrastrando) {
        rotY += velY;
        // Tras soltar, la velocidad vuelve poco a poco al giro automático.
        velY += (giroBase - velY) * 0.02;
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
      rotX = Math.max(-1.0, Math.min(1.0, rotX + dy * 0.006));
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
      aria-label="Globo terráqueo animado con México, Colombia, Brasil, Chile, España y Estados Unidos conectados por enlaces de telecomunicaciones y un anillo de órbita. Puedes arrastrarlo para girarlo."
      className="aspect-square w-full max-w-[560px] cursor-grab touch-pan-y active:cursor-grabbing"
    />
  );
}
