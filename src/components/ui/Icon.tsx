import type { CSSProperties } from 'react';

/**
 * Um único conjunto de ícones, traço 1.6 com pontas arredondadas,
 * desenhados para combinar com a tipografia. Misturar bibliotecas de ícone
 * é uma das marcas mais óbvias de site gerado automaticamente.
 */
const PATHS = {
  arrowRight: <path d="M3 12h17M14 6l6 6-6 6" />,
  arrowLeft: <path d="M21 12H4M10 6l-6 6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  arrowUp: <path d="M12 21V4M6 10l6-6 6 6" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </>
  ),
  check: <path d="m4.5 12.5 4.5 4.5 10.5-10.5" />,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  send: <path d="M3 11.5 21 3l-8.5 18-2-7.5z M10.5 13.5 21 3" />,
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}

export default function Icon({ name, size = 18, strokeWidth = 1.6, style, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {PATHS[name]}
    </svg>
  );
}
