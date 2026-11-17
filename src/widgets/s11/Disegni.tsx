import { Ground, Person, tone } from './Person'
import type { Pose } from './pose'

/** Rescuer kneeling behind the head of a supine victim, hands on both sides of the head. */
export function TestaStabilizzata() {
  const v: Pose = { x: 160, y: 128.5, t: -180, h: -180, aN: { a: [5, 0] }, aF: { a: [3, 0] }, lN: [206, 131.5, 1], lF: [205, 131.5, 1] }
  const r: Pose = { x: 84, y: 114, t: -40, h: -35, aN: [116, 126, -1], aF: [119, 124, -1], lN: [76, 131.5, 1], lF: [78, 131.5, 1] }
  return (
    <svg viewBox="58 64 164 82" role="img" aria-label="Soccorritore inginocchiato dietro la testa della vittima supina, con le mani ai due lati del capo per tenerlo fermo" className="h-auto w-full">
      <Ground />
      <Person pose={r} color={tone.r} far={tone.rFar} parts={['lF', 'body', 'lN', 'aF']} />
      <Person pose={v} color={tone.v} far={tone.vFar} />
      <Person pose={r} color={tone.r} far={tone.rFar} parts={['aN']} />
    </svg>
  )
}
