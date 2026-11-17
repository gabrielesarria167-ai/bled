import { expect, test } from 'vitest'
import { tempoFromTaps } from './RhythmTrainer'

test('needs four taps before reading a tempo', () => {
  expect(tempoFromTaps([0, 500, 1000])).toBeNull()
})

test('reads 120 per minute from 500 ms gaps and ignores one late tap', () => {
  expect(tempoFromTaps([0, 500, 1000, 1500, 2000])).toBe(120)
  expect(tempoFromTaps([0, 500, 1000, 1900, 2400, 2900])).toBe(120)
})
