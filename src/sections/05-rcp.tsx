import { ModelStage, type Hotspot } from '../components/three/ModelStage'
import { Callout, Compare, Details, Figure, FlipCards, KeyFacts, Quiz, SectionPage, Stage, Steps, Sub, type Fact, type Step } from '../components/ui'
import questions from '../data/quiz/05-rcp'
import { RhythmTrainer } from '../widgets/RhythmTrainer'
import { Airway } from '../widgets/s05/Airway'
import { CycleTrainer } from '../widgets/s05/CycleTrainer'
import { DepthTrainer } from '../widgets/s05/DepthTrainer'
import { Ecg, MaskFace, Rescue } from '../widgets/s05/drawings'
import { GasTimer } from '../widgets/s05/GasTimer'
import { SequenceSim } from '../widgets/s05/SequenceSim'

const parti = [
  { to: '#approccio', title: 'Sicurezza e approccio', text: 'con la verifica dello stato di coscienza' },
  { to: '#respirazione', title: 'Controllo della respirazione', text: 'guarda, ascolta, senti' },
  { to: '#ritmo', title: 'Avvio della RCP', text: 'se serve' },
]

const mani: Hotspot[] = [
  { at: [0, 0.57, 0.14], label: 'Qui: centro del torace', text: <p>Metà inferiore del corpo dello sterno (nella pagina delle abilità: il terzo inferiore dello sterno). Appoggia solo l’eminenza tenar di una mano, l’altra sopra, dita incrociate.</p> },
  { at: [0.14, 0.61, 0.13], label: 'Costole: non premere', text: <p>Incrociate le dita, verifica che la pressione non cada sulle costole.</p> },
  { at: [0, 0.48, 0.13], label: 'Estremità inferiore dello sterno: non premere', text: <p>Non premere sull’estremità inferiore dello sterno.</p> },
  { at: [0, 0.37, 0.12], label: 'Parte alta dell’addome: non premere', text: <p>Non premere sulla parte alta dell’addome.</p> },
]

const abilita: Step[] = [
  {
    title: 'Sicurezza della scena',
    body: <p>Controlla che la scena sia sicura: né tu, né la persona infortunata, né le persone presenti dovete correre pericoli.</p>,
    visual: <Rescue pose="scena" label="Il soccorritore, ancora in piedi e a distanza, osserva la scena prima di avvicinarsi alla persona a terra" />,
  },
  {
    title: 'Verifica dello stato di coscienza',
    body: (
      <>
        <ul>
          <li>Scuoti con delicatezza le spalle della persona infortunata e chiedile ad alta voce: «Stai bene?».</li>
          <li>Di’ il tuo nome, quale addestramento hai e che vuoi aiutare.</li>
          <li>Chiedi il permesso di aiutare.</li>
        </ul>
        <p>
          <strong>Se risponde:</strong> lasciala nella posizione in cui l’hai trovata e fai in modo che non subisca altri danni; cerca di capire che cosa è successo e, se serve, chiedi aiuto; ricontrollala a intervalli regolari.
        </p>
        <p>
          <strong>Se non risponde:</strong> girala sulla schiena, a pancia in su, e aprile le vie aeree con il piegamento della testa e il sollevamento del mento (head tilt-chin lift):
        </p>
        <ul>
          <li>metti una mano sulla fronte e reclinale delicatamente la testa all’indietro (iperestensione del capo);</li>
          <li>appoggia la punta delle dita sotto il mento e sollevalo per aprire le vie aeree.</li>
        </ul>
      </>
    ),
    visual: <Rescue pose="scuoti" label="Il soccorritore in ginocchio accanto alla persona supina le scuote delicatamente le spalle e chiede: stai bene?" />,
  },
  {
    title: 'Controllo della respirazione (GAS)',
    body: (
      <>
        <p>Tenendo aperte le vie aeree, guarda, ascolta e senti se respira (GAS):</p>
        <ul>
          <li>
            <strong>Guarda:</strong> osserva se il torace si muove;
          </li>
          <li>
            <strong>Ascolta:</strong> cerca rumori respiratori che escono dalla bocca della persona;
          </li>
          <li>
            <strong>Senti:</strong> percepisci l’aria espirata sulla tua guancia;
          </li>
          <li>stabilisci se la respirazione è normale, anormale o assente.</li>
        </ul>
        <Callout kind="attenzione">
          <p>Nei primi minuti dopo un arresto cardiaco la persona può avere un respiro molto superficiale o emettere sporadici rantoli rumorosi. Guarda, ascolta e senti per un massimo di 10 secondi e decidi se respira normalmente. Se hai anche solo un dubbio che il respiro sia normale, comportati come se non lo fosse.</p>
        </Callout>
        <p>
          <strong>Se respira normalmente:</strong> mettila nella posizione laterale di sicurezza; vai a chiedere aiuto, manda qualcuno o chiama un’ambulanza; tieni sotto controllo costante la respirazione.
        </p>
      </>
    ),
    visual: <Rescue pose="gas" label="Il soccorritore, con una mano sulla fronte della vittima, avvicina la guancia alla sua bocca e guarda il torace" />,
  },
  {
    title: 'Respiro non normale o assente: avvio delle compressioni',
    body: (
      <>
        <ul>
          <li>Manda qualcuno a chiamare i soccorsi, oppure chiama tu con il tuo telefono.</li>
          <li>Attiva il vivavoce del cellulare: comunichi più facilmente con il SME.</li>
          <li>Lascia sola la persona infortunata soltanto se non esiste nessun’altra possibilità.</li>
          <li>Comincia le compressioni toraciche, su una superficie rigida ogni volta che è possibile:</li>
        </ul>
        <ol>
          <li>inginocchiati di fianco alla persona infortunata;</li>
          <li>appoggia la porzione di palmo di una mano al centro del torace (anatomicamente, sul terzo inferiore dello sterno), facendo poggiare solo l’eminenza tenar;</li>
          <li>metti il palmo dell’altra mano sopra la prima;</li>
          <li>incrocia le dita e verifica che la pressione non cada sulle costole; tieni le braccia ben dritte; non premere sulla parte alta dell’addome né sull’estremità inferiore dello sterno;</li>
          <li>
            portati perpendicolarmente sopra il torace e comprimilo di <strong>almeno 5 cm, senza superare i 6 cm</strong>;
          </li>
          <li>
            dopo ogni compressione rilascia del tutto la pressione, senza staccare le mani dallo sterno, senza restare appoggiato e togliendo completamente il tuo peso; ripeti a una velocità di <strong>almeno 100 compressioni al minuto, senza superare le 120</strong>;
          </li>
          <li>compressione e rilasciamento dovrebbero avere la stessa durata e la stessa escursione (rapporto 1:1).</li>
        </ol>
        <p>
          Le braccia restano tese e perpendicolari al piano su cui poggia la vittima. <a href="#mani">Guarda dove vanno le mani nel modello 3D</a>.
        </p>
      </>
    ),
    visual: <Rescue pose="comprimi" label="Il soccorritore in ginocchio a lato della vittima, con le spalle sopra le mani e le braccia tese, comprime il centro del torace" />,
  },
  {
    title: 'Alternare compressioni toraciche e ventilazioni',
    body: (
      <ol>
        <li>Dopo 30 compressioni riapri le vie aeree con il piegamento della testa e il sollevamento del mento.</li>
        <li>Usa una maschera di rianimazione oronasale, oppure chiudi le narici con indice e pollice della mano appoggiata sulla fronte.</li>
        <li>Lascia che la bocca si apra, continuando a tenere il mento sollevato.</li>
        <li>Inspira normalmente e metti le labbra sul beccuccio della maschera oronasale o sulle labbra della persona, controllando che la tenuta sia buona.</li>
        <li>Soffia con delicatezza nella maschera o nella bocca guardando il torace che si solleva; impiega circa 1 secondo, come in un respiro normale. Questa è una respirazione assistita efficace.</li>
        <li>Dopo l’insufflazione, sempre con la testa inclinata e il mento sollevato, allontana la bocca da quella della persona e osserva il torace che si abbassa mentre l’aria esce.</li>
        <li>Inspira di nuovo normalmente e soffia una seconda volta nella bocca (o nella maschera): in totale due respirazioni assistite efficaci.</li>
        <li>
          L’interruzione delle compressioni per dare le 2 ventilazioni di emergenza non dovrebbe superare i <strong>5 secondi</strong>.
        </li>
        <li>Poi, senza interrompere le manovre, rimetti le mani nella posizione corretta sullo sterno ed esegui altre 30 compressioni.</li>
        <li>
          Prosegui la RCP con un rapporto <strong>30:2</strong>.
        </li>
        <li>Fermati a ricontrollare la persona soltanto se comincia a muoversi, ad aprire gli occhi o a respirare da sola; altrimenti non interrompere la rianimazione.</li>
      </ol>
    ),
    visual: <Rescue pose="ventila" label="Il soccorritore tiene la testa della vittima iperestesa e soffia nella sua bocca guardando il torace" />,
  },
  {
    title: 'Se il torace non si alza, se siete in più, se non ventili',
    body: (
      <>
        <p>
          <strong>Se la prima respirazione assistita non fa sollevare il torace come in un respiro normale</strong>, prima di riprovare:
        </p>
        <ul>
          <li>guarda nella bocca della persona e togli qualsiasi ostruzione, senza esplorare alla cieca con le dita;</li>
          <li>ricontrolla che la testa sia inclinata e il mento sollevato nel modo corretto;</li>
          <li>non tentare più di 2 respirazioni per volta prima di tornare alle compressioni toraciche.</li>
        </ul>
        <p>
          <strong>Se i soccorritori sono più di uno:</strong> datevi il cambio nella RCP <strong>ogni 2 minuti</strong> per prevenire l’affaticamento, facendo in modo che durante lo scambio l’interruzione delle compressioni sia minima.
        </p>
        <p>
          <strong>Se non sei addestrato o non te la senti di praticare le ventilazioni:</strong> esegui soltanto le compressioni toraciche, in modo continuo (senza interruzioni) e a una frequenza di almeno 100 al minuto, senza superare le 120.
        </p>
      </>
    ),
  },
  {
    title: 'Quando interrompere la rianimazione',
    body: (
      <>
        <p>Non sospendere la rianimazione finché:</p>
        <ul>
          <li>non arriva personale specializzato che prende in mano la situazione;</li>
          <li>la persona infortunata non comincia a muoversi, apre gli occhi e respira normalmente;</li>
          <li>non sei esausto.</li>
        </ul>
        <Callout kind="nota" title="Annegati e bambini">
          <p>
            Dai <strong>5 respirazioni assistite iniziali</strong> prima di cominciare le compressioni toraciche ed esegui <strong>1 minuto di RCP</strong> prima di andare a cercare aiuto.
          </p>
        </Callout>
        <Callout kind="attenzione">
          <p>Non abbandonare mai l’infortunato. Esegui soltanto le manovre di primo soccorso che rientrano nella sfera delle tue competenze.</p>
        </Callout>
      </>
    ),
  },
]

const maschera: Step[] = [
  { title: 'Prepara la maschera', body: <p>Estrai la maschera dal suo involucro e, se serve, spingi verso l’esterno la valvola con filtro: di solito la maschera viene «appiattita» per poterla conservare.</p> },
  { title: 'Mettiti accanto alla testa', body: <p>Mettiti accanto alla testa della vittima, in una posizione da cui puoi eseguire sia la ventilazione artificiale sia le compressioni del torace.</p> },
  { title: 'Appoggia la maschera', body: <p>Appoggia la maschera sul viso della vittima, prendendo la radice del naso come riferimento per posizionarla correttamente.</p> },
  { title: 'Fissala con l’elastico', body: <p>Se vuoi, usa l’elastico per tenere ferma la maschera.</p> },
  { title: 'Sigilla la maschera', body: <p>Indice e pollice della mano più vicina alla sommità del capo della vittima vanno lungo il bordo della maschera; il pollice (oppure pollice e indice) dell’altra mano va lungo il margine inferiore della maschera.</p> },
  { title: 'Solleva la mandibola', body: <p>Le altre dita della mano più vicina ai piedi della vittima vanno lungo il margine osseo della mandibola, che sollevi con la manovra «piega la testa, solleva il mento».</p> },
  { title: 'Premi su tutto il bordo', body: <p>Premi con decisione e in modo completo il margine esterno della maschera, così da ottenere una tenuta totale.</p> },
  { title: 'Ventila', body: <p>Esegui ventilazioni artificiali lente ed efficaci, guardando se il torace si espande.</p> },
].map((s, i) => ({ ...s, visual: <MaskFace step={i + 1} /> }))

const dati: { title: string; items: Fact[] }[] = [
  {
    title: 'Epidemiologia',
    items: [
      { label: 'Morte improvvisa sul totale delle morti cardiovascolari', value: '50%', note: 'L’ACI ne è la causa più diffusa.' },
      { label: 'Morti per arresto cardiaco in Italia, ogni anno', value: '50.000–60.000', note: 'Circa 1 caso ogni 1.000 abitanti.' },
      { label: 'Di queste, dovute a cardiopatia ischemica', value: 'circa 80%', note: 'Infarto del miocardio.' },
      { label: 'Maschi fra 20 e 60 anni', value: '1ª causa', note: 'L’arresto cardiaco è la principale causa di morte.' },
      { label: 'Decessi da arresto cardiaco, 20–39 anni', value: '76%' },
      { label: 'Decessi da arresto cardiaco, 40–54 anni', value: '62%' },
      { label: 'Decessi da arresto cardiaco, 55–64 anni', value: '58%' },
      { label: 'Decessi da arresto cardiaco, 65–74 anni', value: '40–50%' },
      { label: 'Sopravvivenza extra-ospedaliera', value: 'circa 2%' },
      { label: 'Con defibrillazione precoce', value: '20–35%' },
      { label: 'Con defibrillazione entro 5 minuti', value: '50%' },
      { label: 'Causa più frequente di ACC sopra i 50 anni', value: 'IMA' },
      { label: 'Causa più frequente nei giovani', value: 'aritmie' },
      { label: 'Causa più frequente in neonati e lattanti', value: 'insufficienza respiratoria' },
      { label: 'Sopravvivenza in più grazie a un corso BLS-D', value: 'fino al 40%' },
    ],
  },
  {
    title: 'Sequenza e controlli',
    items: [
      { label: 'Parti principali della sequenza BLS dell’adulto', value: '3' },
      { label: 'Controllo del respiro (GAS)', value: 'max 10 s' },
      { label: 'Segni di circolo nel bambino (MO.TO.RE)', value: 'max 10 s' },
    ],
  },
  {
    title: 'Compressioni toraciche (adulto)',
    items: [
      { label: 'Compressioni : ventilazioni', value: '30:2', note: 'Linee guida ERC (European Resuscitation Council) 2021.' },
      { label: 'Compressioni per ciclo', value: '30' },
      { label: 'Ritmo', value: '100–120 al min', note: 'Almeno 100, non oltre 120.' },
      { label: '30 compressioni durano', value: '18 s o 15 s', note: 'A 100 o a 120 al minuto: poco meno di 2 al secondo.' },
      { label: 'Profondità', value: '5–6 cm', note: 'Almeno 5 cm, non oltre 6 cm.' },
      { label: 'Compressione : rilascio', value: '1:1', note: 'Stessa durata e stessa escursione.' },
      { label: 'Posizione delle mani', value: 'centro del petto', note: 'Metà inferiore del corpo dello sterno (p. 41); nella pagina delle abilità, terzo inferiore dello sterno (p. 48).' },
      { label: 'Sole compressioni', value: '100–120 al min', note: 'Per chi non è addestrato o non vuole ventilare: senza interruzioni.' },
      { label: 'Cambio fra soccorritori', value: 'ogni 2 min' },
    ],
  },
  {
    title: 'Ventilazioni (adulto)',
    items: [
      { label: 'Dopo ogni serie di 30 compressioni', value: '2 ventilazioni', note: 'Efficaci.' },
      { label: 'Durata di ogni ventilazione', value: 'circa 1 s' },
      { label: 'Pausa massima per le 2 ventilazioni', value: '5 s' },
      { label: 'Tentativi per volta prima di tornare alle compressioni', value: 'max 2' },
      { label: 'O2 nell’aria espirata dal soccorritore', value: 'circa 16%', note: 'Nell’aria normalmente inspirata: 21%.' },
      { label: 'Respiri al minuto in condizioni normali', value: '12–20' },
      { label: 'Ventilazioni al minuto durante la RCP', value: 'circa 5' },
      { label: 'Volume di ogni ventilazione', value: '500–600 ml', note: '6–7 ml/kg di peso corporeo, uomo di media corporatura.' },
      { label: 'Pressione di apertura del cardias', value: '15–20 cm H2O' },
    ],
  },
  {
    title: 'Bambini e annegamento',
    items: [
      { label: 'Ventilazioni iniziali (bambino)', value: '5', note: 'Di 1 secondo ciascuna, tali da far sollevare il torace.' },
      { label: 'RCP prima di chiamare aiuto, se sei solo', value: 'circa 1 min', note: 'Salvo un malore improvviso visto di persona: allora aiuto subito.' },
      { label: 'Profondità della compressione pediatrica', value: '1/3 del torace' },
      { label: 'Sotto 1 anno', value: '2 dita' },
      { label: 'Sopra 1 anno', value: '1 o 2 mani' },
      { label: 'Neonati', value: '4 cm' },
      { label: 'Bambini sopra 1 anno', value: '5 cm' },
      { label: 'Annegamento o bambini', value: '5 + 1 min', note: '5 respirazioni assistite iniziali prima delle compressioni, 1 minuto di RCP prima di cercare aiuto.' },
    ],
  },
  {
    title: 'Defibrillazione e maschera',
    items: [
      { label: 'Lo shock ferma il cuore per', value: 'millisecondi', note: 'Pochi istanti.' },
      { label: 'Defibrillazione precoce', value: 'primi minuti', note: 'Nei primissimi minuti dall’inizio della FV.' },
      { label: 'Procedura d’uso della maschera', value: '8 passaggi' },
    ],
  },
]

export default function Rcp() {
  return (
    <SectionPage
      slug="rcp"
      lead={
        <p>
          La rianimazione cardio-polmonare (RCP) alterna compressioni toraciche e ventilazioni per tenere ossigenati cervello e cuore quando il cuore si ferma. Qui impari la sequenza completa nell’adulto, il ritmo e la profondità giusti, le ventilazioni, le differenze nei bambini e perché serve subito un DAE (defibrillatore automatico esterno). Poi la provi, passo dopo passo.
        </p>
      }
    >
      <Sub id="arresto" title="Perché la RCP: l’arresto cardiocircolatorio" page="37–38">
        <p>Riprendendo la parte generale sul BLS (Basic Life Support, supporto di base alla vita): la RCP va cominciata prima possibile, perché ogni ritardo espone tessuti e organi a danni gravi.</p>
        <h3>Quanto pesa l’arresto cardiaco</h3>
        <ul>
          <li>L’Arresto Cardiocircolatorio Improvviso (ACI) è la causa più frequente di morte improvvisa.</li>
          <li>La morte improvvisa, a sua volta, corrisponde al 50% di tutti i decessi per causa cardiovascolare.</li>
          <li>In Italia, per fare un esempio, si stimano circa 50.000–60.000 morti all’anno per arresto cardiaco: più o meno 1 caso ogni 1.000 abitanti.</li>
          <li>Circa l’80% di queste morti dipende dalla cardiopatia ischemica (infarto del miocardio); le altre possibili cause di arresto cardiaco restano comunque moltissime.</li>
        </ul>
        <p>Nei maschi fra i 20 e i 60 anni l’arresto cardiaco è la prima causa di morte. La sopravvivenza, nei casi extra-ospedalieri, si stima intorno al 2%, ma cambia molto a seconda di quanto è rapido l’intervento.</p>
        <div className="grid gap-x-6 lg:grid-cols-2">
          <KeyFacts
            title="Decessi dovuti all’arresto cardiaco (maschi)"
            items={[
              { label: 'Fra i 20 e i 39 anni', value: '76%' },
              { label: 'Fra i 40 e i 54 anni', value: '62%' },
              { label: 'Fra i 55 e i 64 anni', value: '58%' },
              { label: 'Fra i 65 e i 74 anni', value: '40–50%' },
            ]}
          />
          <KeyFacts
            title="Sopravvivenza fuori dall’ospedale"
            tone="well"
            items={[
              { label: 'Stima generale', value: 'circa 2%' },
              { label: 'Con defibrillazione precoce', value: '20–35%' },
              { label: 'Con defibrillazione entro 5 minuti', value: '50%' },
            ]}
          />
        </div>
        <Callout kind="nota">
          <p>Fonte dei dati: Ministero della Salute italiano. I valori si possono comunque considerare in linea con le statistiche internazionali.</p>
        </Callout>

        <h3>Le cause di Arresto Cardiocircolatorio (ACC)</h3>
        <p>Un ACC può essere provocato da:</p>
        <ul>
          <li>infarto miocardico acuto (IMA): è la causa più frequente sopra i 50 anni, anche se non ogni infarto sfocia in un arresto cardiaco;</li>
          <li>aritmie cardiache: sono la causa più frequente nei giovani;</li>
          <li>insufficienza respiratoria: è la causa più frequente in neonati e lattanti;</li>
          <li>embolia polmonare;</li>
          <li>emorragia grave;</li>
          <li>cardiomiopatia dilatativa o ipertrofica;</li>
          <li>pneumotorace iperteso;</li>
          <li>anomalie cardiache ereditarie: spesso l’ACC è il primo segnale con cui si manifestano; fra le più frequenti ci sono la sindrome di Brugada e la sindrome del QT lungo;</li>
          <li>intossicazioni da farmaci o da sostanze stupefacenti;</li>
          <li>alterazioni metaboliche (per esempio ipoglicemia o iperglicemia);</li>
          <li>cause non cardiovascolari: traumi (commotio cordis), elettrocuzioni e annegamenti.</li>
        </ul>
        <p>Tre età, tre cause più frequenti. Prova a ricordarle, poi gira la carta.</p>
        <FlipCards
          items={[
            { front: 'Neonati e lattanti', back: 'Insufficienza respiratoria' },
            { front: 'Giovani', back: 'Aritmie cardiache' },
            { front: 'Oltre i 50 anni', back: 'Infarto miocardico acuto (IMA), anche se non ogni infarto porta all’arresto' },
          ]}
        />

        <h3>ACC di origine non asfittica e di origine asfittica</h3>
        <Compare
          columns={[
            {
              title: 'ACC non legato ad asfissia',
              kind: 'nota',
              items: ['Il cuore si ferma di colpo.', 'Nei vasi c’è ancora sangue con una quantità relativamente elevata di O2.', 'Nelle prime fasi del soccorso le compressioni toraciche contano più delle ventilazioni.'],
              footer: 'O2 nel sangue ancora alto. Priorità: compressioni.',
            },
            {
              title: 'ACC da asfissia',
              kind: 'attenzione',
              items: ['Nasce da un soffocamento, come accade nell’annegamento.', 'La concentrazione di O2 nel sangue (ipossia) e nei tessuti crolla, ed è proprio questa mancanza a provocare l’arresto.', 'Le ventilazioni diventano importanti e prioritarie.'],
              footer: 'O2 quasi esaurito. Priorità: ventilazioni.',
            },
          ]}
        />
        <Callout kind="nota" title="Nota bene">
          <p>Se la vittima di ACC è un bambino, i problemi cardiaci primitivi sono più rari, mentre l’origine asfittica è frequente. Il bambino ha anche «scorte» di O2 ridotte, quindi si desatura molto più in fretta. Per questo il protocollo BLS pediatrico (PBLS) e quello per l’annegamento differiscono leggermente dal protocollo di base dell’adulto.</p>
        </Callout>
      </Sub>

      <Sub id="rapporto" title="Rapporto compressioni–ventilazioni" page="38">
        <p>La Rianimazione Cardiopolmonare (RCP) è una tecnica in cui si alternano compressioni toraciche e ventilazioni (respiri assistiti).</p>
        <ul>
          <li>
            <strong>Compressioni toraciche:</strong> producono un flusso di sangue modesto ma indispensabile, perché assicura quel minimo di sangue essenziale al cervello e al miocardio (il tessuto muscolare del cuore). In più aumentano le probabilità che la defibrillazione abbia successo.
          </li>
          <li>
            <strong>Ventilazioni (o respirazioni assistite):</strong> riforniscono d’aria i polmoni e fanno salire la concentrazione di O2 negli alveoli; da lì l’O2 passa al sangue per diffusione.
          </li>
        </ul>
        <p>
          Secondo le linee guida attuali, il rapporto <strong>compressioni toraciche : ventilazioni = 30 : 2</strong> è il miglior compromesso fra flusso di sangue e apporto di O2. Ne consegue che le interruzioni delle compressioni vanno ridotte al minimo: ogni pausa interrompe la perfusione degli organi e deve durare il meno possibile, per prevenire il danno ischemico.
        </p>
        <Stage title="Il ciclo 30:2" hint="Un passo alla volta, oppure a tempo reale" footer="30 compressioni richiedono 18 secondi a 100 al minuto e 15 secondi a 120 al minuto. Ogni ventilazione dura circa 1 secondo e le 2 ventilazioni, in tutto, non superano i 5 secondi. Con più soccorritori, cambio ogni 2 minuti.">
          <CycleTrainer />
        </Stage>
        <p>Le manovre di RCP proseguono senza sosta finché non si verifica una di queste condizioni:</p>
        <ul>
          <li>arrivano soccorsi qualificati;</li>
          <li>la persona infortunata mostra segni di circolo spontaneo: si muove, respira, apre gli occhi o parla;</li>
          <li>il soccorritore è esausto (esaurimento delle forze).</li>
        </ul>
      </Sub>

      <Sub id="sequenza" title="Sequenza di rianimazione di un adulto: azioni del soccorritore" page="38–39">
        <p>La sequenza BLS dell’adulto si divide in tre parti principali. Ognuna ha la sua sottosezione qui sotto:</p>
        <ol className="grid gap-3 pl-0! sm:grid-cols-3">
          {parti.map((p, i) => (
            <li key={p.to} className="mt-0!">
              <a href={p.to} className="flex h-full gap-3 rounded-plate bg-panel p-4 text-ink! no-underline! transition-colors duration-150 hover:bg-panel-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-chip bg-must font-display text-[1.3rem] font-extrabold leading-none text-on-sign">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[1.3rem] font-bold leading-tight">{p.title}</span>
                  <span className="block text-[0.92rem] text-ink-soft">{p.text}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
        <Callout kind="nota">
          <p>
            Le tecniche di rianimazione sono spiegate con precisione nelle <a href="#abilita">Abilità pratiche di BLS</a>, più avanti. Alla fine della sezione puoi provare tutta la sequenza nel <a href="#sequenza-completa">simulatore</a>.
          </p>
        </Callout>
      </Sub>

      <Sub id="approccio" title="Approccio: verificare lo stato di coscienza e aprire le vie aeree" page="39">
        <p>Dopo aver accertato che l’ambiente è sicuro, il soccorritore controlla se la vittima è cosciente scuotendole le spalle. Da qui la strada si divide.</p>
        <Compare
          columns={[
            {
              title: 'Se è cosciente',
              kind: 'nota',
              items: [
                'Lasciala nella posizione in cui si trova e attiva il SME (Servizio Medico di Emergenza).',
                'Rassicurala e cerca di ricostruire la dinamica di ciò che è successo.',
                'Presentati: di’ il tuo nome, spiega che sei formato al primo soccorso e che vuoi aiutare.',
                'Rassicurala con un atteggiamento premuroso: spiegale che cosa sta succedendo e falle capire che qualcuno si sta occupando di lei.',
                'Tieni lontani gli astanti, per non aggiungerle altro stress.',
                'È molto probabile che sia agitata e in ansia: il tuo conforto la aiuta a sentirsi più sicura, più tranquilla e più collaborativa.',
              ],
            },
            {
              title: 'Se è incosciente',
              kind: 'obbligo',
              items: [
                'Mettila in posizione supina, distesa sulla schiena.',
                'Aprile subito le vie aeree e, se occorre, liberale.',
                'Le vie aeree possono chiudersi anche solo perché la lingua si rilascia: in chi è incosciente la lingua può cadere all’indietro e bloccare il passaggio dell’aria.',
                <>
                  La manovra per aprirle si chiama <strong>head tilt-chin lift</strong>, «piega il capo e solleva il mento» (iperestensione del capo). È facile da imparare: la trovi nelle abilità pratiche.
                </>,
                'L’ostruzione delle vie aeree da corpo estraneo è trattata più avanti nel corso.',
                'Se il respiro è conservato, può bastare aiutarla a respirare aprendo le vie aeree e mantenendole pervie fino all’arrivo del SME.',
              ],
            },
          ]}
        />
        <Stage title="Piega il capo, solleva il mento" hint="Premi il pulsante per aprire le vie aeree">
          <Airway />
        </Stage>
        <div className="grid items-start gap-x-6 sm:grid-cols-2">
          <Figure file="img/vie-aeree-lingua-ostruzione.png" caption="A sinistra il capo è flesso e la lingua chiude il passaggio dell’aria; a destra il capo è iperesteso e le vie aeree sono libere." />
          <Figure file="img/vie-aeree-iperestensione-capo.jpg" caption="Head tilt-chin lift: una mano sulla fronte reclina il capo, la punta delle dita sotto il mento lo solleva." />
        </div>
      </Sub>

      <Sub id="respirazione" title="Verificare la respirazione" page="40">
        <p>Una volta garantita la pervietà delle vie aeree, il soccorritore controlla la respirazione in tre modi:</p>
        <ol>
          <li>
            <strong>Guardare</strong> se il torace si muove;
          </li>
          <li>
            <strong>Ascoltare</strong> se ci sono rumori respiratori;
          </li>
          <li>
            <strong>Sentire</strong> se c’è un flusso d’aria, avvicinando guancia e orecchio al naso e alla bocca della vittima.
          </li>
        </ol>
        <p>
          È il controllo <strong>GAS (Guarda, Ascolta, Senti)</strong>: si esegue tenendo aperte le vie aeree e dura <strong>al massimo 10 secondi</strong>.
        </p>
        <Stage title="Guarda, ascolta, senti" hint="Avvia tu il timer, poi decidi">
          <GasTimer />
        </Stage>
        <h3>Se la respirazione è normale</h3>
        <ul>
          <li>Sistema la vittima in posizione laterale di sicurezza (PLS): così le vie aeree restano pervie e, se vomita, non inala il materiale.</li>
          <li>Dopo averla messa in sicurezza puoi chiamare il SME.</li>
          <li>La PLS non va eseguita se si sospettano traumi o danni a testa, collo o schiena.</li>
          <li>Continua a controllare costantemente che la respirazione sia presente e comportati di conseguenza.</li>
        </ul>
        <Callout kind="attenzione" title="Importante">
          <p>Subito dopo un arresto cardiaco una persona può respirare in modo debole oppure emettere rari rantoli rumorosi (gasping). Questo non va mai scambiato per una respirazione normale. Se non sei sicuro che il respiro sia normale, comportati esattamente come se la vittima non respirasse (arresto respiratorio).</p>
        </Callout>
        <Callout kind="nota">
          <p>
            Come eseguire correttamente la posizione laterale di sicurezza è spiegato nel dettaglio nella <a href="/sezione/pls">Sezione 6, Posizione laterale di sicurezza</a>.
          </p>
        </Callout>
      </Sub>

      <Sub id="ritmo" title="Iniziare la RCP: sostenere la circolazione" page="41–42">
        <h3>Allertare e posizionare le mani</h3>
        <ul>
          <li>Se manca una respirazione normale, allerta subito il SME, specificando che la vittima non respira.</li>
          <li>Comincia le compressioni toraciche appoggiando una porzione del palmo di una mano (eminenza tenar) al centro del petto, sulla metà inferiore del corpo dello sterno; l’altra mano va sopra, con le dita intrecciate.</li>
          <li>
            La posizione esatta delle mani è descritta nel dettaglio nell’abilità pratica: <a href="#mani">la vedi anche nel modello 3D</a>.
          </li>
        </ul>
        <div className="grid items-start gap-x-6 sm:grid-cols-2">
          <Figure file="img/rcp-posizione-mani-sterno.jpg" caption="Le mani sovrapposte, dita intrecciate, al centro del torace: sulla metà inferiore dello sterno." />
          <Figure file="img/rcp-compressioni-manichino.jpg" caption="Compressioni su un manichino da addestramento: mani sovrapposte e dita intrecciate al centro del torace." />
        </div>

        <h3>Compressioni: numero, ritmo, profondità</h3>
        <ul>
          <li>
            Le linee guida attuali prevedono <strong>30 compressioni toraciche</strong> a un ritmo di <strong>almeno 100 al minuto, senza andare oltre le 120 al minuto</strong>.
          </li>
          <li>
            In pratica, a 100 o 120 compressioni al minuto, le 30 compressioni richiedono <strong>18 o 15 secondi</strong>: poco meno di 2 compressioni al secondo.
          </li>
          <li>
            Ogni compressione deve abbassare il torace di <strong>almeno 5 cm, senza superare i 6 cm</strong>.
          </li>
          <li>Fra una compressione e la successiva rilascia la pressione sul torace, ma senza mai staccare le mani dal torace.</li>
        </ul>
        <p>Il massaggio cardiaco esterno sostituisce l’attività del cuore e ricrea, in parte, una circolazione del sangue.</p>
        <Stage title="Il ritmo delle compressioni" hint="Premi il segnale o la barra spaziatrice" footer="Zona giusta: da 100 a 120 al minuto. Dopo 30 compressioni arrivano le 2 ventilazioni.">
          <RhythmTrainer full />
        </Stage>
        <h4>Che cosa succede se ritmo o profondità sono sbagliati</h4>
        <Compare
          columns={[
            {
              title: 'Troppo ravvicinate e veloci',
              kind: 'divieto',
              items: ['Il cuore non ha il tempo di riempirsi e svuotarsi a dovere.', 'Compressioni e flusso sanguigno diventano inefficaci.', 'La velocità eccessiva impedisce il rilascio completo e altera il rapporto 1:1: a ogni compressione deve seguire il suo rilascio.'],
            },
            {
              title: 'Troppo lente o poco profonde',
              kind: 'divieto',
              items: ['Il sangue si muove troppo lentamente.', 'Anche in questo caso il circolo è inefficace.'],
            },
          ]}
        />
        <Stage title="La profondità" hint="Tieni premuto, poi lascia andare" footer="Almeno 5 cm, non oltre 6 cm. Tra una compressione e l’altra il torace risale del tutto, ma le mani restano appoggiate.">
          <DepthTrainer />
        </Stage>
        <KeyFacts
          title="Compressioni nell’adulto"
          items={[
            { label: 'Compressioni per ciclo', value: '30' },
            { label: 'Ritmo', value: '100–120 al min' },
            { label: 'Durata di 30 compressioni', value: '18 s o 15 s' },
            { label: 'Profondità', value: '5–6 cm' },
            { label: 'Compressione : rilascio', value: '1:1' },
          ]}
        />

        <h3>Ventilazioni: come si eseguono</h3>
        <ul>
          <li>
            Subito dopo le 30 compressioni esegui <strong>2 ventilazioni efficaci</strong>.
          </li>
          <li>Riapri le vie aeree, sigilla con le tue labbra la bocca della vittima, tienile chiuso il naso e soffia aria dalla tua bocca verso i suoi polmoni.</li>
          <li>Chiudi bene il naso pinzando le narici: altrimenti l’aria che soffi esce da lì e l’insufflazione perde efficacia.</li>
          <li>Soffia in modo costante, osservando il torace che si alza.</li>
          <li>Dopo ogni insufflazione stacca la bocca da quella della vittima e girala verso il suo torace: così inspiri più facilmente aria pulita e controlli che il torace si abbassi regolarmente, tornando alla posizione di massima espirazione.</li>
          <li>
            Ogni ventilazione dura <strong>circa 1 secondo</strong>. La seconda si esegue quando il torace è tornato nella sua posizione.
          </li>
          <li>
            Le due ventilazioni non dovrebbero richiedere, in tutto, <strong>più di 5 secondi</strong>.
          </li>
        </ul>
        <Figure caption="Testa iperestesa, naso chiuso, bocca sigillata: soffia per circa 1 secondo guardando il torace che sale.">
          <div className="mx-auto max-w-md p-4">
            <Rescue pose="ventila" label="Il soccorritore tiene la testa della vittima iperestesa e soffia nella sua bocca guardando il torace" />
          </div>
        </Figure>

        <h3>Perché ventilare: l’O2 durante la respirazione assistita</h3>
        <ul>
          <li>
            L’aria espirata dal soccorritore contiene circa il <strong>16% di O2</strong> e arriva ai polmoni della vittima.
          </li>
          <li>Se nei polmoni la concentrazione di O2 è abbastanza alta, l’O2 passa ai capillari e può ossigenare il sangue, anche se solo in parte.</li>
          <li>Dato che la vittima non respira, durante questo processo la concentrazione di O2 nei polmoni cala; quando scende troppo, la diffusione fra alveoli e capillari si ferma. Per questo occorre continuare a ventilare.</li>
          <li>
            In condizioni normali si respira circa <strong>12–20 volte al minuto</strong> (secondo età e attività), mentre durante la rianimazione le ventilazioni scendono a circa <strong>5 al minuto</strong>.
          </li>
          <li>
            La minore frazione inspirata di O2 (<strong>16% invece del 21%</strong>) e il numero ridotto di ventilazioni tengono relativamente bassa la concentrazione di O2 nei polmoni.
          </li>
          <li>Se durante le ventilazioni si aumenta la concentrazione di O2, ne diffonde di più ai capillari e l’ossigenazione migliora. Questo aumento si ottiene con l’O2 supplementare.</li>
        </ul>
        <KeyFacts
          title="Ossigeno e ventilazioni"
          tone="well"
          items={[
            { label: 'O2 nell’aria ambiente', value: '21%' },
            { label: 'O2 nell’aria espirata dal soccorritore', value: 'circa 16%' },
            { label: 'Respiri al minuto, normalmente', value: '12–20' },
            { label: 'Ventilazioni al minuto in RCP', value: 'circa 5' },
          ]}
        />
        <Callout kind="nota">
          <p>
            <strong>Protesi dentaria:</strong> se c’è, toglila soltanto quando non riesce a restare in posizione. In tutti gli altri casi lasciala nella bocca della vittima, perché aiuta a ottenere una buona tenuta.
          </p>
          <p>
            <strong>Sole compressioni toraciche:</strong> se non sei addestrato, oppure non te la senti di praticare le ventilazioni (rischio di trasmissione di malattie), puoi eseguire soltanto le compressioni, a 100 al minuto e senza superare le 120.
          </p>
        </Callout>
      </Sub>

      <Sub id="bambini" title="E i bambini?" page="43">
        <p>Molti bambini non ricevono una rianimazione adeguata perché chi potrebbe soccorrerli ha paura di far loro del male. È un timore senza fondamento: per esempio, applicare a un bambino la sequenza di rianimazione dell’adulto è di gran lunga preferibile al non fare nulla.</p>
        <p>Il BLS in età pediatrica ha alcune differenze rispetto a quello dell’adulto:</p>
        <ol>
          <li>
            se il bambino non respira normalmente, si eseguono subito <strong>5 ventilazioni iniziali</strong>, ciascuna di 1 secondo e abbastanza intensa da far sollevare il torace;
          </li>
          <li>
            finite le ventilazioni iniziali, si controllano i segni vitali di circolo, <strong>MO.TO.RE: Movimento, Tosse, Respiro</strong>, per <strong>non più di 10 secondi</strong>;
          </li>
          <li>se i segni vitali ci sono, si prosegue con la respirazione di soccorso;</li>
          <li>se i segni vitali mancano, si iniziano le compressioni;</li>
          <li>
            se il soccorritore è solo, esegue la RCP per <strong>circa 1 minuto</strong> prima di chiamare aiuto; l’eccezione è quando ha visto di persona un malore improvviso: allora l’assistenza va cercata immediatamente.
          </li>
        </ol>
        <Compare
          columns={[
            {
              title: 'Adulto',
              items: [
                <><strong>Prima:</strong> nessuna ventilazione iniziale, si parte con 30 compressioni.</>,
                <><strong>Controllo:</strong> GAS, al massimo 10 secondi.</>,
                <><strong>Compressioni con:</strong> due mani, l’una sopra l’altra.</>,
                <><strong>Profondità:</strong> 5–6 cm.</>,
                <><strong>Aiuto:</strong> subito, appena accerti che non respira normalmente.</>,
              ],
            },
            {
              title: 'Bambino sopra 1 anno',
              items: [
                <><strong>Prima:</strong> 5 ventilazioni iniziali di 1 secondo, che facciano sollevare il torace.</>,
                <><strong>Controllo:</strong> MO.TO.RE dopo le ventilazioni, non più di 10 secondi; se ci sono segni di circolo, respirazione di soccorso, se mancano, compressioni.</>,
                <><strong>Compressioni con:</strong> una mano o due mani, quanto basta per una compressione adeguata.</>,
                <><strong>Profondità:</strong> circa 1/3 del torace, 5 cm.</>,
                <><strong>Aiuto:</strong> se sei solo, dopo circa 1 minuto di RCP (subito se hai visto il malore improvviso).</>,
              ],
            },
            {
              title: 'Bambino sotto 1 anno',
              items: [
                <><strong>Prima:</strong> 5 ventilazioni iniziali di 1 secondo, che facciano sollevare il torace.</>,
                <><strong>Controllo:</strong> MO.TO.RE dopo le ventilazioni, non più di 10 secondi; se ci sono segni di circolo, respirazione di soccorso, se mancano, compressioni.</>,
                <><strong>Compressioni con:</strong> 2 dita.</>,
                <><strong>Profondità:</strong> circa 1/3 del torace, 4 cm nei neonati.</>,
                <><strong>Aiuto:</strong> se sei solo, dopo circa 1 minuto di RCP (subito se hai visto il malore improvviso).</>,
              ],
            },
          ]}
        />
        <Callout kind="nota">
          <p>
            Una RCP pediatrica è adeguata quando ogni compressione abbassa il torace di circa <strong>1/3 della sua profondità</strong>.
          </p>
          <p>
            Per un bambino sotto 1 anno si usano <strong>2 dita</strong>; sopra 1 anno <strong>una mano o due mani</strong>, secondo quanto serve per una compressione adeguata (<strong>4 cm per i neonati, 5 cm per i bambini sopra 1 anno</strong>).
          </p>
          <p>Per saperne di più sul corso (P)BLSD, che tratta nel dettaglio le manovre di soccorso in età pediatrica, chiedi al tuo Istruttore DAN (Divers Alert Network).</p>
        </Callout>
      </Sub>

      <Sub id="maschere" title="L’uso di maschere per rianimazione e di protezioni per il viso" page="43–44">
        <p>Per la ventilazione artificiale è preferibile usare una maschera per rianimazione oppure una protezione (barriera) per il viso, anche del tipo usa e getta.</p>
        <Compare
          columns={[
            {
              title: 'Protezione per il viso',
              kind: 'attenzione',
              items: ['Semplice da usare.', 'Esiste anche in versione portatile, per esempio da portachiavi.', 'Si trova con o senza filtro protettivo. Entrambi i tipi offrono solo una protezione di base, ma è sempre meglio scegliere quella con filtro.'],
              footer: 'Consigliata, con filtro: protezione di base.',
            },
            {
              title: 'Maschera per rianimazione',
              kind: 'nota',
              items: [
                'Detta anche Pocket Mask, che però è un nome commerciale.',
                'È più sicura delle protezioni per il viso.',
                'È meno compatta, quindi scomoda da tenere in tasca; puoi però tenerla sempre pronta nel kit di primo soccorso, in uno zaino o in auto.',
                <>
                  Per usarla serve un addestramento specifico: lo trovi alla fine di questa sezione, nell’<a href="#maschera">abilità facoltativa</a>.
                </>,
              ],
              footer: 'La scelta più sicura.',
            },
          ]}
        />
        <div className="max-w-sm">
          <Figure file="img/maschera-tascabile-ventilazione.jpg" caption="Ventilazione con una maschera tascabile su un manichino: la maschera è tenuta aderente al viso con entrambe le mani, la testa è iperestesa." />
        </div>
        <Callout kind="attenzione">
          <p>Le barriere di fortuna (fazzoletti, garze, piccoli panni e simili) sono fortemente sconsigliate e possono risultare dannose.</p>
        </Callout>
        <Callout kind="nota">
          <p>Le ventilazioni si possono eseguire anche con il sistema pallone/maschera (tipo AMBU). È una tecnica molto valida, anche perché protegge il soccorritore da eventuali infezioni, ma richiede un apprendimento specifico che non fa parte di questo corso. Per informazioni sul corso DAN BVM (Bag Valve Mask) rivolgiti al tuo Istruttore DAN.</p>
        </Callout>
      </Sub>

      <Sub id="distensione" title="Distensione gastrica e rigurgito" page="44–45">
        <h3>Che cos’è e perché succede</h3>
        <p>Durante le ventilazioni può entrare aria nello stomaco: è la distensione gastrica, che può provocare rigurgito o vomito, cioè l’espulsione del contenuto dello stomaco.</p>
        <Compare
          columns={[
            { title: 'Vomito normale', kind: 'nota', items: ['Il contenuto dello stomaco viene spinto fuori dalla contrazione dei muscoli dello stomaco e del diaframma.'] },
            { title: 'Rigurgito da ventilazione', kind: 'attenzione', items: ['Non dipende dall’attività muscolare.', 'La pressione dentro lo stomaco aumenta, le pareti gastriche tornano indietro elasticamente e lo stomaco si svuota.'] },
          ]}
        />
        <p>Così il materiale gastrico risale dallo stomaco alla bocca, con un grave rischio che venga inalato nelle vie aeree.</p>

        <h3>Che cosa fare in caso di rigurgito</h3>
        <Callout kind="obbligo">
          <p>Metti la vittima sul fianco e liberale le vie aeree.</p>
        </Callout>
        <ul>
          <li>Una vittima incosciente non riesce a proteggere le proprie vie aeree, perché le mancano i normali riflessi fisiologici presenti quando si è coscienti.</li>
          <li>Anche dopo aver liberato le vie aeree, riprendendo le ventilazioni resta alto il rischio che il contenuto gastrico residuo raggiunga le vie aeree: per questo la distensione gastrica va evitata con cura.</li>
        </ul>

        <h3>Volume e pressione delle ventilazioni</h3>
        <ul>
          <li>
            Per non provocare rigurgito, ogni ventilazione dovrebbe avere un volume di circa <strong>500–600 ml</strong> (<strong>6–7 ml/kg</strong> di peso corporeo, riferito a un uomo di corporatura media).
          </li>
          <li>
            Anche ventilazioni troppo rapide e irruente possono causare distensione gastrica. Il motivo: il cardias, l’orifizio con funzione di valvola che collega l’esofago allo stomaco, si apre a una pressione di <strong>15–20 cm di H2O</strong>, un valore che durante le ventilazioni è facile raggiungere e superare.
          </li>
          <li>Inoltre, nelle vittime in ACC il cardias potrebbe non essere più continente.</li>
        </ul>
        <KeyFacts
          title="Per non mandare aria nello stomaco"
          items={[
            { label: 'Volume di ogni ventilazione', value: '500–600 ml', note: '6–7 ml/kg, uomo di corporatura media.' },
            { label: 'Durata di ogni ventilazione', value: 'circa 1 s' },
            { label: 'Il cardias si apre a', value: '15–20 cm H2O' },
          ]}
        />

        <h3>Come evitare la distensione gastrica</h3>
        <Callout kind="obbligo">
          <ul>
            <li>Esegui ventilazioni artificiali di circa 1 secondo, con un volume d’aria sufficiente a far espandere il torace della vittima.</li>
            <li>Evita ventilazioni troppo veloci, troppo energiche o troppo lunghe.</li>
            <li>Apri completamente le vie aeree.</li>
            <li>Aspetta che il torace torni alla posizione normale prima di dare la seconda ventilazione.</li>
            <li>Non esercitare alcuna pressione sullo stomaco.</li>
            <li>Controlla che lo stomaco non mostri segni di distensione.</li>
          </ul>
        </Callout>
      </Sub>

      <Sub id="dae" title="Defibrillazione precoce: la necessità di un DAE" page="45–46">
        <h3>Il sistema elettrico del cuore e le aritmie</h3>
        <ul>
          <li>Il cuore ha un proprio sistema elettrico, intrinseco e autonomo (pacemaker cardiaco), che fa contrarre il miocardio in modo continuo e ritmico e quindi mantiene il flusso del sangue.</li>
          <li>Per varie cause gli impulsi elettrici cardiaci possono diventare inefficaci o perdere la loro frequenza ritmica. Ne può derivare una condizione patologica, l’aritmia cardiaca, che in certe circostanze può provocare un Arresto Cardiaco Improvviso (ACI).</li>
          <li>
            Le aritmie più spesso associate a un arresto cardiaco improvviso sono la <strong>tachicardia ventricolare senza polso (TVSP)</strong> e la <strong>fibrillazione ventricolare (FV)</strong>: il ritmo diventa estremamente irregolare e caotico, il cuore non riesce più a fare da pompa e quindi a mantenere il flusso sanguigno.
          </li>
        </ul>
        <Figure caption="Schema: un ritmo organizzato e la fibrillazione ventricolare, il ritmo caotico in cui il cuore non pompa.">
          <div className="p-5">
            <Ecg />
          </div>
        </Figure>

        <h3>Perché serve il defibrillatore</h3>
        <ul>
          <li>Qualunque sia la causa, quando il cuore smette di battere è fondamentale ripristinarne il ritmo, e l’unico modo per farlo è usare un defibrillatore.</li>
          <li>La RCP sostiene la circolazione del sangue, ma non è in grado di ripristinare il ritmo cardiaco né di far ripartire un battito normale: questo è possibile soltanto con una defibrillazione precoce.</li>
          <li>La defibrillazione invia al cuore uno shock elettrico: è come un reset del sistema elettrico cardiaco.</li>
          <li>Lo shock ferma il cuore per pochi istanti (millisecondi) e permette al pacemaker cardiaco intrinseco di ricominciare a inviare impulsi organizzati, ristabilendo un ritmo normale.</li>
          <li>Se la defibrillazione è precoce, cioè avviene nei primissimi minuti dall’inizio della fibrillazione ventricolare, il tasso di sopravvivenza della vittima è molto alto.</li>
        </ul>

        <h3>Dal defibrillatore tradizionale al DAE</h3>
        <div className="flex items-start gap-5">
          <img src="/img/iso7010/e010-dae.svg" alt="Segnale di sicurezza ISO 7010 E010: defibrillatore automatico esterno" className="w-20 shrink-0 sm:w-24" />
          <p className="min-w-0">Oggi il DAE si riconosce da questo segnale verde. Ecco come si è arrivati a un apparecchio che può usare anche chi non è un sanitario.</p>
        </div>
        <Compare
          columns={[
            {
              title: 'Defibrillatore tradizionale',
              kind: 'attenzione',
              items: [
                'Poteva usarlo solo personale sanitario specializzato e formato, perché prima di dare uno shock bisognava saper riconoscere i ritmi cardiaci, cioè interpretare un elettrocardiogramma (ECG).',
                'Dare uno shock a un cuore che non è ancora in FV, per un’interpretazione sbagliata del ritmo, può comportare un rischio concreto di arresto.',
                'La formazione specialistica richiesta lo rendeva un dispositivo riservato al personale medico-sanitario, in ospedale come fuori.',
              ],
            },
            {
              title: 'DAE',
              kind: 'nota',
              items: [
                'Con il progresso della tecnologia sono nati i Defibrillatori Semi-Automatici e Automatici Esterni (DAE), che hanno semplificato la defibrillazione e ridotto enormemente tempi e complessità della formazione.',
                'L’interpretazione dell’ECG (l’analisi dell’attività elettrica del cuore) è automatica: la esegue un software interno all’apparecchio.',
                'Il DAE avvisa l’operatore quando rileva un ritmo defibrillabile. Se il ritmo non è defibrillabile, un messaggio vocale dice che lo shock non è consigliato e che bisogna riprendere la RCP.',
              ],
            },
          ]}
        />
        <p>
          Frequentando un corso BLS-D (BLS con defibrillazione) perfezioni le tue conoscenze di primo soccorso e offri a un eventuale infortunato una probabilità di sopravvivenza maggiore: <strong>fino al 40% in più</strong>.
        </p>
        <Callout kind="nota">
          <p>
            Il funzionamento del cuore e la defibrillazione automatica esterna sono descritti nel dettaglio nella <a href="/sezione/dae">Sezione 10, Defibrillazione automatica esterna e morte cardiaca improvvisa</a>.
          </p>
        </Callout>
      </Sub>

      <Sub id="abilita" title="Abilità pratiche di BLS: rianimazione (RCP)" page="47–50">
        <p>La procedura completa, un passo alla volta. Ogni passo riprende quello che hai visto finora nella sezione, con i dettagli delle manovre.</p>
        <Steps items={abilita} mode="stepper" label="Abilità pratiche di BLS: rianimazione" />
        <div id="mani" className="scroll-mt-24">
          <Stage title="Dove vanno le mani" hint="Trascina per ruotare, scegli un numero" footer="Braccia tese e perpendicolari: le spalle stanno sopra le mani, il peso del corpo fa la compressione.">
            <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
              <div>
                <ModelStage src="/models/torso.glb" target={[0, 0.55, 0]} distance={1.6} hotspots={mani} alt="Busto di un uomo visto di fronte, con un segno al centro del torace, sulla metà inferiore dello sterno, dove vanno le mani per le compressioni">
                  {/* three.js materials cannot read CSS tokens: this is the lume tone of ModelStage's rim light */}
                  <mesh position={[0, 0.57, 0.14]} renderOrder={2}>
                    <ringGeometry args={[0.035, 0.055, 40]} />
                    <meshBasicMaterial color="#d4f76a" depthTest={false} transparent />
                  </mesh>
                </ModelStage>
              </div>
              <div>
                <ModelStage src="/models/cpr-hands.glb" animate hide={['Cylinder']} className="h-[20rem]" alt="Due mani sovrapposte con le dita intrecciate che eseguono una compressione toracica e poi rilasciano" />
                <p className="mt-3 text-[0.95rem] text-well-soft">Eminenza tenar della mano sotto al centro del torace, l’altra mano sopra, dita incrociate. Dopo ogni compressione il torace risale del tutto, ma le mani non si staccano.</p>
              </div>
            </div>
          </Stage>
        </div>
      </Sub>

      <Sub id="maschera" title="Abilità facoltativa: l’uso di una maschera per rianimazione" page="51">
        <p>Se hai una maschera per rianimazione, ecco come usarla: otto passaggi.</p>
        <Steps items={maschera} mode="stepper" label="Uso della maschera per rianimazione" />
        <div className="max-w-sm">
          <Figure file="img/maschera-tascabile-posizionamento.png" caption="La maschera appoggiata sul viso copre naso e bocca: il riferimento per posizionarla è la radice del naso." />
        </div>
        <Callout kind="nota">
          <p>La maschera oro-nasale per rianimazione è un ottimo aiuto per la ventilazione: è una barriera efficace e in più permette di insufflare dalla bocca del soccorritore alla bocca e al naso della vittima (bocca soccorritore, bocca e naso vittima).</p>
        </Callout>
      </Sub>

      <Sub id="sequenza-completa" title="La sequenza completa: mettila alla prova" page="39–50">
        <p>Ora tutta la sequenza dell’adulto in un caso. A ogni punto scegli che cosa fare: se sbagli, leggi perché e riprova. Ogni caso segue una strada diversa (risponde, respira, non respira) e può riservarti imprevisti: un torace che non si alza, un rigurgito, un secondo soccorritore, un DAE.</p>
        <Stage title="Simulatore: sequenza BLS dell’adulto" hint="Tre percorsi da completare">
          <SequenceSim />
        </Stage>
        <Details title="Il riassunto operativo, punto per punto">
          <ol>
            <li>
              <strong>Sicurezza.</strong> Verifica che la scena sia sicura per te, per la persona infortunata e per i presenti. Se non lo è, non procedere finché non lo diventa.
            </li>
            <li>
              <strong>Coscienza.</strong> Scuoti delicatamente le spalle e chiedi ad alta voce «Stai bene?»; presentati (nome, addestramento, volontà di aiutare) e chiedi il permesso di aiutare.
              <ul>
                <li>Se risponde: lasciala nella posizione in cui si trova, evita che subisca altri danni, attiva il SME o chiedi aiuto se serve, rassicurala, cerca di capire che cosa è successo, tieni lontani gli astanti, ricontrollala regolarmente. Fine del ramo.</li>
                <li>Se non risponde: vai al punto 3.</li>
              </ul>
            </li>
            <li>
              <strong>Vie aeree.</strong> Mettila supina e apri le vie aeree con head tilt-chin lift: una mano sulla fronte per reclinare il capo, punta delle dita sotto il mento per sollevarlo.
            </li>
            <li>
              <strong>Respirazione (GAS).</strong> Tenendo aperte le vie aeree, guarda il torace, ascolta i rumori respiratori, senti l’aria sulla guancia, per al massimo 10 secondi. Respiro debole o gasping vuol dire respiro non normale; nel dubbio, consideralo non normale.
              <ul>
                <li>Se respira normalmente: posizione laterale di sicurezza (non se sospetti traumi a testa, collo o schiena), chiama o fai chiamare il SME, continua a controllare il respiro; se cambia, torna al punto 4. Fine del ramo.</li>
                <li>Se il respiro non è normale o è assente: vai al punto 5.</li>
              </ul>
            </li>
            <li>
              <strong>Allarme.</strong> Fai chiamare i soccorsi o chiama tu, dicendo che la vittima non respira; metti il telefono in vivavoce. Lascia la vittima solo se non c’è alternativa.
              <ul>
                <li>Se la vittima è un bambino o un annegato: prima 5 respirazioni assistite iniziali, poi 1 minuto di RCP prima di andare a cercare aiuto.</li>
              </ul>
            </li>
            <li>
              <strong>30 compressioni.</strong> In ginocchio a lato, su superficie rigida se possibile; eminenza tenar di una mano al centro del torace (parte inferiore dello sterno), l’altra mano sopra, dita incrociate, braccia tese e perpendicolari; profondità 5–6 cm; ritmo 100–120 al minuto; rilascio completo senza staccare le mani; compressione e rilascio 1:1.
            </li>
            <li>
              <strong>2 ventilazioni.</strong> Riapri le vie aeree, chiudi le narici (o usa la maschera oronasale), sigilla la bocca, soffia per circa 1 secondo guardando il torace salire, stacca la bocca e guarda il torace scendere, poi ripeti. Pausa totale nelle compressioni: non più di 5 secondi.
              <ul>
                <li>Se il torace non si solleva alla prima ventilazione: controlla la bocca e togli eventuali ostruzioni (niente esplorazioni alla cieca con le dita), ricontrolla inclinazione della testa e sollevamento del mento; in ogni caso non più di 2 tentativi prima di tornare alle compressioni.</li>
                <li>Se la vittima rigurgita: mettila sul fianco, libera le vie aeree, poi riprendi.</li>
                <li>Se non sei addestrato o non te la senti di ventilare: salta le ventilazioni ed esegui sole compressioni continue a 100–120 al minuto.</li>
              </ul>
            </li>
            <li>
              <strong>Ripeti il ciclo 30:2</strong> senza interruzioni, riposizionando subito le mani sullo sterno.
              <ul>
                <li>Se c’è un secondo soccorritore: datevi il cambio ogni 2 minuti, con un’interruzione minima.</li>
                <li>Se è disponibile un DAE: usalo, perché solo la defibrillazione precoce può ripristinare il ritmo; se il DAE segnala che lo shock non è consigliato, riprendi la RCP.</li>
              </ul>
            </li>
            <li>
              <strong>Fermati solo se</strong> arriva personale specializzato che prende il controllo, se la vittima comincia a muoversi, apre gli occhi e respira normalmente (e allora ricontrollala), o se sei esausto.
            </li>
          </ol>
        </Details>
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave" page="37–51">
        <p>Tutti i numeri della sezione, in un’unica tavola da ripassare prima delle domande.</p>
        <div className="grid gap-x-6 xl:grid-cols-2">
          {dati.map((g) => (
            <KeyFacts key={g.title} title={g.title} items={g.items} />
          ))}
        </div>
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="52">
        <p>Le risposte ufficiali sono a pagina 98 del manuale.</p>
        <Quiz id="rcp" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
