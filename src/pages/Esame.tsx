import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router'
import { Button, ButtonLink, Callout, KeyFacts, Pictogram } from '../components/ui'
import { progress, useProgress } from '../lib/progress'
import { isCorrect, passed, scoreQuiz, type Question } from '../lib/quiz'
import { breakdown, drawExam, examPool, sectionOf, weakest } from '../widgets/esame/exam'
import { answerText, ExamQuestion } from '../widgets/esame/ExamQuestion'

// Section builders add their files independently: load whatever exists, never by name.
const files = import.meta.glob<{ default: Question[] }>(['../data/quiz/*.ts', '!../data/quiz/*.test.ts'], { eager: true })
const pool = examPool(Object.values(files).map((m) => (Array.isArray(m.default) ? m.default : [])))
const sectionCount = new Set(pool.map((q) => sectionOf(q.id)?.slug)).size

type Phase = 'intro' | 'run' | 'done'

export default function Esame() {
  const best = useProgress().quiz.esame
  const [size, setSize] = useState(Math.min(30, pool.length))
  const [phase, setPhase] = useState<Phase>('intro')
  const [set, setSet] = useState<Question[]>([])
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const head = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (phase !== 'intro') head.current?.focus()
  }, [phase, i])

  const start = () => {
    setSet(drawExam(pool, size, Date.now()))
    setAnswers({})
    setI(0)
    setPhase('run')
  }

  return (
    <article>
      <header className="bg-safe text-on-sign">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-x-10 gap-y-6 px-5 py-12 md:px-10 md:py-16">
          <span className="grid aspect-square w-24 shrink-0 place-items-center rounded-plate bg-on-sign text-safe shadow-raise md:w-32">
            <Pictogram name="esame" className="w-[64%]" />
          </span>
          <div className="min-w-0 flex-1 basis-[20rem]">
            <h1 className="text-title">Esame finale</h1>
            <p className="mt-4 max-w-[60ch] text-[1.12rem] leading-relaxed">
              Domande da tutte le sezioni del manuale, mescolate. Nessuna correzione finché non consegni: alla fine vedi il punteggio, le sezioni da ripassare e la spiegazione di ogni errore.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[88rem] px-5 py-12 md:px-10">
        {phase === 'intro' && <Intro size={size} setSize={setSize} onStart={start} best={best} />}

        {phase === 'run' && (
          <Run
            set={set}
            i={i}
            answers={answers}
            head={head}
            onAnswer={(id, v) => setAnswers({ ...answers, [id]: v })}
            onBack={() => setI(i - 1)}
            onNext={(a) => {
              setAnswers(a)
              if (i < set.length - 1) return setI(i + 1)
              const { score, total } = scoreQuiz(set, a)
              progress.saveQuiz('esame', score, total)
              setPhase('done')
            }}
          />
        )}

        {phase === 'done' && <Result set={set} answers={answers} head={head} best={best} onRestart={() => setPhase('intro')} />}
      </div>
    </article>
  )
}

function Intro({ size, setSize, onStart, best }: { size: number; setSize: (n: number) => void; onStart: () => void; best?: { score: number; total: number } }) {
  const choices = [...[15, 30].filter((n) => n < pool.length), pool.length]
  return (
    <div className="grid items-start gap-x-16 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
      <div>
        {pool.length === 0 ? (
          <Callout kind="nota" title="Le domande non sono ancora pronte">
            <p>Le domande di ripasso delle sezioni non sono ancora state caricate. Torna qui quando le sezioni saranno complete.</p>
          </Callout>
        ) : (
          <>
            <h2 className="text-sub">Prima di iniziare</h2>
            <ul className="mt-5 max-w-[62ch] list-[square] space-y-2 pl-5 marker:text-safe">
              <li>Una domanda per schermata. Puoi tornare indietro e cambiare risposta fino alla consegna.</li>
              <li>Alcune domande hanno più risposte corrette, altre chiedono di mettere in ordine i passaggi: lo trovi scritto sotto la domanda.</li>
              <li>Lo superi con almeno l’80% di risposte corrette, la stessa soglia delle domande di ripasso.</li>
            </ul>
            <fieldset className="mt-8">
              <legend className="font-display text-[1.4rem] font-bold">Quante domande?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {choices.map((n) => (
                  <label key={n} className="cursor-pointer rounded-chip px-4 py-2.5 font-display text-[1.15rem] font-bold leading-none ring-2 ring-inset ring-line transition-colors duration-150 hover:ring-ink-soft has-checked:bg-must has-checked:text-on-sign has-checked:ring-must has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-must">
                    <input type="radio" name="quante" className="sr-only" checked={size === n} onChange={() => setSize(n)} />
                    {n === pool.length ? `Tutte (${n})` : n}
                  </label>
                ))}
              </div>
            </fieldset>
            <Button variant="must" className="mt-8 px-6 py-3.5 text-[1.3rem]" onClick={onStart}>
              Inizia l’esame
            </Button>
          </>
        )}
      </div>
      <KeyFacts
        title="L’esame in numeri"
        items={[
          { label: 'Domande disponibili', value: pool.length, note: `Da ${sectionCount} sezioni del manuale; le appendici restano fuori.` },
          { label: 'Soglia per superarlo', value: '80%' },
          { label: 'Miglior risultato', value: best ? `${best.score} su ${best.total}` : 'nessuno', note: best ? `${Math.round((best.score / best.total) * 100)}% di risposte corrette.` : 'Ancora nessun esame consegnato.' },
        ]}
      />
    </div>
  )
}

function Run({ set, i, answers, head, onAnswer, onBack, onNext }: { set: Question[]; i: number; answers: Record<string, string[]>; head: RefObject<HTMLHeadingElement | null>; onAnswer: (id: string, v: string[]) => void; onBack: () => void; onNext: (a: Record<string, string[]>) => void }) {
  const q = set[i]
  const given = answers[q.id] ?? (q.kind === 'order' ? q.options.map((o) => o.id) : [])
  const last = i === set.length - 1
  const answered = set.filter((x) => answers[x.id]?.length).length

  return (
    <div className="mx-auto max-w-[76ch]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 ref={head} tabIndex={-1} className="text-[1.7rem]">
          Domanda {i + 1} di {set.length}
        </h2>
        <p className="text-[0.92rem] text-ink-soft">Risposte date: {answered}</p>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-[2px] bg-panel-2" role="progressbar" aria-label="Avanzamento dell’esame" aria-valuemin={1} aria-valuemax={set.length} aria-valuenow={i + 1}>
        <div className="h-full origin-left bg-must transition-transform duration-300 ease-out" style={{ transform: `scaleX(${(i + 1) / set.length})` }} />
      </div>

      <div className="mt-10">
        <ExamQuestion key={q.id} q={q} given={given} onChange={(v) => onAnswer(q.id, v)} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant="quiet" disabled={i === 0} onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden /> Indietro
        </Button>
        <Button variant="must" className="ml-auto" disabled={given.length === 0} onClick={() => onNext(answers[q.id] ? answers : { ...answers, [q.id]: given })}>
          {last ? 'Consegna l’esame' : 'Avanti'} <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
      {given.length === 0 && <p className="mt-3 text-right text-[0.9rem] text-ink-soft">Scegli una risposta per andare avanti.</p>}
    </div>
  )
}

function Result({ set, answers, head, best, onRestart }: { set: Question[]; answers: Record<string, string[]>; head: RefObject<HTMLHeadingElement | null>; best?: { score: number; total: number }; onRestart: () => void }) {
  const { score, total } = scoreQuiz(set, answers)
  const ok = passed(score, total)
  const rows = breakdown(set, answers)
  const weak = weakest(rows)
  const wrong = set.filter((q) => !isCorrect(q, answers[q.id]))

  return (
    <>
      <div className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-2">
        <section aria-live="polite" className={`rounded-plate p-6 ${ok ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
          <div className="flex items-start gap-5">
            <span className={`plate grid size-14 shrink-0 place-items-center ${ok ? '' : 'plate-danger'}`}>
              {ok ? <Check className="size-8" strokeWidth={3} aria-hidden /> : <X className="size-8" strokeWidth={3} aria-hidden />}
            </span>
            <div className="min-w-0">
              <h2 ref={head} tabIndex={-1} className="text-sub">
                {ok ? 'Esame superato' : 'Esame non ancora superato'}
              </h2>
              <p className="mt-4 font-display text-[3.5rem] font-extrabold leading-none">
                {score}
                <span className="text-[1.5rem] font-bold"> su {total}</span>
              </p>
              <p className="mt-2">
                {Math.round((score / total) * 100)}% di risposte corrette. Per superarlo ne servono almeno {Math.ceil(total * 0.8)} su {total}.
              </p>
              {best && <p className="mt-1 text-[0.95rem] text-ink-soft">Miglior risultato salvato: {best.score} su {best.total}.</p>}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="must" onClick={onRestart}>
              <RotateCcw className="size-4" aria-hidden /> Rifai l’esame
            </Button>
            <ButtonLink variant="quiet" to="/">
              Torna al percorso
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="per-sezione">
          <h2 id="per-sezione" className="text-sub">
            Sezione per sezione
          </h2>
          <ul className="mt-5 space-y-3">
            {rows.map((r) => {
              const good = passed(r.score, r.total)
              return (
                <li key={r.section.slug} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1">
                  <Link to={`/sezione/${r.section.slug}`} className="min-w-0 font-bold underline">
                    {r.section.kind}: {r.section.short}
                  </Link>
                  <span className="flex items-center gap-1.5 text-[0.95rem]">
                    {r.score} su {r.total}
                    {good ? <Check className="size-4 text-safe" strokeWidth={3} aria-label="almeno 80%" /> : <X className="size-4 text-danger" strokeWidth={3} aria-label="sotto l’80%" />}
                  </span>
                  <span className="col-span-2 h-2 overflow-hidden rounded-[2px] bg-panel-2" aria-hidden>
                    <span className={`block h-full origin-left ${good ? 'bg-safe' : 'bg-danger'}`} style={{ transform: `scaleX(${r.score / r.total})` }} />
                  </span>
                </li>
              )
            })}
          </ul>
          {weak.length > 0 ? (
            <div className="mt-8">
              <p className="font-bold">Ripassa per prime, dalla più debole:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {weak.map((r) => (
                  <ButtonLink key={r.section.slug} variant="quiet" to={`/sezione/${r.section.slug}`}>
                    {r.section.short}
                  </ButtonLink>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-ink-soft">Tutte le sezioni sono almeno all’80%.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="errori" className="mt-16">
        <h2 id="errori" className="text-sub">
          {wrong.length ? `Le risposte da rivedere (${wrong.length})` : 'Nessuna risposta sbagliata'}
        </h2>
        <ol className="mt-6 max-w-[76ch] space-y-5">
          {wrong.map((q) => {
            const s = sectionOf(q.id)
            return (
              <li key={q.id} className="rounded-plate bg-panel p-5">
                <p className="font-bold leading-snug">{q.prompt}</p>
                <p className="mt-3 flex gap-2">
                  <X className="mt-1 size-4 shrink-0 text-danger" strokeWidth={3} aria-hidden />
                  <span>
                    <span className="font-bold">La tua risposta: </span>
                    {answerText(q, answers[q.id])}
                  </span>
                </p>
                <p className="mt-1 flex gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-safe" strokeWidth={3} aria-hidden />
                  <span>
                    <span className="font-bold">Risposta corretta: </span>
                    {answerText(q, q.answer)}
                  </span>
                </p>
                <p className="mt-3">
                  {q.explain}
                  {q.page && <span className="text-ink-soft"> Manuale p. {q.page}.</span>}
                </p>
                {s && (
                  <Link to={`/sezione/${s.slug}`} className="mt-2 inline-block text-[0.95rem] text-safe-deep underline">
                    Ripassa: {s.kind}, {s.title}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
