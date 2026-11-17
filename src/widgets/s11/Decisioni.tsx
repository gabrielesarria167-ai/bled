import { Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { canAdvance, spinalAction, type DrillCase, type SpinalAction, type SpinalFacts } from './logic'

type Option = { id: string; label: string }
type Confirm = { when: string; title: string; items: string[] }

/** Case after case, the learner picks what to do and gets the reason at once. Lives inside a <Stage>. */
export function DecisionDrill({ cases, options, confirm, question }: { cases: DrillCase[]; options: Option[]; confirm?: Confirm; question: string }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [ticked, setTicked] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const restart = () => {
    setI(0)
    setPicked(null)
    setTicked([])
    setScore(0)
  }

  if (i === cases.length)
    return (
      <div aria-live="polite">
        <p className="font-display text-[2.6rem] font-extrabold leading-none text-lume">
          {score} su {cases.length}
        </p>
        <p className="mt-2 max-w-[60ch]">{score === cases.length ? 'Tutte le decisioni sono corrette.' : 'Rileggi le spiegazioni dei casi sbagliati e riprova.'}</p>
        <Button variant="onDark" className="mt-4" onClick={restart}>
          <RotateCcw className="size-4" aria-hidden /> Ricomincia
        </Button>
      </div>
    )

  const c = cases[i]
  const right = picked === c.answer
  const answerLabel = options.find((o) => o.id === c.answer)?.label
  const needConfirm = !!confirm && picked !== null && c.answer === confirm.when

  return (
    <div>
      <p className="text-[0.92rem] text-well-soft">
        Caso {i + 1} di {cases.length}
      </p>
      <p className="mt-1 max-w-[62ch] text-[1.12rem] leading-snug">{c.text}</p>
      <p className="mt-4 font-bold">{question}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const on = picked === o.id
          const show = picked !== null && (o.id === c.answer || on)
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked !== null}
              aria-pressed={on}
              onClick={() => {
                setPicked(o.id)
                if (o.id === c.answer) setScore(score + 1)
              }}
              className={`flex items-start gap-2 rounded-chip bg-well-2 p-3 text-left ring-2 ring-inset transition-colors duration-150 disabled:cursor-default ${show && o.id === c.answer ? 'ring-lume' : on ? 'ring-well-ink' : 'ring-transparent hover:ring-well-soft'} ${picked !== null && !show ? 'opacity-55' : ''}`}
            >
              <span className="min-w-0 flex-1">{o.label}</span>
              {show && o.id === c.answer && <Check className="mt-0.5 size-5 shrink-0 text-lume" strokeWidth={3} aria-label="Scelta corretta" />}
              {show && on && o.id !== c.answer && <X className="mt-0.5 size-5 shrink-0" strokeWidth={3} aria-label="Scelta sbagliata" />}
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {picked !== null && (
          <div className="mt-4 rounded-chip bg-well-2 p-4">
            <p className={`font-bold ${right ? 'text-lume' : ''}`}>{right ? 'Corretto.' : `Non è la scelta giusta. Qui la risposta è: ${answerLabel}.`}</p>
            <p className="mt-1">{c.why}</p>
            {needConfirm && confirm && (
              <fieldset className="mt-3">
                <legend className="font-bold">{confirm.title}</legend>
                <ul className="mt-2 space-y-1">
                  {confirm.items.map((it, n) => (
                    <li key={it}>
                      <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" className="mt-1 size-5 shrink-0 accent-lume" checked={ticked.includes(n)} onChange={() => setTicked(ticked.includes(n) ? ticked.filter((t) => t !== n) : [...ticked, n])} />
                        <span>{it}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {ticked.length < confirm.items.length && <p className="mt-2 text-[0.92rem] text-well-soft">Spunta tutti i fattori per passare al caso successivo.</p>}
              </fieldset>
            )}
          </div>
        )}
      </div>

      {picked !== null && (
        <Button
          variant="onDark"
          className="mt-4"
          disabled={!canAdvance(c, picked, confirm?.when, ticked.length, confirm?.items.length ?? 0)}
          onClick={() => {
            setI(i + 1)
            setPicked(null)
            setTicked([])
          }}
        >
          {i === cases.length - 1 ? 'Vedi il risultato' : 'Caso successivo'}
        </Button>
      )}
    </div>
  )
}

const moveFactors = ['Il peso della vittima', 'Il percorso da coprire', 'Le tue condizioni e la tua esperienza', 'Quanti soccorritori servono per agire in sicurezza']

export const moveCases: DrillCase[] = [
  { id: 'bici', text: 'Un ciclista è caduto su una pista ciclabile chiusa al traffico. È cosciente, parla e dice di avere male al collo. Intorno non ci sono pericoli.', answer: 'resta', why: 'È cosciente, il trauma è certo e si può sospettare una lesione del collo: va lasciato nella posizione in cui l’hai trovato.' },
  { id: 'fuoco', text: 'In un capannone una persona è a terra e non si muove. Da un macchinario lì vicino si alza del fumo e compaiono le prime fiamme.', answer: 'sposta', why: 'Il fuoco è un pericolo incombente: è uno dei tre casi in cui lo spostamento diventa necessario.' },
  { id: 'respiro', text: 'Una persona è distesa a faccia in giù sul pavimento e non risponde. In quella posizione non riesci a capire se respira.', answer: 'sposta', why: 'Devi controllare se respira: è uno dei motivi che giustificano lo spostamento. Per portarla sulla schiena c’è la manovra di rotazione (Log Roll).' },
  { id: 'cucina', text: 'Una signora è scivolata in cucina. È seduta a terra, cosciente, e ti dice di aver battuto la schiena. La stanza è sicura.', answer: 'resta', why: 'Persona cosciente, origine traumatica e possibile lesione della colonna: la regola è lasciarla dove si trova.' },
  { id: 'auto', text: 'Dopo un incidente un automobilista incosciente è accasciato nell’abitacolo: lì dentro non puoi prestargli il primo soccorso.', answer: 'sposta', why: 'Per poter prestare il primo soccorso lo spostamento diventa necessario. La tecnica Rautek serve anche a estrarre la persona dall’abitacolo, tenendole sempre bloccata la testa.' },
  { id: 'strada', text: 'Un pedone è stato investito ed è a terra in mezzo a una strada dove le auto continuano a passare.', answer: 'sposta', why: 'Il traffico di veicoli è un pericolo incombente: lo spostamento è necessario, sulla distanza più breve possibile.' },
]

export function SpostoONo() {
  return (
    <DecisionDrill
      question="Che cosa fai?"
      cases={moveCases}
      options={[
        { id: 'resta', label: 'La lascio nella posizione in cui l’ho trovata' },
        { id: 'sposta', label: 'La sposto' },
      ]}
      confirm={{ when: 'sposta', title: 'Prima di spostarla, valuta tutti questi fattori insieme:', items: moveFactors }}
    />
  )
}

const spinalOptions: { id: SpinalAction; label: string }[] = [
  { id: 'stabilizza', label: 'La lascio come si trova e le stabilizzo la testa con le mani su entrambi i lati' },
  { id: 'ruota', label: 'La ruoto sulla schiena con il minimo movimento' },
  { id: 'pls', label: 'La metto nella posizione laterale di sicurezza (PLS)' },
  { id: 'rcp', label: 'Inizio la RCP' },
  { id: 'seduta', label: 'La metto seduta perché stia più comoda' },
]

const spinalWhy: Record<SpinalAction, string> = {
  stabilizza: '',
  ruota: 'Da incosciente può essere necessario ruotarla sulla schiena per aprire le vie aeree, controllare il respiro o iniziare la RCP, riducendo i movimenti al minimo.',
  pls: '',
  rcp: 'È già sulla schiena e non respira: esegui la RCP (rianimazione cardio-polmonare) come indicato nel manuale.',
  seduta: '',
}

const spinal: (SpinalFacts & { id: string; text: string; why?: string })[] = [
  { id: 'moto', conscious: true, supine: false, text: 'Un motociclista è caduto dopo un incidente stradale. È cosciente, seduto a terra, e si lamenta del collo.', why: 'È cosciente: lascialo nella posizione in cui si trova e tienigli ferma la testa con le mani su entrambi i lati, in attesa che arrivi il SME (Servizio Medico d’Emergenza).' },
  { id: 'scala', conscious: false, supine: false, text: 'Una persona è caduta dall’alto di una scala. Non risponde ed è a pancia in giù.' },
  { id: 'ciclista', conscious: false, supine: true, breathing: true, text: 'Un ciclista è stato investito. È incosciente, già disteso sulla schiena. Apri le vie aeree come hai imparato: respira.', why: 'Respira: stabilizzale la testa, ma non metterla nella posizione laterale di sicurezza.' },
  { id: 'tetto', conscious: false, supine: true, breathing: false, text: 'Un operaio è caduto da un tetto basso. È incosciente e supino. Apri le vie aeree: non respira.' },
]

export const spinalCases: DrillCase[] = spinal.map((s) => {
  const answer = spinalAction(s)
  return { id: s.id, text: s.text, answer, why: s.why ?? spinalWhy[answer] }
})

export function LesioneSpinale() {
  return <DecisionDrill question="Sospetti una lesione spinale. Che cosa fai?" cases={spinalCases} options={spinalOptions} />
}
