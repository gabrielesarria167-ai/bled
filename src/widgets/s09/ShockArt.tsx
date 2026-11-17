import { Snowflake, Sun, Timer, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Button, Plate } from '../../components/ui'
import { stepArt as bleedArt } from '../s08/Art'
import { legClock } from './legs'

const ease = [0.23, 1, 0.32, 1] as const
export type Side = 'oro' | 'argento'
// well-soft stays a light grey in both themes, so it reads as silver either way
const sideFill = { oro: 'var(--warn)', argento: 'var(--well-soft)' }

/**
 * The victim lying supine, seen from the side (head on the left). Legs pivot at the hip
 * to rest on a rigid case; the blanket shows which side faces out.
 */
export function SupineBody({ label, legsUp = false, blanket, breathe = false, children }: { label: string; legsUp?: boolean; blanket?: Side; breathe?: boolean; children?: ReactNode }) {
  return (
    <svg viewBox="0 0 320 160" className="mx-auto w-full max-w-[24rem]" role="img" aria-label={label}>
      {children}
      <rect x="0" y="136" width="320" height="6" rx="3" fill="var(--line)" />
      <motion.rect x="252" y="102" width="46" height="34" rx="4" fill="var(--ink)" initial={false} animate={{ opacity: legsUp ? 1 : 0 }} transition={{ duration: 0.25 }} />
      <circle cx="38" cy="114" r="17" fill="var(--ink-soft)" />
      <motion.g style={{ originX: 0.5, originY: 1 }} animate={breathe ? { scaleY: [1, 1.12, 1] } : { scaleY: 1 }} transition={breathe ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}>
        <rect x="58" y="102" width="118" height="34" rx="16" fill="var(--ink-soft)" />
        {blanket && <motion.rect key={blanket} x="56" y="98" width="122" height="38" rx="10" fill={sideFill[blanket]} style={{ originX: 0, originY: 0.5 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.35, ease }} />}
      </motion.g>
      <motion.g style={{ originX: 0, originY: 0.5 }} initial={false} animate={{ rotate: legsUp ? -16 : 0 }} transition={{ duration: 0.6, ease }}>
        <rect x="172" y="110" width="130" height="24" rx="12" fill="var(--ink-soft)" />
        {blanket && <motion.rect key={blanket} x="170" y="106" width="134" height="30" rx="10" fill={sideFill[blanket]} style={{ originX: 0, originY: 0.5 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.35, ease, delay: 0.15 }} />}
      </motion.g>
    </svg>
  )
}

/** The rescuer kneeling behind the victim, one arm reaching the shoulder. Draw before the victim. */
function Rescuer({ tap = false }: { tap?: boolean }) {
  return (
    <g fill="var(--must)">
      <circle cx="112" cy="26" r="14" />
      <rect x="99" y="44" width="28" height="50" rx="12" />
      <rect x="104" y="92" width="52" height="16" rx="8" />
      <motion.line x1="114" y1="54" x2="76" y2="98" stroke="var(--must)" strokeWidth="11" strokeLinecap="round" animate={tap ? { y: [0, 4, 0, 4, 0, 0] } : { y: 0 }} transition={tap ? { duration: 1.6, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.4, 1] } : { duration: 0.2 }} />
    </g>
  )
}

function Sign({ glyph }: { glyph: 'scudo' | 'ritmo' | 'telefono' }) {
  return (
    <div className="grid place-items-center py-4">
      <Plate glyph={glyph} tone="must" className="w-32" />
    </div>
  )
}

/** Step 7: decide on trauma, watch the legs go up (or stay down), keep the under-7-minutes limit. */
export function LegRaise() {
  const [trauma, setTrauma] = useState<boolean | null>(null)
  const [start, setStart] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  const clock = legClock(start === null ? 0 : now - start)

  useEffect(() => {
    if (start === null) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [start])

  const choose = (t: boolean) => {
    setTrauma(t)
    setStart(null)
  }

  return (
    <div>
      <SupineBody legsUp={trauma === false} label={trauma === false ? 'Vittima supina con gli arti inferiori sollevati su una valigetta rigida' : 'Vittima supina con le gambe distese a terra'} />
      <p className="mt-3 text-center font-bold">C’è evidenza di trauma?</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {[false, true].map((t) => (
          <button key={String(t)} type="button" aria-pressed={trauma === t} onClick={() => choose(t)} className={`rounded-chip px-3 py-2 text-[0.95rem] font-bold ring-2 ring-inset transition-colors duration-150 ${trauma === t ? 'bg-must text-on-sign ring-must' : 'bg-ground ring-line hover:ring-ink-soft'}`}>
            {t ? 'Sì, c’è un trauma' : 'No, nessun trauma'}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2 text-[0.95rem] leading-snug" aria-live="polite">
        {trauma === false && <p>Solleva gli arti inferiori: il sangue torna al torace e quindi al cuore. Tienili sollevati per meno di 7 minuti.</p>}
        {trauma === true && (
          <p className="flex gap-2">
            <X className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={3} aria-hidden />
            <span>Non sollevare gli arti inferiori: con una lesione la manovra rischia di peggiorarla. Lascia la vittima supina.</span>
          </p>
        )}
        {trauma !== null && <p className="text-ink-soft">Se in questa posizione non sta comoda, non costringerla: lasciala nella posizione più confortevole possibile.</p>}
      </div>
      {trauma === false && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {start === null ? (
            <Button
              variant="must"
              onClick={() => {
                setStart(Date.now())
                setNow(Date.now())
              }}
            >
              <Timer className="size-5" aria-hidden /> Avvia il promemoria dei 7 minuti
            </Button>
          ) : (
            <>
              <p className="font-display text-[2rem] font-extrabold leading-none" role="timer" aria-label={`Gambe sollevate da ${clock.text}`}>
                {clock.text}
              </p>
              <Button variant="quiet" onClick={() => setStart(null)}>
                Azzera
              </Button>
            </>
          )}
          <p className="w-full text-center text-[0.92rem]" aria-live="polite">
            {clock.over ? 'Limite raggiunto: gli arti inferiori vanno tenuti sollevati per meno di 7 minuti.' : clock.near ? 'Manca meno di un minuto al limite dei 7 minuti.' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

/** Isothermal blanket: pick the side that faces out for the scenario. */
export function Blanket() {
  const [scene, setScene] = useState<'freddo' | 'sole'>('freddo')
  const [side, setSide] = useState<Side | null>(null)
  const want: Side = scene === 'freddo' ? 'oro' : 'argento'
  const fb: Record<string, string> = {
    'freddo-oro': 'Esatto: con il lato oro all’esterno la coperta protegge dall’ipotermia, cioè dall’abbassamento della temperatura corporea.',
    'freddo-argento': 'Non è così: il lato argento fuori protegge dal caldo, perché riflette la luce del sole. Contro il freddo va fuori il lato oro.',
    'sole-argento': 'Esatto: il lato argento all’esterno riflette la luce del sole e protegge dal caldo. All’aperto, metti anche la vittima all’ombra.',
    'sole-oro': 'Non è così: il lato oro fuori protegge dall’ipotermia. Al sole va fuori il lato argento, che riflette la luce. E all’aperto la vittima va messa all’ombra.',
  }
  const Icon = scene === 'freddo' ? Snowflake : Sun

  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6" role="group" aria-label="Esercizio: la coperta isotermica">
      <p className="font-display text-[1.3rem] font-bold leading-tight">Gira la coperta</p>
      <p className="mt-1 text-ink-soft">Scegli la situazione, poi il lato da tenere all’esterno.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(['freddo', 'sole'] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={scene === s}
            onClick={() => {
              setScene(s)
              setSide(null)
            }}
            className={`inline-flex items-center gap-2 rounded-chip px-4 py-2 font-bold ring-2 ring-inset transition-colors duration-150 ${scene === s ? 'bg-must text-on-sign ring-must' : 'bg-ground ring-line hover:ring-ink-soft'}`}
          >
            {s === 'freddo' ? <Snowflake className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
            {s === 'freddo' ? 'Fa freddo' : 'Sole forte'}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:items-center">
        <div className="relative">
          <Icon className="absolute right-2 top-0 size-10 text-ink-soft" aria-hidden />
          <SupineBody blanket={side ?? undefined} label={side ? `Vittima supina avvolta nella coperta con il lato ${side} all’esterno` : 'Vittima supina senza coperta'} />
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {(['oro', 'argento'] as const).map((s) => (
              <button key={s} type="button" aria-pressed={side === s} onClick={() => setSide(s)} className={`inline-flex items-center gap-2 rounded-chip px-4 py-2 font-bold ring-2 ring-inset transition-colors duration-150 ${side === s ? 'bg-must text-on-sign ring-must' : 'bg-ground ring-line hover:ring-ink-soft'}`}>
                <span className="size-4 rounded-[3px]" style={{ background: sideFill[s] }} aria-hidden />
                {s === 'oro' ? 'Oro all’esterno' : 'Argento all’esterno'}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {side && (
              <p className={`mt-4 rounded-chip p-4 ${side === want ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
                {fb[`${scene}-${side}`]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** One visual per step of the shock-management skill. */
export const shockStepArt: ReactNode[] = [
  <Sign key="1" glyph="scudo" />,
  <Sign key="2" glyph="ritmo" />,
  <Sign key="3" glyph="telefono" />,
  <div key="4">{bleedArt[2]}</div>,
  <SupineBody key="5" label="Vittima supina: le vie aeree vanno mantenute pervie">
    {[0, 1, 2].map((i) => (
      <motion.circle key={i} cx="8" cy="70" r="4" fill="var(--must)" animate={{ x: [0, 22], y: [0, 26], opacity: [0, 1, 0] }} transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }} />
    ))}
  </SupineBody>,
  <SupineBody key="6" label="Il soccorritore, in ginocchio, conforta la vittima con una mano sulla spalla">
    <Rescuer />
  </SupineBody>,
  <LegRaise key="7" />,
  <SupineBody key="8" legsUp blanket="oro" label="Vittima supina con gambe sollevate, coperta con il lato oro all’esterno per proteggerla dal freddo" />,
  <SupineBody key="9" label="Il soccorritore tocca la spalla della vittima per valutarne la reattività">
    <Rescuer tap />
  </SupineBody>,
  <SupineBody key="10" breathe label="Il torace della vittima si alza e si abbassa: continua a respirare" />,
]
