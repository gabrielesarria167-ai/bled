import { ModelStage } from '../components/three/ModelStage'
import { Callout, Compare, FlipCards, KeyFacts, Quiz, ScrollStory, SectionPage, Stage, Sub } from '../components/ui'
import questions from '../data/quiz/01-anatomia'
import { AirMix } from '../widgets/s01/AirMix'
import { OrderGame } from '../widgets/s01/OrderGame'
import { OxygenVisual, oxygenSteps } from '../widgets/s01/OxygenStory'
import { Throat } from '../widgets/s01/Throat'

const circuit = [
  { id: 'rientro', text: 'Il sangue venoso, povero di O2 e ricco di CO2, rientra dalla circolazione sistemica' },
  { id: 'ad', text: 'Entra nell’atrio destro' },
  { id: 'vd', text: 'Passa nel ventricolo destro' },
  { id: 'polmoni', text: 'Viene pompato ai polmoni: negli alveoli avviene lo scambio dei gas' },
  { id: 'arterioso', text: 'Lascia i polmoni ricco di O2: ora è sangue arterioso' },
  { id: 'as', text: 'Entra nell’atrio sinistro' },
  { id: 'vs', text: 'Passa nel ventricolo sinistro' },
  { id: 'corpo', text: 'Viene pompato in tutto il corpo e porta O2 alle cellule' },
]
const scrambled = ['polmoni', 'as', 'rientro', 'vs', 'ad', 'corpo', 'arterioso', 'vd'].map((id) => circuit.find((c) => c.id === id)!)

export default function Anatomia() {
  return (
    <SectionPage
      slug="anatomia"
      lead={
        <p>
          Ogni manovra di soccorso serve a una cosa: far arrivare ossigeno alle cellule. Qui segui il suo percorso attraverso le vie aeree (A, Airways), la respirazione (B, Breathing) e la circolazione (C, Circulation), le tre basi su cui poggia tutto il corso.
        </p>
      }
    >
      <Sub id="ossigeno" title="Perché serve l’ossigeno" page="13">
        <p>L’aria che inspiri è composta per circa il 21% da ossigeno e per circa il 79% da azoto. È quel 21% che il corpo deve ricevere senza sosta.</p>
        <AirMix />
        <p>
          Cellule, organi e l’intero organismo hanno bisogno di un rifornimento di ossigeno che non si interrompa mai: è ciò che consente tutti i processi metabolici, e quindi la vita. Il manuale lo paragona al carburante di un’automobile: senza, il motore si ferma. Il cervello in particolare ha bisogno di un apporto di ossigeno continuo.
        </p>
        <Callout kind="attenzione" title="Quando l’ossigeno non arriva">
          <p>Se il rifornimento e il trasporto di ossigeno nell’organismo si interrompono, organi e cellule degenerano e, di conseguenza, muoiono.</p>
        </Callout>
      </Sub>

      <Sub id="vie-aeree" title="Vie aeree (A, Airways)" page="13">
        <p>Le vie aeree sono cinque strutture in fila:</p>
        <ul>
          <li>naso;</li>
          <li>bocca;</li>
          <li>faringe;</li>
          <li>laringe;</li>
          <li>trachea.</li>
        </ul>
        <p>
          Quando sono <strong>pervie</strong>, cioè libere, l’aria arriva ai polmoni senza incontrare ostacoli.
        </p>
        <Callout kind="attenzione" title="Importante">
          <ul>
            <li>L’esofago è il condotto che porta il cibo dalla bocca allo stomaco e corre proprio accanto a trachea e laringe.</li>
            <li>Nella gola l’imbocco dell’esofago e quello della trachea sono molto vicini.</li>
            <li>Quando deglutisci una valvola, l’epiglottide, si abbassa sopra la laringe: così cibo e liquidi non finiscono nella trachea.</li>
          </ul>
        </Callout>
        <Throat />
      </Sub>

      <Sub id="respirazione" title="Respirazione (B, Breathing)" page="13–14">
        <h3>Il percorso dell’aria in entrata</h3>
        <ol>
          <li>A ogni inspirazione l’aria entra dal naso o dalla bocca.</li>
          <li>Attraversa la laringe e scende nella trachea.</li>
          <li>La trachea si divide in due bronchi, uno destro e uno sinistro.</li>
          <li>Attraverso i bronchi l’aria raggiunge i polmoni: il bronco destro porta al polmone destro, il sinistro al sinistro.</li>
          <li>I bronchi si ramificano come rami d’albero in rami sempre più piccoli, i bronchioli.</li>
          <li>In fondo ai bronchioli l’aria arriva in minuscole sacche, gli alveoli.</li>
        </ol>

        <Stage title="Polmoni e vie aeree in 3D" hint="Trascina per ruotare, scegli un numero">
          <ModelStage
            src="/models/lungs.glb"
            alt="Modello 3D dei polmoni con laringe e trachea: la trachea scende dalla laringe e si divide nei due bronchi diretti al polmone destro e al sinistro."
            hotspots={[
              { at: [0, 0.74, 0.25], label: 'Laringe', text: <p>L’organo della fonazione. L’aria la attraversa per scendere nella trachea; quando deglutisci l’epiglottide si abbassa sopra di lei.</p> },
              { at: [0, 0.22, 0.14], label: 'Trachea', text: <p>Riceve l’aria dalla laringe e corre accanto all’esofago. In basso si divide in due bronchi.</p> },
              { at: [0, -0.05, 0.14], label: 'Bronchi', text: <p>Uno destro e uno sinistro: portano l’aria ai polmoni e si ramificano in bronchioli sempre più piccoli, fino agli alveoli.</p> },
              { at: [-0.5, -0.25, 0.25], label: 'Polmone destro', text: <p>Riceve l’aria dal bronco destro. Nei polmoni ci sono circa 300 milioni di alveoli, dove avviene lo scambio dei gas.</p> },
              { at: [0.5, -0.25, 0.25], label: 'Polmone sinistro', text: <p>Riceve l’aria dal bronco sinistro. Anche qui, negli alveoli, l’O2 passa nel sangue e la CO2 ne esce.</p> },
            ]}
          />
        </Stage>

        <h3>Alveoli e scambio dei gas</h3>
        <ul>
          <li>Nei polmoni ci sono circa 300 milioni di alveoli.</li>
          <li>Ogni alveolo è avvolto dai capillari, vasi sanguigni piccolissimi con pareti molto sottili.</li>
          <li>L’ossigeno (O2) dell’aria attraversa queste pareti sottili e passa dagli alveoli ai capillari, per diffusione.</li>
          <li>Nei capillari c’è anche anidride carbonica (CO2), uno scarto del metabolismo del corpo: l’O2 consumato torna ai polmoni sotto forma di CO2.</li>
          <li>La CO2 fa il percorso inverso: diffonde dai capillari agli alveoli.</li>
          <li>L’O2 può diffondere nel sangue solo se nei polmoni la sua concentrazione è più alta che nei capillari.</li>
          <li>È la respirazione a mantenere più alta la concentrazione di O2 nei polmoni.</li>
        </ul>
        <KeyFacts title="Nei polmoni" items={[{ label: 'Alveoli', value: 'circa 300 milioni' }, { label: 'Bronchi principali', value: '2', note: 'Destro e sinistro, uno per polmone.' }]} />

        <h3>Il percorso dell’aria in uscita</h3>
        <ol>
          <li>Con l’espirazione l’aria, ormai più ricca di CO2, lascia i polmoni.</li>
          <li>Risale lungo i bronchi fino alla trachea.</li>
          <li>Esce dalla bocca o dal naso.</li>
        </ol>
      </Sub>

      <Sub id="circolazione" title="Circolazione (C, Circulation)" page="14">
        <p>Il cuore pompa il sangue: lo manda ai polmoni a ossigenarsi e poi, attraverso il circolo sistemico, distribuisce il sangue ossigenato in tutto il corpo. La circolazione ha quindi due parti.</p>
        <Compare
          columns={[
            { title: 'Circolazione polmonare', items: ['Detta anche piccolo circolo.', 'Va dal cuore ai polmoni e ne ritorna.', 'Negli alveoli il sangue cede CO2 e prende O2.'] },
            { title: 'Circolazione sistemica', items: ['Detta anche grande circolo.', 'Va dal cuore a tutto il resto del corpo.', 'Porta O2 alle cellule e riporta sangue ricco di CO2.'] },
          ]}
        />

        <h3>Il percorso del sangue</h3>
        <ol>
          <li>Il sangue che rientra dalla circolazione sistemica è povero di O2 (sangue venoso) e per questo contiene molta CO2.</li>
          <li>Entra nell’atrio destro.</li>
          <li>Passa nel ventricolo destro.</li>
          <li>Da qui è pompato ai polmoni, dove negli alveoli avviene lo scambio dei gas: è la circolazione polmonare.</li>
          <li>Il sangue che lascia i polmoni è ricco di O2 (sangue arterioso).</li>
          <li>Entra nell’atrio sinistro.</li>
          <li>Passa nel ventricolo sinistro.</li>
          <li>Dal ventricolo sinistro è pompato in tutto il corpo e porta O2 alle cellule: è la circolazione sistemica.</li>
        </ol>

        <Stage title="Il cuore e i suoi collegamenti" hint="Trascina per ruotare, scegli un numero">
          <ModelStage
            src="/models/heart.glb"
            alt="Modello 3D di un cuore umano visto dall’esterno, con i grandi vasi che portano il sangue dentro e fuori."
            hotspots={[
              { at: [-0.38, 0.85, 0.19], label: 'Ritorno dal corpo', text: <p>Qui rientra il sangue della circolazione sistemica, diretto all’atrio destro. È sangue venoso: povero di O2 e ricco di CO2.</p> },
              { at: [0.5, 0.58, 0.29], label: 'Verso i polmoni', text: <p>Dal ventricolo destro il sangue è pompato ai polmoni per lo scambio dei gas negli alveoli: circolazione polmonare, o piccolo circolo.</p> },
              { at: [0.34, 0.37, -0.65], label: 'Dai polmoni', text: <p>Il sangue che lascia i polmoni è ricco di O2 (sangue arterioso) e rientra nel cuore dall’atrio sinistro, che sta sul retro: ruota il modello per vederlo.</p> },
              { at: [0.18, 0.98, 0.05], label: 'Verso tutto il corpo', text: <p>Dal ventricolo sinistro il sangue arterioso parte per tutto il corpo e porta O2 alle cellule: circolazione sistemica, o grande circolo.</p> },
              { at: [0.07, -0.48, 0.59], label: 'I ventricoli', text: <p>Le camere inferiori del cuore: ricevono il sangue dagli atri e lo pompano nel sistema polmonare o nel sistema circolatorio.</p> },
            ]}
          />
        </Stage>

        <Stage title="Dentro il cuore: le quattro camere" hint="Modello sezionato, scegli un numero" footer="Sopra ci sono gli atri, le camere che ricevono il sangue; sotto i ventricoli, le camere che lo pompano.">
          <ModelStage
            src="/models/heart-section.glb"
            deferLabel="28 MB"
            rotation={[0, -Math.PI / 2, 0]}
            alt="Modello 3D di un cuore sezionato che mostra le quattro camere interne, le valvole e i vasi del sangue venoso e arterioso."
            hotspots={[
              { at: [-0.43, 0.06, 0.25], label: 'Atrio destro', text: <p>Camera superiore destra. Riceve il sangue venoso che rientra dalla circolazione sistemica e lo immette nel ventricolo destro.</p> },
              { at: [-0.43, -0.57, 0.31], label: 'Ventricolo destro', text: <p>Camera inferiore destra. Riceve il sangue dall’atrio destro e lo pompa ai polmoni: circolazione polmonare.</p> },
              { at: [0.4, 0.21, 0.25], label: 'Atrio sinistro', text: <p>Camera superiore sinistra. Riceve dai polmoni il sangue arterioso, ricco di O2, e lo immette nel ventricolo sinistro.</p> },
              { at: [0.41, -0.5, 0.22], label: 'Ventricolo sinistro', text: <p>Camera inferiore sinistra. Riceve il sangue dall’atrio sinistro e lo pompa in tutto il corpo: circolazione sistemica.</p> },
            ]}
          />
        </Stage>

        <Stage title="Rimetti in ordine il circuito" hint="Trascina dalla maniglia o usa le frecce">
          <p className="mb-4 text-well-soft">Le otto tappe del sangue sono mescolate. Ricostruisci il giro completo partendo dal sangue che rientra dal corpo, senza guardare l’elenco qui sopra.</p>
          <OrderGame label="Le otto tappe del circuito del sangue" items={scrambled} answer={circuit.map((c) => c.id)} solved={<p>Destra per il sangue venoso diretto ai polmoni, sinistra per il sangue arterioso diretto al corpo.</p>} />
        </Stage>

        <h3>Dall’aria alle cellule: A, B e C insieme</h3>
        <p>Scorri e segui una molecola di ossigeno lungo tutto il viaggio: il disegno si traccia mentre leggi.</p>
        <ScrollStory label="Il viaggio dell’ossigeno dall’aria alle cellule" steps={oxygenSteps} visual={OxygenVisual} />
      </Sub>

      <Sub id="terminologia" title="Terminologia medica" page="14">
        <p>Quattro termini da riconoscere. Premi una carta per girarla e leggere la definizione.</p>
        <FlipCards
          items={[
            { front: 'Atrio', back: 'Camera superiore del cuore. Immette il sangue nella camera inferiore, il ventricolo.' },
            { front: 'Ventricolo', back: 'Camera inferiore del cuore. Riceve il sangue dall’atrio e lo pompa nel sistema polmonare oppure nel sistema circolatorio.' },
            { front: 'Laringe', back: 'Organo della fonazione.' },
            {
              front: 'Faringe',
              back: 'Collega le alte vie respiratorie (cavità nasale, seni paranasali) e la cavità orale con, rispettivamente, le basse vie respiratorie (laringe, bronchi e alveoli) e l’esofago. Ha tre porzioni: rino-faringe, oro-faringe e laringo-faringe.',
            },
          ]}
        />
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave">
        <KeyFacts
          items={[
            { label: 'Ossigeno nell’aria', value: 'circa 21%' },
            { label: 'Azoto nell’aria', value: 'circa 79%' },
            { label: 'Vie aeree', value: '5', note: 'Naso, bocca, faringe, laringe, trachea.' },
            { label: 'Bronchi', value: '2', note: 'Destro e sinistro, diretti ai 2 polmoni.' },
            { label: 'Alveoli', value: 'circa 300 milioni' },
            { label: 'Circuiti della circolazione', value: '2', note: 'Polmonare (piccolo circolo) e sistemica (grande circolo).' },
            { label: 'Camere del cuore', value: '4', note: 'Atrio destro, ventricolo destro, atrio sinistro, ventricolo sinistro.' },
            { label: 'Porzioni della faringe', value: '3', note: 'Rino-, oro- e laringo-faringe.' },
            { label: 'Sigle', value: 'O2, CO2', note: 'O2 = ossigeno; CO2 = anidride carbonica.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="15">
        <p>Le risposte ufficiali sono a p. 98 del manuale.</p>
        <Quiz id="anatomia" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
