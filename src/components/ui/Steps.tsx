import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Button } from './Button'

export type Step = { title: string; body: ReactNode; visual?: ReactNode }

/**
 * A real sequence (procedures only). `mode="list"` shows every step; `mode="stepper"` shows one at a time
 * with previous/next, for long procedures the learner should walk through.
 */
export function Steps({ items, mode = 'list', label = 'Procedura' }: { items: Step[]; mode?: 'list' | 'stepper'; label?: string }) {
  const [i, setI] = useState(0)

  if (mode === 'list')
    return (
      <ol className="my-6 max-w-[72ch] space-y-5">
        {items.map((s, n) => (
          <li key={s.title} className="grid grid-cols-[2.75rem_1fr] gap-x-4">
            <span className="grid size-11 place-items-center rounded-chip bg-must font-display text-[1.6rem] font-extrabold leading-none text-on-sign">{n + 1}</span>
            <div className="min-w-0 pt-1 [&>*+*]:mt-2 [&_ul]:list-[square] [&_ul]:pl-5">
              <p className="font-display text-[1.35rem] font-bold leading-tight">{s.title}</p>
              {s.body}
              {s.visual}
            </div>
          </li>
        ))}
      </ol>
    )

  const s = items[i]
  return (
    <div className="my-8 overflow-hidden rounded-plate bg-panel" role="group" aria-label={label}>
      <div className="flex gap-1 p-3" aria-hidden>
        {items.map((it, n) => (
          <span key={it.title} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${n <= i ? 'bg-must' : 'bg-panel-2'}`} />
        ))}
      </div>
      <div className="grid gap-6 p-6 pt-3 md:grid-cols-[1fr_minmax(0,22rem)] md:items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }} className="[&>*+*]:mt-2 [&_ul]:list-[square] [&_ul]:pl-5">
            <p className="font-display text-[1.05rem] font-bold text-must">
              Passo {i + 1} di {items.length}
            </p>
            <p className="font-display text-[1.8rem] font-extrabold leading-none">{s.title}</p>
            {s.body}
          </motion.div>
        </AnimatePresence>
        {s.visual && <div className="min-w-0">{s.visual}</div>}
      </div>
      <div className="flex items-center justify-between gap-3 border-t-2 border-ground p-3">
        <Button variant="quiet" disabled={i === 0} onClick={() => setI(i - 1)}>
          <ChevronLeft className="size-5" aria-hidden /> Indietro
        </Button>
        <Button variant="must" disabled={i === items.length - 1} onClick={() => setI(i + 1)}>
          Avanti <ChevronRight className="size-5" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
