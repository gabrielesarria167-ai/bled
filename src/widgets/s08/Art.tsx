import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

const ease = [0.23, 1, 0.32, 1] as const
const PHONE = 'M15.5 6.5 21 8l2 9-4.5 3.5c1.8 3.8 5 7 8.8 8.8L31 25l9 2 1.5 5.5c.3 1.2-.2 2.4-1.2 3.1-2.3 1.7-5.1 2.6-8 2.4C19.5 37 11 28.5 10 15.7c-.2-2.9.7-5.7 2.4-8 .7-1 1.9-1.5 3.1-1.2Z'
const HEART = 'M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7Z'

function Art({ label, children, viewBox = '0 0 240 160' }: { label: string; children: ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className="mx-auto w-full max-w-[22rem]" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/** The injured forearm seen from the side, wound on top. */
function Forearm({ wound = true }: { wound?: boolean }) {
  return (
    <g>
      <rect x="10" y="92" width="190" height="40" rx="20" fill="var(--ink-soft)" />
      <rect x="180" y="86" width="52" height="52" rx="24" fill="var(--ink-soft)" />
      {wound && <ellipse cx="104" cy="94" rx="20" ry="4.5" fill="var(--danger)" />}
    </g>
  )
}

/** Gloved hand pressing from above: palm plus the rescuer's forearm. */
function PressHand({ x = 104, y = 70 }: { x?: number; y?: number }) {
  return (
    <g fill="var(--must)">
      <rect x={x - 16} y={y - 70} width="32" height="58" rx="14" />
      <rect x={x - 34} y={y - 22} width="68" height="28" rx="12" />
    </g>
  )
}

function Gauze({ wide = false }: { wide?: boolean }) {
  return <rect x={wide ? 70 : 78} y="80" width={wide ? 68 : 52} height="20" rx="3" fill="var(--ground)" />
}

const press = { animate: { y: [0, 6, 6, 0] }, transition: { duration: 1.6, repeat: Infinity, times: [0, 0.2, 0.7, 1], ease: 'easeInOut' as const } }

export const stepArt: ReactNode[] = [
  <Art key="1" label="Guanto di protezione e lettere A, B, C: scena sicura e valutazione dell’ABC con i DPI">
    <g fill="var(--must)">
      <rect x="40" y="70" width="56" height="62" rx="14" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={42 + i * 14} y={34 - (i === 1 || i === 2 ? 6 : 0)} width="11" height="48" rx="5.5" />
      ))}
      <rect x="86" y="80" width="12" height="40" rx="6" transform="rotate(-38 92 100)" />
      <rect x="44" y="128" width="48" height="16" rx="4" />
    </g>
    <text x="172" y="104" textAnchor="middle" className="font-display" fontSize="46" fontWeight="800" fill="var(--ink)">
      ABC
    </text>
  </Art>,
  <Art key="2" label="Telefono: allertare il SME">
    <motion.g initial={{ rotate: 0 }} animate={{ rotate: [0, -8, 8, -8, 0, 0] }} transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }} style={{ originX: 0.5, originY: 0.5 }}>
      <path d={PHONE} transform="translate(72 22) scale(2.4)" fill="var(--must)" />
    </motion.g>
  </Art>,
  <Art key="3" label="Garza sulla ferita dell’avambraccio e mano guantata che preme">
    <Forearm />
    <Gauze />
    <motion.g {...press}>
      <PressHand y={74} />
    </motion.g>
  </Art>,
  <Art key="4" label="Bendaggio che copre per intero tampone e ferita">
    <Forearm />
    <Gauze />
    <motion.g style={{ originX: 0, originY: 0.5 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease, delay: 0.2 }}>
      <rect x="56" y="78" width="96" height="58" rx="8" fill="var(--ground)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={64 + i * 22} y="80" width="5" height="54" rx="2.5" fill="var(--line)" transform={`rotate(20 ${66 + i * 22} 107)`} />
      ))}
    </motion.g>
  </Art>,
  <RefillSim key="5" />,
  <Art key="6" label="Il soccorritore rassicura l’infortunato con una mano sulla spalla">
    <g fill="var(--ink-soft)">
      <circle cx="150" cy="40" r="16" />
      <rect x="126" y="62" width="48" height="66" rx="14" />
      <rect x="132" y="128" width="16" height="28" rx="6" />
      <rect x="152" y="128" width="16" height="28" rx="6" />
      <rect x="176" y="70" width="12" height="52" rx="6" />
      <rect x="174" y="96" width="16" height="14" rx="4" fill="var(--ground)" />
    </g>
    <g fill="var(--must)">
      <circle cx="70" cy="40" r="16" />
      <rect x="46" y="62" width="48" height="66" rx="14" />
      <rect x="52" y="128" width="16" height="28" rx="6" />
      <rect x="72" y="128" width="16" height="28" rx="6" />
      <rect x="88" y="62" width="50" height="12" rx="6" />
    </g>
  </Art>,
  <Art key="7" label="Braccio immobilizzato al petto con un bendaggio triangolare">
    <g fill="var(--ink-soft)">
      <circle cx="120" cy="28" r="18" />
      <rect x="82" y="52" width="76" height="100" rx="16" />
      <rect x="62" y="56" width="16" height="64" rx="8" />
      <rect x="160" y="56" width="16" height="50" rx="8" />
      <rect x="96" y="96" width="80" height="16" rx="8" />
    </g>
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: 0.2 }}>
      <path d="M88 92h96l-22 34H96Z" fill="var(--must)" />
      <rect x="108" y="46" width="10" height="52" rx="5" transform="rotate(-28 113 72)" fill="var(--must)" />
      <rect x="146" y="46" width="10" height="50" rx="5" transform="rotate(14 151 72)" fill="var(--must)" />
    </motion.g>
  </Art>,
  <Art key="8" label="Cuore e tracciato: valutare i segni vitali e cercare i segni di shock">
    <motion.g style={{ originX: 0.5, originY: 0.5 }} animate={{ scale: [1, 1.12, 1, 1] }} transition={{ duration: 1, repeat: Infinity, times: [0, 0.15, 0.35, 1] }}>
      <path d={HEART} transform="translate(18 26) scale(2.3)" fill="var(--danger)" />
    </motion.g>
    <path d="M130 86h18l9-26 14 48 11-34 6 12h32" fill="none" stroke="var(--must)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
  </Art>,
]

/** Capillary refill: press the nail, let go, watch the pink come back quickly. */
export function RefillSim() {
  const [down, setDown] = useState(false)
  const [tried, setTried] = useState(false)
  const start = () => {
    setDown(true)
    setTried(true)
  }
  return (
    <div>
      <button
        type="button"
        className="block w-full touch-none select-none rounded-plate"
        aria-label="Unghia: tieni premuto per comprimerla, poi rilascia"
        aria-pressed={down}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          start()
        }}
        onPointerUp={() => setDown(false)}
        onPointerCancel={() => setDown(false)}
        onKeyDown={(e) => {
          if (e.key !== ' ' && e.key !== 'Enter') return
          e.preventDefault()
          if (!e.repeat) start()
        }}
        onKeyUp={() => setDown(false)}
        onBlur={() => setDown(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        <svg viewBox="0 0 240 160" className="mx-auto w-full max-w-[22rem]" aria-hidden>
          <rect x="20" y="70" width="190" height="56" rx="28" fill="var(--ink-soft)" />
          <rect x="140" y="78" width="60" height="38" rx="14" fill="var(--well-ink)" />
          <rect x="140" y="78" width="60" height="38" rx="14" fill="var(--danger)" className="transition-opacity ease-out" style={{ opacity: down ? 0 : 0.45, transitionDuration: down ? '120ms' : '450ms' }} />
          <motion.g initial={false} animate={{ y: down ? 0 : -30, opacity: down ? 1 : 0.35 }} transition={{ duration: 0.15, ease }}>
            <rect x="150" y="30" width="40" height="44" rx="18" fill="var(--must)" />
          </motion.g>
        </svg>
      </button>
      <p className="mt-2 text-center text-[0.92rem] leading-snug" aria-live="polite">
        {down ? 'Stai premendo: sotto l’unghia il colore sbiadisce.' : tried ? 'Rilasciato: il colore rosato torna rapidamente. La circolazione non è bloccata.' : 'Tieni premuto sull’unghia, poi rilascia.'}
      </p>
    </div>
  )
}

/** Body response: nearby vessels narrow and platelets plug the breach. */
export function BodyResponse() {
  const [on, setOn] = useState(false)
  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:items-center">
        <svg viewBox="0 0 320 150" className="w-full" role="img" aria-label={on ? 'Il vaso si restringe vicino alla ferita e le piastrine formano un tappo che chiude la rottura' : 'Un vaso rotto da cui esce sangue'}>
          <motion.rect x="0" y="40" width="320" height="10" rx="5" fill="var(--ink-soft)" initial={false} animate={{ y: on ? 12 : 0 }} transition={{ duration: 0.5, ease }} />
          <motion.g initial={false} animate={{ scaleY: on ? 0.6 : 1 }} style={{ originX: 0.5, originY: 0.5 }} transition={{ duration: 0.5, ease }}>
            <rect x="0" y="50" width="320" height="50" fill="var(--danger)" opacity="0.85" />
          </motion.g>
          {/* lower wall with its breach */}
          <motion.g initial={false} animate={{ y: on ? -12 : 0 }} transition={{ duration: 0.5, ease }}>
            <rect x="0" y="100" width="320" height="10" rx="5" fill="var(--ink-soft)" />
            <rect x="150" y="98" width="20" height="14" fill="var(--panel)" />
          </motion.g>
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx="160" cy="118" r="4" fill="var(--danger)" initial={false} animate={on ? { opacity: 0, y: 0 } : { opacity: [0, 1, 0], y: [0, 26] }} transition={on ? { duration: 0.2 } : { duration: 1.2, delay: i * 0.4, repeat: Infinity, ease: 'easeIn' }} />
          ))}
          {[[-26, -20], [24, -16], [-40, 6], [36, 4], [-8, -24], [10, 0]].map(([dx, dy], i) => (
            <motion.rect key={i} width="9" height="6" rx="3" fill="var(--ground)" initial={false} animate={on ? { x: 148 + (i % 3) * 6, y: 86 + Math.floor(i / 3) * 6, opacity: 1 } : { x: 160 + dx * 2.4, y: 72 + dy, opacity: 0.85 }} transition={{ duration: 0.6, delay: on ? 0.25 + i * 0.05 : 0, ease }} />
          ))}
        </svg>
        <div aria-live="polite">
          <p className="font-display text-[1.3rem] font-bold leading-tight">{on ? 'Costrizione e coagulo' : 'Un vaso che sanguina'}</p>
          <p className="mt-1">{on ? 'I vasi vicini al punto che sanguina si restringono e le piastrine formano il coagulo, che chiude la rottura.' : 'Il sangue esce dalla rottura della parete. Premi il pulsante per vedere come reagisce il corpo.'}</p>
          <button type="button" onClick={() => setOn(!on)} className="mt-4 inline-flex items-center rounded-chip px-4 py-2 font-bold ring-2 ring-inset ring-line hover:ring-ink-soft">
            {on ? 'Torna alla ferita' : 'Mostra la reazione del corpo'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** The tools for bleeding that direct pressure cannot control. */
export function ToolsArt() {
  const tools = [
    {
      name: 'Benda emostatica (per esempio la benda israeliana)',
      art: (
        <>
          <rect x="6" y="50" width="148" height="34" rx="17" fill="var(--ink-soft)" />
          <rect x="54" y="40" width="54" height="54" rx="6" fill="var(--ground)" />
          <rect x="72" y="52" width="18" height="30" rx="4" fill="var(--must)" />
        </>
      ),
    },
    {
      name: 'Tourniquet',
      art: (
        <>
          <rect x="6" y="50" width="148" height="34" rx="17" fill="var(--ink-soft)" />
          <rect x="70" y="44" width="16" height="46" rx="4" fill="var(--ink)" />
          <rect x="56" y="30" width="44" height="10" rx="5" fill="var(--must)" transform="rotate(-20 78 35)" />
          <rect x="72" y="36" width="12" height="12" rx="2" fill="var(--ink)" />
        </>
      ),
    },
    {
      name: 'Agenti emostatici, come la garza emostatica',
      art: (
        <>
          <rect x="34" y="28" width="92" height="74" rx="8" fill="var(--panel-2)" />
          <rect x="50" y="44" width="60" height="42" rx="21" fill="var(--ground)" />
          <rect x="58" y="60" width="44" height="10" rx="5" fill="var(--must)" />
        </>
      ),
    },
  ]
  return (
    <figure className="mount my-8">
      <div className="grid gap-4 rounded-plate bg-panel p-5 sm:grid-cols-3">
        {tools.map((t) => (
          <div key={t.name} className="min-w-0">
            <svg viewBox="0 0 160 120" className="mx-auto w-full max-w-[12rem]" role="img" aria-label={t.name}>
              {t.art}
            </svg>
            <p className="mt-2 text-center font-bold leading-snug">{t.name}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">Strumenti da usare quando la pressione diretta non basta, nelle lesioni agli arti e nelle amputazioni.</figcaption>
    </figure>
  )
}
