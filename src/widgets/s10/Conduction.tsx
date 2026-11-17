import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button, Stage } from '../../components/ui'

type Mode = 'normale' | 'guasto' | 'nessuno'
type Key = 'nsa' | 'atri' | 'nav' | 'his' | 'purkinje' | 'stop'
type Pt = [number, number]

const P = {
  nsa: [92, 56] as Pt,
  nav: [180, 139] as Pt,
  atri: [[92, 56], [120, 92], [152, 122], [180, 139]] as Pt[],
  atriSx: [[92, 56], [180, 50], [262, 64]] as Pt[],
  his: [[180, 139], [180, 196]] as Pt[],
  dx: [[180, 196], [152, 246], [128, 276], [92, 248], [76, 206]] as Pt[],
  sx: [[180, 196], [208, 246], [232, 276], [268, 248], [284, 206]] as Pt[],
}
const line = (pts: Pt[]) => `M${pts.map((p) => p.join(' ')).join('L')}`

const SEQ: Record<Mode, Key[]> = { normale: ['nsa', 'atri', 'his', 'purkinje'], guasto: ['nav', 'his', 'purkinje'], nessuno: ['stop'] }
const TEXT: Record<Key, { title: string; body: string }> = {
  nsa: { title: 'Nodo seno-atriale (NSA)', body: 'È il generatore primario degli impulsi e si trova nell’atrio destro. Si chiama anche pacemaker cardiaco principale, perché in condizioni normali gli impulsi partono da qui, in modo autonomo.' },
  atri: { title: 'Dagli atri al nodo atrio-ventricolare (NAV)', body: 'L’impulso attraversa gli atri e arriva al NAV: è il punto in cui passa dagli atri ai ventricoli. Il NAV fa da filtro e difende il ventricolo dalle aritmie atriali.' },
  nav: { title: 'NSA guasto: subentra il NAV', body: 'Quando il NSA non genera gli impulsi in modo corretto (per esempio nel blocco atrioventricolare), lo rimpiazza il NAV: un pacemaker “di scappamento”, con un automatismo più lento, che mantiene l’attività elettrica del cuore e protegge dall’asistolia.' },
  his: { title: 'Fascio comune di His', body: 'Porta l’impulso verso i ventricoli. In assenza di vie accessorie il sistema di conduzione è l’unico collegamento elettrico fra atri e ventricoli: lo scheletro fibroso li isola elettricamente gli uni dagli altri.' },
  purkinje: { title: 'Fibre di Purkinje e ventricoli', body: 'Il tratto terminale del sistema porta l’impulso al resto del muscolo cardiaco: i ventricoli si contraggono e il sangue viene spinto in tutto l’organismo.' },
  stop: { title: 'Nessuno stimolo elettrico', body: 'Se lo stimolo elettrico viene a mancare, manca anche l’attività di pompa del cuore: nessun impulso, nessuna contrazione.' },
}
const LIT: Record<Key, ('atri' | 'his' | 'purkinje')[]> = { nsa: [], atri: ['atri'], nav: [], his: ['atri', 'his'], purkinje: ['atri', 'his', 'purkinje'], stop: [] }
const MODES: { id: Mode; label: string }[] = [
  { id: 'normale', label: 'Ritmo normale' },
  { id: 'guasto', label: 'NSA guasto' },
  { id: 'nessuno', label: 'Nessuno stimolo' },
]
const ease = [0.23, 1, 0.32, 1] as const

function Dot({ pts, run, dur }: { pts: Pt[]; run: number; dur: number }) {
  return (
    <motion.circle
      key={run}
      r="6"
      fill="var(--lume)"
      initial={{ x: pts[0][0], y: pts[0][1], opacity: 1 }}
      animate={{ x: pts.map((p) => p[0]), y: pts.map((p) => p[1]), opacity: [1, 1, 0.9] }}
      transition={{ duration: dur, ease: 'linear' }}
    />
  )
}

/** The conduction system as a path the impulse travels: NSA → atri → NAV → fascio di His → fibre di Purkinje → ventricoli. */
export function Conduction() {
  const [mode, setMode] = useState<Mode>('normale')
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(false)
  const seq = SEQ[mode]
  const key = seq[Math.min(i, seq.length - 1)]
  const lit = LIT[key]
  const nsaOff = mode !== 'normale'
  const dur = mode === 'guasto' ? 0.75 : 0.42

  const go = (n: number) => {
    setI((n + seq.length) % seq.length)
    setRun((r) => r + 1)
  }
  useEffect(() => {
    if (!playing || mode === 'nessuno') return
    const id = setInterval(() => {
      setI((n) => (n + 1) % seq.length)
      setRun((r) => r + 1)
    }, dur * 1000 + (mode === 'guasto' ? 500 : 120))
    return () => clearInterval(id)
  }, [playing, mode, seq.length, dur])

  const pick = (m: Mode) => {
    setMode(m)
    setI(0)
    setRun((r) => r + 1)
    if (m === 'nessuno') setPlaying(false)
  }
  const segment = (k: 'atri' | 'his' | 'purkinje', d: string) => (
    <path d={d} fill="none" stroke={lit.includes(k) ? 'var(--lume)' : 'var(--well-soft)'} strokeOpacity={lit.includes(k) ? 1 : 0.45} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-[stroke-opacity] duration-200" />
  )

  return (
    <Stage title="Il sistema di conduzione" hint="Avanza passo per passo o premi Riproduci.">
      <div role="radiogroup" aria-label="Situazione" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} onClick={() => pick(m.id)} className={`rounded-chip px-3 py-2 font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${mode === m.id ? 'bg-lume text-well ring-lume' : 'text-well-ink ring-well-2 hover:ring-well-soft'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
        <svg viewBox="0 0 360 320" className="mx-auto w-full max-w-[26rem]" role="img" aria-label={`Schema del cuore con il sistema di conduzione. Passo attuale: ${TEXT[key].title}.`}>
          <motion.g key={`a${run}`} animate={key === 'atri' ? { scale: [1, 0.96, 1] } : { scale: 1 }} transition={{ duration: 0.3, ease }} style={{ transformOrigin: '180px 80px' }}>
            <rect x="56" y="28" width="114" height="100" rx="28" fill="var(--well-2)" />
            <rect x="190" y="28" width="114" height="100" rx="28" fill="var(--well-2)" />
          </motion.g>
          <rect x="56" y="134" width="248" height="10" rx="3" fill="var(--well-soft)" fillOpacity="0.35" />
          <motion.g key={`v${run}`} animate={key === 'purkinje' ? { scale: [1, 0.95, 1] } : { scale: 1 }} transition={{ duration: 0.35, delay: 0.25, ease }} style={{ transformOrigin: '180px 220px' }}>
            <path d="M56 150H304V182Q304 250 180 312Q56 250 56 182Z" fill="var(--well-2)" />
            <path d="M180 150V290" stroke="var(--well)" strokeWidth="6" />
          </motion.g>

          {segment('atri', line(P.atri))}
          {segment('atri', line(P.atriSx))}
          {segment('his', line(P.his))}
          {segment('purkinje', line(P.dx))}
          {segment('purkinje', line(P.sx))}

          <g fill="var(--well-soft)" fontSize="12" textAnchor="middle">
            <text x="96" y="114">Atrio destro</text>
            <text x="250" y="104">Atrio sinistro</text>
            <text x="118" y="168">Ventricolo destro</text>
            <text x="242" y="168">Ventricolo sinistro</text>
            <text x="250" y="148" fontSize="10">scheletro fibroso</text>
            <text x="188" y="190" textAnchor="start">His</text>
            <text x="180" y="304" fontSize="11">Purkinje</text>
          </g>

          <circle cx={P.nsa[0]} cy={P.nsa[1]} r="11" fill={nsaOff ? 'var(--well-soft)' : 'var(--lume)'} fillOpacity={nsaOff ? 0.4 : 1} />
          {nsaOff && <path d="M85 49l14 14M99 49 85 63" stroke="var(--well)" strokeWidth="3" strokeLinecap="round" />}
          <text x={P.nsa[0]} y={P.nsa[1] - 17} fill="var(--well-ink)" fontSize="13" fontWeight="700" textAnchor="middle">
            NSA
          </text>
          <circle cx={P.nav[0]} cy={P.nav[1]} r="10" fill={mode === 'nessuno' ? 'var(--well-soft)' : 'var(--lume)'} fillOpacity={mode === 'nessuno' ? 0.4 : 1} />
          <text x={P.nav[0] + 16} y={P.nav[1] - 8} fill="var(--well-ink)" fontSize="13" fontWeight="700" textAnchor="start">
            NAV
          </text>

          {(key === 'nsa' || key === 'nav') && (
            <motion.circle key={`p${run}`} cx={key === 'nsa' ? P.nsa[0] : P.nav[0]} cy={key === 'nsa' ? P.nsa[1] : P.nav[1]} r="11" fill="none" stroke="var(--lume)" strokeWidth="3" initial={{ scale: 1, opacity: 1 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.5, ease }} />
          )}
          {key === 'atri' && (
            <>
              <Dot pts={P.atri} run={run} dur={dur} />
              <Dot pts={P.atriSx} run={run} dur={dur} />
            </>
          )}
          {key === 'his' && <Dot pts={P.his} run={run} dur={dur * 0.7} />}
          {key === 'purkinje' && (
            <>
              <Dot pts={P.dx} run={run} dur={dur} />
              <Dot pts={P.sx} run={run} dur={dur} />
            </>
          )}
        </svg>

        <div>
          <div className="min-h-44 rounded-chip bg-well-2 p-4 [&>*+*]:mt-2" aria-live="polite">
            <p className="text-[0.9rem] text-well-soft">
              Passo {Math.min(i, seq.length - 1) + 1} di {seq.length}
            </p>
            <p className="font-display text-[1.45rem] font-extrabold leading-none text-lume">{TEXT[key].title}</p>
            <p>{TEXT[key].body}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="onDark" disabled={seq.length < 2} onClick={() => go(i - 1)}>
              <ChevronLeft className="size-5" aria-hidden /> Indietro
            </Button>
            <Button variant="onDark" disabled={seq.length < 2} onClick={() => go(i + 1)}>
              Avanti <ChevronRight className="size-5" aria-hidden />
            </Button>
            <Button variant="onDark" disabled={mode === 'nessuno'} aria-pressed={playing} onClick={() => setPlaying(!playing)}>
              {playing ? <Pause className="size-5" aria-hidden /> : <Play className="size-5" aria-hidden />} {playing ? 'Pausa' : 'Riproduci'}
            </Button>
          </div>
          {mode === 'guasto' && <p className="mt-3 text-[0.92rem] text-well-soft">Con il NSA guasto il ciclo riparte dal NAV, più lentamente.</p>}
        </div>
      </div>
    </Stage>
  )
}
