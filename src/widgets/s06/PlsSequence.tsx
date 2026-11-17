import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button, Stage } from '../../components/ui'
import { PlsFigure } from './PlsFigure'

/** The 11 steps of the practical skill (manual p. 55), shared by the sequence and the ordering game. */
export const plsSteps: { title: string; body: ReactNode }[] = [
  { title: 'Togli gli occhiali', body: <p>Se la vittima porta gli <strong>occhiali</strong>, toglieli.</p> },
  { title: 'Controlla che le gambe siano distese', body: <p>Verifica che <strong>entrambi gli arti inferiori</strong> siano distesi.</p> },
  { title: 'Allinea il corpo', body: <p><strong>Allinea</strong> il corpo della vittima.</p> },
  {
    title: 'Inginocchiati e apri il braccio vicino',
    body: (
      <p>
        <strong>Inginocchiati</strong> di fianco all’infortunato. Metti il braccio della vittima più vicino a te <strong>ad angolo retto</strong> rispetto al corpo, con il <strong>palmo rivolto verso l’alto</strong>.
      </p>
    ),
  },
  {
    title: 'Porta la mano lontana alla guancia',
    body: (
      <p>
        Prendi l’<strong>altro braccio</strong>, piegane il gomito e porta il <strong>dorso della mano</strong> a contatto con la <strong>guancia più vicina a te</strong>. Con la tua mano tieni ferma lì la mano della vittima.
      </p>
    ),
  },
  {
    title: 'Piega la gamba lontana',
    body: (
      <p>
        Con la mano libera afferra la <strong>gamba più lontana</strong> e falle piegare il ginocchio fino a un <strong>angolo retto</strong>, lasciando il <strong>piede appoggiato a terra</strong>.
      </p>
    ),
  },
  {
    title: 'Ruota la vittima verso di te',
    body: (
      <p>
        Senza staccare la mano premuta contro la guancia, <strong>ruota la vittima sul fianco</strong> tirandola <strong>verso di te</strong> dal ginocchio piegato. Durante la rotazione <strong>non lasciare mai la testa</strong>.
      </p>
    ),
  },
  {
    title: 'Sistema la gamba che resta sopra',
    body: (
      <p>
        Metti la <strong>gamba superiore</strong> in modo che <strong>anca e ginocchio</strong> siano flessi <strong>ad angolo retto</strong>.
      </p>
    ),
  },
  { title: 'Estendi la testa all’indietro', body: <p><strong>Estendi la testa all’indietro</strong>: così sei sicuro che le vie aeree restino aperte.</p> },
  { title: 'Aggiusta la mano sotto la guancia', body: <p>Se serve, aggiusta la posizione della <strong>mano sotto la guancia</strong> perché la testa resti estesa.</p> },
  {
    title: 'Controlla il respiro e resta vicino',
    body: (
      <p>
        <strong>Controlla regolarmente la respirazione</strong> e <strong>non allontanarti</strong> dalla vittima.
      </p>
    ),
  },
]

/** Step through the recovery position: the pictogram moves to each step's pose as the learner advances. */
export function PlsSequence() {
  const [i, setI] = useState(0) // 0 = starting situation, 1..11 = after that step
  const s = plsSteps[i - 1]
  const last = i === plsSteps.length

  return (
    <Stage title="La PLS passo per passo" hint="Premi Avanti: la figura esegue un passaggio alla volta" footer="Vista dall’alto. In chiaro la vittima, in grigio tu che la soccorri; nel colore acceso la parte che si muove in quel passaggio.">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center">
        <PlsFigure step={i} tone="well" label={i ? `Passo ${i}: ${s.title}` : 'Situazione di partenza: vittima a terra sulla schiena, con gli occhiali, corpo non allineato'} />
        <div className="min-w-0">
          <div className="flex gap-1" aria-hidden>
            {plsSteps.map((st, n) => (
              <span key={st.title} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${n < i ? 'bg-lume' : 'bg-well-2'}`} />
            ))}
          </div>
          <div aria-live="polite" className="mt-4 min-h-44 [&_strong]:text-lume [&>*+*]:mt-2">
            {i === 0 ? (
              <>
                <p className="font-display text-[1.05rem] font-bold text-well-soft">Prima di iniziare</p>
                <p className="font-display text-[1.8rem] font-extrabold leading-none">Situazione di partenza</p>
                <p>
                  La vittima è a terra sulla schiena: <strong>non è cosciente ma respira</strong> e non sospetti traumi a testa, collo e colonna vertebrale. Premi Avanti per il primo passaggio.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-[1.05rem] font-bold text-well-soft">
                  Passo {i} di {plsSteps.length}
                </p>
                <p className="font-display text-[1.8rem] font-extrabold leading-none">{s.title}</p>
                {s.body}
              </>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="onDark" disabled={i === 0} onClick={() => setI(i - 1)}>
              <ChevronLeft className="size-5" aria-hidden /> Indietro
            </Button>
            {last ? (
              <Button variant="onDark" onClick={() => setI(0)}>
                <RotateCcw className="size-4" aria-hidden /> Ricomincia
              </Button>
            ) : (
              <Button variant="onDark" onClick={() => setI(i + 1)}>
                Avanti <ChevronRight className="size-5" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Stage>
  )
}
