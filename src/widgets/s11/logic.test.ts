import { describe, expect, it } from 'vitest'
import { canAdvance, spinalAction } from './logic'
import { ik, limbAngles, norm } from './pose'

describe('spinalAction (manuale p. 102)', () => {
  it('cosciente: resta dove si trova, testa stabilizzata', () => {
    expect(spinalAction({ conscious: true, supine: false })).toBe('stabilizza')
    expect(spinalAction({ conscious: true, supine: true, breathing: true })).toBe('stabilizza')
  })
  it('incosciente non supina: rotazione con il minimo movimento', () => {
    expect(spinalAction({ conscious: false, supine: false })).toBe('ruota')
  })
  it('supina: se respira testa stabilizzata (mai PLS), se non respira RCP', () => {
    expect(spinalAction({ conscious: false, supine: true, breathing: true })).toBe('stabilizza')
    expect(spinalAction({ conscious: false, supine: true, breathing: false })).toBe('rcp')
  })
})

describe('canAdvance', () => {
  const c = { id: 'x', text: '', answer: 'sposta', why: '' }
  it('needs an answer, and every factor ticked after a "sposta" case', () => {
    expect(canAdvance(c, null, 'sposta', 0, 4)).toBe(false)
    expect(canAdvance(c, 'resta', 'sposta', 3, 4)).toBe(false)
    expect(canAdvance(c, 'sposta', 'sposta', 4, 4)).toBe(true)
    expect(canAdvance({ ...c, answer: 'resta' }, 'sposta', 'sposta', 0, 4)).toBe(true)
  })
})

describe('pose math', () => {
  it('norm wraps into [-180, 180)', () => {
    expect(norm(190)).toBe(-170)
    expect(norm(-190)).toBe(170)
    expect(norm(45)).toBe(45)
  })
  it('ik puts the tip on a reachable target', () => {
    const [u, f] = ik(0, 0, 20, 15, 19, 19, -1)
    const r = Math.PI / 180
    const tip = [19 * Math.cos(u * r) + 19 * Math.cos(f * r), 19 * Math.sin(u * r) + 19 * Math.sin(f * r)]
    expect(tip[0]).toBeCloseTo(20, 5)
    expect(tip[1]).toBeCloseTo(15, 5)
  })
  it('a standing figure has arms and legs straight down', () => {
    const a = limbAngles({ x: 0, y: 0, t: -90, aN: { a: [90, 90] }, aF: { a: [90, 90] }, lN: [0, 46, 1], lF: [0, 46, 1] })
    // a target at full length is clamped a hair short, so the knee bends by about a degree
    expect(Math.abs(a.lN[0] - 90)).toBeLessThan(2)
    expect(Math.abs(a.lN[1] - 90)).toBeLessThan(2)
  })
})
