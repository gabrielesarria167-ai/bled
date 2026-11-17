import { expect, test } from 'vitest'
import { approach, beatAt, elapsed, judgeDepth, MAX_CM, perfusion, PRESS_TAU } from './timing'

test('30 compressions take 18 s at 100/min and 15 s at 120/min; the 2 ventilations take 5 s', () => {
  expect(elapsed(30, 100)).toBeCloseTo(18)
  expect(elapsed(30, 120)).toBeCloseTo(15)
  expect(elapsed(32, 100) - elapsed(30, 100)).toBeCloseTo(5)
  expect(elapsed(64, 120)).toBeCloseTo(40)
})

test('beats run 30 compressions then 2 ventilations, then a new cycle', () => {
  expect(beatAt(0)).toEqual({ kind: 'compressione', n: 1, cycle: 1 })
  expect(beatAt(29)).toEqual({ kind: 'compressione', n: 30, cycle: 1 })
  expect(beatAt(31)).toEqual({ kind: 'ventilazione', n: 2, cycle: 1 })
  expect(beatAt(32)).toEqual({ kind: 'compressione', n: 1, cycle: 2 })
})

test('perfusion rises with compressions and falls in the pause', () => {
  expect(perfusion(30)).toBe(100)
  expect(perfusion(32)).toBeLessThan(perfusion(30))
  expect(perfusion(40)).toBeGreaterThan(perfusion(32))
})

test('depth verdicts follow the 5–6 cm range, and a steady hold overshoots it', () => {
  expect(judgeDepth(4.9)).toBe('poco')
  expect(judgeDepth(5)).toBe('giusto')
  expect(judgeDepth(6)).toBe('giusto')
  expect(judgeDepth(6.1)).toBe('troppo')
  // about half a second of pressing lands in range, a long hold goes too deep
  expect(judgeDepth(approach(0, MAX_CM, 500, PRESS_TAU))).toBe('giusto')
  expect(judgeDepth(approach(0, MAX_CM, 1500, PRESS_TAU))).toBe('troppo')
})
