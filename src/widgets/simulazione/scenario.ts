/**
 * "Un soccorso dall'inizio alla fine": one branching rescue per variant.
 * Every fact comes from content/02, 04, 05, 06 and 10. A wrong choice keeps the learner on the step,
 * explains why and costs scenario time; the right one moves the clock on to the next situation.
 */

export type VariantId = 'pls' | 'defibrillabile' | 'non-defibrillabile'

export type SceneId =
  | 'arrivo'
  | 'kit'
  | 'coscienza'
  | 'vie-aeree'
  | 'gas'
  | 'telefono'
  | 'compressioni'
  | 'ventilazioni'
  | 'dae-arriva'
  | 'torace'
  | 'piastre'
  | 'analisi'
  | 'shock'
  | 'rcp-dae'
  | 'segni'
  | 'pls'
  | 'pls-telefono'
  | 'pls-dae'
  | 'sme-pls'
  | 'sme-pls-dae'
  | 'sme-rcp'

export type Choice = {
  text: string
  /** The manual's reasoning, shown after the pick. */
  why: string
  ok?: true
  /** Right choice only: the next step (none = end of the rescue). */
  next?: string
  /** Right choice only: scenario seconds until the next situation. */
  time?: number
  /** Wrong choice only: scenario seconds lost. */
  cost?: number
  /** Unsafe for someone on the scene: flagged with the prohibition sign. */
  unsafe?: true
}

export type Step = { id: string; label: string; scene: SceneId; situation: string; voice?: string; section: string; choices: Choice[] }

export const variants: { id: VariantId; title: string; text: string; practise: string }[] = [
  { id: 'pls', title: 'Respira ancora', text: 'Al parco un uomo si accascia sulla panchina. Sei solo.', practise: 'Sicurezza della scena, coscienza, GAS, posizione laterale di sicurezza e chiamata al SME.' },
  { id: 'defibrillabile', title: 'Ritmo defibrillabile', text: 'Alla fermata dell’autobus un uomo crolla. C’è un passante, e in farmacia c’è un DAE.', practise: 'Il BLS-D completo: RCP 30:2, DAE, shock, ripresa del respiro e PLS.' },
  { id: 'non-defibrillabile', title: 'Ritmo non defibrillabile', text: 'Davanti a un bar un uomo cade a terra. Il DAE non consiglia lo shock.', practise: 'RCP 30:2 con il DAE collegato, fino all’arrivo del SME.' },
]

const ok = (text: string, why: string, next: string | undefined, time: number): Choice => ({ ok: true, text, why, next, time })
const no = (text: string, why: string, cost: number, unsafe = false): Choice => (unsafe ? { text, why, cost, unsafe: true } : { text, why, cost })

function build(v: VariantId): Step[] {
  const dae = v !== 'pls'
  const fv = v === 'defibrillabile'
  const where = fv ? 'alla fermata dell’autobus' : 'davanti al bar'

  const common: Step[] = [
    {
      id: 'sicurezza',
      label: 'Sicurezza della scena',
      scene: 'arrivo',
      section: 'sicurezza',
      situation:
        v === 'pls'
          ? 'Al parco un uomo sui sessant’anni si accascia sulla panchina e scivola piano a terra, senza battere la testa. Sei solo; a pochi metri passa una strada.'
          : fv
            ? 'Alla fermata dell’autobus un uomo crolla di colpo sul marciapiede, a un passo dal bordo della strada. Accanto a te c’è un passante che non sa fare la RCP: l’unico addestrato sei tu.'
            : 'Davanti a un bar un uomo cade a terra e resta immobile sul marciapiede, vicino alla strada. Si ferma un passante: non è addestrato, il soccorritore sei tu.',
      choices: [
        no('Corri subito da lui e ti inginocchi al suo fianco', 'Hai saltato la verifica della scena. Prima di qualsiasi manovra controlla che l’ambiente sia sicuro: chi soccorre non deve diventare a sua volta un infortunato.', 15, true),
        ok(
          'Ti fermi un istante e guardi la scena: traffico, fumo, fuoco, gas, cavi elettrici, sostanze, animali. Poi ti avvicini dal lato del marciapiede',
          'S-A-F-E comincia così: Stop (fermati, pensa, agisci) e Assess scene (l’ambiente è sicuro? ci si può avvicinare? ci sono pericoli?). Le auto restano sulla strada: dal marciapiede puoi avvicinarti in sicurezza.',
          'kit',
          10,
        ),
        no('Aspetti che arrivi qualcuno più esperto prima di avvicinarti', 'Prenditi il tempo per valutare la scena, poi agisci: in un arresto cardiaco le possibilità di sopravvivenza calano di circa il 10% per ogni minuto che passa.', 60),
      ],
    },
    {
      id: 'kit',
      label: 'Kit e protezioni',
      scene: 'kit',
      section: 'sicurezza',
      situation: 'La scena è sicura: il marciapiede è sgombro e non ci sono altri pericoli. Nello zaino hai un piccolo kit di primo soccorso con i DPI (dispositivi di protezione individuale).',
      choices: [
        no('Lasci il kit nello zaino: lo prenderai se servirà', 'Il kit con i DPI va tenuto a portata di mano prima di iniziare l’assistenza, soprattutto se prevedi contatto con secrezioni. Recuperarlo dopo vuol dire fermarsi in mezzo alle manovre.', 20),
        no('Infili i guanti senza guardarli: li hai comprati da poco', 'Quando indossi i guanti controlla sempre che non siano danneggiati: un guanto rotto non protegge da sangue e secrezioni.', 10),
        ok(
          'Prendi il kit, indossi i guanti monouso dopo aver controllato che siano integri e tieni pronta la maschera tascabile per la rianimazione',
          'Find ed Exposure: trovi il kit con i DPI e ti proteggi. Durante il soccorso il rischio d’infezione c’è sempre, per esempio da saliva e vomito durante le ventilazioni.',
          'coscienza',
          20,
        ),
      ],
    },
    {
      id: 'coscienza',
      label: 'Stato di coscienza',
      scene: 'coscienza',
      section: 'rcp',
      situation: 'Ti inginocchi accanto all’uomo. È disteso su un fianco, ha gli occhi chiusi e non si muove.',
      choices: [
        no('Avvicini subito la guancia alla sua bocca per sentire se respira', 'Prima si verifica la coscienza. La sequenza dell’adulto ha tre parti, in quest’ordine: sicurezza e coscienza, poi respirazione, poi RCP se serve.', 10),
        ok(
          'Gli scuoti con delicatezza le spalle e chiedi ad alta voce: «Sta bene?». Ti presenti: il tuo nome, che sei formato al primo soccorso e che vuoi aiutare',
          'È così che si verifica la coscienza. Se rispondesse lo lasceresti nella posizione in cui si trova, attiveresti il SME e lo rassicureresti. Non risponde: è incosciente.',
          'vie-aeree',
          10,
        ),
        no('Inizi subito le compressioni toraciche', 'Le compressioni si iniziano solo dopo aver accertato che non risponde e non respira normalmente.', 15),
      ],
    },
    {
      id: 'vie-aeree',
      label: 'Apertura delle vie aeree',
      scene: 'vie-aeree',
      section: 'rcp',
      situation: 'Non risponde e non reagisce quando lo scuoti. È ancora sul fianco.',
      choices: [
        ok(
          'Lo giri sulla schiena, metti una mano sulla fronte e reclini la testa, poi sollevi il mento con la punta delle dita',
          'È la manovra head tilt-chin lift (piega il capo e solleva il mento). In una persona incosciente la lingua rilasciata può cadere all’indietro e chiudere le vie aeree: va messa supina e le vie aeree vanno aperte subito.',
          'gas',
          10,
        ),
        no('Gli infili due dita in bocca per cercare che cosa la ostruisce', 'La bocca non si esplora mai alla cieca con le dita. Le vie aeree si aprono reclinando la testa e sollevando il mento; se vedi qualcosa in bocca, lo togli guardando.', 10),
        no('Lo lasci sul fianco e ascolti lì il respiro', 'Chi è incosciente va messo supino e le vie aeree vanno aperte prima di controllare il respiro: senza iperestensione del capo la lingua può bloccare il passaggio dell’aria.', 10),
      ],
    },
    {
      id: 'gas',
      label: 'Controllo del respiro (GAS)',
      scene: 'gas',
      section: 'rcp',
      situation: 'Le vie aeree sono aperte: tieni una mano sulla fronte e le dita sotto il mento. Ora controlli il respiro.',
      choices: [
        no('Osservi il torace per un minuto intero, per esserne certo', 'Il controllo del respiro dura al massimo 10 secondi: ogni secondo in più è tempo tolto alla RCP.', 50),
        no('Lasci andare la testa per avvicinarti meglio e guardi il torace', 'Il controllo si fa tenendo aperte le vie aeree: se lasci la testa la lingua può tornare a chiuderle.', 10),
        ok('Guardi il torace, ascolti i rumori del respiro e senti l’aria sulla guancia, per non più di 10 secondi', 'È il GAS (Guarda, Ascolta, Senti), sempre con le vie aeree aperte e per un massimo di 10 secondi.', 'verdetto', 10),
      ],
    },
    v === 'pls'
      ? {
          id: 'verdetto',
          label: 'Il respiro è normale?',
          scene: 'gas',
          section: 'pls',
          situation: 'In 10 secondi vedi il torace alzarsi e abbassarsi con regolarità e senti l’aria sulla guancia. Non ci sono segni di colpi a testa, collo o schiena.',
          choices: [
            no('Inizi la RCP: 30 compressioni e 2 ventilazioni', 'Respira normalmente: la RCP serve solo se il respiro è assente o non normale. Qui la priorità è tenere aperte le vie aeree.', 20),
            ok(
              'Respira normalmente: lo metti in posizione laterale di sicurezza',
              'Non è cosciente ma respira, e non sospetti traumi a testa, collo o schiena: la PLS (posizione laterale di sicurezza) tiene pervie le vie aeree e lascia defluire vomito o sangue per gravità.',
              'pls-manovra',
              2,
            ),
            no('Lo lasci supino e corri in strada a cercare aiuto', 'Supino, la lingua può chiudere le vie aeree e un eventuale vomito può essere inalato. E chi soccorre lascia la vittima solo se non c’è nessun’altra possibilità.', 30),
          ],
        }
      : {
          id: 'verdetto',
          label: 'Il respiro è normale?',
          scene: 'gas',
          section: 'catena',
          situation: 'In 10 secondi il torace non si alza. Senti solo, ogni tanto, un rantolo rumoroso.',
          choices: [
            no('Respira, anche se poco: lo metti in PLS e aspetti', 'Rari rantoli rumorosi subito dopo un arresto cardiaco (gasping, respiro agonico) non vanno mai scambiati per respiro normale: sono l’ostacolo più grande al riconoscimento dell’arresto.', 40),
            ok(
              'Il respiro non è normale: è un arresto cardiaco, dai subito l’allarme',
              'Assenza di coscienza e respiro anormale sono i due segni chiave dell’arresto cardiaco. Nel dubbio comportati come se non respirasse.',
              'allarme',
              2,
            ),
            no('Ripeti il controllo per altri 10 secondi, per sicurezza', 'Il controllo dura al massimo 10 secondi. Se hai anche solo un dubbio che il respiro sia normale, comportati come se non lo fosse.', 10),
          ],
        },
  ]

  const pls: Step[] = [
    {
      id: 'pls-manovra',
      label: 'Posizione laterale di sicurezza',
      scene: 'pls',
      section: 'pls',
      situation: 'Porta gli occhiali e ha le gambe distese. Lo metti in PLS.',
      choices: [
        no('Lo spingi lontano da te facendo leva sulla spalla', 'La vittima si ruota verso di te, tirando dal ginocchio piegato della gamba lontana, mentre la tua mano tiene ferma la sua contro la guancia: così controlli il movimento e la testa.', 15),
        ok(
          'Togli gli occhiali, allinei il corpo, braccio vicino ad angolo retto con il palmo in su, dorso dell’altra mano sulla guancia vicina, pieghi la gamba lontana e lo ruoti verso di te tirando dal ginocchio',
          'È la sequenza raccomandata da ERC. Durante la rotazione la testa non va mai lasciata; alla fine anca e ginocchio della gamba sopra sono ad angolo retto e la testa è estesa per tenere aperte le vie aeree.',
          'pls-chiamata',
          40,
        ),
        no('Lo ruoti verso di te, poi lasci la testa per sistemargli la gamba', 'Durante la rotazione la testa non va mai lasciata. La gamba sopra si sistema dopo, con anca e ginocchio ad angolo retto.', 10),
      ],
    },
    {
      id: 'pls-chiamata',
      label: 'Chiamata al SME',
      scene: 'pls-telefono',
      section: 'catena',
      situation: 'È sul fianco, con la testa estesa, e respira. Ora chiami il SME (Servizio Medico di Emergenza).',
      choices: [
        no('«Venite, un uomo sta male al parco» e chiudi subito per tornare da lui', 'Così il SME non sa dove mandare i soccorsi né che cosa troverà. Mantieni la calma, riferisci le informazioni utili e rispondi alle domande dell’operatore.', 40),
        no('Ti allontani verso l’ingresso del parco, dove il telefono prende meglio', 'Non allontanarti: chi è in PLS va tenuto sotto controllo costante, perché il respiro può cambiare. Chiama in vivavoce restando accanto a lui.', 30),
        ok(
          'Chiami il 112 in vivavoce e dici: il tuo nome, il luogo esatto, che cosa è successo, che c’è una sola persona, che non risponde ma respira ed è in PLS, che cosa hai fatto',
          'Sono le sei informazioni da dare al SME: nome, luogo esatto, dinamica, numero delle persone coinvolte, loro condizioni, soccorso prestato. Il vivavoce ti lascia le mani libere.',
          'pls-controllo',
          60,
        ),
      ],
    },
    {
      id: 'pls-controllo',
      label: 'In attesa dei soccorsi',
      scene: 'pls',
      section: 'pls',
      situation: 'L’operatore ti dice che l’ambulanza è in arrivo. L’uomo continua a respirare.',
      choices: [
        ok(
          'Resti accanto a lui e ricontrolli regolarmente il respiro; tieni d’occhio anche il braccio che resta sotto',
          'In PLS il respiro va controllato di continuo: se cambia, torni alla valutazione. Il braccio sotto deve restare compresso il meno a lungo possibile; dopo circa 30 minuti si gira la persona sul lato opposto.',
          'consegna',
          300,
        ),
        no('Ora che è al sicuro vai incontro all’ambulanza sulla strada', 'Non allontanarti dalla vittima: se il respiro si fermasse dovresti iniziare subito la RCP.', 30),
        no('Lo rimetti supino perché stia più comodo', 'Supino perde la protezione delle vie aeree: la PLS serve proprio a tenerle pervie e a far uscire per gravità vomito o sangue.', 20),
      ],
    },
  ]

  const rcp: Step[] = [
    {
      id: 'allarme',
      label: 'Allarme e DAE',
      scene: 'telefono',
      section: 'catena',
      situation: fv ? 'Il passante ti dice che nella farmacia all’angolo, a due minuti da qui, c’è un DAE (defibrillatore automatico esterno). Hai il telefono in tasca.' : 'Il passante ti dice che dentro il bar c’è un DAE (defibrillatore automatico esterno). Hai il telefono in tasca.',
      choices: [
        no('Corri tu a prendere il DAE e lasci il passante con l’uomo', 'La vittima si lascia sola solo se non c’è nessun’altra possibilità. Qui qualcuno può andare al posto tuo, e sei tu quello che sa fare la RCP.', 60),
        ok(
          'Chiami tu il 112 in vivavoce e mandi il passante a prendere il DAE, chiedendogli di tornare subito',
          'Con una vittima che non risponde e non respira normalmente si chiede aiuto: SME allertato con il cellulare in vivavoce, mani libere per la RCP, e qualcuno mandato a cercare e portare un DAE.',
          'chiamata',
          10,
        ),
        no('Inizi subito le compressioni: chiamerai quando arriva qualcuno', 'La priorità non cambia: prima si attiva il SME, poi si inizia la RCP. Senza la tua chiamata il supporto vitale avanzato (ALS) non arriva.', 30),
      ],
    },
    {
      id: 'chiamata',
      label: 'Chiamata al SME',
      scene: 'telefono',
      section: 'catena',
      situation: 'Risponde l’operatore del 112. Il telefono è in vivavoce, appoggiato a terra accanto a te.',
      choices: [
        no('«Correte, sta morendo» e riattacchi per non perdere tempo', 'Senza luogo esatto e condizioni il SME non può mandare i mezzi giusti nel posto giusto. Resta calmo, spiega con chiarezza e rispondi alle domande dell’operatore.', 40),
        ok(
          `«Mi chiamo…, sono in via… ${where}. Un uomo è crollato all’improvviso, è solo lui. Non risponde e non respira. Sto iniziando la RCP, un DAE sta arrivando.» Poi rispondi alle domande`,
          'Ci sono tutte le informazioni: nome, luogo esatto, dinamica, numero di persone, condizioni (non respira), soccorso prestato. Restare in linea e rispondere con precisione aiuta l’operatore.',
          'compressioni',
          40,
        ),
        no('Racconti tutto tenendo il telefono all’orecchio con una mano', 'Il vivavoce, o gli auricolari, servono proprio a lasciarti entrambe le mani libere per le compressioni mentre parli con l’operatore.', 15),
      ],
    },
    {
      id: 'compressioni',
      label: 'Compressioni toraciche',
      scene: 'compressioni',
      section: 'rcp',
      situation: 'Sei in ginocchio al suo fianco, sul marciapiede rigido. Inizi le compressioni.',
      choices: [
        no('Comprimi più veloce che puoi, oltre 140 al minuto', 'Troppo veloce il cuore non ha il tempo di riempirsi e svuotarsi, il rilascio non è completo e il flusso diventa inefficace. Il ritmo giusto è da 100 a 120 al minuto.', 20),
        no('Premi con delicatezza sulla parte alta dell’addome, per 2 o 3 centimetri', 'Il punto è il centro del torace, sulla metà inferiore dello sterno, mai l’addome; e compressioni poco profonde muovono troppo poco sangue. Servono almeno 5 cm, senza superare i 6.', 20),
        ok(
          'Eminenza della mano al centro del torace, l’altra sopra a dita intrecciate, braccia tese: 30 compressioni profonde 5–6 cm, a 100–120 al minuto, rilasciando del tutto senza staccare le mani',
          'Sono 30 compressioni in circa 15–18 secondi, con compressione e rilascio della stessa durata (rapporto 1:1). Le compressioni sostituiscono in parte il lavoro del cuore.',
          'ventilazioni',
          17,
        ),
      ],
    },
    {
      id: 'ventilazioni',
      label: 'Ventilazioni',
      scene: 'ventilazioni',
      section: 'rcp',
      situation: 'Trenta. La maschera tascabile del kit è accanto alla sua testa.',
      choices: [
        ok(
          'Riapri le vie aeree, maschera sul viso, 2 insufflazioni di circa 1 secondo guardando il torace che si alza, poi subito di nuovo le mani sul torace',
          'Due ventilazioni efficaci in non più di 5 secondi in tutto: le pause nelle compressioni fermano la perfusione degli organi e vanno ridotte al minimo. Poi prosegui con il ciclo 30:2.',
          'cicli',
          180,
        ),
        no('Soffi forte e a lungo, 3 o 4 secondi per ventilazione', 'Ventilazioni lunghe ed energiche superano la pressione di apertura del cardias (15–20 cm di H2O) e mandano aria nello stomaco: distensione gastrica e rischio di rigurgito.', 10),
        no('Dai 5 ventilazioni prima di riprendere le compressioni', 'Le 5 ventilazioni iniziali sono per bambini e annegati. Nell’adulto il rapporto è 30:2: 30 compressioni, 2 ventilazioni.', 10),
      ],
    },
    {
      id: 'cicli',
      label: 'Arrivo del DAE',
      scene: 'dae-arriva',
      section: 'dae',
      situation: 'Continui 30:2 senza fermarti. Dopo circa tre minuti il passante torna di corsa con il DAE.',
      choices: [
        no('Finisci prima altri cinque cicli: la RCP viene prima di tutto', 'La RCP sostiene la circolazione ma non fa ripartire il cuore: solo la defibrillazione ripristina il ritmo. Ogni minuto di ritardo nella defibrillazione riduce la sopravvivenza del 7–10%.', 90),
        ok('Accendi subito il DAE, sollevando il coperchio o premendo il pulsante, e segui la voce', 'Appena il DAE è disponibile si accende e si usa: le istruzioni vocali guidano passo per passo anche chi non è esperto.', 'torace', 5),
        no('Leggi le istruzioni stampate sul DAE prima di accenderlo', 'Il DAE guida con istruzioni vocali e pittogrammi: va acceso subito, e sarà lui a dirti che cosa fare.', 30),
      ],
    },
    {
      id: 'torace',
      label: 'Preparazione del torace',
      scene: 'torace',
      section: 'dae',
      voice: 'Scoprire il torace del paziente.',
      situation: 'Il DAE è acceso accanto alla sua testa. La camicia è sudata e il torace è villoso.',
      choices: [
        no('Attacchi le piastre sopra la camicia per fare prima', 'Le piastre vanno sul torace nudo: sopra i vestiti non sono a contatto con la pelle.', 20),
        ok(
          'Tagli la camicia con le forbici del DAE, radi i peli dove andranno le piastre e asciughi il torace con il telino',
          'Il torace va scoperto, rasato se e dove serve, asciutto e pulito, perché gli elettrodi aderiscano. Forbici, rasoio e telino fanno parte della dotazione del DAE.',
          'piastre',
          30,
        ),
        no('Lasci il sudore: le piastre attaccano lo stesso', 'Il torace va asciugato prima di applicare gli elettrodi: sulla pelle bagnata aderiscono male.', 15),
      ],
    },
    {
      id: 'piastre',
      label: 'Posizione delle piastre',
      scene: 'piastre',
      section: 'dae',
      voice: 'Applicare le piastre sul torace nudo del paziente.',
      situation: 'Il torace è pronto. Apri la confezione sigillata degli elettrodi.',
      choices: [
        no('Le metti tutte e due sul lato sinistro, vicino al cuore', 'La scarica deve attraversare il cuore ed elettrodi messi male ne riducono l’efficacia: uno va a destra sotto la clavicola, l’altro sul fianco sinistro.', 15),
        no('Una sotto ciascuna clavicola, in modo simmetrico', 'La seconda piastra non è speculare alla prima: va sul fianco sinistro del torace, subito sotto il muscolo pettorale (o sotto la mammella, in una donna).', 15),
        ok(
          'Una alla volta: la prima sotto la clavicola destra, a lato dello sterno; la seconda sul fianco sinistro, sotto il pettorale, sulla linea ascellare media. Premi forte con il palmo',
          'È la posizione antero-laterale dei pittogrammi (destra e sinistra sono quelle della vittima). Può scostarsi di qualche centimetro, ma la parte adesiva deve aderire perfettamente.',
          'analisi',
          20,
        ),
      ],
    },
    {
      id: 'analisi',
      label: 'Analisi del ritmo',
      scene: 'analisi',
      section: 'dae',
      voice: 'Analisi del ritmo in corso. Non toccare il paziente.',
      situation: 'Gli elettrodi sono collegati e il DAE parte da solo con l’analisi. Il passante è accovacciato accanto a te.',
      choices: [
        no('Continui le compressioni per non perdere tempo', 'Durante l’analisi nessuno deve toccare la vittima: i movimenti creano artefatti che confondono il DAE e interrompono l’analisi.', 15, true),
        ok('Stacchi le mani, controlli che nessuno lo tocchi e che il passante resti fermo', 'Nessuna persona e nessuna attrezzatura a contatto con la vittima, nessun movimento: così l’analisi del ritmo è affidabile.', fv ? 'shock' : 'no-shock', 10),
        no('Tieni premute le piastre con le mani perché restino attaccate', 'Le piastre si premono solo quando le applichi. Durante l’analisi e la scarica nessuno deve essere a contatto con la vittima.', 15, true),
      ],
    },
  ]

  const shockable: Step[] = [
    {
      id: 'shock',
      label: 'Scarica',
      scene: 'shock',
      section: 'dae',
      voice: 'Shock consigliato. Allontanarsi dal paziente. Premere il pulsante di scarica.',
      situation: 'Il pulsante di scarica lampeggia. Il passante ha ancora una mano sulla spalla dell’uomo.',
      choices: [
        no('Premi subito: è questione di un attimo', 'Durante la scarica nessuno deve toccare la vittima, nemmeno il passante. Prima controlli e allontani tutti.', 10, true),
        no('Aspetti l’ambulanza: la scarica la decide il personale sanitario', 'Il DAE riconosce da solo il ritmo e ti chiede la scarica: va erogata appena la richiede, perché conta la defibrillazione precoce.', 60),
        ok(
          'Guardi la vittima dalla testa ai piedi, dici ad alta voce «Via io, via voi, via tutti», aspetti che il passante si allontani e premi il pulsante',
          'Prima della scarica ci si accerta che nessuno sia a contatto con la vittima, poi si eroga appena il DAE lo chiede. Un DAE completamente automatico la erogherebbe da solo dopo alcuni secondi di preavviso.',
          'dopo-shock',
          5,
        ),
      ],
    },
    {
      id: 'dopo-shock',
      label: 'Dopo lo shock',
      scene: 'rcp-dae',
      section: 'dae',
      voice: 'Shock erogato. Iniziare la RCP.',
      situation: 'La scarica è partita. L’uomo non si muove e non respira.',
      choices: [
        ok('Riprendi subito la RCP 30:2 e continui per 2 minuti, finché il DAE non ti dice di fermarti', 'Subito dopo un singolo shock si riprende immediatamente la RCP per 2 minuti; poi il DAE rianalizza da solo e ti scandisce i tempi.', 'segni', 60),
        no('Ti fermi a controllare se respira, per capire se ha funzionato', 'Dopo lo shock non si perde tempo in controlli: si riprende subito la RCP. Ti fermi solo se comincia a muoversi, ad aprire gli occhi o a respirare.', 15),
        no('Stacchi le piastre: il DAE ha fatto il suo lavoro', 'Il DAE resta acceso e collegato: dopo 2 minuti di RCP analizza di nuovo il ritmo e, se serve, chiede un altro shock.', 20),
      ],
    },
    {
      id: 'segni',
      label: 'Segni di vita',
      scene: 'segni',
      section: 'rcp',
      situation: 'Dopo circa un minuto di compressioni l’uomo tossisce, muove un braccio e apre gli occhi.',
      choices: [
        no('Non ti fermi: continui le compressioni fino all’arrivo dell’ambulanza', 'La RCP si interrompe quando la vittima comincia a muoversi, apre gli occhi e respira. Qualche compressione in più subito dopo la ripresa non fa danni, ma ora devi fermarti e ricontrollarla.', 20),
        ok('Ti fermi e ricontrolli il respiro: guardi, ascolti e senti', 'Ci si ferma a ricontrollare la vittima solo se si muove, apre gli occhi o respira da sola: è questo il momento.', 'pls-dopo', 10),
        no('Spegni il DAE e togli le piastre: si è ripreso', 'Anche quando la vittima torna a respirare il DAE resta collegato e acceso, e tu continui a seguire le sue indicazioni.', 20),
      ],
    },
    {
      id: 'pls-dopo',
      label: 'Respira di nuovo',
      scene: 'pls-dae',
      section: 'pls',
      situation: 'Respira normalmente, ma è confuso e non risponde bene. Le piastre sono ancora sul torace.',
      choices: [
        no('Togli le piastre per metterlo più comodo sul fianco', 'Le piastre restano: il DAE va lasciato collegato e acceso fino all’arrivo del SME.', 20),
        ok(
          'Lo metti in posizione laterale di sicurezza lasciando il DAE acceso e collegato, e continui a controllare il respiro e le indicazioni del DAE',
          'Quando la vittima torna a respirare normalmente si mette, se necessario, in PLS con il DAE collegato e acceso, continuando a controllare il respiro.',
          'consegna',
          180,
        ),
        no('Lo lasci supino e vai incontro all’ambulanza', 'Supino e senza nessuno accanto, lingua o vomito possono chiudergli le vie aeree. Non abbandonare mai l’infortunato.', 30),
      ],
    },
  ]

  const nonShockable: Step[] = [
    {
      id: 'no-shock',
      label: 'Shock non consigliato',
      scene: 'rcp-dae',
      section: 'dae',
      voice: 'Non è richiesta nessuna scarica.',
      situation: 'Il DAE ha finito l’analisi. L’uomo non si muove e non respira.',
      choices: [
        no('Il DAE dev’essere guasto: stacchi e riattacchi le piastre', 'Il DAE ha fatto il suo lavoro: i ritmi non defibrillabili (attività elettrica senza polso e asistolia) non rispondono allo shock. Si riprende subito la RCP.', 30),
        no('Ti fermi: se lo shock non serve, il cuore sta battendo', '«Nessuna scarica» non vuol dire che il cuore batte: non respira, quindi la RCP deve continuare.', 30),
        ok('Riprendi subito la RCP 30:2 e aspetti le nuove istruzioni del DAE fra 2 minuti', 'Dopo l’avviso di shock non consigliato, se la vittima non respira normalmente, si riprende immediatamente la RCP: il DAE rianalizza da solo dopo 2 minuti.', 'seconda-analisi', 120),
      ],
    },
    {
      id: 'seconda-analisi',
      label: 'Nuova analisi',
      scene: 'analisi',
      section: 'dae',
      voice: 'Analisi del ritmo in corso. Non toccare il paziente.',
      situation: 'Sono passati 2 minuti di RCP. Il DAE avvia una nuova analisi mentre stai comprimendo.',
      choices: [
        no('Finisci la serie di 30 compressioni, poi ti fermi', 'Quando il DAE analizza ti fermi subito: le compressioni creano artefatti e interrompono l’analisi.', 10, true),
        ok('Stacchi le mani e controlli che nessuno lo tocchi', 'A ogni analisi vale la stessa regola: nessuno a contatto con la vittima, nessun movimento.', 'ancora', 10),
        no('Lo sposti su un punto più comodo mentre il DAE analizza', 'Durante l’analisi la vittima non va toccata né mossa: ogni movimento disturba il segnale.', 10, true),
      ],
    },
    {
      id: 'ancora',
      label: 'Fino all’arrivo del SME',
      scene: 'rcp-dae',
      section: 'rcp',
      voice: 'Non è richiesta nessuna scarica. Iniziare la RCP.',
      situation: 'Di nuovo nessuna scarica. Sei stanco, ma senti la sirena dell’ambulanza avvicinarsi.',
      choices: [
        no('Ti fermi e vai sulla strada a fare segno all’ambulanza', 'La RCP non si sospende finché il personale specializzato non prende in mano la situazione: ogni pausa interrompe la perfusione degli organi.', 30),
        ok('Continui la RCP 30:2 senza fermarti finché il personale del SME non prende il tuo posto', 'Si va avanti fino all’arrivo di soccorsi qualificati, finché la vittima non mostra segni di vita o finché non sei esausto.', 'consegna', 90),
      ],
    },
  ]

  const leave = no('Te ne vai: ora ci pensano loro', 'Il tuo rapporto serve: chi arriva deve sapere che cosa è successo e che cosa hai fatto, per trattare la vittima di conseguenza.', 30)
  const handover: Step = {
    id: 'consegna',
    label: 'Passaggio al SME',
    scene: v === 'pls' ? 'sme-pls' : fv ? 'sme-pls-dae' : 'sme-rcp',
    section: 'dae',
    situation:
      v === 'pls'
        ? 'Arriva l’ambulanza. Il personale ti chiede che cosa è successo.'
        : fv
          ? 'Arriva l’équipe di supporto vitale avanzato (ALS). L’uomo respira, è in PLS, con il DAE collegato.'
          : 'Arriva l’équipe di supporto vitale avanzato (ALS) e ti chiede di continuare le compressioni mentre si prepara.',
    choices:
      v === 'pls'
        ? [
            leave,
            ok(
              'Riferisci: malore sulla panchina, non rispondeva ma respirava, l’hai messo in PLS e hai chiamato il 112; ora respira ancora; da quanto tempo è successo',
              'Un breve rapporto permette al personale di trattare la vittima di conseguenza: natura dell’evento, condizioni iniziali, manovre effettuate, condizioni attuali, tempo trascorso.',
              undefined,
              0,
            ),
          ]
        : fv
          ? [
              no('Stacchi il DAE e lo riponi nella custodia prima che arrivino', 'Il DAE resta acceso e collegato: l’équipe può usare gli elettrodi già applicati oppure sostituirli con i propri.', 20),
              ok(
                'Lasci il DAE acceso e collegato e riferisci: arresto improvviso alla fermata, non respirava, RCP 30:2, uno shock, ora respira; da quanto tempo è successo',
                'Natura dell’evento, condizioni iniziali, manovre effettuate, condizioni attuali e tempo stimato dall’arresto: con questo rapporto l’équipe tratta la vittima di conseguenza.',
                undefined,
                0,
              ),
              leave,
            ]
          : [
              ok(
                'Continui la RCP, lasci il DAE acceso e collegato e riferisci: che cosa è successo, com’era all’inizio, le manovre fatte (due analisi senza scarica), com’è ora e da quanto tempo',
                'Al soccorritore può essere chiesto di continuare la RCP mentre l’équipe si prepara. Il breve rapporto permette di trattare la vittima di conseguenza.',
                undefined,
                0,
              ),
              no('Ti fermi subito e ti alzi: adesso tocca a loro', 'Ti hanno chiesto di continuare: fermarti adesso interromperebbe la perfusione proprio mentre l’équipe si prepara.', 20),
              no('Stacchi gli elettrodi per lasciare spazio alla loro attrezzatura', 'Il DAE resta acceso e collegato: sarà l’équipe a decidere se usare gli elettrodi già applicati o i propri.', 20),
            ],
  }

  return [...common, ...(dae ? [...rcp, ...(fv ? shockable : nonShockable)] : pls), handover]
}

const graphs = Object.fromEntries(variants.map((v) => [v.id, Object.fromEntries(build(v.id).map((s) => [s.id, s]))])) as Record<VariantId, Record<string, Step>>

export const scenario = (v: VariantId) => graphs[v]
export const START = 'sicurezza'

export type Decision = { step: string; label: string; section: string; ok: boolean; lost: number; unsafe: boolean }

export type SimState = {
  variant: VariantId
  at: string
  /** Scenario seconds since arrival. */
  clock: number
  log: Decision[]
  /** Wrong choices already tried on the current step. */
  wrong: number[]
  picked?: number
  solved: boolean
  over: boolean
}

export const start = (variant: VariantId): SimState => ({ variant, at: START, clock: 0, log: [], wrong: [], solved: false, over: false })

export function choose(s: SimState, i: number): SimState {
  const step = graphs[s.variant][s.at]
  const c = step.choices[i]
  if (!c || s.over || s.solved || s.wrong.includes(i)) return s
  if (!c.ok) return { ...s, wrong: [...s.wrong, i], picked: i, clock: s.clock + (c.cost ?? 0) }
  const tried = s.wrong.map((w) => step.choices[w])
  const decision = { step: step.id, label: step.label, section: step.section, ok: tried.length === 0, lost: tried.reduce((t, w) => t + (w.cost ?? 0), 0), unsafe: tried.some((w) => w.unsafe) }
  return { ...s, picked: i, solved: true, log: [...s.log, decision] }
}

/** After a right choice: on to the next situation, or the end of the rescue. */
export function advance(s: SimState): SimState {
  if (!s.solved || s.picked === undefined) return s
  const c = graphs[s.variant][s.at].choices[s.picked]
  if (!c.next) return { ...s, over: true }
  return { ...s, at: c.next, clock: s.clock + (c.time ?? 0), wrong: [], picked: undefined, solved: false }
}

export type SimResult = { right: number; total: number; lost: number; unsafe: number; clock: number }

export function summary(s: SimState): SimResult & { revise: string[] } {
  const wrong = s.log.filter((d) => !d.ok)
  return {
    right: s.log.length - wrong.length,
    total: s.log.length,
    lost: wrong.reduce((t, d) => t + d.lost, 0),
    unsafe: s.log.filter((d) => d.unsafe).length,
    clock: s.clock,
    revise: [...new Set(wrong.map((d) => d.section))],
  }
}

/** More right decisions wins; on a tie, less time lost. */
export const better = (a: SimResult, b?: SimResult) => !b || a.right / a.total > b.right / b.total || (a.right / a.total === b.right / b.total && a.lost < b.lost)

export const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
