import { Check } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink } from '../components/ui/Button'
import { Pictogram } from '../components/ui/Pictogram'
import { SignMark } from '../components/ui/Plate'
import { bySlug, sections } from '../course'
import { sectionState, useProgress } from '../lib/progress'
import { RhythmTrainer } from '../widgets/RhythmTrainer'

const drills = [
  { to: '/sezione/rcp#ritmo', title: 'Il ritmo delle compressioni', text: 'Tieni 100–120 al minuto per 30 compressioni.' },
  { to: '/sezione/dae#simulatore', title: 'Il simulatore DAE', text: 'Segui le istruzioni vocali fino allo shock.' },
  { to: '/simulazione', title: 'Un soccorso dall’inizio alla fine', text: 'Dalla sicurezza della scena all’arrivo del SME.' },
]

const legend = [
  { kind: 'nota', title: 'Quadrato verde', text: 'Informazione e condizione sicura: note, risposte corrette, tappe completate.' },
  { kind: 'obbligo', title: 'Cerchio blu', text: 'Azione obbligatoria: i passi di una procedura, ciò che va fatto sempre.' },
  { kind: 'attenzione', title: 'Triangolo giallo', text: 'Attenzione: un rischio o un caso particolare da tenere presente.' },
  { kind: 'divieto', title: 'Cerchio rosso barrato', text: 'Divieto: ciò che non va fatto, e le risposte sbagliate.' },
] as const

export default function Home() {
  const p = useProgress()
  const states = sections.map((s) => sectionState(p, s.slug))
  const done = states.filter((s) => s === 'completata').length
  const last = p.last ? bySlug(p.last.slug) : undefined
  const nextUp = sections[states.findIndex((s) => s !== 'completata')] ?? sections[0]
  const resume = last && sectionState(p, last.slug) !== 'completata' ? last : nextUp

  return (
    <>
      <section className="bg-safe text-on-sign">
        <div className="mx-auto grid max-w-[88rem] items-center gap-x-16 gap-y-12 px-5 py-14 md:px-10 md:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <h1 className="max-w-[11ch] text-display">Cosa fai se un cuore si ferma?</h1>
            <p className="mt-6 max-w-[52ch] text-[1.2rem] leading-relaxed">
              Tutto il manuale DAN BLS-D in {sections.length} tappe. Leggi, prova le manovre sullo schermo, poi verifica con le domande di ripasso, prima del corso con l’istruttore.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink to={`/sezione/${resume.slug}`} variant="onDark" className="px-6 py-3.5 text-[1.35rem]">
                {done || p.last ? `Riprendi: ${resume.short}` : 'Inizia dall’introduzione'}
              </ButtonLink>
              <a href="#percorso" className="font-display text-[1.25rem] font-bold underline">
                Guarda il percorso
              </a>
            </div>
          </div>
          <RhythmTrainer />
        </div>
      </section>

      <section id="percorso" className="mx-auto grid max-w-[88rem] scroll-mt-20 gap-x-16 gap-y-10 px-5 py-16 md:px-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <h2 className="text-title">Il percorso</h2>
          <p className="mt-3 max-w-[60ch] text-ink-soft">Le tappe seguono l’ordine del manuale. Un segnale si riempie quando superi le domande di ripasso della sezione.</p>
          <ol className="relative mt-10">
            <span className="absolute bottom-10 left-[1.9375rem] top-10 w-0.5 bg-line" aria-hidden />
            {sections.map((s, i) => {
              const st = states[i]
              return (
                <li key={s.slug}>
                  <Link to={`/sezione/${s.slug}`} className="group relative grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-x-5 rounded-plate py-3 pr-4 transition-colors duration-150 hover:bg-panel">
                    <span className={`relative grid aspect-square w-16 place-items-center rounded-plate transition-transform duration-200 ease-out group-hover:scale-105 ${st === 'nuova' ? 'bg-ground text-safe ring-[3px] ring-inset ring-safe' : 'plate'}`}>
                      <Pictogram name={s.glyph} className="w-[62%]" />
                      {st === 'completata' && (
                        <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-ink text-ground">
                          <Check className="size-4" strokeWidth={3.5} aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.88rem] text-ink-soft">
                        {s.kind}, pp. {s.pages}
                        {st === 'completata' ? ', completata' : st === 'in-corso' ? ', in corso' : ''}
                      </span>
                      <span className="block font-display text-[1.7rem] font-extrabold leading-[1.05]">{s.title}</span>
                      <span className="mt-1 block max-w-[62ch] text-[0.97rem] leading-snug text-ink-soft">{s.goal}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="lg:pt-2">
          <div className="space-y-10 lg:sticky lg:top-24">
            <div>
              <p className="font-display text-[3.5rem] font-extrabold leading-none">
                {done}
                <span className="text-[1.5rem] font-bold"> di {sections.length}</span>
              </p>
              <p className="text-ink-soft">sezioni completate</p>
              <div className="mt-3 flex gap-1" aria-hidden>
                {states.map((st, i) => (
                  <span key={i} className={`h-2.5 flex-1 rounded-[2px] ${st === 'completata' ? 'bg-safe' : st === 'in-corso' ? 'bg-safe/40' : 'bg-panel-2'}`} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-[1.6rem]">Prove pratiche</h2>
              <ul className="mt-3 space-y-1">
                {drills.map((d) => (
                  <li key={d.to}>
                    <Link to={d.to} className="block rounded-chip py-2 hover:bg-panel hover:px-3 transition-[padding,background-color] duration-150">
                      <span className="block font-bold underline">{d.title}</span>
                      <span className="block text-[0.92rem] text-ink-soft">{d.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink to="/esame" variant="must" className="w-full">
              Esame finale
            </ButtonLink>
          </div>
        </aside>
      </section>

      <section className="bg-panel">
        <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10">
          <h2 className="text-title">Come leggere i segnali</h2>
          <p className="mt-3 max-w-[60ch] text-ink-soft">Nel corso forma e colore hanno sempre lo stesso significato, come nella segnaletica di sicurezza.</p>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
            {legend.map((l) => (
              <div key={l.kind} className="flex gap-4">
                <SignMark kind={l.kind} className="w-12" />
                <div className="min-w-0">
                  <dt className="font-display text-[1.35rem] font-bold leading-tight">{l.title}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-snug text-ink-soft">{l.text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
