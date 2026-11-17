import { Check, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { Button, Stage } from '../../components/ui'

export type Decision = { id: string; title: string; situation: string; options: { text: string; ok: boolean; why: string }[] }

/** Scenario cards: pick a situation, choose what to do, read why. A wrong choice can be retried. */
export function DecisionCards({ title, hint, cards }: { title: string; hint?: string; cards: Decision[] }) {
  const [cur, setCur] = useState(0)
  const [picked, setPicked] = useState<Record<string, number>>({})
  const [solved, setSolved] = useState<string[]>([])
  const c = cards[cur]
  const p = picked[c.id]
  const choice = p === undefined ? undefined : c.options[p]

  const pick = (i: number) => {
    setPicked({ ...picked, [c.id]: i })
    if (c.options[i].ok && !solved.includes(c.id)) setSolved([...solved, c.id])
  }

  return (
    <Stage
      title={title}
      hint={hint}
      footer={
        <span aria-live="polite">
          Scenari risolti: {solved.length} di {cards.length}
          {solved.length === cards.length && '. Li hai risolti tutti.'}
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div className="flex flex-wrap gap-2 lg:flex-col" role="group" aria-label="Scegli lo scenario">
          {cards.map((k, i) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={i === cur}
              onClick={() => setCur(i)}
              className={`flex items-center gap-2 rounded-chip px-3 py-2 text-left text-[0.95rem] leading-tight transition-colors duration-150 ${i === cur ? 'bg-well-2 text-lume' : 'text-well-ink hover:bg-well-2'}`}
            >
              <span className={`grid size-5 shrink-0 place-items-center rounded-[4px] ring-2 ring-inset ${solved.includes(k.id) ? 'bg-lume text-well ring-lume' : 'ring-well-soft'}`}>
                {solved.includes(k.id) && <Check className="size-3.5" strokeWidth={4} aria-label="risolto" />}
              </span>
              {k.title}
            </button>
          ))}
        </div>

        <div className="min-w-0">
          <p className="max-w-[60ch] text-[1.1rem] font-bold leading-snug">{c.situation}</p>
          <div className="mt-4 space-y-2" role="group" aria-label="Che cosa fai?">
            {c.options.map((o, i) => {
              const on = p === i
              return (
                <button
                  key={o.text}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(i)}
                  className={`flex w-full items-start gap-3 rounded-chip bg-well-2 p-3 text-left leading-snug ring-2 ring-inset transition-colors duration-150 ${on ? (o.ok ? 'ring-lume' : 'ring-well-soft') : 'ring-transparent hover:ring-well-soft'}`}
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center">
                    {on && (o.ok ? <Check className="size-5 text-lume" strokeWidth={3} aria-hidden /> : <X className="size-5" strokeWidth={3} aria-hidden />)}
                  </span>
                  <span className="min-w-0 flex-1">{o.text}</span>
                </button>
              )
            })}
          </div>
          <div aria-live="polite" className="mt-4">
            {choice && (
              <div className="rounded-chip bg-well-2 p-4">
                <p className={`font-display text-[1.35rem] font-extrabold leading-none ${choice.ok ? 'text-lume' : ''}`}>{choice.ok ? 'Giusto.' : 'Non è la scelta giusta. Prova un’altra risposta.'}</p>
                <p className="mt-2">{choice.why}</p>
              </div>
            )}
          </div>
          {choice?.ok && cur < cards.length - 1 && (
            <Button variant="onDark" className="mt-4" onClick={() => setCur(cur + 1)}>
              Scenario successivo <ChevronRight className="size-5" aria-hidden />
            </Button>
          )}
        </div>
      </div>
    </Stage>
  )
}
