import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

type Part = 'plasma' | 'rossi' | 'bianchi' | 'piastrine'

const ease = [0.23, 1, 0.32, 1] as const

const parts: { id: Part; name: string; share: string; info: ReactNode }[] = [
  {
    id: 'plasma',
    name: 'Plasma',
    share: '55%',
    info: (
      <>
        <p>
          Un fluido di colore <strong>giallo chiaro</strong>: è la parte liquida del sangue. In esso sono disciolte le componenti corpuscolate, cioè le cellule e le particelle solide.
        </p>
        <p>Nel plasma è disciolta anche la piccola parte di O2 che non viaggia legata all’emoglobina.</p>
      </>
    ),
  },
  {
    id: 'rossi',
    name: 'Globuli rossi',
    share: '44%',
    info: (
      <ul>
        <li>
          Contengono l’<strong>emoglobina</strong>, che dà al sangue il suo tipico colore rosso.
        </li>
        <li>
          L’emoglobina è il <strong>principale vettore dell’O2</strong> nel corpo: in condizioni normali, quando il sangue esce dai polmoni, ne è satura per <strong>circa il 97%</strong>.
        </li>
        <li>
          <strong>Circa il 98,5%</strong> dell’O2 presente nel sangue è legato chimicamente all’emoglobina; il resto è disciolto nel plasma.
        </li>
        <li>
          Portano anche la <strong>CO2 ai polmoni</strong>, da dove viene eliminata.
        </li>
      </ul>
    ),
  },
  {
    id: 'bianchi',
    name: 'Globuli bianchi',
    share: '1% insieme alle piastrine',
    info: (
      <p>
        Sono le cellule del <strong>sistema immunitario</strong>. Difendono il corpo dalle <strong>infezioni</strong> e dalle <strong>aggressioni esterne</strong> con meccanismi di difesa molto complessi, come la <strong>produzione di anticorpi</strong>.
      </p>
    ),
  },
  {
    id: 'piastrine',
    name: 'Piastrine (trombociti)',
    share: '1% insieme ai globuli bianchi',
    info: (
      <p>
        Piccole cellule con un ruolo importante nella <strong>coagulazione</strong>. Quando c’è un sanguinamento formano un <strong>coagulo</strong>: un vero e proprio “tappo” che ferma la perdita di sangue.
      </p>
    ),
  },
]

// Tube liquid runs from y=40 to y=290: 250 units split 55 / 1 / 44, as in a settled sample (plasma on top).
const TOP = 40
const H = 250
const plasmaH = H * 0.55
const buffyH = H * 0.01
const redH = H * 0.44

/** Lens contents: what each component looks like up close. */
function Lens({ part }: { part: Part }) {
  if (part === 'plasma')
    return (
      <>
        <circle r="46" fill="var(--warn)" opacity="0.4" />
        {[[-20, -14], [12, -24], [24, 8], [-8, 18], [-26, 10], [6, -2]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="var(--ink-soft)" />
        ))}
      </>
    )
  if (part === 'rossi')
    return (
      <>
        <circle r="46" fill="var(--danger)" opacity="0.16" />
        {[[-18, -16], [16, -20], [22, 14], [-14, 18], [0, 0]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse rx="13" ry="11" fill="var(--danger)" />
            <ellipse rx="5.5" ry="4.5" fill="var(--ground)" opacity="0.3" />
          </g>
        ))}
      </>
    )
  if (part === 'bianchi')
    return (
      <>
        <circle r="46" fill="var(--panel-2)" />
        <circle cx="-4" cy="-2" r="22" fill="var(--ground)" />
        <path d="M-14 -6a7 7 0 1 1 10 6 7 7 0 1 1 8 10 6 6 0 1 1-12-2 6 6 0 0 1-6-14Z" fill="var(--must)" />
        <ellipse cx="24" cy="24" rx="8" ry="7" fill="var(--danger)" opacity="0.7" />
      </>
    )
  return (
    <>
      <circle r="46" fill="var(--panel-2)" />
      {[[-18, -10, 20], [10, -20, -30], [18, 10, 50], [-6, 18, 10], [-24, 14, -40], [2, -2, 70]].map(([x, y, r], i) => (
        <rect key={i} x={x - 5} y={y - 3} width="10" height="6" rx="3" transform={`rotate(${r} ${x} ${y})`} fill="var(--ink-soft)" />
      ))}
    </>
  )
}

/** Blood in a settled tube, drawn to the manual's proportions. Pick a component to read what it does. */
export function BloodTube() {
  const [part, setPart] = useState<Part>('rossi')
  const sel = parts.find((p) => p.id === part)!
  const dim = (p: Part | Part[]) => ([] as Part[]).concat(p).includes(part) ? 1 : 0.35
  const lensY = part === 'plasma' ? TOP + plasmaH / 2 : part === 'rossi' ? TOP + plasmaH + buffyH + redH / 2 : TOP + plasmaH + buffyH / 2

  return (
    <div className="mount my-8 grid gap-6 rounded-plate bg-panel p-5 md:grid-cols-[minmax(0,17rem)_1fr] md:p-6">
      <svg viewBox="0 0 250 320" className="mx-auto w-full max-w-[17rem]" role="img" aria-label="Provetta di sangue: in alto il plasma, 55%; al centro una sottile fascia di globuli bianchi e piastrine, 1%; in basso i globuli rossi, 44%">
        {/* glass */}
        <path d="M18 18h84v262a42 42 0 0 1-84 0Z" fill="var(--panel-2)" />
        <clipPath id="s08-tube">
          <path d="M26 40h68v240a34 34 0 0 1-68 0Z" />
        </clipPath>
        <g clipPath="url(#s08-tube)">
          <rect x="26" y={TOP} width="68" height={plasmaH} fill="var(--warn)" opacity={0.5 * dim('plasma')} className="cursor-pointer transition-opacity duration-200" onClick={() => setPart('plasma')} />
          <rect x="26" y={TOP + plasmaH} width="68" height={buffyH} fill="var(--ground)" opacity={dim(['bianchi', 'piastrine'])} />
          <rect x="26" y={TOP + plasmaH + buffyH} width="68" height={redH + 40} fill="var(--danger)" opacity={dim('rossi')} className="cursor-pointer transition-opacity duration-200" onClick={() => setPart('rossi')} />
        </g>
        {/* leader from the selected layer to the lens, moved as one piece */}
        <motion.g initial={false} animate={{ y: lensY }} transition={{ duration: 0.25, ease }}>
          <rect x="96" y="-1.25" width="56" height="2.5" fill="var(--ink)" />
          <g transform="translate(196 0)">
            <circle r="52" fill="var(--ink)" />
            <clipPath id="s08-lens">
              <circle r="46" />
            </clipPath>
            <g clipPath="url(#s08-lens)">
              <AnimatePresence mode="wait" initial={false}>
                <motion.g key={part} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }}>
                  <Lens part={part} />
                </motion.g>
              </AnimatePresence>
            </g>
          </g>
        </motion.g>
        <text x="60" y="34" textAnchor="middle" className="font-display" fontSize="13" fontWeight="700" fill="var(--ink-soft)">
          provetta
        </text>
      </svg>

      <div className="min-w-0">
        <p className="font-display text-[1.3rem] font-bold leading-tight">Scegli una componente</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Componenti del sangue">
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={part === p.id}
              onClick={() => setPart(p.id)}
              className={`rounded-chip px-3 py-2 text-left text-[0.95rem] leading-tight ring-2 ring-inset transition-colors duration-150 ${part === p.id ? 'bg-must text-on-sign ring-must' : 'bg-ground ring-line hover:ring-ink-soft'}`}
            >
              <span className="block font-bold">{p.name}</span>
              <span className="block text-[0.82rem] opacity-85">{p.share}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 [&>*+*]:mt-2 [&_ul]:list-[square] [&_ul]:space-y-1.5 [&_ul]:pl-5" aria-live="polite">
          <p className="font-display text-[1.6rem] font-extrabold leading-none">
            {sel.name} <span className="text-[1.1rem] font-bold text-ink-soft">{sel.share}</span>
          </p>
          {sel.info}
        </div>
        <p className="mt-5 text-[0.88rem] text-ink-soft">
          Il 45% del sangue è fatto di cellule o particelle solide: 44% globuli rossi, 1% globuli bianchi e piastrine. Il restante 55% è plasma.
        </p>
      </div>
    </div>
  )
}
