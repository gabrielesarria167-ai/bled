import { Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useStored } from '../../lib/progress'
import { choose, current, describe, makeScenario, node, outcomeOf, points, start, worsen, type Choice, type Outcome, type SimState } from './sequence'

const outcomes: { id: Outcome; label: string }[] = [
  { id: 'cosciente', label: 'Risponde' },
  { id: 'pls', label: 'Non risponde, respira normalmente' },
  { id: 'rcp', label: 'Non risponde, non respira normalmente' },
]

/** The adult BLS sequence as a branching case: choose each action, wrong choices explain and let you retry. */
export function SequenceSim() {
  const [tried, setTried] = useStored<Outcome[]>('s05:percorsi', [])
  const [st, setSt] = useState<SimState>(() => start(makeScenario(outcomes.find((o) => !tried.includes(o.id))?.id ?? 'rcp')))
  const [said, setSaid] = useState<Choice | null>(null)
  const heading = useRef<HTMLParagraphElement>(null)
  const n = current(st)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) heading.current?.focus()
    mounted.current = true
  }, [st.at])
  useEffect(() => {
    const o = outcomeOf(st.s)
    if (n.end && !tried.includes(o)) setTried([...tried, o])
  }, [n.end, st.s, tried, setTried])

  const pick = (id: string) => {
    const r = choose(st, id)
    setSaid(r.choice)
    setSt(r.state)
  }
  const fresh = () => {
    const left = outcomes.find((o) => !tried.includes(o.id) && o.id !== outcomeOf(st.s))
    setSt(start(makeScenario(left?.id ?? outcomes[Math.floor(Math.random() * 3)].id)))
    setSaid(null)
  }

  return (
    <div>
      <p className="max-w-[70ch] rounded-chip bg-well-2 p-4">
        <span className="font-bold text-lume">Il caso. </span>
        {describe(st.s)}
      </p>

      <ol className="mt-5 grid grid-cols-9 gap-1 pl-0!" aria-label="Punti della sequenza">
        {points.map((p, i) => (
          <li key={p} title={p} className={`mt-0! h-2 rounded-[2px] ${i + 1 < n.point || (n.end && i + 1 === n.point) ? 'bg-lume' : i + 1 === n.point ? 'bg-well-ink' : 'bg-well-2'}`}>
            <span className="sr-only">
              {i + 1}. {p}
              {i + 1 === n.point ? ' (qui)' : ''}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[0.9rem] text-well-soft">
        Punto {n.point} di 9: {points[n.point - 1]}
      </p>

      <div aria-live="polite" className="mt-3 min-h-8">
        {said && (
          <p className="flex gap-2">
            {said.ok ? <Check className="mt-1 size-5 shrink-0 text-lume" aria-hidden /> : <X className="mt-1 size-5 shrink-0" aria-hidden />}
            <span>
              <strong>{said.ok ? 'Fatto. ' : 'Non così. '}</strong>
              {said.why}
              {!said.ok && ' Scegli un’altra azione.'}
            </span>
          </p>
        )}
      </div>

      <p ref={heading} tabIndex={-1} className="mt-4 font-display text-[1.7rem] font-extrabold leading-tight outline-none">
        {n.title}: {n.prompt}
      </p>

      {!n.end ? (
        <ul className="mt-4 space-y-2 pl-0!">
          {n.choices.map((c) => {
            const wrong = st.tried.includes(c.id)
            return (
              <li key={c.id} className="mt-0!">
                <button type="button" disabled={wrong} onClick={() => pick(c.id)} className={`flex w-full items-start gap-3 rounded-chip p-3 text-left ring-2 ring-inset transition-colors duration-150 ${wrong ? 'text-well-soft line-through ring-well-2' : 'bg-well-2 ring-transparent hover:ring-well-soft'}`}>
                  {wrong ? <X className="mt-0.5 size-5 shrink-0" aria-label="già provata, sbagliata" /> : <span className="mt-1.5 size-3 shrink-0 rounded-full ring-2 ring-well-soft" aria-hidden />}
                  <span className="min-w-0">{c.text}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="mt-4">
          <p>
            Errori in questo caso: <strong>{st.errors}</strong>. Percorsi completati: {tried.length} di 3.
          </p>
          <ul className="mt-2 space-y-1 pl-0! text-[0.95rem]">
            {outcomes.map((o) => (
              <li key={o.id} className="mt-0! flex items-center gap-2">
                {tried.includes(o.id) ? <Check className="size-4 text-lume" aria-label="completato" /> : <span className="size-4 rounded-full ring-2 ring-well-soft" aria-label="da provare" />}
                {o.label}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3">
            {st.at === 'finePls' && (
              <Button variant="onDark" onClick={() => (setSt(worsen(st)), setSaid(null))}>
                Il respiro cambia: torna al punto 4
              </Button>
            )}
            <Button variant="onDark" onClick={fresh}>
              <RotateCcw className="size-4" aria-hidden /> Nuovo caso
            </Button>
          </div>
        </div>
      )}

      {st.done.length > 0 && (
        <div className="mt-6 border-t border-well-2 pt-4">
          <p className="font-display text-[1.3rem] font-bold leading-none text-lume">Che cosa hai fatto finora</p>
          <ol className="mt-3 list-decimal pl-5 text-[0.95rem]">
            {st.done.map((d, i) => {
              const past = node(d.at, st.s)
              return (
                <li key={i}>
                  <strong>{past.title}.</strong> {past.choices.find((c) => c.id === d.choice)?.text}
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {!n.end && (
        <button type="button" onClick={fresh} className="mt-5 text-[0.9rem] text-well-soft underline">
          Lascia questo caso e prendine un altro
        </button>
      )}
    </div>
  )
}
