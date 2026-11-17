import { expect, test } from 'vitest'
import { legClock } from './legs'
import { checkSigns, signItems } from './signs'

test('the list holds the nine signs of the manual', () => {
  expect(signItems.filter((i) => i.sign)).toHaveLength(9)
  expect(new Set(signItems.map((i) => i.id)).size).toBe(signItems.length)
})

test('counts found signs and wrong picks separately', () => {
  expect(checkSigns(signItems, ['ansia', 'sete', 'polso-lento'])).toEqual({ total: 9, found: 2, wrong: 1 })
  expect(checkSigns(signItems, signItems.filter((i) => i.sign).map((i) => i.id))).toEqual({ total: 9, found: 9, wrong: 0 })
})

test('leg timer warns in the last minute and marks the 7-minute limit', () => {
  expect(legClock(0)).toEqual({ text: '0:00', near: false, over: false })
  expect(legClock(6 * 60_000 + 59_900)).toEqual({ text: '6:59', near: true, over: false })
  expect(legClock(7 * 60_000)).toMatchObject({ text: '7:00', over: true })
})
