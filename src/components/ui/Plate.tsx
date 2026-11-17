import type { ReactNode } from 'react'
import { Pictogram, type Glyph } from './Pictogram'

const tones = { safe: '', danger: 'plate-danger', must: 'plate-must', warn: 'plate-warn' }
export type Tone = keyof typeof tones

/** A square safety sign: pictogram on a coloured field with the inset keyline. */
export function Plate({ glyph, tone = 'safe', className = 'w-16', children }: { glyph?: Glyph; tone?: Tone; className?: string; children?: ReactNode }) {
  return (
    <span className={`plate ${tones[tone]} inline-grid aspect-square shrink-0 place-items-center ${className}`}>
      {glyph ? <Pictogram name={glyph} className="w-[62%]" /> : children}
    </span>
  )
}

/** The four ISO sign shapes used as inline markers. Shape encodes meaning, so they are never used as decoration. */
export function SignMark({ kind, className = 'w-9' }: { kind: 'nota' | 'attenzione' | 'obbligo' | 'divieto'; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`shrink-0 ${className}`} aria-hidden>
      {kind === 'nota' && (
        <>
          <rect x="2" y="2" width="36" height="36" rx="5" fill="var(--safe)" />
          <path fill="var(--on-sign)" d="M17.5 17h5v13h-5zM20 9.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
        </>
      )}
      {kind === 'attenzione' && (
        <>
          <path d="M20 3.5 38.5 36h-37Z" fill="var(--warn)" stroke="oklch(20% 0.03 90)" strokeWidth="2.5" strokeLinejoin="round" />
          <path fill="oklch(20% 0.03 90)" d="M18.2 14h3.6l-.6 11h-2.4ZM20 27.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z" />
        </>
      )}
      {kind === 'obbligo' && (
        <>
          <circle cx="20" cy="20" r="18" fill="var(--must)" />
          <path fill="var(--on-sign)" d="M17.8 9h4.4l-.8 14h-2.8ZM20 26a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 0 1 0-5.4Z" />
        </>
      )}
      {kind === 'divieto' && (
        <>
          <circle cx="20" cy="20" r="15.5" fill="var(--ground)" stroke="var(--danger)" strokeWidth="5" />
          <path d="m9.5 9.5 21 21" stroke="var(--danger)" strokeWidth="5" />
        </>
      )}
    </svg>
  )
}
