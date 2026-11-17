import { ModelStage } from '../components/three/ModelStage'
import { Callout, Compare, Figure, KeyFacts, Quiz, SectionPage, Stage, Sub } from '../components/ui'
import questions from '../data/quiz/11-scenari'
import { LesioneSpinale, SpostoONo } from '../widgets/s11/Decisioni'
import { TestaStabilizzata } from '../widgets/s11/Disegni'
import { Tecniche } from '../widgets/s11/Tecniche'

export default function Scenari() {
  return (
    <SectionPage
      slug="scenari"
      lead={
        <p>
          Scenari che il resto del manuale non tratta: quando lasciare un infortunato dove si trova, quando e come spostarlo, e come comportarti se sospetti una lesione spinale. Sono informazioni utili in un’emergenza, ma non ti abilitano a eseguire queste tecniche.
        </p>
      }
    >
      <Sub id="premessa" title="Premessa: a cosa serve questa sezione" page="99–100">
        <p>
          Nel manuale questa parte è la sezione «Scenari e tecniche particolari» e contiene un solo capitolo: «Muovere una persona infortunata» (p. 100).
        </p>
        <p>
          Il manuale non è un percorso completo di primo soccorso. Si ferma alle tecniche base di BLS/BLSD (Basic Life Support, anche con Defibrillazione) che servono a un soccorritore non sanitario per agire nel modo giusto su un adulto colpito da Arresto Cardiaco Improvviso, o in situazioni che ne mettono a rischio la vita.
        </p>
        <Compare
          columns={[
            {
              title: 'Il corso BLS/BLSD',
              kind: 'nota',
              items: [
                'Le tecniche base per un soccorritore non sanitario.',
                'Un adulto colpito da Arresto Cardiaco Improvviso, o in una situazione che ne mette a rischio la vita.',
                'Alle manovre BLS si aggiunge l’uso del Defibrillatore Automatico Esterno (DAE), quando rientra nel programma concordato con l’Istruttore DAN di riferimento.',
              ],
            },
            {
              title: 'Oltre il BLS/BLSD',
              kind: 'nota',
              items: [
                'Un corso completo di primo soccorso insegna anche ad aiutare persone infortunate o malate la cui vita non è direttamente in pericolo.',
                'DAN propone altri corsi di primo soccorso pensati per emergenze specifiche, per esempio l’Oxygen First Aid, legato in particolare all’ambito acquatico.',
              ],
            },
          ]}
        />
        <p>
          Le pagine che seguono presentano alcuni scenari particolari che il resto del manuale non affronta, ma che in un’emergenza possono tornare utili. Queste tecniche non fanno parte integrante del corso BLS/BLSD, e questa sezione, da sola, non ti abilita a metterle in pratica.
        </p>
        <Callout kind="attenzione">
          <p>DAN Europe raccomanda di frequentare un corso completo di First Aid, sia per approfondire questi temi sia per ottenere l’abilitazione all’uso di tecniche specifiche di primo soccorso.</p>
        </Callout>
      </Sub>

      <Sub id="muovere" title="Muovere una persona infortunata" page="100">
        <Compare
          columns={[
            {
              title: 'Regola generale: non spostare',
              kind: 'obbligo',
              items: [
                'Di norma una persona infortunata e cosciente va lasciata nella posizione in cui è stata trovata.',
                'A maggior ragione se sei sicuro che l’incidente abbia origine traumatica.',
                'A maggior ragione se sospetti una lesione della colonna vertebrale, della testa o del collo.',
              ],
            },
            {
              title: 'Quando può essere necessario spostarla',
              kind: 'attenzione',
              items: ['Per controllare se la vittima respira.', 'Per poterle prestare il primo soccorso.', 'Perché c’è un pericolo incombente: per esempio fuoco, crolli nelle vicinanze, traffico di veicoli, ecc.'],
            },
          ]}
        />
        <h3>Cosa valutare prima di spostarla</h3>
        <p>Prima di qualsiasi spostamento considera sempre tutti questi fattori insieme:</p>
        <ul>
          <li>il peso della vittima;</li>
          <li>il percorso da coprire;</li>
          <li>le tue condizioni e la tua esperienza di soccorritore;</li>
          <li>quanti soccorritori servono per agire in sicurezza.</li>
        </ul>
        <KeyFacts
          title="Da ricordare"
          items={[
            { label: 'Motivi che giustificano lo spostamento', value: '3', note: 'Controllare il respiro, prestare il primo soccorso, un pericolo incombente.' },
            { label: 'Fattori da valutare prima', value: '4', note: 'Peso, percorso, condizioni ed esperienza del soccorritore, numero di soccorritori.' },
          ]}
        />
        <Stage title="Sposto o non sposto?" hint="6 casi. Decidi, poi leggi perché.">
          <SpostoONo />
        </Stage>
      </Sub>

      <Sub id="tecniche" title="Tecniche di spostamento" page="100–101">
        <p>
          Il manuale descrive quattro tecniche: la tecnica Rautek, due trascinamenti (per le braccia e per i vestiti) e la manovra di rotazione, o Log Roll. Scegli una tecnica: trovi quando si usa e tutti i suoi passaggi. Premi un passo, o Avanti, e il disegno esegue il movimento: in blu il soccorritore, in grigio la vittima.
        </p>
        <Tecniche />
        <Figure file="img/spostamento-manovra-rautek.png" caption="La tecnica Rautek a vittima seduta: il soccorritore, alle sue spalle, passa le braccia sotto le ascelle, afferra l’avambraccio piegato e la solleva per trascinarla." />
        <KeyFacts
          title="Da ricordare"
          items={[
            { label: 'Passi della tecnica Rautek', value: '6', note: 'Testa bloccata alla mandibola e appoggiata alla tua spalla; sollevi con le gambe e la schiena dritta; vittima adagiata supina; se c’è pericolo, trascinamento sulla distanza minima.' },
            { label: 'Passaggi preparatori con vittima a terra', value: '5', note: 'Supina, in ginocchio all’altezza delle spalle, mano destra sotto il collo, mano sinistra sotto l’ascella sinistra, seduta con un unico movimento fluido.' },
            { label: 'Altre tecniche', value: '2', note: 'Trascinamento per le braccia oppure per i vestiti.' },
            { label: 'Passi del Log Roll', value: '6', note: 'Una mano su testa e collo, l’altra sul gomito più lontano; rotazione verso di te, prima sul fianco e poi sulla schiena.' },
          ]}
        />
      </Sub>

      <Sub id="tavola" title="Tavola per stabilizzazione" page="102">
        <ul>
          <li>La tavola spinale (back board) può essere utile quando c’è più di un soccorritore.</li>
          <li>Durante il trasporto blocca i movimenti della schiena e del collo.</li>
          <li>Di solito, però, chi presta il primo soccorso non ce l’ha a disposizione, e in ogni caso va usata nel modo corretto.</li>
        </ul>
        <Figure
          wide
          file="img/spostamento-tavola-spinale.png"
          caption="Più soccorritori lavorano insieme: girano la vittima sul fianco in blocco, con la testa sempre sorretta, e la sistemano sulla tavola spinale, numerati da 1 a 3."
        />
      </Sub>

      <Sub id="lesione-spinale" title="Gestione di una lesione spinale" page="102">
        <h3>Quando sospettarla</h3>
        <p>
          Quando soccorri la vittima di un incidente stradale o di una caduta dall’alto, spesso devi ipotizzare un trauma alla testa, al collo e/o alla schiena. In infortuni di questo tipo puoi trovarti davanti a una lesione spinale.
        </p>
        <h3>Che cos’è il midollo spinale</h3>
        <ul>
          <li>È contenuto nella colonna vertebrale.</li>
          <li>Fa parte del sistema nervoso centrale.</li>
          <li>Mette in comunicazione il cervello con il resto del corpo e regola le funzioni del sistema nervoso autonomo.</li>
          <li>Se viene danneggiato, la conseguenza può essere la paralisi.</li>
        </ul>
        <Stage title="La colonna vista da dietro" hint="Trascina per ruotare lo scheletro.">
          <ModelStage
            src="/models/skeleton.glb"
            alt="Scheletro umano adulto visto da dietro, con la colonna vertebrale dalla testa al bacino"
            rotation={[0, Math.PI, 0]}
            hotspots={[
              { at: [0, 1.08, 0.18], label: 'Testa', text: <p>Dopo un incidente stradale o una caduta dall’alto va spesso sospettato un trauma alla testa. Se la vittima è cosciente, tienile ferma la testa con le mani su entrambi i lati finché arriva il SME (Servizio Medico d’Emergenza).</p> },
              { at: [0, 0.92, 0.09], label: 'Collo', text: <p>Il sospetto di una lesione del collo è uno dei motivi per lasciare l’infortunato cosciente nella posizione in cui l’hai trovato.</p> },
              { at: [0, 0.56, 0.17], label: 'Midollo spinale', text: <p>È contenuto nella colonna vertebrale e fa parte del sistema nervoso centrale: mette in comunicazione il cervello con il resto del corpo e regola le funzioni del sistema nervoso autonomo. Se viene danneggiato può causare la paralisi.</p> },
              { at: [0, 0.34, 0.1], label: 'Colonna vertebrale', text: <p>Contiene il midollo spinale. Nel trasporto, la tavola spinale (back board) blocca i movimenti della schiena e del collo.</p> },
            ]}
          />
        </Stage>
        <h3>Perché non spostare</h3>
        <p>Proprio per questo è importante non muovere chi ha una sospetta lesione spinale: il movimento rischia di aggravarne le condizioni.</p>
        <h3>Come comportarsi, caso per caso</h3>
        <Compare
          columns={[
            { title: 'Vittima cosciente', kind: 'obbligo', items: ['Lasciala nella posizione in cui si trova.', 'Stabilizzale la testa tenendola ferma con le mani su entrambi i lati, in attesa che arrivi il SME.'] },
            { title: 'Vittima incosciente', kind: 'attenzione', items: ['Può essere necessario ruotarla sulla schiena per aprire le vie aeree, controllare il respiro o cominciare la RCP (rianimazione cardio-polmonare).', 'Quando devi farlo, riduci i movimenti al minimo.'] },
            {
              title: 'Vittima già sulla schiena',
              kind: 'obbligo',
              items: ['Apri le vie aeree come hai visto nel manuale.', 'Se respira: stabilizzale la testa, ma non metterla nella posizione laterale di sicurezza (PLS).', 'Se non respira: esegui la RCP come indicato nel manuale.'],
            },
          ]}
        />
        <Callout kind="divieto">
          <p>Con una sospetta lesione spinale non mettere in posizione laterale di sicurezza la vittima che respira: stabilizzale la testa.</p>
        </Callout>
        <Figure caption="Testa stabilizzata: inginocchiato dietro la testa della vittima, la tieni ferma con le mani ai due lati del capo.">
          <TestaStabilizzata />
        </Figure>
        <Stage title="Sospetta lesione spinale" hint="4 casi. Scegli l’azione corretta.">
          <LesioneSpinale />
        </Stage>
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave" page="100–102">
        <KeyFacts
          items={[
            { label: 'Questa sezione', value: 'informativa', note: 'Le tecniche non fanno parte del corso BLS/BLSD e non ti abilitano a eseguirle. DAN Europe consiglia un corso completo di First Aid; tra gli altri corsi DAN c’è l’Oxygen First Aid, per esempio per l’ambito acquatico.' },
            { label: 'Infortunato cosciente', value: 'resta dov’è', note: 'Soprattutto se il trauma è certo e si sospetta una lesione di colonna vertebrale, testa o collo.' },
            { label: 'Motivi per spostare', value: '3', note: 'Verificare il respiro, prestare primo soccorso, pericolo incombente (fuoco, crolli vicini, traffico di veicoli, ecc.).' },
            { label: 'Fattori da valutare prima', value: '4', note: 'Peso della vittima, percorso, condizioni ed esperienza del soccorritore, numero di soccorritori necessari.' },
            { label: 'Tecnica Rautek', value: '6 passi', note: 'Da terra, prima 5 passaggi preparatori.' },
            { label: 'Altre tecniche', value: '2', note: 'Trascinamento per le braccia oppure per i vestiti.' },
            { label: 'Log Roll', value: '6 passi', note: 'Con due soccorritori uno immobilizza la testa; serve anche a girare sul fianco una persona supina per liberare le vie aeree dai liquidi.' },
            { label: 'Tavola spinale (back board)', value: 'più soccorritori', note: 'Impedisce i movimenti di schiena e collo nel trasporto; di solito non è disponibile nel primo soccorso; va usata correttamente.' },
            { label: 'Lesione spinale', value: 'paralisi', note: 'Da sospettare in incidenti stradali e cadute dall’alto: un danno al midollo spinale può causare paralisi.' },
            { label: 'Sospetta lesione spinale e respira', value: 'testa ferma, no PLS', note: 'Se non respira: RCP.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di autoverifica" page="99–102">
        <p>Queste domande non vengono dal manuale: sono state scritte per il corso, basandosi solo sul testo delle pp. 99–102.</p>
        <Quiz id="scenari" questions={questions} title="Domande di autoverifica" />
      </Sub>
    </SectionPage>
  )
}
