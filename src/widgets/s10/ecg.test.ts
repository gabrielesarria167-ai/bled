import { expect, test } from 'vitest'
import { LOOP, sample, tracePath, type Rhythm } from './ecg'

const all: Rhythm[] = ['rs', 'fv', 'tvsp', 'aesp', 'asistolia', 'atriali', 'bav']

test('every trace ends where it starts, so the scrolling loop has no seam', () => {
  for (const r of all) expect(sample(r, LOOP)).toBeCloseTo(sample(r, 0), 6)
})

test('asystole is nearly flat, VF and VT are large', () => {
  const peak = (r: Rhythm) => Math.max(...Array.from({ length: 600 }, (_, i) => Math.abs(sample(r, i / 100))))
  expect(peak('asistolia')).toBeLessThan(0.05)
  expect(peak('fv')).toBeGreaterThan(0.4)
  expect(peak('tvsp')).toBeGreaterThan(0.6)
  expect(peak('aesp')).toBeLessThan(peak('rs'))
})

test('the path is a single polyline', () => {
  expect(tracePath('rs').startsWith('M0.0 ')).toBe(true)
})
