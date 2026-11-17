import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'

type Opt = { id: string; label: string }
type Case = { text: string; options: Opt[]; answer: string; why: string }

const byVessel: Opt[] = [
  { id: 'capillare', label: 'Capillare' },
  { id: 'venosa', label: 'Venosa' },
  { id: 'arteriosa', label: 'Arteriosa' },
]
const bySite: Opt[] = [
  { id: 'esterna', label: 'Esterna' },
  { id: 'interna', label: 'Interna' },
  { id: 'esteriorizzata', label: 'Interna esteriorizzata' },
]

/** What each type looks like, shown when the learner picks it by mistake. */
const looks: Record<string, string> = {
  capillare: 'Nella capillare il sangue esce lento e più che scorrere filtra.',
  venosa: 'Nella venosa il sangue è rosso scuro ed esce con un flusso lento e costante.',
  arteriosa: 'Nell’arteriosa il sangue è rosso vivo ed esce con un flusso elevato e pulsante, al ritmo del cuore.',
  esterna: 'Nell’esterna il sangue arriva fuori dal corpo, per esempio da una ferita della pelle.',
  interna: 'Nell’interna il sangue fuoriuscito resta dentro il corpo.',
  esteriorizzata: 'Nell’interna esteriorizzata il sangue di un’emorragia interna esce da un orifizio naturale.',
  osserva: 'Distinguere venosa e arteriosa qui ti fa solo perdere tempo.',
}

const cases: Case[] = [
  {
    text: 'Una ferita superficiale: il sangue esce pianissimo, più che scorrere sembra filtrare.',
    options: byVessel,
    answer: 'capillare',
    why: 'Sono danneggiati i capillari, i vasi più piccoli. È facile da controllare e di solito si ferma da sola, ma può infettarsi: disinfetta la ferita e coprila con una medicazione, possibilmente sterile.',
  },
  {
    text: 'Da un taglio profondo esce sangue rosso scuro, con un flusso lento e costante, senza spinte.',
    options: byVessel,
    answer: 'venosa',
    why: 'Rosso scuro e flusso lento e costante: è danneggiata una vena. Di norma si arresta con pressione diretta e fasciatura. Va comunque considerata potenzialmente grave.',
  },
  {
    text: 'Il sangue è rosso vivo ed esce con getti forti, che crescono e calano a ogni battito del cuore.',
    options: byVessel,
    answer: 'arteriosa',
    why: 'Rosso vivo, flusso elevato e pulsante, sincrono con i battiti: è un’arteria, dove il sangue scorre ad alta pressione. È sempre grave, è difficile da controllare e richiede cure immediate.',
  },
  {
    text: 'Dopo un trauma non vedi sangue uscire dal corpo, ma il sangue fuoriuscito dai vasi si sta raccogliendo all’interno.',
    options: bySite,
    answer: 'interna',
    why: 'Il sangue è uscito dai vasi ma non arriva all’esterno del corpo: è un’emorragia interna.',
  },
  {
    text: 'Non c’è nessuna ferita sulla pelle: il sangue arriva dall’interno del corpo ed esce dall’orecchio.',
    options: bySite,
    answer: 'esteriorizzata',
    why: 'Il sangue di un’emorragia interna esce attraverso un orifizio naturale (bocca, naso, orecchio): è un’emorragia interna esteriorizzata.',
  },
  {
    text: 'Un taglio sul braccio sanguina molto: è un’emorragia esterna grave. Non capisci se il sangue sia rosso scuro o rosso vivo. Cosa fai?',
    options: [
      { id: 'osserva', label: 'Osservo meglio, per capire se è venosa o arteriosa' },
      { id: 'subito', label: 'Intervengo subito: in entrambi i casi serve soccorso immediato' },
    ],
    answer: 'subito',
    why: 'Il soccorritore non deve mai perdere tempo a stabilire se l’emorragia è venosa o arteriosa: un’emorragia esterna grave richiede in ogni caso soccorso immediato.',
  },
]

/** Riconosci l'emorragia: a described case, the learner names the type, the feedback teaches. */
export function RecognizeBleed() {
  const [n, setN] = useState(0)
  const [picks, setPicks] = useState<string[]>([])
  const c = cases[n]
  const pick = picks[n]
  const done = n === cases.length - 1 && !!pick
  const right = picks.filter((p, i) => p === cases[i].answer).length

  const restart = () => {
    setN(0)
    setPicks([])
  }

  return (
    <div className="mount my-8 rounded-plate bg-panel p-5 md:p-6" role="group" aria-label="Esercizio: riconosci l’emorragia">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-[1.3rem] font-bold leading-tight">Riconosci l’emorragia</p>
        <p className="text-[0.9rem] text-ink-soft">
          Caso {n + 1} di {cases.length}
        </p>
      </div>
      <p className="mt-3 max-w-[60ch] text-[1.12rem] font-bold leading-snug">{c.text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.options.map((o) => {
          const state = !pick ? 'bg-ground ring-line hover:ring-ink-soft' : o.id === c.answer ? 'bg-safe-tint ring-safe' : o.id === pick ? 'bg-danger-tint ring-danger' : 'bg-ground ring-line opacity-60'
          return (
            <button key={o.id} type="button" disabled={!!pick} onClick={() => setPicks([...picks.slice(0, n), o.id])} className={`inline-flex items-center gap-2 rounded-chip px-4 py-2.5 text-left ring-2 ring-inset transition-colors duration-150 disabled:cursor-default ${state}`}>
              {pick && o.id === c.answer && <Check className="size-4 shrink-0 text-safe" strokeWidth={3} aria-hidden />}
              {pick && o.id === pick && o.id !== c.answer && <X className="size-4 shrink-0 text-danger" strokeWidth={3} aria-hidden />}
              {o.label}
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {pick && (
          <div className={`mt-4 max-w-[62ch] rounded-chip p-4 ${pick === c.answer ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
            <p className="font-bold">{pick === c.answer ? 'Esatto.' : `Non è così: la risposta è “${c.options.find((o) => o.id === c.answer)!.label}”.`}</p>
            {pick !== c.answer && looks[pick] && <p className="mt-1">{looks[pick]}</p>}
            <p className="mt-1">{c.why}</p>
          </div>
        )}
        {done && (
          <p className="mt-4 font-display text-[1.5rem] font-extrabold leading-none">
            {right} su {cases.length} riconosciute
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {pick && n < cases.length - 1 && (
          <Button variant="must" onClick={() => setN(n + 1)}>
            Caso successivo
          </Button>
        )}
        {done && (
          <Button variant="quiet" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        )}
      </div>
    </div>
  )
}
