import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { bySlug, sections } from '../../course'
import { progress, useProgress } from '../../lib/progress'
import { Callout } from './Callout'
import { Pictogram } from './Pictogram'
import { Plate } from './Plate'

type SubInfo = { id: string; title: string }
const ease = [0.23, 1, 0.32, 1] as const

/**
 * The frame of every section: green opener with the section's sign, a route rail listing the
 * subsections (built from the <Sub> elements on the page), the training warning and next/previous.
 */
export function SectionPage({ slug, lead, children }: { slug: string; lead: ReactNode; children: ReactNode }) {
  const info = bySlug(slug)!
  const body = useRef<HTMLDivElement>(null)
  const [subs, setSubs] = useState<SubInfo[]>([])
  const [active, setActive] = useState('')
  const seen = useProgress().seen[slug] ?? []
  const i = sections.indexOf(info)
  const prev = sections[i - 1]
  const next = sections[i + 1]

  useEffect(() => {
    const els = Array.from(body.current?.querySelectorAll<HTMLElement>('section[data-sub]') ?? [])
    setSubs(els.map((el) => ({ id: el.id, title: el.dataset.title ?? el.id })))
    progress.setSubs(slug, els.length)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          setActive(e.target.id)
          progress.markSeen(slug, e.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])

  return (
    <article>
      <header className="bg-safe text-on-sign">
        <div className="mx-auto grid max-w-[88rem] items-center gap-x-12 gap-y-8 px-5 py-14 md:grid-cols-[auto_1fr] md:px-10 md:py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease }}>
            <span className="grid aspect-square w-28 place-items-center rounded-plate bg-on-sign text-safe shadow-raise md:w-44">
              <Pictogram name={info.glyph} className="w-[64%]" />
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08, ease }}>
            <p className="font-display text-[1.5rem] font-bold leading-none opacity-90">
              {info.kind}, manuale pp. {info.pages}
            </p>
            <h1 className="mt-3 max-w-[20ch] text-title">{info.title}</h1>
            <div className="mt-5 max-w-[60ch] text-[1.12rem] leading-relaxed">{lead}</div>
          </motion.div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[88rem] gap-x-12 px-5 md:px-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav aria-label="In questa sezione" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-auto py-10 pr-2">
            <p className="font-display text-[1.25rem] font-bold leading-none">In questa sezione</p>
            <ol className="relative mt-5 space-y-0.5">
              <span className="absolute bottom-3 left-[0.6875rem] top-3 w-0.5 bg-line" aria-hidden />
              {subs.map((s) => {
                const done = seen.includes(s.id)
                const here = active === s.id
                return (
                  <li key={s.id}>
                    <a href={`#${s.id}`} aria-current={here ? 'location' : undefined} className={`relative flex gap-3 rounded-chip py-1.5 pr-2 text-[0.9rem] leading-snug hover:text-ink ${here ? 'font-bold text-ink' : 'text-ink-soft'}`}>
                      <span className={`relative z-10 mt-px grid size-6 shrink-0 place-items-center rounded-[5px] ring-2 ring-inset transition-colors duration-200 ${here ? 'bg-must text-on-sign ring-must' : done ? 'bg-safe text-on-sign ring-safe' : 'bg-ground ring-line'}`}>
                        {done && !here && <Check className="size-3.5" strokeWidth={4} aria-label="letto" />}
                      </span>
                      {s.title}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        </nav>

        <div ref={body} className="min-w-0 pb-16">
          {children}

          <Callout kind="attenzione" title="Questo corso non sostituisce l’addestramento pratico">
            <p>
              Per saper applicare queste tecniche serve un corso BLS(D) con un istruttore DAN qualificato. Qui prepari la teoria e ripassi le sequenze: le manovre si imparano sul manichino.
            </p>
          </Callout>

          <nav aria-label="Sezioni vicine" className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev ? <Direction to={`/sezione/${prev.slug}`} label="Sezione precedente" title={prev.title} back /> : <span />}
            {next ? <Direction to={`/sezione/${next.slug}`} label="Prossima sezione" title={next.title} /> : <Direction to="/esame" label="Hai finito le sezioni" title="Vai all’esame finale" />}
          </nav>
        </div>
      </div>
    </article>
  )
}

/** A direction sign: where the route goes next. */
function Direction({ to, label, title, back }: { to: string; label: string; title: string; back?: boolean }) {
  return (
    <Link to={to} className={`group flex items-center gap-4 rounded-plate p-4 transition-[background-color] duration-150 ${back ? 'bg-panel hover:bg-panel-2' : 'bg-safe text-on-sign hover:bg-safe-deep sm:flex-row-reverse sm:text-right'}`}>
      <Plate glyph="freccia" className={`w-12 ${back ? 'rotate-180' : ''} transition-transform duration-200 ease-out ${back ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9rem] opacity-85">{label}</span>
        <span className="block font-display text-[1.45rem] font-extrabold leading-tight">{title}</span>
      </span>
    </Link>
  )
}

/**
 * One subsection. `id` is the anchor (kebab-case, unique on the page), `title` the heading as in the manual,
 * `page` the manual page(s). Children are plain tags (p, ul, ol, h3, h4) plus kit components.
 */
export function Sub({ id, title, page, children }: { id: string; title: string; page?: string; children: ReactNode }) {
  return (
    <section id={id} data-sub data-title={title} className="scroll-mt-24 pt-16">
      <h2 className="max-w-[24ch] text-sub">{title}</h2>
      {page && <p className="mt-2 text-[0.88rem] text-ink-soft">Manuale p. {page}</p>}
      <div className="prose-corso mt-6">{children}</div>
    </section>
  )
}
