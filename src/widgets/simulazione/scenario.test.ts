import { describe, expect, test } from 'vitest'
import { advance, better, choose, scenario, start, START, summary, variants, type SimState } from './scenario'

const rightIndex = (s: SimState) => scenario(s.variant)[s.at].choices.findIndex((c) => c.ok)

describe.each(variants.map((v) => v.id))('variant %s', (v) => {
  const graph = scenario(v)

  test('every step is well formed', () => {
    for (const step of Object.values(graph)) {
      expect(step.choices.length, step.id).toBeGreaterThanOrEqual(2)
      expect(step.choices.length, step.id).toBeLessThanOrEqual(4)
      expect(step.choices.filter((c) => c.ok), step.id).toHaveLength(1)
      for (const c of step.choices) {
        if (c.next) expect(graph[c.next], `${step.id} -> ${c.next}`).toBeDefined()
        if (!c.ok) expect(c.cost, `${step.id}: wrong choices cost time`).toBeGreaterThan(0)
      }
    }
  })

  test('the right path reaches the end and visits every step', () => {
    let s = start(v)
    const visited = new Set<string>()
    while (!s.over) {
      expect(visited.has(s.at), `loop at ${s.at}`).toBe(false)
      visited.add(s.at)
      s = advance(choose(s, rightIndex(s)))
    }
    expect([...visited].sort()).toEqual(Object.keys(graph).sort())
    const r = summary(s)
    expect(r).toMatchObject({ right: r.total, lost: 0, unsafe: 0, revise: [] })
    expect(r.total).toBe(visited.size)
    expect(s.clock).toBeGreaterThan(0)
  })
})

test('each variant follows its own branch', () => {
  expect(scenario('pls').shock).toBeUndefined()
  expect(scenario('pls')['pls-manovra']).toBeDefined()
  expect(scenario('defibrillabile').shock).toBeDefined()
  expect(scenario('defibrillabile')['no-shock']).toBeUndefined()
  expect(scenario('non-defibrillabile')['no-shock']).toBeDefined()
  expect(scenario('non-defibrillabile').shock).toBeUndefined()
})

test('a wrong pick costs time, is logged once and points to the section to revise', () => {
  let s = start('defibrillabile')
  while (s.at !== 'analisi') s = advance(choose(s, rightIndex(s)))
  const step = scenario('defibrillabile').analisi
  const unsafe = step.choices.findIndex((c) => c.unsafe)
  const before = s.clock
  s = choose(s, unsafe)
  expect(s.clock).toBe(before + step.choices[unsafe].cost!)
  expect(choose(s, unsafe)).toBe(s) // the same wrong pick twice changes nothing
  s = advance(choose(s, rightIndex(s)))
  expect(s.at).toBe('shock')
  const last = s.log.at(-1)!
  expect(last).toMatchObject({ step: 'analisi', ok: false, unsafe: true, lost: step.choices[unsafe].cost })
  expect(summary(s).revise).toEqual(['dae'])
})

test('advance does nothing before the right choice', () => {
  const s = start('pls')
  expect(s.at).toBe(START)
  expect(advance(s)).toBe(s)
})

test('best result: more right first, then less time lost', () => {
  const a = { right: 10, total: 12, lost: 30, unsafe: 0, clock: 400 }
  expect(better(a)).toBe(true)
  expect(better(a, { ...a, right: 9 })).toBe(true)
  expect(better(a, { ...a, lost: 20 })).toBe(false)
  expect(better({ ...a, lost: 10 }, a)).toBe(true)
})
