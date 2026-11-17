import { expect, test } from 'vitest'
import { start, trainer, type TrainerAction } from './BlowsTrainer'
import { tree } from './ChokingTree'

const run = (actions: TrainerAction[]) => actions.reduce(trainer, start)
const five = (a: TrainerAction) => Array.from({ length: 5 }, () => [a, 'controlla'] as TrainerAction[]).flat()

test('5 back blows with a check after each, then 5 thrusts, then back to blows in a new cycle', () => {
  const afterBlows = run(five('colpo'))
  expect(afterBlows).toMatchObject({ phase: 'addome', count: 0, cycle: 1, mustCheck: false })
  const afterThrusts = run([...five('colpo'), ...five('spinta')])
  expect(afterThrusts).toMatchObject({ phase: 'dorso', count: 0, cycle: 2 })
})

test('refuses a second blow before the check, and thrusts before the 5 blows', () => {
  const s = run(['colpo', 'colpo'])
  expect(s).toMatchObject({ count: 1, mustCheck: true, ok: false })
  expect(run(['colpo', 'controlla', 'spinta'])).toMatchObject({ phase: 'dorso', count: 1, ok: false })
  expect(run(['controlla'])).toMatchObject({ count: 0, ok: false })
})

test('the victim can lose consciousness or expel the object at any moment; then nothing else counts', () => {
  const s = run(['colpo', 'incosciente', 'colpo'])
  expect(s).toMatchObject({ end: 'incosciente', count: 1 })
  expect(run(['colpo', 'controlla', 'colpo', 'espulso']).end).toBe('espulso')
  expect(trainer(s, 'ricomincia')).toBe(start)
})

test('every branch of the decision tree leads to an existing node, and the mild signs end in "lieve"', () => {
  for (const n of Object.values(tree)) for (const o of n.options) expect(tree[o.next], o.next).toBeDefined()
  const walk = (labels: string[]) => labels.reduce((id, l) => tree[id].options.find((o) => o.label === l)!.next, 'chiedi')
  expect(walk(['Riesce a rispondere', 'Tossisce in modo efficace', 'Respira'])).toBe('lieve')
  expect(walk(['Riesce a rispondere', 'Fa tentativi di tosse silenziosi e inefficaci', 'Sì, è cosciente'])).toBe('colpi')
})
