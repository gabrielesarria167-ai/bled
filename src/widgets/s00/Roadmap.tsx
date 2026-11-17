import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useState, type ReactNode } from 'react'
import { Pictogram, type Glyph } from '../../components/ui'
import { sections } from '../../course'
import { sectionState, useProgress } from '../../lib/progress'

const ease = [0.23, 1, 0.32, 1] as const

const phases: { id: string; title: string; glyph: Glyph; who: string; body: ReactNode }[] = [
  {
    id: 'conoscenze',
    title: 'Sviluppo delle conoscenze',
    glyph: 'libro',
    who: 'Lezione del tuo DAN BLS(D) Instructor, manuale, domande di ripasso',
    body: <p>La parte teorica: 13 argomenti, dall’anatomia di base fino all’uso e ai controlli del DAE. La lezione dell’istruttore è indispensabile per capire a fondo il manuale; le domande alla fine di ogni sezione ti aiutano a fissare le nozioni.</p>,
  },
  {
    id: 'abilita',
    title: 'Sviluppo delle abilità',
    glyph: 'mani',
    who: 'In pratica, con un DAN Instructor BLS(D)',
    body: <p>Metti in pratica ciò che hai studiato. L’istruttore ti guida nelle manovre e verifica quanto hai appreso.</p>,
  },
  {
    id: 'certificazione',
    title: 'Certificazione finale',
    glyph: 'esame',
    who: 'Due prove: conoscenze e abilità pratiche',
    body: <p>Il brevetto DAN BLS(D) Provider arriva solo se risulti idoneo in entrambe le prove. Te lo invia DAN Education per e-mail e lo ritrovi in MyDAN o nell’APP.</p>,
  },
]

/** The course in three stages: pick a stage to see what happens there and jump to its subsection. */
export function Roadmap() {
  const [open, setOpen] = useState(0)
  const p = useProgress()
  const done = sections.filter((s) => sectionState(p, s.slug) === 'completata').length
  const ph = phases[open]

  return (
    <div className="mount my-8 rounded-plate bg-panel p-4 sm:p-6">
      <div role="group" aria-label="Le tre tappe del corso" className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {phases.map((x, i) => (
          <Fragment key={x.id}>
            {i > 0 && <Pictogram name="freccia" className="mx-auto w-7 rotate-90 text-safe sm:rotate-0" />}
            <button type="button" aria-pressed={open === i} onClick={() => setOpen(i)} className={`group flex items-center gap-3 rounded-plate p-3 text-left transition-colors duration-150 ${open === i ? 'plate' : 'bg-ground ring-[3px] ring-inset ring-safe hover:bg-safe-tint'}`}>
              <span className={`grid size-12 shrink-0 place-items-center rounded-chip ${open === i ? 'bg-on-sign text-safe' : 'bg-safe text-on-sign'}`}>
                <Pictogram name={x.glyph} className="w-8" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.85rem] opacity-85">Tappa {i + 1}</span>
                <span className="block font-display text-[1.3rem] font-extrabold leading-[1.05]">{x.title}</span>
              </span>
            </button>
          </Fragment>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 min-h-40">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={ph.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }} className="max-w-[68ch] [&>*+*]:mt-2">
            <p className="font-display text-[1.6rem] font-extrabold leading-none">{ph.title}</p>
            <p className="text-[0.95rem] text-ink-soft">{ph.who}</p>
            {ph.body}
            {open === 0 && (
              <p className="rounded-chip bg-safe-tint p-3 text-[0.95rem]">
                Questo sito ti accompagna in questa tappa: finora hai completato {done} di {sections.length} sezioni.
              </p>
            )}
            <a href={`#${ph.id}`} className="inline-block font-bold text-safe-deep underline">
              Leggi la tappa per intero
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
