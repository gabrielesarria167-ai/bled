import { Link } from 'react-router'
import { Callout, Compare, Figure, KeyFacts, Quiz, SectionPage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/08-emorragia'
import { BodyResponse, stepArt, ToolsArt } from '../widgets/s08/Art'
import { SiteFlow, VesselFlow } from '../widgets/s08/BleedFlow'
import { BloodTube } from '../widgets/s08/BloodTube'
import { PressureTrainer } from '../widgets/s08/PressureTrainer'
import { RecognizeBleed } from '../widgets/s08/RecognizeBleed'
import { Sorter, type SortItem } from '../widgets/s08/Sorter'

const steps = [
  {
    title: 'Verifica la sicurezza e valuta l’ABC',
    body: (
      <p>
        Verifica che l’ambiente sia sicuro e valuta l’ABC come hai già imparato (A, Airways: vie aeree; B, Breathing: respirazione; C, Circulation: circolazione). Usa tutti i DPI (dispositivi di protezione individuale) necessari.
      </p>
    ),
  },
  { title: 'Allerta il SME', body: <p>Allerta il SME (Servizio Medico di Emergenza), se necessario.</p> },
  {
    title: 'Tampona la ferita',
    body: <p>Metti sulla ferita una garza, possibilmente sterile o comunque perfettamente pulita, e fai pressione diretta con la mano.</p>,
  },
  {
    title: 'Fissa il tampone',
    body: <p>Fissa il tampone con un bendaggio abbastanza grande da coprire per intero tampone e ferita.</p>,
  },
  {
    title: 'Controlla la circolazione',
    body: (
      <>
        <p>Il bendaggio deve essere stretto, ma senza bloccare la circolazione.</p>
        <p>
          Per controllarla, premi con la punta di un dito su un’unghia e poi rilascia: sotto l’unghia il colore rosato deve tornare rapidamente. È il <strong>refill ungueale</strong>. Provalo sul disegno: tieni premuto e rilascia.
        </p>
      </>
    ),
  },
  { title: 'Rassicura l’infortunato', body: <p>Rassicuralo e raccomandagli di restare il più fermo possibile.</p> },
  {
    title: 'Immobilizza',
    body: <p>Quando l’emorragia si è fermata, immobilizza la ferita, oppure l’estremità se è coinvolto un arto. Per limitare i movimenti puoi usare un bendaggio triangolare.</p>,
  },
  {
    title: 'Valuta i segni vitali',
    body: (
      <p>
        Valuta i segni vitali, cerca eventuali segni di shock e agisci di conseguenza (lo shock è trattato nella <Link to="/sezione/shock">Sezione 9</Link>).
      </p>
    ),
  },
].map((s, i) => ({ ...s, visual: stepArt[i] }))

const sortItems: SortItem[] = [
  { text: 'Aggiungere altro materiale assorbente sopra il tampone intriso', fare: true, why: 'Se il sangue filtra attraverso il tampone, si aggiunge altro materiale assorbente sopra, senza togliere quello che c’è.' },
  { text: 'Togliere il tampone intriso di sangue per metterne uno pulito', fare: false, why: 'Il tampone non va tolto: porteresti via il coagulo, anche solo parziale, che si è formato e che aiuta a controllare il sanguinamento.' },
  { text: 'Fare pressione diretta con la mano su una garza appoggiata alla ferita', fare: true, why: 'È così che si tampona: garza possibilmente sterile, o comunque perfettamente pulita, e pressione diretta con la mano.' },
  { text: 'Fermarsi a capire se l’emorragia è venosa o arteriosa prima di intervenire', fare: false, why: 'Non perdere mai tempo a stabilirlo: in entrambi i casi un’emorragia esterna grave richiede soccorso immediato.' },
  { text: 'Usare un tourniquet senza essere addestrato', fare: false, why: 'Il tourniquet su un arto è una tecnica per il soccorritore addestrato, quando la pressione diretta non controlla l’emorragia esterna grave. Non fa parte di questo manuale.' },
  { text: 'Usare altro materiale pulito se non hai presidi sterili', fare: true, why: 'Se non ci sono presidi sterili si possono usare altri materiali, purché puliti.' },
  { text: 'Stringere il bendaggio fino a bloccare la circolazione', fare: false, why: 'Il bendaggio dev’essere stretto ma senza bloccare la circolazione: controllalo con il refill ungueale.' },
  { text: 'Indossare i guanti ed evitare il contatto con il sangue', fare: true, why: 'Usa tutti i DPI necessari: proteggiti dal contatto con sangue e altri fluidi corporei.' },
  { text: 'Lasciar stare un’emorragia perché non riesci a capire quanto sia grave', fare: false, why: 'Anche quando non se ne riesce a stabilire l’entità, un’emorragia va sempre fermata, per evitare l’ipovolemia.' },
]

export default function Emorragia() {
  return (
    <SectionPage
      slug="emorragia"
      lead={
        <p>
          Il sangue porta ossigeno e nutrienti a tutto il corpo: se ne perdi molto, e in fretta, la vita è in pericolo. Qui vedi com’è fatto il sangue, impari a riconoscere i tipi di emorragia e provi la pressione diretta, la manovra con cui si controlla un’emorragia esterna grave.
        </p>
      }
    >
      <Sub id="sangue" title="Sangue e componenti del sangue" page="66">
        <h3>A cosa serve il sangue</h3>
        <p>
          Il compito principale del sangue è <strong>portare ossigeno (O2) e nutrienti</strong> ai tessuti del corpo e <strong>portare via i prodotti di scarto</strong>, come l’anidride carbonica (CO2).
        </p>

        <h3>Di cosa è fatto</h3>
        <p>
          Il sangue è fatto per il <strong>55% di plasma</strong>, la parte liquida, e per il <strong>45% di cellule o particelle solide</strong>: il 44% sono globuli rossi, l’1% globuli bianchi e piastrine. Nella provetta le parti sono disegnate in proporzione: scegline una per leggere a cosa serve.
        </p>
        <BloodTube />
        <div className="max-w-[26rem]">
          <Figure
            file="img/sangue-componenti.jpg"
            caption="Le componenti corpuscolate viste da vicino. Le etichette dell’illustrazione sono in inglese: red blood cell = globulo rosso, white blood cell = globulo bianco, platelet = piastrina."
          />
        </div>

        <h3>Quanto sangue abbiamo</h3>
        <p>
          Un adulto ha <strong>da 4,5 a 5,5 litri</strong> di sangue. La massa sanguigna corrisponde a circa l’<strong>8% del peso corporeo</strong> e varia in base al sesso.
        </p>
        <KeyFacts
          title="I numeri del sangue"
          items={[
            { label: 'Sangue in un adulto', value: '4,5–5,5 l' },
            { label: 'Massa sanguigna', value: '8%', note: 'Circa l’8% del peso corporeo; varia in base al sesso.' },
            { label: 'Emoglobina satura di O2 all’uscita dai polmoni', value: '97%', note: 'Circa, in condizioni normali.' },
            { label: 'O2 legato all’emoglobina', value: '98,5%', note: 'Circa; il resto è disciolto nel plasma.' },
          ]}
        />
        <Callout kind="attenzione">
          <p>
            Un’emorragia che non viene trattata porta in fretta a uno <strong>shock ipovolemico</strong>.
          </p>
        </Callout>
      </Sub>

      <Sub id="tipi" title="Diversi tipi di emorragia" page="67–68">
        <h3>Definizioni</h3>
        <p>
          Un’<strong>emorragia</strong> è la fuoriuscita di sangue dai vasi sanguigni. A seconda di dove arriva il sangue fuoriuscito, se ne distinguono tre categorie.
        </p>
        <SiteFlow />

        <h3>Classificazione in base al vaso interessato</h3>
        <p>
          Secondo il vaso danneggiato, l’emorragia può essere <strong>capillare</strong>, <strong>venosa</strong> o <strong>arteriosa</strong>. Ognuna sanguina in modo diverso: il flusso nell’animazione ti mostra come riconoscerle.
        </p>
        <VesselFlow />
        <Callout kind="attenzione">
          <p>
            Non perdere <strong>mai</strong> tempo a capire se l’emorragia è venosa o arteriosa: in entrambi i casi un’emorragia esterna (grave) richiede <strong>soccorso immediato</strong>.
          </p>
        </Callout>
        <RecognizeBleed />

        <h3>Quanto è grave un’emorragia</h3>
        <p>
          La gravità dipende da due cose: <strong>quanto sangue</strong> si perde e <strong>quanto in fretta</strong>.
        </p>
        <Compare
          columns={[
            {
              title: 'In genere minore',
              kind: 'nota',
              items: [
                'L’emorragia capillare.',
                'Riguarda vasi superficiali, i capillari.',
                'La quantità di sangue che esce è esigua.',
                'Esempi comuni: il sangue dal naso e gli ematomi cutanei (lividi).',
              ],
            },
            {
              title: 'Sempre potenzialmente grave',
              kind: 'attenzione',
              items: [
                'Le lesioni delle vene e soprattutto delle arterie (emorragia arteriosa).',
                'Si perdono grandi quantità di sangue: almeno 1 litro.',
                'Nelle arterie il sangue esce molto rapidamente.',
              ],
            },
          ]}
        />

        <h3>Ipovolemia e shock ipovolemico</h3>
        <p>
          Con un’emorragia grave un adulto può andare incontro allo <strong>shock ipovolemico</strong>, dovuto al rapido calo del volume di sangue, detto anche <strong>ipovolemia</strong>. È una condizione che mette in pericolo la vita: la tratta la <Link to="/sezione/shock">Sezione 9</Link>.
        </p>
        <Callout kind="obbligo">
          <p>Anche quando non riesci a stabilirne l’entità, un’emorragia va sempre fermata, per evitare l’ipovolemia.</p>
        </Callout>
        <Callout kind="attenzione" title="Esempio: il bambino">
          <p>Il bambino ha un volume totale di sangue molto inferiore a quello di un adulto: per questo anche sanguinamenti minori possono portarlo rapidamente all’ipovolemia.</p>
        </Callout>

        <h3>Come reagisce il corpo</h3>
        <p>
          Quando c’è un’emorragia, i vasi sanguigni vicini al punto che sanguina si restringono (<strong>costrizione</strong>) per rallentare la perdita, e le <strong>piastrine</strong> cominciano a formare il <strong>coagulo</strong>. Nelle emorragie minori questo meccanismo funziona molto bene; in un’emorragia grave <strong>può non bastare</strong>.
        </p>
        <BodyResponse />

        <h3>Di cosa si occupa questa sezione</h3>
        <p>
          Da qui in avanti si parla della gestione della sola <strong>emorragia esterna grave</strong>: quella in cui grandi quantità di sangue escono dall’organismo, per esempio dopo una lesione della cute o, più in generale, dopo un trauma.
        </p>
      </Sub>

      <Sub id="abilita" title="Abilità pratica di BLS: emorragia esterna (grave)" page="69">
        <p>
          La sequenza di BLS (Basic Life Support) per un’emorragia esterna grave ha <strong>8 passaggi</strong>. Scorrili uno alla volta; al passo 5 prova il refill ungueale sul disegno.
        </p>
        <Steps mode="stepper" label="Abilità pratica: emorragia esterna grave" items={steps} />
        <div className="max-w-[28rem]">
          <Figure
            file="img/emorragia-bendaggio-compressivo.png"
            caption="Un bendaggio su un arto, visto in sezione. Legenda dei colori: rosa, l’arto; rosso, la ferita; verde, la garza appoggiata sulla ferita; blu, il tampone di compressione sopra la garza; giallo, la benda che avvolge e fissa il tutto."
          />
        </div>
        <Callout kind="nota">
          <p>
            Se non ci sono presidi sterili si possono usare altri materiali, <strong>purché puliti</strong>. Ricorda di proteggerti e di evitare il contatto con sangue e altri fluidi corporei.
          </p>
        </Callout>
        <p>Ora prova i passi 3 e 4 con le mani: indossa i guanti, tampona e tieni la pressione diretta. A metà, il sangue filtrerà attraverso la garza: decidi tu cosa fare.</p>
        <PressureTrainer />
      </Sub>

      <Sub id="non-controllabili" title="Emorragie non controllabili: agenti emostatici, bende emostatiche, tourniquet" page="70">
        <p>Per le emorragie che non si controllano con la pressione diretta locale, per le lesioni agli arti e per le amputazioni si possono usare:</p>
        <ul>
          <li>
            <strong>agenti emostatici</strong>;
          </li>
          <li>
            <strong>bende emostatiche</strong>, per esempio la benda israeliana;
          </li>
          <li>
            <strong>tourniquet</strong>.
          </li>
        </ul>
        <ToolsArt />
        <div className="max-w-[20rem]">
          <Figure
            file="img/emorragia-laccio-emostatico.jpg"
            caption="Un’esercitazione: un laccio emostatico (tourniquet) stretto sul braccio di un volontario. È una tecnica per il soccorritore addestrato e non fa parte di questo manuale."
          />
        </div>
        <Callout kind="attenzione">
          <p>
            Se l’emorragia continua e il sangue filtra attraverso il tampone, il tampone <strong>non va tolto</strong>. Toglierlo potrebbe peggiorare le cose, perché porterebbe via il coagulo, anche solo parziale, che si è formato e che aiuta a controllare il sanguinamento.
          </p>
          <p>
            Se possibile, <strong>aggiungi altro materiale assorbente</strong> e valuta l’uso di lacci o bende emostatici.
          </p>
        </Callout>
        <Callout kind="nota" title="Solo per il soccorritore addestrato">
          <p>Se sei addestrato, puoi inoltre:</p>
          <ul>
            <li>usare una garza emostatica quando la pressione diretta non riesce a controllare l’emorragia esterna grave, oppure quando la ferita si trova in un punto in cui la pressione diretta non si può applicare;</li>
            <li>applicare un tourniquet su un arto quando la pressione diretta non riesce a controllare l’emorragia esterna grave.</li>
          </ul>
          <p>
            Queste due tecniche <strong>non fanno parte del manuale</strong>. Per approfondire la gestione di ferite e sanguinamento grave puoi chiedere al tuo Istruttore DAN (Divers Alert Network) di partecipare a un corso First Aid.
          </p>
        </Callout>
        <p>Metti alla prova quello che sai: per ogni azione, decidi se va fatta o no.</p>
        <Sorter label="Emorragia: fare o non fare" items={sortItems} />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="71">
        <KeyFacts
          title="Dati chiave della sezione"
          items={[
            { label: 'Plasma', value: '55%' },
            { label: 'Cellule e particelle solide', value: '45%', note: '44% globuli rossi, 1% globuli bianchi e piastrine.' },
            { label: 'Emoglobina satura di O2 all’uscita dai polmoni', value: '97%', note: 'Circa.' },
            { label: 'O2 del sangue legato all’emoglobina', value: '98,5%', note: 'Circa; il resto è disciolto nel plasma.' },
            { label: 'Volume di sangue di un adulto', value: '4,5–5,5 l' },
            { label: 'Massa sanguigna sul peso corporeo', value: '8%', note: 'Circa; variabile con il sesso.' },
            { label: 'Perdita nelle emorragie venose e arteriose potenzialmente gravi', value: '≥ 1 l', note: 'Almeno 1 litro.' },
            { label: 'Tipi per vaso interessato', value: '3', note: 'Capillare (lenta, filtra), venosa (rosso scuro, flusso lento e costante), arteriosa (rosso vivo, flusso elevato e pulsante).' },
            { label: 'Categorie per sede', value: '3', note: 'Esterna, interna, interna esteriorizzata (bocca, naso, orecchio).' },
            { label: 'Passaggi dell’abilità pratica', value: '8' },
            { label: 'Controllo della circolazione dopo il bendaggio', value: 'refill', note: 'Refill ungueale: il colore rosato deve tornare rapidamente.' },
            { label: 'Tecniche per il soccorritore addestrato', value: '2', note: 'Garza emostatica e tourniquet su un arto.' },
          ]}
        />
        <Quiz id="emorragia" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
