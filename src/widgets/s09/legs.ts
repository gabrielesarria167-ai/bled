/** Legs are raised for less than 7 minutes. */
export const LEG_LIMIT_MS = 7 * 60_000

export function legClock(ms: number) {
  const s = Math.floor(ms / 1000)
  return { text: `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, near: ms >= LEG_LIMIT_MS - 60_000 && ms < LEG_LIMIT_MS, over: ms >= LEG_LIMIT_MS }
}
