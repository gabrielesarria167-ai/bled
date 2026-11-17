import { Link } from 'react-router'
import { Callout, Figure, KeyFacts, Quiz, SectionPage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/09-shock'
import { Sorter, type SortItem } from '../widgets/s08/Sorter'
import { Perfusion } from '../widgets/s09/Perfusion'
import { Blanket, shockStepArt } from '../widgets/s09/ShockArt'
import { SignsPicker } from '../widgets/s09/SignsPicker'

const types = [
  { name: 'Shock ipovolemico', cause: 'Dovuto alla riduzione del volume circolante.' },
  { name: 'Shock cardiogeno', cause: 'Dovuto a una funzione di “pompa” del cuore inadeguata, per una patologia cardiaca.' },
  { name: 'Shock settico', cause: 'Dovuto a un’infezione che provoca vasodilatazione.' },
  { name: 'Shock anafilattico', cause: 'Dovuto a una reazione allergica grave, per esempio dopo punture di insetti imenotteri, farmaci o alimenti.' },
  { name: 'Shock neurogeno', cause: 'Dovuto a un grave danno al sistema nervoso centrale, per esempio dopo una lesione alla testa o alla colonna vertebrale.' },
]

const signs = [
  ['Ansia, irrequietezza, confusione', 'dovute all’ipossia cerebrale'],
  ['Respiro rapido e superficiale', 'per il ridotto apporto di O2'],
  ['Polso rapido e debole', 'come tentativo di compensare l’ipotensione'],
  ['Pelle fredda e colorito pallido', ''],
  ['Sudorazione fredda', ''],
  ['Sete', 'dovuta all’ipovolemia'],
  ['Nausea, vomito', ''],
  ['Pupille dilatate', ''],
  ['Debolezza e perdita di coscienza', ''],
]

const steps = [
  { title: 'Controlla che l’ambiente sia sicuro', body: <p>Accertati che l’ambiente sia sicuro.</p> },
  { title: 'Verifica i segni vitali', body: <p>Verifica i segni vitali.</p> },
  { title: 'Attiva il SME', body: <p>Attiva il SME (Servizio Medico di Emergenza).</p> },
  {
    title: 'Gestisci l’emorragia',
    body: (
      <p>
        Se c’è un’emorragia esterna (grave), gestiscila come hai già imparato nella <Link to="/sezione/emorragia">Sezione 8</Link> e monitora l’infortunato.
      </p>
    ),
  },
  { title: 'Mantieni pervie le vie aeree', body: <p>Mantieni pervie, cioè libere, le vie aeree.</p> },
  { title: 'Conforta e rassicura', body: <p>Conforta e rassicura l’infortunato.</p> },
  {
    title: 'Supina, gambe sollevate se non c’è trauma',
    body: (
      <>
        <p>
          Metti la vittima <strong>supina</strong>. Se <strong>non c’è evidenza di trauma</strong>, solleva gli arti inferiori, <strong>per meno di 7 minuti</strong>: favorisci così il ritorno del sangue al torace e quindi al cuore.
        </p>
        <p>Rispondi alla domanda sul disegno e guarda la posizione.</p>
      </>
    ),
  },
  {
    title: 'Proteggi dal freddo o dal caldo',
    body: <p>Proteggi la vittima dal freddo o dal caldo: la temperatura corporea va mantenuta nella norma.</p>,
  },
  { title: 'Valuta la reattività', body: <p>Valuta il livello di reattività della vittima.</p> },
  { title: 'Controlla che respiri', body: <p>Controlla, e assicurati, che la vittima continui a respirare.</p> },
].map((s, i) => ({ ...s, visual: shockStepArt[i] }))

const sortItems: SortItem[] = [
  { text: 'Sollevare gli arti inferiori della vittima supina, se non c’è evidenza di trauma', fare: true, why: 'Per meno di 7 minuti: così il sangue torna al torace e quindi al cuore.' },
  { text: 'Dare un bicchiere d’acqua a chi ha molta sete', fare: false, why: 'Niente liquidi per bocca: la vittima potrebbe non essere del tutto cosciente, inalarli e soffocare; inoltre bere aumenta la tendenza al vomito e peggiora la disidratazione.' },
  { text: 'Costringere la vittima a sdraiarsi anche se così non sta comoda', fare: false, why: 'Va lasciata nella posizione più confortevole possibile.' },
  { text: 'Coprirla con una coperta isotermica o una giacca, se fa freddo', fare: true, why: 'La vittima non riesce a regolare da sola la temperatura e si raffredda rapidamente: va protetta dal freddo.' },
  { text: 'Metterla all’ombra, se siete all’aperto', fare: true, why: 'La temperatura corporea non deve nemmeno salire troppo: all’aperto la vittima va messa all’ombra.' },
  { text: 'Darle qualcosa da mangiare', fare: false, why: 'A una persona in stato di shock non si danno né cibo né bevande.' },
  { text: 'Sollevare gli arti inferiori anche se c’è una lesione', fare: false, why: 'Con una lesione la manovra rischia di peggiorarla.' },
  { text: 'Farla ospedalizzare', fare: true, why: 'Chi è in stato di shock va sempre ospedalizzato per ulteriori indagini e/o trattamenti.' },
  { text: 'Tenere le gambe sollevate per tutta l’attesa, anche oltre i 7 minuti', fare: false, why: 'Gli arti inferiori si sollevano per meno di 7 minuti.' },
  { text: 'Tenerla calma, confortarla e rassicurarla', fare: true, why: 'È una delle azioni di base del soccorritore.' },
  { text: 'Somministrarle tu dei liquidi endovena', fare: false, why: 'I liquidi endovena sono raccomandati, ma spettano esclusivamente al personale sanitario.' },
  { text: 'Mantenere pervie le vie aeree e controllare che continui a respirare', fare: true, why: 'Fa parte delle nozioni base di BLS e dei passaggi dell’abilità pratica.' },
]

export default function Shock() {
  return (
    <SectionPage
      slug="shock"
      lead={
        <p>
          Nello shock agli organi arriva meno sangue, e quindi meno ossigeno: è una condizione che va riconosciuta e gestita subito. Qui impari a riconoscerne i segni, cosa fare e cosa non fare, e la sequenza in 10 passaggi per gestirla.
        </p>
      }
    >
      <Sub id="cos-e" title="Cos’è lo shock?" page="73–74">
        <h3>Definizione</h3>
        <p>
          Lo shock è uno stato di <strong>ipoperfusione d’organo</strong>: agli organi arriva <strong>meno sangue</strong> e quindi <strong>meno ossigeno</strong>, e questo può portare a disfunzione e morte delle cellule. Confronta i due stati nel disegno.
        </p>
        <Perfusion />

        <h3>Meccanismi che portano allo shock</h3>
        <ul>
          <li>
            <strong>Riduzione del volume circolante</strong> in seguito a un’emorragia. Accanto a questa voce il manuale riporta, tra parentesi, il termine “ipossia”.
          </li>
          <li>
            <strong>Riduzione della gittata cardiaca</strong> (insufficienza cardiaca).
          </li>
          <li>
            <strong>Vasodilatazione</strong>, per esempio durante una reazione allergica.
          </li>
          <li>
            <strong>Perdita eccessiva di liquidi</strong>, nelle disidratazioni gravi oppure nelle ustioni.
          </li>
        </ul>

        <h3>Tipi di shock</h3>
        <dl className="space-y-3">
          {types.map((t) => (
            <div key={t.name}>
              <dt className="font-bold">{t.name}</dt>
              <dd>{t.cause}</dd>
            </div>
          ))}
        </dl>
        <KeyFacts
          title="Da sapere a memoria"
          items={[
            { label: 'Meccanismi', value: '4', note: 'Riduzione del volume circolante, riduzione della gittata cardiaca, vasodilatazione, perdita eccessiva di liquidi.' },
            { label: 'Tipi di shock', value: '5', note: 'Ipovolemico, cardiogeno, settico, anafilattico, neurogeno.' },
          ]}
        />
        <Callout kind="nota">
          <p>
            Sollevare le gambe, <strong>quando non si sospettano traumi</strong>, aiuta il sangue ad affluire verso il cervello. Vedi la posizione nell’abilità pratica, al passo 7.
          </p>
        </Callout>
        <div className="max-w-[26rem]">
          <Figure
            file="img/shock-posizione-antishock.jpg"
            caption="Un’illustrazione d’epoca: vittima supina con le gambe sollevate su un appoggio. Si fa solo se non si sospettano traumi, e per meno di 7 minuti."
          />
        </div>
        <Callout kind="nota" title="Perché una perdita cospicua di liquidi può portare allo shock?">
          <ul>
            <li>L’O2 viaggia nel sangue: è logico quindi che una grave perdita di sangue, per esempio per un’emorragia, possa portare allo shock.</li>
            <li>Anche i liquidi corporei persi con vomito o diarrea possono ridurre il volume di sangue circolante, e portare allo shock.</li>
            <li>Nelle ustioni gravi si perde una quantità importante di fluidi per le lesioni ai tessuti, e questo provoca edema (rigonfiamento dei tessuti): i liquidi escono dai vasi sanguigni e, anche qui, il volume di sangue circolante nell’apparato circolatorio diminuisce, con possibile shock.</li>
            <li>Anche con contusioni, fratture e in generale traumi molto gravi la vittima può andare in shock, per via di ingenti emorragie interne.</li>
          </ul>
        </Callout>

        <h3>Cosa succede nell’organismo</h3>
        <p>
          Nello shock c’è <strong>sempre</strong> una riduzione della <strong>pressione arteriosa</strong>: il flusso di sangue diminuisce e con lui l’apporto di O2 alle cellule.
        </p>
        <p>
          L’organismo reagisce cercando di proteggere il <strong>cervello</strong>, molto sensibile all’<strong>ipossia</strong>, a scapito degli altri tessuti e organi: in questi rischiano di comparire <strong>fenomeni ischemici</strong>. È quello che mostra il disegno qui sopra quando premi “Shock”.
        </p>

        <h3>Segni e sintomi</h3>
        <p>Per effetto di questi meccanismi, nella vittima di shock si possono osservare 9 segni e sintomi. Prima mettiti alla prova: quali sono?</p>
        <SignsPicker />
        <h4>I 9 segni e sintomi dello shock</h4>
        <ul>
          {signs.map(([s, why]) => (
            <li key={s}>
              <strong>{s}</strong>
              {why && `, ${why}`}
            </li>
          ))}
        </ul>
        <Callout kind="attenzione" title="Importante: niente liquidi per bocca">
          <p>
            Chi è in shock può avere <strong>molta sete</strong>, ma durante il primo soccorso <strong>non si danno liquidi per bocca</strong>. La vittima potrebbe non essere del tutto cosciente e, bevendo, potrebbe inalare i liquidi e soffocare. Inoltre bere può aumentare la tendenza al vomito, e peggiorare ancora la disidratazione.
          </p>
          <p>
            È raccomandata invece la <strong>somministrazione di liquidi endovena</strong>, che però spetta <strong>esclusivamente al personale sanitario</strong>.
          </p>
        </Callout>
      </Sub>

      <Sub id="cosa-fare" title="Cosa fare in caso di shock?" page="74–75">
        <p className="text-[0.88rem] text-ink-soft">Nel manuale, a p. 74, questo titolo è numerato 9.1; nell’indice della sezione, a p. 72, è il 9.2.</p>
        <h3>Capire la causa</h3>
        <ul>
          <li>È importante che tu identifichi la causa dello shock.</li>
          <li>
            Se la causa è un <strong>trauma</strong>, nella maggior parte dei casi dovrai arrestare un’emorragia esterna, da lieve a grave (vedi la <Link to="/sezione/emorragia">Sezione 8</Link>).
          </li>
          <li>
            In caso di shock <strong>anafilattico</strong> o <strong>cardiogeno</strong>, la vittima, se sa di avere quella malattia, potrebbe avere con sé dei <strong>farmaci specifici</strong>.
          </li>
        </ul>

        <h3>Le azioni di base</h3>
        <p>Per prima cosa applica le nozioni base di BLS (Basic Life Support):</p>
        <ul>
          <li>accertati che l’ambiente sia sicuro;</li>
          <li>verifica i segni vitali;</li>
          <li>attiva il SME (Servizio Medico di Emergenza);</li>
          <li>mantieni pervie le vie aeree;</li>
          <li>tieni calma la vittima;</li>
          <li>
            mettila <strong>supina</strong> e, <strong>se non c’è evidenza di trauma</strong>, solleva gli arti inferiori, <strong>per meno di 7 minuti</strong>, così che il sangue torni al torace e quindi al cuore;
          </li>
          <li>
            mantieni una <strong>temperatura corporea normale</strong>: la vittima non riesce a regolarla da sola e si raffredda rapidamente. Per proteggerla dal freddo puoi usare coperte isotermiche o indumenti, per esempio una giacca. Evita però anche che la temperatura corporea salga troppo: all’aperto la vittima va messa all’ombra (vedi la nota sulla coperta isotermica).
          </li>
        </ul>
        <Callout kind="attenzione" title="Importante">
          <ul>
            <li>
              <strong>Non dare cibo o bevande</strong> a una persona in stato di shock.
            </li>
            <li>
              <strong>Non costringerla</strong> a sdraiarsi a terra o a sollevare i piedi se in quella posizione non sta comoda: va lasciata nella posizione più confortevole possibile.
            </li>
            <li>
              <strong>Non sollevare gli arti inferiori se c’è una lesione</strong>: la manovra rischia di peggiorarla.
            </li>
            <li>
              Chi è in stato di shock va <strong>sempre ospedalizzato</strong> per ulteriori indagini e/o trattamenti.
            </li>
          </ul>
        </Callout>
        <Callout kind="nota" title="Coperta isotermica">
          <ul>
            <li>Ha un lato color oro e un lato color argento. Il materiale riflettente di alcune coperte isotermiche può proteggere sia dal freddo sia dal caldo.</li>
            <li>
              <strong>Lato oro all’esterno</strong>: la vittima avvolta nella coperta è protetta dal rischio di ipotermia, cioè dall’abbassamento della temperatura corporea.
            </li>
            <li>
              <strong>Lato argento all’esterno</strong>: la coperta protegge dal caldo, perché riflette la luce del sole.
            </li>
          </ul>
        </Callout>
        <Blanket />
        <div className="max-w-[20rem]">
          <Figure
            file="img/shock-coperta-isotermica.jpg"
            caption="Una persona avvolta in una coperta isotermica, qui con il lato argento all’esterno. Ricorda: argento fuori protegge dal caldo, oro fuori dall’ipotermia."
          />
        </div>
        <p>Ora ordina le azioni: per ognuna, decidi se va fatta o no.</p>
        <Sorter label="Shock: fare o non fare" items={sortItems} />
      </Sub>

      <Sub id="abilita" title="Abilità pratica di BLS: gestione dello shock" page="76">
        <p>
          La gestione dello shock ha <strong>10 passaggi</strong>. Scorrili uno alla volta; al passo 7 decidi tu se sollevare le gambe, e puoi avviare un promemoria per il limite dei 7 minuti.
        </p>
        <Steps mode="stepper" label="Abilità pratica: gestione dello shock" items={steps} />
        <Callout kind="nota">
          <p>
            In caso di <strong>incidente acquatico</strong> può essere importante somministrare O2 (ossigeno) alla vittima. Per saperne di più, chiedi al tuo Istruttore informazioni sui corsi di Primo Soccorso con Ossigeno.
          </p>
        </Callout>
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="77">
        <KeyFacts
          title="Dati chiave della sezione"
          items={[
            { label: 'Arti inferiori sollevati', value: '< 7 min', note: 'Per meno di 7 minuti, solo senza evidenza di trauma e con la vittima supina.' },
            { label: 'Meccanismi che portano allo shock', value: '4', note: 'Riduzione del volume circolante, riduzione della gittata cardiaca, vasodilatazione, perdita eccessiva di liquidi.' },
            { label: 'Tipi di shock', value: '5', note: 'Ipovolemico, cardiogeno, settico, anafilattico, neurogeno.' },
            { label: 'Segni e sintomi elencati', value: '9' },
            { label: 'Pressione arteriosa nello shock', value: 'ridotta', note: 'Sempre.' },
            { label: 'Liquidi per bocca e cibo', value: 'mai', note: 'Liquidi endovena solo dal personale sanitario.' },
            { label: 'Coperta isotermica contro il freddo', value: 'oro fuori', note: 'Protegge dall’ipotermia.' },
            { label: 'Coperta isotermica contro il caldo', value: 'argento fuori', note: 'Riflette la luce del sole.' },
            { label: 'Ospedalizzazione', value: 'sempre' },
            { label: 'Passaggi dell’abilità pratica', value: '10' },
          ]}
        />
        <Quiz id="shock" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
