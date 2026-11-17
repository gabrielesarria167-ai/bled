import { expect, test } from 'vitest'
import { FILL_MS, SOAK_AT, initial, reduce, type Action, type State } from './pressure'

const run = (s: State, ...as: Action[]) => as.reduce(reduce, s)
const hold = (s: State, ms: number) => {
  let x = reduce(s, { type: 'press' })
  for (let t = 0; t < ms; t += 100) x = reduce(x, { type: 'tick', dt: 100 })
  return x
}

test('pressing or adding gauze before gloves is an error and changes nothing else', () => {
  const s = run(initial, { type: 'press' }, { type: 'garza' })
  expect(s.phase).toBe('guanti')
  expect(s.errors).toBe(2)
  expect(s.msg).toBe('prima-guanti')
})

test('pressing without gauze is an error', () => {
  const s = run(initial, { type: 'guanti' }, { type: 'press' })
  expect(s.phase).toBe('garza')
  expect(s.msg).toBe('prima-garza')
})

test('blood soaks through at half the hold, removing the dressing is refused, adding one continues', () => {
  let s = run(initial, { type: 'guanti' }, { type: 'garza' })
  s = hold(s, FILL_MS * SOAK_AT + 200)
  expect(s.phase).toBe('intriso')
  expect(s.pressing).toBe(false)
  s = reduce(s, { type: 'togli' })
  expect(s).toMatchObject({ phase: 'intriso', layers: 1, errors: 1, msg: 'non-togliere' })
  s = reduce(s, { type: 'aggiungi' })
  expect(s).toMatchObject({ phase: 'premi2', layers: 2 })
  s = hold(s, FILL_MS * (1 - SOAK_AT) + 200)
  expect(s.phase).toBe('benda')
  expect(run(s, { type: 'benda' }).phase).toBe('fatto')
})

test('letting go decays the hold, but never below the soak point once more gauze is on', () => {
  let s = run(initial, { type: 'guanti' }, { type: 'garza' })
  s = hold(s, 2000)
  const before = s.hold
  s = run(s, { type: 'release' }, { type: 'tick', dt: 1000 })
  expect(s.msg).toBe('lasciato')
  expect(s.hold).toBeLessThan(before)
  s = hold(s, FILL_MS)
  s = run(s, { type: 'aggiungi' }, { type: 'release' }, { type: 'tick', dt: 60000 })
  expect(s.hold).toBe(SOAK_AT)
})
