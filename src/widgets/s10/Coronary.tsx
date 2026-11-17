import { motion } from 'motion/react'
import { useState } from 'react'

const STAGES = [
  { label: 'Coronaria libera', text: 'Il muscolo cardiaco riceve sangue dalle coronarie: con il vaso libero il sangue arriva a tutto il muscolo a valle.' },
  { label: 'Placca', text: 'Nel lume della coronaria si accumula materiale, per esempio grasso come nelle placche ateromasiche (dette anche aterosclerotiche): il flusso di sangue si riduce.' },
  { label: 'Occlusione', text: 'Il flusso si blocca di colpo, per esempio per un piccolo trombo sulla placca: il muscolo cardiaco a valle va incontro a ischemia. È l’infarto, o attacco cardiaco.' },
]

/** Coronary disease in three steps: free vessel, plaque narrowing the lumen, sudden occlusion and ischaemia downstream. */
export function Coronary() {
  const [n, setN] = useState(0)
  const reach = n === 2 ? 118 : 262
  return (
    <figure className="my-8 max-w-[72ch]">
      <div className="rounded-plate bg-panel p-5">
        <div role="radiogroup" aria-label="Stato della coronaria" className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => (
            <button key={s.label} type="button" role="radio" aria-checked={n === i} onClick={() => setN(i)} className={`rounded-chip px-3 py-2 text-[0.95rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${n === i ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`}>
              {i + 1}. {s.label}
            </button>
          ))}
        </div>
        <svg viewBox="0 0 360 170" className="mt-4 w-full" role="img" aria-label={`Coronaria in sezione: ${STAGES[n].label}. ${STAGES[n].text}`}>
          <rect x="10" y="44" width="250" height="72" fill="var(--panel-2)" />
          <rect x="10" y="34" width="250" height="12" rx="4" fill="var(--ink-soft)" />
          <rect x="10" y="114" width="250" height="12" rx="4" fill="var(--ink-soft)" />
          {n > 0 && (
            <motion.g initial={{ scaleY: 0.2, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} style={{ transformOrigin: '145px 80px' }}>
              <path d="M104 46Q145 76 186 46Z" fill="var(--warn)" />
              <path d="M104 114Q145 88 186 114Z" fill="var(--warn)" />
            </motion.g>
          )}
          {n === 2 && <motion.ellipse cx="145" cy="80" rx="14" ry="13" fill="var(--danger)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} />}
          {[0, 1, 2, 3, 4].map((k) => (
            <motion.circle
              key={`${n}-${k}`}
              cy={80 + ((k % 3) - 1) * 12}
              r="5"
              fill="var(--safe)"
              initial={{ x: 18, opacity: 0 }}
              animate={{ x: [18, reach], opacity: [0, 1, 1, 0] }}
              transition={{ duration: n === 1 ? 3.2 : 1.8, delay: k * (n === 1 ? 0.64 : 0.36), repeat: Infinity, ease: 'linear' }}
            />
          ))}
          <rect x="268" y="20" width="84" height="120" rx="10" fill={n === 2 ? 'var(--danger-tint)' : 'var(--safe-tint)'} className="transition-[fill] duration-300" />
          {n === 2 && <path d="M276 32l68 68M276 64l52 52M296 32l48 48M276 96l28 28M320 32l24 24" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />}
          <text x="310" y="156" textAnchor="middle" fontSize="11" fill="var(--ink-soft)">
            muscolo a valle
          </text>
          <text x="310" y="84" textAnchor="middle" fontSize="13" fontWeight="700" fill={n === 2 ? 'var(--danger)' : 'var(--safe-deep)'}>
            {n === 2 ? 'ischemia' : 'ossigeno'}
          </text>
          <text x="20" y="22" fontSize="11" fill="var(--ink-soft)">
            flusso di sangue →
          </text>
        </svg>
      </div>
      <figcaption className="mt-3" aria-live="polite">
        <span className="font-bold">{STAGES[n].label}.</span> {STAGES[n].text}
      </figcaption>
    </figure>
  )
}
