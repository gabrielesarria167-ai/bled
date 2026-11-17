import { Pause, Play, RotateCcw, StepForward, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { beatAt, elapsed, perfusion, PER_CYCLE, VENT_S } from './timing'

const sec = (n: number) => n.toFixed(1).replace('.', ',')

/** The 30:2 cycle, one beat at a time or played in real time at 100 or 120 compressions per minute. */
export function CycleTrainer() {
  const [beats, setBeats] = useState(0)
  const [rate, setRate] = useState<100 | 120>(100)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const ms = beatAt(beats).kind === 'compressione' ? 60000 / rate : VENT_S * 1000
    const id = setTimeout(() => setBeats((n) => n + 1), ms)
    return () => clearTimeout(id)
  }, [playing, beats, rate])

  const lastBeat = beats ? beatAt(beats - 1) : null
  const k = beats ? ((beats - 1) % PER_CYCLE) + 1 : 0 // beats done in the current cycle
  const t = elapsed(beats, rate)
  const swaps = Math.floor(t / 120)
  const p = perfusion(beats)

  const status = !lastBeat
    ? 'Premi Avanti per un passo alla volta, oppure Riproduci per vederlo a tempo reale.'
    : lastBeat.kind === 'compressione'
      ? `Compressione ${lastBeat.n} di 30${lastBeat.n === 30 ? ': ora riapri le vie aeree per le 2 ventilazioni.' : ''}`
      : lastBeat.n === 1
        ? 'Ventilazione 1 di 2: soffia per circa 1 secondo guardando il torace salire, poi staccati e lascialo scendere.'
        : 'Ventilazione 2 di 2: il torace è tornato giù, seconda insufflazione. Poi subito le mani sullo sterno e altre 30 compressioni.'

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ritmo delle compressioni">
        <span className="mr-1 text-[0.95rem] text-well-soft">Ritmo:</span>
        {([100, 120] as const).map((r) => (
          <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)} className={`rounded-chip px-3 py-1.5 text-[0.95rem] ring-2 ring-inset ${rate === r ? 'bg-well-ink text-well ring-well-ink' : 'ring-well-2 hover:ring-well-soft'}`}>
            {r} al minuto: 30 in {r === 100 ? 18 : 15} s
          </button>
        ))}
      </div>

      <ol className="mt-5 flex flex-wrap gap-1.5 pl-0!" aria-label={`Ciclo ${lastBeat?.cycle ?? 1}: ${k} passi su 32 fatti`}>
        {Array.from({ length: PER_CYCLE }, (_, i) => {
          const vent = i >= 30
          const done = i < k
          const now = i === k - 1
          return (
            <li
              key={i}
              aria-hidden
              className={`mt-0! grid h-8 place-items-center rounded-[4px] font-display text-[0.95rem] font-bold leading-none transition-[background-color,scale] duration-150 ease-out ${vent ? 'w-[4.5rem] gap-1' : 'w-8'} ${done ? 'bg-lume text-well' : 'bg-well-2 text-well-soft'} ${now ? 'scale-110' : ''}`}
            >
              {vent ? (
                <span className="flex items-center gap-1">
                  <Wind className="size-4" aria-hidden /> V{i - 29}
                </span>
              ) : (
                i + 1
              )}
            </li>
          )
        })}
      </ol>
      <p className="mt-1 text-[0.85rem] text-well-soft">Numeri: le 30 compressioni. V1 e V2: le 2 ventilazioni, una pausa di non più di 5 secondi.</p>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_16rem]">
        <div>
          <p aria-live={playing ? 'off' : 'polite'} className="min-h-[3.2em] font-display text-[1.45rem] font-bold leading-tight">
            {status}
          </p>
          <p className="mt-2">
            Ciclo <strong>{lastBeat?.cycle ?? 1}</strong>, tempo trascorso <strong>{sec(t)} s</strong>
          </p>
          {swaps > 0 && (
            <p className="mt-1 text-lume" aria-live="polite">
              Sono passati {swaps * 2} minuti: se siete in due, datevi il cambio (ogni 2 minuti, con un’interruzione minima).
            </p>
          )}
        </div>
        <div>
          <p className="text-[0.95rem] text-well-soft">Perfusione degli organi (schema)</p>
          <div className="mt-1 h-4 overflow-hidden rounded-[4px] bg-well-2">
            <div className="h-full origin-left bg-lume transition-transform duration-200 ease-out" style={{ transform: `scaleX(${p / 100})` }} />
          </div>
          <p className="mt-1 text-[0.85rem] text-well-soft">Sale con le compressioni, cala in ogni pausa.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="onDark" onClick={() => setPlaying(!playing)}>
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />} {playing ? 'Pausa' : 'Riproduci'}
        </Button>
        <Button variant="onDark" disabled={playing} onClick={() => setBeats(beats + 1)}>
          <StepForward className="size-4" aria-hidden /> Avanti di un passo
        </Button>
        <Button
          variant="onDark"
          onClick={() => {
            setPlaying(false)
            setBeats(0)
          }}
        >
          <RotateCcw className="size-4" aria-hidden /> Ricomincia
        </Button>
      </div>
    </div>
  )
}
