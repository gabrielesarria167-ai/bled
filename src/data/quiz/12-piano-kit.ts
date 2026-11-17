import type { Question } from '../../lib/quiz'

// Self-check questions written for the course from pp. 103–106 (not from the manual).
const questions: Question[] = [
  {
    id: 's12-q1',
    prompt: 'Dove conviene esporre i numeri di telefono utili per le emergenze?',
    options: [
      { id: 'A', text: 'In un cassetto chiuso a chiave' },
      { id: 'B', text: 'Solo nella rubrica del telefono di un genitore' },
      { id: 'C', text: 'In un luogo comune della casa, ad esempio vicino a un telefono' },
      { id: 'D', text: 'All’interno del kit di primo soccorso sigillato' },
    ],
    answer: ['C'],
    explain: 'Un luogo comune, per esempio vicino a un telefono, rende le informazioni accessibili a ogni familiare e anche a babysitter, nonni, ecc.',
    page: '104',
  },
  {
    id: 's12-q2',
    prompt: 'Che cosa deve consentire, come minimo, il contenuto di base di un kit di primo soccorso?',
    options: [
      { id: 'A', text: 'Di prestare il BLS in modo efficace' },
      { id: 'B', text: 'Di somministrare farmaci a chiunque' },
      { id: 'C', text: 'Di sostituire l’intervento del SME' },
      { id: 'D', text: 'Di immobilizzare ogni tipo di frattura' },
    ],
    answer: ['A'],
    explain: 'Il contenuto di base del kit deve metterti in condizione di prestare il BLS in modo efficace.',
    page: '104',
  },
  {
    id: 's12-q3',
    prompt: 'Quale di questi articoli rientra nella dotazione minima (e non tra i facoltativi)?',
    options: [
      { id: 'A', text: 'Coperta isotermica' },
      { id: 'B', text: 'Ghiaccio istantaneo' },
      { id: 'C', text: 'Stecca per immobilizzare fratture' },
      { id: 'D', text: 'Barriera per rianimazione (come lo schermo per il viso)' },
    ],
    answer: ['D'],
    explain: 'La barriera per rianimazione è nella dotazione minima; coperta isotermica, ghiaccio istantaneo e stecca sono tra gli articoli facoltativi ma consigliati.',
    page: '104',
  },
  {
    id: 's12-q4',
    prompt: 'Perché medicamenti e pomate spesso mancano nei kit in commercio?',
    options: [
      { id: 'A', text: 'Perché scadono troppo in fretta' },
      { id: 'B', text: 'Perché possono esserci restrizioni legali al loro uso o alla loro vendita' },
      { id: 'C', text: 'Perché non servono nel primo soccorso' },
      { id: 'D', text: 'Perché occupano troppo spazio' },
    ],
    answer: ['B'],
    explain: 'Per le possibili restrizioni legali su uso o vendita spesso non sono inclusi; puoi comprarli in farmacia e aggiungerli al tuo kit personale.',
    page: '105',
  },
  {
    id: 's12-q5',
    prompt: 'Secondo il modulo del piano d’emergenza, cosa è utile fare, se possibile, mentre si aspetta il SME?',
    options: [
      { id: 'A', text: 'Riagganciare subito per liberare la linea' },
      { id: 'B', text: 'Mandare qualcuno fuori, ad esempio in strada, a segnalare il punto esatto dell’incidente' },
      { id: 'C', text: 'Trasportare la vittima in ospedale con la propria auto' },
      { id: 'D', text: 'Chiamare prima i vicini di casa' },
    ],
    answer: ['B'],
    explain: 'Il modulo dice di restare in linea, calmi, seguendo le istruzioni, e di mandare se possibile qualcuno all’esterno a indicare subito al SME in arrivo il punto esatto dell’incidente.',
    page: '106',
  },
]

export default questions
