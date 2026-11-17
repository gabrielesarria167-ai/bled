import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '../../components/ui/Button'
import { Callout } from '../../components/ui/Callout'
import { Ground, Person, tone } from './Person'
import { shift, type Pose } from './pose'

/** End-on view of a body lying on the ground (seen from the head), for the Log Roll. */
type Roll = { x: number; y: number; a: number; up?: boolean; label: string }
export type Frame = { r: Pose; v?: Pose; roll?: Roll; arrow?: boolean; turn?: boolean }
type Step = { title: string; body: string; frames: Frame[] }
type Tech = { id: string; tab: string; name: string; view: string; when: ReactNode; steps: Step[]; prep?: Step[]; notes?: ReactNode }

const move = 'transition-[transform,opacity] duration-700 ease-in-out'

/* Rautek, victim seated on the ground facing right, rescuer behind on the left. */
const vSeated: Pose = { x: 150, y: 132, t: -90, h: -90, aN: [164, 128, -1], aF: [161, 129, -1], lN: [194, 131.5, 1], lF: [191, 131.5, 1] }
const vFolded: Pose = { ...vSeated, aN: { a: [55, -115] } }
const rBehind: Pose = { x: 126, y: 113, t: -72, h: -65, aN: [156, 110, -1], aF: [147, 100, -1], lN: [112, 131.5, 1], lF: [140, 131.5, 1] }
const vLift: Pose = { x: 140, y: 112, t: -100, h: -118, aN: { a: [40, -130] }, aF: { a: [45, -125] }, lN: [182, 131.5, 1], lF: [179, 131.5, 1] }
const rLift: Pose = { x: 118, y: 92, t: -80, h: -80, aN: [145, 93, -1], aF: [134, 76, 1], lN: [110, 131.5, 1], lF: [128, 131.5, 1] }
const vSupineLeft: Pose = { x: 150, y: 128.5, t: -180, h: -180, aN: { a: [5, 0] }, aF: { a: [3, 0] }, lN: [196, 131.5, 1], lF: [195, 131.5, 1] }

const rautek: Step[] = [
  {
    title: 'Piega il braccio più vicino',
    body: 'Mettiti di fianco alla vittima e piegale il gomito del braccio che si trova più vicino a te.',
    frames: [{ v: { ...vSeated, aN: [163, 106, -1] }, r: { x: 130, y: 109, t: -70, h: -60, aN: [160, 113, -1], aF: [154, 104, -1], lN: [108, 131.5, 1], lF: [153, 131.5, 1] } }],
  },
  {
    title: 'Avambraccio sotto l’ascella opposta',
    body: 'Porta l’avambraccio del braccio appena piegato sotto l’ascella dell’arto controlaterale e tienilo afferrato con un tuo braccio.',
    frames: [{ v: vFolded, r: rBehind }],
  },
  {
    title: 'Passa con l’altro braccio',
    body: 'Con l’altro avambraccio passa dal basso nello spazio che resta tra il gomito piegato e il tronco della vittima.',
    frames: [{ v: vFolded, r: { ...rBehind, aF: [156, 116, -1] } }],
  },
  {
    title: 'Blocca la testa',
    body: 'Blocca la testa della vittima prendendola all’altezza della mandibola e falla poggiare sulla tua spalla.',
    frames: [{ v: { ...vFolded, h: -112 }, r: { x: 130, y: 114, t: -72, h: -72, aN: [156, 111, -1], aF: [151, 95, 1], lN: [114, 131.5, 1], lF: [144, 131.5, 1] } }],
  },
  {
    title: 'Solleva con le gambe',
    body: 'Senza mai lasciare l’immobilizzazione della testa, solleva la persona distendendo le gambe e tenendo la schiena il più dritta possibile, per evitare lesioni: la vittima resta aderente al tuo torace.',
    frames: [{ v: vLift, r: rLift }],
  },
  {
    title: 'Estrai e adagia supina',
    body: 'Se la vittima è dentro un automezzo, estraila dall’abitacolo e adagiala a terra distesa sulla schiena, in posizione supina. Se c’è un pericolo, allontanala trascinandola e percorri la distanza più breve possibile.',
    frames: [
      { v: shift(vLift, -70), r: shift(rLift, -70), arrow: true },
      {
        v: { x: 100, y: 128.5, t: -180, h: -180, aN: { a: [5, 0] }, aF: { a: [3, 0] }, lN: [146, 131.5, 1], lF: [145, 131.5, 1] },
        r: { x: 40, y: 112, t: -50, h: -45, aN: [60, 124, -1], aF: [57, 122, -1], lN: [22, 131.5, 1], lF: [34, 131.5, 1] },
      },
    ],
  },
]

const rautekPrep: Step[] = [
  {
    title: 'Mettila sulla schiena',
    body: 'Se non è già supina, girala e mettila sulla schiena.',
    frames: [{ v: vSupineLeft, r: { x: 70, y: 85.5, t: -90, h: -80, aN: { a: [95, 85] }, aF: { a: [85, 90] }, lN: [74, 131.5, 1], lF: [64, 131.5, 1] } }],
  },
  {
    title: 'Inginocchiati alle spalle',
    body: 'Inginocchiati al suo fianco, all’altezza delle spalle.',
    frames: [{ v: vSupineLeft, r: { x: 112, y: 114, t: -80, h: -70, aN: [122, 118, -1], aF: [120, 119, -1], lN: [104, 131.5, 1], lF: [106, 131.5, 1] } }],
  },
  {
    title: 'Mano destra sotto il collo',
    body: 'Fai passare la mano destra sotto il collo della vittima.',
    frames: [{ v: vSupineLeft, r: { x: 104, y: 114, t: -40, h: -30, aN: [114, 131, 1], aF: [124, 118, -1], lN: [96, 131.5, 1], lF: [98, 131.5, 1] } }],
  },
  {
    title: 'Mano sinistra sotto l’ascella',
    body: 'Metti la mano sinistra sotto l’ascella sinistra della vittima.',
    frames: [{ v: vSupineLeft, r: { x: 104, y: 114, t: -40, h: -30, aN: [114, 131, 1], aF: [128, 131, -1], lN: [96, 131.5, 1], lF: [98, 131.5, 1] } }],
  },
  {
    title: 'Mettila seduta',
    body: 'Con un unico movimento fluido portala in posizione seduta sollevandola con le mani, e sistemati subito dietro di lei.',
    frames: [{ v: vSeated, r: { x: 124, y: 114, t: -75, h: -70, aN: [146, 108, -1], aF: [144, 110, -1], lN: [116, 131.5, 1], lF: [118, 131.5, 1] } }],
  },
]

/* Drags: victim supine, head towards the rescuer, who moves backwards to the left. */
const vArms: Pose = { x: 170, y: 128.5, t: -180, h: -180, aN: [108, 113, 1], aF: [109, 114, 1], lN: [216, 131.5, 1], lF: [215, 131.5, 1] }
const rArms: Pose = { x: 82, y: 98, t: -45, h: -40, aN: [108, 113, -1], aF: [109, 114, -1], lN: [76, 131.5, 1], lF: [64, 131.5, 1] }
const vClothes: Pose = { x: 170, y: 128.5, t: -180, h: -180, aN: { a: [3, 0] }, aF: { a: [2, 0] }, lN: [216, 131.5, 1], lF: [215, 131.5, 1] }
const rClothes: Pose = { x: 114, y: 106, t: -45, h: -40, aN: [144, 122, -1], aF: [146, 121, -1], lN: [120, 131.5, 1], lF: [100, 131.5, 1] }

/* Log Roll: rescuer kneeling on the left, victim seen from the head. */
const rKneel = (t: number, aN: Pose['aN'], aF: Pose['aF'], x = 108): Pose => ({ x, y: 114, t, h: t + 5, aN, aF, lN: [x - 8, 131.5, 1], lF: [x - 6, 131.5, 1] })
const prone = { x: 146, y: 129, a: 0, label: 'A pancia in giù' }

const logRoll: Step[] = [
  { title: 'Inginocchiati di fianco', body: 'Inginocchiati di fianco alla persona infortunata.', frames: [{ r: rKneel(-75, [118, 118, -1], [116, 120, -1]), roll: { ...prone, up: true } }] },
  { title: 'Distendi braccia e gambe', body: 'Con cautela distendile braccia e gambe e sistema le braccia lungo i fianchi.', frames: [{ r: rKneel(-40, [124, 126, -1], [128, 122, -1]), roll: prone }] },
  { title: 'Sostieni testa e collo', body: 'Sorreggi testa e collo con una mano.', frames: [{ r: rKneel(-30, [146, 127, -1], [124, 118, -1]), roll: prone }] },
  { title: 'Mano sul gomito più lontano', body: 'Appoggia l’altra mano sul gomito più lontano e spingilo delicatamente contro il fianco della vittima.', frames: [{ r: rKneel(-15, [146, 127, -1], [168, 128, -1]), roll: prone }] },
  {
    title: 'Ruota verso di te',
    body: 'Fai ruotare la vittima verso di te, senza che testa, collo e schiena ruotino l’una rispetto all’altra.',
    frames: [{ r: rKneel(-25, [141, 120, -1], [159, 107, -1]), roll: { x: 141, y: 119.4, a: -35, label: 'In rotazione, in blocco' }, turn: true }],
  },
  {
    title: 'Prima sul fianco, poi sulla schiena',
    body: 'Portala prima sul fianco, con il minimo movimento indispensabile, poi completa la rotazione fino alla schiena.',
    frames: [
      { r: rKneel(-60, [134, 111, -1], [134, 90, -1], 100), roll: { x: 134, y: 111, a: -90, label: 'Sul fianco' }, turn: true },
      { r: rKneel(-40, [126, 127, -1], [106, 126, -1], 84), roll: { x: 126, y: 129, a: -180, label: 'Sulla schiena' } },
    ],
  },
]

const wide = '0 30 232 114'

export const techniques: Tech[] = [
  {
    id: 'rautek',
    tab: 'Rautek',
    name: 'Tecnica Rautek',
    view: wide,
    when: (
      <p>
        È la prima tecnica di spostamento presentata dal manuale. Dai suoi passaggi si ricava che serve a sollevare la persona infortunata, a estrarla dall’abitacolo se si trova in un automezzo e ad allontanarla in caso di pericolo. Si applica con facilità se la persona è seduta; se è a terra richiede prima alcuni passaggi preparatori.
      </p>
    ),
    steps: rautek,
    prep: rautekPrep,
  },
  {
    id: 'braccia',
    tab: 'Per le braccia',
    name: 'Altre tecniche: trascinamento per le braccia',
    view: wide,
    when: <p>È un’altra tecnica che puoi usare negli spostamenti d’emergenza.</p>,
    steps: [
      {
        title: 'Afferra le braccia e trascina',
        body: 'Afferra la vittima per le braccia e trascinala.',
        frames: [{ v: vArms, r: rArms }, { v: shift(vArms, -40), r: { ...shift(rArms, -40), lN: [30, 131.5, 1], lF: [20, 131.5, 1] }, arrow: true }],
      },
    ],
  },
  {
    id: 'vestiti',
    tab: 'Per i vestiti',
    name: 'Altre tecniche: trascinamento per i vestiti',
    view: wide,
    when: <p>È l’alternativa al trascinamento per le braccia, altrettanto valida negli spostamenti d’emergenza.</p>,
    steps: [
      {
        title: 'Afferra gli indumenti e trascina',
        body: 'Trascina la persona soccorsa afferrandola per gli indumenti.',
        frames: [{ v: vClothes, r: rClothes }, { v: shift(vClothes, -40), r: { ...shift(rClothes, -40), lN: [70, 131.5, 1], lF: [64, 131.5, 1] }, arrow: true }],
      },
    ],
  },
  {
    id: 'logroll',
    tab: 'Log Roll',
    name: 'Manovra di rotazione (Log Roll)',
    view: '70 58 140 86',
    when: <p>Quando la persona infortunata non è sulla schiena e può essere necessario portarla in quella posizione, limitando il più possibile i movimenti del collo e della schiena.</p>,
    steps: logRoll,
    notes: (
      <Callout kind="nota" title="Note">
        <ul>
          <li>Con due soccorritori, uno tiene immobile la testa mentre l’altro ruota la persona infortunata sulla schiena.</li>
          <li>La stessa tecnica serve anche nel caso opposto: la persona è già supina ma va girata sul fianco per liberare le vie aeree da eventuali liquidi.</li>
        </ul>
      </Callout>
    ),
  },
]

function RollBody({ x, y, a, up }: Roll) {
  return (
    <g className={move} style={{ transform: `translate(${x}px, ${y}px) rotate(${a}deg)` }}>
      <rect x={-17} y={-7} width={34} height={14} rx={7} fill={tone.vFar} />
      {/* the back, so you can follow where the spine ends up */}
      <rect x={-13} y={-7} width={26} height={3.5} rx={1.75} fill="var(--warn)" />
      <circle cx={-22} r={4} fill={tone.v} className={move} style={{ transform: up ? 'translate(9px, -12px)' : 'none' }} />
      <circle cx={22} r={4} fill={tone.v} />
      <circle r={7} fill={tone.v} />
    </g>
  )
}

/** One frame of a manoeuvre: rescuer's body behind the victim, rescuer's arms in front. */
export function Scene({ frame, label, view }: { frame: Frame; label: string; view: string }) {
  const { r, v, roll } = frame
  return (
    <svg viewBox={view} role="img" aria-label={label} className="h-auto w-full">
      <Ground />
      <Person pose={r} color={tone.r} far={tone.rFar} parts={['lF', 'body', 'lN']} />
      {v && <Person pose={v} color={tone.v} far={tone.vFar} />}
      {roll && <RollBody {...roll} />}
      <Person pose={r} color={tone.r} far={tone.rFar} parts={['aF', 'aN']} />
      <path d="M150 46h-40v-6l-13 10 13 10v-6h40z" fill="var(--safe)" className={move} style={{ opacity: frame.arrow ? 1 : 0 }} />
      <g className={move} style={{ opacity: frame.turn ? 1 : 0 }}>
        <path d="M176 92a34 34 0 0 0-52-6" fill="none" stroke="var(--safe)" strokeWidth={4} strokeLinecap="round" />
        <path d="m116 80 3 13 10-8z" fill="var(--safe)" />
      </g>
    </svg>
  )
}

/** Plays a step's frames one after the other; a new key restarts from the first. Started only by the learner's click. */
function usePlayback(frames: Frame[], key: string) {
  const reduce = useReducedMotion()
  const [s, setS] = useState({ key, i: 0 })
  const i = s.key === key ? s.i : 0
  useEffect(() => {
    if (reduce || frames.length < 2) return
    let n = 0
    const id = setInterval(() => {
      n += 1
      setS({ key, i: n })
      if (n >= frames.length - 1) clearInterval(id)
    }, 950)
    return () => clearInterval(id)
  }, [key, reduce]) // frames are derived from key
  return reduce ? frames[frames.length - 1] : frames[Math.min(i, frames.length - 1)]
}

/** Browse the moving techniques: pick one, read when it is used, walk its steps while the drawing performs each one. */
export function Tecniche() {
  const [ti, setTi] = useState(0)
  const [terra, setTerra] = useState(false)
  const [si, setSi] = useState(0)
  const [replay, setReplay] = useState(0)
  const tech = techniques[ti]
  const prep = tech.prep && terra ? tech.prep : []
  const all = [...prep, ...tech.steps]
  const step = all[si]
  const prevFrame = si > 0 ? all[si - 1].frames[all[si - 1].frames.length - 1] : undefined
  const frames = replay && prevFrame ? [prevFrame, ...step.frames] : step.frames
  const frame = usePlayback(frames, `${tech.id}-${terra}-${si}-${replay}`)
  const label = (n: number) => (n < prep.length ? `Preparazione ${n + 1} di ${prep.length}` : `Passo ${n - prep.length + 1} di ${tech.steps.length}`)

  const go = (n: number) => {
    setSi(n)
    setReplay(0)
  }
  const pickTech = (n: number) => {
    setTi(n)
    setTerra(false)
    go(0)
  }

  const stepButton = (s: Step, n: number) => (
    <li key={s.title}>
      <button
        type="button"
        onClick={() => go(n)}
        aria-current={n === si ? 'step' : undefined}
        className={`grid w-full grid-cols-[2.25rem_1fr] gap-x-3 rounded-chip p-2.5 text-left ring-2 ring-inset transition-colors duration-150 ${n === si ? 'bg-must-tint ring-must' : 'ring-transparent hover:bg-panel-2'}`}
      >
        <span className={`grid size-9 place-items-center rounded-chip font-display text-[1.3rem] font-extrabold leading-none ${n === si ? 'bg-must text-on-sign' : 'bg-panel-2'}`}>{n < prep.length ? `P${n + 1}` : n - prep.length + 1}</span>
        <span className="min-w-0">
          <span className="block font-bold leading-snug">{s.title}</span>
          <span className="block text-[0.95rem] leading-snug text-ink-soft">{s.body}</span>
        </span>
      </button>
    </li>
  )

  return (
    <div className="my-8 rounded-plate bg-panel">
      <div className="flex flex-wrap gap-2 border-b-2 border-ground p-3" role="group" aria-label="Scegli la tecnica">
        {techniques.map((t, n) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pickTech(n)}
            aria-pressed={n === ti}
            className={`rounded-chip px-3.5 py-2 font-display text-[1.15rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${n === ti ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`}
          >
            {t.tab}
          </button>
        ))}
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-[1.6rem]">{tech.name}</h3>
        <div className="mt-3 max-w-[68ch]">
          <p className="font-bold">Quando si usa</p>
          {tech.when}
        </div>

        {tech.prep && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Dove si trova la vittima">
              {[
                ['Vittima seduta', false],
                ['Vittima a terra', true],
              ].map(([text, val]) => (
                <button
                  key={String(val)}
                  type="button"
                  aria-pressed={terra === val}
                  onClick={() => {
                    setTerra(val as boolean)
                    go(0)
                  }}
                  className={`rounded-chip px-3 py-1.5 font-bold ring-2 ring-inset transition-colors duration-150 ${terra === val ? 'bg-ink text-ground ring-ink' : 'ring-line hover:ring-ink-soft'}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <p className="mt-2 max-w-[68ch] text-[0.95rem] text-ink-soft">
              {terra
                ? 'Se la persona è stesa sul pavimento, prima di applicare la tecnica servono 5 passaggi preparatori (P1–P5), poi segui i 6 passi della Rautek.'
                : 'Se la persona è seduta, la tecnica si applica senza difficoltà: 6 passi.'}
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start">
          <div className="lg:sticky lg:top-24 lg:order-2">
            <div className="rounded-chip bg-ground p-2">
              <Scene key={`${tech.id}-${terra}`} view={tech.view} frame={frame} label={`${tech.name}, ${label(si)}: ${step.title}`} />
            </div>
            <div aria-live="polite">
              {frame.roll && (
                <p className="mt-2 text-[0.95rem] text-ink-soft">
                  Vista dalla testa della vittima, schiena in giallo: <strong className="text-ink">{frame.roll.label}</strong>
                </p>
              )}
              <p className="mt-2 font-display text-[1.25rem] font-bold leading-tight">
                {label(si)}: {step.title}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button variant="quiet" disabled={si === 0} onClick={() => go(si - 1)}>
                <ChevronLeft className="size-5" aria-hidden /> Indietro
              </Button>
              <Button variant="must" disabled={si === all.length - 1} onClick={() => go(si + 1)}>
                Avanti <ChevronRight className="size-5" aria-hidden />
              </Button>
              <Button variant="quiet" disabled={!prevFrame && step.frames.length < 2} onClick={() => setReplay(replay + 1)}>
                <RotateCcw className="size-4" aria-hidden /> Rivedi il movimento
              </Button>
            </div>
          </div>

          <div className="lg:order-1">
            {prep.length > 0 && <p className="mb-1 font-bold">Passaggi preparatori</p>}
            <ol className="space-y-1">{prep.map((s, n) => stepButton(s, n))}</ol>
            {prep.length > 0 && <p className="mb-1 mt-4 font-bold">Tecnica Rautek</p>}
            <ol className="space-y-1">{tech.steps.map((s, n) => stepButton(s, n + prep.length))}</ol>
          </div>
        </div>

        {tech.notes}
      </div>
    </div>
  )
}
