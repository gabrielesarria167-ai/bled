import type { StoryStep } from '../../components/ui'

export const oxygenSteps: StoryStep[] = [
  {
    title: 'A: l’aria entra',
    body: <p>Inspiri: l’aria, con circa il 21% di ossigeno, entra dal naso o dalla bocca. Se le vie aeree (naso, bocca, faringe, laringe, trachea) sono pervie, passa senza ostacoli.</p>,
  },
  {
    title: 'B: fino agli alveoli',
    body: <p>Dalla laringe l’aria scende nella trachea, che si divide nei due bronchi, destro e sinistro. I bronchi si ramificano in bronchioli sempre più piccoli, che finiscono negli alveoli: circa 300 milioni di minuscole sacche.</p>,
  },
  {
    title: 'B: lo scambio dei gas',
    body: <p>Attorno a ogni alveolo ci sono i capillari. L’O2 attraversa le loro pareti sottilissime per diffusione e passa nel sangue, perché nei polmoni la sua concentrazione è più alta. La CO2 fa il percorso inverso, dai capillari agli alveoli.</p>,
  },
  {
    title: 'C: il cuore lo spinge',
    body: <p>Il sangue ricco di O2 (sangue arterioso) lascia i polmoni, entra nell’atrio sinistro, passa nel ventricolo sinistro e da qui viene pompato in tutto il corpo: è la circolazione sistemica, o grande circolo.</p>,
  },
  {
    title: 'C: arriva alle cellule',
    body: <p>Le cellule usano l’O2 per i loro processi metabolici; ciò che resta è CO2. Il sangue venoso, povero di O2, rientra nell’atrio destro, passa nel ventricolo destro ed è pompato ai polmoni: è la circolazione polmonare, o piccolo circolo.</p>,
  },
  {
    title: 'La CO2 esce',
    body: <p>Con l’espirazione l’aria, ora più ricca di CO2, risale dai bronchi alla trachea ed esce dalla bocca o dal naso. Al respiro successivo il viaggio ricomincia.</p>,
  },
]

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const letter = ['A', 'B', 'B', 'C', 'C', 'B']
// Scroll progress -> drawn share of the O2 path, so each step ends where its text does
// (top of the trachea, alveolus, heart, cells). Path shares measured from the path below.
const stops: [number, number][] = [[0, 0], [1 / 6, 0.35], [2 / 6, 0.71], [3 / 6, 0.71], [4 / 6, 0.88], [5 / 6, 1]]
function drawn(p: number) {
  const i = stops.findIndex(([x]) => x > p)
  if (i === -1) return 1
  const [x0, y0] = stops[i - 1]
  const [x1, y1] = stops[i]
  return y0 + ((p - x0) / (x1 - x0)) * (y1 - y0)
}

/** The pinned drawing: the oxygen route draws itself as the story scrolls, then the CO2 route back out. */
export function OxygenVisual(active: number, p: number) {
  const o2 = drawn(clamp(p))
  const co2 = clamp((p - 5 / 6) * 6)
  const fade = (o: number) => ({ style: { opacity: o, transition: 'opacity 300ms ease-out' } })
  const lit = (on: boolean) => ({ fill: 'var(--well-soft)', ...fade(on ? 0.85 : 0.22) })

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full p-3" role="img" aria-label={`Il percorso dell’ossigeno, tappa ${active + 1} di ${oxygenSteps.length}: ${oxygenSteps[active].title}`}>
      {/* body */}
      <circle cx="160" cy="52" r="30" fill="var(--well-2)" />
      <rect x="80" y="96" width="160" height="276" rx="46" fill="var(--well-2)" />
      {/* airway, lungs, heart, cells */}
      <rect x="154" y="66" width="12" height="96" rx="6" {...lit(active === 0 || active === 5)} />
      <rect x="92" y="150" width="58" height="112" rx="29" {...lit(active === 1 || active === 2 || active === 5)} />
      <rect x="170" y="150" width="58" height="112" rx="29" {...lit(active === 1 || active === 2 || active === 5)} />
      <path transform="translate(141 226) scale(0.8)" d="M24 41 9.4 26.2a9 9 0 0 1 0-12.7 8.9 8.9 0 0 1 12.6 0l2 2 2-2a8.9 8.9 0 0 1 12.6 0 9 9 0 0 1 0 12.7Z" {...lit(active === 3 || active === 4)} />
      {[120, 160, 200].map((x, i) => (
        <circle key={x} cx={x} cy={i === 1 ? 336 : 326} r="13" {...lit(active === 4)} />
      ))}
      <text x="160" y="368" textAnchor="middle" fontSize="13" fill="var(--well-soft)">cellule</text>

      {/* O2 route in, then CO2 route out */}
      <path d="M20 24Q100 22 150 60L160 72V160L128 188 122 222 156 250 160 300V334" fill="none" stroke="var(--lume)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - o2} />
      <path d="M160 334 174 298 178 256 198 222 192 188 162 160 166 72Q220 22 300 24" fill="none" stroke="var(--well-ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - co2} opacity={0.75} />
      <text x="20" y="14" fontSize="14" fill="var(--lume)" className="font-display" fontWeight="700">aria: circa 21% O2</text>
      {co2 > 0.9 && (
        <text x="300" y="14" fontSize="14" fill="var(--well-ink)" className="font-display" fontWeight="700" textAnchor="middle">
          più CO2
        </text>
      )}

      {/* zoom on one alveolus during the gas exchange */}
      <g {...fade(active === 2 ? 1 : 0)}>
        <path d="M122 222 286 200" stroke="var(--well-soft)" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="330" cy="200" r="56" fill="var(--well)" stroke="var(--well-soft)" strokeWidth="2" />
        <circle cx="318" cy="186" r="26" fill="var(--well-2)" />
        <rect x="290" y="226" width="80" height="12" rx="6" fill="var(--well-soft)" opacity="0.6" />
        <text x="318" y="190" textAnchor="middle" fontSize="11" fill="var(--well-ink)">alveolo</text>
        <text x="330" y="252" textAnchor="middle" fontSize="11" fill="var(--well-ink)">capillare</text>
        <path d="M302 206v16m-4-5 4 5 4-5" stroke="var(--lume)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="292" y="218" textAnchor="end" fontSize="11" fill="var(--lume)" fontWeight="700">O2</text>
        <path d="M352 222v-16m-4 5 4-5 4 5" stroke="var(--well-ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <text x="360" y="218" fontSize="11" fill="var(--well-ink)" fontWeight="700">CO2</text>
      </g>

      {/* the step's letter */}
      <text x="40" y="380" fontSize="64" fill="var(--lume)" className="font-display" fontWeight="800">
        {letter[active]}
      </text>
    </svg>
  )
}
