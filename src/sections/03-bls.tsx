import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router'
import { Callout, Compare, Figure, FlipCards, KeyFacts, Plate, Quiz, ScrollStory, SectionPage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/03-bls'
import { AnossiaVisual } from '../widgets/s03/AnossiaVisual'
import { DecisionCards, type Decision } from '../widgets/s03/DecisionCards'
import { GasCheck, GasDrawing } from '../widgets/s03/GasCheck'
import { SmeFigure } from '../widgets/s03/SmeFigure'
import { SortQuiz, type SortItem } from '../widgets/s03/SortQuiz'

const abc = [
  { l: 'A', en: 'Airways', it: 'Vie aeree', text: 'Di norma sono pervie, cioè libere. Se sono ostruite, l’aria non riesce ad arrivare ai polmoni.' },
  { l: 'B', en: 'Breathing', it: 'Respirazione', text: 'Respirando, l’aria inalata percorre le vie aeree fino ai polmoni, dove l’O2 può passare nel circolo sanguigno.' },
  { l: 'C', en: 'Circulation', it: 'Circolazione', text: 'Spinto dal cuore, il sangue trasporta l’O2 lungo i vasi sanguigni, dai polmoni fino ai tessuti dell’organismo.' },
]

const story = [
  {
    title: 'Minuto 0: l’ossigeno non arriva più',
    body: (
      <p>
        Gli organi hanno bisogno di ricevere ossigeno (O2) senza interruzioni. Quando l’apporto si ferma si parla di <strong>anossia</strong>: da quel momento gli organi entrano in sofferenza ischemica.
      </p>
    ),
  },
  {
    title: 'Ogni minuto, circa il 10% in più',
    body: (
      <p>
        In caso di arresto cardiaco (ACC) il danno anossico agli organi vitali avanza di <strong>circa il 10% per ogni minuto</strong> trascorso dall’evento.
      </p>
    ),
  },
  {
    title: 'Minuto 3: il sistema nervoso centrale',
    body: (
      <p>
        Già <strong>dopo 3 minuti</strong> dall’inizio dell’anossia il sistema nervoso centrale è in grave sofferenza per l’ischemia.
      </p>
    ),
  },
  {
    title: 'Se l’anossia continua: necrosi',
    body: <p>Se l’ossigeno continua a mancare, la sofferenza ischemica arriva alla fine alla necrosi dei tessuti.</p>,
  },
  {
    title: 'La RCP rallenta il danno',
    body: (
      <>
        <p>
          Nella maggior parte dei casi la RCP non riesce a far ripartire il cuore. Però spinge sangue ossigenato verso cuore e cervello, <strong>rallenta il danno anossico</strong> e aumenta le possibilità che la defibrillazione abbia successo.
        </p>
        <p>Per questo le manovre di BLS vanno iniziate subito.</p>
      </>
    ),
  },
]

const rcp = [
  { title: 'Controlla la coscienza', body: <p>Verifica lo stato di coscienza della vittima.</p> },
  {
    title: 'Vie aeree e respiro: GAS',
    body: (
      <>
        <p>Apri le vie aeree, o mantienile pervie, e stabilisci se il respiro è normale oppure alterato con la manovra GAS:</p>
        <ul>
          <li>
            <strong>G</strong>uarda il movimento del torace;
          </li>
          <li>
            <strong>A</strong>scolta;
          </li>
          <li>
            <strong>S</strong>enti eventuali segni di respirazione.
          </li>
        </ul>
        <p>
          Il controllo dura <strong>al massimo 10 secondi</strong>.
        </p>
      </>
    ),
    visual: <GasCheck />,
  },
  {
    title: 'Compressioni toraciche',
    body: <p>Se la vittima non respira, esegui le compressioni toraciche: aiutano o sostituiscono per un po’ il lavoro del cuore e tengono attiva la circolazione del sangue.</p>,
  },
  { title: 'Ventilazione artificiale', body: <p>Esegui la ventilazione artificiale, che porta aria, e quindi O2, ai polmoni.</p> },
]

const chiamo: Decision[] = (() => {
  const vivavoce = 'Attivo il vivavoce (o metto gli auricolari), chiamo il SME e intanto inizio la RCP'
  const primaSme = 'Vado a chiamare il SME, poi torno e inizio la RCP'
  const inDue = 'Uno di noi chiama il SME, l’altro inizia subito la RCP'
  const unMinuto = 'Faccio 1 minuto di RCP, poi vado a chiamare aiuto'
  const no1 = 'Il minuto di RCP prima di chiamare vale solo per le 2 eccezioni (bambino, annegamento), quando sei solo e senza un telefono a portata.'
  return [
    {
      id: 'cell',
      title: 'Solo, con il cellulare',
      situation: 'Un adulto si accascia davanti a te e non respira. Sei solo, ma hai il cellulare in tasca.',
      options: [
        { text: primaSme, ok: false, why: 'Non serve allontanarti: con il telefono in mano puoi chiamare e soccorrere insieme.' },
        { text: vivavoce, ok: true, why: 'Con il vivavoce o gli auricolari hai le mani libere: chiami il SME e cominci subito le manovre di soccorso.' },
        { text: unMinuto, ok: false, why: no1 },
      ],
    },
    {
      id: 'solo',
      title: 'Solo, senza telefono',
      situation: 'Un adulto è a terra e non respira. Sei solo e per chiamare devi allontanarti dalla vittima.',
      options: [
        { text: unMinuto, ok: false, why: no1 + ' Con un adulto la priorità è il SME.' },
        { text: primaSme, ok: true, why: 'Se devi allontanarti per chiamare, la priorità resta attivare prima il SME e solo dopo iniziare la RCP.' },
        { text: vivavoce, ok: false, why: 'Qui non hai un telefono con te: per chiamare devi allontanarti.' },
      ],
    },
    {
      id: 'due',
      title: 'In due o più',
      situation: 'Un adulto non respira. Accanto a te c’è un’altra persona pronta ad aiutare.',
      options: [
        { text: inDue, ok: true, why: 'Con 2 o più soccorritori, una seconda persona viene incaricata di contattare il SME mentre il primo soccorritore comincia la RCP.' },
        { text: primaSme, ok: false, why: 'Non serve che tu ti allontani: affida la chiamata all’altra persona e inizia la RCP.' },
        { text: unMinuto, ok: false, why: no1 },
      ],
    },
    {
      id: 'bambino',
      title: 'Bambino, sei solo',
      situation: 'Un bambino non respira. Sei solo e non hai un telefono prontamente disponibile.',
      options: [
        { text: primaSme, ok: false, why: 'Il bambino è una delle 2 eccezioni alla regola “prima il SME”.' },
        { text: unMinuto, ok: true, why: 'Bambino: se sei solo e senza un telefono a portata, esegui 1 minuto di RCP prima di andare a chiamare aiuto.' },
        { text: vivavoce, ok: false, why: 'Qui non hai un telefono a portata di mano.' },
      ],
    },
    {
      id: 'annegamento',
      title: 'Annegamento, sei solo',
      situation: 'Hai portato a riva una persona annegata che non respira. Sei solo e non hai un telefono prontamente disponibile.',
      options: [
        { text: unMinuto, ok: true, why: 'La vittima di annegamento è l’altra eccezione: da solo e senza telefono a portata, esegui 1 minuto di RCP prima di chiamare aiuto.' },
        { text: primaSme, ok: false, why: 'L’annegamento è una delle 2 eccezioni alla regola “prima il SME”.' },
        { text: inDue, ok: false, why: 'Sei solo: non c’è nessuno a cui affidare la chiamata.' },
      ],
    },
  ]
})()

const paure = [
  { front: 'Paura di non dare la migliore assistenza', back: 'Con le abilità DAN BLS acquisite puoi essere certo di praticare il BLS in modo appropriato ed efficace. Le mantieni con un ripasso almeno ogni 2 anni.' },
  { front: 'Paura di sbagliare', back: 'Sbagliare è possibile, ma un piccolo errore difficilmente causa danni gravi. È sempre meglio che non fare nulla.' },
  { front: 'Paura di provocare un danno', back: 'Un ACC è già uno dei peggiori scenari clinici: la RCP non può aggravarlo.' },
  { front: 'Paura di un’azione legale', back: 'Presentati e chiedi il permesso; per una vittima non cosciente il permesso è considerato accordato. Lo vedi negli aspetti legali, più avanti.' },
  { front: 'Paura di contrarre un’infezione', back: 'Come proteggerti lo vedi nella sezione successiva, Verifica della sicurezza ambientale.' },
]

const veroFalso: SortItem[] = [
  { id: 'perfetto', text: 'Se non sono sicuro di fare tutto alla perfezione, è meglio non intervenire.', bin: 'falso', explain: 'Commettere un piccolo errore mentre aiuti è sempre meglio che non fare assolutamente nulla.' },
  { id: 'errore', text: 'Un piccolo errore difficilmente causa danni gravi o peggiora le condizioni iniziali della vittima.', bin: 'vero', explain: 'Anche un’assistenza non “perfetta” raramente fa danni gravi.' },
  { id: 'peggiora', text: 'Su una persona in arresto cardiaco, la RCP può peggiorare la situazione.', bin: 'falso', explain: 'Un ACC è già di per sé uno dei peggiori scenari clinici: la RCP non può aggravare il quadro.' },
  { id: 'ansia', text: 'Sentirsi in ansia mentre si presta il primo soccorso è normale.', bin: 'vero', explain: 'La situazione è stressante sia per il soccorritore sia per la vittima.' },
  { id: 'adrenalina', text: 'L’emozione forte durante il soccorso dipende dall’adrenalina, che può aiutarti ad agire.', bin: 'vero', explain: 'È una reazione naturale dell’organismo: l’adrenalina può aiutare quando devi intervenire in prima persona.' },
  { id: 'mostrare', text: 'Far vedere che sei agitato aiuta la vittima a capire che la situazione è seria.', bin: 'falso', explain: 'L’ansia del soccorritore rende ancora più nervosi e stressati la vittima e gli altri soccorritori: non lasciarla trasparire.' },
  { id: 'reazioni', text: 'Una persona infortunata reagisce sempre in modo collaborativo.', bin: 'falso', explain: 'Può reagire in modo diverso da te, anche con rabbia o violenza. Resta calmo, presentati e spiegale che cosa stai facendo.' },
  { id: 'riparte', text: 'Se la RCP è eseguita in modo perfetto, nella maggior parte dei casi il cuore riparte.', bin: 'falso', explain: 'Di norma il cuore non riparte con la sola RCP, neppure se perfetta: la RCP aumenta le probabilità di sopravvivenza ma non garantisce il successo.' },
  { id: 'refresh', text: 'Dopo il corso BLS le competenze restano per sempre, senza bisogno di ripassi.', bin: 'falso', explain: 'Serve un refresh di teoria e pratica almeno ogni 2 anni, con un corso BLS di ripasso.' },
  { id: 'conforto', text: 'Se un soccorso non va a buon fine, chi è intervenuto va sostenuto e rassicurato.', bin: 'vero', explain: 'Chi ha soccorso può incolparsi; è sempre consigliabile confortarlo e ricordargli che ha fatto tutto ciò che poteva.' },
]

const presentazione = '«Mi chiamo …, sono un soccorritore abilitato al Primo Soccorso: posso aiutarti?»'

const legale: Decision[] = [
  {
    id: 'cosciente',
    title: 'Vittima cosciente',
    situation: 'Una persona cosciente è ferita e ti avvicini per aiutarla. Che cosa fai per prima cosa?',
    options: [
      { text: 'Comincio subito a medicarla: non c’è tempo per parlare', ok: false, why: 'Se non chiedi il permesso, la persona infortunata potrebbe intraprendere azioni legali per assistenza non voluta o per aggressione.' },
      { text: `Mi presento e chiedo il permesso: ${presentazione}`, ok: true, why: 'Una vittima cosciente dovrebbe dare il permesso prima di ricevere assistenza: dici il tuo nome, che sei abilitato al primo soccorso e chiedi se puoi aiutare.' },
      { text: 'Le chiedo un documento d’identità', ok: false, why: 'Non ti servono i suoi dati: ti serve il suo permesso.' },
    ],
  },
  {
    id: 'rifiuta',
    title: 'Vittima cosciente che rifiuta',
    situation: 'Ti sei presentato e hai chiesto se puoi aiutare. La persona, cosciente, risponde di no.',
    options: [
      { text: 'Intervengo comunque: è per il suo bene', ok: false, why: 'Assistere una persona cosciente contro la sua volontà può portare ad azioni legali per assistenza non voluta o per aggressione.' },
      { text: 'Rispetto la sua volontà e non presto assistenza contro il suo volere', ok: true, why: 'La vittima cosciente deve dare il permesso: senza, l’assistenza è non voluta.' },
    ],
  },
  {
    id: 'incosciente',
    title: 'Vittima non cosciente',
    situation: 'La persona a terra non è cosciente e non può risponderti.',
    options: [
      { text: 'Aspetto che riprenda coscienza per chiederle il permesso', ok: false, why: 'Una vittima non cosciente non può rispondere: per la legge il permesso è già accordato.' },
      { text: 'Intervengo: per la legge il permesso è già accordato (silenzio/assenso)', ok: true, why: 'Con una vittima non cosciente la legge considera il permesso come già dato, secondo il principio del silenzio/assenso.' },
    ],
  },
  {
    id: 'presunto',
    title: 'Arresto cardiaco presunto',
    situation: 'Pensi che la persona sia in arresto cardiaco, ma temi di farle del male se in realtà non lo è.',
    options: [
      { text: 'Inizio la RCP', ok: true, why: 'ILCOR raccomanda ai soccorritori laici di iniziare la RCP quando si presume un arresto cardiaco, senza preoccuparsi di arrecare danno a chi in realtà non è in arresto. Le linee guida ERC concordano.' },
      { text: 'Non faccio nulla finché non sono sicuro', ok: false, why: 'Le raccomandazioni ILCOR, condivise da ERC, dicono il contrario: se presumi un arresto cardiaco, inizia la RCP.' },
    ],
  },
  {
    id: 'oltre',
    title: 'Oltre la tua formazione',
    situation: 'Non hai alcun obbligo di assistenza. Un passante ti chiede di fare una manovra che non hai mai imparato.',
    options: [
      { text: 'Ci provo lo stesso: meglio che niente', ok: false, why: 'Se vai oltre il tuo livello di formazione potresti essere ritenuto responsabile di eventuali ulteriori danni causati alla vittima.' },
      { text: 'Resto entro il mio livello di formazione', ok: true, why: 'Un soccorritore senza obbligo di assistenza non deve spingersi oltre ciò che ha imparato.' },
    ],
  },
  {
    id: 'obbligo',
    title: 'Istruttore in un centro sportivo',
    situation: 'Sei istruttore in un diving center. Un cliente che si immerge con voi si sente male.',
    options: [
      { text: 'Come qualsiasi passante, non ho alcun obbligo', ok: false, why: 'I clienti pagano il centro per un servizio, quindi il centro ha un obbligo di assistenza verso di loro; e dagli istruttori ci si aspetta una competenza adeguata.' },
      { text: 'Ho un obbligo di assistenza e devo essere preparato a prestare il primo soccorso', ok: true, why: 'Il centro deve essere pronto a prestare il primo soccorso legato alle attività che offre, e da te, istruttore, ci si aspetta una competenza adeguata.' },
    ],
  },
  {
    id: 'paese',
    title: 'In un altro paese',
    situation: 'Vuoi sapere che cosa prevede la legge sul primo soccorso nel paese in cui ti trovi.',
    options: [
      { text: 'Vale ovunque quello che ho studiato qui', ok: false, why: 'Leggi e regolamenti cambiano da nazione a nazione.' },
      { text: 'Chiedo al DAN, al mio Istruttore o agli organi istituzionali competenti', ok: true, why: 'Sono le fonti giuste per avere informazioni specifiche e corrette sulla tua area.' },
    ],
  },
]

export default function Bls() {
  return (
    <SectionPage
      slug="bls"
      lead={
        <p>
          Il BLS è l’insieme delle tecniche con cui sostieni o ripristini le funzioni vitali di base. In questa sezione vedi perché ogni minuto senza ossigeno conta, quando chiamare i soccorsi, come gestire la paura di sbagliare e che cosa dice la legge.
        </p>
      }
    >
      <Sub id="cos-e" title="Che cos’è il BLS?" page="22">
        <p>
          La sigla <strong>BLS</strong> sta per <em>Basic Life Support</em>: l’insieme delle tecniche di primo soccorso con cui si sostengono, oppure si ripristinano, le funzioni vitali di base.
        </p>
        <h3>Fanno parte del BLS</h3>
        <ul>
          <li>la protezione personale;</li>
          <li>l’attivazione del Servizio Medico di Emergenza (SME);</li>
          <li>le cure prestate quando un incidente mette in pericolo la vita;</li>
          <li>
            il ripristino o il mantenimento dell’ABC (<em>Airways | Breathing | Circulation</em>), cioè l’esecuzione della Rianimazione Cardiopolmonare (RCP).
          </li>
        </ul>
        <h3>Le 6 tecniche da imparare</h3>
        <p>Per poter intervenire quando un evento minaccia la vita di una persona devi imparare queste tecniche di Primo Soccorso:</p>
        <ul>
          <li>
            <Link to="/sezione/sicurezza">verifica della sicurezza ambientale e protezione personale</Link>;
          </li>
          <li>
            <Link to="/sezione/rcp">CPR o RCP</Link> (<em>Cardiopulmonary Resuscitation</em>, cioè Rianimazione Cardiopolmonare);
          </li>
          <li>
            <Link to="/sezione/pls">posizione laterale di sicurezza</Link>;
          </li>
          <li>
            <Link to="/sezione/ostruzione">gestione dell’ostruzione delle vie aeree da corpo estraneo</Link> (soffocamento);
          </li>
          <li>
            <Link to="/sezione/emorragia">gestione di un’emorragia esterna (grave)</Link>;
          </li>
          <li>
            <Link to="/sezione/shock">gestione dello shock</Link>.
          </li>
        </ul>
        <Figure caption="Le tecniche di primo soccorso si imparano facilmente. Qui il soccorritore, con i guanti, controlla il respiro della vittima.">
          <div className="p-6">
            <GasDrawing className="mx-auto w-full max-w-xl" />
          </div>
        </Figure>
        <Callout kind="nota" title="Tieni aggiornate le tue abilità">
          <p>Se vuoi offrire a un infortunato la migliore assistenza possibile, devi tenere sempre aggiornate sia le conoscenze sia le abilità pratiche di BLS. Ripassare con regolarità e frequentare altri corsi di primo soccorso è raccomandato e incoraggiato.</p>
        </Callout>
      </Sub>

      <Sub id="valore" title="Il valore del BLS" page="22–24">
        <p>
          Gli organi hanno bisogno di ricevere ossigeno (O2) senza interruzioni: è una condizione assolutamente vitale. Se l’apporto di O2 si ferma (anossia), gli organi entrano in sofferenza ischemica e alla fine i tessuti vanno in necrosi. Il sistema nervoso centrale soffre gravemente per l’ischemia già <strong>dopo 3 minuti</strong> dall’inizio dell’anossia. Scorri e segui i minuti.
        </p>
        <ScrollStory label="Minuto per minuto: il cervello senza ossigeno" steps={story} visual={(a, p) => <AnossiaVisual active={a} progress={p} />} />

        <h3>A, B, C</h3>
        <p>Per questo le manovre di BLS vanno avviate subito: ristabiliscono o sostengono le funzioni vitali agendo direttamente su vie aeree, respirazione e circolazione, riassunte nell’acronimo ABC.</p>
        <dl className="my-6 max-w-[72ch] space-y-4">
          {abc.map((x) => (
            <div key={x.l} className="flex gap-4">
              <Plate className="w-14">
                <span className="font-display text-[2rem] font-extrabold leading-none">{x.l}</span>
              </Plate>
              <div className="min-w-0">
                <dt className="font-display text-[1.35rem] font-bold leading-tight">
                  {x.en}: {x.it}
                </dt>
                <dd>{x.text}</dd>
              </div>
            </div>
          ))}
        </dl>

        <h3>La RCP, passo per passo</h3>
        <p>La RCP è una parte fondamentale del BLS. Quando la pratichi segui questi 4 passaggi. Al passo 2 prova il timer: il controllo GAS non deve superare i 10 secondi.</p>
        <Steps mode="stepper" label="I 4 passaggi della RCP" items={rcp} />

        <h3>Che cosa fa la RCP, e che cosa no</h3>
        <p>Lo scopo principale della rianimazione è far sì che un flusso di sangue ossigenato continui ad arrivare al cuore e al cervello della vittima.</p>
        <Compare
          columns={[
            {
              title: 'La RCP fa',
              kind: 'nota',
              items: [
                'Mantiene un flusso di sangue ossigenato verso cuore e cervello.',
                'Rallenta il danno anossico agli organi vitali, che avanza di circa il 10% per ogni minuto dall’evento.',
                'Aumenta le possibilità che la defibrillazione abbia successo.',
              ],
            },
            {
              title: 'La RCP di solito non fa',
              kind: 'attenzione',
              items: ['In presenza di arresto cardiaco (ACC), nella maggior parte dei casi non riesce a far ripartire il cuore.'],
            },
          ]}
        />
        <Callout kind="nota" title="Nota: l’aria che insuffli">
          <p>Nella respirazione bocca-bocca l’aria che il soccorritore soffia nelle vie aeree della vittima è aria espirata: contiene soltanto il 16-17% di O2, contro il 21% dell’aria ambiente.</p>
          <p>Per ossigenare meglio il sangue durante la rianimazione si raccomanda l’ossigeno supplementare con gli appositi presidi, ma solo se sei stato addestrato a usarli.</p>
          <p>Le tecniche di somministrazione di O2 agli infortunati si approfondiscono con un corso DAN (Divers Alert Network) Aquatic, Oxygen o Advanced Oxygen First Aid Provider.</p>
        </Callout>
        <KeyFacts
          items={[
            { label: 'Anossia: sistema nervoso centrale in grave sofferenza', value: '3 min' },
            { label: 'Danno anossico agli organi vitali', value: '≈10% al min' },
            { label: 'Controllo GAS, al massimo', value: '10 s' },
            { label: 'O2 nell’aria ambiente', value: '21%' },
            { label: 'O2 nell’aria espirata (bocca-bocca)', value: '16-17%' },
          ]}
        />

        <h3>Gli scopi del BLS</h3>
        <ul>
          <li>Sostenere le funzioni vitali di base.</li>
          <li>Prevenire gli ulteriori danni dovuti alla mancanza di O2.</li>
          <li>Prestare il primo soccorso per stabilizzare la vittima fino all’arrivo del SME.</li>
        </ul>
        <p>Un BLS eseguito correttamente può incidere in modo significativo sulla prognosi di un ACC.</p>
        <p>
          Un corso BLS non insegna soltanto la RCP: ti dà anche le nozioni per riconoscere e prevenire le condizioni che possono portare a un ACC, per esempio un’<Link to="/sezione/emorragia">emorragia esterna</Link> o uno <Link to="/sezione/shock">shock</Link>.
        </p>
      </Sub>

      <Sub id="sme" title="Allertare il Servizio Medico d’Emergenza – SME" page="24">
        <p>
          Telefonare nel modo giusto al SME è un passaggio fondamentale, anche se spesso viene sottovalutato. La chiamata va fatta <strong>precocemente</strong>, cioè appena hai accertato che l’infortunato è in pericolo di vita.
        </p>
        <h3>Chi chiama, e quando</h3>
        <ul>
          <li>
            <strong>Sei solo e hai il cellulare:</strong> attiva il vivavoce o usa qualsiasi strumento che ti lasci le mani libere (per esempio gli auricolari), così puoi iniziare le manovre di soccorso.
          </li>
          <li>
            <strong>Sei solo e devi allontanarti dalla vittima per chiamare:</strong> la priorità resta attivare prima il SME e solo dopo iniziare la RCP.
          </li>
          <li>
            <strong>Siete in 2 o più:</strong> una seconda persona viene incaricata di contattare il SME, mentre il primo soccorritore comincia la RCP.
          </li>
        </ul>
        <Callout kind="attenzione" title="Le 2 eccezioni">
          <p>La regola ha 2 eccezioni, quando la vittima è:</p>
          <ul>
            <li>un bambino;</li>
            <li>una vittima di annegamento.</li>
          </ul>
          <p>
            In questi 2 casi, se sei solo e non hai un telefono prontamente disponibile, esegui <strong>1 minuto di RCP</strong> prima di andare a chiamare aiuto.
          </p>
        </Callout>
        <DecisionCards title="Chiamo prima o inizio la RCP?" hint="Scegli uno scenario e decidi che cosa fai." cards={chiamo} />

        <h3>Il numero da chiamare</h3>
        <div className="flex flex-wrap items-center gap-6">
          <img src="/img/iso7010/e004-telefono-emergenza.svg" alt="Segnale di sicurezza: telefono di emergenza" className="w-24" />
          <p className="min-w-0 flex-1 basis-[20rem]">
            In molti paesi il SME si raggiunge con un numero d’emergenza nazionale. In Italia il numero unico di emergenza è l’<strong>1-1-2</strong>; in alcune regioni il numero dell’emergenza sanitaria potrebbe essere l’<strong>1-1-8</strong>.
          </p>
        </div>
        <p>In alcuni paesi chi risponde può chiederti con quale servizio d’emergenza vuoi parlare: polizia, vigili del fuoco oppure servizi medici d’emergenza.</p>
        <div className="grid max-w-[72ch] items-start gap-x-6 sm:grid-cols-2 [&>figure]:my-4">
          <Figure file="img/numero-112-emergenza.jpg" caption="Il logo europeo del 112: in Italia è il numero unico di emergenza, quello da chiamare per allertare il SME." />
          <Figure file="img/ambulanza-118-italia.jpg" caption="Un mezzo di soccorso del 118 a Roma. In alcune regioni il numero dell’emergenza sanitaria può essere l’1-1-8." />
        </div>
        <KeyFacts
          items={[
            { label: 'Numero unico di emergenza in Italia', value: '1-1-2' },
            { label: 'Emergenza sanitaria (in alcune regioni)', value: '1-1-8' },
            { label: 'Bambino o annegamento, da solo senza telefono: RCP prima di chiamare', value: '1 min' },
          ]}
        />
        <Figure caption="Che cosa dire al SME. Per ripassare la chiamata nei dettagli torna alla Sezione 2.">
          <SmeFigure />
        </Figure>
        <Callout kind="nota">
          <p>
            Per rivedere che cosa dire quando chiami il numero unico di emergenza, torna alla Sezione 2, <Link to="/sezione/catena">La catena della sopravvivenza</Link>.
          </p>
        </Callout>
      </Sub>

      <Sub id="stress" title="Stress emotivo e paura di fare la cosa sbagliata" page="25–26">
        <p>Soccorrere una persona in difficoltà può provocare un forte stress emotivo, prima, durante e dopo l’intervento.</p>
        <p>Quando qualcuno è vittima di un incidente o di un arresto cardiaco improvviso, i presenti possono non sapere come comportarsi ed esitare a iniziare le manovre di rianimazione.</p>
        <p>Spesso si esita a iniziare il BLS per una di queste 5 paure. Gira ogni carta: sul retro trovi la risposta del manuale.</p>
        <FlipCards items={paure} />
        <p>
          Sentirsi in ansia e preoccupati mentre si presta il primo soccorso è normale: la situazione è stressante tanto per il soccorritore quanto per la vittima. Potresti perfino pensare di non intervenire, per non rischiare di sbagliare o perché sei convinto di non saper assistere la vittima nel modo giusto.
        </p>
        <p>
          Sbagliare è possibile. Tuttavia, anche se l’assistenza non fosse “perfetta”, è difficile che un piccolo errore causi danni gravi o peggiori le condizioni iniziali della vittima. <strong>Commettere un piccolo errore mentre aiuti è sempre meglio che non fare assolutamente nulla.</strong>
        </p>
        <Callout kind="nota" title="Esempio">
          <p>Un ACC è già, di per sé, uno dei peggiori scenari clinici che esistano. La RCP non può aggravare il quadro: il timore di causare un danno in più non ha motivo.</p>
        </Callout>
        <p>Una volta acquisite le abilità DAN Basic Life Support (BLS), puoi essere certo di saper praticare il BLS in modo appropriato ed efficace.</p>
        <Callout kind="obbligo" title="Un ripasso almeno ogni 2 anni">
          <p>Per conservare questo livello di competenza serve un refresh della teoria e dell’addestramento pratico almeno ogni 2 anni, frequentando un corso BLS di ripasso.</p>
        </Callout>
        <p>
          Durante il soccorso puoi essere molto emozionato. È una reazione del tutto naturale dell’organismo, legata al rilascio di adrenalina: un ormone che può aiutarti quando devi agire in prima persona per soccorrere qualcuno.
        </p>
        <p>È però importante non lasciar trasparire la tua ansia, perché renderebbe ancora più nervosi e stressati la vittima e gli altri soccorritori.</p>
        <p>
          Le persone infortunate possono reagire e comportarsi in modo diverso dal tuo: non si possono escludere reazioni di rabbia o addirittura di violenza. Proprio per questo cerca di restare il più calmo possibile: presentati, parla con la persona infortunata e spiegale che cosa stai facendo. Può aiutare a tranquillizzarla.
        </p>
        <Compare
          columns={[
            {
              title: 'Cosa aiuta',
              kind: 'obbligo',
              items: ['Restare il più calmo possibile.', 'Presentarti e parlare con la persona infortunata.', 'Spiegarle che cosa stai facendo.', 'Dopo, sostenere e confortare chi ha soccorso.'],
            },
            {
              title: 'Cosa evitare',
              kind: 'divieto',
              items: ['Lasciar trasparire l’ansia: agita la vittima e gli altri soccorritori.', 'Non intervenire per paura di sbagliare: un piccolo errore è meglio di niente.'],
            },
          ]}
        />
        <p>
          Anche un soccorso che non va a buon fine può causare un grave stress emotivo a chi è intervenuto: potrebbe incolpare sé stesso di non aver “salvato” la vittima o di aver commesso qualche errore. Se sul posto ci sono più soccorritori, o se hai assistito a un soccorso, è sempre consigliabile sostenere e confortare il soccorritore, rassicurandolo che ha fatto tutto ciò che era nelle sue possibilità.
        </p>
        <Callout kind="nota" title="Ricorda">
          <p>Nella maggior parte dei casi il cuore non riparte con la sola RCP, nemmeno quando è eseguita in modo perfetto. La RCP aumenta le probabilità di sopravvivenza, ma non garantisce il successo delle manovre. Come parte del “BLS precoce”, la RCP è soltanto uno degli anelli della catena di sopravvivenza.</p>
        </Callout>
        <h3>Vero o falso?</h3>
        <SortQuiz
          label="Vero o falso: stress e paura di sbagliare"
          intro="Per ogni frase scegli Vero o Falso: la spiegazione arriva subito."
          bins={[
            { id: 'vero', label: 'Vero' },
            { id: 'falso', label: 'Falso' },
          ]}
          items={veroFalso}
        />
      </Sub>

      <Sub id="legali" title="Aspetti legali – BLS" page="26–27">
        <h3>Obbligo di assistenza</h3>
        <p>Si ha un obbligo di assistenza quando una persona ha delle responsabilità nei confronti di qualcun altro.</p>
        <Callout kind="nota" title="Esempio">
          <p>
            In molte nazioni i centri sportivi, come un diving center o una palestra, hanno un obbligo di assistenza verso i propri clienti (subacquei o utenti in genere), perché questi pagano il centro per accedere a un servizio: immergersi o usare la struttura. Il centro deve quindi essere preparato a prestare il primo soccorso legato alle attività che offre.
          </p>
          <p>Lo stesso vale per gli istruttori, per esempio gli istruttori sportivi: da loro ci si aspetta una competenza adeguata nell’assistere i propri allievi o utenti.</p>
        </Callout>
        <p>Nella maggior parte dei paesi nessuna legge obbliga un soccorritore senza obbligo di assistenza a prestare il primo soccorso. La legge potrebbe comunque imporre al cittadino di fornire assistenza.</p>
        <Callout kind="attenzione">
          <p>Se non hai un obbligo di assistenza e presti il primo soccorso, non spingerti oltre il tuo livello di formazione. Se lo facessi, potresti essere ritenuto responsabile di eventuali ulteriori danni causati alla vittima.</p>
        </Callout>
        <p>
          In ogni caso ILCOR (International Liaison Committee on Resuscitation) raccomanda ai soccorritori laici di iniziare la RCP quando si presume un arresto cardiaco, senza preoccuparsi di poter arrecare danno a “vittime” che in realtà non sono in arresto cardiaco. Le linee guida ERC (European Resuscitation Council) concordano con le Raccomandazioni di Trattamento ILCOR.
        </p>

        <h3>Chiedere il permesso</h3>
        <p>Per evitare problemi legali conviene chiedere il permesso alla vittima prima di prestarle il primo soccorso: di’ il tuo nome, dichiara di essere un soccorritore abilitato al primo soccorso e domanda se puoi aiutare. Per esempio:</p>
        <p className="rounded-plate bg-must-tint p-5 font-display text-[1.5rem] font-bold leading-tight">{presentazione}</p>
        <Compare
          columns={[
            {
              title: 'Vittima cosciente',
              kind: 'obbligo',
              items: ['Dovrebbe dare il permesso prima di ricevere assistenza.', 'Se il permesso non viene chiesto, o se l’assistenza è prestata contro la sua volontà, la persona infortunata potrebbe intraprendere azioni legali per assistenza non voluta o per aggressione.'],
            },
            {
              title: 'Vittima non cosciente',
              kind: 'nota',
              items: ['La legge considera il permesso come già accordato (silenzio/assenso).'],
            },
          ]}
        />
        <p>Leggi e regolamenti cambiano da nazione a nazione: per avere informazioni specifiche e corrette sulla tua area rivolgiti sempre al DAN, al tuo Istruttore oppure agli organi istituzionali competenti.</p>
        <Callout kind="nota">
          <p>
            Gli aspetti legali legati all’uso di un defibrillatore automatico esterno (DAE) sono approfonditi nella <Link to="/sezione/dae">Sezione 10</Link>.
          </p>
        </Callout>
        <DecisionCards title="Posso intervenire?" hint="Scegli una situazione e decidi che cosa fai." cards={legale} />
      </Sub>

      <Sub id="linee-guida" title="Raccomandazioni & Linee Guida" page="27">
        <p>Le raccomandazioni per il BLS sono pubblicate periodicamente da un comitato medico-scientifico internazionale, l’International Liaison Committee on Resuscitation (ILCOR).</p>
        <p>Il comitato è formato da organizzazioni nazionali di esperti sanitari, come lo European Resuscitation Council (ERC), l’Australian Resuscitation Committee (ARC) e l’American Heart Association (AHA).</p>
        <Figure caption="Dalle raccomandazioni internazionali al tuo manuale.">
          <div className="grid gap-3 p-6">
            <Tier tags={['ILCOR']} text="International Liaison Committee on Resuscitation: pubblica periodicamente raccomandazioni internazionali" />
            <ArrowDown className="ml-4 size-7 text-must" aria-hidden />
            <Tier tags={['ERC', 'ARC', 'AHA']} text="European Resuscitation Council, Australian Resuscitation Committee, American Heart Association: ognuna redige Linee Guida adattate alle proprie esigenze" />
            <ArrowDown className="ml-4 size-7 text-must" aria-hidden />
            <Tier tags={['ERC 2021']} text="Il manuale del corso è scritto in accordo con le Linee Guida ERC 2021" />
          </div>
        </Figure>
        <p>ILCOR pubblica periodicamente raccomandazioni internazionali per il primo soccorso; spetta poi alle organizzazioni nazionali redigere le proprie Linee Guida, adattandole alle diverse esigenze. Per questo tra le Linee Guida delle varie organizzazioni nazionali puoi trovare piccole differenze.</p>
        <p>
          Il manuale di riferimento di questo corso è scritto in accordo con le <strong>Linee Guida ERC 2021</strong>.
        </p>
        <Callout kind="obbligo" title="Aggiornati di continuo">
          <p>Raccomandazioni e linee guida possono cambiare nel tempo, perciò serve un aggiornamento continuo. Per qualsiasi dubbio sulle pubblicazioni più recenti puoi contattare DAN Europe in qualunque momento.</p>
          <p>L’aggiornamento continuo ti garantisce di saper applicare sempre gli standard più attuali.</p>
        </Callout>
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="28">
        <KeyFacts
          title="Dati chiave della sezione"
          items={[
            { label: 'Componenti del BLS', value: '4', note: 'Protezione personale, attivazione del SME, cure negli incidenti pericolosi per la vita, ripristino o mantenimento dell’ABC (RCP).' },
            { label: 'Tecniche di Primo Soccorso da imparare', value: '6' },
            { label: 'Anossia: sistema nervoso centrale già in grave sofferenza', value: '3 min' },
            { label: 'ABC', value: 'A · B · C', note: 'Airways, Breathing, Circulation.' },
            { label: 'Passaggi della RCP', value: '4', note: 'Coscienza, vie aeree e respiro (GAS), compressioni toraciche, ventilazione artificiale.' },
            { label: 'GAS (Guarda, Ascolta, Senti), al massimo', value: '10 s' },
            { label: 'O2 nell’aria ambiente', value: '21%' },
            { label: 'O2 nell’aria espirata (bocca-bocca)', value: '16-17%' },
            { label: 'Danno anossico agli organi vitali', value: '≈10% al min' },
            { label: 'Scopi del BLS', value: '3', note: 'Sostenere, prevenire, prestare il primo soccorso fino all’arrivo del SME.' },
            { label: 'In 2 o più soccorritori', value: '1 chiama, 1 fa RCP' },
            { label: 'Eccezioni a “prima il SME”', value: '2', note: 'Bambino e annegamento: da solo e senza telefono a portata, 1 minuto di RCP prima di chiamare aiuto.' },
            { label: 'Numero unico di emergenza in Italia', value: '1-1-2', note: 'In alcune regioni l’emergenza sanitaria è l’1-1-8.' },
            { label: 'Paure che fanno esitare a iniziare il BLS', value: '5' },
            { label: 'Refresh di teoria e pratica BLS', value: 'ogni 2 anni', note: 'Almeno.' },
            { label: 'Linee Guida di riferimento', value: 'ERC 2021' },
            { label: 'Cosa dire al SME', value: 'Sezione 2', note: 'Gli aspetti legali del DAE sono nella Sezione 10.' },
          ]}
        />
        <Quiz id="bls" questions={questions} />
      </Sub>
    </SectionPage>
  )
}

function Tier({ tags, text }: { tags: string[]; text: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="plate px-4 py-2 font-display text-[1.5rem] font-extrabold leading-none">
            {t}
          </span>
        ))}
      </div>
      <p className="min-w-0 max-w-[48ch] flex-1 basis-[16rem] text-[0.95rem] leading-snug">{text}</p>
    </div>
  )
}
