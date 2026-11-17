import type { ReactNode } from 'react'
import { L, limbAngles, norm, type LimbKey, type Pose } from './pose'

export type Part = LimbKey | 'body'
const ALL: Part[] = ['aF', 'lF', 'body', 'lN', 'aN']
// Each joint is a nested <g> rotated with a CSS transition, so a change of pose morphs joint by joint.
const move = 'transition-transform duration-700 ease-in-out'

/** Pictogram person in the ISO 7010 grammar: round head, rounded bars for limbs, far limbs in a lighter tone. */
export function Person({ pose, color, far, parts = ALL }: { pose: Pose; color: string; far: string; parts?: Part[] }) {
  const { x, y, t } = pose
  const a = limbAngles(pose)
  return (
    <g className={move} style={{ transform: `translate(${x}px, ${y}px) rotate(${t}deg)` }}>
      {parts.map((p) => {
        if (p === 'body')
          return (
            <g key="body">
              <line x1={4} x2={25} stroke={color} strokeWidth={15} strokeLinecap="round" />
              <g transform={`translate(${L.torso} 0)`}>
                <g className={move} style={{ transform: `rotate(${norm((pose.h ?? t) - t)}deg)` }}>
                  <circle cx={L.neck + L.head} r={L.head} fill={color} />
                </g>
              </g>
            </g>
          )
        const arm = p[0] === 'a'
        const c = p[1] === 'F' ? far : color
        const [u, f] = a[p]
        // Limbs are measured from "down the torso" (rotate 180), so hanging arms and straight legs sit at 0, far from the wrap point.
        return (
          <g key={p} transform={`${arm ? `translate(${L.shoulder} 0) ` : ''}rotate(180)`}>
            <Bar a={norm(u - t - 180)} len={arm ? L.upper : L.thigh} w={arm ? 7 : 9} c={c}>
              <Bar a={norm(f - u)} len={arm ? L.fore : L.shin} w={arm ? 7 : 9} c={c} />
            </Bar>
          </g>
        )
      })}
    </g>
  )
}

function Bar({ a, len, w, c, children }: { a: number; len: number; w: number; c: string; children?: ReactNode }) {
  return (
    <g className={move} style={{ transform: `rotate(${a}deg)` }}>
      <line x2={len} stroke={c} strokeWidth={w} strokeLinecap="round" />
      {children && <g transform={`translate(${len} 0)`}>{children}</g>}
    </g>
  )
}

/** Token colours: the rescuer in blue (the action), the victim in neutral ink. */
export const tone = {
  r: 'var(--must)',
  rFar: 'color-mix(in oklab, var(--must) 50%, var(--panel))',
  v: 'var(--ink-soft)',
  vFar: 'color-mix(in oklab, var(--ink-soft) 50%, var(--panel))',
}

export const GROUND = 136

export function Ground({ w = 260 }: { w?: number }) {
  return <rect x={0} y={GROUND} width={w} height={3} rx={1.5} fill="var(--line)" />
}
