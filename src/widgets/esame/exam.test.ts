import { expect, test } from 'vitest'
import type { Question } from '../../lib/quiz'
import { breakdown, drawExam, examPool, sectionOf, shuffle, weakest } from './exam'

const q = (id: string, answer = ['a'], kind?: Question['kind']): Question => ({
  id,
  prompt: id,
  options: [
    { id: 'a', text: 'A' },
    { id: 'b', text: 'B' },
  ],
  answer,
  kind,
  explain: '',
})

test('the pool leaves out the appendices', () => {
  const pool = examPool([[q('s01-q1'), q('s11-q1')], [q('s12-q3'), q('s10-q2')], []])
  expect(pool.map((x) => x.id)).toEqual(['s01-q1', 's10-q2'])
})

test('a seeded shuffle is a reproducible permutation', () => {
  const items = Array.from({ length: 20 }, (_, i) => i)
  expect(shuffle(items, 7)).toEqual(shuffle(items, 7))
  expect(shuffle(items, 7)).not.toEqual(items)
  expect([...shuffle(items, 7)].sort((a, b) => a - b)).toEqual(items)
})

test('a draw covers every section before repeating one', () => {
  const pool = ['01', '05', '10'].flatMap((n) => [1, 2, 3, 4, 5].map((k) => q(`s${n}-q${k}`)))
  const set = drawExam(pool, 3, 42)
  expect(new Set(set.map((x) => x.id.slice(0, 3)))).toEqual(new Set(['s01', 's05', 's10']))
  expect(drawExam(pool, 30, 42)).toHaveLength(15)
  expect(new Set(drawExam(pool, 30, 42).map((x) => x.id)).size).toBe(15)
  expect(drawExam([], 30, 1)).toEqual([])
})

test('ids map to course sections', () => {
  expect(sectionOf('s05-q2')?.slug).toBe('rcp')
  expect(sectionOf('s00-q1')?.slug).toBe('introduzione')
  expect(sectionOf('x-1')).toBeUndefined()
})

test('breakdown scores each section, including multi and order questions', () => {
  const set = [q('s05-q1'), q('s05-q2'), q('s10-q1', ['a', 'b'], 'multi'), q('s02-q1', ['b', 'a'], 'order'), q('s02-q2')]
  const rows = breakdown(set, { 's05-q1': ['a'], 's05-q2': ['b'], 's10-q1': ['b', 'a'], 's02-q1': ['a', 'b'], 's02-q2': ['a'] })
  expect(rows.map((r) => [r.section.slug, r.score, r.total])).toEqual([
    ['catena', 1, 2],
    ['rcp', 1, 2],
    ['dae', 1, 1],
  ])
  expect(weakest(rows).map((r) => r.section.slug)).toEqual(['catena', 'rcp'])
})
