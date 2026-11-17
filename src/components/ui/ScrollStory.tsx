import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState, type ReactNode } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type StoryStep = { title: string; body: ReactNode }

/**
 * Scrollytelling: a visual stays pinned while the text steps scroll past it. `visual` receives the active
 * step index and the 0..1 progress through the whole story, so scrolling can draw, fill or move it.
 * The steps are ordinary text in the document, so nothing is lost without motion or scripts.
 */
export function ScrollStory({ steps, visual, label }: { steps: StoryStep[]; visual: (active: number, progress: number) => ReactNode; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [p, setP] = useState(0)

  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 55%', end: 'bottom 55%', onUpdate: (self) => setP(self.progress) })
      gsap.utils.toArray<HTMLElement>('[data-step]', root.current).forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && setActive(i) })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="my-10 grid gap-x-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]" role="group" aria-label={label}>
      <div className="sticky top-[4.5rem] z-10 h-[42svh] self-start overflow-hidden rounded-plate bg-well text-well-ink shadow-raise lg:top-24 lg:h-[72svh]">{visual(active, p)}</div>
      <ol className="lg:py-[14svh]">
        {steps.map((s, i) => (
          <li key={s.title} data-step className={`flex min-h-[46svh] flex-col justify-center py-6 transition-opacity duration-300 lg:min-h-[58svh] ${i === active ? '' : 'opacity-45'}`}>
            <p className="font-display text-[1.8rem] font-extrabold leading-none">{s.title}</p>
            <div className="mt-3 [&>*+*]:mt-2 [&_ul]:list-[square] [&_ul]:pl-5">{s.body}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
