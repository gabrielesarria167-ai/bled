import { motion, useReducedMotion } from 'motion/react'

type Pt = readonly [number, number]
type Limb = readonly [Pt, Pt, Pt]
type Part = 'testa' | 'tronco' | 'braccioLontano' | 'braccioVicino' | 'gambaLontana' | 'gambaVicina' | 'occhiali' | 'soccorritore' | 'respiro'
type Rescuer = { head: Pt; sh: readonly [Pt, Pt]; hands: readonly [Pt, Pt] }
type Pose = {
  head: Pt
  torso: readonly [Pt, Pt]
  /** Torso width seen from above: wide on the back, narrow on the side. */
  tw: number
  farArm: Limb
  nearArm: Limb
  farLeg: Limb
  nearLeg: Limb
  /** null while the glasses are still on the face */
  glasses: Pt | null
  res: Rescuer | null
  active: Part[]
}

// Seen from above: head on the left, feet on the right, the rescuer kneels at the bottom edge.
const crooked = {
  head: [62, 104],
  torso: [[112, 112], [192, 124]],
  tw: 54,
  farArm: [[106, 74], [150, 68], [194, 72]],
  nearArm: [[102, 148], [146, 156], [188, 166]],
  farLeg: [[214, 116], [282, 120], [348, 126]],
  nearLeg: [[212, 136], [266, 162], [326, 150]],
} as const
const aligned = {
  head: [60, 120],
  torso: [[112, 120], [192, 120]],
  tw: 54,
  farArm: [[104, 84], [150, 82], [196, 84]],
  nearArm: [[104, 156], [150, 158], [196, 156]],
  farLeg: [[214, 110], [284, 109], [350, 108]],
  nearLeg: [[214, 130], [284, 131], [350, 132]],
} as const
const kneel: Rescuer = { head: [176, 262], sh: [[136, 276], [216, 276]], hands: [[104, 234], [196, 240]] }
const reach: Rescuer = { head: [180, 254], sh: [[140, 268], [220, 268]], hands: [[78, 152], [258, 98]] }
const onSide = {
  head: [58, 142],
  torso: [[112, 140], [190, 140]],
  tw: 36,
  farArm: [[110, 130], [140, 178], [70, 158]],
  nearArm: [[102, 150], [102, 196], [102, 240]],
  farLeg: [[212, 134], [246, 176], [298, 160]],
  nearLeg: [[212, 146], [282, 148], [348, 148]],
} as const
const aside: Pt = [34, 244]
const rightAngleArm: Limb = [[104, 156], [104, 200], [104, 240]]
const handOnCheek: Limb = [[104, 84], [124, 130], [74, 142]]
const kneeUp: Limb = [[214, 110], [258, 90], [300, 112]]
const legSquare: Limb = [[212, 134], [212, 196], [278, 196]]

/** Index 0 is the starting situation; index n is the pose after step n of the manual's 11-step sequence. */
export const poses: Pose[] = [
  { ...crooked, glasses: null, res: null, active: [] },
  { ...crooked, glasses: aside, res: null, active: ['occhiali'] },
  { ...crooked, nearLeg: [[212, 136], [280, 142], [346, 148]], glasses: aside, res: null, active: ['gambaLontana', 'gambaVicina'] },
  { ...aligned, glasses: aside, res: null, active: ['testa', 'tronco', 'braccioLontano', 'braccioVicino', 'gambaLontana', 'gambaVicina'] },
  { ...aligned, nearArm: rightAngleArm, glasses: aside, res: kneel, active: ['braccioVicino', 'soccorritore'] },
  { ...aligned, nearArm: rightAngleArm, farArm: handOnCheek, glasses: aside, res: { ...kneel, hands: [[78, 152], [196, 240]] }, active: ['braccioLontano'] },
  { ...aligned, nearArm: rightAngleArm, farArm: handOnCheek, farLeg: kneeUp, glasses: aside, res: reach, active: ['gambaLontana'] },
  { ...onSide, glasses: aside, res: { ...kneel, hands: [[70, 166], [246, 186]] }, active: ['testa', 'tronco', 'braccioLontano', 'braccioVicino', 'gambaLontana', 'gambaVicina'] },
  { ...onSide, farLeg: legSquare, glasses: aside, res: { ...kneel, hands: [[70, 166], [216, 204]] }, active: ['gambaLontana'] },
  { ...onSide, head: [50, 134], farLeg: legSquare, glasses: aside, res: { ...kneel, hands: [[40, 124], [216, 204]] }, active: ['testa'] },
  { ...onSide, head: [50, 134], farLeg: legSquare, farArm: [[110, 130], [140, 178], [60, 152]], glasses: aside, res: { ...kneel, hands: [[66, 164], [216, 204]] }, active: ['braccioLontano'] },
  { ...onSide, head: [50, 134], farLeg: legSquare, farArm: [[110, 130], [140, 178], [60, 152]], glasses: aside, res: { ...kneel, hands: [[124, 238], [200, 238]] }, active: ['respiro', 'soccorritore'] },
]

const tones = {
  light: { body: 'var(--ink)', active: 'var(--must)', res: 'var(--ink-soft)', floor: 'var(--panel-2)' },
  well: { body: 'var(--well-ink)', active: 'var(--lume)', res: 'var(--well-soft)', floor: 'var(--well-2)' },
}

const line = (...pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')

/**
 * The recovery position as a sign pictogram seen from above. Changing `step` moves head, trunk and limbs
 * to the next pose; the part that moves in that step is drawn in the action colour.
 */
export function PlsFigure({ step, tone = 'light', rescuer = true, label, className = '' }: { step: number; tone?: keyof typeof tones; rescuer?: boolean; label: string; className?: string }) {
  const p = poses[Math.max(0, Math.min(poses.length - 1, step))]
  const c = tones[tone]
  const reduce = useReducedMotion()
  const t = { duration: reduce ? 0 : 0.6, ease: [0.23, 1, 0.32, 1] as const }
  const col = (part: Part, base = c.body) => (p.active.includes(part) && rescuer ? c.active : base)
  const res = p.res ?? kneel
  const showRes = rescuer && !!p.res
  const limb = (part: Part, pts: Limb, w: number, knockout = false) => (
    <g key={part}>
      {knockout && <motion.path initial={false} animate={{ d: line(...pts) }} transition={t} fill="none" stroke={c.floor} strokeWidth={w + 7} strokeLinecap="round" strokeLinejoin="round" />}
      <motion.path initial={false} animate={{ d: line(...pts) }} transition={t} fill="none" style={{ stroke: col(part) }} className="transition-[stroke] duration-200" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
  const g = p.glasses ?? p.head

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className={`block h-auto w-full ${className}`}>
      <rect width="400" height="300" rx="12" fill={c.floor} />
      {limb('braccioVicino', p.nearArm, 13)}
      {limb('gambaVicina', p.nearLeg, 17)}
      {limb('gambaLontana', p.farLeg, 17, true)}
      <motion.line
        initial={false}
        animate={{ x1: p.torso[0][0], y1: p.torso[0][1], x2: p.torso[1][0], y2: p.torso[1][1], strokeWidth: p.tw }}
        transition={t}
        strokeLinecap="round"
        style={{ stroke: col('tronco') }}
        className="transition-[stroke] duration-200"
      />
      {limb('braccioLontano', p.farArm, 13, true)}
      <motion.circle initial={false} animate={{ cx: p.head[0], cy: p.head[1] }} transition={t} r="23" fill={c.floor} />
      <motion.circle initial={false} animate={{ cx: p.head[0], cy: p.head[1] }} transition={t} r="19" style={{ fill: col('testa') }} className="transition-[fill] duration-200" />

      <motion.g initial={false} animate={{ x: g[0], y: g[1] }} transition={t} opacity={rescuer || !p.glasses ? 1 : 0}>
        <g style={{ fill: p.glasses ? col('occhiali', c.res) : c.floor }} className="transition-[fill] duration-200">
          <circle cx="-4" cy="-7" r="5.5" />
          <circle cx="-4" cy="7" r="5.5" />
          <rect x="-5.5" y="-2" width="3" height="4" />
        </g>
      </motion.g>

      {p.active.includes('respiro') && rescuer && (
        <g fill="none" stroke={c.active} strokeWidth="4" strokeLinecap="round">
          {[12, 22].map((r, i) => (
            <motion.path key={r} d={`M${38 - r * 0.2} ${150 + r} A${r} ${r} 0 0 1 ${38 - r} ${150 + r * 0.2}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, delay: i * 0.3, repeat: reduce ? 0 : Infinity, ease: 'easeOut' }} />
          ))}
        </g>
      )}

      {rescuer && (
        <motion.g initial={false} animate={{ opacity: showRes ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.3 }} aria-hidden>
          {res.sh.map((s, i) => (
            <g key={i}>
              <motion.path initial={false} animate={{ d: line(s, res.hands[i]) }} transition={t} fill="none" stroke={c.floor} strokeWidth="19" strokeLinecap="round" />
              <motion.path initial={false} animate={{ d: line(s, res.hands[i]) }} transition={t} fill="none" style={{ stroke: col('soccorritore', c.res) }} className="transition-[stroke] duration-200" strokeWidth="12" strokeLinecap="round" />
            </g>
          ))}
          <motion.line initial={false} animate={{ x1: res.sh[0][0], y1: res.sh[0][1], x2: res.sh[1][0], y2: res.sh[1][1] }} transition={t} strokeWidth="24" strokeLinecap="round" style={{ stroke: col('soccorritore', c.res) }} className="transition-[stroke] duration-200" />
          <motion.circle initial={false} animate={{ cx: res.head[0], cy: res.head[1] }} transition={t} r="20" fill={c.floor} />
          <motion.circle initial={false} animate={{ cx: res.head[0], cy: res.head[1] }} transition={t} r="16" style={{ fill: col('soccorritore', c.res) }} className="transition-[fill] duration-200" />
        </motion.g>
      )}
    </svg>
  )
}
