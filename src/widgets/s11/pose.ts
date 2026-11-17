/** Body proportions of the pictogram person, in SVG units (standing height about 100). */
export const L = { torso: 32.5, shoulder: 28, neck: 2.5, head: 7, upper: 19, fore: 19, thigh: 23, shin: 23 }

/** A limb is either a target point for its tip (with the side the joint bends to) or two absolute angles in degrees. */
export type Limb = [x: number, y: number, bend?: 1 | -1] | { a: [number, number] }
/** Hip position, torso angle (deg, -90 = upright, 180/-180 = head to the left), optional head angle and the four limbs. */
export type Pose = { x: number; y: number; t: number; h?: number; aN: Limb; aF: Limb; lN: Limb; lF: Limb }
export type LimbKey = 'aN' | 'aF' | 'lN' | 'lF'

const deg = 180 / Math.PI

/** Wrap an angle to [-180, 180) so a joint never spins the long way round between two poses. */
export const norm = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180

/** Two-bone IK: absolute angles (deg) of the upper and lower bone so the tip reaches the target, or points at it when out of reach. */
export function ik(bx: number, by: number, tx: number, ty: number, l1: number, l2: number, bend: 1 | -1 = 1): [number, number] {
  const d = Math.min(Math.max(Math.hypot(tx - bx, ty - by), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01)
  const alpha = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))
  const u = Math.atan2(ty - by, tx - bx) - bend * alpha
  const ex = bx + l1 * Math.cos(u)
  const ey = by + l1 * Math.sin(u)
  return [u * deg, Math.atan2(ty - ey, tx - ex) * deg]
}

export function limbAngles(p: Pose): Record<LimbKey, [number, number]> {
  const sx = p.x + L.shoulder * Math.cos(p.t / deg)
  const sy = p.y + L.shoulder * Math.sin(p.t / deg)
  const solve = (l: Limb, bx: number, by: number, l1: number, l2: number): [number, number] => ('a' in l ? l.a : ik(bx, by, l[0], l[1], l1, l2, l[2]))
  return {
    aN: solve(p.aN, sx, sy, L.upper, L.fore),
    aF: solve(p.aF, sx, sy, L.upper, L.fore),
    lN: solve(p.lN, p.x, p.y, L.thigh, L.shin),
    lF: solve(p.lF, p.x, p.y, L.thigh, L.shin),
  }
}

/** The same pose moved sideways (hip and every target point). */
export function shift(p: Pose, dx: number): Pose {
  const m = (l: Limb): Limb => ('a' in l ? l : [l[0] + dx, l[1], l[2]])
  return { ...p, x: p.x + dx, aN: m(p.aN), aF: m(p.aF), lN: m(p.lN), lF: m(p.lF) }
}
