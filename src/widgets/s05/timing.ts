/** Timing of the 30:2 cycle and the depth trainer's physics: pure, so the numbers shown can be tested. */

export const PER_CYCLE = 32 // 30 compressions + 2 ventilations
/** One ventilation slot: about 1 s of insufflation plus the time for the chest to fall; two fill the 5 s pause. */
export const VENT_S = 2.5

export type Beat = { kind: 'compressione' | 'ventilazione'; n: number; cycle: number }

/** The i-th beat (0-based) of an endless 30:2 sequence. */
export function beatAt(i: number): Beat {
  const k = i % PER_CYCLE
  return k < 30 ? { kind: 'compressione', n: k + 1, cycle: Math.floor(i / PER_CYCLE) + 1 } : { kind: 'ventilazione', n: k - 29, cycle: Math.floor(i / PER_CYCLE) + 1 }
}

/** Seconds elapsed once `beats` beats are complete, at `rate` compressions per minute. */
export function elapsed(beats: number, rate: number): number {
  const full = Math.floor(beats / PER_CYCLE)
  const k = beats % PER_CYCLE
  const c = 60 / rate
  return full * (30 * c + 2 * VENT_S) + Math.min(k, 30) * c + Math.max(0, k - 30) * VENT_S
}

/** Schematic perfusion 0–100 after `beats`: each compression pushes it up, each ventilation pause lets it fall. */
export function perfusion(beats: number): number {
  let p = 0
  for (let i = 0; i < beats; i++) p = beatAt(i).kind === 'compressione' ? Math.min(100, p + 5) : Math.max(0, p - 22)
  return p
}

// Depth trainer: holding pushes the chest towards MAX_CM, letting go springs it back.
export const MAX_CM = 7.5
export const PRESS_TAU = 400
export const RELEASE_TAU = 70
/** Below this the chest counts as fully back up. */
export const RELEASED_CM = 0.3

/** Exponential approach from `d` towards `target` over `dt` ms. */
export const approach = (d: number, target: number, dt: number, tau: number) => target + (d - target) * Math.exp(-dt / tau)

export type DepthVerdict = 'poco' | 'giusto' | 'troppo'
export const judgeDepth = (maxCm: number): DepthVerdict => (maxCm < 5 ? 'poco' : maxCm > 6 ? 'troppo' : 'giusto')
