import type { Question } from '../../lib/quiz'

const vf = [
  { id: 'a', text: 'Vero' },
  { id: 'b', text: 'Falso' },
]

const questions: Question[] = [
  {
    id: 's03-q1',
    prompt: 'Con il Basic Life Support il soccorritore ristabilisce o sostiene _________.',
    options: [
      { id: 'a', text: 'Soltanto l’attività del cuore' },
      { id: 'b', text: 'L’ABC e le funzioni vitali di base' },
      { id: 'c', text: 'Un contatto diretto con la vittima soccorsa' },
    ],
    answer: ['b'],
    explain: 'Il BLS serve a sostenere o ripristinare le funzioni vitali di base agendo su vie aeree, respirazione e circolazione (ABC).',
    page: '22–23',
  },
  {
    id: 's03-q2',
    prompt: 'L’aria che inspiriamo contiene il ____% di ossigeno; quella che espiriamo solo il ____%. Per ossigenare meglio il sangue si raccomanda di usare ________, se si è stati addestrati.',
    options: [
      { id: 'a', text: '16/17% – 21% – un pulsossimetro' },
      { id: 'b', text: '10% – 5% – azoto' },
      { id: 'c', text: '21% – 16/17% – O2' },
    ],
    answer: ['c'],
    explain: 'L’aria ambiente ha il 21% di O2, quella espirata il 16-17%; l’O2 supplementare si raccomanda solo se si è addestrati a usarlo.',
    page: '23',
  },
  {
    id: 's03-q3',
    prompt: 'La rianimazione non ha lo scopo di far ripartire ________, ma di garantire un ________ piccolo ma critico, così che il sangue ________ circoli evitando danni al ________ e agli altri organi.',
    options: [
      { id: 'a', text: 'Il cuore – flusso sanguigno – ossigenato – cervello' },
      { id: 'b', text: 'La respirazione – shock – non – polmoni' },
    ],
    answer: ['a'],
    explain: 'Di norma la RCP non fa ripartire il cuore, ma mantiene un flusso di sangue ossigenato verso cuore e cervello e ritarda il danno anossico.',
    page: '23',
  },
  {
    id: 's03-q4',
    prompt: 'Lo scopo principale della rianimazione è mantenere un flusso di sangue ossigenato verso cuore e cervello.',
    options: vf,
    answer: ['a'],
    explain: 'È proprio la definizione dello scopo principale della rianimazione data nel testo.',
    page: '23',
  },
  {
    id: 's03-q5',
    prompt: 'In caso di arresto cardiaco (ACC), nella maggior parte dei casi la RCP non fa ripartire il cuore ma ritarda il danno anossico agli organi vitali.',
    options: vf,
    answer: ['a'],
    explain: 'La RCP rallenta il danno anossico, che progredisce di circa il 10% al minuto.',
    page: '23',
  },
  {
    id: 's03-q6',
    prompt: 'La RCP fa aumentare le possibilità di successo della defibrillazione.',
    options: vf,
    answer: ['a'],
    explain: 'Il testo lo indica esplicitamente tra i benefici della RCP.',
    page: '23',
  },
  {
    id: 's03-q7',
    prompt: 'Tra gli scopi del BLS ci sono ________ la vita, ________ ulteriori danni ed ________ il primo soccorso fino all’arrivo del SME.',
    options: [
      { id: 'a', text: 'Ridare – valutare – chiedere a qualcuno di praticare' },
      { id: 'b', text: 'Sostenere – prevenire – eseguire' },
    ],
    answer: ['b'],
    explain: 'Gli scopi elencati sono sostenere le funzioni vitali, prevenire i danni dovuti alla mancanza di O2 ed eseguire il primo soccorso fino all’arrivo del SME.',
    page: '24',
  },
  {
    id: 's03-q8',
    prompt: 'Quando telefoni al SME devi:',
    options: [
      { id: 'a', text: 'Riferire che cosa è successo e in che condizioni è la vittima' },
      { id: 'b', text: 'Indicare dove è avvenuta l’emergenza' },
      { id: 'c', text: 'Dire quante sono le vittime coinvolte' },
      { id: 'd', text: 'Dare il tuo nome e spiegare quale primo soccorso è stato prestato' },
      { id: 'e', text: 'Tutte le risposte precedenti' },
    ],
    answer: ['e'],
    explain: 'Una chiamata corretta al SME è fondamentale; che cosa dire è spiegato nel dettaglio nella Sezione 2, a cui il testo rimanda.',
    page: '24',
  },
  {
    id: 's03-q9',
    prompt: 'Nella maggior parte dei casi il cuore riparte dopo aver praticato la sola RCP.',
    options: vf,
    answer: ['b'],
    explain: 'Di norma il cuore non riparte con la sola RCP, anche se eseguita alla perfezione: la RCP è solo un anello della catena di sopravvivenza.',
    page: '26',
  },
  {
    id: 's03-q10',
    prompt: 'Per evitare problemi legali si raccomanda di chiedere alla persona infortunata il suo ________ prima di prestare il primo soccorso. Lo puoi fare dicendo ________.',
    options: [
      { id: 'a', text: 'Numero di telefono – qualcosa di rassicurante' },
      { id: 'b', text: 'Consenso – il tuo nome, che vuoi aiutare e che possiedi le competenze necessarie' },
      { id: 'c', text: 'Documento d’identità – che chiedere i suoi dati è un obbligo di legge' },
    ],
    answer: ['b'],
    explain: 'Si chiede il permesso presentandosi come soccorritore abilitato al primo soccorso e domandando se si può aiutare.',
    page: '26',
  },
]

export default questions
