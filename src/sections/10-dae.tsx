import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router'
import { Callout, Checklist, Compare, Details, Figure, FlipCards, KeyFacts, Quiz, SectionPage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/10-dae'
import { AedSimulator } from '../widgets/s10/AedSimulator'
import { ChoiceCards } from '../widgets/s10/ChoiceCards'
import { Conduction } from '../widgets/s10/Conduction'
import { Coronary } from '../widgets/s10/Coronary'
import { CardiacOutput, HeartModels } from '../widgets/s10/Heart'
import { AedModel, PadPlacement, TorsoPads } from '../widgets/s10/PadPlacement'
import { ALGO, FIGURE_STEPS, KEY_FACTS } from '../widgets/s10/pageData'
import { RhythmLab, ShockableStrips, ShockDrill } from '../widgets/s10/Rhythms'
import { RiskSort } from '../widgets/s10/RiskSort'
import { GUASTI, LEGALE, SICUREZZA, ULTERIORI } from '../widgets/s10/situations'
import { SurvivalTime } from '../widgets/s10/SurvivalTime'

const FLOW = ['Non risponde e non respira normalmente', 'Chiama il 118/112', 'Esegui 30 compressioni toraciche', 'Esegui 2 ventilazioni', 'Continua la RCP 30:2', 'Appena il DAE è disponibile, accendilo e segui le istruzioni']

const CAUSES = [
  { front: 'Patologia coronarica', back: 'Le malattie delle coronarie, le arterie che portano sangue al muscolo cardiaco.' },
  { front: 'Squilibri elettrolitici', back: 'Fra gli elettroliti, sodio, potassio e magnesio regolano la funzione nervosa e muscolare e concorrono a mantenere il normale equilibrio acido-base e l’equilibrio idrico.' },
  { front: 'Commotio cordis', back: 'Un trauma diretto al muscolo cardiaco.' },
  { front: 'Ipossia', back: 'Per esempio in caso di annegamento o di soffocamento.' },
  { front: 'Lesioni del sistema nervoso centrale', back: 'Lesioni di cervello o midollo spinale.' },
  { front: 'Farmaci e droghe', back: 'Anche farmaci e droghe sono fra le cause di aritmia.' },
  { front: 'Elettrocuzioni', back: 'Le folgorazioni.' },
  { front: 'Ipotermia', back: 'La temperatura del corpo troppo bassa (vedi i pazienti ipotermici, più avanti).' },
]

const MAINTENANCE = [
  { id: 'autotest', label: 'Auto-test: nessun avviso acustico o visivo di carica insufficiente o di altre anomalie' },
  { id: 'batteria', label: 'Batteria: carica sufficiente per un soccorso completo, verificata dagli avvisi acustici e/o visivi' },
  { id: 'scadenze', label: 'Scadenze delle parti consumabili (elettrodi e batteria): sostituite subito se scadute o usurate' },
  { id: 'dotazioni', label: 'Dotazioni di base presenti: guanti monouso, forbici, rasoio idoneo, telino per pulire il torace' },
  { id: 'dopo-elettrodi', label: 'Dopo l’uso: elettrodi sostituiti e carica residua della batteria verificata' },
  { id: 'dopo-dpi', label: 'Dopo l’uso: DPI e accessori monouso ripristinati (guanti, maschera di rianimazione oronasale, ecc.)' },
  { id: 'dopo-riponi', label: 'Dopo l’uso: unità riassemblata e riposta, di nuovo pronta all’uso (se serve, contatta il fornitore)' },
  { id: 'tecnico', label: 'Controlli avanzati elettronici eseguiti da tecnici autorizzati, all’intervallo fissato dal costruttore' },
]

export default function Dae() {
  return (
    <SectionPage
      slug="dae"
      lead={
        <p>
          Quando il ritmo elettrico del cuore diventa caotico, il sangue smette di circolare e ogni minuto conta. Qui impari come funziona il cuore, perché arriva l’arresto cardiaco improvviso e come si usa in sicurezza un defibrillatore automatico esterno (DAE), fino a provarlo nel simulatore.
        </p>
      }
    >
      <Sub id="cuore" title="Il cuore" page="79">
        <h3>Che cos’è e dove si trova</h3>
        <p>
          Il cuore è un organo muscolare cavo: è il motore dell’apparato circolatorio, ciò che spinge il sangue. Sta nel torace, in mezzo ai due polmoni, dentro uno spazio virtuale che si chiama mediastino. Lo avvolge il pericardio, un sacco di sottile tessuto connettivale grazie al quale il cuore si contrae con un attrito ridotto al minimo.
        </p>
        <p>La sua posizione è obliqua: un terzo sta a destra dello sterno e due terzi a sinistra, più o meno all’altezza della linea immaginaria che unisce i due capezzoli.</p>
        <HeartModels />

        <h3>Il cuore come pompa</h3>
        <ul>
          <li>Il cuore è una pompa muscolare potente.</li>
          <li>A riposo la frequenza cardiaca media è di circa 70-75 battiti al minuto (bpm).</li>
          <li>La gittata sistolica, cioè il sangue che il ventricolo sinistro espelle a ogni contrazione (sistole), è di circa 70 mL.</li>
          <li>La gittata cardiaca è gittata sistolica per frequenza cardiaca media: circa 5 litri al minuto (0,07 L × 70 bpm), all’incirca tutto il volume di sangue del corpo.</li>
          <li>Durante l’attività fisica la gittata cardiaca può diventare il doppio o il triplo, secondo l’intensità dello sforzo.</li>
        </ul>
        <CardiacOutput />

        <h3>Camere e circolazione</h3>
        <p>
          Il cuore è fatto di due sezioni separate, ciascuna con due camere. L’<strong>atrio</strong> è la camera superiore: accoglie il sangue che arriva dal corpo oppure dai polmoni. Il <strong>ventricolo</strong> è la camera inferiore: si riempie con il sangue che scende dall’atrio sopra di esso. Le pompe lavorano per contrazione muscolare e spingono il sangue fuori dalle camere.
        </p>
        <Compare
          columns={[
            { title: 'Ventricolo sinistro', items: ['Manda il sangue ossigenato a tutto l’organismo', 'Circolazione sistemica: il grande circolo'] },
            { title: 'Ventricolo destro', items: ['Manda ai polmoni il sangue povero di ossigeno, quello che ritorna al cuore', 'Circolazione polmonare: il piccolo circolo'] },
          ]}
        />
        <p>Anche il muscolo cardiaco ha bisogno di sangue: lo riceve da una rete di arterie, le coronarie.</p>
        <KeyFacts
          items={[
            { label: 'Cuore a destra e a sinistra dello sterno', value: '1/3 e 2/3' },
            { label: 'Frequenza media a riposo', value: '70-75 bpm' },
            { label: 'Gittata sistolica', value: '≈ 70 mL' },
            { label: 'Gittata cardiaca', value: '≈ 5 L/min', note: 'In attività il doppio o il triplo.' },
            { label: 'Sezioni e camere', value: '2 × 2' },
          ]}
        />
      </Sub>

      <Sub id="conduzione" title="Il sistema di conduzione del cuore" page="80">
        <p>
          Il cuore ha un proprio sistema di conduzione elettrica: un tessuto che genera un impulso elettrico e lo porta dagli atri ai ventricoli, producendo la contrazione muscolare che serve a perfondere di sangue tutto l’organismo. La sua proprietà davvero unica è che produce gli impulsi in modo autonomo.
        </p>
        <p>
          L’impulso nasce nel <strong>nodo seno-atriale (NSA)</strong>, nell’atrio destro, attraversa gli atri, passa nel <strong>nodo atrio-ventricolare (NAV)</strong> e scende lungo il <strong>fascio comune di His</strong> fino alle <strong>fibre di Purkinje</strong>, il tratto terminale del sistema, che lo portano al resto del muscolo cardiaco, cioè ai ventricoli. Il NSA è il pacemaker cardiaco principale: in condizioni normali gli impulsi partono da lì.
        </p>
        <p>
          Il NAV è il punto in cui gli impulsi passano dagli atri ai ventricoli: fa da filtro e difende il ventricolo dalle aritmie atriali. Se il NSA non genera gli impulsi in modo corretto, per esempio nel blocco atrioventricolare, il NAV lo rimpiazza: è un pacemaker “di scappamento”, con un automatismo più lento, che mantiene l’attività elettrica del cuore e protegge dall’asistolia (assenza di contrazione). Segui il percorso passo per passo, poi guasta il NSA.
        </p>
        <Conduction />
        <Figure file="img/anatomia-sistema-conduzione.png" caption="Il tessuto di conduzione, in giallo, isolato dal resto del cuore: dal nodo del seno (NSA) al nodo atrioventricolare (NAV), al fascio di His e alle fibre di Purkinje." />
        <Callout kind="nota" title="Senza stimolo, niente pompa">
          <p>In assenza di vie accessorie il sistema di conduzione è l’unico collegamento elettrico tra atri e ventricoli, perché lo scheletro fibroso li isola elettricamente. Se lo stimolo elettrico viene a mancare, manca anche l’attività di pompa del cuore.</p>
        </Callout>
      </Sub>

      <Sub id="aritmie" title="Le aritmie cardiache" page="80">
        <p>
          L’elettrocardiogramma (ECG) di un cuore sano mostra un ritmo ben riconoscibile, il <strong>ritmo sinusale (RS)</strong>. Il RS si propaga lungo le arterie e produce la pulsazione che senti palpando il polso, per esempio radiale, carotideo e femorale. Le <strong>aritmie</strong> sono ritmi anomali che possono impedire al cuore di pompare in modo efficace.
        </p>
        <p>Le cause di aritmia sono numerose: il manuale ne elenca otto. Gira le carte per leggere l’esempio di ciascuna.</p>
        <FlipCards items={CAUSES} />
      </Sub>

      <Sub id="arresto" title="L’arresto cardiaco improvviso" page="81–82">
        <h3>Patologia coronarica e infarto</h3>
        <p>
          Le malattie delle coronarie sono la prima causa sia dell’infarto, chiamato anche “attacco cardiaco”, sia dell’arresto cardiaco. L’infarto avviene quando una o più coronarie si chiudono: nel loro lume si accumula materiale (per esempio grasso, come nelle placche ateromasiche, dette anche aterosclerotiche, oppure piccoli trombi) che riduce o blocca di colpo il flusso di sangue, e il muscolo cardiaco a valle va incontro a ischemia. Guarda come succede.
        </p>
        <Coronary />
        <p>L’infarto non è per forza mortale: le conseguenze dipendono da quanto è estesa la zona di muscolo rimasta senza ossigeno. Molte persone colpite da attacco cardiaco recuperano completamente la funzione.</p>
        <Figure wide file="img/anatomia-aterosclerosi.png" caption="Come progredisce l’aterosclerosi: dalla lesione iniziale alla lesione complicata, mentre il lume dell’arteria si restringe sempre di più." />

        <h3>Dall’ipossia alla fibrillazione ventricolare</h3>
        <p>
          L’ipossia del cuore può alterare il suo segnale elettrico: il ritmo sinusale può trasformarsi in un ritmo caotico, la <strong>fibrillazione ventricolare (FV)</strong>. Nella FV il muscolo dei ventricoli si contrae in modo non coordinato e il sangue non circola più. Il cuore si contrae in modo del tutto disorganizzato e ne deriva l’<strong>arresto cardiaco improvviso (ACI)</strong>: il cuore smette di battere di colpo. La FV è l’aritmia più comunemente associata all’ACI.
        </p>

        <h3>Dimensioni del problema</h3>
        <p>L’ACI è una delle principali cause di morte, e la causa più frequente di morte cardiaca improvvisa è la patologia coronarica.</p>
        <KeyFacts
          title="Dimensioni del problema"
          items={[
            { label: 'ACI in Italia ogni anno', value: '> 60.000', note: 'Persone colpite. Fonte IRC (Italian Resuscitation Council).' },
            { label: 'Vittime di arresto cardiaco in Europa', value: '≈ 400.000', note: 'Fonte ERC (European Resuscitation Council).' },
            { label: 'Decessi cardiovascolari da morte cardiaca improvvisa', value: '60-70%' },
            { label: 'Incidenza massima', value: '45-75 anni', note: 'Con netta prevalenza nel sesso maschile.' },
          ]}
        />

        <h3>Che cosa succede</h3>
        <p>
          Di norma l’ACI nasce da un’anomalia del sistema elettrico del cuore, che non gli permette di battere correttamente. L’aritmia che più spesso lo precede è la FV: i ventricoli non si contraggono in modo efficace, il cuore fibrilla e il ritmo perde la sua regolarità. Il flusso di sangue al cervello cala al punto che la persona perde coscienza e collassa. Se non si interviene subito, in genere la vittima è destinata a morire.
        </p>

        <h3>Fattori di rischio e segni premonitori</h3>
        <p>
          Di solito l’ACI arriva con poco o nessun preavviso. Quando però è legato a un infarto, che può esserne la causa, ci sono segni premonitori importanti da saper riconoscere. Prima distingui da solo i fattori di rischio dai segni premonitori, poi controlla gli elenchi completi.
        </p>
        <RiskSort />
        <Compare
          columns={[
            {
              title: 'Fattori di rischio associati all’ACI',
              kind: 'attenzione',
              items: ['Fumo di sigaretta', 'Ipertensione', 'Ipercolesterolemia', 'Obesità', 'Diabete', 'Vita sedentaria', 'Abuso di alcol', 'Predisposizione familiare alle coronaropatie', 'Anamnesi positiva per cardiopatia', 'Un precedente attacco di cuore o arresto cardiaco', 'Età avanzata', 'Sesso maschile', 'Uso di droghe come cocaina e anfetamine', 'Squilibri nutrizionali, per esempio bassi livelli di sali minerali nel sangue'],
            },
            {
              title: 'Segni premonitori (ACI da infarto)',
              kind: 'attenzione',
              items: ['Dolore, oppure senso di pressione o di schiacciamento (oppressione), al centro del torace, dietro lo sterno', 'Dolore e fastidio a spalla, braccio, collo o mandibola', 'Difficoltà a respirare', 'Sudorazione', 'Sensazione di intensa difficoltà digestiva', 'Nausea e vomito'],
            },
          ]}
        />
      </Sub>

      <Sub id="defibrillazione" title="La defibrillazione" page="82–83">
        <h3>Scopo</h3>
        <p>
          La defibrillazione serve a riorganizzare l’attività elettrica caotica della fibrillazione ventricolare o della tachicardia ventricolare senza polso, per riportare il cuore a un ritmo normale. Dopo lo shock erogato dal defibrillatore, il nodo SA o un’altra zona del cuore può riprendere il comando del sistema elettrico intrinseco e autonomo (pacemaker cardiaco).
        </p>

        <h3>Due gruppi di ritmi dell’arresto cardiaco</h3>
        <p>Rispetto alla defibrillazione, i ritmi cardiaci associati all’arresto si dividono in due grandi gruppi.</p>
        <Compare
          columns={[
            { title: 'Ritmi defibrillabili', kind: 'obbligo', items: ['Si trattano con lo shock elettrico', 'Fibrillazione ventricolare (FV)', 'Tachicardia ventricolare senza polso (TVSP)'] },
            {
              title: 'Ritmi non defibrillabili',
              kind: 'divieto',
              items: [
                'I DAE non li rilevano, non rispondono agli shock elettrici esterni e richiedono cure mediche rianimatorie avanzate',
                'Attività elettrica senza polso (AESP, o PEA dall’inglese pulseless electric activity): attività elettrica molto debole e del tutto inefficace per la funzione di pompa; di solito precede l’asistolia',
                'Asistolia: assenza completa di attività elettrica nel cuore',
              ],
            },
          ]}
        />
        <ShockableStrips />
        <div className="grid gap-x-6 sm:grid-cols-2">
          <Figure file="img/ecg-fibrillazione-ventricolare.png" caption="Una FV reale su carta millimetrata: onde irregolari e caotiche, senza complessi riconoscibili." />
          <Figure file="img/ecg-tachicardia-ventricolare.png" caption="Una tachicardia ventricolare reale: complessi larghi, regolari e molto ravvicinati." />
        </div>

        <h3>FV e TVSP all’arrivo sulla scena</h3>
        <ul>
          <li>Se arrivi presto sulla scena di un arresto cardiaco, è molto probabile trovare una FV oppure una TVSP.</li>
          <li>La TV senza polso è un ritmo che spesso precede la FV.</li>
          <li>La TVSP compare quando una zona del muscolo ventricolare scarica impulsi a grande velocità e si sostituisce al pacemaker dominante.</li>
          <li>Con l’aumento della frequenza il ventricolo ha meno tempo per riempirsi di sangue: cala la gittata cardiaca, cioè la capacità del cuore di pompare sangue, e di conseguenza scende la pressione sistemica.</li>
          <li>
            Se la pressione scende troppo si instaura uno stato di shock (vedi la <Link to="/sezione/shock">Sezione 9</Link>), con perdita di coscienza e assenza di polso.
          </li>
        </ul>

        <h3>Come agisce lo shock</h3>
        <p>
          La defibrillazione invia uno shock elettrico attraverso elettrodi applicati sul torace, disposti in modo che la scarica attraversi il cuore. Lo shock azzera il pacemaker intrinseco del cuore: ne ferma l’attività elettrica per un tempo brevissimo, pochi millisecondi, e gli permette di ripartire con un ritmo normale.
        </p>

        <h3>Il fattore tempo</h3>
        <p>Con una defibrillazione precoce, cioè nei primissimi minuti dall’inizio della FV/TVSP, il tasso di sopravvivenza della vittima è molto alto. Ogni minuto di ritardo nella defibrillazione riduce la possibilità di sopravvivenza del 7-10%.</p>
        <SurvivalTime />

        <h3>Il ruolo della RCP</h3>
        <p>
          Una buona rianimazione cardiopolmonare (RCP) è un intervento fondamentale e comune a entrambi i ritmi defibrillabili: per questo imparare a eseguirla correttamente è di primaria importanza. La RCP riesce a ossigenare il sangue e a farlo circolare, ma non può ripristinare il ritmo cardiaco riportandolo a una frequenza normale.
        </p>
        <p>
          Sui risultati della RCP fuori dall’ospedale esistono poche statistiche affidabili. Secondo l’American Heart Association (AHA) e l’International Liaison Committee on Resuscitation (ILCOR), in chi presenta una FV/TVSP la RCP iniziata prontamente e la defibrillazione precoce, unite a cure rapide e specializzate, possono portare a una sopravvivenza a lungo termine fino al 40%.
        </p>
        <Callout kind="nota" title="Punto fondamentale del corso">
          <p>I DAE sono efficaci nel trattare l’ACI in qualunque ambiente, e le abilità che impari si possono trasferire a ogni situazione.</p>
        </Callout>
        <KeyFacts
          items={[
            { label: 'Ogni minuto di ritardo nella defibrillazione', value: '−7-10%', note: 'Di possibilità di sopravvivenza.' },
            { label: 'Sopravvivenza a lungo termine nella FV/TVSP', value: 'fino al 40%', note: 'RCP pronta, defibrillazione precoce, cure rapide e specializzate (AHA, ILCOR).' },
            { label: 'Pausa del pacemaker intrinseco', value: 'millisecondi' },
          ]}
        />
      </Sub>

      <Sub id="ecg" title="L’elettrocardiogramma dei DAE" page="83–84">
        <p>
          L’ECG è l’esame che studia l’attività elettrica del cuore. Gli impulsi che nascono nel cuore attraversano i tessuti e arrivano alla superficie del corpo, dove elettrodi appositi applicati sulla cute possono captarne l’energia elettrica. I segnali elettrici del cuore hanno un voltaggio molto basso: per questo l’elettrocardiografo incorporato nei DAE deve amplificarli.
        </p>
        <p>Durante la rilevazione con un DAE possono comparire <strong>artefatti</strong>, provocati da:</p>
        <ul>
          <li>movimenti della vittima o dei soccorritori;</li>
          <li>tremori muscolari;</li>
          <li>elettrodi usurati o di scarsa qualità;</li>
          <li>elettrodi staccati o applicati male;</li>
          <li>interferenze con apparecchiature elettriche o elettroniche.</li>
        </ul>
        <Callout kind="nota">
          <p>I DAE amplificano anche ogni altro segnale elettrico captato dagli elettrodi, il cosiddetto artefatto. Riduci quindi al minimo qualsiasi movimento e ogni fonte estranea di disturbo: potrebbe confondere o nascondere l’attività elettrica del cuore e impedire al DAE di valutarla correttamente.</p>
        </Callout>
        <RhythmLab />
        <div className="grid gap-x-6 sm:grid-cols-2">
          <Figure file="img/ecg-ritmo-sinusale.png" caption="Un ritmo sinusale reale su carta millimetrata: regolare e ben riconoscibile." />
          <Figure file="img/ecg-asistolia.png" caption="Un’asistolia reale: una linea quasi piatta, senza attività elettrica." />
        </div>
        <p>Ora prova a decidere come farebbe il DAE: shock consigliato o no?</p>
        <ShockDrill />
      </Sub>

      <Sub id="dispositivo" title="Il defibrillatore automatico esterno o DAE" page="84–85">
        <h3>Che cos’è</h3>
        <p>
          Un defibrillatore automatico esterno è un dispositivo che manda al cuore di una persona in arresto cardiaco improvviso una scarica elettrica ad alto voltaggio. L’erogazione di questa scossa si chiama defibrillazione: nell’ACI serve a riportare il cuore al ritmo normale.
        </p>
        <Callout kind="nota" title="Non serve essere formati per salvare una vita">
          <p>I defibrillatori sono intuitivi: chi soccorre non deve per forza essere formato per riuscire a salvare una vita. In genere sono molto facili da usare: danno istruzioni vocali che ti accompagnano passo dopo passo per tutto l’intervento, spesso con l’aiuto di infografiche e pittogrammi.</p>
        </Callout>
        <div className="grid gap-x-6 sm:grid-cols-2 sm:items-start">
          <Figure caption="Il segnale che identifica una postazione DAE: un cuore attraversato da una saetta, con una croce, su fondo verde. Può essere completato da frecce direzionali.">
            <div className="flex items-center justify-center gap-5 p-8">
              <img src="/img/iso7010/e010-dae.svg" alt="Segnale ISO 7010 E010: defibrillatore, cuore con saetta e croce su fondo verde" className="w-28" />
              <img src="/img/iso7010/e-freccia-condizione-sicura-2.svg" alt="Freccia direzionale verde" className="w-20" />
            </div>
          </Figure>
          <Figure file="img/dae-teca-pubblica.jpg" caption="Una postazione DAE pubblica: la teca a parete, segnalata dal cuore con la saetta, custodisce il defibrillatore." />
        </div>

        <h3>Come si avvia e come lavora</h3>
        <Steps
          items={[
            { title: 'Accendi', body: <p>Secondo il modello disponibile, sollevi il coperchio oppure premi il pulsante di accensione.</p> },
            { title: 'Apri le piastre', body: <p>Il dispositivo ti chiede di aprire rapidamente la confezione di plastica delle piastre e di applicarle sul torace nudo della vittima.</p> },
            { title: 'Applica le piastre nelle posizioni corrette', body: <p>Appena le placche sono collegate, il DAE comincia ad analizzare il ritmo. I disegni stampati sulle piastre ti aiutano a capire dove vanno.</p> },
            { title: 'Il DAE analizza il ritmo', body: <p>Cerca un’eventuale condizione irregolare e riconosce da solo se il ritmo richiede uno shock elettrico.</p> },
            { title: 'Se serve la scarica', body: <p>Il DAE ti dice di premere il pulsante dedicato; con un DAE completamente automatico non premi nulla. Lo shock può riportare il cuore a un ritmo normale.</p> },
            { title: 'Se «non è richiesta nessuna scarica»', body: <p>La vittima non può essere defibrillata: continua la RCP e aspetta le nuove istruzioni del dispositivo, che arrivano dopo 2 minuti con l’analisi del ritmo. In ogni caso prosegui fino all’arrivo dei servizi di emergenza.</p> },
          ]}
        />
        <Figure file="img/dae-aperto-piastre.jpg" caption="Un DAE aperto, modello da addestramento: nel coperchio le istruzioni illustrate, sotto le due piastre adesive già collegate al cavo." />
        <AedModel />

        <h3>Automatico e semiautomatico</h3>
        <Compare
          columns={[
            { title: 'DAE semiautomatico', kind: 'obbligo', items: ['Segnala all’operatore che la scarica è necessaria', 'L’operatore la eroga premendo l’apposito pulsante'] },
            { title: 'DAE completamente automatico', kind: 'nota', items: ['Gestisce l’erogazione della scarica senza alcun intervento dell’utente', 'Dà pochi secondi di preavviso prima dello shock', 'Non si preme nulla'], footer: 'Nel simulatore più avanti puoi provare tutti e due.' },
          ]}
        />
      </Sub>

      <Sub id="rcp" title="A proposito di RCP" page="85–86">
        <p>
          La RCP è fondamentale nel soccorso: RCP e uso del DAE fanno parte della catena di sopravvivenza in ogni evento. Gli anelli della catena sono 4 e devono essere tutti collegati correttamente per dare la migliore possibilità di sopravvivenza (vedi anche la <Link to="/sezione/catena">Sezione 2</Link>).
        </p>
        <Steps
          label="I 4 anelli della catena di sopravvivenza"
          items={[
            { title: 'Riconoscimento e accesso precoce al Servizio Medico di Emergenza (SME)', body: <p>È la richiesta di aiuto. L’accesso precoce al SME è indispensabile, perché una persona con il cuore fermo ha bisogno per forza di cure mediche professionali precoci.</p> },
            { title: 'RCP precoce', body: <p>Assicura un flusso di sangue ossigenato finché non è disponibile un DAE e previene la morte dei tessuti. I tessuti del sistema nervoso centrale (cervello e midollo spinale) cominciano a morire dopo appena 4-5 minuti senza flusso.</p> },
            { title: 'Defibrillazione precoce', body: <p>Resetta il sistema di conduzione elettrico del cuore (pacemaker intrinseco) e gli permette di ricominciare a battere normalmente. Nella maggior parte dei casi il ritmo di presentazione dell’arresto è la FV, che di solito dura solo pochi minuti; poi l’attività elettrica si interrompe del tutto (asistolia). Perciò, prima si defibrilla, maggiori sono le possibilità di sopravvivenza.</p> },
            { title: 'Supporto vitale avanzato precoce: Advanced Life Support (ALS)', body: <p>L’ALS è l’insieme delle manovre mediche rianimatorie che, con la somministrazione di farmaci e con procedure terapeutiche avanzate, aumenta in modo significativo le probabilità di sopravvivenza della vittima di ACI.</p> },
          ]}
        />
        <Callout kind="obbligo" title="La RCP va sempre portata avanti">
          <ul>
            <li>fino a quando arriva il DAE;</li>
            <li>fino a quando il DAE è installato e pronto all’uso, se i soccorritori sono più di uno;</li>
            <li>dopo uno shock rimasto senza risposta (*);</li>
            <li>dopo l’avviso di shock non erogabile, se la vittima non respira normalmente (*);</li>
            <li>se il dispositivo non è disponibile.</li>
          </ul>
          <p>(*) Si esegue la RCP per due minuti, poi il DAE fa automaticamente una nuova analisi. Il DAE aiuta i soccorritori a rispettare i tempi e indica loro che cosa fare.</p>
        </Callout>
        <KeyFacts
          items={[
            { label: 'Anelli della catena', value: '4' },
            { label: 'Sistema nervoso centrale senza flusso', value: '4-5 min', note: 'Poi i tessuti cominciano a morire.' },
            { label: 'RCP dopo shock senza risposta o shock non erogabile', value: '2 min', note: 'Poi nuova analisi automatica.' },
          ]}
        />
      </Sub>

      <Sub id="blsd" title="Prestare soccorso con un DAE (BLSD)" page="86–88">
        <h3>Principio</h3>
        <p>
          Aggiungere il defibrillatore alle procedure di Basic Life Support (BLS) non cambia in modo significativo la risposta all’emergenza. Continui a seguire l’algoritmo ABC che hai già imparato (A, Airways: vie aeree; B, Breathing: respirazione; C, Circulation: circolazione) e al BLS aggiungi semplicemente una “D”, che sta per defibrillazione: il BLSD.
        </p>
        <Figure caption="Algoritmo BLSD adulto: la sequenza da seguire, dal riconoscimento all’arrivo del DAE.">
          <ol className="mx-auto grid max-w-sm justify-items-center gap-1 p-6">
            {FLOW.map((f, i) => (
              <li key={f} className="grid w-full justify-items-center gap-1">
                <span className="w-full rounded-chip bg-must px-4 py-3 text-center font-bold leading-snug text-on-sign">{f}</span>
                {i < FLOW.length - 1 && <ArrowDown className="size-5 text-must" aria-hidden />}
              </li>
            ))}
          </ol>
        </Figure>

        <h3>Prima del DAE</h3>
        <Steps
          items={[
            { title: 'Valuta la sicurezza', body: <p>Soccorritore, vittima ed eventuali astanti devono essere al sicuro.</p> },
            {
              title: 'Esegui la sequenza BLS per adulti',
              body: (
                <ul>
                  <li>Se la vittima è incosciente o non respira normalmente, chiedi aiuto: manda qualcuno a chiamare il numero unico di emergenza (112/118) e a cercare e portare un DAE, se ce n’è uno.</li>
                  <li>Se sei solo, allerta il 112/118 con il tuo cellulare, in vivavoce.</li>
                  <li>Lascia la vittima soltanto se non esiste alcuna altra possibilità.</li>
                </ul>
              ),
            },
            { title: 'Inizia la RCP', body: <p>Secondo la sequenza BLS per adulti.</p> },
            { title: 'Se sei solo e il DAE è vicinissimo', body: <p>Se sei solo, sei stato testimone dell’evento e un DAE si trova nelle immediate vicinanze, comincia collegando il dispositivo.</p> },
          ]}
        />

        <h3>Appena il DAE è disponibile</h3>
        <Steps
          items={[
            {
              title: 'Accendi subito il DAE e scopri il torace',
              body: (
                <ul>
                  <li>Può essere necessario tagliare gli indumenti.</li>
                  <li>Il torace deve essere asciutto: se serve, asciugalo e puliscilo.</li>
                </ul>
              ),
            },
            { title: 'Con più soccorritori la RCP continua', body: <p>Mentre si applicano gli elettrodi al torace.</p> },
            {
              title: 'Esegui le istruzioni vocali e/o visive del DAE',
              body: (
                <>
                  <ul>
                    <li>Estrai gli elettrodi dalla confezione sigillata.</li>
                    <li>Collocali sul torace nudo della vittima.</li>
                    <li>Applicali con cura seguendo i pittogrammi: destra e sinistra sono quelle della vittima.</li>
                  </ul>
                  <ol className="list-decimal pl-5">
                    <li>Un elettrodo sulla parte destra del torace, subito sotto la clavicola e a destra dello sterno.</li>
                    <li>L’altro sul fianco sinistro del torace, subito sotto il muscolo pettorale (uomo) o subito sotto la mammella (donna).</li>
                  </ol>
                </>
              ),
            },
            { title: 'Verifica che gli elettrodi siano collegati al DAE', body: <p>Il connettore delle piastre deve essere inserito.</p> },
            { title: 'Il DAE analizza il ritmo', body: <p>Non appena gli elettrodi sono collegati al torace.</p> },
            { title: 'Nessuno tocca la vittima', body: <p>Accertati che nessuna persona e nessuna attrezzatura sia a contatto con la vittima.</p> },
          ]}
        />
        <PadPlacement />
        <Figure file="img/dae-piastre-applicate.jpg" caption="Durante un corso: le piastre sul torace scoperto, una sotto la clavicola destra e una sul fianco sinistro, con il DAE da addestramento accanto." />
        <TorsoPads />
        <Callout kind="attenzione">
          <ul>
            <li>La posizione degli elettrodi può scostarsi di qualche centimetro, ma deve essere il più possibile corretta. Fai aderire perfettamente la parte adesiva delle piastre premendole con il palmo della mano.</li>
            <li>ILCOR suggerisce di collocare le piastre sul torace nudo in posizione antero-laterale; la posizione antero-posteriore è un’alternativa accettabile.</li>
            <li>Se i seni sono abbondanti, è ragionevole mettere l’elettrodo sinistro lateralmente oppure sotto il seno sinistro, evitando il tessuto mammario.</li>
          </ul>
        </Callout>

        <h3>Dopo l’analisi</h3>
        <Compare
          columns={[
            {
              title: 'Se lo shock è consigliato',
              kind: 'obbligo',
              items: [
                'Verifica che nessuno tocchi la vittima, controllandola dalla testa ai piedi, e dichiara «Via io, via voi, via tutti» oppure, più semplicemente, «Tutti via, allontanatevi».',
                'Eroga lo shock premendo il pulsante di scarica; i DAE completamente automatici lo erogano da soli, con un preavviso di alcuni secondi.',
                'Subito dopo la scarica riprendi immediatamente la RCP con rapporto 30:2.',
                'Prosegui secondo i comandi vocali e/o visivi.',
              ],
            },
            { title: 'Se lo shock non è consigliato', kind: 'obbligo', items: ['Riprendi immediatamente la RCP con rapporto 30:2.', 'Prosegui secondo i comandi vocali e/o visivi.'] },
          ]}
        />
        <h3>Fino a quando</h3>
        <p>Continui a seguire i comandi del DAE finché:</p>
        <ul>
          <li>arriva un soccorso più qualificato (ALS);</li>
          <li>la vittima riprende a respirare normalmente;</li>
          <li>sei esausto.</li>
        </ul>
        <Callout kind="attenzione">
          <ul>
            <li>Subito dopo un singolo shock, se mancano ritmo cardiaco o respirazione, riprendi la RCP (30:2) per 2 minuti prima di erogare un altro shock, se indicato.</li>
            <li>Se il ritmo cardiaco è stato ripristinato, continuare per qualche istante le compressioni toraciche non aumenta la possibilità che la FV ricompaia.</li>
            <li>Quando la vittima torna a respirare normalmente, mettila se necessario in posizione laterale di sicurezza e lascia il DAE collegato e acceso. Continua a controllare la respirazione e a verificare eventuali nuove indicazioni del defibrillatore.</li>
          </ul>
        </Callout>
      </Sub>

      <Sub id="passaggio-sme" title="Passaggio al SME" page="88">
        <Compare
          columns={[
            { title: 'Mentre aspetti l’ALS', kind: 'obbligo', items: ['Continua a controllare l’ABC', 'Lascia il DAE acceso e collegato'] },
            { title: 'Quando arriva l’ALS', kind: 'nota', items: ['Ti può essere chiesto di proseguire la RCP mentre l’équipe si prepara', 'L’équipe può usare gli elettrodi già applicati, oppure toglierli e usare quelli della propria attrezzatura ALS'] },
          ]}
        />
        <p>È importante fare un breve rapporto sulle manovre eseguite, così che il personale specializzato possa trattare la vittima di conseguenza. I dati da comunicare sono cinque:</p>
        <ol>
          <li>natura dell’evento (in immersione, fuori dall’acqua, trauma, eccetera);</li>
          <li>condizioni iniziali della vittima, se le conosci;</li>
          <li>manovre effettuate;</li>
          <li>condizioni attuali;</li>
          <li>tempo (stimato) trascorso dall’arresto cardiaco.</li>
        </ol>
        <p>Nel simulatore qui sotto, alla fine, il rapporto si compila con i dati della tua scena.</p>
      </Sub>

      <Sub id="simulatore" title="Algoritmo DAE" page="89–90">
        <p>La figura del manuale “BLSD: algoritmo di utilizzo del DAE su un adulto” è una sequenza lineare, senza bivi. Scorrila passo per passo.</p>
        <Steps mode="stepper" label="Algoritmo di utilizzo del DAE su un adulto" items={FIGURE_STEPS.map((s) => ({ title: s.title, body: <p>{s.body}</p> }))} />
        <p>
          Il simulatore unisce questa sequenza alla procedura scritta delle pagine 85-88, con i due rami (shock consigliato o no) e il ciclo dei 2 minuti di RCP. A ogni istruzione scegli che cosa fai. Il DAE parla in italiano dopo che lo accendi: puoi spegnere la voce e leggere tutto nella trascrizione. Con la regia scegli il ritmo della prossima analisi e fai arrivare l’ALS, respirare la vittima o fermarti per esaurimento.
        </p>
        <AedSimulator />
        <Callout kind="attenzione" title="Regole che valgono in ogni momento">
          <ul>
            <li>Il ciclo analisi, shock (se consigliato), RCP si ripete: dopo ogni singolo shock, o dopo ogni avviso di shock non consigliato, seguono 2 minuti di RCP 30:2 prima della nuova analisi.</li>
            <li>Toccare la vittima durante l’analisi o la scarica è un errore di sicurezza.</li>
            <li>Movimenti o disturbi durante l’analisi generano artefatti e la interrompono: «analisi interrotta», fermare tutti i movimenti.</li>
            <li>Se la RCP prosegue per qualche istante dopo il ripristino del ritmo non è un errore: non aumenta la possibilità che la FV ricompaia.</li>
          </ul>
        </Callout>
        <Details title="Il flusso completo dell’algoritmo, stato per stato">
          <p>Ricostruito unendo la figura delle pp. 89–90 con la procedura scritta delle pp. 85–88. I messaggi vocali fra virgolette sono indicativi: il manuale riporta testualmente solo «non è richiesta nessuna scarica» e le frasi di allontanamento, e non indica valori di energia in joule.</p>
          <ol className="!list-none !pl-0 space-y-3">
            {ALGO.map((a) => (
              <li key={a.n}>
                <p className="font-bold">
                  {a.n}. {a.name}
                </p>
                <p>
                  {a.when} {a.act} <span className="text-ink-soft">Poi: {a.next}.</span>
                </p>
              </li>
            ))}
          </ol>
        </Details>
      </Sub>

      <Sub id="manutenzione" title="Manutenzione del DAE" page="90–91">
        <Callout kind="attenzione">
          <p>La manutenzione regolare è necessaria perché il DAE funzioni correttamente in un’emergenza. Per i controlli periodici segui sempre le indicazioni del costruttore, che possono cambiare da un modello all’altro.</p>
        </Callout>
        <ul>
          <li>
            <strong>Auto-test.</strong> I DAE moderni eseguono periodicamente un auto-test che controlla le condizioni generali del dispositivo e della batteria; se la carica è insufficiente o emergono altre anomalie, emettono un avviso acustico e/o visivo specifico.
          </li>
          <li>
            <strong>Batteria.</strong> Qualunque sia la marca o il modello, tieni sempre sotto controllo lo stato di carica: deve bastare per un soccorso completo. Lo verifichi in qualsiasi momento con un semplice controllo degli eventuali avvisi acustici e/o visivi.
          </li>
          <li>
            <strong>Scadenze.</strong> Controlla periodicamente la data di scadenza delle parti consumabili, per esempio elettrodi e batteria, e sostituiscile subito se sono scadute o usurate.
          </li>
          <li>
            <strong>Dotazioni di base.</strong> Guanti monouso, forbici, rasoio idoneo e telino per pulire il torace dovrebbero far parte integrante della dotazione del DAE; una volta usati vanno sostituiti subito.
          </li>
        </ul>
        <Callout kind="divieto" title="Non accendere il DAE per il controllo visivo">
          <p>Il controllo visivo si fa sempre a dispositivo spento, per non consumare inutilmente la batteria e non rischiare di saturare la memoria interna.</p>
        </Callout>
        <h3>Dopo l’uso</h3>
        <ul>
          <li>Sostituisci gli elettrodi e verifica che la carica residua della batteria sia sufficiente.</li>
          <li>Ripristina i dispositivi di protezione individuale (DPI) e tutti gli altri accessori monouso (guanti, maschera di rianimazione oronasale, ecc.).</li>
          <li>Riassembla l’unità e riponila in modo che sia di nuovo pronta all’uso. Se serve, contatta il fornitore del DAE.</li>
        </ul>
        <h3>Controlli avanzati</h3>
        <p>I controlli avanzati di tipo elettronico li eseguono sempre tecnici autorizzati, con un intervallo in genere fissato dal costruttore nel manuale di istruzioni che, per legge, accompagna sempre il DAE.</p>
        <h4>La tua lista di controllo</h4>
        <Checklist id="s10-manutenzione" items={MAINTENANCE} columns={2} />
      </Sub>

      <Sub id="sicurezza" title="Considerazioni sulla sicurezza nell’utilizzo di un DAE" page="91">
        <ul>
          <li>Collega il DAE soltanto a una vittima di ACC (arresto cardiocircolatorio): non cosciente, senza respiro efficace.</li>
          <li>Non toccare la vittima né durante l’analisi del ritmo né durante l’erogazione dello shock.</li>
          <li>Controlla visivamente la vittima e di’ ad alta voce «Allontanatevi, state tutti lontani» oppure «Via io, via voi, via tutti».</li>
          <li>Togli la vittima dall’acqua e asciugale il torace (vedi “Ulteriori considerazioni”).</li>
          <li>Se possibile, sistema la vittima su una superficie rigida: i DAE si possono usare su superfici metalliche, umide e bagnate.</li>
          <li>Non applicare gli elettrodi sopra cerotti medicali: toglili e pulisci il torace prima. Durante la defibrillazione i cerotti possono provocare scintille o bruciare.</li>
          <li>Togli dal torace qualsiasi altro oggetto, per garantire un buon contatto degli elettrodi.</li>
          <li>Durante la defibrillazione possono prodursi scintille che, con concentrazioni elevate di ossigeno (O2), possono causare un incendio o gravi scottature. Il rischio si riduce togliendo la maschera a ossigeno dal viso della vittima e ponendola ad almeno 1 metro dal torace.</li>
          <li>Sul torace villoso gli elettrodi possono aderire male: può servire depilare rapidamente le zone di applicazione, ma se manca un rasoio non si deve ritardare la defibrillazione. Tieni sempre un rasoio nell’unità DAE.</li>
        </ul>
        <p>Mettiti alla prova: per ogni situazione scegli che cosa fai.</p>
        <ChoiceCards cards={SICUREZZA} label="Sicurezza nell’uso del DAE: scegli che cosa fai" />
      </Sub>

      <Sub id="ulteriori" title="Ulteriori considerazioni" page="91–93">
        <p>Ambienti bagnati, ipotermia, bambini, dispositivi impiantati e trasporto: per ogni situazione scegli il comportamento corretto, poi leggi la regola del manuale. Con “Mostra tutte le regole” le rileggi tutte insieme.</p>
        <KeyFacts
          items={[
            { label: 'Ipotermia: temperatura interna', value: '< 30 °C' },
            { label: 'DAE standard', value: '> 8 anni' },
            { label: 'Elettrodi o modalità pediatrica', value: '1-8 anni' },
            { label: 'Sotto 1 anno', value: 'molto raro', note: 'Accettabile quando nessun’altra opzione è praticabile.' },
            { label: 'Elettrodi da pacemaker o defibrillatore impiantato (ICD)', value: '≥ 8 cm' },
          ]}
        />
        <ChoiceCards cards={ULTERIORI} label="Situazioni particolari: scegli che cosa fai" />
        <Figure file="img/pacemaker-radiografia-torace.jpg" caption="Radiografia del torace con un pacemaker sotto la clavicola sinistra: nell’immagine appare a destra perché è a sinistra del paziente. Gli elettrodi del DAE vanno ad almeno 8 cm dal dispositivo." />

        <h3>Risoluzione dei problemi</h3>
        <p>
          La maggior parte dei DAE segnala la natura del problema rilevato e dà indicazioni per risolverlo. Mantieni la calma e ascolta la guida vocale. I problemi più comuni riguardano gli elettrodi: per ognuno scegli il rimedio.
        </p>
        <ChoiceCards cards={GUASTI} label="Risolvi il guasto: scegli il rimedio" />
        <KeyFacts items={[{ label: 'Radio e cellulari dall’unità DAE', value: '≥ 2 m', note: 'Circa 6 piedi.' }]} />
      </Sub>

      <Sub id="legale" title="Aspetti legali sul DAE" page="93–94">
        <ul>
          <li>Negli ultimi anni sono state approvate varie leggi che favoriscono la diffusione dei DAE, considerati unanimemente dispositivi salvavita.</li>
          <li>Norme recenti di alcune nazioni rendono obbligatoria la presenza di DAE in determinati ambienti, per esempio centri commerciali, scuole e in generale luoghi affollati.</li>
          <li>Le stesse norme prevedono che il DAE possa essere usato anche da persone del tutto profane in materia di BLSD, quando sul luogo dell’evento non ci sono sanitari né laici addestrati.</li>
          <li>In molte nazioni la legge stabilisce inoltre che l’Operatore Sanitario che risponde al numero di emergenza nazionale guidi a distanza, per telefono e con indicazioni dirette, l’astante non addestrato disposto a eseguire la manovra.</li>
          <li>Molti paesi riconoscono lo “stato di necessità” a chi usa un DAE senza essere addestrato: non è punibile chi ha commesso il fatto perché costretto dalla necessità di salvare sé o altri dal pericolo di un danno grave alla persona.</li>
          <li>Non risultano casi di soccorritori laici perseguiti per aver prestato cure con un DAE.</li>
          <li>Molte nazioni applicano il “principio del buon samaritano”, che tutela i soccorritori che prestano assistenza volontariamente senza avere l’obbligo legale di farlo.</li>
        </ul>
        <Callout kind="nota" title="La posizione di DAN Europe">
          <p>DAN Europe è fermamente convinta che l’uso del DAE sia un passaggio imprescindibile nel primo soccorso alle vittime di arresto cardiaco. I DAE sono già presenti in molti luoghi extra-ospedalieri e la loro presenza è fondamentale per ridurre l’incidenza della morte per cause cardiache.</p>
        </Callout>
        <ChoiceCards cards={LEGALE} label="Aspetti legali: vero o falso" />
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave della sezione">
        <p>Tutti i numeri della sezione in una sola tavola, da ripassare prima delle domande.</p>
        <KeyFacts title="Defibrillazione e morte cardiaca improvvisa: da sapere" items={KEY_FACTS} />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="95–97">
        <Quiz id="dae" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
