import type { ReactNode } from 'react'

/** Authored pictograms in the ISO 7010 grammar: solid figures, no outlines, drawn on a 48 grid in currentColor. */
const glyphs = {
  dae: <path fillRule="evenodd" d="M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7ZM27.5 15l-8 11.5h5L22 36l8.5-12h-5Z" />,
  cuore: <path d="M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7Z" />,
  croce: <path d="M18.5 7h11v11.5H41v11H29.5V41h-11V29.5H7v-11h11.5Z" />,
  telefono: <path d="M15.5 6.5 21 8l2 9-4.5 3.5c1.8 3.8 5 7 8.8 8.8L31 25l9 2 1.5 5.5c.3 1.2-.2 2.4-1.2 3.1-2.3 1.7-5.1 2.6-8 2.4C19.5 37 11 28.5 10 15.7c-.2-2.9.7-5.7 2.4-8 .7-1 1.9-1.5 3.1-1.2Z" />,
  polmoni: (
    <>
      <path d="M21.8 6h4.4v15h-4.4z" />
      <path d="M19.5 15.5v19c0 4.2-2.7 7.5-6.5 7.5-3.3 0-5.5-2.3-5.5-6.2 0-9.8 4.8-18.3 12-20.3ZM28.5 15.5v19c0 4.2 2.7 7.5 6.5 7.5 3.3 0 5.5-2.3 5.5-6.2 0-9.8-4.8-18.3-12-20.3Z" />
    </>
  ),
  catena: (
    <g fill="none" stroke="currentColor" strokeWidth="5.5">
      <rect x="4.75" y="16.75" width="22.5" height="14.5" rx="7.25" />
      <rect x="20.75" y="16.75" width="22.5" height="14.5" rx="7.25" />
    </g>
  ),
  mani: (
    <>
      <path d="M18.5 5h11v13H37L24 31 11 18h7.5Z" />
      <rect x="5" y="34" width="38" height="8" rx="4" />
    </>
  ),
  scudo: <path fillRule="evenodd" d="M24 4.5 40 10v12.5C40 32.5 33.5 39.8 24 43.5 14.5 39.8 8 32.5 8 22.5V10Zm-3 25.8-5.3-5.3-3.2 3.2 8.5 8.5 13.5-14.5-3.3-3Z" />,
  laterale: (
    <>
      <circle cx="9.5" cy="27.5" r="5" />
      <path d="M16 24.5h13.5l8-8.5 4 3.5-7.5 8.5H43v6H16Z" />
      <path d="m17.5 22 7.5-8.5 4 3-5.5 6.5Z" />
    </>
  ),
  ostruzione: (
    <>
      <circle cx="24" cy="11" r="6.5" />
      <path fillRule="evenodd" d="M9 43c0-11.5 6-19 15-19s15 7.5 15 19Zm15-12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="m11 30 11-5.5 1.5 3.5-11 5.5ZM37 30l-11-5.5-1.5 3.5 11 5.5Z" />
    </>
  ),
  goccia: <path d="M24 4.5c7.5 10.5 13 17.2 13 24.5a13 13 0 0 1-26 0c0-7.3 5.5-14 13-24.5Z" />,
  shock: (
    <>
      <circle cx="8.5" cy="30" r="4.5" />
      <rect x="14" y="26.5" width="17" height="7" rx="3.5" />
      <path d="m28.5 28 11-11.5 4.5 4.3-11 11.5Z" />
      <rect x="4" y="37" width="40" height="4" rx="2" />
    </>
  ),
  barella: (
    <>
      <circle cx="12" cy="16" r="4.5" />
      <rect x="18" y="13" width="22" height="7" rx="3.5" />
      <rect x="2" y="24" width="44" height="4.5" rx="2.25" />
      <path d="M9 28.5h4.5V38H9zM34.5 28.5H39V38h-4.5z" />
    </>
  ),
  casa: <path fillRule="evenodd" d="M24 5 4.5 22.5H10V42h28V22.5h5.5Zm-2.8 17.5h5.6V27H31v5.6h-4.2V37h-5.6v-4.4H17V27h4.2Z" />,
  libro: <path d="M5 9.5c6.5-2.2 12-1.3 17 2.2V40c-5-3.5-10.5-4.4-17-2.2ZM43 9.5c-6.5-2.2-12-1.3-17 2.2V40c5-3.5 10.5-4.4 17-2.2Z" />,
  esame: (
    <>
      <rect x="17" y="4" width="14" height="8" rx="2.5" />
      <path fillRule="evenodd" d="M12 8.5h3V14h18V8.5h3A3 3 0 0 1 39 11.5v29a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3v-29a3 3 0 0 1 3-3Zm9 23.3-4.3-4.3-3 3 7.3 7.3L33 25.5l-3.1-2.8Z" />
    </>
  ),
  freccia: <path d="M5 19h22V8.5L43 24 27 39.5V29H5Z" />,
  ritmo: <path fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" d="M4 27h9l4.5-13 7 24 5.5-17 3 6h11" />,
  orologio: <path fillRule="evenodd" d="M24 5a19 19 0 1 1 0 38 19 19 0 0 1 0-38Zm-2.5 8v12.5l9 6.5 2.7-3.8-6.7-4.8V13Z" />,
} satisfies Record<string, ReactNode>

export type Glyph = keyof typeof glyphs

export function Pictogram({ name, className, title }: { name: Glyph; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {glyphs[name]}
    </svg>
  )
}
