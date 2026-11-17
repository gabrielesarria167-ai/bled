import { expect, test } from 'vitest'
import { inPlace, move } from './order'

test('counts only the ids in their exact slot', () => {
  expect(inPlace(['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd'])).toBe(4)
  expect(inPlace(['b', 'a', 'c', 'd'], ['a', 'b', 'c', 'd'])).toBe(2)
  expect(inPlace(['d', 'c', 'b', 'a'], ['a', 'b', 'c', 'd'])).toBe(0)
})

test('swaps with the neighbour and ignores moves past the ends', () => {
  const l = ['a', 'b', 'c']
  expect(move(l, 0, 1)).toEqual(['b', 'a', 'c'])
  expect(move(l, 2, -1)).toEqual(['a', 'c', 'b'])
  expect(move(l, 0, -1)).toBe(l)
  expect(move(l, 2, 1)).toBe(l)
  expect(l).toEqual(['a', 'b', 'c'])
})
