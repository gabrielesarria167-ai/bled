import { Pause, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

/** Dark red for venous blood, derived from the token so it follows the theme. */
export const SCURO = 'color-mix(in oklab, var(--danger) 55%, black)'
const VIVO = 'var(--danger)'

function PauseToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={!playing} className="inline-flex items-center gap-2 rounded-chip px-3 py-2 text-[0.95rem] ring-2 ring-inset ring-line hover:ring-ink-soft">
      {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      {playing ? 'Ferma l’animazione' : 'Riprendi l’animazione'}
    </button>
  )
}

/* ---------- by vessel: the flow itself shows the difference ---------- */

function Capillare({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 180 170" className="w-full" role="img" aria-label="Capillare rotto: il sangue affiora a piccole gocce lente, più che scorrere filtra">
      <rect x="0" y="31" width="180" height="8" rx="4" fill="var(--panel-2)" />
      <rect x="0" y="33" width="180" height="4" rx="2" fill={VIVO} opacity="0.85" />
      {[78, 92, 85, 100, 72].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={44}
          r="3"
          fill={VIVO}
          initial={false}
          animate={playing ? { opacity: [0, 1, 1, 0], y: [0, 5, 10, 14] } : { opacity: 1, y: i * 2 }}
          transition={playing ? { duration: 3.6, delay: i * 0.72, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
        />
      ))}
      <ellipse cx="88" cy="64" rx="22" ry="4" fill={VIVO} opacity="0.35" />
    </svg>
  )
}

function Venosa({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 180 170" className="w-full" role="img" aria-label="Vena rotta: sangue rosso scuro che esce con un flusso lento e costante">
      <rect x="0" y="24" width="180" height="22" rx="11" fill="var(--panel-2)" />
      <rect x="0" y="28" width="180" height="14" rx="7" fill={SCURO} />
      {[0, 1, 2, 3].map((i) => (
        <motion.ellipse key={`p${i}`} cx="-10" cy="35" rx="7" ry="3" fill="var(--ground)" opacity="0.35" initial={false} animate={playing ? { x: [0, 200] } : { x: 30 + i * 45 }} transition={playing ? { duration: 6, delay: i * 1.5, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }} />
      ))}
      <rect x="86" y="44" width="8" height="112" rx="4" fill={SCURO} opacity="0.3" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.circle
          key={i}
          cx="90"
          cy="48"
          r="4.5"
          fill={SCURO}
          initial={false}
          animate={playing ? { y: [0, 108], opacity: [0, 1, 1, 0] } : { y: i * 16, opacity: 1 }}
          transition={playing ? { duration: 2.8, delay: i * 0.4, repeat: Infinity, ease: 'linear', times: [0, 0.08, 0.85, 1] } : { duration: 0.2 }}
        />
      ))}
    </svg>
  )
}

const BEAT = 0.9

function Arteriosa({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 180 170" className="w-full" role="img" aria-label="Arteria rotta: sangue rosso vivo che esce a getti forti e pulsanti, al ritmo del battito cardiaco">
      <rect x="0" y="22" width="180" height="26" rx="13" fill="var(--panel-2)" />
      <rect x="0" y="27" width="180" height="16" rx="8" fill={VIVO} />
      <motion.g style={{ originX: 0.5, originY: 0.5 }} initial={false} animate={playing ? { scale: [1, 1.3, 1, 1] } : { scale: 1 }} transition={playing ? { duration: BEAT, repeat: Infinity, times: [0, 0.1, 0.3, 1] } : { duration: 0.2 }}>
        <path transform="translate(8 6) scale(0.42)" fill="var(--ink)" d="M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7Z" />
      </motion.g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={i}
          cx="90"
          cy="46"
          r={4.5 - i * 0.35}
          fill={VIVO}
          initial={false}
          animate={playing ? { x: [0, 0, 26 + i * 11, 26 + i * 11], y: [0, 0, 104 - i * 6, 104 - i * 6], opacity: [0, 1, 1, 0] } : { x: 8 + i * 9, y: 10 + i * 16, opacity: 1 }}
          transition={playing ? { duration: BEAT, delay: i * 0.035, repeat: Infinity, ease: 'easeOut', times: [0, 0.02, 0.5, 0.56] } : { duration: 0.2 }}
        />
      ))}
    </svg>
  )
}

type Row = { label: string; value: ReactNode }

const vessels: { title: string; art: (p: { playing: boolean }) => ReactNode; rows: Row[] }[] = [
  {
    title: 'Capillare',
    art: Capillare,
    rows: [
      { label: 'Vaso', value: 'i capillari, i vasi sanguigni più piccoli del corpo' },
      { label: 'Flusso', value: 'lento: il sangue più che scorrere filtra' },
      { label: 'Controllo', value: 'facile da controllare; di solito si ferma da sola, senza interventi esterni' },
      { label: 'Trattamento', value: 'anche un’emorragia minore può essere fonte di infezione: disinfetta la ferita e coprila con una medicazione, possibilmente sterile' },
    ],
  },
  {
    title: 'Venosa',
    art: Venosa,
    rows: [
      { label: 'Vaso', value: 'le vene, i vasi che riportano il sangue al cuore' },
      { label: 'Colore', value: 'rosso scuro' },
      { label: 'Flusso', value: 'lento e costante' },
      { label: 'Trattamento', value: 'di norma si arresta con pressione diretta e fasciatura (emostasi)' },
    ],
  },
  {
    title: 'Arteriosa',
    art: Arteriosa,
    rows: [
      { label: 'Vaso', value: 'un’arteria; le arterie portano il sangue ossigenato dal cuore a tutto il corpo' },
      { label: 'Colore', value: 'rosso vivo' },
      { label: 'Flusso', value: 'elevato e pulsante, sincrono con i battiti cardiaci, perché nelle arterie il sangue scorre ad alta pressione' },
      { label: 'Gravità', value: 'sempre grave: è un’emergenza, è difficile da controllare e richiede cure immediate' },
    ],
  },
]

/** Capillary, venous and arterial bleeding side by side, each with its own flow. */
export function VesselFlow() {
  const [playing, setPlaying] = useState(true)
  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[1.3rem] font-bold leading-tight">Guarda come esce il sangue</p>
        <PauseToggle playing={playing} onToggle={() => setPlaying(!playing)} />
      </div>
      <div className="mt-4 grid gap-x-6 gap-y-8 md:grid-cols-3">
        {vessels.map((v) => (
          <div key={v.title} className="min-w-0">
            <p className="font-display text-[1.6rem] font-extrabold leading-none">{v.title}</p>
            <div className="mx-auto mt-2 max-w-[15rem]">{v.art({ playing })}</div>
            <dl className="mt-2 space-y-2 border-t-2 border-ground pt-3 text-[0.95rem] leading-snug">
              {v.rows.map((r) => (
                <div key={r.label}>
                  <dt className="font-bold">{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- by site: where the blood ends up ---------- */

function Body({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 140 170" className="mx-auto w-full max-w-[9rem]" role="img" aria-label={label}>
      <g fill="var(--ink-soft)">
        <circle cx="70" cy="24" r="15" />
        <rect x="48" y="44" width="44" height="62" rx="12" />
        <rect x="32" y="46" width="12" height="58" rx="6" />
        <rect x="96" y="46" width="12" height="58" rx="6" />
        <rect x="51" y="108" width="16" height="56" rx="8" />
        <rect x="73" y="108" width="16" height="56" rx="8" />
      </g>
      {children}
    </svg>
  )
}

const drop = (playing: boolean, i: number, dy: number) => ({
  animate: playing ? { y: [0, dy], opacity: [0, 1, 1, 0] } : { y: (dy / 3) * i, opacity: 1 },
  transition: playing ? { duration: 1.8, delay: i * 0.6, repeat: Infinity, ease: 'easeIn' as const, times: [0, 0.1, 0.8, 1] } : { duration: 0.2 },
})

export function SiteFlow() {
  const [playing, setPlaying] = useState(true)
  const sites = [
    {
      title: 'Esterna',
      text: 'Il sangue fuoriuscito arriva all’esterno del corpo.',
      art: (
        <Body label="Emorragia esterna: dal taglio sul braccio il sangue cade fuori dal corpo">
          <ellipse cx="102" cy="78" rx="5" ry="3" fill="var(--danger)" />
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx="110" cy="82" r="3.5" fill="var(--danger)" initial={false} {...drop(playing, i, 80)} />
          ))}
        </Body>
      ),
    },
    {
      title: 'Interna',
      text: 'Il sangue fuoriuscito non arriva all’esterno del corpo.',
      art: (
        <Body label="Emorragia interna: il sangue si raccoglie dentro il tronco e non esce">
          <motion.ellipse cx="70" cy="76" rx="15" ry="11" fill="var(--danger)" style={{ originX: 0.5, originY: 0.5 }} initial={false} animate={playing ? { scale: [0.6, 1.05, 0.6] } : { scale: 1 }} transition={playing ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }} />
        </Body>
      ),
    },
    {
      title: 'Interna esteriorizzata',
      text: 'Il sangue di un’emorragia interna esce attraverso gli orifizi naturali del corpo, per esempio bocca, naso, orecchio.',
      art: (
        <Body label="Emorragia interna esteriorizzata: il sangue interno esce da un orifizio naturale della testa">
          <circle cx="70" cy="24" r="6" fill="var(--danger)" opacity="0.8" />
          {[0, 1, 2].map((i) => (
            <motion.circle key={i} cx="86" cy="28" r="3" fill="var(--danger)" initial={false} {...drop(playing, i, 34)} />
          ))}
        </Body>
      ),
    },
  ]
  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[1.3rem] font-bold leading-tight">Dove arriva il sangue</p>
        <PauseToggle playing={playing} onToggle={() => setPlaying(!playing)} />
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        {sites.map((s) => (
          <div key={s.title} className="min-w-0">
            {s.art}
            <p className="mt-3 font-display text-[1.4rem] font-extrabold leading-none">{s.title}</p>
            <p className="mt-1 text-[0.95rem] leading-snug">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
