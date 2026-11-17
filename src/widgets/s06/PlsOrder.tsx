import { Check, RotateCcw } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button, Stage } from '../../components/ui'
import { useStored } from '../../lib/progress'
import { plsSteps } from './PlsSequence'

export type OrderState = { pool: number[]; placed: number[]; errors: number; wrong: number | null }

/** Shuffled step indices, never already in order. */
export function scrambled(n: number, rnd = Math.random): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
  } while (n > 1 && a.every((v, i) => v === i))
  return a
}

/** The learner taps a card: it is placed only if it is the next step of the sequence. */
export function tapStep(s: OrderState, idx: number): OrderState {
  if (!s.pool.includes(idx)) return s
  if (idx !== s.placed.length) return { ...s, errors: s.errors + 1, wrong: idx }
  return { pool: s.pool.filter((p) => p !== idx), placed: [...s.placed, idx], errors: s.errors, wrong: null }
}

const fresh = (): OrderState => ({ pool: scrambled(plsSteps.length), placed: [], errors: 0, wrong: null })

/** Ordering game: tap the 11 steps of the recovery position in the right order. */
export function PlsOrder() {
  const [s, setS] = useState(fresh)
  const [best, setBest] = useStored<number | null>('s06:ordine-errori', null)
  const reduce = useReducedMotion()
  const done = s.placed.length === plsSteps.length
  const next = s.placed.length + 1

  const tap = (idx: number, el: HTMLElement) => {
    const n = tapStep(s, idx)
    setS(n)
    if (n.wrong !== null && !reduce) el.animate([{ translate: '0' }, { translate: '-7px' }, { translate: '6px' }, { translate: '-4px' }, { translate: '0' }], { duration: 300, easing: 'ease-out' })
    if (n.placed.length === plsSteps.length && (best === null || n.errors < best)) setBest(n.errors)
  }

  return (
    <Stage title="Rimetti in ordine la PLS" hint="Tocca i passaggi uno dopo l’altro, dal primo all’ultimo" footer={best !== null ? `Il tuo record: sequenza completa con ${best} ${best === 1 ? 'errore' : 'errori'}.` : 'Completa la sequenza per registrare il tuo record.'}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-display text-[1.25rem] font-bold">{done ? 'Hai sistemato tutti i passaggi' : `Da sistemare: qual è il passo ${next}?`}</p>
          <ul className="mt-3 space-y-2">
            {s.pool.map((idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={(e) => tap(idx, e.currentTarget)}
                  className={`block w-full rounded-chip bg-well-2 px-4 py-2.5 text-left ring-2 ring-inset transition-[box-shadow] duration-150 hover:ring-well-soft ${s.wrong === idx ? 'ring-well-soft' : 'ring-transparent'}`}
                >
                  {plsSteps[idx].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display text-[1.25rem] font-bold">La tua sequenza</p>
          <ol className="mt-3 space-y-2">
            {s.placed.map((idx) => (
              <li key={idx} className="flex items-center gap-3 rounded-chip px-3 py-2 ring-2 ring-inset ring-well-2">
                <span className="w-6 shrink-0 font-display text-[1.3rem] font-extrabold leading-none text-lume">{idx + 1}</span>
                <span className="min-w-0 flex-1">{plsSteps[idx].title}</span>
                <Check className="size-5 shrink-0 text-lume" strokeWidth={3} aria-label="al posto giusto" />
              </li>
            ))}
            {!done && <li className="rounded-chip px-3 py-2 text-well-soft ring-2 ring-inset ring-well-2 [border-style:dashed]">Passo {next}</li>}
          </ol>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p aria-live="polite" className="min-w-0 flex-1">
          {done
            ? `Sequenza completa con ${s.errors} ${s.errors === 1 ? 'errore' : 'errori'}. ${s.errors === 0 ? 'Perfetta.' : 'Ripassa i passaggi dove hai sbagliato e riprova.'}`
            : s.wrong !== null
              ? `Non ancora: «${plsSteps[s.wrong].title}» viene più avanti. Cerca il passo ${next}.`
              : s.placed.length
                ? `Giusto, passo ${s.placed.length} al suo posto.`
                : 'Inizia dal primo passaggio della manovra.'}
        </p>
        <Button variant="onDark" onClick={() => setS(fresh())}>
          <RotateCcw className="size-4" aria-hidden /> Mescola e ricomincia
        </Button>
      </div>
    </Stage>
  )
}
