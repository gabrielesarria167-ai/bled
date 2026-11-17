import { motion } from 'motion/react'
import { useId, useMemo } from 'react'
import { HEIGHT, LOOP, tracePath, WIDTH, type Rhythm } from './ecg'

const VIEW = 400 // four seconds visible

/** A scrolling monitor trace in `lume` on the dark well. `rhythm={null}` is a flat line (electrodes not reading a rhythm). */
export function EcgTrace({ rhythm, artefact = false, label, className = '' }: { rhythm: Rhythm | null; artefact?: boolean; label: string; className?: string }) {
  const d = useMemo(() => tracePath(rhythm, artefact), [rhythm, artefact])
  const grid = `ecg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const line = { fill: 'none', stroke: 'var(--lume)', strokeWidth: 2.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  return (
    <svg viewBox={`0 0 ${VIEW} ${HEIGHT}`} className={`block h-auto w-full overflow-hidden rounded-chip bg-well-2 ${className}`} role="img" aria-label={label}>
      <defs>
        <pattern id={grid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--well-soft)" strokeOpacity="0.16" />
        </pattern>
      </defs>
      <rect width={VIEW} height={HEIGHT} fill={`url(#${grid})`} />
      <motion.g key={`${rhythm}-${artefact}`} initial={{ x: 0 }} animate={{ x: -WIDTH }} transition={{ duration: LOOP, ease: 'linear', repeat: Infinity }}>
        <path d={d} {...line} />
        <path d={d} transform={`translate(${WIDTH} 0)`} {...line} />
      </motion.g>
    </svg>
  )
}
