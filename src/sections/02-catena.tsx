import { Callout, Compare, Figure, FlipCards, KeyFacts, Quiz, SectionPage, Stage, Sub } from '../components/ui'
import questions from '../data/quiz/02-catena'
import { OrderGame } from '../widgets/s01/OrderGame'
import { CallSim } from '../widgets/s02/CallSim'
import { ChainExplorer, ChainRow, links } from '../widgets/s02/Chain'
import { SurvivalSlider } from '../widgets/s02/SurvivalSlider'

const scrambledLinks = ['rcp', 'als', 'chiamata', 'defibrillazione'].map((id) => {
  const l = links.find((x) => x.id === id)!
  return { id: l.id, text: l.title }
})

export default function Catena() {
  return (
    <SectionPage
      slug="catena"
      lead={
        <p>
          Una rianimazione funziona quando quattro azioni si susseguono senza buchi: riconoscere l’arresto e chiamare il SME (Servizio Medico di Emergenza), iniziare la RCP (rianimazione cardio-polmonare), defibrillare, affidare la persona al supporto vitale avanzato (SVA, in inglese ALS, Advanced Life Support). Qui impari l’ordine degli anelli e cosa dire quando chiami.
        </p>
      }
    >
      <Sub id="anelli" title="I 4 anelli" page="17">
        <p>
          Una rianimazione efficace si sviluppa in 4 fasi. Se ognuna viene eseguita nel modo corretto, il tasso di sopravvivenza della vittima può migliorare. Queste 4 fasi si chiamano comunemente i 4 anelli della <strong>catena di sopravvivenza</strong>, e vanno in quest’ordine:
        </p>
        <ol>
          <li>primo anello: riconoscimento e allertamento precoce, cioè la chiamata di emergenza;</li>
          <li>secondo anello: RCP precoce;</li>
          <li>terzo anello: defibrillazione precoce;</li>
          <li>quarto anello: supporto avanzato alle funzioni vitali di base.</li>
        </ol>
        <p>Scegli un anello per leggere che cosa ti chiede.</p>
        <ChainExplorer />
      </Sub>

      <Sub id="riconoscimento" title="Riconoscimento precoce e allerta del Servizio Medico di Emergenza (SME)" page="17–18">
        <Figure caption="Primo anello: riconoscimento e allertamento precoce, chiamata di emergenza.">
          <ChainRow active={0} />
        </Figure>

        <h3>Perché chiamare subito</h3>
        <div className="flex items-start gap-5">
          <img src="/img/iso7010/e004-telefono-emergenza.svg" alt="Segnale di sicurezza: telefono di emergenza" className="w-20 shrink-0" />
          <ul className="min-w-0">
            <li>Capire che un dolore al torace ha origine cardiaca e chiamare il SME permette ai soccorsi di arrivare il prima possibile, e questo migliora le probabilità di sopravvivenza della vittima.</li>
            <li>In Italia il SME si allerta con il numero unico di emergenza 1-1-2: così il servizio può mandare al più presto mezzi e personale sanitario addestrato.</li>
          </ul>
        </div>

        <h3>Se sei solo</h3>
        <p>Se sei da solo e hai un cellulare, attiva il vivavoce o usa qualunque strumento che ti lasci le mani libere, per esempio gli auricolari: così puoi cominciare subito le manovre di soccorso.</p>
        <Callout kind="obbligo" title="Prima il SME, poi la RCP">
          <p>Anche se per dare l’allarme devi allontanarti dalla vittima, la priorità resta la stessa: prima attivi il SME, poi inizi la Rianimazione Cardio-Polmonare (RCP).</p>
        </Callout>

        <h3>Riconoscere l’arresto cardiaco</h3>
        <p>
          Per non perdere tempo devi capire il problema il prima possibile. Le linee guida e le raccomandazioni ILCOR (International Liaison Committee on Resuscitation) ed ERC (European Resuscitation Council) sul BLS (Basic Life Support) indicano due elementi chiave per riconoscere l’arresto cardiaco:
        </p>
        <ul>
          <li>l’assenza di coscienza;</li>
          <li>la respirazione anormale.</li>
        </ul>
        <Callout kind="attenzione" title="Due segni che ingannano">
          <ul>
            <li>Un respiro lento e faticoso, il respiro agonico, è un segno di arresto cardiaco. È proprio il respiro agonico l’ostacolo più grande al riconoscimento dell’arresto.</li>
            <li>All’inizio dell’arresto cardiaco può esserci anche una breve fase di movimenti simili a convulsioni.</li>
          </ul>
        </Callout>
        <Callout kind="obbligo" title="Quando le convulsioni finiscono, valuta sempre">
          <p>Se la vittima non risponde e non respira, oppure respira in modo anormale, inizia la RCP.</p>
        </Callout>

        <h3>Come fare la chiamata</h3>
        <p>Chi chiama il SME deve restare calmo, raccontare con chiarezza che cosa è successo e rispondere alle domande dell’operatore di sala operativa. Al SME vanno comunicati:</p>
        <ul>
          <li>il proprio nome;</li>
          <li>il luogo esatto dell’emergenza;</li>
          <li>la dinamica dell’incidente, cioè che cosa è accaduto;</li>
          <li>il numero delle persone coinvolte;</li>
          <li>le condizioni delle persone coinvolte (per esempio: incastrate in un’automobile);</li>
          <li>il tipo di soccorso prestato.</li>
        </ul>
        <Stage title="Chiamata al 112" hint="Componi la comunicazione, poi termina la chiamata">
          <CallSim />
        </Stage>
        <h4>Altre indicazioni</h4>
        <ul>
          <li>Se hai incaricato un’altra persona di chiamare il SME, dille in modo esplicito di tornare subito da te a confermare che la chiamata è stata fatta.</li>
          <li>Chi chiama il numero unico di emergenza deve rispondere in modo preciso alle domande dell’operatore di sala operativa.</li>
        </ul>
        <Callout kind="nota">
          <p>Ricorda sempre: prima chiami, prima arrivano i soccorsi.</p>
        </Callout>
      </Sub>

      <Sub id="rcp-precoce" title="RCP precoce" page="18">
        <Figure caption="Secondo anello: RCP precoce.">
          <ChainRow active={1} />
        </Figure>
        <ul>
          <li>Un BLS iniziato subito aumenta di molto le possibilità di sopravvivenza.</li>
          <li>La Rianimazione Cardiopolmonare (RCP) fa parte del protocollo BLS: è una tecnica di rianimazione in cui si alternano compressioni toraciche e ventilazioni, cioè respiri assistiti.</li>
          <li>BLS e RCP servono a evitare danni agli organi vitali, mantenendo in circolo sangue ossigenato, anche se solo in parte.</li>
          <li>Le compressioni toraciche sostituiscono per un certo tempo la funzione del cuore.</li>
          <li>La ventilazione assistita porta O2 ai polmoni, così negli alveoli può avvenire lo scambio dei gas.</li>
        </ul>
        <p>
          In un arresto cardiaco improvviso le possibilità di sopravvivenza calano di <strong>circa il 10% per ogni minuto</strong> che passa dall’evento. Sposta il cursore per vedere che cosa significa.
        </p>
        <SurvivalSlider />
      </Sub>

      <Sub id="defibrillazione" title="Defibrillazione precoce" page="19">
        <Figure caption="Terzo anello: defibrillazione precoce.">
          <ChainRow active={2} />
        </Figure>
        <div className="flex items-start gap-5">
          <img src="/img/iso7010/e010-dae.svg" alt="Segnale di sicurezza: defibrillatore DAE" className="w-20 shrink-0" />
          <p className="min-w-0">
            I Defibrillatori Semiautomatici Esterni (DAE) sono sempre più diffusi e accessibili nella comunità, e questo ha portato benefici evidenti sulla sopravvivenza negli arresti cardiaci extra ospedalieri (OHCA, Out-of-hospital cardiac arrest).
          </p>
        </div>
        <ul>
          <li>Nella maggior parte dei casi un arresto respiratorio è causato da un Arresto Cardio-Circolatorio (ACC).</li>
          <li>L’arresto cardiaco è spesso dovuto a ritmi anomali, detti maligni: la fibrillazione ventricolare (FV) o la tachicardia ventricolare senza polso (TVSP).</li>
          <li>Sono disturbi elettrici del cuore che fanno “fascicolare” il muscolo cardiaco: si contrae in modo scoordinato, con un ritmo caotico e anormale.</li>
          <li>In queste condizioni il cuore non riesce più a pompare il sangue in modo efficace.</li>
        </ul>
        <Compare
          columns={[
            { title: 'Cosa fa la RCP', kind: 'nota', items: ['Non può far ripartire il cuore.', 'Ritarda i danni agli organi causati dalla mancanza di O2.'] },
            { title: 'Cosa fa il defibrillatore', kind: 'obbligo', items: ['È l’unico in grado di agire sul ritmo cardiaco.', 'Permette la ripresa del circolo, il ROSC (Return of spontaneous circulation).'] },
          ]}
        />
        <p>Per questo è cruciale defibrillare una persona in ACC improvviso entro 3-5 minuti dal collasso: può portare il tasso di sopravvivenza fino al 50-70%.</p>
        <KeyFacts
          items={[
            { label: 'Defibrillare entro', value: '3-5 minuti', note: 'Dal collasso, in caso di ACC improvviso.' },
            { label: 'Sopravvivenza possibile', value: 'fino al 50-70%', note: 'Se la defibrillazione arriva entro quel tempo.' },
          ]}
        />
      </Sub>

      <Sub id="als" title="Supporto vitale avanzato precoce (SVA, ALS)" page="19">
        <Figure caption="Quarto anello: supporto avanzato alle funzioni vitali di base.">
          <ChainRow active={3} />
        </Figure>
        <ul>
          <li>RCP e defibrillazione, anche se eseguite bene, potrebbero non avere un esito favorevole.</li>
          <li>In caso di ACC serve sempre il ricorso a interventi sanitari avanzati, l’Advanced Life Support (ALS).</li>
          <li>Durante l’ALS si eseguono manovre di soccorso specialistiche, come la gestione avanzata delle vie aeree e la somministrazione di farmaci: tutto questo può aumentare il successo della rianimazione.</li>
          <li>Se la RCP e/o la defibrillazione riescono, l’ALS stabilizza l’infortunato perché possa essere trasportato all’ospedale più vicino.</li>
        </ul>
        <Callout kind="nota">
          <p>Ricorda: senza la tua chiamata al SME, l’Advanced Life Support non arriva.</p>
        </Callout>
        <Stage title="Rimetti in ordine la catena" hint="Trascina dalla maniglia o usa le frecce">
          <p className="mb-4 text-well-soft">I quattro anelli sono mescolati. Mettili nell’ordine in cui li esegui.</p>
          <OrderGame
            label="I quattro anelli della catena di sopravvivenza"
            items={scrambledLinks}
            answer={links.map((l) => l.id)}
            solved={<p>Nota come il primo anello sblocca il quarto: senza la chiamata al SME, l’ALS non arriva.</p>}
          />
        </Stage>
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave" page="17–19">
        <KeyFacts
          items={[
            { label: 'Anelli della catena di sopravvivenza', value: '4', note: 'Le fasi di una rianimazione efficace.' },
            { label: 'Numero unico di emergenza', value: '1-1-2', note: 'Così in Italia si allerta il SME.' },
            { label: 'Elementi per riconoscere l’arresto', value: '2', note: 'Assenza di coscienza e respirazione anormale (ILCOR ed ERC).' },
            { label: 'Informazioni da dare al SME', value: '6', note: 'Nome, luogo esatto, dinamica, numero dei coinvolti, loro condizioni, soccorso prestato.' },
            { label: 'Calo della sopravvivenza', value: 'circa 10% al minuto', note: 'Dopo un arresto cardiaco improvviso.' },
            { label: 'Componenti della RCP', value: '2', note: 'Compressioni toraciche e ventilazioni, alternate.' },
            { label: 'Ritmi maligni frequenti', value: '2', note: 'FV e TVSP.' },
            { label: 'Defibrillare entro', value: '3-5 minuti', note: 'Dal collasso.' },
            { label: 'Sopravvivenza raggiungibile', value: '50-70%', note: 'Con la defibrillazione entro quel tempo.' },
          ]}
        />
        <h3>Le sigle della sezione</h3>
        <p>Gira le carte per ripassarle.</p>
        <FlipCards
          items={[
            { front: 'SME', back: 'Servizio Medico di Emergenza: in Italia si allerta con il 112.' },
            { front: 'RCP', back: 'Rianimazione Cardio-Polmonare: compressioni toraciche alternate a ventilazioni.' },
            { front: 'BLS', back: 'Basic Life Support, il supporto di base alla vita. La RCP fa parte del suo protocollo.' },
            { front: 'DAE', back: 'Defibrillatore Semiautomatico Esterno.' },
            { front: 'OHCA', back: 'Out-of-hospital cardiac arrest: arresto cardiaco extra ospedaliero.' },
            { front: 'ACC', back: 'Arresto Cardio-Circolatorio: nella maggior parte dei casi è la causa di un arresto respiratorio.' },
            { front: 'FV', back: 'Fibrillazione ventricolare: un ritmo anomale (maligno) che causa spesso l’arresto cardiaco.' },
            { front: 'TVSP', back: 'Tachicardia ventricolare senza polso: l’altro ritmo maligno frequente.' },
            { front: 'ROSC', back: 'Return of spontaneous circulation: la ripresa del circolo, che solo il defibrillatore può consentire.' },
            { front: 'SVA / ALS', back: 'Supporto vitale avanzato, Advanced Life Support: il quarto anello, con gestione avanzata delle vie aeree e farmaci.' },
            { front: 'ILCOR', back: 'International Liaison Committee on Resuscitation: con l’ERC indica come riconoscere l’arresto cardiaco.' },
            { front: 'ERC', back: 'European Resuscitation Council: il manuale segue le sue linee guida 2021.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="20">
        <p>Le risposte ufficiali sono a p. 98 del manuale.</p>
        <Quiz id="catena" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
