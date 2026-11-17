/** Clock range (minutes) owned by each step of the anoxia story; null = the step shows no time (the manual gives none). */
export const storyMinutes: ([number, number] | null)[] = [[0, 1], [1, 3], [3, 3], null, null]

/** Minutes since the event for the active story step, eased by scroll progress inside that step. */
export function minuteAt(active: number, progress: number): number | null {
  const i = Math.min(Math.max(active, 0), storyMinutes.length - 1)
  const range = storyMinutes[i]
  if (!range) return null
  const local = Math.min(1, Math.max(0, progress * storyMinutes.length - i))
  return range[0] + (range[1] - range[0]) * local
}

/** Anoxic damage to vital organs: about 10% for every minute since the event (manual p.23). */
export const damageAt = (minutes: number) => Math.round(Math.max(0, minutes) * 10)

/** Whole seconds left in the GAS check, which lasts at most 10 seconds. */
export const gasLeft = (elapsedMs: number) => Math.max(0, Math.ceil(10 - elapsedMs / 1000))

/** Right answers and answered count for a sorting exercise. */
export function tally(given: Record<string, string>, key: { id: string; bin: string }[]) {
  const done = key.filter((k) => k.id in given)
  return { right: done.filter((k) => given[k.id] === k.bin).length, done: done.length, total: key.length }
}
