import { motion } from 'motion/react'
import { useState } from 'react'
import { Button, SignMark } from '../../components/ui'

export const tones = {
  light: { body: 'var(--ink)', res: 'var(--ink-soft)', act: 'var(--must)', floor: 'var(--line)', bg: 'var(--panel)' },
  well: { body: 'var(--well-ink)', res: 'var(--well-soft)', act: 'var(--lume)', floor: 'var(--well-2)', bg: 'var(--well)' },
}
type Tone = keyof typeof tones

const drop = (x: number, y: number, s = 1) => `M${x} ${y - 8 * s}C${x + 3 * s} ${y - 3 * s} ${x + 5.5 * s} ${y} ${x + 5.5 * s} ${y + 2.5 * s}A${5.5 * s} ${5.5 * s} 0 0 1 ${x - 5.5 * s} ${y + 2.5 * s}C${x - 5.5 * s} ${y} ${x - 3 * s} ${y - 3 * s} ${x} ${y - 8 * s}Z`

/** Side view: the rescuer kneels behind a supine victim with stacked hands on the centre of the chest. */
export function RcpPictogram({ tone = 'light', pressing = false, label, className = '' }: { tone?: Tone; pressing?: boolean; label: string; className?: string }) {
  const c = tones[tone]
  return (
    <svg viewBox="0 0 320 170" role="img" aria-label={label} className={`block h-auto w-full ${className}`}>
      <motion.g animate={pressing ? { y: [0, 5, 0] } : { y: 0 }} transition={pressing ? { duration: 0.55, repeat: Infinity, ease: 'easeOut' } : { duration: 0 }}>
        <g fill="none" stroke={c.res} strokeLinecap="round" strokeLinejoin="round">
          <path d="M160 104 L150 146 L214 148" strokeWidth="20" />
          <path d="M162 104 L124 60" strokeWidth="26" />
          <path d="M122 66 L112 116" strokeWidth="12" />
        </g>
        <circle cx="112" cy="36" r="15" fill={c.res} />
        <rect x="100" y="114" width="24" height="12" rx="5" fill={c.act} />
      </motion.g>
      <g fill="none" stroke={c.body} strokeLinecap="round">
        <path d="M84 138 L172 138" strokeWidth="26" />
        <path d="M190 141 L298 143" strokeWidth="17" />
      </g>
      <circle cx="54" cy="136" r="15" fill={c.body} />
      <rect x="20" y="153" width="290" height="6" rx="3" fill={c.floor} />
    </svg>
  )
}

/** Front view of someone lying on their side: the fluids leave the mouth by gravity. */
export function SideFluids({ tone = 'light', label, className = '' }: { tone?: Tone; label: string; className?: string }) {
  const c = tones[tone]
  return (
    <svg viewBox="0 0 320 170" role="img" aria-label={label} className={`block h-auto w-full ${className}`}>
      <g fill="none" stroke={c.body} strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 132 L112 132" strokeWidth="11" />
        <path d="M110 112 L196 116" strokeWidth="30" />
        <path d="M200 120 L298 126" strokeWidth="16" />
        <path d="M206 112 L244 80 L274 120" strokeWidth="16" stroke={c.bg} />
        <path d="M206 112 L244 80 L274 120" strokeWidth="11" />
        <path d="M132 104 L150 76 L138 50" strokeWidth="10" />
      </g>
      <circle cx="74" cy="104" r="17" fill={c.body} />
      <g fill={c.act}>
        <path d={drop(56, 128)} />
        <path d={drop(50, 144, 0.8)} />
        <path d={drop(56, 156, 0.6)} />
      </g>
      <path d="M24 70 V138 M14 126 L24 140 L34 126" fill="none" stroke={c.res} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="24" y="58" textAnchor="middle" fontSize="13" fill={c.res}>
        gravità
      </text>
      <rect x="20" y="162" width="290" height="6" rx="3" fill={c.floor} />
    </svg>
  )
}

/** A head seen in profile with the mouth open; the finger either picks out what shows or probes blindly. */
function MouthPanel({ ok }: { ok: boolean }) {
  const c = tones.light
  return (
    <svg viewBox="0 0 200 150" role="img" aria-label={ok ? 'Due dita prendono il corpo estraneo che affiora dalla bocca aperta' : 'Un dito spinto in profondità nella bocca senza vedere il corpo estraneo: da evitare'} className="block h-auto w-full">
      <path d="M86 28a48 48 0 1 0 41.6 72L86 76l41.6-24A48 48 0 0 0 86 28Z" fill={c.body} />
      <rect x={ok ? 116 : 96} y={ok ? 68 : 70} width="14" height="14" rx="3" fill={c.res} />
      {ok ? (
        <g fill="none" stroke={c.act} strokeWidth="9" strokeLinecap="round">
          <path d="M184 60 L134 70" />
          <path d="M184 92 L134 82" />
        </g>
      ) : (
        <>
          <path d="M186 74 L104 76" fill="none" stroke={c.act} strokeWidth="9" strokeLinecap="round" />
          <circle cx="160" cy="110" r="22" fill="var(--ground)" stroke="var(--danger)" strokeWidth="6" />
          <path d="m144.4 94.4 31.2 31.2" stroke="var(--danger)" strokeWidth="6" />
        </>
      )}
    </svg>
  )
}

export function SolidsFigure() {
  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2">
      {[true, false].map((ok) => (
        <div key={String(ok)}>
          <MouthPanel ok={ok} />
          <p className="mt-2 flex items-start gap-2 text-[0.92rem] leading-snug">
            <SignMark kind={ok ? 'nota' : 'divieto'} className="w-6" />
            {ok ? 'Solido visibile e affiorante: lo togli con le dita.' : 'Esplorazione alla cieca: rischi di spingerlo più in fondo.'}
          </p>
        </div>
      ))}
    </div>
  )
}

/** Front view of the torso: where the fist goes for the abdominal thrusts, and which way it pushes. */
export function FistPoint({ className = '' }: { className?: string }) {
  const c = tones.light
  return (
    <svg viewBox="0 0 280 230" role="img" aria-label="Busto visto di fronte: il pugno è appoggiato tra l’ombelico e la parte inferiore dello sterno; la freccia indica la spinta verso l’interno e verso l’alto" className={`block h-auto w-full ${className}`}>
      <circle cx="100" cy="30" r="20" fill={c.body} />
      <rect x="50" y="58" width="100" height="150" rx="26" fill={c.body} />
      <path d="M100 70 V116" stroke={c.bg} strokeWidth="8" strokeLinecap="round" />
      <circle cx="100" cy="178" r="5" fill={c.bg} />
      <circle cx="100" cy="146" r="17" fill={c.bg} />
      <circle cx="100" cy="146" r="13" fill={c.act} />
      <path d="M132 160 V128 M124 138 L132 126 L140 138" fill="none" stroke={c.act} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g fill={c.res} fontSize="13">
        <path d="M106 94 H168" stroke={c.res} strokeWidth="1.5" />
        <text x="172" y="98">sterno</text>
        <path d="M117 146 H168" stroke={c.res} strokeWidth="1.5" />
        <text x="172" y="150">pugno</text>
        <path d="M106 178 H168" stroke={c.res} strokeWidth="1.5" />
        <text x="172" y="182">ombelico</text>
      </g>
    </svg>
  )
}

/**
 * Profile of a supine head: with the head flexed the tongue falls back and closes the airway;
 * "piega il capo – solleva il mento" lifts it away. The learner toggles between the two states.
 */
export function AirwayFigure() {
  const [open, setOpen] = useState(false)
  const c = tones.light
  const ease = 'transition-transform duration-500 ease-out motion-reduce:transition-none'
  return (
    <div className="p-4">
      <svg viewBox="0 0 340 200" role="img" aria-label={open ? 'Capo esteso e mento sollevato: la lingua si stacca dalla parete della gola e le vie aeree sono aperte' : 'Persona non cosciente supina: la lingua è caduta all’indietro e chiude le vie aeree'} className="mx-auto block h-auto w-full max-w-[32rem]">
        <rect x="196" y="122" width="160" height="60" rx="28" fill={c.body} />
        <rect x="140" y="128" width="84" height="40" rx="14" fill={c.body} />
        <path d="M150 140 L240 150" stroke={c.bg} strokeWidth="11" strokeLinecap="round" />
        <g className={ease} style={{ transformBox: 'view-box', transformOrigin: '160px 148px', transform: `rotate(${open ? -16 : 6}deg)` }}>
          <circle cx="104" cy="120" r="56" fill={c.body} />
          <circle cx="146" cy="86" r="22" fill={c.body} />
          <circle cx="110" cy="62" r="10" fill={c.body} />
          <path d="M128 66 Q128 118 152 140" fill="none" stroke={c.bg} strokeWidth="11" strokeLinecap="round" />
          <ellipse rx="17" ry="11" fill={c.res} className={ease} style={{ transform: open ? 'translate(114px, 96px) rotate(-30deg)' : 'translate(134px, 118px) rotate(-50deg)' }} />
          <g className="transition-opacity duration-300" opacity={open ? 1 : 0}>
            <path d="M190 74 L164 98" stroke={c.act} strokeWidth="9" strokeLinecap="round" />
            <path d="M40 66 L66 82" stroke={c.act} strokeWidth="9" strokeLinecap="round" />
          </g>
        </g>
        <rect x="10" y="188" width="320" height="6" rx="3" fill={c.floor} />
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Button variant="must" onClick={() => setOpen(!open)} aria-pressed={open}>
          {open ? 'Rilascia la testa' : 'Piega il capo, solleva il mento'}
        </Button>
        <p aria-live="polite" className="min-w-[14rem] flex-1 text-[0.95rem]">
          {open ? 'Vie aeree aperte: la lingua non chiude più il passaggio.' : 'Vie aeree chiuse: la lingua, senza tono muscolare, è caduta all’indietro.'}
        </p>
      </div>
    </div>
  )
}
