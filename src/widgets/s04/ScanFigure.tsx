import { motion } from 'motion/react'

const look = { duration: 4, ease: 'easeInOut' as const, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }

/** A rescuer with gloves stands by the victim and looks around (sideways and up) before stepping in. */
export function ScanFigure({ className = 'w-full' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 220" className={className} role="img" aria-label="Una soccorritrice con i guanti, in piedi accanto a una persona distesa, si guarda intorno e verso l’alto prima di intervenire">
      <rect x="8" y="200" width="284" height="5" rx="2.5" fill="var(--line)" />
      {/* line of sight sweeping the scene */}
      <motion.line
        x1="200"
        y1="50"
        x2="272"
        y2="50"
        stroke="var(--safe)"
        strokeWidth="3"
        strokeDasharray="2 7"
        strokeLinecap="round"
        style={{ originX: 0, originY: 0.5 }}
        initial={{ rotate: 150 }}
        whileInView={{ rotate: [150, 210, 260, 300, 380, 150] }}
        viewport={{ amount: 0.6 }}
        transition={look}
      />
      {/* rescuer */}
      <g stroke="var(--ink)" strokeLinecap="round">
        <line x1="192" y1="196" x2="194" y2="142" strokeWidth="15" />
        <line x1="208" y1="196" x2="206" y2="142" strokeWidth="15" />
        <line x1="200" y1="138" x2="200" y2="84" strokeWidth="30" />
        <line x1="188" y1="86" x2="160" y2="128" strokeWidth="11" />
        <line x1="212" y1="86" x2="240" y2="128" strokeWidth="11" />
      </g>
      <circle cx="160" cy="130" r="7.5" fill="var(--must)" />
      <circle cx="240" cy="130" r="7.5" fill="var(--must)" />
      <motion.circle cx="200" cy="50" r="15" fill="var(--ink)" initial={{ x: -3, y: 2 }} whileInView={{ x: [-3, -6, -2, 4, 6, -3], y: [2, 0, -4, -4, 1, 2] }} viewport={{ amount: 0.6 }} transition={look} />
      {/* victim, supine */}
      <g fill="var(--ink-soft)">
        <circle cx="40" cy="186" r="13" />
        <rect x="56" y="176" width="88" height="22" rx="11" />
        <rect x="138" y="179" width="44" height="16" rx="8" />
      </g>
    </svg>
  )
}
