import { Callout, Compare, Figure, KeyFacts, Quiz, SectionPage, Sub } from '../components/ui'
import questions from '../data/quiz/06-pls'
import { PlsDecision } from '../widgets/s06/PlsDecision'
import { PlsFigure } from '../widgets/s06/PlsFigure'
import { PlsOrder } from '../widgets/s06/PlsOrder'
import { PlsSequence } from '../widgets/s06/PlsSequence'

export default function Pls() {
  return (
    <SectionPage
      slug="pls"
      lead={
        <p>
          La posizione laterale di sicurezza (PLS) protegge le vie aeree di chi non è cosciente ma respira. Qui vedi quando si usa e quando no, su quale lato girare la persona, e la sequenza completa in 11 passaggi: prima la segui passo per passo, poi la rimetti in ordine da solo.
        </p>
      }
    >
      <Sub id="a-cosa-serve" title="A cosa serve la posizione laterale di sicurezza" page="54">
        <p>
          La posizione laterale di sicurezza (PLS) è la posizione in cui si mette chi <strong>non è cosciente ma respira</strong>. Serve a far sì che le <strong>vie aeree restino pervie</strong>, cioè aperte al passaggio dell’aria.
        </p>
        <p>
          C’è un secondo vantaggio. Se in bocca o in gola ci sono fluidi corporei, per esempio <strong>vomito o sangue</strong>, con la persona sul fianco è la <strong>forza di gravità</strong> a farli scorrere verso l’esterno. Così non vengono inalati e, più in generale, non finiscono per ostruire le vie aeree.
        </p>
        <div className="grid gap-x-6 md:grid-cols-2 md:items-start [&>figure]:my-6">
          <Figure caption="La PLS vista dall’alto: testa appoggiata sulla mano, braccio che resta sotto disteso in avanti, gamba superiore piegata. Si esegue solo su infortunati non coscienti che respirano, quando non si sospettano traumi a testa, collo e colonna vertebrale.">
            <PlsFigure step={11} rescuer={false} label="Persona distesa sul fianco in posizione laterale di sicurezza, vista dall’alto: la testa poggia sul dorso della mano, il braccio inferiore è disteso in avanti, la gamba superiore è piegata ad angolo retto." className="p-4" />
          </Figure>
          <Figure file="img/pls-posizione-laterale-sicurezza.png" caption="La stessa posizione vista di lato: gamba superiore piegata, mano sotto il viso, bocca rivolta verso il basso, così vomito o sangue possono uscire." />
        </div>
        <Callout kind="nota" title="Quando eseguirla">
          <p>
            Solo su un infortunato <strong>non cosciente che respira</strong>, e solo <strong>se non si sospettano traumi a testa, collo e colonna vertebrale</strong>.
          </p>
        </Callout>
      </Sub>

      <Sub id="regole" title="Varianti e regole comuni a tutte le posizioni di sicurezza" page="54">
        <p>
          Della PLS esistono più varianti. Quella che trovi in questa sezione è la posizione <strong>raccomandata da ERC</strong> (European Resuscitation Council). Qualunque variante tu usi, valgono sempre due regole.
        </p>
        <Compare
          columns={[
            {
              title: 'Lesioni a schiena e/o collo',
              kind: 'divieto',
              items: [
                <>
                  La persona <strong>non va messa</strong> in posizione laterale di sicurezza.
                </>,
                'Spostarla potrebbe causare danni ulteriori.',
              ],
            },
            {
              title: 'Lesioni a torace e/o polmone',
              kind: 'obbligo',
              items: [
                <>
                  La persona va girata <strong>sul lato leso</strong>.
                </>,
                'Così si favoriscono la pervietà delle vie aeree e la respirazione.',
                'Se nella cavità toracica c’è sangue, può defluire senza compromettere la funzione polmonare.',
              ],
            },
          ]}
        />
        <Callout kind="attenzione" title="Importante: il braccio che resta sotto">
          <p>
            Con la vittima in PLS tieni sotto controllo il <strong>braccio che resta sotto</strong> (la sua circolazione periferica): deve restare compresso il meno a lungo possibile, per non rischiare danni ischemici.
          </p>
          <p>
            Se la PLS è stata mantenuta per <strong>circa 30 minuti</strong>, gira l’infortunato <strong>sul lato opposto</strong>.
          </p>
        </Callout>
        <Figure file="img/pls-disegno.jpg" caption="Sul fianco, testa appoggiata sul braccio, gamba superiore flessa: il braccio che resta sotto il corpo è quello da tenere d’occhio." />

        <p>Ora decidi tu. Per ogni caso scegli se metteresti la persona in PLS e, quando conta, su quale lato.</p>
        <PlsDecision />
      </Sub>

      <Sub id="abilita" title="Abilità pratica di BLS: posizione laterale di sicurezza" page="55">
        <p>
          La sequenza completa ha <strong>11 passaggi</strong>. Tre volte ti chiede un <strong>angolo retto</strong>: il braccio vicino rispetto al corpo, il ginocchio della gamba lontana, e alla fine anca e ginocchio della gamba che resta sopra. Seguila sulla figura: a ogni Avanti la vittima si muove nella posizione di quel passaggio.
        </p>
        <PlsSequence />
        <Callout kind="obbligo" title="Dopo la manovra">
          <p>
            <strong>Controlla regolarmente la respirazione</strong> e <strong>non allontanarti</strong> dalla vittima. Tieni d’occhio il braccio che resta sotto e, dopo <strong>circa 30 minuti</strong> in PLS, gira la persona sul lato opposto.
          </p>
        </Callout>
        <p>Adesso prova senza figura: i passaggi sono mescolati, toccali nell’ordine in cui li esegui.</p>
        <PlsOrder />
        <KeyFacts
          items={[
            { label: 'Indicazione', value: 'non cosciente + respira', note: 'E nessun sospetto di trauma a testa, collo, colonna vertebrale.' },
            { label: 'Variante descritta', value: 'ERC' },
            { label: 'Regole per tutte le posizioni di sicurezza', value: '2', note: 'Niente PLS con traumi a schiena e/o collo; lesione a torace e/o polmone: girare sul lato leso.' },
            { label: 'Passaggi dell’abilità pratica', value: '11' },
            { label: 'Angoli retti nella sequenza', value: '3', note: 'Braccio vicino rispetto al corpo; ginocchio della gamba lontana; anca e ginocchio della gamba superiore a fine manovra.' },
            { label: 'Braccio vicino', value: 'palmo in alto' },
            { label: 'Braccio lontano', value: 'dorso della mano sulla guancia' },
            { label: 'Girare sul lato opposto dopo', value: 'circa 30 min' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="56">
        <Quiz id="pls" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
