import { expect, test } from 'vitest'
import { isCorrect, passed, scoreQuiz, type Question } from './quiz'

const q = (over: Partial<Question>): Question => ({
  id: 'q', prompt: '', options: ['a', 'b', 'c', 'd'].map((id) => ({ id, text: id })), answer: ['a'], explain: '', ...over,
})

test('single answer', () => {
  expect(isCorrect(q({}), ['a'])).toBe(true)
  expect(isCorrect(q({}), ['b'])).toBe(false)
  expect(isCorrect(q({}), undefined)).toBe(false)
})

test('multi answer needs exactly the correct set, in any order', () => {
  const m = q({ kind: 'multi', answer: ['a', 'b', 'd'] })
  expect(isCorrect(m, ['d', 'a', 'b'])).toBe(true)
  expect(isCorrect(m, ['a', 'b'])).toBe(false)
  expect(isCorrect(m, ['a', 'b', 'c'])).toBe(false)
})

test('order answer needs the exact sequence', () => {
  const o = q({ kind: 'order', answer: ['b', 'a', 'd', 'c'] })
  expect(isCorrect(o, ['b', 'a', 'd', 'c'])).toBe(true)
  expect(isCorrect(o, ['a', 'b', 'd', 'c'])).toBe(false)
})

test('score and pass threshold', () => {
  const qs = [q({ id: '1' }), q({ id: '2', answer: ['c'] }), q({ id: '3' }), q({ id: '4' }), q({ id: '5' })]
  const r = scoreQuiz(qs, { 1: ['a'], 2: ['c'], 3: ['a'], 4: ['a'], 5: ['b'] })
  expect(r).toEqual({ score: 4, total: 5 })
  expect(passed(4, 5)).toBe(true)
  expect(passed(3, 5)).toBe(false)
  expect(passed(0, 0)).toBe(false)
})
