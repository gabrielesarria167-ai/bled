import { useState } from 'react'

const MAX = 12
const X0 = 46
const X1 = 462
const Y0 = 22
const Y1 = 206
const xs = (m: number) => X0 + (m * (X1 - X0)) / MAX
const ys = (v: number) => Y1 - (v * (Y1 - Y0)) / 100
const left = (m: number, perMin: number) => Math.max(0, 100 - perMin * m)
const curve = (perMin: number) => Array.from({ length: MAX + 1 }, (_, m) => [xs(m), ys(left(m, perMin))])

/** "Ogni minuto conta": each minute without defibrillation takes away 7-10% of the chance of survival (p. 83). */
export function SurvivalTime() {
  const [m, setM] = useState(0)
  const hi = left(m, 7)
  const lo = left(m, 10)
  const band = [...curve(7), ...curve(10).reverse()].map((p) => p.join(',')).join(' ')
  return (
    <figure className="my-8 max-w-[72ch]">
      <div className="rounded-plate bg-panel p-5">
        <label htmlFor="s10-minuti" className="font-display text-[1.35rem] font-bold leading-tight">
          Minuti senza defibrillazione: {m}
        </label>
        <input id="s10-minuti" type="range" min={0} max={MAX} step={1} value={m} onChange={(e) => setM(Number(e.target.value))} className="mt-3 block w-full" />
        <svg viewBox="0 0 480 240" className="mt-4 w-full" role="img" aria-label={`Grafico: la possibilità di sopravvivenza scende del 7-10% per ogni minuto senza defibrillazione. Dopo ${m} minuti resta fra ${lo} e ${hi} su 100.`}>
          <rect x={xs(4)} y={Y0} width={xs(5) - xs(4)} height={Y1 - Y0} fill="var(--warn)" fillOpacity="0.35" />
          <text x={xs(4.5)} y={Y0 - 6} fontSize="11" textAnchor="middle" fill="var(--ink-soft)">
            4-5 min
          </text>
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line x1={X0} x2={X1} y1={ys(v)} y2={ys(v)} stroke="var(--line)" />
              <text x={X0 - 8} y={ys(v) + 4} fontSize="11" textAnchor="end" fill="var(--ink-soft)">
                {v}
              </text>
            </g>
          ))}
          {Array.from({ length: MAX / 2 + 1 }, (_, k) => k * 2).map((t) => (
            <text key={t} x={xs(t)} y={Y1 + 18} fontSize="11" textAnchor="middle" fill="var(--ink-soft)">
              {t}
            </text>
          ))}
          <text x={X1} y={Y1 + 32} fontSize="11" textAnchor="end" fill="var(--ink-soft)">
            minuti
          </text>
          <polygon points={band} fill="var(--safe)" fillOpacity="0.22" />
          <polyline points={curve(7).map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--safe-deep)" strokeWidth="2.5" />
          <polyline points={curve(10).map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--safe-deep)" strokeWidth="2.5" strokeDasharray="6 4" />
          <line x1={xs(m)} x2={xs(m)} y1={Y0} y2={Y1} stroke="var(--must)" strokeWidth="2.5" />
          <circle cx={xs(m)} cy={ys(hi)} r="5" fill="var(--must)" />
          <circle cx={xs(m)} cy={ys(lo)} r="5" fill="var(--must)" />
        </svg>
        <p className="mt-3 text-[1.05rem]" aria-live="polite">
          {m === 0 ? (
            'Defibrillazione nei primissimi minuti: il tasso di sopravvivenza è molto alto. Sposta il cursore.'
          ) : (
            <>
              Dopo {m} {m === 1 ? 'minuto' : 'minuti'} di ritardo la possibilità di sopravvivenza è ridotta di circa{' '}
              <strong>
                {Math.min(100, 7 * m)}-{Math.min(100, 10 * m)}%
              </strong>
              : ne resta fra {lo} e {hi} su 100.
            </>
          )}
        </p>
      </div>
      <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">
        Linea piena: 7% in meno a ogni minuto; tratteggiata: 10% in meno. La fascia gialla segna i 4-5 minuti dopo i quali i tessuti del sistema nervoso centrale cominciano a morire senza flusso di sangue (p. 85). Il manuale dà solo la riduzione per minuto: la scala parte da 100 per mostrarne l’effetto, non è una statistica.
      </figcaption>
    </figure>
  )
}
