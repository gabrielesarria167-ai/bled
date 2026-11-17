/** How many ids already sit in their correct slot. */
export const inPlace = (given: string[], answer: string[]) => given.filter((id, i) => id === answer[i]).length

/** Swap item i with its neighbour in direction d; a move past either end leaves the list as it is. */
export function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d
  if (j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}
