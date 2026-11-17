import { motion } from 'motion/react'
import { useState } from 'react'

const ease = [0.23, 1, 0.32, 1] as const
// Keyframes for the moving dot: air from the nose into the trachea, food from the mouth into the esophagus.
const air = { x: [92, 222, 222, 198, 198], y: [118, 118, 236, 268, 372] }
const food = { x: [112, 222, 222, 238, 238], y: [165, 165, 236, 268, 372] }

const labels: { text: string; x: number; y: number; to: [number, number]; anchor?: 'end' }[] = [
  { text: 'Naso', x: 54, y: 100, to: [86, 116], anchor: 'end' },
  { text: 'Bocca', x: 54, y: 170, to: [102, 166], anchor: 'end' },
  { text: 'Faringe', x: 318, y: 160, to: [236, 160] },
  { text: 'Epiglottide', x: 318, y: 218, to: [204, 228] },
  { text: 'Laringe', x: 132, y: 286, to: [186, 282], anchor: 'end' },
  { text: 'Trachea', x: 132, y: 346, to: [186, 346], anchor: 'end' },
  { text: 'Esofago', x: 318, y: 330, to: [248, 330] },
]

/** Side view of the throat: switch between breathing (epiglottis up) and swallowing (epiglottis down over the larynx). */
export function Throat() {
  const [swallow, setSwallow] = useState(false)
  const path = swallow ? food : air
  const btn = (on: boolean) => `rounded-chip px-4 py-2 font-display text-[1.15rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${on ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`

  return (
    <figure className="my-8 max-w-[72ch]">
      <div className="mount overflow-hidden rounded-plate bg-panel p-4 sm:p-6">
        <div role="group" aria-label="Cosa succede nella gola" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!swallow} onClick={() => setSwallow(false)} className={btn(!swallow)}>
            Respiro
          </button>
          <button type="button" aria-pressed={swallow} onClick={() => setSwallow(true)} className={btn(swallow)}>
            Deglutizione
          </button>
        </div>
        <svg viewBox="0 0 420 390" className="mt-4 h-auto w-full" role="img" aria-label={swallow ? 'Gola vista di lato durante la deglutizione: l’epiglottide è abbassata sopra la laringe e il boccone scende nell’esofago.' : 'Gola vista di lato durante il respiro: l’epiglottide è sollevata e l’aria scende dal naso nella trachea.'}>
          {/* head and neck in profile, facing left */}
          <path fill="var(--panel-2)" d="M205 20c70 0 95 55 95 110 0 45-15 70-30 85v175H160V250c-30-5-48-18-52-35l-8-15c-4-10 0-18 6-22l-10-10 8-8-6-10c-2-8 2-12-6-22l-14-16c-4-6 0-12 8-12l12-2c2-48 42-78 107-78Z" />
          {/* nasal cavity, mouth, pharynx, trachea (front) and esophagus (back) */}
          <g fill="none" stroke="var(--ground)" strokeLinecap="round" strokeLinejoin="round">
            <path d="M92 118h130v118" strokeWidth="20" />
            <path d="M108 165h114" strokeWidth="24" />
            <path d="M222 230q-24 6-24 38v112" strokeWidth="22" />
            <path d="M222 230q16 8 16 38v112" strokeWidth="18" />
          </g>
          {/* tracheal rings */}
          <g fill="var(--line)">
            {[300, 322, 344, 366].map((y) => (
              <rect key={y} x="187" y={y} width="22" height="6" rx="3" />
            ))}
          </g>
          {/* epiglottis: hinged at the front of the larynx */}
          <motion.path d="M187 252l8-30" stroke="var(--must)" strokeWidth="8" strokeLinecap="round" style={{ originX: 0, originY: 1 }} animate={{ rotate: swallow ? 112 : 0 }} transition={{ duration: 0.3, ease }} />
          <motion.circle key={swallow ? 'food' : 'air'} cx="0" cy="0" r={swallow ? 9 : 6} fill={swallow ? 'var(--ink-soft)' : 'var(--safe)'} initial={{ x: path.x[0], y: path.y[0], opacity: 0 }} animate={{ ...path, opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 3.2, ease: 'linear', repeat: Infinity, repeatDelay: 0.4 }} />
          <g fontSize="19" fill="var(--ink)" className="font-display" fontWeight="700">
            {labels.map((l) => (
              <g key={l.text}>
                <path d={`M${l.anchor === 'end' ? l.x + 4 : l.x - 4} ${l.y - 5}L${l.to[0]} ${l.to[1]}`} stroke="var(--ink-soft)" strokeWidth="1.5" fill="none" />
                <text x={l.x} y={l.y} textAnchor={l.anchor ?? 'start'}>
                  {l.text}
                </text>
              </g>
            ))}
          </g>
        </svg>
        <p className="mt-3 min-h-[3lh] sm:min-h-[2lh]" aria-live="polite">
          {swallow
            ? 'Deglutizione: l’epiglottide si abbassa sopra la laringe. Cibo e liquidi passano dietro, nell’esofago, e non finiscono nella trachea.'
            : 'Respiro: l’epiglottide resta sollevata. L’aria entra dal naso o dalla bocca, attraversa faringe e laringe e scende nella trachea.'}
        </p>
      </div>
      <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">Schema della gola vista di lato: davanti la trachea, subito dietro l’esofago. Scegli Respiro o Deglutizione e guarda l’epiglottide.</figcaption>
    </figure>
  )
}
