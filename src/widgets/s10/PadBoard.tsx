import { Check, RotateCcw, X } from 'lucide-react'
import { motion, useMotionValue } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui'
import { H, judge, SPOTS, W, type Body, type Verdict } from './pads'

type Pad = { x: number; y: number; v?: Verdict }
const PAD_W = 46
const PAD_H = 34
const TRAY: Pad[] = [
  { x: 112, y: 372 },
  { x: 208, y: 372 },
]
const pct = (v: number, of: number) => `${(v / of) * 100}%`

/** Front view of the chest in sign-pictogram style. The victim faces you: her right is on your left. */
function Chest({ body }: { body: Body }) {
  const skin = 'var(--well-soft)'
  const mark = 'var(--well-2)'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="160" cy="32" r="26" fill={skin} />
      <rect x="146" y="50" width="28" height="34" rx="8" fill={skin} />
      <path d="M80 100 32 296" stroke={skin} strokeWidth="24" strokeLinecap="round" />
      <path d="M240 100 288 296" stroke={skin} strokeWidth="24" strokeLinecap="round" />
      <path d="M104 86Q160 74 216 86L242 96Q256 106 254 140L248 240Q242 290 232 334H88Q78 290 72 240L66 140Q64 106 78 96Z" fill={skin} />
      <path d="M154 96 102 90M166 96 218 90" stroke={mark} strokeWidth="5" strokeLinecap="round" />
      <rect x="155" y="100" width="10" height="100" rx="4" fill={mark} fillOpacity="0.7" />
      {body === 'uomo' && (
        <g fill="none" stroke={mark} strokeWidth="3" strokeLinecap="round">
          <path d="M98 168Q122 192 150 176M170 176Q198 192 222 168" />
          <circle cx="122" cy="178" r="3.5" fill={mark} stroke="none" />
          <circle cx="198" cy="178" r="3.5" fill={mark} stroke="none" />
        </g>
      )}
      {body === 'donna' && (
        <g fill={mark} fillOpacity="0.55">
          <circle cx="122" cy="190" r="24" />
          <circle cx="198" cy="190" r="24" />
        </g>
      )}
      {body === 'seno' && (
        <g fill={mark} fillOpacity="0.55">
          <circle cx="124" cy="204" r="32" />
          <circle cx="196" cy="204" r="32" />
        </g>
      )}
      <path d="M243 140V310" stroke={mark} strokeWidth="2" strokeDasharray="5 6" />
      <g fill="var(--well-ink)" fontSize="12" textAnchor="middle">
        <text x="70" y="352">destra della vittima</text>
        <text x="250" y="352">sinistra della vittima</text>
      </g>
    </svg>
  )
}

/**
 * Drag the two electrodes onto the chest, or press an electrode and then a point (keyboard). For use inside a <Stage>.
 * Calls `onMiss` with the explanation of each wrong placement and `onDone` once both are right.
 */
export function PadBoard({ body, onDone, onMiss }: { body: Body; onDone?: () => void; onMiss?: (why: string) => void }) {
  const board = useRef<HTMLDivElement>(null)
  const [pads, setPads] = useState<Pad[]>(TRAY)
  const [sel, setSel] = useState<number | null>(null)
  const [msg, setMsg] = useState<Verdict | null>(null)
  const [hover, setHover] = useState('')
  const dragged = useRef(false)
  const mv = [
    [useMotionValue(0), useMotionValue(0)],
    [useMotionValue(0), useMotionValue(0)],
  ]
  // After a drop the new position is in left/top: clear the drag offset before paint.
  useLayoutEffect(() => mv.flat().forEach((v) => v.set(0)), [pads]) // eslint-disable-line react-hooks/exhaustive-deps
  const done = pads.every((p) => p.v?.ok)

  const place = (i: number, x: number, y: number) => {
    const other = pads[1 - i].v
    const v = judge(body, Math.min(W, Math.max(0, x)), Math.min(H, Math.max(0, y)), other?.ok ? other.target : undefined)
    const next = pads.map((p, k) => (k === i ? { x, y, v } : p))
    setPads(next)
    setMsg(v)
    setSel(null)
    if (!v.ok) onMiss?.(v.why)
    else if (next.every((p) => p.v?.ok)) onDone?.()
  }
  const dropped = (i: number) => {
    const b = board.current?.getBoundingClientRect()
    if (!b) return
    place(i, pads[i].x + (mv[i][0].get() / b.width) * W, pads[i].y + (mv[i][1].get() / b.height) * H)
  }
  const reset = () => {
    setPads(TRAY)
    setMsg(null)
    setSel(null)
  }

  return (
    <div>
      <div ref={board} className="relative mx-auto aspect-[320/400] w-full max-w-[22rem] touch-none select-none" onKeyDown={(e) => e.key === 'Escape' && setSel(null)}>
        <Chest body={body} />
        {sel !== null &&
          SPOTS[body].map((s) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Applica qui l’elettrodo ${sel + 1}: ${s.label}`}
              title={s.label}
              onClick={() => place(sel, s.x, s.y)}
              onFocus={() => setHover(s.label)}
              onMouseEnter={() => setHover(s.label)}
              className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-well/70 ring-2 ring-lume transition-transform duration-150 hover:scale-110"
              style={{ left: pct(s.x, W), top: pct(s.y, H) }}
            />
          ))}
        {pads.map((p, i) => (
          <motion.button
            key={i}
            type="button"
            drag={!done}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={board}
            onDragStart={() => {
              dragged.current = true
              setSel(null)
            }}
            onDragEnd={() => dropped(i)}
            onClick={() => {
              if (dragged.current) dragged.current = false
              else if (!done) setSel(sel === i ? null : i)
            }}
            aria-pressed={sel === i}
            aria-label={`Elettrodo ${i + 1}: ${p.v ? (p.v.ok ? 'in posizione' : 'da spostare') : 'da applicare'}. Trascinalo, oppure premilo e scegli un punto sul torace.`}
            whileDrag={{ scale: 1.06 }}
            style={{ x: mv[i][0], y: mv[i][1], left: pct(p.x - PAD_W / 2, W), top: pct(p.y - PAD_H / 2, H), width: pct(PAD_W, W), height: pct(PAD_H, H) }}
            className={`absolute z-10 grid cursor-grab place-items-center rounded-[6px] bg-well-ink font-display text-[1.1rem] font-extrabold text-well shadow-raise ring-[3px] active:cursor-grabbing ${p.v?.ok ? 'ring-lume' : sel === i ? 'ring-must' : 'ring-transparent'}`}
          >
            <span className="flex items-center gap-0.5">
              {i + 1}
              {p.v && (p.v.ok ? <Check className="size-4" strokeWidth={3.5} aria-hidden /> : <X className="size-4" strokeWidth={3.5} aria-hidden />)}
            </span>
          </motion.button>
        ))}
      </div>
      <div className="mt-3 min-h-16 rounded-chip bg-well-2 p-3 text-[0.95rem]" aria-live="polite">
        {done ? (
          <p className="flex items-start gap-2 font-bold text-lume">
            <Check className="mt-0.5 size-5 shrink-0" strokeWidth={3} aria-hidden /> Entrambi gli elettrodi sono in posizione. Falli aderire bene premendoli con il palmo della mano.
          </p>
        ) : sel !== null ? (
          <p>
            Elettrodo {sel + 1} scelto: scegli un punto sul torace{hover ? ` (${hover})` : ''}. Esc per annullare.
          </p>
        ) : msg ? (
          <p className="flex items-start gap-2">
            {msg.ok ? <Check className="mt-0.5 size-5 shrink-0 text-lume" strokeWidth={3} aria-hidden /> : <X className="mt-0.5 size-5 shrink-0" strokeWidth={3} aria-hidden />}
            <span>{msg.why}</span>
          </p>
        ) : (
          <p className="text-well-soft">Trascina i due elettrodi sul torace nudo, oppure premi un elettrodo e poi un punto.</p>
        )}
      </div>
      {(msg || done) && (
        <Button variant="onDark" className="mt-3" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden /> Ricomincia
        </Button>
      )}
    </div>
  )
}
