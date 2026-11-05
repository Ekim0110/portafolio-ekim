// Logo de RumboLab: la aguja de una brújula dentro de un cuadro naranja.
// La aguja apunta arriba a la derecha: se lee como "rumbo" y también como
// "crecimiento" (la dirección en que sube una buena gráfica). La punta norte va
// oscura y la sur clara, como en una brújula real; cuatro marcas cardinales en el aro.
// Al pasar el mouse por el enlace del logo, la aguja gira un poco "buscando el rumbo"
// (ver .aguja-rumbo en globals.css).
export function LogoMarca({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--acento)" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="var(--fondo)" strokeOpacity="0.28" strokeWidth="1.2" />
      {/* Marcas cardinales: N, E, S, O */}
      <path d="M16 7.2v2.2M24.8 16h-2.2M16 24.8v-2.2M7.2 16h2.2" stroke="var(--fondo)" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
      <g className="aguja-rumbo">
        <g transform="rotate(45 16 16)">
          <path d="M16 6.2 L19.4 16 L12.6 16 Z" fill="var(--fondo)" />
          <path d="M16 25.8 L12.6 16 L19.4 16 Z" fill="var(--tinta)" fillOpacity="0.92" />
        </g>
        <circle cx="16" cy="16" r="1.3" fill="var(--acento)" stroke="var(--fondo)" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
