import { RotateCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { Button, Stage } from '../../components/ui'

type Hazard = { id: string; name: string; text: string; sign: string; signAlt: string; hit: [number, number, number, number]; mark: [number, number]; draw: ReactNode }

const generic = { sign: 'w001-pericolo-generico.svg', signAlt: 'Segnale di pericolo generico' }

/** The eight hazards of the manual (p.31), each drawn in the scene with its own hit area and marker. */
export const hazards: Hazard[] = [
  {
    id: 'traffico',
    name: 'Traffico',
    text: 'La vittima è a terra accanto alla strada e un’auto sta arrivando.',
    ...generic,
    hit: [14, 250, 206, 104],
    mark: [118, 248],
    draw: (
      <>
        <path d="M74 296 92 266h64l24 30Z" />
        <rect x="34" y="294" width="172" height="36" rx="12" />
        <circle cx="76" cy="334" r="15" />
        <circle cx="166" cy="334" r="15" />
        <rect x="10" y="300" width="18" height="5" rx="2.5" />
        <rect x="4" y="314" width="24" height="5" rx="2.5" />
      </>
    ),
  },
  {
    id: 'elettricita',
    name: 'Elettricità',
    text: 'Un cavo si è staccato dal palo ed è a terra, vicino alla testa della vittima.',
    sign: 'w012-pericolo-elettricita.svg',
    signAlt: 'Segnale di pericolo: elettricità',
    hit: [226, 82, 88, 250],
    mark: [292, 128],
    draw: (
      <>
        <rect x="244" y="92" width="12" height="240" rx="4" />
        <rect x="224" y="98" width="54" height="9" rx="4" />
        <path d="M274 104c30 40 26 120 22 190" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <path d="m296 292-10 14 14 2-8 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'patogeni',
    name: 'Patogeni',
    text: 'C’è sangue a terra accanto alla vittima. Sangue, secrezioni e vomito possono trasmettere infezioni: proteggiti con i DPI.',
    sign: 'w009-rischio-biologico.svg',
    signAlt: 'Segnale di pericolo: rischio biologico',
    hit: [332, 324, 92, 44],
    mark: [378, 372],
    draw: (
      <>
        <ellipse cx="378" cy="344" rx="32" ry="8" />
        <path d="M352 326c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12ZM404 330c3 5 5 7 5 10a5 5 0 0 1-10 0c0-3 2-5 5-10Z" />
      </>
    ),
  },
  {
    id: 'chimiche',
    name: 'Sostanze chimiche',
    text: 'Una tanica rovesciata perde liquido verso i piedi della vittima. Le sostanze chimiche sono pericolose per contatto, inalazione o ingestione.',
    sign: 'w016-sostanze-tossiche.svg',
    signAlt: 'Segnale di pericolo: sostanze tossiche',
    hit: [482, 290, 102, 62],
    mark: [552, 288],
    draw: (
      <>
        <rect x="522" y="302" width="58" height="28" rx="5" />
        <rect x="508" y="308" width="16" height="9" rx="3" />
        <ellipse cx="508" cy="338" rx="26" ry="6" />
      </>
    ),
  },
  {
    id: 'fuoco',
    name: 'Fuoco',
    text: 'Un bidone sta bruciando a pochi passi dalla vittima.',
    sign: 'w021-materiale-infiammabile.svg',
    signAlt: 'Segnale di pericolo: materiale infiammabile',
    hit: [592, 222, 70, 112],
    mark: [628, 214],
    draw: (
      <>
        <rect x="602" y="280" width="50" height="52" rx="4" />
        <path d="M606 282c-6-18 8-28 6-44 12 10 12 22 10 30 4-6 4-14 2-22 14 10 18 24 14 36Z" />
        <path d="M630 282c-2-12 6-18 6-30 10 10 14 20 12 30Z" />
      </>
    ),
  },
  {
    id: 'fumo',
    name: 'Fumo',
    text: 'Dal bidone in fiamme sale fumo che invade la scena.',
    ...generic,
    hit: [560, 52, 132, 166],
    mark: [676, 70],
    draw: (
      <>
        <circle cx="622" cy="196" r="18" />
        <circle cx="604" cy="160" r="24" />
        <circle cx="634" cy="128" r="26" />
        <circle cx="600" cy="98" r="22" />
        <circle cx="642" cy="82" r="20" />
      </>
    ),
  },
  {
    id: 'gas',
    name: 'Gas',
    text: 'La bombola accanto al fuoco perde gas.',
    ...generic,
    hit: [664, 222, 82, 112],
    mark: [728, 226],
    draw: (
      <>
        <rect x="670" y="262" width="34" height="70" rx="12" />
        <rect x="680" y="250" width="14" height="14" rx="3" />
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <path d="M702 252c8-4 8-10 16-14s10 0 16-4" />
          <path d="M704 266c8-4 10-8 18-10s10 2 16-2" />
        </g>
      </>
    ),
  },
  {
    id: 'animali',
    name: 'Animali',
    text: 'Una medusa spiaggiata sulla riva. Anche solo frammenti di alcune specie sono un pericolo, come i tentacoli di una medusa che restano urticanti.',
    ...generic,
    hit: [612, 348, 96, 70],
    mark: [600, 362],
    draw: (
      <>
        <path d="M630 382a30 24 0 0 1 60 0Z" />
        <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
          <path d="M638 384c-4 8 4 12 0 22" />
          <path d="M652 384c-4 8 4 12 0 24" />
          <path d="M668 384c-4 8 4 12 0 24" />
          <path d="M682 384c-4 8 4 12 0 22" />
        </g>
      </>
    ),
  },
]

/** "Trova i pericoli": find all eight hazards before approaching the victim. Click or Tab to each part of the scene. */
export function HazardScene() {
  const [found, setFound] = useState<string[]>([])
  const [open, setOpen] = useState<string | null>(null)
  const [miss, setMiss] = useState(false)
  const left = hazards.length - found.length
  const cur = hazards.find((h) => h.id === open)

  const pick = (id: string) => {
    setMiss(false)
    setOpen(id)
    if (!found.includes(id)) setFound([...found, id])
  }
  const key = (id: string) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(id)
    }
  }
  const restart = () => {
    setFound([])
    setOpen(null)
    setMiss(false)
  }

  return (
    <Stage title="Trova i pericoli" hint="Tocca o raggiungi con Tab ogni pericolo prima di avvicinarti alla vittima. Su uno schermo stretto scorri la scena di lato.">
      <div className="-mx-2 overflow-x-auto px-2 pb-1">
      <svg viewBox="0 40 800 390" className="w-full min-w-[32rem]" role="group" aria-label="Scena di un incidente vicino alla strada e alla spiaggia. Ogni elemento della scena si può selezionare.">
        <rect y="40" width="800" height="390" fill="transparent" onClick={() => (setMiss(true), setOpen(null))} />
        {/* ground, road, sea */}
        <g pointerEvents="none">
          <rect x="0" y="332" width="800" height="98" fill="var(--well-2)" />
          <rect x="0" y="384" width="226" height="46" fill="var(--well)" opacity="0.55" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={8 + k * 56} y="404" width="32" height="5" rx="2.5" fill="var(--well-soft)" opacity="0.6" />
          ))}
          <path d="M714 332h86v98h-112Z" fill="var(--well-soft)" opacity="0.22" />
          <path d="M724 352c10-6 20 6 30 0s20 6 30 0M716 380c10-6 20 6 30 0s20 6 30 0" fill="none" stroke="var(--well-soft)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* victim, supine */}
          <g fill="var(--well-ink)">
            <circle cx="314" cy="318" r="14" />
            <rect x="330" y="306" width="98" height="24" rx="12" />
            <rect x="422" y="310" width="72" height="18" rx="9" />
          </g>
        </g>

        {hazards.map((h, i) => {
          const on = found.includes(h.id)
          const [x, y, w, hh] = h.hit
          return (
            <g
              key={h.id}
              role="button"
              tabIndex={0}
              aria-label={on ? `${h.name}: pericolo trovato` : `Elemento ${i + 1} della scena`}
              aria-pressed={open === h.id}
              onClick={() => pick(h.id)}
              onKeyDown={key(h.id)}
              className={`group cursor-pointer outline-none transition-colors duration-200 ${on ? 'text-lume' : 'text-well-soft hover:text-well-ink'}`}
            >
              <rect x={x} y={y} width={w} height={hh} rx="10" fill="transparent" strokeWidth="4" strokeDasharray="10 6" className="stroke-transparent group-focus-visible:stroke-lume" />
              <g fill="currentColor">{h.draw}</g>
              {on && (
                <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} style={{ originX: 0.5, originY: 0.5 }}>
                  <path d={`M${h.mark[0]} ${h.mark[1] - 20}l19 32h-38Z`} fill="var(--warn)" stroke="var(--well)" strokeWidth="3" strokeLinejoin="round" />
                  <path d={`M${h.mark[0] - 1.6} ${h.mark[1] - 10}h3.2l-.6 11h-2Zm1.6 13.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z`} fill="var(--well)" />
                </motion.g>
              )}
            </g>
          )
        })}
      </svg>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-h-28 rounded-chip bg-well-2 p-4" aria-live="polite">
          {cur ? (
            <div className="flex gap-4">
              <img src={`/img/iso7010/${cur.sign}`} alt={cur.signAlt} className="w-14 shrink-0 self-start" />
              <div className="min-w-0">
                <p className="font-display text-[1.45rem] font-extrabold leading-none text-lume">{cur.name}</p>
                <p className="mt-1.5">{cur.text}</p>
              </div>
            </div>
          ) : miss ? (
            <p>Lì non c’è nessuno dei pericoli dell’elenco. Guarda meglio: ne restano {left}.</p>
          ) : (
            <p className="text-well-soft">Prima di soccorrere guardati intorno. Seleziona ciò che può fare male a te o alla vittima.</p>
          )}
          {left === 0 && <p className="mt-3 font-bold text-lume">Li hai trovati tutti e 8. Solo ora, eliminati i pericoli e protetto con i DPI, puoi avvicinarti alla vittima.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4 md:flex-col md:items-end">
          <p className="font-display text-[1.9rem] font-extrabold leading-none" aria-live="polite">
            {found.length} di {hazards.length}
            <span className="block text-[1rem] font-bold text-well-soft">{left ? `ne restano ${left}` : 'tutti trovati'}</span>
          </p>
          {found.length > 0 && (
            <Button variant="onDark" onClick={restart}>
              <RotateCcw className="size-4" aria-hidden /> Ricomincia
            </Button>
          )}
        </div>
      </div>
      {found.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pericoli trovati">
          {hazards
            .filter((h) => found.includes(h.id))
            .map((h) => (
              <button key={h.id} type="button" onClick={() => pick(h.id)} aria-pressed={open === h.id} className={`rounded-chip px-3 py-1.5 text-[0.95rem] ring-2 ring-inset transition-colors duration-150 ${open === h.id ? 'bg-well-2 text-lume ring-lume' : 'ring-well-2 hover:ring-well-soft'}`}>
                {h.name}
              </button>
            ))}
        </div>
      )}
    </Stage>
  )
}
