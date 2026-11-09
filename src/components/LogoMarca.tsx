// Logo de RumboLab (redibujado en vectores a partir del logo original de Mike):
// una onda que empieza como ruido, pasa por un nodo de datos y sale como una
// curva limpia que sube en forma de flecha. Es la idea del sitio en un dibujo:
// "del ruido a la decisión". Degradado de cian a verde.
// Al pasar el mouse por el enlace del logo, la flecha avanza un poco (ver .flecha-logo).

type Props = { className?: string; id?: string };

export function LogoSimbolo({ className = "h-8 w-16", id = "logo" }: Props) {
  const grad = `${id}-grad`;
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={grad} x1="0" x2="64" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1ec8f2" />
          <stop offset="0.55" stopColor="#25d3c8" />
          <stop offset="1" stopColor="#34e39a" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${grad})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Ruido: picos desordenados */}
        <path d="M1.5 16H5.5L7.3 11L9 21.5L10.8 5.5L12.6 27L14.4 8.5L16.2 23L18 12L19.8 19.5L21.6 14.5L23.2 17.5L24.6 16H27.4" />
        {/* Nodo de datos con sus conexiones */}
        <circle cx="31.6" cy="16" r="4.2" />
        <path d="M28.6 13 26.8 10.6M34.4 12.9 36.3 10.4M29 19.2 27.4 21.8" strokeWidth="1.5" />
        {/* Señal limpia que sube y termina en flecha */}
        <g className="flecha-logo">
          <path d="M35.8 16C39.2 16 40.4 21.4 43.6 21.4C47.4 21.4 49 9.5 53 7.6L59.6 3.2" />
          <path d="M55 2.6H60.2V7.8" />
        </g>
      </g>
      <circle cx="31.6" cy="16" r="1.6" fill={`url(#${grad})`} />
      <circle cx="26.3" cy="9.9" r="1.4" fill={`url(#${grad})`} />
      <circle cx="36.8" cy="9.7" r="1.4" fill={`url(#${grad})`} />
      <circle cx="27" cy="22.6" r="1.4" fill={`url(#${grad})`} />
    </svg>
  );
}

// Nombre de la marca como en el logo: "Rumbo" en negrita y "Lab" fino.
export function LogoTexto({ marca, className = "", heredaColor = false }: { marca: string; className?: string; heredaColor?: boolean }) {
  const corte = marca.toLowerCase().endsWith("lab") ? marca.length - 3 : marca.length;
  return (
    <span className={`font-logo tracking-[-0.01em] ${className}`}>
      <span className="font-bold">{marca.slice(0, corte)}</span>
      <span className={heredaColor ? "font-light" : "font-light text-tinta/85"}>{marca.slice(corte)}</span>
    </span>
  );
}
