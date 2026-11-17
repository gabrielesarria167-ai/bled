/**
 * The DAE algorithm of the manual (pp. 84–90, "Algoritmo DAE" table B) as a pure state machine.
 * The UI dispatches the learner's choices and the device/scenario events; timers and randomness live in the UI.
 */

export type Phase =
  | 'sicurezza'
  | 'valutazione'
  | 'rcp_attesa'
  | 'accensione'
  | 'torace'
  | 'elettrodi'
  | 'analisi'
  | 'shock_consigliato'
  | 'scarica'
  | 'shock_non_consigliato'
  | 'rcp'
  | 'respiro'
  | 'sme'
  | 'rapporto'
  | 'fine'
  | 'esausto'

/** The states of table B, in order, for the map shown next to the simulator. */
export const STATES: { n: string; name: string; phases: Phase[] }[] = [
  { n: '0', name: 'Sicurezza', phases: ['sicurezza'] },
  { n: '1', name: 'Valutazione', phases: ['valutazione'] },
  { n: '2', name: 'RCP in attesa del DAE', phases: ['rcp_attesa'] },
  { n: '3', name: 'Accensione', phases: ['accensione'] },
  { n: '4', name: 'Preparare il torace', phases: ['torace'] },
  { n: '5', name: 'Applicare gli elettrodi', phases: ['elettrodi'] },
  { n: '6', name: 'Analisi', phases: ['analisi'] },
  { n: '7a', name: 'Shock consigliato', phases: ['shock_consigliato'] },
  { n: '8', name: 'Scarica', phases: ['scarica'] },
  { n: '7b', name: 'Shock non consigliato', phases: ['shock_non_consigliato'] },
  { n: '9', name: 'RCP per 2 minuti', phases: ['rcp'] },
  { n: '10', name: 'Respiro ripreso', phases: ['respiro'] },
  { n: '11', name: 'Passaggio al SME', phases: ['sme', 'rapporto', 'fine'] },
  { n: '12', name: 'Esaurimento', phases: ['esausto'] },
]

export type Mode = 'semi' | 'auto'
export type Prep = 'indumenti' | 'rasa' | 'asciuga' | 'cerotto' | 'ossigeno'
export type Scenario = { mode: Mode; body: 'uomo' | 'donna'; villoso: boolean; bagnato: boolean; cerotto: boolean; ossigeno: boolean }
export type Tone = 'ok' | 'errore' | 'sicurezza' | 'info'
export type Note = { tone: Tone; text: string }
export type Slip = { phase: Phase; text: string; safety: boolean }

export type SimState = {
  phase: Phase
  sc: Scenario
  done: Prep[]
  /** Both electrodes placed correctly. */
  pads: boolean
  /** Someone is doing RCP right now. */
  cpr: boolean
  /** Analysis: everyone is clear and the DAE is analysing. */
  clear: boolean
  /** Analysis was interrupted by movement (artefacts). */
  interrupted: boolean
  /** Respiro ripreso: the learner has put the victim under watch. */
  watch: boolean
  breathing: boolean
  analyses: number
  shocks: number
  /** Completed 2-minute RCP periods with the DAE attached. */
  cprPeriods: number
  errors: Slip[]
  note?: Note
  /** Voice lines produced by the last transition (spoken once, keyed by `seq`). */
  say: string[]
  /** Every voice line so far: the visible transcript. */
  log: string[]
  seq: number
}

export type Regia = 'respira' | 'als' | 'esausto' | 'indicazioni'

export type Action =
  | { type: 'choose'; id: string }
  | { type: 'daeArrivato' }
  | { type: 'padMiss'; text: string }
  | { type: 'padsPlaced' }
  | { type: 'analisiFinita'; shockable: boolean }
  | { type: 'scaricaAuto' }
  | { type: 'rcpFinita' }
  | { type: 'regia'; event: Regia }

type Opt = { id: string; label: string; kind: Tone; why: string; go?: Partial<SimState>; say?: string[] }
export type Choice = { id: string; label: string }

export const VOICE = {
  torace: 'Scoprire il torace del paziente.',
  elettrodi: 'Applicare gli elettrodi sul torace nudo del paziente.',
  analisi: 'Analisi del ritmo in corso. Non toccare il paziente.',
  interrotta: 'Analisi interrotta. Fermare tutti i movimenti.',
  shock: 'Shock consigliato. Non toccare il paziente.',
  premi: 'Premere il pulsante di scarica.',
  auto: 'Scarica tra pochi secondi. Non toccare il paziente.',
  erogata: 'Scarica erogata. Riprendere la RCP.',
  noShock: 'Non è richiesta nessuna scarica. Riprendere la RCP.',
}

const SAFETY_FIRST = 'Prima di tutto valuta la sicurezza: soccorritore, vittima ed eventuali astanti devono essere al sicuro.'
const HANDS_OFF = 'Non toccare la vittima né durante l’analisi del ritmo né durante l’erogazione dello shock.'

export const needs = (sc: Scenario): Prep[] => ['indumenti', 'asciuga', ...(sc.villoso ? ['rasa' as const] : []), ...(sc.cerotto ? ['cerotto' as const] : []), ...(sc.ossigeno ? ['ossigeno' as const] : [])]

const MISSING: Record<Prep, string> = {
  indumenti: 'Gli elettrodi vanno sul torace nudo: prima scopri il torace, tagliando gli indumenti se serve.',
  asciuga: 'Il torace deve essere asciutto e pulito: asciugalo e puliscilo prima di applicare gli elettrodi.',
  rasa: 'Sul torace villoso gli elettrodi aderiscono male: rasa rapidamente le zone di applicazione (se manca il rasoio, non ritardare la defibrillazione).',
  cerotto: 'Non applicare gli elettrodi sopra un cerotto medicale: durante la defibrillazione può provocare scintille o bruciare. Toglilo e pulisci il torace.',
  ossigeno: 'Con concentrazioni elevate di O2 le scintille della defibrillazione possono causare un incendio o gravi scottature: togli la maschera e mettila ad almeno 1 metro dal torace.',
}

export function start(sc: Scenario): SimState {
  return { phase: 'sicurezza', sc, done: [], pads: false, cpr: false, clear: false, interrupted: false, watch: false, breathing: false, analyses: 0, shocks: 0, cprPeriods: 0, errors: [], say: [], log: [], seq: 0 }
}

/** A new scene: which chest problems the learner will find. `rnd` is injectable for tests. */
export function randomScenario(mode: Mode, rnd: () => number = Math.random): Scenario {
  return { mode, body: rnd() < 0.5 ? 'uomo' : 'donna', villoso: rnd() < 0.4, bagnato: rnd() < 0.4, cerotto: rnd() < 0.3, ossigeno: rnd() < 0.25 }
}

function prepOpt(s: SimState, p: Prep, label: string, ok: string, notNeeded: string): Opt {
  if (s.done.includes(p)) return { id: p, label, kind: 'info', why: 'Già fatto.' }
  if (p !== 'indumenti' && p !== 'ossigeno' && !s.done.includes('indumenti')) return { id: p, label, kind: 'errore', why: 'Prima scopri il torace: togli o taglia gli indumenti.' }
  if (!needs(s.sc).includes(p)) return { id: p, label, kind: 'info', why: notNeeded }
  return { id: p, label, kind: 'ok', why: ok, go: { done: [...s.done, p] } }
}

function opts(s: SimState): Opt[] {
  const semi = s.sc.mode === 'semi'
  switch (s.phase) {
    case 'sicurezza':
      return [
        { id: 'comprimi', label: 'Inizia subito le compressioni', kind: 'errore', why: SAFETY_FIRST },
        { id: 'sicurezza', label: 'Valuta la sicurezza: tu, la vittima e gli astanti siete al sicuro?', kind: 'ok', why: 'Scena sicura. Ora valuta la vittima.', go: { phase: 'valutazione' } },
        { id: 'cerca', label: 'Corri a cercare un DAE', kind: 'errore', why: SAFETY_FIRST },
      ]
    case 'valutazione':
      return [
        { id: 'vai', label: 'Lascia la vittima e vai tu a cercare il DAE', kind: 'errore', why: 'Lascia la vittima soltanto se non esiste alcuna altra possibilità. Qui c’è un passante: manda lui a chiamare il 112/118 e a cercare il DAE. Se fossi solo, chiameresti il 112/118 con il cellulare in vivavoce.' },
        { id: 'aspetta', label: 'Aspetta qualche minuto per vedere se si riprende', kind: 'errore', why: 'Se la vittima è incosciente o non respira normalmente chiedi subito aiuto: una persona con il cuore fermo ha bisogno di cure mediche professionali precoci.' },
        { id: 'aiuto', label: 'Chiedi aiuto: fai chiamare il 112/118 e fai portare un DAE', kind: 'ok', why: 'Il passante chiama il 112/118 e va a prendere il DAE.', go: { phase: 'rcp_attesa' } },
      ]
    case 'rcp_attesa':
      if (s.cpr) return []
      return [
        { id: 'rcp', label: 'Inizia la RCP 30:2', kind: 'ok', why: 'RCP in corso: 30 compressioni toraciche e 2 ventilazioni, finché non arriva il DAE.', go: { cpr: true } },
        { id: 'attendi', label: 'Aspetta il DAE senza fare nulla', kind: 'errore', why: 'La RCP assicura un flusso di sangue ossigenato finché non è disponibile un DAE: i tessuti del sistema nervoso centrale cominciano a morire dopo appena 4-5 minuti senza flusso.' },
        { id: 'cerca', label: 'Vai anche tu a cercare il DAE', kind: 'errore', why: 'Il passante sta già cercando il DAE. Tu resta con la vittima e inizia la RCP.' },
      ]
    case 'accensione':
      return [
        { id: 'finisci', label: 'Prima completa altri cicli di RCP, poi accendi il DAE', kind: 'errore', why: 'Appena il DAE è disponibile si accende subito. Con più soccorritori la RCP continua mentre si prepara il dispositivo.' },
        { id: 'fermi', label: 'Fermate entrambi la RCP per leggere il manuale del DAE', kind: 'errore', why: 'La RCP non si ferma: con più soccorritori prosegue mentre si applicano gli elettrodi. Il DAE ti guida con le sue istruzioni vocali.' },
        { id: 'accendi', label: 'Accendi subito il DAE (coperchio o pulsante); il passante continua la RCP', kind: 'ok', why: 'DAE acceso. Ascolta le istruzioni vocali.', go: { phase: 'torace' }, say: [VOICE.torace] },
      ]
    case 'torace': {
      const missing = needs(s.sc).find((p) => !s.done.includes(p))
      return [
        prepOpt(s, 'indumenti', 'Togli o taglia gli indumenti e scopri il torace', 'Torace scoperto.', ''),
        prepOpt(s, 'rasa', 'Rasa i peli dove vanno gli elettrodi', 'Zone di applicazione rasate: gli elettrodi aderiranno meglio.', 'Il torace non è villoso: si rasa solo se e dove necessario.'),
        prepOpt(s, 'asciuga', 'Asciuga e pulisci il torace', s.sc.bagnato ? 'Il torace bagnato va sempre asciugato prima di applicare gli elettrodi. Fatto.' : 'Torace asciutto e pulito.', ''),
        prepOpt(s, 'cerotto', 'Togli il cerotto medicale e pulisci la pelle', 'Cerotto tolto e pelle pulita.', 'Sul torace non ci sono cerotti medicali.'),
        prepOpt(s, 'ossigeno', 'Togli la maschera a ossigeno e mettila ad almeno 1 metro dal torace', 'Maschera allontanata di almeno 1 metro dal torace.', 'La vittima non ha una maschera a ossigeno.'),
        missing
          ? { id: 'applica', label: 'Passa agli elettrodi', kind: 'errore', why: MISSING[missing] }
          : { id: 'applica', label: 'Passa agli elettrodi', kind: 'ok', why: 'Torace pronto: nudo, asciutto e pulito.', go: { phase: 'elettrodi' }, say: [VOICE.elettrodi] },
      ]
    }
    case 'elettrodi':
      if (!s.pads) return []
      return [
        { id: 'tieni', label: 'Tieni le mani sulle piastre per tutto il tempo, così restano attaccate', kind: 'errore', why: 'Le piastre si premono forte con il palmo quando le applichi. Poi nessuno deve toccare la vittima durante l’analisi e la scarica.' },
        { id: 'connetti', label: 'Verifica che il connettore delle piastre sia inserito nel DAE', kind: 'ok', why: 'Elettrodi collegati: il DAE comincia subito l’analisi.', go: { phase: 'analisi', clear: false, interrupted: false }, say: [VOICE.analisi] },
      ]
    case 'analisi': {
      const interrupt = { clear: false, interrupted: true }
      if (s.clear)
        return [
          { id: 'attendi', label: 'Resta lontano e aspetta il risultato', kind: 'ok', why: 'Giusto: nessuno tocca la vittima finché il DAE analizza.' },
          { id: 'tocca', label: 'Avvicinati e tocca la vittima per controllarla', kind: 'sicurezza', why: `${HANDS_OFF} I movimenti creano artefatti e l’analisi si interrompe.`, go: interrupt, say: [VOICE.interrotta] },
          { id: 'muovi', label: 'Sposta la vittima in una posizione più comoda', kind: 'sicurezza', why: 'I movimenti della vittima durante l’analisi creano artefatti: il DAE interrompe l’analisi. Ferma ogni movimento.', go: interrupt, say: [VOICE.interrotta] },
        ]
      return [
        { id: 'continua', label: 'Continua le compressioni mentre il DAE analizza', kind: 'sicurezza', why: `${HANDS_OFF} Le compressioni e i movimenti dei soccorritori creano artefatti: l’analisi si interrompe.`, go: interrupt, say: [VOICE.interrotta] },
        { id: 'via', label: s.cpr ? 'Fermate la RCP e staccate le mani: nessuno tocchi la vittima' : 'Stacca le mani e controlla che nessuno tocchi la vittima', kind: 'ok', why: 'Tutti lontani, nessun movimento: il DAE analizza il ritmo.', go: { clear: true, cpr: false, interrupted: false }, say: s.interrupted ? [VOICE.analisi] : [] },
        { id: 'mano', label: 'Tieni una mano sul torace per sentire il battito', kind: 'sicurezza', why: `${HANDS_OFF} Anche i tuoi movimenti creano artefatti.`, go: interrupt, say: [VOICE.interrotta] },
      ]
    }
    case 'shock_consigliato':
      return [
        { id: 'subito', label: 'Eroga subito lo shock, senza guardare intorno', kind: 'sicurezza', why: 'Prima della scarica controlla la vittima dalla testa ai piedi: nessuno deve toccarla. Poi dichiara «Via io, via voi, via tutti».' },
        { id: 'comprimi', label: 'Riprendi le compressioni mentre il DAE si prepara', kind: 'sicurezza', why: HANDS_OFF },
        { id: 'dichiara', label: 'Controlla la vittima dalla testa ai piedi e di’ ad alta voce «Via io, via voi, via tutti»', kind: 'ok', why: 'Nessuno tocca la vittima: si può erogare lo shock.', go: { phase: 'scarica' }, say: [semi ? VOICE.premi : VOICE.auto] },
      ]
    case 'scarica':
      if (semi)
        return [
          { id: 'tieni', label: 'Tieni ferma la vittima mentre premi il pulsante', kind: 'sicurezza', why: 'Nessuno deve toccare la vittima durante la scarica. Nel simulatore lo shock viene annullato: ripeti il controllo e dichiara di nuovo «Via io, via voi, via tutti».', go: { phase: 'shock_consigliato' } },
          { id: 'polso', label: 'Prima controlla il polso', kind: 'errore', why: 'Eroga la scarica appena il DAE la richiede.' },
          { id: 'shock', label: 'Premi il pulsante di scarica', kind: 'ok', why: 'Scarica erogata.', go: { phase: 'rcp', cpr: false, shocks: s.shocks + 1 }, say: [VOICE.erogata] },
        ]
      return [
        { id: 'cerca', label: 'Cerca il pulsante di scarica e premilo', kind: 'errore', why: 'Con un DAE completamente automatico non si preme nulla: lo shock parte da solo dopo alcuni secondi di preavviso.' },
        { id: 'lontano', label: 'Resta lontano e non premere nulla', kind: 'ok', why: 'Giusto: il DAE completamente automatico eroga lo shock da solo dopo un breve preavviso.' },
        { id: 'tocca', label: 'Avvicinati per controllare se respira', kind: 'sicurezza', why: 'Nessuno deve toccare la vittima durante la scarica. Nel simulatore lo shock viene annullato: ripeti il controllo e dichiara di nuovo «Via io, via voi, via tutti».', go: { phase: 'shock_consigliato' } },
      ]
    case 'shock_non_consigliato':
      return [
        { id: 'stacca', label: 'Stacca le piastre: il DAE non serve più', kind: 'errore', why: 'Lascia le piastre attaccate e il DAE acceso: dopo 2 minuti di RCP analizza di nuovo il ritmo e ti dà nuove istruzioni.' },
        { id: 'rcp', label: 'Riprendi immediatamente la RCP 30:2', kind: 'ok', why: 'RCP in corso: dopo 2 minuti il DAE analizza di nuovo il ritmo.', go: { phase: 'rcp', cpr: true } },
        { id: 'aspetta', label: 'Resta fermo e aspetta altre istruzioni del DAE', kind: 'errore', why: 'Se lo shock non è consigliato e la vittima non respira normalmente, riprendi subito la RCP 30:2. Le nuove istruzioni arrivano dopo 2 minuti, con la nuova analisi.' },
      ]
    case 'rcp':
      if (s.cpr) return []
      return [
        { id: 'polso', label: 'Controlla il polso per un minuto prima di ricominciare', kind: 'errore', why: 'Subito dopo la scarica riprendi immediatamente la RCP 30:2. Sarà il DAE ad analizzare di nuovo il ritmo dopo 2 minuti.' },
        { id: 'ancora', label: 'Premi di nuovo il pulsante di scarica', kind: 'errore', why: 'Dopo un singolo shock si fanno 2 minuti di RCP 30:2 prima di un altro shock, se indicato.' },
        { id: 'rcp', label: 'Riprendi subito la RCP 30:2', kind: 'ok', why: 'RCP in corso: il DAE scandisce i 2 minuti.', go: { cpr: true } },
      ]
    case 'respiro':
      if (s.watch) return []
      return [
        { id: 'spegni', label: 'Spegni il DAE e stacca le piastre', kind: 'errore', why: 'Lascia il DAE collegato e acceso: continua a controllare la respirazione e le eventuali nuove indicazioni del defibrillatore.' },
        { id: 'pls', label: 'Se serve mettila in posizione laterale di sicurezza; lascia il DAE collegato e acceso e controlla il respiro', kind: 'ok', why: 'Giusto. Continua a controllare la respirazione e a verificare le eventuali nuove indicazioni del DAE.', go: { cpr: false, watch: true } },
        { id: 'continua', label: 'Continua ancora per qualche istante le compressioni', kind: 'info', why: 'Non è un errore: continuare per qualche istante le compressioni dopo il ripristino del ritmo non aumenta la possibilità che la FV ricompaia. Ora però la vittima respira normalmente: controlla il respiro e lascia il DAE collegato.' },
      ]
    case 'sme':
      return [
        { id: 'spegni', label: 'Spegni il DAE e togli le piastre per consegnarlo all’équipe', kind: 'errore', why: 'Lascia il DAE acceso e collegato: è l’équipe a decidere se usare gli elettrodi già applicati oppure toglierli e usare quelli della propria attrezzatura ALS.' },
        { id: 'via', label: 'Lascia fare all’équipe e allontanati senza dire nulla', kind: 'errore', why: 'Fai un breve rapporto sulle manovre eseguite: serve al personale specializzato per trattare la vittima di conseguenza. Ti può anche essere chiesto di proseguire la RCP mentre l’équipe si prepara.' },
        { id: 'consegna', label: 'Lascia il DAE acceso e collegato, prosegui la RCP se te lo chiedono e fai un breve rapporto', kind: 'ok', why: 'L’équipe può usare gli elettrodi già applicati oppure toglierli e usare i propri.', go: { phase: 'rapporto' } },
      ]
    case 'rapporto':
      return [{ id: 'fine', label: 'Consegna il rapporto', kind: 'ok', why: 'Rapporto consegnato: ora la vittima è affidata al soccorso avanzato.', go: { phase: 'fine' } }]
    default:
      return []
  }
}

export const choices = (s: SimState): Choice[] => opts(s).map(({ id, label }) => ({ id, label }))

/** Scenario events the learner can trigger from the "regia" panel in the current state (table B: 9 → 10 / 11 / 12, 10 → 6 / 11). */
export function regia(s: SimState): Regia[] {
  if (s.phase === 'rcp' && s.cpr) return ['respira', 'als', 'esausto']
  if (s.phase === 'respiro') return ['indicazioni', 'als']
  return []
}

export function reduce(s: SimState, a: Action): SimState {
  const next = (patch: Partial<SimState>, note?: Note, say: string[] = []): SimState => ({ ...s, ...patch, note, say, log: [...s.log, ...say], seq: s.seq + 1 })
  const slip = (text: string, safety: boolean, patch: Partial<SimState> = {}, say: string[] = []) => next({ ...patch, errors: [...s.errors, { phase: s.phase, text, safety }] }, { tone: safety ? 'sicurezza' : 'errore', text }, say)

  switch (a.type) {
    case 'choose': {
      const o = opts(s).find((x) => x.id === a.id)
      if (!o) return s
      if (o.kind === 'errore' || o.kind === 'sicurezza') return slip(o.why, o.kind === 'sicurezza', o.go, o.say)
      return next(o.go ?? {}, { tone: o.kind, text: o.why }, o.say)
    }
    case 'daeArrivato':
      return s.phase === 'rcp_attesa' && s.cpr ? next({ phase: 'accensione' }, { tone: 'info', text: 'Il passante è tornato con il DAE.' }) : s
    case 'padMiss':
      return s.phase === 'elettrodi' && !s.pads ? slip(a.text, false) : s
    case 'padsPlaced':
      return s.phase === 'elettrodi' && !s.pads ? next({ pads: true }, { tone: 'ok', text: 'Elettrodi in posizione e ben aderenti.' }) : s
    case 'analisiFinita':
      if (s.phase !== 'analisi' || !s.clear) return s
      return a.shockable
        ? next({ phase: 'shock_consigliato', clear: false, analyses: s.analyses + 1 }, undefined, [VOICE.shock])
        : next({ phase: 'shock_non_consigliato', clear: false, analyses: s.analyses + 1 }, undefined, [VOICE.noShock])
    case 'scaricaAuto':
      return s.phase === 'scarica' && s.sc.mode === 'auto' ? next({ phase: 'rcp', cpr: false, shocks: s.shocks + 1 }, { tone: 'info', text: 'Il DAE ha erogato lo shock da solo.' }, [VOICE.erogata]) : s
    case 'rcpFinita':
      // The rescuers are still compressing when the DAE starts the new analysis: stopping is the learner's next choice.
      return s.phase === 'rcp' && s.cpr ? next({ phase: 'analisi', clear: false, interrupted: false, cprPeriods: s.cprPeriods + 1 }, undefined, [VOICE.analisi]) : s
    case 'regia': {
      if (!regia(s).includes(a.event)) return s
      if (a.event === 'respira') return next({ phase: 'respiro', watch: false, breathing: true }, { tone: 'info', text: 'La vittima riprende a respirare normalmente.' })
      if (a.event === 'als') return next({ phase: 'sme' }, { tone: 'info', text: 'Arriva il personale del soccorso avanzato (ALS).' })
      if (a.event === 'esausto') return next({ phase: 'esausto', cpr: false }, { tone: 'info', text: 'Sei esausto: è la terza condizione di termine prevista dal manuale.' })
      return next({ phase: 'analisi', clear: false, interrupted: false, cpr: false, watch: false, breathing: false }, undefined, [VOICE.analisi])
    }
  }
}

/** What the learner sees around them in each state (narration, not the DAE's voice). */
export function scene(s: SimState): string {
  const sc = s.sc
  switch (s.phase) {
    case 'sicurezza':
      return 'In palestra una persona crolla a terra davanti a te.'
    case 'valutazione':
      return 'La scena è sicura. La persona non risponde e non respira normalmente. Accanto a te c’è un passante.'
    case 'rcp_attesa':
      return s.cpr ? 'Stai eseguendo la RCP 30:2. Il passante sta tornando con il DAE.' : 'Il passante chiama il 112/118 e corre a prendere il DAE.'
    case 'accensione':
      return 'Il passante è tornato con il DAE; il 112/118 è stato allertato. Tu stai eseguendo la RCP.'
    case 'torace':
      return [
        'Il passante continua la RCP mentre prepari la vittima.',
        s.done.includes('indumenti') ? 'Il torace è scoperto.' : 'Il torace è coperto dagli indumenti.',
        sc.bagnato && !s.done.includes('asciuga') ? 'La pelle è bagnata di sudore.' : '',
        sc.villoso && !s.done.includes('rasa') ? 'Il torace è molto villoso.' : '',
        sc.cerotto && !s.done.includes('cerotto') ? 'Sul torace c’è un cerotto medicale.' : '',
        sc.ossigeno && !s.done.includes('ossigeno') ? 'Sul viso della vittima c’è una maschera a ossigeno.' : '',
      ]
        .filter(Boolean)
        .join(' ')
    case 'elettrodi':
      return s.pads ? 'Gli elettrodi sono applicati. Il passante continua la RCP.' : 'Apri la confezione sigillata e prendi una placca alla volta: applica i due elettrodi come nei pittogrammi.'
    case 'analisi':
      if (s.clear) return 'Il DAE sta analizzando il ritmo. Nessuno tocca la vittima.'
      if (s.interrupted) return 'Gli artefatti hanno interrotto l’analisi.'
      return s.cpr ? 'Il DAE parla mentre il passante sta ancora comprimendo.' : 'Il DAE inizia l’analisi del ritmo.'
    case 'shock_consigliato':
      return 'Il passante è ancora inginocchiato accanto alla vittima, con le mani vicino al torace.'
    case 'scarica':
      return sc.mode === 'semi' ? 'Il pulsante di scarica lampeggia.' : 'Il DAE conta i secondi prima dello shock.'
    case 'shock_non_consigliato':
      return 'Nessuna scarica. La vittima non respira normalmente.'
    case 'rcp':
      return s.cpr ? 'RCP 30:2 in corso. Il DAE scandisce i 2 minuti, poi analizza di nuovo il ritmo.' : 'Scarica erogata. La vittima non respira normalmente.'
    case 'respiro':
      return s.watch ? 'La vittima respira normalmente. Il DAE resta collegato e acceso.' : 'La vittima ha ripreso a respirare normalmente.'
    case 'sme':
      return 'Arriva il personale del soccorso avanzato (ALS).'
    case 'rapporto':
      return 'Fai all’équipe un breve rapporto con i cinque dati.'
    case 'fine':
      return 'L’équipe ALS prende in carico la vittima.'
    case 'esausto':
      return 'Sei esausto e non riesci più a proseguire.'
  }
}

/** The five data of the handover report (p. 88), filled in from this run. */
export function report(s: SimState): { label: string; value: string }[] {
  return [
    { label: 'Natura dell’evento', value: 'Fuori dall’acqua, senza trauma: la persona è crollata a terra.' },
    { label: 'Condizioni iniziali', value: 'Non rispondeva e non respirava normalmente.' },
    { label: 'Manovre effettuate', value: `RCP 30:2, DAE collegato: ${s.analyses} analisi del ritmo, ${s.shocks} ${s.shocks === 1 ? 'scarica erogata' : 'scariche erogate'}.` },
    { label: 'Condizioni attuali', value: s.breathing ? 'Respira normalmente; DAE collegato e acceso.' : 'Non respira normalmente; RCP in corso, DAE collegato e acceso.' },
    { label: 'Tempo stimato dall’arresto', value: `${s.cprPeriods ? `Circa ${s.cprPeriods * 2} minuti` : 'Meno di 2 minuti'} di RCP con il DAE, più il tempo prima del suo arrivo.` },
  ]
}

export const ended = (s: SimState) => s.phase === 'fine' || s.phase === 'esausto'
