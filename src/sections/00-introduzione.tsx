import { Callout, Checklist, Figure, FlipCards, KeyFacts, SectionPage, Sub } from '../components/ui'
import { IdanNetwork } from '../widgets/s00/IdanNetwork'
import { Roadmap } from '../widgets/s00/Roadmap'
import { objectives, TagChip, TopicFilter } from '../widgets/s00/Topics'

export default function Introduzione() {
  return (
    <SectionPage
      slug="introduzione"
      lead={
        <p>
          Prima di cominciare: chi è DAN Europe (Divers Alert Network Europe), come è costruito il corso BLS-D in tre tappe, che cosa imparerai e che cosa serve per ottenere il brevetto e tenerlo valido.
        </p>
      }
    >
      <Sub id="servizi" title="I servizi DAN a colpo d’occhio" page="8">
        <p>DAN mette a disposizione dei subacquei cinque servizi. Gira ogni carta per vedere dove ne parla la pagina successiva.</p>
        <FlipCards
          items={[
            { front: 'Corsi di primo soccorso', back: 'Vedi “La formazione”: primo soccorso con ossigeno, BLS(D), emergenze in luoghi remoti, corsi speciali, programmi per medici e personale sanitario d’emergenza.' },
            { front: 'Progetti di ricerca medico-subacquea', back: 'Vedi “La ricerca scientifica”: con il Diving Safety Laboratory i subacquei partecipano fornendo dati da immersioni reali.' },
            { front: 'Consulenza medica', back: 'Vedi “Chi è DAN Europe” e “La rete internazionale”: consulenza medica specialistica disponibile a qualunque latitudine.' },
            { front: 'Accesso esclusivo ai piani assicurativi', back: 'Vedi “Vantaggi per gli iscritti”: piani assicurativi su misura, pensati per chi si immerge.' },
            { front: 'Assistenza medica d’emergenza 24/7 in tutto il mondo', back: 'Vedi “La rete internazionale”: quando avviene un infortunio DAN interviene con la propria rete d’emergenza.' },
          ]}
        />
        <p className="text-[0.92rem] text-ink-soft">I nomi completi dei servizi: corsi di primo soccorso; partecipazione a progetti di ricerca medico-subacquea; consulenza medica; accesso esclusivo ai piani assicurativi; assistenza medica d’emergenza 24/7 in tutto il mondo.</p>
      </Sub>

      <Sub id="dan" title="Divers Alert Network" page="9">
        <h3>Chi è DAN Europe</h3>
        <p>
          DAN Europe, cioè Divers Alert Network Europe, è una fondazione internazionale senza scopo di lucro dedicata alla sicurezza dell’immersione. Da 40 anni offre ai subacquei quattro cose: assistenza nelle emergenze, consulenza medica specialistica, occasioni di formazione e servizi assicurativi studiati apposta per chi si immerge, che il manuale definisce i migliori.
        </p>
        <KeyFacts title="DAN in tre numeri" items={[{ label: 'Anni di servizio ai subacquei', value: '40' }, { label: 'Organizzazioni nella rete IDAN', value: '5' }, { label: 'Assistenza medica d’emergenza', value: '24/7', note: 'In tutto il mondo.' }]} />

        <h3>La rete internazionale (IDAN)</h3>
        <p>
          L’International DAN (IDAN) riunisce cinque organizzazioni indipendenti l’una dall’altra, distribuite in zone diverse del pianeta: così assistenza e consulenza medica sono disponibili a qualunque latitudine. Le cinque aree sono America, Europa, Giappone, Sud Africa e Sud-Est asiatico.
        </p>
        <Figure caption="La rete IDAN: cinque organizzazioni indipendenti, una per area del mondo. DAN Europe copre l’Europa.">
          <div className="p-4 sm:p-6">
            <IdanNetwork />
          </div>
        </Figure>
        <p>Quando succede un infortunio DAN interviene con la propria rete d’emergenza. Accanto a questo, da sempre lavora anche per prevenire gli incidenti subacquei.</p>

        <h3>Vantaggi per gli iscritti</h3>
        <p>Chi è iscritto ha diritto a benefici riservati, tra cui:</p>
        <ul>
          <li>accesso a piani assicurativi su misura;</li>
          <li>informazioni tempestive sulle ultime novità in fatto di sicurezza e prevenzione;</li>
          <li>inviti a eventi esclusivi;</li>
          <li>altri vantaggi ancora.</li>
        </ul>

        <h3>La ricerca scientifica</h3>
        <p>
          DAN fa ricerca scientifica per capire meglio i meccanismi fisiopatologici legati all’immersione. Uno dei progetti più innovativi è il <strong>Diving Safety Laboratory</strong>: raccoglie, con la collaborazione diretta dei subacquei, dati preziosi da immersioni reali e non solo simulate. Negli anni questo lavoro ha permesso di studiare:
        </p>
        <ul>
          <li>il volo dopo l’immersione;</li>
          <li>il rapporto tra diabete e immersione;</li>
          <li>i meccanismi della decompressione;</li>
          <li>le diverse condizioni ambientali e fisiologiche che possono influire sulla salute del subacqueo.</li>
        </ul>

        <h3>La formazione</h3>
        <p>DAN rende l’immersione più sicura anche con la formazione. L’offerta comprende corsi specifici:</p>
        <ul>
          <li>primo soccorso con ossigeno;</li>
          <li>programma BLS(D), Basic Life Support con defibrillatore esterno;</li>
          <li>gestione delle emergenze in luoghi remoti;</li>
          <li>corsi speciali per subacquei e anche per non subacquei.</li>
        </ul>
        <p>Ci sono poi programmi formativi per medici e per il personale dei servizi medici d’emergenza. In sintesi: DAN accompagna da sempre i subacquei per una sicurezza a 360 gradi.</p>
      </Sub>

      <Sub id="panoramica" title="Panoramica del corso" page="10">
        <p>
          Il corso DAN BLS(D) ti dà le conoscenze e le abilità per eseguire su un adulto le manovre BLS (Basic Life Support, supporto di base alla vita) oppure BLS-D, cioè le stesse manovre con l’aiuto del DAE, il Defibrillatore Automatico Esterno. Il percorso ha tre tappe: scegline una per vedere che cosa prevede.
        </p>
        <Roadmap />
      </Sub>

      <Sub id="conoscenze" title="Sviluppo delle conoscenze" page="10">
        <p>La parte teorica ti dà le informazioni che servono per 13 argomenti. Alcuni valgono per tutti, alcuni solo per chi segue il BLS-D, due sono facoltativi: usa i filtri per vederli a gruppi.</p>
        <TopicFilter />
        <h3>Come si studia</h3>
        <ul>
          <li>Segui la lezione del tuo DAN BLS(D) Instructor: è un passaggio indispensabile per capire fino in fondo ciò che c’è nel manuale.</li>
          <li>Il testo presenta i contenuti in modo semplice e comprensibile.</li>
          <li>Per fissare meglio le nozioni, rispondi alle domande alla fine di ogni sezione.</li>
        </ul>
      </Sub>

      <Sub id="abilita" title="Sviluppo delle abilità" page="10">
        <p>La sezione “Sviluppo delle abilità pratiche” serve a trasformare in gesti ciò che hai imparato in “Sviluppo delle conoscenze”.</p>
        <p>Il lavoro pratico si svolge sotto la guida di un DAN Instructor BLS(D), che così può verificare quanto hai appreso.</p>
        <Callout kind="obbligo" title="Le manovre si imparano con l’istruttore">
          <p>La pratica guidata non è sostituibile dalla lettura: è lì che l’istruttore controlla che tu sappia eseguire ciò che hai studiato.</p>
        </Callout>
      </Sub>

      <Sub id="certificazione" title="Certificazione finale" page="10">
        <ol>
          <li>Alla fine del corso affronti due prove: la verifica delle conoscenze e la valutazione delle abilità pratiche. Il brevetto arriva solo se risulti idoneo in <strong>entrambe</strong>.</li>
          <li>In quel caso DAN Education ti manda per e-mail il brevetto DAN BLS(D) Provider, che certifica che sei abilitato a eseguire le manovre BLS o BLS-D.</li>
          <li>Puoi consultare le tue certificazioni in qualsiasi momento, in due modi: nell’Area Riservata MyDAN oppure con l’apposita APP, che scarichi dallo store del tuo smartphone (iOS o Android).</li>
        </ol>
      </Sub>

      <Sub id="prerequisiti" title="Prerequisiti di accesso al corso" page="11">
        <p>
          Per iscriverti a questo corso non serve <strong>nessun prerequisito</strong>. Al contrario, è il corso BLS a essere un prerequisito per molti altri corsi, sia di DAN sia di altre organizzazioni.
        </p>
      </Sub>

      <Sub id="obiettivi" title="Obiettivi di apprendimento" page="11">
        <p>Alla fine del corso saprai fare otto cose: quattro per tutti, due facoltative e due solo per il BLS-D. Spuntale man mano che senti di averle raggiunte: il segno resta salvato su questo dispositivo.</p>
        <Checklist
          id="s00-obiettivi"
          columns={2}
          items={objectives.map((o) => ({
            id: o.id,
            label: (
              <>
                {o.text}
                <TagChip tag={o.tag} />
              </>
            ),
          }))}
        />
      </Sub>

      <Sub id="aggiornamento" title="Aggiornamento dell’addestramento" page="11">
        <p>La certificazione “DAN BLS/BLSD Provider” vale due anni, quindi l’addestramento va rinnovato almeno una volta ogni due anni. Per un programma come questo è comunque consigliato un aggiornamento più frequente, soprattutto per le abilità pratiche.</p>
        <KeyFacts title="Validità" items={[{ label: 'Certificazione DAN BLS/BLSD Provider', value: '2 anni', note: 'Aggiorna l’addestramento almeno ogni due anni, meglio più spesso per la pratica.' }]} />
        <Callout kind="attenzione">
          <ul>
            <li>Il manuale ti accompagna prima e durante il corso ed è utile per completare la formazione in aula.</li>
            <li>Da solo, però, non basta per acquisire le competenze del corso BLS(D) Provider.</li>
            <li>Per saper applicare le tecniche descritte devi frequentare un corso BLS(D) tenuto da un Istruttore DAN qualificato.</li>
          </ul>
        </Callout>
        <Callout kind="nota">
          <p>Il manuale è scritto secondo le linee guida ERC (European Resuscitation Council) 2021 per il BLSD.</p>
        </Callout>
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave" page="8–11">
        <KeyFacts
          items={[
            { label: 'Anni di servizi DAN ai subacquei', value: '40' },
            { label: 'Organizzazioni della rete IDAN', value: '5', note: 'America, Europa, Giappone, Sud Africa, Sud-Est asiatico.' },
            { label: 'Assistenza medica d’emergenza', value: '24/7', note: 'In tutto il mondo.' },
            { label: 'Anelli della catena di sopravvivenza', value: '4' },
            { label: 'Argomenti delle conoscenze', value: '13', note: '8 comuni, 2 facoltativi, 3 solo per il BLS-D.' },
            { label: 'Obiettivi di apprendimento', value: '8', note: '4 comuni, 2 facoltativi, 2 solo per il BLS-D.' },
            { label: 'Soccorritori previsti per la RCP', value: '1', note: 'Negli obiettivi: RCP da unico soccorritore.' },
            { label: 'Validità della certificazione', value: '2 anni', note: 'È anche l’intervallo massimo tra un aggiornamento e l’altro.' },
            { label: 'Linee guida ERC seguite', value: '2021' },
            { label: 'Prerequisiti per il corso', value: '0' },
          ]}
        />
      </Sub>
    </SectionPage>
  )
}
