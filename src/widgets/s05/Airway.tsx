import { useState } from 'react'
import { Button } from '../../components/ui/Button'

const head = { transformOrigin: '184px 142px', transformBox: 'view-box' } as const

/**
 * Side section of a supine head (crown on the left, face up). Closed: the relaxed tongue falls back onto the
 * airway. Open: head tilted back and chin lifted, the tongue comes forward and air reaches the trachea.
 */
export function Airway() {
  const [open, setOpen] = useState(false)
  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,26rem)_1fr]">
      <svg viewBox="0 0 340 200" className="w-full" role="img" aria-label={open ? 'Capo iperesteso e mento sollevato: la lingua si sposta in avanti e l’aria passa nella trachea' : 'Capo non iperesteso: la lingua rilasciata cade all’indietro e chiude le vie aeree'}>
        <path d="M4 190h332" stroke="var(--well-2)" strokeWidth="4" strokeLinecap="round" />
        {/* neck and shoulders, fixed */}
        <rect x="170" y="108" width="90" height="62" rx="22" fill="var(--well-soft)" />
        <rect x="232" y="86" width="120" height="104" rx="26" fill="var(--well-soft)" />
        <path d="M184 144L310 148" stroke="var(--well)" strokeWidth="12" strokeLinecap="round" />
        <path d="M206 146h70m-10-8 12 8-12 8" fill="none" stroke="var(--lume)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-opacity duration-300" opacity={open ? 1 : 0} />

        <g className="transition-transform duration-300 ease-out" style={{ ...head, transform: `rotate(${open ? -14 : 8}deg)` }}>
          <circle cx="118" cy="122" r="58" fill="var(--well-soft)" />
          <rect x="146" y="76" width="56" height="44" rx="20" fill="var(--well-soft)" />
          <rect x="96" y="52" width="18" height="18" rx="7" fill="var(--well-soft)" />
          <path d="M140 66C142 104 160 132 186 143" fill="none" stroke="var(--well)" strokeWidth="12" strokeLinecap="round" />
          <g className="transition-transform duration-300 ease-out" style={{ transform: open ? 'translate(0px, 0px)' : 'translate(-18px, 24px)' }}>
            <ellipse cx="180" cy="98" rx="17" ry="10" transform="rotate(40 180 98)" fill="var(--warn)" />
          </g>
          <g className="transition-opacity duration-300" opacity={open ? 1 : 0}>
            <path d="M60 92 92 64M76 78 44 22" stroke="var(--lume)" strokeWidth="13" strokeLinecap="round" />
            <path d="M200 124 214 104M214 104 250 40" stroke="var(--lume)" strokeWidth="10" strokeLinecap="round" />
          </g>
        </g>
        <g className="transition-opacity duration-300" opacity={open ? 0 : 1}>
          <path d="M222 136l16 16m0-16-16 16" stroke="var(--danger)" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      <div>
        <p aria-live="polite" className="font-display text-[1.6rem] font-bold leading-tight">
          {open ? 'Vie aeree aperte: capo iperesteso e mento sollevato, la lingua si sposta in avanti e l’aria passa.' : 'Vie aeree chiuse: in chi è incosciente la lingua rilasciata può cadere all’indietro e bloccare il passaggio dell’aria.'}
        </p>
        <ul className="mt-4 space-y-1.5 pl-0! text-[0.95rem] text-well-soft">
          <li className="mt-0! flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-[3px] bg-warn" aria-hidden /> lingua
          </li>
          <li className="mt-0! flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-[3px] bg-well ring-1 ring-well-soft" aria-hidden /> vie aeree (dalla bocca alla trachea)
          </li>
          <li className="mt-0! flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-[3px] bg-lume" aria-hidden /> mano sulla fronte e punta delle dita sotto il mento
          </li>
        </ul>
        <Button variant="onDark" className="mt-5" aria-pressed={open} onClick={() => setOpen(!open)}>
          {open ? 'Riporta il capo in posizione neutra' : 'Piega il capo e solleva il mento'}
        </Button>
      </div>
    </div>
  )
}
