import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Pictogram } from '../../components/ui'

const ease = [0.23, 1, 0.32, 1] as const

/** Drip bag and line: the advanced life support link, drawn on the kit's 48 grid. */
const drip = (
  <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden className="w-[46%]">
    <path d="M16 4h16a3 3 0 0 1 3 3v15a7 7 0 0 1-7 7h-8a7 7 0 0 1-7-7V7a3 3 0 0 1 3-3Z" />
    <rect x="21.5" y="29" width="5" height="5" rx="1" />
    <path d="M22.5 34h3v4.5c0 1.4 1.1 2.5 2.5 2.5H42v3.5H28a6 6 0 0 1-5.5-6Z" />
  </svg>
)

export const links: { id: string; anchor: string; short: string; title: string; icon: ReactNode; body: ReactNode }[] = [
  {
    id: 'chiamata',
    anchor: 'riconoscimento',
    short: 'Chiamata',
    title: 'Riconoscimento e allertamento precoce: chiamata di emergenza',
    icon: <Pictogram name="telefono" className="w-[46%]" />,
    body: (
      <ul>
        <li>Riconosci l’arresto cardiaco: la persona non è cosciente e respira in modo anormale, anche con respiro agonico, lento e faticoso.</li>
        <li>Chiama subito il SME al numero unico di emergenza 1-1-2: prima chiami, prima arrivano i soccorsi.</li>
        <li>Se sei solo usa il vivavoce o gli auricolari, per avere le mani libere.</li>
        <li>Comunica nome, luogo esatto, dinamica, numero delle persone coinvolte, loro condizioni e soccorso prestato.</li>
      </ul>
    ),
  },
  {
    id: 'rcp',
    anchor: 'rcp-precoce',
    short: 'RCP',
    title: 'RCP precoce',
    icon: <Pictogram name="mani" className="w-[46%]" />,
    body: (
      <ul>
        <li>La RCP alterna compressioni toraciche e ventilazioni.</li>
        <li>Le compressioni prendono per un po’ il posto del cuore; le ventilazioni portano O2 ai polmoni.</li>
        <li>Mantiene in circolo, almeno in parte, sangue ossigenato e protegge gli organi vitali.</li>
        <li>Ogni minuto che passa dall’arresto le possibilità di sopravvivenza calano di circa il 10%.</li>
      </ul>
    ),
  },
  {
    id: 'defibrillazione',
    anchor: 'defibrillazione',
    short: 'Defibrillazione',
    title: 'Defibrillazione precoce',
    icon: <Pictogram name="dae" className="w-[46%]" />,
    body: (
      <ul>
        <li>L’arresto cardiaco è spesso dovuto a ritmi anomali, la fibrillazione ventricolare (FV) o la tachicardia ventricolare senza polso (TVSP): il cuore non pompa più in modo efficace.</li>
        <li>La RCP non fa ripartire il cuore; solo un defibrillatore agisce sul ritmo e permette la ripresa del circolo, il ROSC (Return of spontaneous circulation).</li>
        <li>Defibrillare entro 3-5 minuti dal collasso può portare la sopravvivenza fino al 50-70%.</li>
      </ul>
    ),
  },
  {
    id: 'als',
    anchor: 'als',
    short: 'ALS',
    title: 'Supporto avanzato alle funzioni vitali di base',
    icon: drip,
    body: (
      <ul>
        <li>Nell’arresto cardio-circolatorio (ACC) servono sempre interventi sanitari avanzati: l’ALS, Advanced Life Support.</li>
        <li>Il personale gestisce in modo avanzato le vie aeree e somministra farmaci.</li>
        <li>Se RCP e defibrillazione riescono, l’ALS stabilizza la persona per il trasporto all’ospedale più vicino.</li>
        <li>Senza la tua chiamata al SME, l’ALS non arriva.</li>
      </ul>
    ),
  },
]

function Ring({ on, icon }: { on: boolean; icon: ReactNode }) {
  return (
    <span className={`relative grid aspect-square w-full place-items-center transition-opacity duration-200 ${on ? '' : 'opacity-35'}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        <circle cx="50" cy="50" r="44" fill={on ? 'var(--must)' : 'none'} stroke="var(--must)" strokeWidth="10" />
      </svg>
      <span className={`relative grid w-full place-items-center ${on ? 'text-on-sign' : 'text-must'}`}>{icon}</span>
    </span>
  )
}

const cell = 'relative -ml-[3%] flex w-[clamp(4.5rem,22vw,8rem)] flex-col items-center first:ml-0'

/** The chain of survival: four interlocked rings. `active` lights one ring and fades the others, as in the manual's figures. */
export function ChainRow({ active }: { active?: number }) {
  return (
    <div className="flex justify-center px-3 py-6" role="img" aria-label={active === undefined ? 'La catena della sopravvivenza: chiamata, RCP, defibrillazione, supporto avanzato.' : `La catena della sopravvivenza con evidenziato l’anello ${active + 1}: ${links[active].title}.`}>
      {links.map((l, i) => (
        <span key={l.id} className={cell} style={{ zIndex: i === active ? 10 : undefined }}>
          <Ring on={active === undefined || active === i} icon={l.icon} />
          <span className="mt-2 text-center font-display text-[0.95rem] font-bold leading-tight hyphens-auto">{l.short}</span>
        </span>
      ))}
    </div>
  )
}

/** Select a ring to read what that link of the chain asks of you. */
export function ChainExplorer() {
  const [open, setOpen] = useState(0)
  const l = links[open]
  return (
    <div className="mount my-8 rounded-plate bg-panel">
      <div role="group" aria-label="Scegli un anello della catena" className="flex justify-center px-3 pb-2 pt-6">
        {links.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={open === i} onClick={() => setOpen(i)} className={`${cell} rounded-plate`} style={{ zIndex: open === i ? 10 : undefined }}>
            <Ring on={open === i} icon={x.icon} />
            <span className="mt-2 text-center font-display text-[0.95rem] font-bold leading-tight hyphens-auto">
              <span className="sr-only">Anello {i + 1}: </span>
              {x.short}
            </span>
          </button>
        ))}
      </div>
      <div aria-live="polite" className="min-h-64 border-t-2 border-ground p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }} className="max-w-[68ch] [&>*+*]:mt-3 [&_li+li]:mt-1.5 [&_ul]:list-[square] [&_ul]:pl-5">
            <p className="font-display text-[1.05rem] font-bold text-must">Anello {open + 1} di 4</p>
            <p className="font-display text-[1.6rem] font-extrabold leading-tight">{l.title}</p>
            {l.body}
            <a href={`#${l.anchor}`} className="inline-block font-bold text-safe-deep underline">
              Leggi la sottosezione completa
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
