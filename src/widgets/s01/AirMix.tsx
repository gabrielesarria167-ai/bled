import { ArrowDown, ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Pictogram } from '../../components/ui'

const ease = [0.23, 1, 0.32, 1] as const
const O2 = 21 // the manual: about 21% oxygen, about 79% nitrogen
const cells = Array.from({ length: 100 }, (_, i) => i < O2)

/** Inhaled air as 100 squares (21 oxygen, 79 nitrogen); exhaled air is described only as richer in CO2, as in the manual. */
export function AirMix() {
  const [out, setOut] = useState(false)
  const btn = (on: boolean) => `rounded-chip px-4 py-2 font-display text-[1.15rem] font-bold leading-none ring-2 ring-inset transition-colors duration-150 ${on ? 'bg-must text-on-sign ring-must' : 'ring-line hover:ring-ink-soft'}`

  return (
    <figure className="my-8 max-w-[72ch]">
      <div className="mount rounded-plate bg-panel p-4 sm:p-6">
        <div role="group" aria-label="Scegli quale aria guardare" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!out} onClick={() => setOut(false)} className={btn(!out)}>
            Aria inspirata
          </button>
          <button type="button" aria-pressed={out} onClick={() => setOut(true)} className={btn(out)}>
            Aria espirata
          </button>
        </div>

        <div className="mt-6 grid items-center gap-6 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <div className="flex items-center justify-center gap-2 text-safe sm:flex-col" aria-hidden>
            <motion.span animate={{ rotate: out ? 180 : 0 }} transition={{ duration: 0.3, ease }}>
              <ArrowDown className="size-8" strokeWidth={3} />
            </motion.span>
            <motion.span animate={{ scale: out ? 0.88 : 1.06 }} transition={{ duration: 0.3, ease }}>
              <Pictogram name="polmoni" className="w-20 sm:w-24" />
            </motion.span>
          </div>

          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {out ? (
                <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }}>
                  <p className="flex items-center gap-2 font-display text-[2rem] font-extrabold leading-none">
                    Più CO<sub className="text-[0.6em]">2</sub> <ArrowUp className="size-7 text-safe" strokeWidth={3} aria-hidden />
                  </p>
                  <p className="mt-3">L’aria che esce dai polmoni ha una concentrazione di anidride carbonica (CO2) aumentata: è la CO2, scarto del metabolismo, che dai capillari è diffusa negli alveoli.</p>
                  <p className="mt-2 text-[0.92rem] text-ink-soft">Il manuale non riporta le percentuali dell’aria espirata, quindi qui non trovi numeri.</p>
                </motion.div>
              ) : (
                <motion.div key="in" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease }}>
                  <div className="grid w-full max-w-[17rem] grid-cols-10 gap-[3px]" role="img" aria-label="Su 100 parti d’aria inspirata, circa 21 sono ossigeno e circa 79 azoto.">
                    {cells.map((o2, i) => (
                      <motion.span key={i} className={`aspect-square rounded-[2px] ${o2 ? 'bg-safe' : 'bg-ink-soft/30'}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.004, ease }} />
                    ))}
                  </div>
                  <dl className="mt-4 grid gap-1 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="size-3.5 rounded-[2px] bg-safe" aria-hidden />
                      <dt>Ossigeno (O2)</dt>
                      <dd className="font-display text-[1.4rem] font-extrabold leading-none">circa 21%</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="size-3.5 rounded-[2px] bg-ink-soft/30" aria-hidden />
                      <dt>Azoto</dt>
                      <dd className="font-display text-[1.4rem] font-extrabold leading-none">circa 79%</dd>
                    </div>
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-[0.88rem] leading-snug text-ink-soft">Ogni quadrato è un centesimo dell’aria che respiri. Passa ad Aria espirata per vedere che cosa cambia dopo lo scambio dei gas negli alveoli.</figcaption>
    </figure>
  )
}
