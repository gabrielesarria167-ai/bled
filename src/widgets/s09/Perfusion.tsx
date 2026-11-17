import { motion } from 'motion/react'
import { useState } from 'react'

const ease = [0.23, 1, 0.32, 1] as const
const HEART = 'M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7Z'

/** A 3×3 block of cells; the first `healthy` keep their colour, the rest fade (ischaemia). */
function Cells({ x, y, healthy }: { x: number; y: number; healthy: number }) {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={x + (i % 3) * 15}
          y={y + Math.floor(i / 3) * 15}
          width="11"
          height="11"
          rx="3"
          fill={i < healthy ? 'var(--safe)' : 'var(--ink-soft)'}
          className="transition-opacity duration-300 ease-out"
          style={{ opacity: i < healthy ? 1 : 0.3 }}
        />
      ))}
    </g>
  )
}

/** Blood particles along a straight vessel; fewer and slower when perfusion drops. */
function Flow({ y, n, dur }: { y: number; n: number; dur: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <motion.circle key={`${n}-${i}`} cx="96" cy={y} r="5" fill="var(--danger)" initial={{ x: 0, opacity: 0 }} animate={{ x: [0, 150], opacity: [0, 1, 1, 0] }} transition={{ duration: dur, delay: (i * dur) / n, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.85, 1] }} />
      ))}
    </>
  )
}

/** Normal circulation vs shock: less blood and oxygen to the organs, lower pressure, the brain favoured. */
export function Perfusion() {
  const [shock, setShock] = useState(false)
  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Stato della circolazione">
        {[false, true].map((v) => (
          <button key={String(v)} type="button" aria-pressed={shock === v} onClick={() => setShock(v)} className={`rounded-chip px-4 py-2 font-bold ring-2 ring-inset transition-colors duration-150 ${shock === v ? 'bg-must text-on-sign ring-must' : 'bg-ground ring-line hover:ring-ink-soft'}`}>
            {v ? 'Shock' : 'Circolazione normale'}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:items-center">
        <svg viewBox="0 0 360 254" className="w-full" role="img" aria-label={shock ? 'Nello shock: pressione ridotta, poco sangue verso gli organi; il cervello ne riceve di più degli altri organi e tessuti, dove le cellule soffrono' : 'Circolazione normale: il cuore spinge molto sangue sia al cervello sia agli altri organi e tessuti'}>
          {/* vessels */}
          <g fill="var(--panel-2)">
            <rect x="84" y="46" width="14" height="138" rx="7" />
            <rect x="84" y="46" width="176" height="14" rx="7" />
            <rect x="84" y="170" width="176" height="14" rx="7" />
          </g>
          <Flow y={53} n={shock ? 3 : 6} dur={shock ? 3 : 2} />
          <Flow y={177} n={shock ? 1 : 6} dur={shock ? 3.6 : 2} />
          {/* heart */}
          <motion.g style={{ originX: 0.5, originY: 0.5 }} animate={{ scale: shock ? [1, 1.04, 1] : [1, 1.14, 1] }} transition={{ duration: shock ? 0.5 : 1, repeat: Infinity, ease: 'easeOut', times: [0, 0.25, 1] }}>
            <path d={HEART} transform="translate(8 80) scale(1.45)" fill="var(--danger)" />
          </motion.g>
          {/* brain */}
          <circle cx="300" cy="53" r="40" fill="var(--ink)" />
          <Cells x={278} y={31} healthy={shock ? 6 : 9} />
          <text x="300" y="112" textAnchor="middle" className="font-display" fontSize="16" fontWeight="700" fill="var(--ink)">
            Cervello
          </text>
          {/* other organs and tissues */}
          <rect x="262" y="140" width="76" height="76" rx="18" fill="var(--ink)" />
          <Cells x={278} y={156} healthy={shock ? 2 : 9} />
          <text textAnchor="middle" className="font-display" fontSize="16" fontWeight="700" fill="var(--ink)">
            <tspan x="300" y="232">Altri organi</tspan>
            <tspan x="300" y="248">e tessuti</tspan>
          </text>
          {/* arterial pressure */}
          <text x="10" y="214" className="font-display" fontSize="15" fontWeight="700" fill="var(--ink)">
            Pressione arteriosa
          </text>
          <rect x="10" y="222" width="200" height="10" rx="5" fill="var(--panel-2)" />
          <motion.rect x="10" y="222" width="200" height="10" rx="5" fill="var(--must)" style={{ originX: 0, originY: 0.5 }} initial={false} animate={{ scaleX: shock ? 0.4 : 1 }} transition={{ duration: 0.4, ease }} />
        </svg>
        <div aria-live="polite" className="[&>*+*]:mt-2">
          <p className="font-display text-[1.5rem] font-extrabold leading-none">{shock ? 'Ipoperfusione d’organo' : 'Perfusione normale'}</p>
          {shock ? (
            <>
              <p>Agli organi arriva meno sangue, quindi meno ossigeno: le cellule possono andare incontro a disfunzione e morte.</p>
              <p>La pressione arteriosa è sempre ridotta. Il corpo protegge il cervello, molto sensibile all’ipossia, a scapito degli altri tessuti e organi, dove rischiano di comparire fenomeni ischemici.</p>
              <p className="text-[0.92rem] text-ink-soft">Nel disegno: meno particelle di sangue, il cuore batte più in fretta ma più debole, le cellule spente sono quelle che soffrono.</p>
            </>
          ) : (
            <p>Il cuore spinge il sangue, e con esso l’ossigeno, sia al cervello sia agli altri organi e tessuti. Premi “Shock” per vedere che cosa cambia.</p>
          )}
        </div>
      </div>
    </div>
  )
}
