import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Pictogram } from '../components/ui/Pictogram'
import { useStored } from '../lib/progress'

const TARGET = 110 // middle of the 100–120 per minute range
const verdict = (bpm: number) => (bpm < 100 ? { text: 'Troppo lento: accelera', ok: false } : bpm > 120 ? { text: 'Troppo veloce: rallenta', ok: false } : { text: 'Ritmo giusto', ok: true })

/** Median of the last intervals, so one late tap does not swing the reading. */
export function tempoFromTaps(taps: number[]): number | null {
  if (taps.length < 4) return null
  const gaps = taps.slice(-9).map((t, i, a) => (i ? t - a[i - 1] : 0)).slice(1).sort((a, b) => a - b)
  return Math.round(60000 / gaps[Math.floor(gaps.length / 2)])
}

/**
 * Keep the compression rhythm: tap the pad (or press Space) 100–120 times a minute.
 * `full` adds the 30-compression count, the metronome sound and the saved best run.
 */
export function RhythmTrainer({ full = false }: { full?: boolean }) {
  const [taps, setTaps] = useState<number[]>([])
  const [sound, setSound] = useState(false)
  const [best, setBest] = useStored<number>('drill:ritmo', 0)
  const [streak, setStreak] = useState(0)
  const pad = useRef<HTMLButtonElement>(null)
  const audio = useRef<AudioContext | null>(null)
  const bpm = tempoFromTaps(taps)
  const v = bpm ? verdict(bpm) : null
  const count = taps.length % 30 || (taps.length ? 30 : 0)

  const tap = useCallback(() => {
    const now = performance.now()
    pad.current?.animate([{ scale: 0.94 }, { scale: 1 }], { duration: 160, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' })
    setTaps((t) => {
      const next = t.length && now - t[t.length - 1] > 2000 ? [now] : [...t, now]
      const b = tempoFromTaps(next)
      setStreak((s) => (b && verdict(b).ok ? s + 1 : 0))
      return next
    })
  }, [])

  useEffect(() => {
    if (streak > best) setBest(streak)
  }, [streak, best, setBest])

  useEffect(() => {
    if (!sound) return
    const ctx = (audio.current ??= new AudioContext())
    const id = setInterval(() => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = 880
      g.gain.setValueAtTime(0.18, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07)
      o.connect(g).connect(ctx.destination)
      o.start()
      o.stop(ctx.currentTime + 0.08)
    }, 60000 / TARGET)
    return () => clearInterval(id)
  }, [sound])

  return (
    <div className={`grid items-center gap-6 ${full ? 'md:grid-cols-[auto_1fr]' : ''}`}>
      <button
        ref={pad}
        type="button"
        onPointerDown={tap}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) tap()
          if (e.key === ' ') e.preventDefault()
        }}
        aria-label="Premi a ritmo di compressione: da 100 a 120 al minuto"
        className="mx-auto grid aspect-square w-48 touch-manipulation select-none place-items-center rounded-plate bg-on-sign text-safe shadow-raise md:w-60"
      >
        <span className={taps.length ? '' : 'motion-safe:animate-[beat_0.545s_ease-out_infinite]'}>
          <Pictogram name={taps.length ? 'mani' : 'dae'} className="w-28 md:w-36" />
        </span>
      </button>

      <div aria-live="polite" className={full ? '' : 'text-center'}>
        <p className="font-display text-[4.25rem] font-extrabold leading-none">
          {bpm ?? TARGET}
          <span className="ml-2 text-[1.5rem] font-bold">al minuto</span>
        </p>
        <p className="mt-2 font-display text-[1.5rem] font-bold leading-tight">
          {v ? v.text : taps.length ? 'Continua…' : 'Questo è il ritmo. Tienilo tu: premi il segnale o la barra spaziatrice.'}
        </p>
        {full && (
          <>
            <p className="mt-4">
              Compressione <strong>{count}</strong> di 30{count === 30 && ': ora 2 ventilazioni, poi si riparte.'}
            </p>
            <p className="text-[0.92rem] opacity-80">
              Serie nel ritmo giusto: {streak}. Record: {best}.
            </p>
            <button type="button" onClick={() => setSound(!sound)} aria-pressed={sound} className="mt-4 inline-flex items-center gap-2 rounded-chip px-3 py-2 ring-2 ring-inset ring-current">
              {sound ? <Volume2 className="size-5" aria-hidden /> : <VolumeX className="size-5" aria-hidden />}
              Metronomo a {TARGET} {sound ? 'acceso' : 'spento'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
