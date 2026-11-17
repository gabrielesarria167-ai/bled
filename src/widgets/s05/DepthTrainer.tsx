import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { approach, judgeDepth, MAX_CM, PRESS_TAU, RELEASE_TAU, RELEASED_CM, type DepthVerdict } from './timing'

const word: Record<DepthVerdict, string> = { poco: 'Troppo poco', giusto: 'Giusto', troppo: 'Troppo' }
const advice: Record<DepthVerdict, string> = {
  poco: 'spingi più a fondo, almeno 5 cm.',
  giusto: 'sei tra 5 e 6 cm.',
  troppo: 'hai superato i 6 cm, rilascia prima.',
}
const cm = (n: number) => n.toFixed(1).replace('.', ',')
const G = 18 // gauge px per cm
const K = 4 // chest wall px per cm

/** Press and hold (pointer or Space) to push the sternum down; the gauge shows the depth against 5–6 cm. */
export function DepthTrainer() {
  const [depth, setDepth] = useState(0)
  const [pressed, setPressed] = useState(false)
  const [last, setLast] = useState<{ v: DepthVerdict; max: number; released: boolean } | null>(null)
  const [tally, setTally] = useState({ n: 0, ok: 0 })
  const d = useRef(0)
  const pressing = useRef(false)
  const max = useRef(0)
  const releasedBefore = useRef(true)
  const raf = useRef(0)
  const t0 = useRef(0)

  const tick = (t: number) => {
    const dt = Math.min(50, t - t0.current)
    t0.current = t
    d.current = approach(d.current, pressing.current ? MAX_CM : 0, dt, pressing.current ? PRESS_TAU : RELEASE_TAU)
    if (pressing.current) max.current = Math.max(max.current, d.current)
    if (!pressing.current && d.current < 0.02) d.current = 0
    setDepth(d.current)
    raf.current = pressing.current || d.current > 0 ? requestAnimationFrame(tick) : 0
  }
  const run = () => {
    if (raf.current) return
    t0.current = performance.now()
    raf.current = requestAnimationFrame(tick)
  }
  const press = () => {
    if (pressing.current) return
    releasedBefore.current = d.current < RELEASED_CM
    pressing.current = true
    max.current = d.current
    setPressed(true)
    run()
  }
  const release = () => {
    if (!pressing.current) return
    pressing.current = false
    setPressed(false)
    const v = judgeDepth(max.current)
    const released = releasedBefore.current
    setLast({ v, max: max.current, released })
    setTally((t) => ({ n: t.n + 1, ok: t.ok + (v === 'giusto' && released ? 1 : 0) }))
    run()
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const back = !pressed && depth < RELEASED_CM

  return (
    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,24rem)_1fr]">
      <button
        type="button"
        aria-label="Torace: tieni premuto per comprimere, lascia andare per farlo risalire"
        className="touch-none select-none rounded-plate bg-well-2 p-3"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          press()
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key !== ' ' && e.key !== 'Enter') return
          e.preventDefault()
          if (!e.repeat) press()
        }}
        onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && release()}
        onBlur={release}
      >
        <svg viewBox="0 0 300 220" className="w-full" aria-hidden>
          {/* transverse section of the chest, seen from the feet: front at the top */}
          <ellipse cx="118" cy="146" rx="104" ry="56" fill="var(--well)" />
          <circle cx="118" cy="186" r="12" fill="var(--well-soft)" />
          <g style={{ transform: `scaleY(${1 - depth * 0.07})`, transformOrigin: '118px 162px', transformBox: 'view-box' }}>
            <ellipse cx="118" cy="140" rx="30" ry="22" fill="var(--well-soft)" opacity="0.6" />
          </g>
          <g style={{ transform: `translateY(${depth * K}px)` }}>
            <rect x="100" y="84" width="36" height="14" rx="5" fill="var(--well-ink)" />
            <rect x="92" y="66" width="52" height="16" rx="8" fill="var(--lume)" />
            <rect x="97" y="54" width="42" height="14" rx="7" fill="var(--lume)" opacity="0.75" />
            <rect x="104" y="-40" width="28" height="96" rx="10" fill="var(--lume)" opacity="0.45" />
          </g>
          <text x="118" y="152" textAnchor="middle" fontSize="11" fill="var(--well)">cuore</text>
          <text x="40" y="150" fontSize="11" fill="var(--well-soft)">torace</text>

          {/* depth gauge */}
          <rect x="232" y="30" width="24" height={8 * G} rx="4" fill="var(--well)" />
          <rect x="232" y={30 + 5 * G} width="24" height={G} fill="var(--lume)" opacity="0.3" />
          <rect x="232" y="30" width="24" height={8 * G} rx="4" fill="var(--lume)" style={{ transform: `scaleY(${depth / 8})`, transformOrigin: '0 30px', transformBox: 'view-box' }} />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <path d={`M226 ${30 + i * G}h6`} stroke="var(--well-soft)" strokeWidth="1.5" />
              <text x="222" y={34 + i * G} textAnchor="end" fontSize="11" fill="var(--well-soft)">{i}</text>
            </g>
          ))}
          <text x="262" y={30 + 5.5 * G + 4} fontSize="11" fontWeight="700" fill="var(--lume)">5–6</text>
          <text x="244" y="20" textAnchor="middle" fontSize="11" fill="var(--well-soft)">cm</text>
          <path d="M228 30h32" stroke="var(--well-ink)" strokeWidth="3" style={{ transform: `translateY(${depth * G}px)` }} />
        </svg>
      </button>

      <div>
        <p className="font-display text-[4rem] font-extrabold leading-none">
          {cm(depth)}
          <span className="ml-2 text-[1.5rem] font-bold">cm</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-[0.95rem] text-well-soft">
          <span className={`inline-block size-3 rounded-full ${back ? 'bg-lume' : 'bg-well-2'}`} aria-hidden />
          {back ? 'Rilascio completo: il torace è risalito, le mani restano appoggiate' : 'Torace compresso'}
        </p>
        <div aria-live="polite" className="mt-4 min-h-20">
          {last ? (
            <>
              <p className="font-display text-[1.6rem] font-bold leading-tight">
                {word[last.v]}: {cm(last.max)} cm, {advice[last.v]}
              </p>
              {!last.released && <p className="mt-1">Rilascio incompleto: prima di comprimere di nuovo lascia risalire del tutto il torace, senza staccare le mani.</p>}
            </>
          ) : (
            <p className="font-display text-[1.4rem] font-bold leading-tight">Tieni premuto il torace (o la barra spaziatrice) e lascia andare quando arrivi tra 5 e 6 cm.</p>
          )}
        </div>
        <p className="mt-3 text-[0.95rem] text-well-soft">
          Compressioni corrette (profondità giusta e rilascio completo): {tally.ok} di {tally.n}
        </p>
        <Button
          variant="onDark"
          className="mt-4"
          onClick={() => {
            setLast(null)
            setTally({ n: 0, ok: 0 })
          }}
        >
          <RotateCcw className="size-4" aria-hidden /> Ricomincia
        </Button>
      </div>
    </div>
  )
}
