import { describe as group, expect, test } from 'vitest'
import { choose, current, makeScenario, node, start, worsen, type NodeId, type Scenario, type SimState } from './sequence'

const base: Scenario = { risponde: false, respiro: 'assente', annegato: false, addestrato: true, problema: 'nessuno', secondo: false, dae: false }
const ok = (st: SimState) => current(st).choices.find((c) => c.ok)!.id

/** Always pick the right answer; return the nodes visited. */
function solve(st: SimState): { path: NodeId[]; end: SimState } {
  const path: NodeId[] = [st.at]
  while (!current(st).end) {
    st = choose(st, ok(st)).state
    path.push(st.at)
  }
  return { path, end: st }
}
const pathOf = (s: Partial<Scenario>) => solve(start({ ...base, ...s })).path

group('branches of the adult sequence', () => {
  test('responds: stays where found, branch ends', () => {
    expect(pathOf({ risponde: true })).toEqual(['sicurezza', 'coscienza', 'cosciente', 'fineCosciente'])
  })

  test('does not respond, breathes normally: PLS, branch ends; if breathing changes, back to point 4', () => {
    const { path, end } = solve(start({ ...base, respiro: 'normale' }))
    expect(path).toEqual(['sicurezza', 'coscienza', 'vieAeree', 'gas', 'esito', 'pls', 'finePls'])
    const again = solve(worsen(end)).path
    expect(again.slice(0, 3)).toEqual(['gas', 'esito', 'allarme'])
    expect(again.at(-1)).toBe('fine')
  })

  test.each(['gasping', 'debole', 'assente'] as const)('breathing %s counts as not normal: CPR', (respiro) => {
    expect(pathOf({ respiro })).toEqual(['sicurezza', 'coscienza', 'vieAeree', 'gas', 'esito', 'allarme', 'compressioni', 'ventilazioni', 'ciclo', 'stop', 'fine'])
    const at = { ...start({ ...base, respiro }), at: 'esito' as const }
    expect(choose(at, 'normale').state.at).toBe('esito')
  })

  test('chest does not rise, regurgitation, second rescuer and AED add their steps', () => {
    expect(pathOf({ problema: 'torace' })).toContain('torace')
    expect(pathOf({ problema: 'rigurgito' })).toContain('rigurgito')
    expect(pathOf({ secondo: true, dae: true }).slice(-5)).toEqual(['ciclo', 'cambio', 'dae', 'stop', 'fine'])
    expect(pathOf({ dae: true }).slice(-4)).toEqual(['ciclo', 'dae', 'stop', 'fine'])
  })

  test('untrained rescuer: compressions only, no ventilation problems', () => {
    const s = { ...base, addestrato: false, problema: 'torace' as const }
    expect(pathOf(s)).not.toContain('torace')
    const at = { ...start(s), at: 'ventilazioni' as const }
    expect(ok(at)).toBe('sole')
  })

  test('drowning victim: 5 initial breaths, and the adult alarm is wrong', () => {
    const drown = { ...start({ ...base, annegato: true }), at: 'allarme' as const }
    expect(ok(drown)).toBe('cinque')
    expect(choose(drown, 'chiama').state.at).toBe('allarme')
    expect(ok({ ...start(base), at: 'allarme' })).toBe('chiama')
  })
})

test('a wrong choice explains, stays on the node and counts one error', () => {
  const st = start(base)
  const { state, choice } = choose(st, 'corri')
  expect(choice.ok).toBe(false)
  expect(choice.why.length).toBeGreaterThan(20)
  expect(state.at).toBe('sicurezza')
  expect(state.errors).toBe(1)
  expect(choose(state, 'corri').state.errors).toBe(1)
  expect(choose(state, 'scena').state).toMatchObject({ at: 'coscienza', tried: [], errors: 1 })
})

test('every node has exactly one right answer in every scenario', () => {
  const ids: NodeId[] = ['sicurezza', 'coscienza', 'cosciente', 'vieAeree', 'gas', 'esito', 'pls', 'allarme', 'compressioni', 'ventilazioni', 'torace', 'rigurgito', 'ciclo', 'cambio', 'dae', 'stop']
  for (const respiro of ['normale', 'gasping', 'debole', 'assente'] as const)
    for (const annegato of [false, true])
      for (const addestrato of [false, true])
        for (const id of ids) expect(node(id, { ...base, respiro, annegato, addestrato }).choices.filter((c) => c.ok)).toHaveLength(1)
})

test('makeScenario produces the requested outcome', () => {
  let seed = 0.13
  const rand = () => (seed = (seed * 9301 + 0.49297) % 1)
  for (let i = 0; i < 30; i++) {
    expect(makeScenario('cosciente', rand).risponde).toBe(true)
    expect(makeScenario('pls', rand)).toMatchObject({ risponde: false, respiro: 'normale' })
    const r = makeScenario('rcp', rand)
    expect(r.respiro).not.toBe('normale')
    if (r.annegato) expect(r.addestrato).toBe(true)
  }
})
