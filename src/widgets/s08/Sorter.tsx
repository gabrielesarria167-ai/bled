import { Ban, Check, RotateCcw, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button, SignMark } from '../../components/ui'

export type SortItem = { text: string; fare: boolean; why: ReactNode }

/**
 * Fare / non fare: one action at a time, the learner sorts it and reads why.
 * At the end the whole list is shown sorted. Shared by sections 8 and 9.
 */
export function Sorter({ items, label = 'Fare o non fare' }: { items: SortItem[]; label?: string }) {
  const [picks, setPicks] = useState<boolean[]>([])
  const [n, setN] = useState(0)
  const it = items[n]
  const pick = picks[n] as boolean | undefined
  const answered = pick !== undefined
  const finished = n === items.length - 1 && answered
  const right = picks.filter((p, i) => p === items[i].fare).length

  const choose = (fare: boolean) => setPicks([...picks.slice(0, n), fare])
  const restart = () => {
    setPicks([])
    setN(0)
  }

  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6" role="group" aria-label={label}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-[1.3rem] font-bold leading-tight">{label}</p>
        <p className="text-[0.9rem] text-ink-soft">
          Azione {n + 1} di {items.length}, corrette {right}
        </p>
      </div>
      <p className="mt-4 min-h-[3.5rem] max-w-[60ch] font-display text-[1.65rem] font-bold leading-tight">{it.text}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="safe" disabled={answered} onClick={() => choose(true)}>
          <Check className="size-5" strokeWidth={3} aria-hidden /> Da fare
        </Button>
        <Button variant="danger" disabled={answered} onClick={() => choose(false)}>
          <Ban className="size-5" strokeWidth={2.5} aria-hidden /> Da non fare
        </Button>
      </div>

      <div aria-live="polite">
        {answered && (
          <div className={`mt-4 max-w-[62ch] rounded-chip p-4 ${pick === it.fare ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
            <p className="flex items-center gap-2 font-bold">
              {pick === it.fare ? <Check className="size-5 shrink-0 text-safe" strokeWidth={3} aria-hidden /> : <X className="size-5 shrink-0 text-danger" strokeWidth={3} aria-hidden />}
              {pick === it.fare ? 'Esatto: ' : 'Non è così: '}
              {it.fare ? 'è da fare.' : 'è da non fare.'}
            </p>
            <div className="mt-1">{it.why}</div>
          </div>
        )}
        {finished && (
          <p className="mt-5 font-display text-[1.5rem] font-extrabold leading-none">
            {right} su {items.length} al posto giusto
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {answered && !finished && (
          <Button variant="must" onClick={() => setN(n + 1)}>
            Avanti
          </Button>
        )}
        {finished && (
          <Button variant="quiet" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>

      {finished && (
        <div className="mt-6 grid gap-6 border-t-2 border-ground pt-5 md:grid-cols-2">
          {([true, false] as const).map((fare) => (
            <div key={String(fare)} className="min-w-0">
              <p className="flex items-center gap-3 font-display text-[1.4rem] font-extrabold leading-none">
                <SignMark kind={fare ? 'obbligo' : 'divieto'} className="w-7" />
                {fare ? 'Da fare' : 'Da non fare'}
              </p>
              <ul className="mt-3 list-[square] space-y-1.5 pl-5">
                {items.filter((x) => x.fare === fare).map((x) => (
                  <li key={x.text}>{x.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
