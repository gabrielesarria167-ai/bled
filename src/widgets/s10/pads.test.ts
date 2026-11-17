import { expect, test } from 'vitest'
import { GENERIC, judge } from './pads'

test('the right electrode under the right clavicle is accepted within a few centimetres', () => {
  expect(judge('uomo', 130, 124)).toMatchObject({ ok: true, target: 'R' })
  expect(judge('uomo', 145, 135)).toMatchObject({ ok: true, target: 'R' })
})

test('the mirrored position (under the left clavicle) is wrong and explains right/left', () => {
  const v = judge('uomo', 190, 124)
  expect(v.ok).toBe(false)
  expect(v.why).toMatch(/quelle della vittima/)
})

test('two electrodes cannot share a position', () => {
  expect(judge('uomo', 232, 224, 'L')).toMatchObject({ ok: false })
  expect(judge('uomo', 232, 224, 'R')).toMatchObject({ ok: true, target: 'L' })
})

test('with abundant breasts both lateral and under-breast positions work, the breast does not', () => {
  expect(judge('seno', 240, 206).ok).toBe(true)
  expect(judge('seno', 206, 264).ok).toBe(true)
  expect(judge('seno', 194, 204)).toMatchObject({ ok: false })
})

test('far from every spot gives the general rule', () => {
  expect(judge('donna', 10, 10).why).toBe(GENERIC)
})
