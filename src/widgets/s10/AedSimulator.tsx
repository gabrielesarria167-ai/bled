import { Check, Info, Power, RotateCcw, ShieldAlert, Volume2, VolumeX, X, Zap } from 'lucide-react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { Button, Pictogram, Stage } from '../../components/ui'
import { choices, ended, randomScenario, reduce, regia, report, scene, start, STATES, type Action, type Mode, type Regia, type Scenario, type SimState, type Tone } from './aedMachine'
import { EcgTrace } from './EcgTrace'
import type { Rhythm } from './ecg'
import { PadBoard } from './PadBoard'

/** The 2 minutes of RCP run 6 times faster on screen (20 seconds), and are always labelled as 2 minutes. */
const SPEED = 6
type Next = 'casuale' | 'si' | 'no'
type Act = Action | { type: 'reset'; sc: Scenario }

const OFF = ['sicurezza', 'valutazione', 'rcp_attesa', 'accensione']
const TONE: Record<Tone, { label: string; Icon: typeof Check }> = {
  ok: { label: 'Giusto', Icon: Check },
  errore: { label: 'Errore', Icon: X },
  sicurezza: { label: 'Errore di sicurezza', Icon: ShieldAlert },
  info: { label: 'Nota', Icon: Info },
}
const REGIA: Record<Regia, string> = {
  respira: 'La vittima riprende a respirare normalmente',
  als: 'Arriva il soccorso avanzato (ALS)',
  esausto: 'Sei esausto',
  indicazioni: 'Il DAE dà nuove indicazioni',
}
const radio = (on: boolean) => `rounded-chip px-3 py-1.5 text-[0.92rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${on ? 'bg-lume text-well ring-lume' : 'text-well-ink ring-well-2 hover:ring-well-soft'}`
const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

function sim(s: SimState, a: Act): SimState {
  return a.type === 'reset' ? start(a.sc) : reduce(s, a)
}

function speak(lines: string[]) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !lines.length) return
  const synth = window.speechSynthesis
  synth.cancel()
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('it'))
  for (const line of lines) {
    const u = new SpeechSynthesisUtterance(line)
    u.lang = 'it-IT'
    if (voice) u.voice = voice
    synth.speak(u)
  }
}
function hush() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}

/** The full DAE algorithm (pp. 84–90) on a dark stage: the learner picks the right action at every prompt. */
export function AedSimulator() {
  const [mode, setMode] = useState<Mode>('semi')
  const [s, dispatch] = useReducer(sim, undefined, () => start(randomScenario('semi')))
  const [next, setNext] = useState<Next>('casuale')
  const [muted, setMuted] = useState(false)
  const [rhythm, setRhythm] = useState<Rhythm | null>(null)
  const [count, setCount] = useState(0)
  const [left, setLeft] = useState(120)
  const nextRef = useRef(next)
  nextRef.current = next
  const spoken = useRef(0)
  const decided = useRef<boolean | null>(null)

  const restart = (m: Mode = mode) => {
    hush()
    setRhythm(null)
    decided.current = null
    spoken.current = 0
    dispatch({ type: 'reset', sc: randomScenario(m) })
  }

  // Voice: each transition's lines once. The first one comes from the learner's click on "Accendi".
  useEffect(() => {
    if (s.seq === spoken.current) return
    spoken.current = s.seq
    if (!muted) speak(s.say)
  }, [s.seq, s.say, muted])
  useEffect(() => hush, [])

  // The passer-by comes back with the DAE a few seconds after RCP starts.
  useEffect(() => {
    if (s.phase !== 'rcp_attesa' || !s.cpr) return
    const t = setTimeout(() => dispatch({ type: 'daeArrivato' }), 5000)
    return () => clearTimeout(t)
  }, [s.phase, s.cpr])

  // Analysis runs only while everyone is clear; the outcome follows the "regia" setting.
  useEffect(() => {
    if (s.phase !== 'analisi' || !s.clear) return
    if (decided.current === null) {
      const n = nextRef.current
      const shock = n === 'casuale' ? Math.random() < 0.5 : n === 'si'
      decided.current = shock
      setRhythm(shock ? (Math.random() < 0.65 ? 'fv' : 'tvsp') : Math.random() < 0.5 ? 'asistolia' : 'aesp')
    }
    const t = setTimeout(() => {
      dispatch({ type: 'analisiFinita', shockable: !!decided.current })
      decided.current = null
    }, 4000)
    return () => clearTimeout(t)
  }, [s.phase, s.clear])

  // Fully automatic DAE: a few seconds of warning, then the shock.
  useEffect(() => {
    if (s.phase !== 'scarica' || s.sc.mode !== 'auto') return
    let n = 3
    setCount(n)
    const id = setInterval(() => {
      n -= 1
      setCount(n)
      if (n === 0) {
        clearInterval(id)
        dispatch({ type: 'scaricaAuto' })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [s.phase, s.sc.mode])

  // After a shock the rhythm is unknown until the next analysis.
  useEffect(() => setRhythm(null), [s.shocks])

  // 2 minutes of RCP, accelerated; then the DAE analyses again.
  useEffect(() => {
    if (s.phase !== 'rcp' || !s.cpr) return
    const t0 = performance.now()
    setLeft(120)
    const id = setInterval(() => {
      const sec = 120 - Math.floor(((performance.now() - t0) * SPEED) / 1000)
      if (sec > 0) return setLeft(sec)
      clearInterval(id)
      setLeft(0)
      dispatch({ type: 'rcpFinita' })
    }, 250)
    return () => clearInterval(id)
  }, [s.phase, s.cpr])

  const on = !OFF.includes(s.phase)
  const reading = s.pads && s.phase !== 'elettrodi'
  const trace = !reading ? null : s.breathing ? 'rs' : rhythm
  const artefact = reading && (s.cpr || s.interrupted)
  const opts = choices(s).filter((c) => c.id !== 'shock')
  const canShock = s.phase === 'scarica' && s.sc.mode === 'semi'
  const events = regia(s)
  const current = STATES.findIndex((st) => st.phases.includes(s.phase))
  const safety = s.errors.filter((e) => e.safety).length
  const t = s.note && TONE[s.note.tone]

  return (
    <Stage title="Simulatore DAE" hint="Scegli l’azione giusta a ogni istruzione del DAE." footer="Simulazione didattica: le frasi del DAE sono indicative e il tempo della RCP è accelerato sullo schermo. Le manovre si imparano sul manichino, con l’istruttore.">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div role="radiogroup" aria-label="Tipo di DAE (cambiarlo fa ricominciare)" className="flex flex-wrap items-center gap-2">
          <span className="text-[0.9rem] text-well-soft">Tipo di DAE</span>
          {(['semi', 'auto'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={radio(mode === m)}
              onClick={() => {
                setMode(m)
                restart(m)
              }}
            >
              {m === 'semi' ? 'Semiautomatico' : 'Completamente automatico'}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="Ritmo alla prossima analisi" className="flex flex-wrap items-center gap-2">
          <span className="text-[0.9rem] text-well-soft">Ritmo alla prossima analisi</span>
          {(
            [
              ['casuale', 'Casuale'],
              ['si', 'Defibrillabile'],
              ['no', 'Non defibrillabile'],
            ] as const
          ).map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={next === k} className={radio(next === k)} onClick={() => setNext(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="onDark"
            aria-pressed={!muted}
            onClick={() => {
              if (!muted) hush()
              setMuted(!muted)
            }}
          >
            {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />} {muted ? 'Voce spenta' : 'Voce accesa'}
          </Button>
          <Button variant="onDark" onClick={() => restart()}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        </div>
      </div>

      <ol className="mt-5 flex flex-wrap gap-1.5" aria-label="Stati dell’algoritmo">
        {STATES.map((st, i) => (
          <li key={st.n} aria-current={i === current ? 'step' : undefined} className={`rounded-chip px-2 py-1 text-[0.82rem] font-bold leading-none ${i === current ? 'bg-lume text-well' : 'bg-well-2 text-well-soft'}`}>
            {st.n}
            {i === current ? ` ${st.name}` : <span className="sr-only"> {st.name}</span>}
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="rounded-plate bg-well-2 p-4">
          <div className="flex items-center justify-between gap-3 text-[0.9rem]">
            <span className={`flex items-center gap-2 font-bold ${on ? 'text-lume' : 'text-well-soft'}`}>
              <Power className="size-5" aria-hidden /> {on ? 'DAE acceso' : 'DAE spento'}
            </span>
            <span className="text-well-soft">{s.sc.mode === 'semi' ? 'Semiautomatico' : 'Automatico'}</span>
          </div>
          <p className="mt-3 flex min-h-[4.5rem] items-start gap-2 rounded-chip bg-well p-3 font-display text-[1.3rem] font-bold leading-tight text-lume" aria-live="polite">
            <Volume2 className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>{on ? (s.log.at(-1) ?? '…') : 'In attesa del DAE.'}</span>
          </p>
          <div className="relative mt-3">
            <EcgTrace rhythm={trace} artefact={artefact} label={!reading ? 'Monitor: elettrodi non collegati' : `Monitor${artefact ? ': segnale disturbato dai movimenti' : ''}`} />
            {!reading && <p className="pointer-events-none absolute inset-0 grid place-items-center text-[0.9rem] text-well-soft">Elettrodi non collegati</p>}
          </div>
          <div className="mt-3 min-h-12 text-[0.95rem]">
            {s.phase === 'rcp' && s.cpr && (
              <>
                <p className="flex items-center gap-2">
                  <span className="motion-safe:animate-[beat_0.545s_ease-out_infinite]">
                    <Pictogram name="mani" className="w-7 text-lume" />
                  </span>
                  RCP 30:2, mancano {mmss(left)} dei 2 minuti
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-[2px] bg-well" aria-hidden>
                  <div className="h-full origin-left bg-lume" style={{ transform: `scaleX(${left / 120})` }} />
                </div>
                <p className="mt-1 text-[0.8rem] text-well-soft">Tempo accelerato sullo schermo: nella realtà sono 2 minuti.</p>
              </>
            )}
            {s.phase === 'scarica' && s.sc.mode === 'auto' && <p className="font-bold text-lume">Scarica automatica tra {count} secondi.</p>}
            {s.phase === 'analisi' && s.clear && <p className="text-well-soft">Analisi in corso…</p>}
          </div>
          {s.sc.mode === 'semi' ? (
            <button
              type="button"
              disabled={!canShock}
              onClick={() => dispatch({ type: 'choose', id: 'shock' })}
              aria-label={canShock ? 'Pulsante di scarica: premi per erogare lo shock' : 'Pulsante di scarica (non attivo)'}
              className={`mx-auto mt-2 grid size-24 place-items-center rounded-full font-display text-[1rem] font-extrabold leading-none ring-4 transition-[scale,opacity] duration-150 active:scale-95 disabled:opacity-35 ${canShock ? 'bg-lume text-well ring-well-ink motion-safe:animate-pulse' : 'bg-well text-well-soft ring-well'}`}
            >
              <span className="grid justify-items-center gap-1">
                <Zap className="size-8" aria-hidden /> Scarica
              </span>
            </button>
          ) : (
            <p className="mt-2 text-center text-[0.88rem] text-well-soft">DAE completamente automatico: nessun pulsante di scarica.</p>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[1.05rem]">{scene(s)}</p>

          {s.phase === 'elettrodi' && !s.pads && (
            <div className="mt-4">
              <PadBoard body={s.sc.body} onDone={() => dispatch({ type: 'padsPlaced' })} onMiss={(why) => dispatch({ type: 'padMiss', text: why })} />
            </div>
          )}

          {s.phase === 'rapporto' && (
            <dl className="mt-4 space-y-2 rounded-chip bg-well-2 p-4">
              {report(s).map((r) => (
                <div key={r.label}>
                  <dt className="font-bold text-lume">{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {opts.length > 0 && (
            <div className="mt-4 space-y-2" role="group" aria-label="Che cosa fai?">
              <p className="font-bold">Che cosa fai?</p>
              {opts.map((c) => (
                <button key={`${s.seq}-${c.id}`} type="button" onClick={() => dispatch({ type: 'choose', id: c.id })} className="block w-full rounded-chip bg-well-2 p-3 text-left ring-2 ring-inset ring-transparent transition-colors duration-150 hover:ring-well-soft">
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {canShock && <p className="mt-3 font-bold text-lume">Il DAE chiede la scarica: premi il pulsante lampeggiante sul dispositivo.</p>}

          <div className="mt-4 min-h-16" aria-live="polite">
            {t && s.note && (
              <div className="rounded-chip bg-well-2 p-3">
                <p className={`flex items-center gap-2 font-bold ${s.note.tone === 'ok' ? 'text-lume' : ''}`}>
                  <t.Icon className="size-5 shrink-0" strokeWidth={2.75} aria-hidden /> {t.label}
                </p>
                <p className="mt-1">{s.note.text}</p>
              </div>
            )}
          </div>

          {events.length > 0 && (
            <div className="mt-4 rounded-chip p-3 ring-2 ring-inset ring-well-2">
              <p className="text-[0.9rem] text-well-soft">Regia dello scenario: fai succedere qualcosa (non sono tue azioni).</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {events.map((e) => (
                  <button key={e} type="button" className={radio(false)} onClick={() => dispatch({ type: 'regia', event: e })}>
                    {REGIA[e]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {ended(s) && (
            <div className="mt-4 space-y-3 rounded-chip bg-well-2 p-4" aria-live="polite">
              <p className="font-display text-[1.6rem] font-extrabold leading-none text-lume">{s.phase === 'esausto' ? 'Fine: soccorritore esausto' : 'Fine: vittima affidata all’ALS'}</p>
              <p>
                Analisi del ritmo: {s.analyses}. Scariche erogate: {s.shocks}. Periodi di RCP da 2 minuti: {s.cprPeriods}. Errori: {s.errors.length}, di cui di sicurezza: {safety}.
              </p>
              {s.errors.length > 0 && (
                <ul className="list-[square] space-y-1 pl-5 text-[0.95rem]">
                  {s.errors.map((e, i) => (
                    <li key={i}>
                      {e.safety && <span className="font-bold">Sicurezza: </span>}
                      {e.text}
                    </li>
                  ))}
                </ul>
              )}
              <Button variant="onDark" onClick={() => restart()}>
                <RotateCcw className="size-4" aria-hidden /> Ricomincia con una nuova scena
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-[0.9rem] text-well-soft">Che cosa ha detto il DAE</p>
          <ol className="mt-1 max-h-40 space-y-1 overflow-auto rounded-chip bg-well-2 p-3 text-[0.92rem]">
            {s.log.length === 0 ? (
              <li className="text-well-soft">Ancora niente: il DAE parla dopo l’accensione.</li>
            ) : (
              s.log.map((l, i) => (
                <li key={i}>
                  <span className="font-bold text-lume">DAE:</span> {l}
                </li>
              ))
            )}
          </ol>
        </div>
        <p className="self-end text-[0.92rem]">
          Errori: <strong>{s.errors.length}</strong>
          <br />
          di sicurezza: <strong>{safety}</strong>
        </p>
      </div>
    </Stage>
  )
}
