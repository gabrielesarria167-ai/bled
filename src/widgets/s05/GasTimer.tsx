import { Check, Ear, Eye, RotateCcw, Timer, Wind, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'

type Case = { guarda: string; ascolta: string; senti: string; normale: boolean; why: string }

const cases: Case[] = [
  { guarda: 'Il torace si alza e si abbassa con regolarità', ascolta: 'Senti il rumore di un respiro regolare', senti: 'Avverti l’aria espirata sulla guancia', normale: true, why: 'Respiro normale: posizione laterale di sicurezza (non se sospetti traumi a testa, collo o schiena), chiama il SME e continua a controllare il respiro.' },
  { guarda: 'Il torace quasi non si muove', ascolta: 'Un rantolo raro e rumoroso, poi silenzio', senti: 'Quasi nessun flusso d’aria', normale: false, why: 'Sono rantoli (gasping): subito dopo un arresto cardiaco non vanno mai scambiati per un respiro normale. Allerta il SME dicendo che non respira e inizia la RCP.' },
  { guarda: 'Movimenti del torace deboli, appena accennati', ascolta: 'Un respiro debolissimo: non sei sicuro di sentirlo', senti: 'Forse un filo d’aria, forse no', normale: false, why: 'Respiro debole e dubbio: nel dubbio comportati come se non respirasse. Allerta il SME e inizia la RCP.' },
  { guarda: 'Il torace è fermo', ascolta: 'Nessun rumore respiratorio', senti: 'Nessuna aria sulla guancia', normale: false, why: 'Respiro assente: allerta il SME dicendo che non respira e inizia la RCP.' },
]

const LIMIT = 10

/** Guarda, ascolta, senti: a 10-second check the learner starts, then a decision on what they observed. */
export function GasTimer() {
  const [ci, setCi] = useState(1)
  const [startAt, setStartAt] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const [answer, setAnswer] = useState<{ normale: boolean; at: number } | null>(null)
  const c = cases[ci]
  const t = startAt === null ? 0 : Math.min(LIMIT, (now - startAt) / 1000)
  const running = startAt !== null && !answer && t < LIMIT

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(performance.now()), 100)
    return () => clearInterval(id)
  }, [running])

  const begin = () => {
    const n = performance.now()
    setStartAt(n)
    setNow(n)
    setAnswer(null)
  }
  const decide = (normale: boolean) => setAnswer({ normale, at: startAt === null ? 0 : (performance.now() - startAt) / 1000 })
  const next = () => {
    setCi((ci + 1 + Math.floor(Math.random() * (cases.length - 1))) % cases.length)
    setStartAt(null)
    setAnswer(null)
  }

  const right = answer && answer.normale === c.normale
  const cues = [
    { icon: Eye, label: 'Guarda', hint: 'il torace si muove?', text: c.guarda },
    { icon: Ear, label: 'Ascolta', hint: 'rumori respiratori?', text: c.ascolta },
    { icon: Wind, label: 'Senti', hint: 'aria sulla guancia?', text: c.senti },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <p className="font-display text-[4rem] font-extrabold leading-none" aria-hidden>
          {startAt === null ? LIMIT : Math.ceil(LIMIT - t)}
          <span className="ml-2 text-[1.5rem] font-bold">s</span>
        </p>
        <div className="min-w-48 flex-1 pb-3">
          <div className="h-3 overflow-hidden rounded-[4px] bg-well-2">
            <div className="h-full origin-left bg-lume" style={{ transform: `scaleX(${1 - t / LIMIT})` }} />
          </div>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 pl-0! sm:grid-cols-3">
        {cues.map(({ icon: Icon, label, hint, text }) => (
          <li key={label} className="mt-0! rounded-chip bg-well-2 p-4">
            <p className="flex items-center gap-2 font-display text-[1.35rem] font-bold leading-none text-lume">
              <Icon className="size-5" aria-hidden /> {label}
            </p>
            <p className="mt-2 text-[0.95rem]">{startAt === null ? <span className="text-well-soft">{hint}</span> : text}</p>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="mt-5 min-h-12">
        {startAt === null && <p>Le vie aeree sono aperte. Avvia il controllo: hai al massimo 10 secondi per decidere.</p>}
        {running && <p>Guarda, ascolta, senti. Quando sei sicuro, decidi.</p>}
        {startAt !== null && !answer && t >= LIMIT && <p className="font-bold">10 secondi passati: decidi ora. Se hai un dubbio, il respiro non è normale.</p>}
        {answer && (
          <div>
            <p className="flex items-center gap-2 font-display text-[1.5rem] font-bold leading-tight">
              {right ? <Check className="size-6 text-lume" aria-hidden /> : <X className="size-6" aria-hidden />}
              {right ? 'Giusto.' : 'No.'} {c.normale ? 'Respira normalmente.' : 'Il respiro non è normale.'}
            </p>
            <p className="mt-1">{c.why}</p>
            {answer.at > LIMIT && <p className="mt-1 text-well-soft">Hai deciso dopo {Math.round(answer.at)} secondi: il controllo dura al massimo 10 secondi.</p>}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {startAt === null || answer ? (
          <Button variant="onDark" onClick={answer ? next : begin}>
            {answer ? <RotateCcw className="size-4" aria-hidden /> : <Timer className="size-4" aria-hidden />} {answer ? 'Nuovo caso' : 'Avvia i 10 secondi'}
          </Button>
        ) : (
          <>
            <Button variant="onDark" onClick={() => decide(true)}>
              Respira normalmente
            </Button>
            <Button variant="onDark" onClick={() => decide(false)}>
              Non respira normalmente
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
