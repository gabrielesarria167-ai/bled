/** Illustrative ECG traces. Every waveform repeats exactly after LOOP seconds, so two copies side by side scroll forever. */

export type Rhythm = 'rs' | 'fv' | 'tvsp' | 'aesp' | 'asistolia' | 'atriali' | 'bav'

export const LOOP = 6 // seconds
export const PX = 100 // stage units per second
export const WIDTH = LOOP * PX
export const HEIGHT = 120
const BASE = 72
const SCALE = 46
const STEP = 0.004

const g = (t: number, c: number, w: number, a: number) => a * Math.exp(-((t - c) ** 2) / (2 * w * w))
/** k whole cycles per loop: seamless by construction. */
const wave = (t: number, k: number, phase = 0) => Math.sin((2 * Math.PI * k * t) / LOOP + phase)
const qrs = (t: number, c: number, amp = 1, wide = 1) => amp * (g(t, c - 0.02 * wide, 0.008 * wide, -0.12) + g(t, c, 0.011 * wide, 1) + g(t, c + 0.022 * wide, 0.01 * wide, -0.26))
/** Beats at fixed times inside the loop; the window wraps so a beat near the end continues at the start. */
const beats = (t: number, at: number[], shape: (dt: number) => number) => at.reduce((v, c) => v + shape(t - c) + shape(t - c - LOOP) + shape(t - c + LOOP), 0)
const even = (n: number, offset = 0.2) => Array.from({ length: n }, (_, i) => offset + (i * LOOP) / n)

const pqrst = (dt: number) => g(dt, -0.12, 0.025, 0.12) + qrs(dt, 0) + g(dt, 0.2, 0.045, 0.28)
const escape = (dt: number) => qrs(dt, 0, 0.95, 1.3) + g(dt, 0.24, 0.05, 0.26)

export function sample(r: Rhythm | null, t: number): number {
  switch (r) {
    case 'rs':
      return beats(t, even(7), pqrst)
    case 'fv':
      return (0.7 + 0.3 * wave(t, 2)) * (0.34 * wave(t, 29) + 0.24 * wave(t, 37, 1.3) + 0.18 * wave(t, 23, 2.1) + 0.12 * wave(t, 47, 0.4))
    case 'tvsp':
      return 0.82 * wave(t, 18) + 0.2 * wave(t, 36, 1)
    case 'aesp':
      return beats(t, even(4), (dt) => qrs(dt, 0, 0.28, 2.6) + g(dt, 0.3, 0.07, 0.06))
    case 'asistolia':
      return 0.025 * wave(t, 1) + 0.012 * wave(t, 3, 1)
    case 'atriali':
      return 0.05 * wave(t, 37) + 0.04 * wave(t, 43, 1) + 0.03 * wave(t, 53, 2) + beats(t, [0.35, 1.05, 1.55, 2.45, 3.0, 3.85, 4.6, 5.3], (dt) => qrs(dt, 0) + g(dt, 0.2, 0.045, 0.22))
    case 'bav':
      return beats(t, even(4), escape)
    default:
      return 0
  }
}

/** Movement artefacts: large baseline wander plus jitter. */
const artefact = (t: number) => 0.55 * wave(t, 3) + 0.3 * wave(t, 7, 1) + 0.16 * wave(t, 41, 2) + 0.1 * wave(t, 67)

/** SVG path for one loop (WIDTH units wide). */
export function tracePath(r: Rhythm | null, withArtefact = false): string {
  const pts: string[] = []
  for (let i = 0; i <= LOOP / STEP; i++) {
    const t = i * STEP
    const v = sample(r, t) + (withArtefact ? artefact(t) : 0)
    pts.push(`${(t * PX).toFixed(1)} ${(BASE - v * SCALE).toFixed(1)}`)
  }
  return `M${pts.join('L')}`
}
