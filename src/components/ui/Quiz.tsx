import { ArrowDown, ArrowUp, Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { progress } from '../../lib/progress'
import { isCorrect, passed, scoreQuiz, type Question } from '../../lib/quiz'
import { Button } from './Button'

/**
 * Review questions with instant feedback. `id` is the section slug (or "esame"); the best score is saved
 * and a section with a quiz counts as completed at 80%.
 */
export function Quiz({ id, questions, title = 'Domande di ripasso' }: { id: string; questions: Question[]; title?: string }) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const allChecked = questions.every((q) => checked[q.id])
  const { score, total } = scoreQuiz(questions, answers)

  useEffect(() => {
    progress.declareQuiz(id, questions.length)
  }, [id, questions.length])
  useEffect(() => {
    if (allChecked) progress.saveQuiz(id, score, total)
  }, [allChecked, id, score, total])

  const restart = () => {
    setAnswers({})
    setChecked({})
  }

  return (
    <div className="my-8">
      <p className="max-w-[68ch] text-ink-soft">
        {title}: {questions.length} domande. Rispondi e premi Verifica: la spiegazione arriva subito, con la pagina del manuale.
      </p>
      <ol className="mt-6 space-y-6">
        {questions.map((q, n) => (
          <QuestionCard
            key={q.id}
            n={n + 1}
            q={q}
            given={answers[q.id] ?? (q.kind === 'order' ? q.options.map((o) => o.id) : [])}
            checked={!!checked[q.id]}
            onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
            onCheck={(v) => {
              setAnswers({ ...answers, [q.id]: v })
              setChecked({ ...checked, [q.id]: true })
            }}
          />
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-plate bg-panel p-5" aria-live="polite">
        {allChecked ? (
          <>
            <p className="font-display text-[2rem] font-extrabold leading-none">
              {score} su {total}
            </p>
            <p className="min-w-0 flex-1">
              {passed(score, total) ? 'Sezione superata. Puoi passare alla prossima.' : 'Serve almeno l’80%. Rileggi le spiegazioni e riprova.'}
            </p>
            <Button variant="quiet" onClick={restart}>
              <RotateCcw className="size-4" aria-hidden /> Riprova
            </Button>
          </>
        ) : (
          <p className="text-ink-soft">
            Verificate {questions.filter((q) => checked[q.id]).length} di {total}.
          </p>
        )}
      </div>
    </div>
  )
}

function QuestionCard({ n, q, given, checked, onChange, onCheck }: { n: number; q: Question; given: string[]; checked: boolean; onChange: (v: string[]) => void; onCheck: (v: string[]) => void }) {
  const kind = q.kind ?? 'single'
  const right = checked && isCorrect(q, given)
  const pick = (id: string) => {
    if (checked) return
    if (kind === 'single') onChange([id])
    else onChange(given.includes(id) ? given.filter((g) => g !== id) : [...given, id])
  }
  const move = (i: number, d: -1 | 1) => {
    const next = [...given]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const text = (id: string) => q.options.find((o) => o.id === id)?.text

  return (
    <li className="max-w-[76ch]">
      <fieldset disabled={checked} className="min-w-0">
        <legend className="flex gap-3 text-[1.08rem] font-bold leading-snug">
          <span className="font-display text-[1.5rem] font-extrabold leading-none text-safe">{n}</span>
          <span>
            {q.prompt}
            {kind === 'multi' && <span className="block text-[0.9rem] font-normal text-ink-soft">Più risposte corrette: selezionale tutte.</span>}
            {kind === 'order' && <span className="block text-[0.9rem] font-normal text-ink-soft">Metti le voci nell’ordine corretto con le frecce.</span>}
          </span>
        </legend>

        {kind === 'order' ? (
          <ol className="mt-3 space-y-2">
            {given.map((id, i) => (
              <li key={id} className={`flex items-center gap-3 rounded-chip p-2 pl-4 ring-2 ring-inset ${checked ? (q.answer[i] === id ? 'bg-safe-tint ring-safe' : 'bg-danger-tint ring-danger') : 'bg-panel ring-transparent'}`}>
                <span className="font-display text-[1.3rem] font-extrabold leading-none">{i + 1}</span>
                <span className="min-w-0 flex-1">{text(id)}</span>
                {!checked && (
                  <span className="flex gap-1">
                    <button type="button" className="grid size-9 place-items-center rounded-chip ring-2 ring-inset ring-line hover:ring-ink-soft disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Sposta su: ${text(id)}`}>
                      <ArrowUp className="size-4" aria-hidden />
                    </button>
                    <button type="button" className="grid size-9 place-items-center rounded-chip ring-2 ring-inset ring-line hover:ring-ink-soft disabled:opacity-30" disabled={i === given.length - 1} onClick={() => move(i, 1)} aria-label={`Sposta giù: ${text(id)}`}>
                      <ArrowDown className="size-4" aria-hidden />
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-3 space-y-2">
            {q.options.map((o) => {
              const on = given.includes(o.id)
              const correct = q.answer.includes(o.id)
              const state = !checked ? (on ? 'bg-must-tint ring-must' : 'bg-panel ring-transparent hover:ring-line') : correct ? 'bg-safe-tint ring-safe' : on ? 'bg-danger-tint ring-danger' : 'bg-panel ring-transparent opacity-70'
              return (
                <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-chip p-3 ring-2 ring-inset transition-colors duration-150 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-must ${state} ${checked ? 'cursor-default' : ''}`}>
                  <input type={kind === 'single' ? 'radio' : 'checkbox'} name={q.id} className="sr-only" checked={on} onChange={() => pick(o.id)} />
                  <span className="w-5 shrink-0 font-display text-[1.2rem] font-extrabold leading-snug">{o.id}</span>
                  <span className="min-w-0 flex-1">{o.text}</span>
                  {checked && correct && <Check className="mt-0.5 size-5 shrink-0 text-safe" strokeWidth={3} aria-label="Risposta corretta" />}
                  {checked && on && !correct && <X className="mt-0.5 size-5 shrink-0 text-danger" strokeWidth={3} aria-label="Risposta sbagliata" />}
                </label>
              )
            })}
          </div>
        )}
      </fieldset>

      {checked ? (
        <div className={`mt-3 rounded-chip p-4 ${right ? 'bg-safe-tint' : 'bg-danger-tint'}`} role="status">
          <p className="font-bold">{right ? 'Corretto.' : kind === 'order' ? `Non ancora. Ordine corretto: ${q.answer.map(text).join(', ')}.` : `Non ancora. Risposta corretta: ${q.answer.join(', ')}.`}</p>
          <p className="mt-1">
            {q.explain}
            {q.page && <span className="text-ink-soft"> Manuale p. {q.page}.</span>}
          </p>
        </div>
      ) : (
        <Button className="mt-3" variant="must" disabled={given.length === 0} onClick={() => onCheck(given)}>
          Verifica
        </Button>
      )}
    </li>
  )
}
