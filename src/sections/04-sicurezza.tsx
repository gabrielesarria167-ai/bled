import type { ReactNode } from 'react'
import { ModelStage } from '../components/three/ModelStage'
import { Callout, Checklist, Compare, Figure, KeyFacts, Quiz, SectionPage, SignMark, Stage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/04-sicurezza'
import { SortQuiz, type SortItem } from '../widgets/s03/SortQuiz'
import { GloveScene } from '../widgets/s04/GloveScene'
import { HazardScene } from '../widgets/s04/HazardScene'
import { ScanFigure } from '../widgets/s04/ScanFigure'

const iso = (file: string, alt: string, className = 'w-14') => <img src={`/img/iso7010/${file}`} alt={alt} className={`${className} shrink-0`} />

const misure: { sign: ReactNode; text: ReactNode }[] = [
  { sign: iso('m016-indossare-maschera.svg', 'Segnale di obbligo: indossare la maschera'), text: <>Usa mascherine ad alta protezione (<strong>FFP2 o FFP3</strong>).</> },
  { sign: <SignMark kind="obbligo" className="w-14" />, text: 'Copri bocca e naso della vittima con una mascherina o con una barriera di fortuna.' },
  { sign: <SignMark kind="obbligo" className="w-14" />, text: 'Proteggi gli occhi con occhiali o visiere.' },
  { sign: iso('m009-guanti-protettivi.svg', 'Segnale di obbligo: guanti protettivi'), text: 'Indossa guanti “usa e getta”.' },
  { sign: iso('p010-non-toccare.svg', 'Segnale di divieto: non toccare'), text: 'Evita il contatto con oggetti acuminati o taglienti.' },
  { sign: <SignMark kind="obbligo" className="w-14" />, text: 'Usa barriere per la rianimazione, come la maschera oronasale.' },
  { sign: iso('m011-lavarsi-le-mani.svg', 'Segnale di obbligo: lavarsi le mani'), text: 'Dopo aver prestato il primo soccorso, disinfetta e lava con cura le mani.' },
]

const vie: SortItem[] = [
  { id: 'sars', text: 'SARS-CoV2', bin: 'aerea', explain: 'Si trasmette per via aerea: proteggiti da droplets e aerosol.' },
  { id: 'hiv', text: 'HIV', bin: 'ematica', explain: 'Si trasmette per via ematica: attenzione al contatto con il sangue, per esempio in un’emorragia esterna.' },
  { id: 'tbc', text: 'Tubercolosi', bin: 'aerea', explain: 'È uno degli esempi di trasmissione per via aerea.' },
  { id: 'epatiti', text: 'Epatiti', bin: 'ematica', explain: 'Sono uno degli esempi di trasmissione per via ematica.' },
]

const kit: SortItem[] = [
  { id: 'ffp', text: 'Mascherina FFP2 o FFP3', bin: 'si', explain: 'È una mascherina ad alta protezione, la prima delle misure indicate.' },
  { id: 'sciarpa', text: 'Occhiali da sole e una sciarpa', bin: 'no', explain: 'Non sono protezioni adeguate: servono occhiali o visiere e una mascherina FFP2 o FFP3.' },
  { id: 'guanti', text: 'Guanti monouso', bin: 'si', explain: 'Guanti “usa e getta”: quando li indossi controlla che non siano danneggiati.' },
  { id: 'visiera', text: 'Occhiali o visiera', bin: 'si', explain: 'Proteggono gli occhi da droplets, secrezioni e sangue.' },
  { id: 'nylon', text: 'Guanti di nylon per alimenti', bin: 'no', explain: 'Non sono tra le protezioni indicate: per il primo soccorso servono guanti monouso.' },
  { id: 'oronasale', text: 'Maschera oronasale tascabile', bin: 'si', explain: 'È una barriera per la rianimazione: si appoggia su bocca e naso della vittima.' },
  { id: 'gel', text: 'Disinfettante per le mani', bin: 'si', explain: 'Dopo il soccorso disinfetta e lava con cura le mani.' },
]

const guanti = [
  'Afferra il primo guanto dall’esterno, all’altezza del polso, subito sotto il bordo, e tiralo verso le dita: il guanto si sfila rivoltandosi.',
  'Toglilo del tutto e, con la mano ancora protetta, appallottolalo chiudendo a pugno la mano che indossa ancora il guanto.',
  'Con il guanto rimosso chiuso nel pugno della mano ancora protetta, infila un dito “non protetto” sotto il secondo guanto, tra il polso e il guanto, e tiralo verso le dita come hai fatto con la prima mano.',
  'Il secondo guanto si sfila e si rivolta, mostrando il lato che non ha toccato sostanze dannose, e avvolge anche il primo guanto chiuso nel pugno: così eviti ogni contatto con sangue o altri fluidi presenti sui guanti.',
]

const guantiSteps = [
  { title: 'Afferra il primo guanto al polso', body: <p>{guanti[0]}</p>, visual: <GloveScene step={1} /> },
  { title: 'Appallottolalo nel pugno', body: <p>{guanti[1]}</p>, visual: <GloveScene step={2} /> },
  { title: 'Un dito nudo sotto il secondo guanto', body: <p>{guanti[2]}</p>, visual: <GloveScene step={3} /> },
  { title: 'Il secondo avvolge il primo', body: <p>{guanti[3]}</p>, visual: <GloveScene step={4} /> },
  {
    title: 'Nella busta dei rifiuti biologici',
    body: <p>Infine metti i guanti in una busta per “rifiuti biologici pericolosi” o, in ogni caso, segui la normativa in vigore a livello locale.</p>,
    visual: <GloveScene step={5} />,
  },
]

const letter = (l: string, signs?: ReactNode) => (
  <div className="flex flex-wrap items-center gap-4">
    <span className="plate plate-must grid aspect-square w-24 place-items-center font-display text-[4rem] font-extrabold leading-none">{l}</span>
    {signs}
  </div>
)

const safe = [
  {
    title: 'S – Stop',
    body: (
      <ul>
        <li>Fermati.</li>
        <li>Pensa.</li>
        <li>Agisci.</li>
      </ul>
    ),
    visual: letter('S'),
  },
  {
    title: 'A – Assess Scene',
    body: (
      <>
        <p>Verifica l’ambiente, la scena. Spunta ogni domanda solo quando hai la risposta:</p>
        <Checklist
          id="s04-safe-a"
          items={[
            { id: 'sicuro', label: 'L’ambiente è sicuro?' },
            { id: 'avvicinarsi', label: 'Ci si può avvicinare in sicurezza alla persona infortunata?' },
            { id: 'pericoli', label: 'Ci sono pericoli?' },
            { id: 'altro', label: 'C’è qualcos’altro che può rappresentare un rischio per il soccorritore?' },
          ]}
        />
      </>
    ),
    visual: (
      <div className="space-y-3">
        {letter('A', iso('w001-pericolo-generico.svg', 'Segnale di pericolo generico', 'w20'))}
        <ScanFigure />
      </div>
    ),
  },
  {
    title: 'F – Find First Aid kit',
    body: (
      <>
        <p>Trova il kit di primo soccorso (o l’Ossigeno e/o l’Unità DAE, il defibrillatore automatico esterno).</p>
        <ul>
          <li>I kit di primo soccorso contengono materiali fondamentali, come i DPI.</li>
        </ul>
      </>
    ),
    visual: letter(
      'F',
      <>
        {iso('e003-primo-soccorso.svg', 'Segnale: primo soccorso', 'w20')}
        {iso('e010-dae.svg', 'Segnale: defibrillatore automatico esterno (DAE)', 'w20')}
      </>,
    ),
  },
  {
    title: 'E – Exposure',
    body: (
      <>
        <p>Protezione contro l’esposizione.</p>
        <ul>
          <li>Usa protezioni come mascherina, guanti, occhiali e barriere bocca-maschera.</li>
          <li>Quando indossi i guanti: controlla che non siano danneggiati.</li>
          <li>Quando togli i guanti:</li>
        </ul>
        <ol className="list-decimal pl-5">
          <li>afferra il primo guanto dall’esterno del polso, appena sotto il bordo, tiralo verso le dita e rivoltalo;</li>
          <li>con la mano ancora protetta, fai una palla del guanto che hai tolto;</li>
          <li>infila un dito “non protetto” dentro il secondo guanto e tiralo verso le dita come prima, tenendo il primo guanto dentro il secondo;</li>
          <li>metti i guanti in una busta per “rifiuti pericolosi”.</li>
        </ol>
        <p>
          <a className="underline" href="#dopo">
            Rivedi la rimozione dei guanti, passo per passo
          </a>
        </p>
      </>
    ),
    visual: letter(
      'E',
      <>
        {iso('m009-guanti-protettivi.svg', 'Segnale di obbligo: guanti protettivi', 'w20')}
        {iso('m016-indossare-maschera.svg', 'Segnale di obbligo: indossare la maschera', 'w20')}
      </>,
    ),
  },
]

export default function Sicurezza() {
  return (
    <SectionPage
      slug="sicurezza"
      lead={
        <p>
          Prima di toccare chiunque, la priorità sei tu: non devi infortunarti né ammalarti mentre soccorri. Qui impari a riconoscere i pericoli della scena, a proteggerti dalle infezioni con i dispositivi di protezione individuale e a ricordare tutto con l’acronimo S-A-F-E.
        </p>
      }
    >
      <Sub id="pericoli" title="Pericoli presenti sulla scena" page="31">
        <p>Fra le priorità di chi soccorre c’è la propria sicurezza: il soccorritore non deve a sua volta infortunarsi o ammalarsi.</p>
        <p>
          Prima di iniziare il BLS (Basic Life Support) è fondamentale valutare se l’ambiente in cui è avvenuto l’evento è sicuro ed <strong>eliminare gli eventuali pericoli</strong> presenti.
        </p>
        <h3>Gli 8 pericoli principali</h3>
        <ul>
          <li>fumo;</li>
          <li>fuoco;</li>
          <li>gas;</li>
          <li>elettricità;</li>
          <li>traffico;</li>
          <li>sostanze chimiche (per contatto, inalazione o ingestione);</li>
          <li>patogeni;</li>
          <li>animali, o anche soltanto frammenti di alcune specie (per esempio i tentacoli ancora urticanti di una medusa o di altre specie marine).</li>
        </ul>
        <HazardScene />
        <Callout kind="attenzione">
          <p>Prima di agire, assicurati che il luogo sia sicuro. Proteggiti con comportamenti prudenti e con barriere: i dispositivi di protezione individuale (DPI).</p>
        </Callout>
      </Sub>

      <Sub id="infezioni" title="Trasmissione d’infezione e dispositivi di protezione individuali (DPI)" page="31–32">
        <p>
          Per quanto minimo, durante il primo soccorso il rischio d’infezione c’è sempre: per esempio per il possibile contatto con il sangue in caso di emorragia esterna, oppure con secrezioni e/o vomito durante la ventilazione artificiale.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          {iso('w009-rischio-biologico.svg', 'Segnale di pericolo: rischio biologico', 'w24')}
          <p className="min-w-0 flex-1 basis-[20rem]">
            È quindi fondamentale ridurre al minimo il rischio di trasmissione di agenti patogeni, sia per <strong>via aerea</strong> sia per <strong>via ematica</strong>. Prova a dividere questi esempi del manuale:
          </p>
        </div>
        <SortQuiz
          label="Via aerea o via ematica"
          bins={[
            { id: 'aerea', label: 'Via aerea' },
            { id: 'ematica', label: 'Via ematica' },
          ]}
          items={vie}
        />
        <Compare
          columns={[
            { title: 'Via aerea', items: ['SARS-CoV2', 'Tubercolosi'] },
            { title: 'Via ematica', items: ['Epatiti', 'HIV'] },
          ]}
        />

        <h3>BLS e COVID-19</h3>
        <p>ERC (European Resuscitation Council) ha pubblicato linee guida con le modifiche al BLS da applicare quando un’infezione da COVID-19 è sospetta o confermata. Le modifiche più importanti riguardano:</p>
        <ul>
          <li>l’uso dei dispositivi di protezione individuale;</li>
          <li>la valutazione della coscienza e della respirazione senza avvicinarsi a naso e bocca della vittima;</li>
          <li>il riconoscimento che ventilazioni e compressioni toraciche sono procedure che possono generare aerosol, con un aumento del rischio di trasmissione della malattia.</li>
        </ul>
        <p>
          Per questi motivi, e per la tua sicurezza, devi proteggerti da <strong>droplets</strong> (goccioline di saliva), <strong>aerosol</strong>, <strong>secrezioni corporee</strong>, <strong>sangue</strong> e <strong>vomito</strong>.
        </p>

        <h3>Come proteggerti: 7 misure</h3>
        <ul className="my-6 space-y-3 pl-0!">
          {misure.map((m, i) => (
            <li key={i} className="mt-0! flex items-center gap-4">
              {m.sign}
              <span className="min-w-0">{m.text}</span>
            </li>
          ))}
        </ul>
        <Figure file="img/dpi-guanti-nitrile.jpg" caption="Guanti monouso in nitrile: sono i guanti “usa e getta” da indossare prima di soccorrere. Quando li metti, controlla che non siano danneggiati." />
        <Callout kind="nota">
          <p>Se entri in contatto con secrezioni della vittima, si raccomanda di contattare un medico per programmare un’eventuale visita di controllo.</p>
        </Callout>
        <p>
          Decidere se adottare o no queste precauzioni universali spetta al soccorritore. La scelta può dipendere da vari fattori: chi è la persona soccorsa (per esempio un familiare oppure uno sconosciuto) e se sono disponibili i DPI.
        </p>
        <h3>Prepara il tuo kit</h3>
        <SortQuiz
          label="Prepara il tuo kit: che cosa protegge dal rischio d’infezione"
          intro="Che cosa metti nel kit per proteggerti davvero dalle infezioni? Per ogni oggetto scegli Protegge o Non protegge."
          bins={[
            { id: 'si', label: 'Protegge' },
            { id: 'no', label: 'Non protegge' },
          ]}
          items={kit}
        />
        <p>
          Tieni sempre i DPI in ogni kit di primo soccorso o in auto. Una maschera facciale tascabile (<em>pocket CPR face shield</em>), grande poco più di un portachiavi, può rivelarsi estremamente utile se devi praticare la RCP (Rianimazione Cardiopolmonare).
        </p>
        <Figure file="img/maschera-tascabile-posizionamento.png" caption="Una barriera per la rianimazione: la maschera oronasale tascabile si appoggia su naso e bocca della vittima." />
        <Stage title="Il kit di primo soccorso" hint="Trascina per ruotarlo.">
          {/* 3D-CHECK */}
          <ModelStage src="/models/first-aid-kit.glb" alt="Una borsa per il kit di primo soccorso: tienila pronta con i DPI dentro, in casa o in auto." autoRotate />
        </Stage>
        <Callout kind="attenzione">
          <p>Non avere fretta quando ti avvicini alla scena di un incidente: prenditi il tempo che serve per controllare l’ambiente e valutare che cosa fare, così da garantire la tua sicurezza.</p>
        </Callout>
        <Callout kind="obbligo" title="Il kit a portata di mano">
          <p>Prima di iniziare l’assistenza tieni a portata di mano il kit di primo soccorso con i DPI, soprattutto quando prevedi di entrare in contatto con secrezioni.</p>
        </Callout>
        <KeyFacts
          items={[
            { label: 'Vie di trasmissione dei patogeni', value: '2', note: 'Aerea (SARS-CoV2, tubercolosi) ed ematica (epatiti, HIV).' },
            { label: 'Modifiche ERC al BLS per COVID-19', value: '3' },
            { label: 'Fonti di contagio da cui proteggersi', value: '5', note: 'Droplets, aerosol, secrezioni corporee, sangue, vomito.' },
            { label: 'Misure di protezione dalle infezioni', value: '7' },
            { label: 'Mascherine ad alta protezione', value: 'FFP2 / FFP3' },
            { label: 'Pocket CPR face shield', value: '≈ un portachiavi' },
            { label: 'Dove tenere i DPI', value: 'kit e auto' },
          ]}
        />
      </Sub>

      <Sub id="dopo" title="Cosa fare dopo aver prestato il primo soccorso?" page="33">
        <Compare
          columns={[
            { title: 'Materiali riutilizzabili', kind: 'obbligo', items: ['Puliscili e disinfettali dopo ogni uso.', 'Segui le indicazioni delle schede tecniche o del manuale d’uso dei prodotti.'] },
            { title: 'Materiali monouso', kind: 'obbligo', items: ['Per esempio i guanti.', 'Eliminali in apposite buste e differenziali come prevedono le normative locali.'] },
          ]}
        />
        <h3 id="guanti">Togliersi i guanti</h3>
        <p>Togliersi i guanti nel modo corretto è molto importante per evitare il contatto con secrezioni potenzialmente dannose. Segui la sequenza: ogni passo mostra il movimento.</p>
        <Steps mode="stepper" label="Rimozione sicura dei guanti" items={guantiSteps} />
        <Figure caption="La sequenza completa, da ripassare a colpo d’occhio.">
          <ol className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {guanti.map((g, i) => (
              <li key={i} className="mt-0! grid grid-cols-[2.25rem_1fr] gap-3 text-[0.95rem] leading-snug">
                <span className="grid size-9 place-items-center rounded-chip bg-must font-display text-[1.3rem] font-extrabold leading-none text-on-sign">{i + 1}</span>
                <span className="min-w-0">{g}</span>
              </li>
            ))}
          </ol>
        </Figure>
        <p>Infine metti i guanti in una busta per “rifiuti biologici pericolosi” o, in ogni caso, segui la normativa vigente a livello locale.</p>
      </Sub>

      <Sub id="safe" title="Verifica della sicurezza ambientale – Prima la sicurezza" page="34">
        <p>
          Prima di compiere qualsiasi azione ricorda l’acronimo <strong>S-A-F-E</strong>: Stop | Assess Scene | Find | Exposure. Scorri le 4 lettere.
        </p>
        <Steps mode="stepper" label="L’acronimo S-A-F-E" items={safe} />
        <Callout kind="attenzione" title="SAFE">
          <p>Agisci in sicurezza solo dopo aver escluso ogni elemento di pericolo.</p>
        </Callout>
        <KeyFacts
          items={[
            { label: 'Pericoli principali sulla scena', value: '8' },
            { label: 'S-A-F-E', value: '4 lettere', note: 'Stop, Assess Scene, Find, Exposure.' },
            { label: 'Stop', value: '3 azioni', note: 'Fermati, pensa, agisci.' },
            { label: 'Assess Scene', value: '4 domande' },
            { label: 'Rimozione dei guanti', value: '4 passaggi', note: 'Poi la busta per “rifiuti biologici pericolosi”.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="35">
        <KeyFacts
          title="Dati chiave della sezione"
          items={[
            { label: 'Pericoli principali sulla scena', value: '8', note: 'Fumo, fuoco, gas, elettricità, traffico, sostanze chimiche (contatto, inalazione, ingestione), patogeni, animali o loro frammenti (per esempio tentacoli urticanti di medusa).' },
            { label: 'Vie di trasmissione dei patogeni', value: '2', note: 'Aerea (SARS-CoV2, tubercolosi) ed ematica (epatiti, HIV).' },
            { label: 'Modifiche ERC al BLS per COVID-19 sospetto o confermato', value: '3', note: 'Uso dei DPI; coscienza e respiro valutati senza avvicinarsi a naso e bocca; ventilazioni e compressioni considerate procedure che possono generare aerosol.' },
            { label: 'Fonti di contagio da cui proteggersi', value: '5', note: 'Droplets, aerosol, secrezioni corporee, sangue, vomito.' },
            { label: 'Misure di protezione contro le infezioni', value: '7', note: 'Mascherine ad alta protezione FFP2 o FFP3.' },
            { label: 'Pocket CPR face shield', value: '≈ un portachiavi' },
            { label: 'DPI', value: 'in ogni kit e in auto' },
            { label: 'Materiali riutilizzabili', value: 'puliti e disinfettati', note: 'Dopo ogni uso. I monouso vanno eliminati in apposite buste e differenziati secondo le normative locali.' },
            { label: 'Rimozione dei guanti', value: '4 passaggi', note: 'Poi la busta per “rifiuti biologici pericolosi”.' },
            { label: 'Acronimo S-A-F-E', value: '4 lettere', note: 'Stop (3 azioni: fermati, pensa, agisci), Assess Scene (4 domande), Find, Exposure.' },
          ]}
        />
        <Quiz id="sicurezza" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
