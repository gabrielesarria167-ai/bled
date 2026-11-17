import { expect, test } from 'vitest'
import { damageAt, gasLeft, minuteAt, tally } from './logic'

test('story clock stays inside the range of the active step', () => {
  expect(minuteAt(0, 0)).toBe(0)
  expect(minuteAt(0, 0.9)).toBe(1) // progress far ahead is clamped to the step's end
  expect(minuteAt(1, 0)).toBe(1)
  expect(minuteAt(2, 0.5)).toBe(3)
  expect(minuteAt(3, 0.7)).toBeNull()
  expect(minuteAt(9, 1)).toBeNull()
})

test('damage grows about 10% per minute', () => {
  expect(damageAt(0)).toBe(0)
  expect(damageAt(3)).toBe(30)
  expect(damageAt(-1)).toBe(0)
})

test('GAS check counts down 10 seconds and stops at zero', () => {
  expect(gasLeft(0)).toBe(10)
  expect(gasLeft(100)).toBe(10)
  expect(gasLeft(9001)).toBe(1)
  expect(gasLeft(10000)).toBe(0)
  expect(gasLeft(15000)).toBe(0)
})

test('tally counts only answered items', () => {
  const key = [
    { id: 'a', bin: 'vero' },
    { id: 'b', bin: 'falso' },
    { id: 'c', bin: 'vero' },
  ]
  expect(tally({}, key)).toEqual({ right: 0, done: 0, total: 3 })
  expect(tally({ a: 'vero', b: 'vero' }, key)).toEqual({ right: 1, done: 2, total: 3 })
})
