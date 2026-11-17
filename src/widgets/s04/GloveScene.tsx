import { RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

type Pose = { x: number; y: number; rotate: number }
type State = {
  L: Pose
  R: Pose
  /** glove still covering each hand, 1 = on, 0 = off (it peels toward the fingers) */
  gL: number
  gR: number
  ball: { x: number; y: number; scale: number; opacity: number }
  bag: number
  arrowL: number
  arrowR: number
}

const up: Pose = { x: 0, y: 0, rotate: 0 }
// state 0 = both gloves on; states 1–5 = the end of each step of the manual (p.33)
const states: State[] = [
  { L: up, R: up, gL: 1, gR: 1, ball: { x: 0, y: 0, scale: 0.4, opacity: 0 }, bag: 0, arrowL: 0, arrowR: 0 },
  { L: { x: -38, y: 54, rotate: 40 }, R: up, gL: 1, gR: 0.55, ball: { x: 0, y: 0, scale: 0.4, opacity: 0 }, bag: 0, arrowL: 0, arrowR: 1 },
  { L: up, R: up, gL: 1, gR: 0, ball: { x: 0, y: 0, scale: 1, opacity: 1 }, bag: 0, arrowL: 0, arrowR: 0 },
  { L: up, R: { x: 34, y: 56, rotate: -40 }, gL: 1, gR: 0, ball: { x: 0, y: 0, scale: 1, opacity: 1 }, bag: 0, arrowL: 1, arrowR: 0 },
  { L: up, R: up, gL: 0, gR: 0, ball: { x: 0, y: -6, scale: 1.4, opacity: 1 }, bag: 0, arrowL: 0, arrowR: 0 },
  { L: { x: -22, y: 0, rotate: 0 }, R: { x: 22, y: 0, rotate: 0 }, gL: 0, gR: 0, ball: { x: 60, y: 84, scale: 1.1, opacity: 1 }, bag: 1, arrowL: 0, arrowR: 0 },
]
const t = { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const }

function Hand({ cx, side, pose, from, glove, gFrom }: { cx: number; side: 1 | -1; pose: Pose; from: Pose; glove: number; gFrom: number }) {
  const g = (v: number) => Math.max(v, 0.2)
  const thumb = { x1: cx + 18 * side, y1: 150, x2: cx + 34 * side, y2: 112 }
  return (
    <motion.g initial={from} animate={pose} transition={t} style={{ originX: 0.5, originY: 1 }}>
      <line x1={cx} y1="262" x2={cx} y2="70" stroke="var(--ink-soft)" strokeWidth="46" strokeLinecap="round" />
      <line {...thumb} stroke="var(--ink-soft)" strokeWidth="16" strokeLinecap="round" />
      <motion.g initial={{ opacity: gFrom > 0 ? 1 : 0 }} animate={{ opacity: glove > 0 ? 1 : 0 }} transition={t}>
        <motion.line {...thumb} stroke="var(--must)" strokeWidth="19" strokeLinecap="round" initial={{ opacity: gFrom === 1 ? 1 : 0 }} animate={{ opacity: glove === 1 ? 1 : 0 }} transition={t} />
        <motion.path d={`M${cx - 26} 168V70a26 26 0 0 1 52 0v98Z`} fill="var(--must)" initial={{ scaleY: g(gFrom) }} animate={{ scaleY: g(glove) }} transition={t} style={{ originY: 0 }} />
        {/* the cuff rolling inside out as it is pulled toward the fingers */}
        <motion.rect x={cx - 28} y="156" width="56" height="14" rx="7" fill="var(--must)" opacity="0.5" initial={{ y: (1 - g(gFrom)) * -112 }} animate={{ y: (1 - g(glove)) * -112 }} transition={t} />
      </motion.g>
    </motion.g>
  )
}

/** Safe glove removal, drawn: `step` 1–5 animates from the previous step's position to this one. */
export function GloveScene({ step }: { step: number }) {
  const [replay, setReplay] = useState(0)
  return (
    <div>
      <Scene key={replay} step={step} />
      <button type="button" onClick={() => setReplay(replay + 1)} className="mt-2 inline-flex items-center gap-2 rounded-chip px-3 py-1.5 text-[0.92rem] ring-2 ring-inset ring-line hover:ring-ink-soft">
        <RotateCcw className="size-4" aria-hidden /> Rivedi il movimento
      </button>
    </div>
  )
}

const labels = [
  '',
  'La mano sinistra, ancora guantata, afferra il guanto destro all’esterno del polso e lo tira verso le dita: il guanto si rivolta.',
  'Il primo guanto, tolto e appallottolato, è chiuso nel pugno della mano sinistra ancora guantata.',
  'Un dito nudo della mano destra entra sotto il bordo del guanto sinistro, tra polso e guanto.',
  'Il secondo guanto si sfila rivoltandosi e racchiude il primo: fuori resta solo il lato pulito.',
  'I due guanti, uno dentro l’altro, finiscono nella busta per rifiuti biologici pericolosi.',
]

function Scene({ step }: { step: number }) {
  const s = states[step]
  const from = states[step - 1]
  return (
    <svg viewBox="0 0 320 250" className="w-full" role="img" aria-label={labels[step]}>
      <Hand cx={100} side={1} pose={s.L} from={from.L} glove={s.gL} gFrom={from.gL} />
      <Hand cx={220} side={-1} pose={s.R} from={from.R} glove={s.gR} gFrom={from.gR} />
      {/* glove turned inside out: the clean inner side shows */}
      <motion.circle cx="100" cy="108" r="22" fill="var(--must-tint)" initial={from.ball} animate={s.ball} transition={t} style={{ originX: 0.5, originY: 0.5 }} />
      <motion.circle cx="100" cy="108" r="10" fill="var(--must)" opacity="0.4" initial={from.ball} animate={s.ball} transition={t} style={{ originX: 0.5, originY: 0.5 }} />
      <motion.g initial={{ opacity: from.bag, y: from.bag ? 0 : 12 }} animate={{ opacity: s.bag, y: s.bag ? 0 : 12 }} transition={t}>
        <path d="M126 176h68l-7 70h-54Z" fill="var(--ink)" />
        <rect x="146" y="166" width="28" height="12" rx="4" fill="var(--ink)" />
        <image href="/img/iso7010/w009-rischio-biologico.svg" x="141" y="196" width="38" height="33" />
      </motion.g>
      <g fill="none" stroke="var(--must)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M270 176v-52m-10 12 10-12 10 12" initial={{ opacity: from.arrowR }} animate={{ opacity: s.arrowR }} transition={t} />
        <motion.path d="M48 176v-52m-10 12 10-12 10 12" initial={{ opacity: from.arrowL }} animate={{ opacity: s.arrowL }} transition={t} />
      </g>
    </svg>
  )
}
