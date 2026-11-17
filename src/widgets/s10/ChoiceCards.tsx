import { Check, Eye, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'

export type Card = {
  id: string
  title: string
  prompt: string
  options: { id: string; text: string }[]
  answer: string
  /** The rule from the manual, shown after the choice. */
  rule: string
  sign?: { src: string; alt: string }
}

/** One decision per card: pick what to do, then read the rule. "Mostra tutte le regole" reveals every rule for review. */
export function ChoiceCards({ cards, label }: { cards: Card[]; label: string }) {
  const [picked, setPicked] = useState<Record<string, string>>({})
  const [all, setAll] = useState(false)
  const answered = cards.filter((c) => picked[c.id]).length
  const right = cards.filter((c) => picked[c.id] === c.answer).length

  return (
    <div className="my-8" role="group" aria-label={label}>
      <ul className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const p = picked[c.id]
          const show = !!p || all
          return (
            <li key={c.id} className="flex flex-col rounded-plate bg-panel p-5">
              <div className="flex items-start gap-4">
                {c.sign && <img src={c.sign.src} alt={c.sign.alt} className="w-14 shrink-0" />}
                <div className="min-w-0">
                  <p className="font-display text-[1.35rem] font-bold leading-tight">{c.title}</p>
                  <p className="mt-1">{c.prompt}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {c.options.map((o) => {
                  const on = p === o.id
                  const correct = o.id === c.answer
                  const state = !show ? 'bg-ground ring-transparent hover:ring-line' : correct ? 'bg-safe-tint ring-safe' : on ? 'bg-danger-tint ring-danger' : 'bg-ground ring-transparent opacity-70'
                  return (
                    <button key={o.id} type="button" disabled={!!p} aria-pressed={on} onClick={() => setPicked({ ...picked, [c.id]: o.id })} className={`flex w-full items-start gap-2 rounded-chip p-3 text-left ring-2 ring-inset transition-colors duration-150 disabled:cursor-default ${state}`}>
                      <span className="min-w-0 flex-1">{o.text}</span>
                      {show && correct && <Check className="mt-0.5 size-5 shrink-0 text-safe" strokeWidth={3} aria-label="Scelta corretta" />}
                      {show && on && !correct && <X className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={3} aria-label="Scelta sbagliata" />}
                    </button>
                  )
                })}
              </div>
              <div aria-live="polite" className="mt-auto">
                {show && (
                  <div className="mt-3 rounded-chip bg-ground p-3">
                    {p && <p className="font-bold">{p === c.answer ? 'Giusto.' : 'No.'}</p>}
                    <p>{c.rule}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-plate bg-panel p-4" aria-live="polite">
        <p className="min-w-0 flex-1">
          Risposte {answered} di {cards.length}, giuste {right}.
        </p>
        <Button variant="quiet" aria-pressed={all} onClick={() => setAll(!all)}>
          <Eye className="size-4" aria-hidden /> {all ? 'Nascondi le regole' : 'Mostra tutte le regole'}
        </Button>
        {answered > 0 && (
          <Button variant="quiet" onClick={() => setPicked({})}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>
    </div>
  )
}
