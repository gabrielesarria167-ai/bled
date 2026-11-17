import { Link } from 'react-router'
import { Callout, Compare, Figure, KeyFacts, Plate, Quiz, SectionPage, Steps, Sub } from '../components/ui'
import questions from '../data/quiz/07-ostruzione'
import { BlowsTrainer } from '../widgets/s07/BlowsTrainer'
import { ChokingTree } from '../widgets/s07/ChokingTree'
import { AirwayFigure, FistPoint, RcpPictogram, SideFluids, SolidsFigure } from '../widgets/s07/Figures'

export default function Ostruzione() {
  return (
    <SectionPage
      slug="ostruzione"
      lead={
        <p>
          Un boccone di traverso può chiudere le vie aeree in pochi istanti. Qui impari a capire con una sola domanda se l’ostruzione è lieve o grave, a dare colpi al dorso e spinte addominali nella sequenza giusta, a togliere dalla bocca solidi e liquidi e a comportarti con chi è stato soccorso in acqua.
        </p>
      }
    >
      <Sub id="corpo-estraneo" title="Ostruzione delle vie aeree da corpo estraneo" page="58">
        <p>
          Un corpo estraneo può ostruire le vie aeree in misura molto diversa: si va da un’ostruzione <strong>minore</strong> fino a una <strong>molto grave</strong>. L’ostruzione impedisce all’aria di passare normalmente nella <strong>trachea</strong> e, nei casi più seri, può portare all’<strong>arresto respiratorio</strong>.
        </p>

        <h3>Persona non cosciente: la lingua</h3>
        <p>
          In chi ha perso coscienza le vie aeree possono chiudersi da sole: il <strong>tono muscolare della lingua si riduce</strong> e la lingua <strong>cade all’indietro</strong>. In questo caso le riapri con la manovra che conosci già dalle sezioni precedenti: <strong>«piega il capo – solleva il mento»</strong> (in inglese <em>head tilt – chin lift</em>).
        </p>
        <Figure caption="Nella persona non cosciente è il peso della lingua caduta all’indietro a creare l’ostruzione. Iperestendere la testa e sollevare il mento favorisce la pervietà delle vie aeree.">
          <AirwayFigure />
        </Figure>

        <h3>Persona cosciente: i corpi estranei</h3>
        <p>
          In chi è cosciente la <strong>causa principale</strong> di ostruzione delle vie aeree e di soffocamento è un <strong>corpo estraneo</strong>.
        </p>
        <Compare
          columns={[
            { title: 'Adulti', items: [<>La causa più frequente di soffocamento è il <strong>cibo</strong>.</>] },
            { title: 'Neonati e bambini', items: [<>Il soffocamento è dovuto per lo più a <strong>cibo</strong>, <strong>piccoli oggetti</strong> (per esempio monete) e <strong>giocattoli</strong>.</>] },
          ]}
        />
        <p>
          Molto spesso si soffoca <strong>mentre si mangia</strong>. Per questo il soffocamento si riconosce subito, e puoi aiutare la vittima <strong>fin dalla prima fase</strong>, quando è <strong>ancora cosciente</strong>.
        </p>
      </Sub>

      <Sub id="lieve-grave" title="Ostruzione lieve e ostruzione grave" page="58–59">
        <h3>Riconoscere e distinguere</h3>
        <div className="flex items-center gap-5">
          <Plate glyph="ostruzione" tone="warn" className="w-20" />
          <p className="min-w-0 flex-1">
            Di solito chi sta soffocando <strong>si alza in piedi</strong> e <strong>si porta le mani al collo</strong>.
          </p>
        </div>
        <p>
          Sembra ovvio, ma è molto importante <strong>chiedere alla vittima: «Cosa c’è? Stai soffocando?»</strong>. Da come riesce a rispondere capisci in fretta se l’ostruzione è lieve o grave.
        </p>
        <Compare
          columns={[
            {
              title: 'Ostruzione lieve',
              kind: 'nota',
              items: [
                <><strong>Alla domanda:</strong> riesce a rispondere.</>,
                <><strong>Tosse:</strong> tossisce in modo efficace.</>,
                <><strong>Respiro:</strong> respira.</>,
              ],
            },
            {
              title: 'Ostruzione grave',
              kind: 'attenzione',
              items: [
                <><strong>Alla domanda:</strong> non riesce a parlare.</>,
                <><strong>Tosse:</strong> tentativi di tosse silenziosi e inefficaci.</>,
                <><strong>Respiro:</strong> non riesce a respirare, oppure ha un respiro ansimante.</>,
                <><strong>Evoluzione:</strong> può perdere coscienza in breve tempo.</>,
              ],
            },
          ]}
        />
        <p>Prova a decidere: parti dalla domanda e scegli i segni che osservi. L’albero ti porta al tipo di ostruzione e all’intervento corretto.</p>
        <ChokingTree />

        <h3>Cosa fare in base alla gravità</h3>
        <p>Il primo soccorso dipende strettamente da quanto è grave l’ostruzione che hai rilevato.</p>
        <Callout kind="obbligo" title="Ostruzione lieve">
          <p>
            <strong>Incoraggia la vittima a tossire</strong> e <strong>non fare nient’altro</strong>.
          </p>
        </Callout>
        <Callout kind="obbligo" title="Ostruzione grave, vittima ancora cosciente">
          <ul>
            <li>
              Dai <strong>5 colpi al dorso</strong>, decisi, <strong>tra le due scapole</strong>.
            </li>
            <li>
              Se i 5 colpi non hanno liberato le vie aeree, esegui <strong>5 compressioni/spinte addominali</strong> (<strong>manovra di Heimlich</strong>).
            </li>
            <li>
              Ripeti colpi e spinte <strong>finché l’ostruzione non si risolve</strong>.
            </li>
            <li>
              <strong>Dopo ogni singolo colpo o spinta</strong> verifica rapidamente che effetto ha avuto.
            </li>
          </ul>
        </Callout>
        <p>
          <strong>Se la vittima perde coscienza</strong>, inizi la <strong>RCP</strong> (rianimazione cardio-polmonare) secondo le linee guida BLS (Basic Life Support) che hai già imparato.
        </p>
        <Figure caption="Se la vittima di un’ostruzione da corpo estraneo non è cosciente, si esegue la RCP: mani sovrapposte al centro del torace.">
          <RcpPictogram label="Soccorritore inginocchiato accanto a una persona supina, con le mani sovrapposte al centro del torace per le compressioni" className="mx-auto max-w-[30rem] p-4" />
        </Figure>
      </Sub>

      <Sub id="rimuovere" title="Rimuovere materiale estraneo dalla bocca" page="59–60">
        <h3>Rimuovere solidi dalle vie aeree</h3>
        <p>
          Se nelle vie aeree c’è materiale <strong>solido</strong> ed è <strong>visibile</strong>, puoi toglierlo <strong>con le dita</strong>, ma <strong>solo se il materiale è affiorante</strong>. In questa situazione la vittima potrebbe non essere cosciente: è meglio che sia <strong>messa sul fianco</strong>.
        </p>
        <p>
          Fai molta attenzione: il rischio è <strong>spingere ancora più in profondità</strong> ciò che ostruisce.
        </p>
        <Figure caption="Con le dita togli solo ciò che vedi affiorare. Mai frugare in bocca senza vedere.">
          <SolidsFigure />
        </Figure>
        <Callout kind="attenzione">
          <p>
            Le <strong>esplorazioni alla cieca</strong> sono da evitare.
          </p>
        </Callout>

        <h3>Rimuovere liquidi dalle vie aeree</h3>
        <p>
          Anche <strong>sangue</strong> e <strong>vomito</strong> (il rigurgito del contenuto gastrico) possono ostruire le vie aeree. Nella maggior parte dei casi basta <strong>girare la vittima sul fianco, in posizione laterale di sicurezza, tenendo aperte le vie aeree</strong>: la <strong>forza di gravità</strong> aiuta i fluidi a uscire dalla bocca.
        </p>
        <Figure caption="Sul fianco, con le vie aeree aperte, sangue e vomito escono dalla bocca per gravità.">
          <SideFluids label="Persona sdraiata sul fianco con la testa appoggiata sulla mano; dalla bocca escono gocce di liquido che cadono a terra; una freccia verso il basso indica la gravità" className="mx-auto max-w-[30rem] p-4" />
        </Figure>
        <ul>
          <li>
            In alternativa puoi usare un <strong>mezzo «Log Roll»</strong>: la tecnica è descritta nella sezione finale del manuale (<Link to="/sezione/scenari">Muovere una persona infortunata</Link>).
          </li>
          <li>
            Per togliere i liquidi dalla bocca si può usare anche uno <strong>strumento di aspirazione</strong>: è una tecnica che il manuale <strong>non tratta</strong>.
          </li>
        </ul>

        <h3>Vittime di annegamento: aspirazione d’acqua</h3>
        <p>
          In chi è annegato è ragionevole pensare che ci sia stata <strong>aspirazione d’acqua</strong>. Nella maggioranza dei casi però l’acqua aspirata è <strong>poca</strong> e viene <strong>assorbita rapidamente nella circolazione centrale</strong>. Per questo <strong>in genere non serve togliere l’acqua dalle vie aeree prima di iniziare la RCP</strong>.
        </p>
        <p>
          Chi viene rianimato dopo un incidente da sommersione ha <strong>spesso un rigurgito</strong>, che può rendere difficile mantenere pervie le vie aeree. <strong>Ogni volta che c’è rigurgito</strong>, gira la vittima <strong>sul fianco</strong> e <strong>libera le vie aeree</strong>.
        </p>
        <Figure caption="Annegamento: si parte subito con la RCP, senza prima togliere l’acqua; a ogni rigurgito la vittima va girata sul fianco e le vie aeree vanno liberate.">
          <div className="grid gap-2 p-4 sm:grid-cols-2">
            <div>
              <RcpPictogram label="RCP su una persona supina appena tolta dall’acqua" />
              <p className="mt-1 text-[0.92rem]">1. RCP subito: in genere l’acqua non va tolta prima.</p>
            </div>
            <div>
              <SideFluids label="La stessa persona girata sul fianco mentre rigurgita: il liquido esce dalla bocca" />
              <p className="mt-1 text-[0.92rem]">2. Se rigurgita: sul fianco, libera le vie aeree.</p>
            </div>
          </div>
        </Figure>
      </Sub>

      <Sub id="abilita" title="Abilità pratica di BLS: ostruzione delle vie aeree da corpo estraneo" page="61–62">
        <Callout kind="obbligo" title="Ostruzione lieve">
          <p>Incoraggia la vittima a tossire.</p>
        </Callout>

        <h3>Ostruzione grave, tosse diventata inefficace, vittima cosciente: 5 colpi al dorso</h3>
        <Steps
          items={[
            { title: 'Posizionati', body: <p>Mettiti <strong>di fianco alla vittima, leggermente dietro</strong>.</p> },
            { title: 'Falla inclinare in avanti', body: <p>Fai <strong>inclinare bene in avanti il torace</strong>: così l’oggetto, una volta smosso, esce dalla bocca invece di essere inalato di nuovo.</p> },
            {
              title: 'Fino a 5 colpi tra le scapole',
              body: (
                <p>
                  Dai <strong>fino a 5 colpi secchi tra le scapole</strong> con il <strong>palmo</strong> di una mano. L’altra mano <strong>sostiene la parte anteriore del torace</strong>, così il colpo ha un contraccolpo.
                </p>
              ),
            },
            {
              title: 'Controlla dopo ogni colpo',
              body: (
                <p>
                  <strong>Dopo ogni colpo</strong> guarda se l’ostruzione è stata rimossa. Lo scopo è liberare le vie aeree a ogni colpo: <strong>non occorre dare tutti i colpi previsti</strong> se l’ostruzione si è già risolta.
                </p>
              ),
            },
          ]}
        />
        <div className="max-w-[26rem]">
          <Figure file="img/ostruzione-colpi-interscapolari.jpg" caption="Colpi al dorso: la vittima è piegata in avanti, una mano del soccorritore sostiene il torace (nel cerchio verde) e il palmo dell’altra colpisce tra le scapole." />
        </div>

        <h3>Se i colpi al dorso non bastano: fino a 5 compressioni/spinte addominali (manovra di Heimlich)</h3>
        <Steps
          items={[
            { title: 'Mettiti dietro la vittima', body: <p>Circonda con le braccia la <strong>parte alta dell’addome</strong>.</p> },
            { title: 'Inclinala in avanti', body: <p>Così l’oggetto espulso può uscire dalla bocca.</p> },
            {
              title: 'Il pugno al posto giusto',
              body: (
                <p>
                  Chiudi una mano <strong>a pugno</strong> e appoggiala <strong>tra l’ombelico e la parte inferiore dello sterno</strong>.
                </p>
              ),
              visual: <FistPoint className="mt-2 max-w-[18rem]" />,
            },
            {
              title: 'Spingi dentro e in alto',
              body: (
                <p>
                  Afferra il pugno con l’altra mano e spingi con decisione <strong>verso l’interno e verso l’alto</strong>: in questo modo l’oggetto dovrebbe essere espulso.
                </p>
              ),
            },
            {
              title: 'Fino a 5 volte',
              body: (
                <p>
                  Ripeti la spinta <strong>fino a 5 volte</strong>, verificando <strong>dopo ogni spinta</strong> se l’ostruzione è stata rimossa: così eviti manovre invasive inutili.
                </p>
              ),
            },
          ]}
        />
        <Figure file="img/ostruzione-colpi-dorsali-compressioni-addominali.jpg" caption="Le due manovre con la vittima inclinata in avanti: a sinistra i colpi al dorso, con il soccorritore di fianco e leggermente dietro; a destra le compressioni addominali, con il soccorritore dietro che la cinge con le braccia. Dopo ogni colpo o spinta si verifica rapidamente l’effetto." />
        <Callout kind="nota">
          <p>Dopo ogni colpo o spinta verifica rapidamente se la manovra ha funzionato.</p>
        </Callout>

        <h3>Se l’ostruzione non è ancora risolta</h3>
        <p>
          Continua <strong>alternando cinque colpi al dorso e cinque spinte all’addome</strong>, finché l’oggetto viene <strong>espulso</strong> oppure la vittima <strong>perde coscienza</strong>. Provalo qui: segui l’alternanza e controlla dopo ogni azione.
        </p>
        <BlowsTrainer />

        <h3>Se la vittima perde coscienza</h3>
        <Steps
          items={[
            { title: 'Sostienila', body: <p>Sostienila e adagiala a terra con attenzione.</p> },
            { title: 'Attiva il SME', body: <p>Attiva <strong>subito il SME</strong> (Servizio Medico di Emergenza), se non l’ha già fatto qualcun altro dei presenti.</p> },
            { title: 'Inizia la RCP', body: <p>Compressioni toraciche e ventilazione artificiale, secondo le linee guida BLS che hai già imparato.</p> },
          ]}
        />

        <KeyFacts
          items={[
            { label: 'La domanda da fare', value: '«Stai soffocando?»', note: 'Per intero: «Cosa c’è? Stai soffocando?»' },
            { label: 'Ostruzione lieve', value: 'solo tosse', note: 'Incoraggia a tossire, nient’altro.' },
            { label: 'Colpi al dorso, tra le scapole', value: '5', note: 'Decisi; nell’abilità pratica «fino a 5», con il palmo.' },
            { label: 'Spinte addominali (Heimlich)', value: '5', note: 'Se i 5 colpi non bastano; nell’abilità pratica «fino a 5».' },
            { label: 'Alternanza', value: '5 + 5', note: 'Finché l’oggetto esce o la vittima perde coscienza.' },
            { label: 'Verifica', value: 'dopo ogni colpo e spinta' },
            { label: 'Pugno', value: 'tra ombelico e sterno', note: 'Sulla parte inferiore dello sterno; spinta verso l’interno e verso l’alto.' },
            { label: 'Perde coscienza', value: 'a terra, SME, RCP' },
            { label: 'Cause più comuni', value: 'cibo', note: 'Negli adulti il cibo; in neonati e bambini cibo, piccoli oggetti (es. monete), giocattoli.' },
            { label: 'Annegamento', value: 'RCP senza togliere l’acqua', note: 'L’acqua aspirata è in genere poca e non va rimossa prima della RCP.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di ripasso" page="63–64">
        <Quiz id="ostruzione" questions={questions} />
      </Sub>
    </SectionPage>
  )
}
