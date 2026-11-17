import { ArrowDown, ArrowUp } from 'lucide-react'
import type { Question } from '../../lib/quiz'

/** One exam question, no feedback. Option styling follows the kit's Quiz before it is checked. */
export function ExamQuestion({ q, given, onChange }: { q: Question; given: string[]; onChange: (v: string[]) => void }) {
  const kind = q.kind ?? 'single'
  const pick = (id: string) => (kind === 'single' ? onChange([id]) : onChange(given.includes(id) ? given.filter((g) => g !== id) : [...given, id]))
  const move = (i: number, d: -1 | 1) => {
    const next = [...given]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const text = (id: string) => q.options.find((o) => o.id === id)?.text

  return (
    <fieldset className="min-w-0">
      <legend className="text-[1.25rem] font-bold leading-snug">
        {q.prompt}
        {kind === 'multi' && <span className="mt-1 block text-[0.95rem] font-normal text-ink-soft">Più risposte corrette: selezionale tutte.</span>}
        {kind === 'order' && <span className="mt-1 block text-[0.95rem] font-normal text-ink-soft">Metti le voci nell’ordine corretto con le frecce.</span>}
      </legend>

      {kind === 'order' ? (
        <ol className="mt-5 space-y-2">
          {given.map((id, i) => (
            <li key={id} className="flex items-center gap-3 rounded-chip bg-panel p-2 pl-4">
              <span className="font-display text-[1.3rem] font-extrabold leading-none">{i + 1}</span>
              <span className="min-w-0 flex-1">{text(id)}</span>
              <span className="flex gap-1">
                <button type="button" className="grid size-9 place-items-center rounded-chip ring-2 ring-inset ring-line hover:ring-ink-soft disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Sposta su: ${text(id)}`}>
                  <ArrowUp className="size-4" aria-hidden />
                </button>
                <button type="button" className="grid size-9 place-items-center rounded-chip ring-2 ring-inset ring-line hover:ring-ink-soft disabled:opacity-30" disabled={i === given.length - 1} onClick={() => move(i, 1)} aria-label={`Sposta giù: ${text(id)}`}>
                  <ArrowDown className="size-4" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-5 space-y-2">
          {q.options.map((o) => {
            const on = given.includes(o.id)
            return (
              <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-chip p-3 ring-2 ring-inset transition-colors duration-150 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-must ${on ? 'bg-must-tint ring-must' : 'bg-panel ring-transparent hover:ring-line'}`}>
                <input type={kind === 'single' ? 'radio' : 'checkbox'} name={q.id} className="sr-only" checked={on} onChange={() => pick(o.id)} />
                <span className="w-5 shrink-0 font-display text-[1.2rem] font-extrabold leading-snug">{o.id}</span>
                <span className="min-w-0 flex-1">{o.text}</span>
              </label>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}

/** "a) testo; c) testo" for single/multi, "1. testo, 2. testo" for order. */
export function answerText(q: Question, ids: string[] | undefined): string {
  if (!ids?.length) return 'nessuna risposta'
  const text = (id: string) => q.options.find((o) => o.id === id)?.text ?? id
  if (q.kind === 'order') return ids.map((id, i) => `${i + 1}. ${text(id)}`).join('; ')
  return q.options
    .filter((o) => ids.includes(o.id))
    .map((o) => `${o.id}) ${o.text}`)
    .join('; ')
}
