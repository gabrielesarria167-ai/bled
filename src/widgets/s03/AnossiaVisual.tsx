import { motion } from 'motion/react'
import { damageAt, minuteAt, storyMinutes } from './logic'

const brain = (
  <>
    <circle cx="216" cy="126" r="30" />
    <circle cx="246" cy="104" r="34" />
    <circle cx="284" cy="108" r="32" />
    <circle cx="302" cy="138" r="24" />
    <circle cx="262" cy="144" r="30" />
    <circle cx="226" cy="150" r="24" />
  </>
)
const B_TOP = 70
const B_H = 110

const clock = (m: number) => {
  const s = Math.round(m * 60)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * Pinned drawing for the anoxia ScrollStory: a head with the brain, the oxygen supply, the clock and the
 * damage reading. Only the manual's facts: about 10% per minute, the 3-minute mark, necrosis (no time), RCP slows it.
 */
export function AnossiaVisual({ active, progress }: { active: number; progress: number }) {
  const m = minuteAt(active, progress)
  const local = Math.min(1, Math.max(0, progress * storyMinutes.length - active))
  const flow = active === 0 ? 1 - local : active === 4 ? 0.75 : 0
  const fill = m !== null ? damageAt(m) / 100 : active === 3 ? 0.3 + 0.45 * local : 0.3
  const marker = Math.min(m ?? 3, 3) / 3

  return (
    <svg viewBox="0 0 400 320" className="h-full w-full p-3" role="img" aria-label={`Cervello senza ossigeno. ${m !== null ? `Minuto ${clock(m)}: danno anossico circa ${damageAt(m)}%.` : active === 3 ? 'Se l’anossia continua, i tessuti vanno in necrosi.' : 'Con la RCP il sangue ossigenato torna a scorrere e il danno rallenta.'}`}>
      <defs>
        <clipPath id="s03-brain">{brain}</clipPath>
      </defs>

      {/* clock */}
      <text x="22" y="58" className="font-display" fontSize="50" fontWeight="800" fill="var(--lume)">
        {m !== null ? clock(m) : active === 3 ? 'poi…' : 'RCP'}
      </text>
      <text x="24" y="82" fontSize="14" fill="var(--well-soft)">
        {m !== null ? 'minuti dall’evento' : active === 3 ? 'se l’anossia continua' : 'il soccorso inizia'}
      </text>

      {/* oxygen supply: vessel up the neck into the brain */}
      <g fill="var(--well-soft)" opacity="0.16">
        <circle cx="258" cy="126" r="84" />
        <rect x="226" y="196" width="60" height="90" rx="12" />
        <path d="M176 330c0-36 24-56 60-60h44c36 4 60 24 60 60Z" />
      </g>
      <line x1="242" y1="320" x2="242" y2="176" stroke="var(--well-soft)" strokeOpacity="0.35" strokeWidth="9" strokeLinecap="round" />
      <motion.g animate={{ opacity: flow }} transition={{ duration: 0.25 }}>
        <motion.g animate={flow > 0 ? { y: [0, -26] } : { y: 0 }} transition={{ repeat: Infinity, ease: 'linear', duration: active === 4 ? 1.1 : 0.6 }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <circle key={k} cx="242" cy={316 - k * 26} r="5" fill="var(--lume)" />
          ))}
        </motion.g>
      </motion.g>

      {/* brain: oxygenated colour, damage rising from below */}
      <g clipPath="url(#s03-brain)">
        <rect x="182" y={B_TOP} width="148" height={B_H} fill="var(--lume)" opacity={0.35 + 0.65 * Math.max(flow, active >= 4 ? 0.75 : 0)} />
        <rect
          x="182"
          y={B_TOP}
          width="148"
          height={B_H}
          fill="var(--warn)"
          style={{ transform: `scaleY(${fill})`, transformOrigin: 'bottom', transformBox: 'fill-box' }}
          className="transition-transform duration-300 ease-out"
        />
      </g>

      {/* 3 minutes: the central nervous system */}
      <motion.g animate={{ opacity: active >= 2 ? 1 : 0 }} transition={{ duration: 0.25 }}>
        <path d="M336 40 358 78h-44Z" fill="var(--warn)" />
        <path d="M334.5 52h3l-.5 14h-2Zm1.5 17a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z" fill="var(--well)" />
      </motion.g>

      {/* timeline 0–3 minutes */}
      <g fontSize="13" fill="var(--well-soft)">
        <rect x="24" y="246" width="138" height="4" rx="2" fill="var(--well-2)" />
        {[0, 1, 2, 3].map((k) => (
          <g key={k}>
            <rect x={22 + k * 46} y="240" width="4" height="16" rx="2" fill={k === 3 ? 'var(--warn)' : 'var(--well-soft)'} />
            <text x={24 + k * 46} y="274" textAnchor="middle">
              {k}′
            </text>
          </g>
        ))}
        <circle cx="24" cy="248" r="8" fill="var(--lume)" style={{ transform: `translateX(${marker * 138}px)` }} className="transition-transform duration-300 ease-out" />
      </g>

      <text x="22" y="304" fontSize="16" fontWeight="700" fill="var(--well-ink)">
        {m !== null ? `Danno anossico: circa ${damageAt(m)}%` : active === 3 ? 'Necrosi dei tessuti' : 'Il danno rallenta'}
      </text>
      {active >= 2 && m !== null && (
        <text x="22" y="132" fontSize="14" fontWeight="700" fill="var(--warn)">
          <tspan x="22">Sistema nervoso</tspan>
          <tspan x="22" dy="18">centrale: grave</tspan>
          <tspan x="22" dy="18">sofferenza</tspan>
        </text>
      )}
    </svg>
  )
}
