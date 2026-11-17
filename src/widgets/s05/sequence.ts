/**
 * The adult BLS sequence ("Sequenza completa", manuale pp. 39–50) as a pure state machine.
 * The scenario decides what the learner finds (responds? breathes normally?…); each node asks what to do.
 * A wrong choice explains why and stays on the node; the right one moves on.
 */

export type Respiro = 'normale' | 'gasping' | 'debole' | 'assente'

export type Scenario = {
  risponde: boolean
  respiro: Respiro
  /** Drowning victim: 5 initial rescue breaths and 1 minute of CPR before going for help. */
  annegato: boolean
  /** Trained and willing to ventilate; otherwise compressions only. */
  addestrato: boolean
  problema: 'nessuno' | 'torace' | 'rigurgito'
  secondo: boolean
  dae: boolean
}

export type NodeId =
  | 'sicurezza'
  | 'coscienza'
  | 'cosciente'
  | 'fineCosciente'
  | 'vieAeree'
  | 'gas'
  | 'esito'
  | 'pls'
  | 'finePls'
  | 'allarme'
  | 'compressioni'
  | 'ventilazioni'
  | 'torace'
  | 'rigurgito'
  | 'ciclo'
  | 'cambio'
  | 'dae'
  | 'stop'
  | 'fine'

export type Choice = { id: string; text: string; ok: boolean; why: string }
export type SeqNode = { id: NodeId; point: number; title: string; prompt: string; choices: Choice[]; end?: boolean }
export type SimState = { at: NodeId; s: Scenario; done: { at: NodeId; choice: string }[]; tried: string[]; errors: number; ricontrollo?: boolean }
export type Outcome = 'cosciente' | 'pls' | 'rcp'

/** The nine points of the operational summary, for the progress rail. */
export const points = ['Sicurezza', 'Coscienza', 'Vie aeree', 'Respirazione', 'Allarme', '30 compressioni', '2 ventilazioni', 'Ciclo 30:2', 'Quando fermarsi']

const osservato: Record<Respiro, string> = {
  normale: 'Il torace si alza e si abbassa con regolarità, senti il rumore del respiro e l’aria sulla guancia.',
  gasping: 'Il torace si muove appena; ogni tanto senti un rantolo raro e rumoroso, poi di nuovo silenzio.',
  debole: 'Il respiro è debolissimo, quasi impercettibile: non sei sicuro che sia normale.',
  assente: 'Il torace è fermo, non senti rumori respiratori né aria sulla guancia.',
}

export function describe(s: Scenario): string {
  const dove = s.annegato
    ? 'Al lago, una persona adulta è appena stata portata a riva dall’acqua. Sei da solo con lei.'
    : 'In un supermercato una persona adulta si accascia a terra davanti a te. Intorno ci sono alcuni passanti.'
  const tu = s.addestrato ? 'Hai seguito un corso BLS e te la senti di ventilare.' : 'Non sei addestrato a ventilare e non te la senti.'
  return `${dove} ${tu}`
}

export function node(id: NodeId, s: Scenario, ricontrollo = false): SeqNode {
  switch (id) {
    case 'sicurezza':
      return {
        id, point: 1, title: 'Sicurezza', prompt: 'Che cosa fai per prima cosa?',
        choices: [
          { id: 'corri', ok: false, text: 'Corri subito dalla persona e scuotila', why: 'Prima di avvicinarti controlla la scena: né tu, né la persona infortunata, né i presenti dovete correre pericoli. Se la scena non è sicura, non procedere finché non lo diventa.' },
          { id: 'scena', ok: true, text: 'Verifica che la scena sia sicura per te, per la persona infortunata e per i presenti', why: 'Giusto. La scena è sicura e puoi avvicinarti. Se non lo fosse stata, avresti dovuto aspettare che lo diventasse.' },
          { id: 'rcp', ok: false, text: 'Inizia subito le compressioni toraciche', why: 'Le compressioni vengono dopo: prima la sicurezza della scena, poi la coscienza e il respiro.' },
        ],
      }
    case 'coscienza':
      return {
        id, point: 2, title: 'Coscienza', prompt: 'La scena è sicura. Come verifichi se la persona è cosciente?',
        choices: [
          { id: 'testa', ok: false, text: 'Scuotile con forza la testa finché non apre gli occhi', why: 'Si scuotono con delicatezza le spalle, non la testa, chiedendo ad alta voce «Stai bene?».' },
          { id: 'occhi', ok: false, text: 'Guardala da lontano: se ha gli occhi chiusi è incosciente', why: 'Da lontano non lo puoi capire: avvicinati, scuotile delicatamente le spalle e chiedile ad alta voce «Stai bene?».' },
          { id: 'spalle', ok: true, text: 'Scuotile con delicatezza le spalle e chiedi ad alta voce «Stai bene?»; presentati (nome, addestramento, volontà di aiutare) e chiedi il permesso di aiutare', why: 'Giusto: verifichi lo stato di coscienza e ti presenti.' },
        ],
      }
    case 'cosciente':
      return {
        id, point: 2, title: 'Risponde', prompt: 'Apre gli occhi e ti risponde: è cosciente. Che cosa fai?',
        choices: [
          { id: 'supina', ok: false, text: 'Mettila supina e aprile le vie aeree', why: 'Questo serve solo se non risponde. Una persona cosciente va lasciata nella posizione in cui si trova.' },
          { id: 'resta', ok: true, text: 'Lasciala nella posizione in cui si trova ed evita che subisca altri danni; attiva il SME o chiedi aiuto se serve; rassicurala, cerca di capire che cosa è successo, tieni lontani gli astanti e ricontrollala a intervalli regolari', why: 'Giusto. Il tuo atteggiamento premuroso la aiuta a sentirsi più sicura, più tranquilla e più collaborativa.' },
          { id: 'folla', ok: false, text: 'Chiama vicino a te i presenti, così vede quante persone la stanno aiutando', why: 'Gli astanti vanno tenuti lontani: aggiungerebbero stress a una persona probabilmente già agitata e in ansia.' },
        ],
      }
    case 'fineCosciente':
      return { id, point: 2, title: 'Fine del ramo: è cosciente', prompt: 'Resti con lei, la rassicuri e la ricontrolli regolarmente. Non serve la RCP.', choices: [], end: true }
    case 'vieAeree':
      return {
        id, point: 3, title: 'Vie aeree', prompt: 'Non risponde e non si muove. Che cosa fai adesso?',
        choices: [
          { id: 'via', ok: false, text: 'Lasciala com’è e allontanati a cercare aiuto', why: 'Lascia la vittima sola solo se non c’è alternativa. E prima aprile le vie aeree: in chi è incosciente la lingua può cadere all’indietro e chiuderle.' },
          { id: 'vent', ok: false, text: 'Dalle subito 2 ventilazioni', why: 'È presto: prima apri le vie aeree e controlla se respira normalmente.' },
          { id: 'apri', ok: true, text: 'Mettila supina e aprile le vie aeree: una mano sulla fronte per reclinare il capo, la punta delle dita sotto il mento per sollevarlo', why: 'Giusto: è la manovra head tilt-chin lift, «piega il capo e solleva il mento».' },
        ],
      }
    case 'gas':
      return {
        id, point: 4, title: 'Respirazione (GAS)', prompt: ricontrollo ? 'Mentre la controlli, il respiro cambia. Ricontrollalo: come fai?' : 'Le vie aeree sono aperte. Come controlli il respiro?',
        choices: [
          { id: 'gas', ok: true, text: 'Tenendo aperte le vie aeree, guarda il torace, ascolta i rumori respiratori e senti l’aria sulla guancia, per al massimo 10 secondi', why: 'Giusto: è il GAS, Guarda, Ascolta, Senti.' },
          { id: 'lungo', ok: false, text: 'Osserva per almeno 30 secondi, per non sbagliare', why: 'Il controllo dura al massimo 10 secondi. Nel dubbio, comportati come se non respirasse.' },
          { id: 'molla', ok: false, text: 'Lascia andare la testa e appoggia l’orecchio sul petto', why: 'Le vie aeree devono restare aperte durante il controllo: tieni il capo iperesteso e avvicina guancia e orecchio a naso e bocca.' },
        ],
      }
    case 'esito': {
      const normale = s.respiro === 'normale'
      const noWhy = { gasping: 'Giusto: rantoli rari e rumorosi (gasping) non sono una respirazione normale.', debole: 'Giusto: un respiro debole di cui non sei sicuro si considera non normale.', assente: 'Giusto: il respiro è assente.', normale: '' }[s.respiro]
      const siWhy = {
        gasping: 'No: subito dopo un arresto cardiaco possono esserci rari rantoli rumorosi (gasping). Non vanno mai scambiati per una respirazione normale.',
        debole: 'No: se non sei sicuro che il respiro sia normale, comportati come se la vittima non respirasse.',
        assente: 'No: il torace è fermo e non c’è flusso d’aria, il respiro è assente.',
        normale: 'Giusto: il respiro è normale, la RCP non serve.',
      }[s.respiro]
      return {
        id, point: 4, title: 'Respirazione (GAS)', prompt: `${osservato[s.respiro]} Che cosa concludi?`,
        choices: [
          { id: 'non', ok: !normale, text: 'Il respiro non è normale o è assente', why: normale ? 'No: il torace si muove con regolarità e senti l’aria, è un respiro normale.' : noWhy },
          { id: 'aspetta', ok: false, text: 'Non sei sicuro: continua a osservare ancora per un minuto', why: 'Il controllo dura al massimo 10 secondi. Se hai anche solo un dubbio, comportati come se il respiro non fosse normale.' },
          { id: 'normale', ok: normale, text: 'Respira normalmente', why: siWhy },
        ],
      }
    }
    case 'pls':
      return {
        id, point: 4, title: 'Respira normalmente', prompt: 'Respira normalmente. Come procedi?',
        choices: [
          { id: 'rcp', ok: false, text: 'Inizia comunque le compressioni, per sicurezza', why: 'Se il respiro è normale la RCP non serve: metti la persona in sicurezza e chiama il SME.' },
          { id: 'trauma', ok: false, text: 'Mettila in posizione laterale di sicurezza anche se è caduta da una scala e potrebbe essersi fatta male alla schiena', why: 'La PLS non va eseguita se sospetti traumi o danni a testa, collo o schiena: in quel caso aiutala a respirare tenendo aperte le vie aeree fino all’arrivo del SME.' },
          { id: 'pls', ok: true, text: 'Mettila in posizione laterale di sicurezza (non se sospetti traumi a testa, collo o schiena), chiama o fai chiamare il SME e continua a controllare il respiro', why: 'Giusto: in PLS le vie aeree restano pervie e, se vomita, non inala il materiale.' },
        ],
      }
    case 'finePls':
      return { id, point: 4, title: 'Fine del ramo: respira', prompt: 'Resti accanto a lei e controlli il respiro senza sosta. Se cambia, torni al controllo del respiro (punto 4).', choices: [], end: true }
    case 'allarme':
      return {
        id, point: 5, title: 'Allarme', prompt: 'Il respiro non è normale. Che cosa fai adesso?',
        choices: [
          { id: 'chiama', ok: !s.annegato, text: 'Fai chiamare i soccorsi o chiama tu, dicendo che la vittima non respira, con il telefono in vivavoce; lasciala sola solo se non c’è alternativa', why: s.annegato ? 'Per un annegato (come per un bambino) la sequenza cambia: prima 5 respirazioni assistite iniziali e 1 minuto di RCP, poi vai a cercare aiuto.' : 'Giusto: con il vivavoce comunichi più facilmente con il SME e hai le mani libere.' },
          { id: 'cinque', ok: s.annegato, text: 'Dai 5 respirazioni assistite iniziali ed esegui 1 minuto di RCP prima di andare a cercare aiuto', why: s.annegato ? 'Giusto: nell’annegamento l’arresto nasce dall’asfissia, quindi le ventilazioni sono prioritarie.' : 'Le 5 respirazioni iniziali e il minuto di RCP prima di cercare aiuto valgono per bambini e annegati. Per questo adulto dai subito l’allarme.' },
          { id: 'muto', ok: false, text: 'Chiama il SME senza perdere tempo a spiegare come respira', why: 'Quando dai l’allarme specifica sempre che la vittima non respira.' },
        ],
      }
    case 'compressioni':
      return {
        id, point: 6, title: '30 compressioni', prompt: s.annegato ? 'Hai dato le 5 respirazioni iniziali. Come esegui le compressioni?' : 'L’allarme è partito. Come esegui le compressioni?',
        choices: [
          { id: 'piano', ok: false, text: 'Comprimi di 2–3 cm, il più velocemente possibile', why: 'Troppo poco profonde e troppo veloci: il cuore non fa in tempo a riempirsi e svuotarsi e il circolo è inefficace. Servono 5–6 cm a 100–120 al minuto.' },
          { id: 'giusto', ok: true, text: 'In ginocchio a lato, su una superficie rigida se possibile: eminenza tenar di una mano al centro del torace (parte inferiore dello sterno), l’altra mano sopra, dita incrociate, braccia tese e perpendicolari. 30 compressioni profonde 5–6 cm a 100–120 al minuto, con rilascio completo senza staccare le mani (rapporto 1:1)', why: 'Giusto: posizione, profondità, ritmo e rilascio corretti.' },
          { id: 'pancia', ok: false, text: 'Mani sulla parte alta dell’addome e gomiti piegati per ammortizzare', why: 'Non premere sulla parte alta dell’addome né sull’estremità inferiore dello sterno, e tieni le braccia ben dritte. Le mani vanno al centro del torace.' },
        ],
      }
    case 'ventilazioni':
      return {
        id, point: 7, title: '2 ventilazioni', prompt: s.addestrato ? 'Hai finito le 30 compressioni. E ora?' : 'Hai finito le 30 compressioni. Ricorda: non sei addestrato a ventilare e non te la senti. E ora?',
        choices: [
          { id: 'forte', ok: false, text: 'Soffia forte e a lungo, così entra più aria', why: 'Ventilazioni troppo energiche o lunghe mandano aria nello stomaco (distensione gastrica). Ogni ventilazione dura circa 1 secondo.' },
          { id: 'sole', ok: !s.addestrato, text: 'Salta le ventilazioni e continua con sole compressioni, senza interruzioni, a 100–120 al minuto', why: s.addestrato ? 'Sei addestrato e te la senti: dopo 30 compressioni dai 2 ventilazioni. Le sole compressioni sono per chi non è addestrato o non se la sente.' : 'Giusto: chi non è addestrato o non se la sente di ventilare esegue sole compressioni continue.' },
          { id: 'due', ok: s.addestrato, text: 'Riapri le vie aeree, chiudi le narici (o usa la maschera oronasale), sigilla la bocca e soffia per circa 1 secondo guardando il torace salire; stacca la bocca, guarda il torace scendere e ripeti: in tutto non più di 5 secondi', why: s.addestrato ? 'Giusto: due ventilazioni efficaci con la pausa più breve possibile.' : 'Non sei addestrato e non te la senti: puoi saltare le ventilazioni ed eseguire sole compressioni continue.' },
        ],
      }
    case 'torace':
      return {
        id, point: 7, title: 'Il torace non si alza', prompt: 'Alla prima ventilazione il torace non si solleva come in un respiro normale. Che cosa fai prima di riprovare?',
        choices: [
          { id: 'dita', ok: false, text: 'Infila le dita in gola e cerca l’ostruzione', why: 'Niente esplorazioni alla cieca con le dita: guarda nella bocca e togli solo l’ostruzione che vedi.' },
          { id: 'controlla', ok: true, text: 'Guarda nella bocca e togli eventuali ostruzioni senza esplorare alla cieca, ricontrolla inclinazione della testa e sollevamento del mento; al massimo 2 tentativi, poi torna alle compressioni', why: 'Giusto.' },
          { id: 'insisti', ok: false, text: 'Continua a soffiare finché il torace non si alza', why: 'Non più di 2 tentativi per volta, poi torna subito alle compressioni toraciche.' },
        ],
      }
    case 'rigurgito':
      return {
        id, point: 7, title: 'Rigurgito', prompt: 'Durante le ventilazioni la vittima rigurgita. Che cosa fai?',
        choices: [
          { id: 'evita', ok: false, text: 'Non toccarle la bocca, per non rischiare contagi', why: 'Il materiale gastrico rischia di finire nelle vie aeree: mettila sul fianco e liberale.' },
          { id: 'soffia', ok: false, text: 'Soffia più forte per spingere giù il materiale', why: 'Insufflazioni più energiche aumentano la distensione gastrica e il rischio che il materiale venga inalato. Mettila sul fianco e libera le vie aeree.' },
          { id: 'fianco', ok: true, text: 'Mettila sul fianco, liberale le vie aeree e poi riprendi', why: 'Giusto: una vittima incosciente non riesce a proteggere da sola le proprie vie aeree.' },
        ],
      }
    case 'ciclo':
      return {
        id, point: 8, title: 'Ciclo 30:2', prompt: s.addestrato ? 'Hai dato le 2 ventilazioni. Come prosegui?' : 'Come prosegui con le compressioni?',
        choices: [
          { id: 'riparti', ok: true, text: s.addestrato ? 'Riposiziona subito le mani sullo sterno e ripeti il ciclo 30:2 senza interruzioni' : 'Continua le compressioni senza interruzioni, a 100–120 al minuto', why: 'Giusto: le interruzioni delle compressioni vanno ridotte al minimo.' },
          { id: 'ricontrolla', ok: false, text: 'Fermati a ricontrollare il respiro alla fine di ogni ciclo', why: 'Fermati a ricontrollare solo se comincia a muoversi, ad aprire gli occhi o a respirare da sola: ogni pausa interrompe la perfusione degli organi.' },
          { id: 'riposa', ok: false, text: 'Fai una pausa di mezzo minuto per recuperare le forze', why: 'Le pause vanno ridotte al minimo. Se c’è un altro soccorritore datevi il cambio ogni 2 minuti.' },
        ],
      }
    case 'cambio':
      return {
        id, point: 8, title: 'Secondo soccorritore', prompt: 'Arriva un secondo soccorritore addestrato. Come vi organizzate?',
        choices: [
          { id: 'spiega', ok: false, text: 'Fermati e spiegagli con calma che cosa è successo', why: 'Le compressioni non si fermano: anche il cambio deve avvenire con un’interruzione minima.' },
          { id: 'cambio', ok: true, text: 'Datevi il cambio ogni 2 minuti, con un’interruzione minima delle compressioni', why: 'Giusto: così prevenite l’affaticamento.' },
          { id: 'esausto', ok: false, text: 'Continua tu finché non sei esausto, poi tocca a lui', why: 'Datevi il cambio ogni 2 minuti, prima di stancarvi: così prevenite l’affaticamento.' },
        ],
      }
    case 'dae':
      return {
        id, point: 8, title: 'DAE', prompt: 'Qualcuno arriva con un DAE. Che cosa fai?',
        choices: [
          { id: 'medici', ok: false, text: 'Lascialo da parte: solo un medico può decidere se dare uno shock', why: 'Il DAE interpreta l’ECG da solo, con un software interno, e avvisa quando il ritmo è defibrillabile.' },
          { id: 'smetti', ok: false, text: 'Usalo, e se dice che lo shock non è consigliato smetti la RCP e aspetta', why: 'Se lo shock non è consigliato, il DAE ti dice proprio di riprendere la RCP.' },
          { id: 'usa', ok: true, text: 'Usalo: solo la defibrillazione precoce può ripristinare il ritmo cardiaco; se il DAE dice che lo shock non è consigliato, riprendi la RCP', why: 'Giusto: la RCP sostiene la circolazione, ma non fa ripartire un battito normale.' },
        ],
      }
    case 'stop':
      return {
        id, point: 9, title: 'Quando fermarsi', prompt: 'Continui la RCP. Quando puoi interromperla?',
        choices: [
          { id: 'nonshock', ok: false, text: 'Quando il DAE dice che lo shock non è consigliato', why: 'In quel caso il DAE ti chiede proprio di riprendere la RCP.' },
          { id: 'tempo', ok: false, text: 'Dopo 10 minuti senza risultati', why: 'Il tempo trascorso non è tra le condizioni: ti fermi solo se arriva personale specializzato, se la vittima si riprende o se sei esausto.' },
          { id: 'fine', ok: true, text: 'Solo se arriva personale specializzato che prende il controllo, se la vittima comincia a muoversi, apre gli occhi e respira normalmente (e allora la ricontrolli) oppure se sei esausto', why: 'Giusto.' },
        ],
      }
    case 'fine':
      return { id, point: 9, title: 'Fine della sequenza', prompt: 'Prosegui la RCP finché non si verifica una delle tre condizioni per fermarti.', choices: [], end: true }
  }
}

function next(at: NodeId, s: Scenario): NodeId {
  switch (at) {
    case 'sicurezza': return 'coscienza'
    case 'coscienza': return s.risponde ? 'cosciente' : 'vieAeree'
    case 'cosciente': return 'fineCosciente'
    case 'vieAeree': return 'gas'
    case 'gas': return 'esito'
    case 'esito': return s.respiro === 'normale' ? 'pls' : 'allarme'
    case 'pls': return 'finePls'
    case 'allarme': return 'compressioni'
    case 'compressioni': return 'ventilazioni'
    case 'ventilazioni': return !s.addestrato ? 'ciclo' : s.problema === 'torace' ? 'torace' : s.problema === 'rigurgito' ? 'rigurgito' : 'ciclo'
    case 'torace':
    case 'rigurgito': return 'ciclo'
    case 'ciclo': return s.secondo ? 'cambio' : s.dae ? 'dae' : 'stop'
    case 'cambio': return s.dae ? 'dae' : 'stop'
    case 'dae': return 'stop'
    case 'stop': return 'fine'
    default: return at
  }
}

export const start = (s: Scenario): SimState => ({ at: 'sicurezza', s, done: [], tried: [], errors: 0 })
export const current = (st: SimState) => node(st.at, st.s, st.ricontrollo)

/** Apply a choice. Wrong: stay, remember it was tried. Right: log it and move on. */
export function choose(st: SimState, id: string): { state: SimState; choice: Choice } {
  const n = current(st)
  const choice = n.choices.find((c) => c.id === id)
  if (!choice || n.end) throw new Error(`Scelta ${id} non valida in ${st.at}`)
  if (!choice.ok) return { choice, state: st.tried.includes(id) ? st : { ...st, tried: [...st.tried, id], errors: st.errors + 1 } }
  return { choice, state: { ...st, at: next(st.at, st.s), done: [...st.done, { at: st.at, choice: id }], tried: [] } }
}

/** In the "breathes normally" branch, breathing changes: back to point 4, now with no normal breathing. */
export function worsen(st: SimState): SimState {
  if (st.at !== 'finePls') return st
  return { ...st, at: 'gas', s: { ...st.s, respiro: 'assente' }, tried: [], ricontrollo: true }
}

export const outcomeOf = (s: Scenario): Outcome => (s.risponde ? 'cosciente' : s.respiro === 'normale' ? 'pls' : 'rcp')

/** A random case that ends in the given outcome. */
export function makeScenario(outcome: Outcome, rand: () => number = Math.random): Scenario {
  const pick = <T,>(xs: T[]) => xs[Math.floor(rand() * xs.length)]
  const annegato = outcome === 'rcp' && rand() < 0.25
  return {
    risponde: outcome === 'cosciente',
    respiro: outcome === 'rcp' ? pick<Respiro>(['gasping', 'debole', 'assente']) : 'normale',
    annegato,
    addestrato: annegato || rand() < 0.75,
    problema: pick(['nessuno', 'torace', 'rigurgito'] as const),
    secondo: rand() < 0.5,
    dae: rand() < 0.6,
  }
}
