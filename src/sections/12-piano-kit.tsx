import { ModelStage } from '../components/three/ModelStage'
import { Callout, Checklist, Figure, KeyFacts, Quiz, SectionPage, Stage, Sub } from '../components/ui'
import questions from '../data/quiz/12-piano-kit'
import { KitSort, KitStato } from '../widgets/s12/Kit'
import { kit } from '../widgets/s12/contenuto'
import { PianoEmergenza } from '../widgets/s12/PianoEmergenza'

const [minima, facoltativi, medicamenti, extra] = kit

export default function PianoKit() {
  return (
    <SectionPage
      slug="piano-kit"
      lead={
        <p>
          Due cose da preparare prima che servano: un piano d’emergenza con i numeri utili, appeso dove tutti lo trovano, e un kit di primo soccorso completo e controllato. Qui compili e stampi il tuo piano e spunti il contenuto del tuo kit.
        </p>
      }
    >
      <Sub id="piano" title="Piano d’emergenza domestico" page="103–104">
        <p>
          Nel manuale questa sezione comprende il piano d’emergenza domestico (p. 104), il kit di primo soccorso (p. 104) e un esempio di piano d’emergenza domestico da compilare (p. 106).
        </p>
        <div className="flex max-w-[68ch] items-start gap-5">
          <img src="/img/iso7010/e004-telefono-emergenza.svg" alt="Segnale ISO 7010 E004: telefono di emergenza" className="w-20 shrink-0 md:w-24" />
          <p>
            Se in casa capita un incidente, conviene avere sempre a portata di mano i numeri di telefono utili per raggiungere il SME (Servizio Medico d’Emergenza), oppure la polizia, i vigili del fuoco, il centro antiveleni, ecc.
          </p>
        </div>
        <ul>
          <li>Ogni componente della famiglia deve poter trovare subito queste informazioni.</li>
          <li>
            Il consiglio è di esporle in un punto comune della casa, per esempio vicino a un telefono: così le trova anche chi si trova a gestire un incidente in casa senza abitarci stabilmente (per esempio babysitter, nonni, ecc.).
          </li>
        </ul>
        <Callout kind="obbligo">
          <p>Se in casa ci sono ragazzi e/o bambini, insegna loro che cosa fare e chi chiamare in caso di emergenza.</p>
        </Callout>
        <p>
          Alla fine del manuale c’è un esempio di piano domestico d’emergenza, da personalizzare secondo le tue esigenze. Lo trovi più sotto come modulo: <a href="#esempio-piano">compila e stampa il tuo piano</a>.
        </p>
      </Sub>

      <Sub id="kit" title="Kit di primo soccorso (first aid)" page="104–105">
        <p>
          In ogni abitazione deve esserci sempre un kit di primo soccorso, per rispondere sia alle necessità personali (per esempio i farmaci) sia a quelle che possono nascere in un’emergenza. Il suo contenuto di base deve metterti in condizione di prestare il BLS (Basic Life Support) in modo efficace.
        </p>
        <Figure file="img/kit-pronto-soccorso-contenuto.jpg" caption="Il contenuto di un kit reale disposto su un tavolo: guanti monouso, cerotto, bende e garze, coperta isotermica, forbici e un manuale. Le scritte sulle confezioni sono in tedesco." />

        <h3>Dotazione minima di un kit standard</h3>
        <p>Questi 14 articoli formano la dotazione minima di un kit di primo soccorso standard. Spunta quelli che hai già: le spunte restano salvate.</p>
        <Checklist id={minima.id} items={minima.items} columns={2} />

        <h3>Articoli facoltativi ma consigliati</h3>
        <p>Non sono obbligatori, ma sono raccomandati (11 voci).</p>
        <Checklist id={facoltativi.id} items={facoltativi.items} columns={2} />

        <h3>Medicamenti e pomate</h3>
        <p>
          L’uso o la vendita di medicamenti e pomate possono essere soggetti a restrizioni legali: per questo spesso mancano nei kit di primo soccorso in commercio. Puoi comprarli in farmacia e aggiungerli al tuo kit personale. I medicamenti consigliati sono 6:
        </p>
        <Checklist id={medicamenti.id} items={medicamenti.items} columns={2} />
        <Callout kind="attenzione">
          <p>In diversi Paesi è vietato somministrare medicinali a terzi, perché si rischia di scatenare reazioni allergiche.</p>
        </Callout>

        <h3>Personalizzare il kit</h3>
        <p>Puoi arricchire ulteriormente il kit con altri materiali, per esempio:</p>
        <Checklist id={extra.id} items={extra.items} columns={2} />

        <h3>Acquisto e manutenzione</h3>
        <p>Quando compri un kit di primo soccorso:</p>
        <ul>
          <li>accertati che sia adatto alle tue necessità;</li>
          <li>tieni sotto controllo la scadenza di ciò che contiene.</li>
        </ul>
        <KitStato />

        <Stage title="In quale gruppo?" hint="8 articoli a caso. Scegli il gruppo in cui li mette il manuale.">
          <KitSort />
        </Stage>

        <Stage title="Un kit da vicino" hint="Trascina per ruotare la valigetta." footer="Modello generico: il suo contenuto non corrisponde esattamente alla dotazione indicata dal manuale.">
          {/* 3D-CHECK */}
          <ModelStage
            src="/models/first-aid-kit.glb"
            alt="Valigetta di primo soccorso aperta, piena di materiali: rotoli di benda, cotone, forbici, una siringa, pomate e flaconi di compresse"
            autoRotate
            hotspots={[
              { at: [0, -0.35, 0.55], label: 'Contenitore protettivo', text: <p>È la prima voce della dotazione minima: deve essere a prova d’acqua se usi il kit in ambienti bagnati.</p> },
              { at: [-0.45, 0.15, 0.2], label: 'Bende', text: <p>Bende e bendaggio triangolare fanno parte della dotazione minima.</p> },
              { at: [0.4, 0.12, 0.2], label: 'Forbici', text: <p>Nella dotazione minima: abbastanza robuste da tagliare i vestiti.</p> },
              { at: [0.1, 0.15, -0.15], label: 'Siringa', text: <p>La siringa per irrigazione è tra gli articoli facoltativi ma consigliati.</p> },
              { at: [-0.25, 0.18, -0.25], label: 'Pomate e compresse', text: <p>Medicamenti e pomate spesso mancano nei kit in commercio per restrizioni legali: si comprano in farmacia. Controlla le scadenze.</p> },
            ]}
          />
        </Stage>
      </Sub>

      <Sub id="esempio-piano" title="Esempio di piano d’emergenza domestico" page="106">
        <p>
          Nel manuale la pagina 106 è un modulo da compilare. Qui lo trovi con tutti i suoi campi e le sue indicazioni: scrivi i tuoi dati, poi premi «Stampa il piano» per avere un foglio da appendere vicino al telefono.
        </p>
        <PianoEmergenza />
        <KeyFacts
          title="Il modulo in numeri"
          items={[
            { label: 'Blocchi', value: '3', note: 'Chiamare, Fornire, Ulteriori informazioni importanti.' },
            { label: 'Campi da compilare', value: '7', note: 'Chiamare; il proprio indirizzo; il proprio numero di telefono; centro antiveleni; medico personale; familiare da contattare; vicini di casa.' },
            { label: 'Indicazioni fisse', value: '3', note: 'La domanda che farà il SME; restare in linea calmi seguendo le istruzioni; mandare qualcuno in strada a segnalare il punto esatto.' },
          ]}
        />
      </Sub>

      <Sub id="dati-chiave" title="Dati chiave" page="104–106">
        <KeyFacts
          items={[
            { label: 'Numeri utili', value: 'vicino al telefono', note: 'SME, polizia, vigili del fuoco, centro antiveleni, ecc., esposti in un luogo comune perché li trovino tutti, anche babysitter, nonni, ecc.' },
            { label: 'Ragazzi e bambini', value: 'sanno chi chiamare', note: 'Va insegnato loro cosa fare e chi chiamare in caso di emergenza.' },
            { label: 'Piano d’emergenza d’esempio', value: 'p. 106', note: 'Alla fine del manuale, da personalizzare.' },
            { label: 'Kit di primo soccorso in casa', value: 'sempre', note: 'Il contenuto di base deve permettere di prestare il BLS in modo efficace.' },
            { label: 'Dotazione minima', value: '14 voci', note: 'Dalla valigetta protettiva (a prova d’acqua negli ambienti bagnati) alle medicazioni adesive di varie misure.' },
            { label: 'Facoltativi ma consigliati', value: '11 voci', note: 'Tra cui maschera per rianimazione oronasale, coperta isotermica, ghiaccio istantaneo, manuale di primo soccorso e lista dei numeri d’emergenza.' },
            { label: 'Medicamenti consigliati', value: '6 voci', note: 'Spesso assenti nei kit in commercio per restrizioni legali, si comprano in farmacia. In diversi Paesi è proibito darli a terzi, per il rischio di reazioni allergiche.' },
            { label: 'Extra per personalizzare', value: '4 voci', note: 'Tamponi di cotone, aghi, una piccola luce, un termometro.' },
            { label: 'All’acquisto', value: '2 controlli', note: 'Che il kit sia adatto alle tue necessità; le scadenze del contenuto.' },
          ]}
        />
      </Sub>

      <Sub id="ripasso" title="Domande di autoverifica" page="103–106">
        <p>Queste domande non vengono dal manuale: sono state scritte per il corso, basandosi solo sul testo delle pp. 103–106.</p>
        <Quiz id="piano-kit" questions={questions} title="Domande di autoverifica" />
      </Sub>
    </SectionPage>
  )
}
