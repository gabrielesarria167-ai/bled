import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'
import { checkSigns, signItems } from './signs'

/** From a mixed list, pick the signs of shock; after checking, every item explains itself. */
export function SignsPicker() {
  const [sel, setSel] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const r = checkSigns(signItems, sel)
  const toggle = (id: string) => setSel((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]))

  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6" role="group" aria-label="Esercizio: i segni dello shock">
      <p className="font-display text-[1.3rem] font-bold leading-tight">Quali sono segni di shock?</p>
      <p className="mt-1 text-ink-soft">Seleziona tutte le voci che si possono osservare in una vittima di shock, poi premi Verifica.</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {signItems.map((it) => {
          const on = sel.includes(it.id)
          const good = on === it.sign
          const state = !checked ? (on ? 'bg-must-tint ring-must' : 'bg-ground ring-line hover:ring-ink-soft') : it.sign ? (on ? 'bg-safe-tint ring-safe' : 'bg-warn-tint ring-warn') : on ? 'bg-danger-tint ring-danger' : 'bg-ground ring-line'
          const verdict = it.sign ? (on ? 'Segno di shock: giusto' : 'Ti è sfuggito: è un segno di shock') : on ? 'Non è un segno di shock' : 'Giusto lasciarlo: non è un segno di shock'
          return (
            <li key={it.id}>
              <button type="button" aria-pressed={on} disabled={checked} onClick={() => toggle(it.id)} className={`flex h-full w-full items-start gap-3 rounded-chip p-3 text-left ring-2 ring-inset transition-colors duration-150 disabled:cursor-default ${state}`}>
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[4px] ring-2 ring-inset ${on ? 'bg-must text-on-sign ring-must' : 'ring-ink-soft'}`} aria-hidden>
                  {on && <Check className="size-3.5" strokeWidth={4} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug">{it.text}</span>
                  {checked && (
                    <span className="mt-1 block text-[0.92rem] leading-snug">
                      <span className="flex items-center gap-1.5 font-bold">
                        {good ? <Check className="size-4 shrink-0 text-safe" strokeWidth={3} aria-hidden /> : <X className="size-4 shrink-0 text-danger" strokeWidth={3} aria-hidden />}
                        {verdict}.
                      </span>
                      {it.why}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3" aria-live="polite">
        {checked ? (
          <>
            <p className="font-display text-[1.5rem] font-extrabold leading-tight">
              {r.found} segni su {r.total}
              {r.wrong > 0 && `, ${r.wrong} ${r.wrong === 1 ? 'voce sbagliata' : 'voci sbagliate'}`}
            </p>
            <Button
              variant="quiet"
              onClick={() => {
                setSel([])
                setChecked(false)
              }}
            >
              <RotateCcw className="size-4" aria-hidden /> Riprova
            </Button>
          </>
        ) : (
          <Button variant="must" disabled={sel.length === 0} onClick={() => setChecked(true)}>
            Verifica
          </Button>
        )}
      </div>
    </div>
  )
}
