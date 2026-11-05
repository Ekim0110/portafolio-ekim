"use client";
// Envuelve una sección y avisa (con data-visible) cuando aparece en pantalla.
// Así sus elementos con la clase "entrada" se animan justo cuando la persona
// llega a ellos, y no todos al cargar la página.
// IntersectionObserver es una herramienta del navegador que "vigila" si algo
// está visible, sin gastar recursos revisando en cada scroll.

import { useEffect, useRef, type ReactNode } from "react";

export function Revelar({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const vigia = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-visible", "");
          vigia.disconnect(); // solo se anima una vez
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    vigia.observe(el);
    return () => vigia.disconnect();
  }, []);

  return (
    <div ref={ref} data-revelar="" className={className}>
      {children}
    </div>
  );
}
