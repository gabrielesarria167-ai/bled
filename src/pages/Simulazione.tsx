import { ArrowRight, Check, RotateCcw, Shuffle, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router'
import { Button, ButtonLink, Callout, Pictogram, SignMark } from '../components/ui'
import { bySlug } from '../course'
import { useStored } from '../lib/progress'
import { advance, better, choose, mmss, scenario, start, summary, variants, type SimResult, type SimState, type VariantId } from '../widgets/simulazione/scenario'
import { SimScene } from '../widgets/simulazione/SimScene'

type Best = Partial<Record<VariantId, SimResult>>

export default function Simulazione() {
  const [sim, setSim] = useState<SimState | null>(null)
  const [best, setBest] = useStored<Best>('sim:best', {})
  const head = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (sim) head.current?.focus()
  }, [sim?.at, sim?.over, sim?.variant])

  const next = (s: SimState) => {
    const n = advance(s)
    if (n.over) {
      const r = summary(n)
      const { revise: _, ...result } = r
      if (better(result, best[n.variant])) setBest({ ...best, [n.variant]: result })
    }
    setSim(n)
  }

  return (
    <article>
      <header className="bg-safe text-on-sign">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-x-10 gap-y-6 px-5 py-12 md:px-10 md:py-16">
          <span className="grid aspect-square w-24 shrink-0 place-items-center rounded-plate bg-on-sign text-safe shadow-raise md:w-32">
            <Pictogram name="dae" className="w-[64%]" />
          </span>
          <div className="min-w-0 flex-1 basis-[20rem]">
            <h1 className="max-w-[22ch] text-title">Un soccorso dall’inizio alla fine</h1>
            <p className="mt-4 max-w-[62ch] text-[1.12rem] leading-relaxed">
              Sei l’unico soccorritore addestrato sulla scena. Dalla verifica della sicurezza all’arrivo del SME (Servizio Medico di Emergenza) decidi tu ogni passo, con quello che hai imparato nel corso. Ogni scelta sbagliata costa tempo.
            </p>
          </div>
        </div>
      </header>

      {!sim && <Picker best={best} onPick={(v) => setSim(start(v))} />}
      {sim && !sim.over && <Run sim={sim} head={head} onChoose={(i) => setSim(choose(sim, i))} onNext={() => next(sim)} onQuit={() => setSim(null)} />}
      {sim?.over && <Debrief sim={sim} best={best[sim.variant]} head={head} onRetry={() => setSim(start(sim.variant))} onOther={() => setSim(null)} />}
    </article>
  )
}

function Picker({ best, onPick }: { best: Best; onPick: (v: VariantId) => void }) {
  return (
    <div className="mx-auto max-w-[88rem] px-5 py-12 md:px-10">
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div>
          <h2 className="text-sub">Scegli il caso</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {variants.map((v) => {
              const b = best[v.id]
              return (
                <li key={v.id}>
                  <button type="button" onClick={() => onPick(v.id)} className="flex h-full w-full flex-col rounded-plate bg-panel p-5 text-left ring-2 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150 hover:bg-panel-2 hover:ring-line">
                    <span className="font-display text-[1.6rem] font-extrabold leading-tight">{v.title}</span>
                    <span className="mt-2">{v.text}</span>
                    <span className="mt-2 text-[0.92rem] text-ink-soft">Ti alleni su: {v.practise}</span>
                    <span className="mt-auto pt-4 text-[0.92rem] font-bold">{b ? `Miglior risultato: ${b.right} su ${b.total} giuste, ${mmss(b.lost)} persi` : 'Non ancora provato'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <Button variant="quiet" className="mt-5" onClick={() => onPick(variants[Math.floor(Math.random() * variants.length)].id)}>
            <Shuffle className="size-4" aria-hidden /> Un caso a sorpresa
          </Button>
        </div>
        <div>
          <h2 className="text-[1.6rem]">Come funziona</h2>
          <ul className="mt-4 list-[square] space-y-2 pl-5 marker:text-safe">
            <li>A ogni passo leggi la situazione e scegli che cosa fai.</li>
            <li>Una scelta sbagliata spiega il perché, con il ragionamento del manuale, e aggiunge secondi all’orologio dello scenario. Poi riprovi.</li>
            <li className="flex list-none items-start gap-2">
              <SignMark kind="divieto" className="mt-0.5 w-6" /> Le scelte pericolose per chi è sulla scena (saltare la verifica della sicurezza, toccare la vittima durante l’analisi o la scarica) portano il segnale di divieto.
            </li>
            <li>Alla fine trovi il resoconto di ogni decisione e le sezioni da ripassare.</li>
          </ul>
        </div>
      </div>
      <Callout kind="attenzione" title="Questa simulazione non sostituisce l’addestramento pratico">
        <p>Qui ripassi le decisioni e la loro sequenza. Le manovre si imparano sul manichino, in un corso BLS-D con un istruttore DAN qualificato.</p>
      </Callout>
    </div>
  )
}

function Run({ sim, head, onChoose, onNext, onQuit }: { sim: SimState; head: RefObject<HTMLHeadingElement | null>; onChoose: (i: number) => void; onNext: () => void; onQuit: () => void }) {
  const step = scenario(sim.variant)[sim.at]
  const variant = variants.find((v) => v.id === sim.variant)!
  const picked = sim.picked === undefined ? undefined : step.choices[sim.picked]
  const lost = sim.log.reduce((t, d) => t + d.lost, 0) + sim.wrong.reduce((t, w) => t + (step.choices[w].cost ?? 0), 0)
  const end = sim.solved && !picked?.next

  return (
    <section className="bg-well text-well-ink" aria-label={`Simulazione: ${variant.title}`}>
      <div className="mx-auto max-w-[88rem] px-5 py-8 md:px-10 md:py-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="font-display text-[1.5rem] font-bold leading-none text-lume">{variant.title}</p>
          <p className="text-[0.92rem] text-well-soft">Decisione {sim.log.length + (sim.solved ? 0 : 1)}</p>
          <div className="ml-auto flex items-center gap-3">
            <Pictogram name="orologio" className="size-7 text-lume" />
            <p className="leading-none">
              <span className="sr-only">Tempo dello scenario: </span>
              <span className="font-display text-[2.2rem] font-extrabold tabular-nums">{mmss(sim.clock)}</span>
              {lost > 0 && <span className="ml-2 text-[0.95rem] text-well-soft">di cui {mmss(lost)} persi</span>}
            </p>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-plate bg-well-2/50 p-2 lg:sticky lg:top-24">
            <SimScene scene={step.scene} />
            {picked?.unsafe && !sim.solved && (
              <motion.span key={sim.picked} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="absolute right-3 top-3">
                <SignMark kind="divieto" className="w-14 md:w-20" />
              </motion.span>
            )}
          </div>

          <div className="min-w-0">
            {step.voice && (
              <p className="mb-4 rounded-chip bg-well-2 px-4 py-3">
                <span className="block text-[0.85rem] text-well-soft">Il DAE dice</span>
                <span className="font-display text-[1.35rem] font-bold leading-tight text-lume">«{step.voice}»</span>
              </p>
            )}
            <h2 ref={head} tabIndex={-1} className="text-[1.7rem] leading-tight">
              {step.label}
            </h2>
            <p className="mt-3 text-[1.1rem] leading-relaxed">{step.situation}</p>

            <p className="mt-6 font-bold">Che cosa fai?</p>
            <ul className="mt-3 space-y-2">
              {step.choices.map((c, i) => {
                const tried = sim.wrong.includes(i)
                const right = sim.solved && sim.picked === i
                return (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={tried || sim.solved}
                      onClick={() => onChoose(i)}
                      className={`flex w-full items-start gap-3 rounded-chip bg-well-2 p-3 text-left ring-2 ring-inset transition-[box-shadow,opacity] duration-150 ${right ? 'ring-lume' : 'ring-transparent enabled:hover:ring-well-soft'} ${tried ? 'opacity-55' : ''} ${sim.solved && !right ? 'opacity-55' : ''}`}
                    >
                      <span className="w-5 shrink-0 font-display text-[1.2rem] font-extrabold leading-snug text-lume">{'abcd'[i]}</span>
                      <span className="min-w-0 flex-1">{c.text}</span>
                      {tried && (c.unsafe ? <SignMark kind="divieto" className="mt-0.5 w-5" /> : <X className="mt-0.5 size-5 shrink-0" strokeWidth={3} aria-hidden />)}
                      {tried && <span className="sr-only">(scelta scartata)</span>}
                      {right && <Check className="mt-0.5 size-5 shrink-0 text-lume" strokeWidth={3} aria-label="Scelta giusta" />}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div aria-live="polite" className="mt-5">
              {picked && (
                <div className="rounded-plate bg-well-2 p-4">
                  <p className="flex items-center gap-2 font-display text-[1.3rem] font-bold leading-tight">
                    {sim.solved ? (
                      <>
                        <Check className="size-5 text-lume" strokeWidth={3} aria-hidden /> Giusto
                      </>
                    ) : picked.unsafe ? (
                      <>
                        <SignMark kind="divieto" className="w-7" /> Pericoloso: +{mmss(picked.cost ?? 0)}
                      </>
                    ) : (
                      <>
                        <X className="size-5" strokeWidth={3} aria-hidden /> Non è la scelta giusta: +{mmss(picked.cost ?? 0)}
                      </>
                    )}
                  </p>
                  <p className="mt-2">{picked.why}</p>
                  {sim.solved ? (
                    <Button variant="onDark" className="mt-4" onClick={onNext}>
                      {end ? 'Vedi il resoconto' : 'Avanti'} <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  ) : (
                    <p className="mt-2 text-well-soft">Scegli di nuovo.</p>
                  )}
                </div>
              )}
            </div>

            <button type="button" onClick={onQuit} className="mt-6 text-[0.92rem] text-well-soft underline hover:text-well-ink">
              Interrompi e scegli un altro caso
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Debrief({ sim, best, head, onRetry, onOther }: { sim: SimState; best?: SimResult; head: RefObject<HTMLHeadingElement | null>; onRetry: () => void; onOther: () => void }) {
  const r = summary(sim)
  const variant = variants.find((v) => v.id === sim.variant)!

  return (
    <div className="mx-auto max-w-[88rem] px-5 py-12 md:px-10">
      <div className="grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <section className="rounded-plate bg-well p-6 text-well-ink shadow-raise" aria-live="polite">
          <h2 ref={head} tabIndex={-1} className="text-sub text-lume">
            Resoconto: {variant.title}
          </h2>
          <dl className="mt-5 space-y-2.5">
            {[
              ['Decisioni giuste al primo tentativo', `${r.right} su ${r.total}`],
              ['Tempo dello scenario', mmss(r.clock)],
              ['Tempo perso per errori', mmss(r.lost)],
              ['Scelte pericolose', String(r.unsafe)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline">
                <dt>{k}</dt>
                <span className="leader" aria-hidden />
                <dd className="font-display text-[1.55rem] font-extrabold leading-none text-lume">{v}</dd>
              </div>
            ))}
          </dl>
          {best && (
            <p className="mt-4 text-[0.95rem] text-well-soft">
              Miglior risultato salvato: {best.right} su {best.total} giuste, {mmss(best.lost)} persi.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="onDark" onClick={onRetry}>
              <RotateCcw className="size-4" aria-hidden /> Rifai questo caso
            </Button>
            <button type="button" onClick={onOther} className="rounded-chip px-3 py-2 font-display text-[1.15rem] font-bold text-well-ink underline">
              Scegli un altro caso
            </button>
          </div>
        </section>

        <div className="min-w-0">
          <h2 className="text-sub">Le tue decisioni</h2>
          <ol className="mt-5 divide-y-2 divide-line">
            {sim.log.map((d, i) => {
              const s = bySlug(d.section)
              return (
                <li key={d.step} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_auto]">
                  <span className="font-display text-[1.3rem] font-extrabold leading-snug text-ink-soft">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-bold">{d.label}</span>
                    <span className="flex flex-wrap items-center gap-x-2 text-[0.95rem]">
                      {d.ok ? <Check className="size-4 text-safe" strokeWidth={3} aria-hidden /> : d.unsafe ? <SignMark kind="divieto" className="w-4" /> : <X className="size-4 text-danger" strokeWidth={3} aria-hidden />}
                      {d.ok ? 'Giusta al primo tentativo' : d.unsafe ? `Scelta pericolosa prima di quella giusta, ${mmss(d.lost)} persi` : `Sbagliata al primo tentativo, ${mmss(d.lost)} persi`}
                    </span>
                  </span>
                  {s && (
                    <Link to={`/sezione/${s.slug}`} className="col-start-2 text-[0.92rem] text-safe-deep underline sm:col-start-3 sm:self-center">
                      {s.short}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>

          <h2 className="mt-10 text-sub">Da ripassare</h2>
          {r.revise.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {r.revise.map((slug) => {
                const s = bySlug(slug)
                return (
                  s && (
                    <ButtonLink key={slug} variant="quiet" to={`/sezione/${slug}`}>
                      {s.kind}: {s.short}
                    </ButtonLink>
                  )
                )
              })}
            </div>
          ) : (
            <p className="mt-3 text-ink-soft">Nessun errore: ogni decisione era giusta al primo tentativo. Prova un altro caso.</p>
          )}
        </div>
      </div>
    </div>
  )
}
