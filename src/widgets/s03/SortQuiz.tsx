import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'
import { tally } from './logic'

export type SortItem = { id: string; text: string; bin: string; explain: string }
export type Bin = { id: string; label: string }

/**
 * Sort statements into bins (vero/falso, via aerea/via ematica, protegge/non protegge).
 * Each answer locks and explains itself with the manual's reason. Also used by section 4.
 */
export function SortQuiz({ items, bins, label, intro }: { items: SortItem[]; bins: Bin[]; label: string; intro?: string }) {
  const [given, setGiven] = useState<Record<string, string>>({})
  const t = tally(given, items)
  const name = (id: string) => bins.find((b) => b.id === id)?.label ?? id

  return (
    <div className="my-8 max-w-[80ch]" role="group" aria-label={label}>
      {intro && <p className="mb-4 text-ink-soft">{intro}</p>}
      <ul className="space-y-3 pl-0!">
        {items.map((it) => {
          const g = given[it.id]
          const ok = g === it.bin
          return (
            <li key={it.id} className="mt-0! flex flex-col gap-3 rounded-plate bg-panel p-4">
              <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                <p className="min-w-0 flex-1 basis-[18rem] font-bold leading-snug">{it.text}</p>
                <div className="flex flex-wrap gap-2">
                  {bins.map((b) => {
                    const chosen = g === b.id
                    const state = !g ? 'ring-line hover:ring-ink-soft' : chosen ? (ok ? 'bg-safe-tint ring-safe' : 'bg-danger-tint ring-danger') : b.id === it.bin ? 'ring-safe' : 'ring-line opacity-55'
                    return (
                      <button
                        key={b.id}
                        type="button"
                        disabled={!!g}
                        aria-pressed={chosen}
                        aria-label={`${it.text}: ${b.label}`}
                        onClick={() => setGiven({ ...given, [it.id]: b.id })}
                        className={`inline-flex items-center gap-1.5 rounded-chip px-4 py-2 font-display text-[1.1rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 disabled:cursor-default ${state}`}
                      >
                        {g && chosen && (ok ? <Check className="size-4" strokeWidth={3} aria-hidden /> : <X className="size-4" strokeWidth={3} aria-hidden />)}
                        {b.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div aria-live="polite">
                {g && (
                  <p className={`rounded-chip p-3 text-[0.97rem] leading-snug ${ok ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
                    <strong>{ok ? 'Giusto.' : `Non proprio: la risposta giusta è «${name(it.bin)}».`}</strong> {it.explain}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="min-w-0 flex-1 font-bold" aria-live="polite">
          {t.done < t.total ? `Risposte giuste: ${t.right} su ${t.done}. Ne mancano ${t.total - t.done}.` : `Fatto: ${t.right} giuste su ${t.total}.`}
        </p>
        {t.done > 0 && (
          <Button variant="quiet" onClick={() => setGiven({})}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>
    </div>
  )
}
