import { expect, test } from 'vitest'
import { scrambled, tapStep, type OrderState } from './PlsOrder'

test('scrambled is a permutation and never the solved order', () => {
  let k = 0
  const fixed = () => (k++ < 10 ? 0.999 : 0.1) // first pass of 10 swaps keeps identity, forcing a retry
  for (const rnd of [Math.random, fixed]) {
    const a = scrambled(11, rnd)
    expect([...a].sort((x, y) => x - y)).toEqual([...Array(11).keys()])
    expect(a.every((v, i) => v === i)).toBe(false)
  }
})

test('only the next step is placed; a wrong tap counts an error and places nothing', () => {
  let s: OrderState = { pool: [2, 0, 1], placed: [], errors: 0, wrong: null }
  s = tapStep(s, 2)
  expect(s).toEqual({ pool: [2, 0, 1], placed: [], errors: 1, wrong: 2 })
  s = tapStep(s, 0)
  s = tapStep(s, 1)
  s = tapStep(s, 2)
  expect(s).toEqual({ pool: [], placed: [0, 1, 2], errors: 1, wrong: null })
  expect(tapStep(s, 1)).toBe(s) // already placed: ignored
})
