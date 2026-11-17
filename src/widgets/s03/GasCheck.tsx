import { Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui'
import { gasLeft } from './logic'

/** Rescuer kneeling by a supine victim: cheek over mouth and nose, eyes on the chest, one hand on the forehead, fingers under the chin. */
export function GasDrawing({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 214" className={className} role="img" aria-label="Soccorritore inginocchiato accanto a una persona distesa sulla schiena: avvicina la guancia a bocca e naso e guarda il torace, con una mano sulla fronte e le dita sotto il mento">
      <rect x="8" y="202" width="344" height="5" rx="2.5" fill="var(--line)" />
      {/* victim, supine */}
      <g fill="var(--ink-soft)" opacity="0.6">
        <circle cx="50" cy="184" r="15" />
        <rect x="68" y="172" width="122" height="27" rx="13.5" />
        <rect x="184" y="176" width="160" height="20" rx="10" />
      </g>
      {/* line of sight to the chest */}
      <path d="M82 150 134 168" stroke="var(--safe)" strokeWidth="3.5" strokeDasharray="2 7" strokeLinecap="round" />
      {/* rescuer, kneeling on the near side and bending over the face */}
      <g stroke="var(--ink)" strokeLinecap="round">
        <line x1="104" y1="124" x2="44" y2="172" strokeWidth="12" />
        <line x1="168" y1="198" x2="240" y2="198" strokeWidth="16" />
        <line x1="166" y1="196" x2="176" y2="132" strokeWidth="26" />
        <line x1="176" y1="128" x2="104" y2="120" strokeWidth="32" />
        <line x1="110" y1="130" x2="70" y2="178" strokeWidth="12" />
      </g>
      <circle cx="72" cy="142" r="16" fill="var(--ink)" />
      {/* gloved hands: forehead and chin */}
      <circle cx="44" cy="172" r="8" fill="var(--must)" />
      <circle cx="70" cy="178" r="8" fill="var(--must)" />
    </svg>
  )
}

/** The GAS check: Guarda, Ascolta, Senti for at most 10 seconds. The timer starts only on click. */
export function GasCheck() {
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const elapsed = start === null ? 0 : now - start
  const left = gasLeft(elapsed)
  const done = start !== null && left === 0

  useEffect(() => {
    if (start === null || done) return
    const id = setInterval(() => setNow(performance.now()), 100)
    return () => clearInterval(id)
  }, [start, done])

  const go = () => {
    const t = performance.now()
    setNow(t)
    setStart(t)
  }

  return (
    <div className="rounded-plate bg-ground p-4">
      <GasDrawing />
      <ul className="mt-3 grid grid-cols-3 gap-2 pl-0! text-center text-[0.9rem] leading-tight">
        {[
          ['G', 'Guarda il torace'],
          ['A', 'Ascolta'],
          ['S', 'Senti il respiro'],
        ].map(([l, t]) => (
          <li key={l} className="mt-0! flex flex-col items-center gap-1">
            <span className="font-display text-[1.9rem] font-extrabold leading-none text-must">{l}</span>
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-panel-2" aria-hidden>
        <div className="h-full origin-left bg-must transition-transform duration-100 ease-linear" style={{ transform: `scaleX(${start === null ? 1 : Math.max(0, 1 - elapsed / 10000)})` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <p className="font-display text-[2.2rem] font-extrabold leading-none" aria-hidden>
          {left}
          <span className="ml-1 text-[1rem] font-bold">s</span>
        </p>
        <Button variant={start === null ? 'must' : 'quiet'} onClick={go}>
          {start === null ? <Play className="size-4" aria-hidden /> : <RotateCcw className="size-4" aria-hidden />}
          {start === null ? 'Avvia i 10 secondi' : 'Ricomincia'}
        </Button>
      </div>
      <p className="mt-3 text-[0.95rem] leading-snug" aria-live="polite">
        {done
          ? 'Tempo scaduto: decidi ora se il respiro è normale o alterato. Se la vittima non respira, passa alle compressioni toraciche.'
          : start === null
            ? 'Prova a contare con il timer: non più di 10 secondi.'
            : 'Guarda, ascolta, senti…'}
      </p>
    </div>
  )
}
