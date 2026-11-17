import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui'

type Case = { text: string; options: { id: string; label: string }[]; answer: string; explain: string }

const yesNo = [
  { id: 'si', label: 'PLS sì' },
  { id: 'no', label: 'PLS no' },
]
const side = [
  { id: 'dx', label: 'PLS sul fianco destro' },
  { id: 'sx', label: 'PLS sul fianco sinistro' },
  { id: 'no', label: 'PLS no' },
]

const cases: Case[] = [
  {
    text: 'Non è cosciente ma respira. Non sospetti traumi a testa, collo o colonna vertebrale.',
    options: yesNo,
    answer: 'si',
    explain: 'È esattamente il caso della PLS: chi non è cosciente ma respira va messo sul fianco perché le vie aeree restino pervie.',
  },
  {
    text: 'Non è cosciente, respira e ha del vomito in bocca. Nessun sospetto di traumi.',
    options: yesNo,
    answer: 'si',
    explain: 'Sul fianco è la forza di gravità a far uscire i fluidi corporei come vomito o sangue: così non vengono inalati e non ostruiscono le vie aeree.',
  },
  {
    text: 'Non è cosciente e respira, ma sospetti una lesione al collo.',
    options: yesNo,
    answer: 'no',
    explain: 'Con lesioni o traumi a schiena e/o collo la persona non va messa in PLS: spostarla potrebbe causare danni ulteriori. Vale per qualunque variante della posizione.',
  },
  {
    text: 'Non è cosciente e respira, ma ha un trauma alla schiena.',
    options: yesNo,
    answer: 'no',
    explain: 'Schiena e/o collo lesi: niente PLS, perché lo spostamento potrebbe peggiorare il danno.',
  },
  {
    text: 'Non è cosciente e respira, ma sospetti un trauma alla testa.',
    options: yesNo,
    answer: 'no',
    explain: 'La PLS si esegue solo se non si sospettano traumi a testa, collo e colonna vertebrale.',
  },
  {
    text: 'Non è cosciente e non respira.',
    options: yesNo,
    answer: 'no',
    explain: 'La PLS è solo per chi non è cosciente ma respira.',
  },
  {
    text: 'Non è cosciente, respira e ha una ferita aperta sul lato destro del torace.',
    options: side,
    answer: 'dx',
    explain: 'Con lesioni al torace e/o al polmone si gira la persona sul lato leso: si favoriscono pervietà delle vie aeree e respirazione, e il sangue presente nella cavità toracica può defluire senza compromettere la funzione polmonare.',
  },
  {
    text: 'Non è cosciente, respira e ha una lesione al polmone sinistro.',
    options: side,
    answer: 'sx',
    explain: 'Sul lato leso, non su quello del polmone sano: è così che si aiutano pervietà delle vie aeree e respirazione.',
  },
  {
    text: 'È in PLS sul fianco destro da circa 30 minuti.',
    options: [
      { id: 'resta', label: 'Lascialo così' },
      { id: 'gira', label: 'Giralo sul lato opposto' },
    ],
    answer: 'gira',
    explain: 'Dopo circa 30 minuti in PLS l’infortunato va girato sul lato opposto: il braccio che resta sotto deve restare compresso il meno possibile, per non rischiare danni ischemici.',
  },
]

/** "PLS sì o no?": one case at a time, the learner decides and gets the reason with the manual page. */
export function PlsDecision() {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const done = i === cases.length
  const c = cases[i]
  const right = picked === c?.answer

  const pick = (id: string) => {
    if (picked) return
    setPicked(id)
    if (id === c.answer) setScore(score + 1)
  }
  const next = () => {
    setPicked(null)
    setI(i + 1)
  }
  const restart = () => {
    setI(0)
    setPicked(null)
    setScore(0)
  }

  return (
    <div className="my-10 max-w-[76ch] rounded-plate bg-panel p-5 md:p-6" role="group" aria-label="PLS sì o no?">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[1.7rem]">PLS sì o no?</h3>
        <p className="text-[0.9rem] text-ink-soft">{done ? `${cases.length} casi su ${cases.length}` : `Caso ${i + 1} di ${cases.length}`}</p>
      </div>

      {done ? (
        <div className="mt-4" aria-live="polite">
          <p className="font-display text-[2rem] font-extrabold leading-none">
            {score} su {cases.length}
          </p>
          <p className="mt-2">{score === cases.length ? 'Hai deciso bene in tutti i casi.' : 'Rileggi le due regole valide per tutte le posizioni di sicurezza e la nota su quando eseguirla, poi riprova.'}</p>
          <Button className="mt-4" variant="quiet" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden /> Ricomincia
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-[1.12rem] font-bold leading-snug">{c.text}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {c.options.map((o) => {
              const state = !picked ? 'bg-ground ring-line hover:ring-must' : o.id === c.answer ? 'bg-safe-tint ring-safe' : o.id === picked ? 'bg-danger-tint ring-danger' : 'bg-ground ring-transparent opacity-60'
              return (
                <button key={o.id} type="button" disabled={!!picked} onClick={() => pick(o.id)} className={`inline-flex items-center gap-2 rounded-chip px-4 py-2.5 font-bold ring-2 ring-inset transition-[box-shadow,background-color] duration-150 disabled:cursor-default ${state}`}>
                  {picked && o.id === c.answer && <Check className="size-4 text-safe" strokeWidth={3} aria-label="risposta corretta" />}
                  {picked && o.id === picked && o.id !== c.answer && <X className="size-4 text-danger" strokeWidth={3} aria-label="la tua risposta, sbagliata" />}
                  {o.label}
                </button>
              )
            })}
          </div>
          <div aria-live="polite">
            {picked && (
              <div className={`mt-4 rounded-chip p-4 ${right ? 'bg-safe-tint' : 'bg-danger-tint'}`}>
                <p className="font-bold">{right ? 'Giusto.' : `Non è così: la risposta è «${c.options.find((o) => o.id === c.answer)?.label}».`}</p>
                <p className="mt-1">
                  {c.explain} <span className="text-ink-soft">Manuale p. 54.</span>
                </p>
              </div>
            )}
          </div>
          {picked && (
            <Button className="mt-4" variant="must" onClick={next}>
              {i === cases.length - 1 ? 'Vedi il risultato' : 'Caso successivo'} <ArrowRight className="size-4" aria-hidden />
            </Button>
          )}
        </>
      )}
    </div>
  )
}
