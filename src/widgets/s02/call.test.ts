import { expect, test } from 'vitest'
import { callFeedback, infos, lines } from './call'

const precise = lines.filter((l) => l.covers).map((l) => l.id)

test('every one of the six items has exactly one precise sentence', () => {
  expect(precise).toHaveLength(infos.length)
  expect(new Set(lines.flatMap((l) => (l.covers ? [l.covers] : []))).size).toBe(infos.length)
})

test('all precise sentences make a complete call', () => {
  const f = callFeedback(precise)
  expect(f.complete).toBe(true)
  expect(f.missing).toHaveLength(0)
})

test('a vague sentence does not cover its item and spoils completeness', () => {
  const f = callFeedback(['l3', 'l2'])
  expect(f.covered.has('luogo')).toBe(false)
  expect(f.vague.map((l) => l.id)).toEqual(['l2'])
  expect(f.missing.map((i) => i.id)).toEqual(['luogo', 'dinamica', 'numero', 'condizioni', 'soccorso'])
  expect(callFeedback([...precise, 'l4']).complete).toBe(false)
})

test('an empty call misses everything', () => {
  expect(callFeedback([]).missing).toHaveLength(6)
})
