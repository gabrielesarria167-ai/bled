import type { Card } from './ChoiceCards'

const sign = (file: string, alt: string) => ({ src: `/img/iso7010/${file}.svg`, alt })
const DAE = sign('e010-dae', 'Segnale ISO 7010 E010: defibrillatore')
const ELETTRICITA = sign('w012-pericolo-elettricita', 'Segnale ISO 7010 W012: pericolo elettricità')
const NON_TOCCARE = sign('p010-non-toccare', 'Segnale ISO 7010 P010: vietato toccare')
const INFIAMMABILE = sign('w021-materiale-infiammabile', 'Segnale ISO 7010 W021: materiale infiammabile')
const PACEMAKER = sign('p007-vietato-portatori-pacemaker', 'Segnale ISO 7010 P007: dispositivi cardiaci impiantati')
const PERICOLO = sign('w001-pericolo-generico', 'Segnale ISO 7010 W001: pericolo generico')

const o = (...texts: string[]) => texts.map((text, i) => ({ id: 'abc'[i], text }))

/** 10.7, p. 91: the general safety rules. */
export const SICUREZZA: Card[] = [
  {
    id: 'acc',
    title: 'Solo in arresto cardiaco',
    prompt: 'Una persona è caduta a terra, ma ora è cosciente e respira normalmente. Colleghi il DAE?',
    options: o('Sì, per sicurezza', 'No: il DAE si collega soltanto a una vittima di ACC', 'Sì, ma senza accenderlo'),
    answer: 'b',
    rule: 'Collega il DAE soltanto a una vittima di ACC (arresto cardiocircolatorio): non cosciente e senza respiro efficace.',
    sign: DAE,
  },
  {
    id: 'tocca',
    title: 'Durante analisi e shock',
    prompt: 'Il DAE sta analizzando il ritmo e un astante si avvicina per tenere la mano alla vittima.',
    options: o('Lo lasci fare: la tranquillizza', 'Metti anche tu una mano sulla vittima per tenerla ferma', 'Lo fermi: nessuno tocca la vittima. Controlli e dici «Allontanatevi, state tutti lontani»'),
    answer: 'c',
    rule: 'Non toccare la vittima né durante l’analisi del ritmo né durante l’erogazione dello shock. Controllala visivamente e di’ ad alta voce «Allontanatevi, state tutti lontani» oppure «Via io, via voi, via tutti».',
    sign: NON_TOCCARE,
  },
  {
    id: 'acqua',
    title: 'Vittima in acqua',
    prompt: 'La vittima è ancora in acqua, sul bordo della piscina.',
    options: o('La togli dall’acqua e le asciughi il torace, poi applichi gli elettrodi', 'Applichi subito gli elettrodi, anche in acqua', 'Aspetti l’arrivo del SME senza usare il DAE'),
    answer: 'a',
    rule: 'Togli la vittima dall’acqua e asciugale il torace (i dettagli sono più avanti, in “Ulteriori considerazioni”).',
    sign: ELETTRICITA,
  },
  {
    id: 'metallo',
    title: 'Superficie metallica',
    prompt: 'La vittima è sdraiata sul ponte metallico di una barca. Puoi usare il DAE?',
    options: o('No: mai su superfici metalliche', 'Sì: i DAE si usano anche su superfici metalliche, umide e bagnate', 'Solo dopo averla spostata su un materasso morbido'),
    answer: 'b',
    rule: 'Se possibile sistema la vittima su una superficie rigida. I DAE si possono usare su superfici metalliche, umide e bagnate.',
  },
  {
    id: 'cerotto',
    title: 'Cerotto medicale',
    prompt: 'Proprio dove va un elettrodo c’è un cerotto medicale.',
    options: o('Applichi l’elettrodo sopra il cerotto', 'Togli il cerotto, pulisci il torace e poi applichi l’elettrodo', 'Sposti l’elettrodo sull’addome'),
    answer: 'b',
    rule: 'Non applicare gli elettrodi sopra cerotti medicali: toglili e pulisci il torace prima di applicare gli elettrodi. Durante la defibrillazione i cerotti possono provocare scintille o bruciare.',
    sign: PERICOLO,
  },
  {
    id: 'oggetti',
    title: 'Oggetti sul torace',
    prompt: 'Sul torace della vittima c’è un oggetto dove deve andare un elettrodo.',
    options: o('Applichi l’elettrodo sopra l’oggetto', 'Rinunci al DAE', 'Togli l’oggetto dal torace'),
    answer: 'c',
    rule: 'Togli dal torace della vittima qualsiasi altro oggetto, per garantire un buon contatto degli elettrodi.',
  },
  {
    id: 'ossigeno',
    title: 'Ossigeno',
    prompt: 'La vittima ha sul viso una maschera a ossigeno e stai per defibrillare.',
    options: o('Togli la maschera dal viso e la metti ad almeno 1 metro dal torace', 'Lasci la maschera sul viso durante lo shock', 'Appoggi la maschera sul torace, vicino agli elettrodi'),
    answer: 'a',
    rule: 'Durante la defibrillazione possono prodursi scintille che, con concentrazioni elevate di O2, possono causare un incendio o gravi scottature. Il rischio si riduce togliendo la maschera a ossigeno dal viso e ponendola ad almeno 1 metro dal torace.',
    sign: INFIAMMABILE,
  },
  {
    id: 'peli',
    title: 'Torace villoso',
    prompt: 'Il torace è molto villoso e nella borsa del DAE non trovi il rasoio.',
    options: o('Rimandi la defibrillazione finché qualcuno porta un rasoio', 'Non ritardi la defibrillazione: applichi gli elettrodi premendoli forte', 'Rinunci al DAE'),
    answer: 'b',
    rule: 'Sul torace villoso gli elettrodi possono aderire male: può servire depilare rapidamente le zone di applicazione, ma se manca un rasoio non si deve ritardare la defibrillazione. Tieni sempre un rasoio nell’unità DAE.',
  },
]

/** "Ulteriori considerazioni", pp. 91–93. */
export const ULTERIORI: Card[] = [
  {
    id: 'torace-bagnato',
    title: 'Torace bagnato',
    prompt: 'Il torace della vittima è bagnato di sudore.',
    options: o('Applichi gli elettrodi così com’è', 'Aspetti che si asciughi da solo', 'Lo asciughi prima, con un piccolo asciugamano o un pezzo di stoffa'),
    answer: 'c',
    rule: 'Alcune vittime hanno il torace bagnato, di sudore oppure d’acqua dopo un’immersione o un salvataggio. Il torace va sempre asciugato prima di applicare gli elettrodi. Conviene tenere un piccolo asciugamano o un pezzo di stoffa insieme all’unità DAE, soprattutto negli ambienti umidi.',
  },
  {
    id: 'pavimento',
    title: 'Superficie bagnata',
    prompt: 'La vittima è sul pavimento bagnato di uno spogliatoio e stai per premere il pulsante di scarica.',
    options: o('Non puoi defibrillare sul bagnato', 'Nessuno tocca la vittima; distendi il cavo del DAE il più lontano possibile da lei, poi premi', 'Tieni ferma la vittima con una mano mentre premi'),
    answer: 'b',
    rule: 'Con le precauzioni appropriate né il soccorritore né gli altri presenti corrono pericoli se la vittima viene defibrillata su una superficie bagnata: in particolare nessuno deve toccarla durante lo shock. Come ulteriore precauzione, prima di premere il pulsante distendi il cavo collegato al DAE il più lontano possibile dalla vittima. In generale defibrillare su pavimenti umidi o bagnati è considerato sicuro.',
    sign: ELETTRICITA,
  },
  {
    id: 'ipotermia',
    title: 'Paziente ipotermico',
    prompt: 'La vittima è ipotermica (temperatura corporea interna inferiore a 30 °C) e la FV persiste.',
    options: o('Interrompi tutto finché non si è riscaldata', 'Continui il BLS e continui a riscaldarla passivamente fino all’arrivo dello SME', 'Smetti la RCP e la copri soltanto'),
    answer: 'b',
    rule: 'Con una vittima ipotermica (temperatura interna sotto i 30 °C), se la FV persiste: continua il BLS e continua a riscaldare passivamente il paziente fino alla presa in carico da parte dello SME.',
  },
  {
    id: 'bambino-8',
    title: 'Bambino sopra gli 8 anni',
    prompt: 'La vittima è un bambino di 10 anni. Che DAE usi?',
    options: o('Il DAE standard', 'Nessun DAE: è troppo piccolo', 'Solo un DAE con elettrodi pediatrici'),
    answer: 'a',
    rule: 'Le unità DAE standard sono predisposte per l’uso nei bambini di età superiore agli 8 anni.',
  },
  {
    id: 'bambino-1-8',
    title: 'Bambino fra 1 e 8 anni',
    prompt: 'La vittima ha 5 anni. Il tuo DAE non ha elettrodi pediatrici né modalità pediatrica.',
    options: o('Non usi il DAE', 'Applichi un solo elettrodo', 'Usi il DAE così com’è'),
    answer: 'c',
    rule: 'Fra 1 e 8 anni usa gli elettrodi pediatrici o la modalità pediatrica, se l’unità ne dispone. Se la modalità pediatrica non c’è, usa il DAE così com’è.',
  },
  {
    id: 'lattante',
    title: 'Sotto 1 anno',
    prompt: 'La vittima è un lattante di pochi mesi e non c’è nessun’altra opzione praticabile.',
    options: o('Il DAE non si usa mai sotto 1 anno', 'L’uso del DAE, preferibilmente con attenuatore di energia, è accettabile'),
    answer: 'b',
    rule: 'Sotto 1 anno l’uso del DAE (preferibilmente con attenuatore di energia) in ambiente pre-ospedaliero è molto raro. Pur essendo un’eventualità remota, è accettabile quando nessun’altra opzione è praticabile. Il trattamento potrebbe essere richiesto esplicitamente dalla sala operativa di emergenza in presenza di patologie cardiache note.',
  },
  {
    id: 'pacemaker',
    title: 'Pacemaker',
    prompt: 'Sotto la pelle, vicino a dove andrebbe un elettrodo, senti un pacemaker.',
    options: o('Applichi l’elettrodo ad almeno 8 cm dal pacemaker e segui le raccomandazioni del fabbricante', 'Applichi l’elettrodo proprio sopra il pacemaker', 'Non usi il DAE'),
    answer: 'a',
    rule: 'Il pacemaker è un apparecchio impiantato sotto la cute che stimola elettricamente la contrazione del cuore quando il tessuto di conduzione non la garantisce in modo normale. Segui le raccomandazioni del fabbricante per l’eventuale uso del DAE e applica gli elettrodi ad almeno otto centimetri dal pacemaker.',
    sign: PACEMAKER,
  },
  {
    id: 'icd',
    title: 'Defibrillatore impiantato (ICD)',
    prompt: 'La vittima ha un defibrillatore cardiaco automatico interno (ICD) e vedi i muscoli del torace contrarsi a scatti.',
    options: o('Applichi gli elettrodi sopra l’ICD', 'Fai attenzione: il dispositivo può star già rilasciando shock. Applichi gli elettrodi ad almeno 8 cm dall’ICD', 'Spegni il DAE: ci pensa l’ICD'),
    answer: 'b',
    rule: 'L’ICD è un dispositivo elettrico grande più o meno come un orologio da taschino, impiantato sotto la cute in chi ha patologie cardiache che espongono ad aritmie capaci di provocare morte cardiaca improvvisa. Se sta già rilasciando shock, fai attenzione alle fascicolazioni dei muscoli del torace. Applica gli elettrodi ad almeno otto centimetri dall’ICD.',
    sign: PACEMAKER,
  },
  {
    id: 'trasporto',
    title: 'Trasporto in barca o in ambulanza',
    prompt: 'State trasportando la vittima in barca e il DAE inizia l’analisi del ritmo.',
    options: o('Prosegui la navigazione', 'Stacchi il DAE durante il trasporto', 'Fai fermare il mezzo'),
    answer: 'c',
    rule: 'Durante il trasporto il DAE resta in posizione. Se l’analisi avviene durante il trasporto il mezzo va fermato: le vibrazioni della barca o dell’ambulanza possono creare artefatti elettrici. Se viene richiesto uno shock, o il DAE suggerisce di controllare il paziente o raccomanda uno shock, ferma il veicolo e segui le indicazioni del dispositivo. Per tutto il resto segui le indicazioni del costruttore.',
  },
]

/** "Risoluzione dei problemi", p. 93: each problem with its remedy; the other options are remedies of other problems. */
const PROBLEMS: { id: string; title: string; prompt: string; fix: string }[] = [
  { id: 'connettore', title: 'Elettrodi non collegati', prompt: 'Il DAE segnala che gli elettrodi non risultano collegati.', fix: 'Verifica che il connettore delle placche sia inserito correttamente.' },
  { id: 'aderenza', title: 'Placca che si stacca', prompt: 'Un angolo della placca non aderisce al torace.', fix: 'Premi forte quando le applichi, così aderiscono perfettamente al torace.' },
  { id: 'posizione', title: 'Elettrodo fuori posto', prompt: 'Ti accorgi che un elettrodo è troppo in basso, sull’addome.', fix: 'Verifica il posizionamento: elettrodi messi male possono ridurre l’efficacia della scarica.' },
  { id: 'danno', title: 'Cavo rovinato', prompt: 'Il cavo di un elettrodo è spellato.', fix: 'Controlla se elettrodi o cavi sono danneggiati e, se deteriorati, sostituiscili.' },
  { id: 'peli', title: 'Peluria', prompt: 'Gli elettrodi non aderiscono per la peluria del torace.', fix: 'Rasa la zona del torace dove vanno gli elettrodi, per garantirne l’aderenza.' },
  { id: 'bagnato', title: 'Pelle bagnata', prompt: 'La pelle sotto gli elettrodi è bagnata.', fix: 'Asciuga il torace con un asciugamano o un panno prima di applicare gli elettrodi.' },
  { id: 'gel', title: 'Gel seccato', prompt: 'Il gel degli elettrodi è secco e la confezione non era sigillata.', fix: 'Usa un’altra coppia di elettrodi.' },
  { id: 'analisi', title: 'Analisi interrotta', prompt: 'Il DAE dice: «Analisi interrotta».', fix: 'Ferma tutti i movimenti.' },
  { id: 'radio', title: 'Interferenze', prompt: 'Accanto al DAE ci sono una radio accesa e un cellulare.', fix: 'Tienili ad almeno 2 metri (circa 6 piedi) dall’unità DAE: possono dare interferenze elettromagnetiche.' },
]

export const GUASTI: Card[] = PROBLEMS.map((p, i) => {
  const a = PROBLEMS[(i + 3) % PROBLEMS.length].fix
  const b = PROBLEMS[(i + 5) % PROBLEMS.length].fix
  const options = [[p.fix, a, b], [a, p.fix, b], [a, b, p.fix]][i % 3]
  return { id: `guasto-${p.id}`, title: p.title, prompt: p.prompt, options: o(...options), answer: 'abc'[i % 3], rule: p.fix }
})

/** 10.8, pp. 93–94: quick true/false. */
const vf = (id: string, prompt: string, vero: boolean, rule: string): Card => ({ id, title: 'Vero o falso?', prompt, options: [{ id: 'v', text: 'Vero' }, { id: 'f', text: 'Falso' }], answer: vero ? 'v' : 'f', rule })

export const LEGALE: Card[] = [
  vf('obbligo', 'In alcune nazioni la legge rende obbligatorio il DAE in certi ambienti, come centri commerciali e scuole.', true, 'Norme recenti di alcune nazioni rendono obbligatoria la presenza di DAE in determinati ambienti, per esempio centri commerciali, scuole e in generale luoghi affollati.'),
  vf('profani', 'Se sul posto non ci sono sanitari né laici addestrati, il DAE può usarlo anche chi non conosce affatto il BLSD.', true, 'Le stesse norme prevedono che il DAE possa essere usato anche da persone del tutto profane in materia di BLSD, quando sul luogo dell’evento non ci sono sanitari né laici addestrati.'),
  vf('telefono', 'L’operatore del numero di emergenza non può darti indicazioni su come usare il DAE.', false, 'In molte nazioni la legge stabilisce che l’Operatore Sanitario che risponde al numero di emergenza nazionale guidi a distanza, per telefono e con indicazioni dirette, l’astante non addestrato disposto a eseguire la manovra.'),
  vf('necessita', 'Chi usa un DAE senza addestramento per salvare qualcuno da un danno grave è punibile.', false, 'Molti paesi riconoscono lo “stato di necessità” a chi usa un DAE senza essere addestrato: non è punibile chi ha commesso il fatto perché costretto dalla necessità di salvare sé o altri dal pericolo di un danno grave alla persona.'),
  vf('perseguiti', 'Sono noti molti casi di soccorritori laici perseguiti per aver usato un DAE.', false, 'Non risultano casi di soccorritori laici perseguiti per aver prestato cure con un DAE.'),
  vf('samaritano', 'Il “principio del buon samaritano” tutela chi presta assistenza volontariamente, senza averne l’obbligo legale.', true, 'Molte nazioni applicano il “principio del buon samaritano”, che tutela i soccorritori che prestano assistenza volontariamente senza avere l’obbligo legale di farlo.'),
]
