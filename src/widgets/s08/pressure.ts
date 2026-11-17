/** State machine for the direct-pressure trainer: gloves, gauze, press, soaked dressing, more gauze, press, bandage. */
export type Phase = 'guanti' | 'garza' | 'premi' | 'intriso' | 'premi2' | 'benda' | 'fatto'
export type Msg = 'inizio' | 'prima-guanti' | 'guanti-ok' | 'prima-garza' | 'garza-ok' | 'premi' | 'lasciato' | 'intriso' | 'decidi' | 'non-togliere' | 'aggiunto' | 'fermata' | 'fatto'
export type State = { phase: Phase; hold: number; pressing: boolean; layers: number; errors: number; msg: Msg }
export type Action = { type: 'guanti' | 'garza' | 'press' | 'release' | 'togli' | 'aggiungi' | 'benda' | 'reset' } | { type: 'tick'; dt: number }

/** Share of the hold at which blood soaks through the first dressing. */
export const SOAK_AT = 0.5
// shortcut: simulated pressing time (ms) to control the bleed; a game pace, not a figure from the manual.
export const FILL_MS = 9000
const DECAY = 0.6

export const initial: State = { phase: 'guanti', hold: 0, pressing: false, layers: 0, errors: 0, msg: 'inizio' }

export function reduce(s: State, a: Action): State {
  switch (a.type) {
    case 'reset':
      return initial
    case 'guanti':
      return s.phase === 'guanti' ? { ...s, phase: 'garza', msg: 'guanti-ok' } : s
    case 'garza':
      if (s.phase === 'guanti') return { ...s, errors: s.errors + 1, msg: 'prima-guanti' }
      return s.phase === 'garza' ? { ...s, phase: 'premi', layers: 1, msg: 'garza-ok' } : s
    case 'press':
      if (s.phase === 'guanti') return { ...s, errors: s.errors + 1, msg: 'prima-guanti' }
      if (s.phase === 'garza') return { ...s, errors: s.errors + 1, msg: 'prima-garza' }
      if (s.phase === 'intriso') return { ...s, msg: 'decidi' }
      return s.phase === 'premi' || s.phase === 'premi2' ? { ...s, pressing: true, msg: 'premi' } : s
    case 'release':
      return s.pressing ? { ...s, pressing: false, msg: 'lasciato' } : s
    case 'tick': {
      if (s.phase !== 'premi' && s.phase !== 'premi2') return s
      const floor = s.phase === 'premi2' ? SOAK_AT : 0
      const step = a.dt / FILL_MS
      const hold = s.pressing ? s.hold + step : Math.max(floor, s.hold - step * DECAY)
      if (s.phase === 'premi' && hold >= SOAK_AT) return { ...s, phase: 'intriso', hold: SOAK_AT, pressing: false, msg: 'intriso' }
      if (s.phase === 'premi2' && hold >= 1) return { ...s, phase: 'benda', hold: 1, pressing: false, msg: 'fermata' }
      return hold === s.hold ? s : { ...s, hold }
    }
    case 'togli':
      return s.phase === 'intriso' ? { ...s, errors: s.errors + 1, msg: 'non-togliere' } : s
    case 'aggiungi':
      return s.phase === 'intriso' ? { ...s, phase: 'premi2', layers: 2, msg: 'aggiunto' } : s
    case 'benda':
      return s.phase === 'benda' ? { ...s, phase: 'fatto', msg: 'fatto' } : s
  }
}

/** How fast the wound bleeds in each phase, 0..1, for the drawing. */
export function bleedRate(s: State): number {
  if (s.phase === 'guanti' || s.phase === 'garza') return 1
  if (s.phase === 'premi') return s.pressing ? 0.6 - s.hold : 1
  if (s.phase === 'intriso') return 0.35
  if (s.phase === 'premi2') return s.pressing ? Math.max(0, 1 - s.hold) * 0.5 : 0.6
  return 0
}
