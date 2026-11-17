import type { Question } from '../../lib/quiz'

const vf = [
  { id: 'a', text: 'Vero' },
  { id: 'b', text: 'Falso' },
]

const questions: Question[] = [
  {
    id: 's07-q1',
    prompt: 'Negli adulti la causa più comune di soffocamento è l’ostruzione delle vie aeree dovuta a __________. In neonati e bambini il soffocamento può essere causato anche da __________________.',
    options: [
      { id: 'a', text: 'Cibo – piccoli oggetti (es. monete) e giocattoli' },
      { id: 'b', text: 'Oggetti – cibi omogeneizzati' },
    ],
    answer: ['a'],
    explain: 'Negli adulti la causa più frequente è il cibo; in neonati e bambini cibo, piccoli oggetti come le monete e giocattoli.',
    page: '58',
  },
  {
    id: 's07-q2',
    prompt: 'Un segno comune del soffocamento è che la vittima si afferra il collo.',
    options: vf,
    answer: ['a'],
    explain: 'In genere chi sta soffocando si alza in piedi e si porta le mani al collo.',
    page: '58',
  },
  {
    id: 's07-q3',
    prompt: 'Qual è il modo più semplice e immediato per distinguere un’ostruzione lieve da una grave?',
    options: [
      { id: 'a', text: 'Guardare nella bocca della vittima' },
      { id: 'b', text: 'Verificare se è cosciente' },
      { id: 'c', text: 'Chiedere alla vittima: «Stai soffocando?»' },
      { id: 'd', text: 'Domandare a un medico' },
    ],
    answer: ['c'],
    explain: 'È la capacità di rispondere alla domanda che permette di distinguere rapidamente i due casi.',
    page: '58',
  },
  {
    id: 's07-q4',
    prompt: 'Nell’ostruzione grave delle vie aeree la vittima non riesce a ______, ma potrebbe annuire quando le fai la domanda. Non è in grado di ______ o ha un respiro ansimante, e può fare tentativi silenziosi di ______. Potrebbe anche perdere ___________ rapidamente.',
    options: [
      { id: 'a', text: 'parlare – respirare – tosse – coscienza' },
      { id: 'b', text: 'bere – urlare – inspirazione – delle sostanze dalla bocca' },
      { id: 'c', text: 'camminare – sdraiarsi – vomitare – la pazienza' },
    ],
    answer: ['a'],
    explain: 'Nell’ostruzione grave la vittima non parla, non respira o ansima, tossisce in modo silenzioso e inefficace e può perdere coscienza in breve.',
    page: '58–59',
  },
  {
    id: 's07-q5',
    prompt: 'In caso di ostruzione lieve il soccorritore deve incoraggiare a tossire la vittima che sta soffocando, senza fare altro.',
    options: vf,
    answer: ['a'],
    explain: 'Con l’ostruzione lieve si incoraggia la tosse e non si fa nient’altro.',
    page: '59',
  },
  {
    id: 's07-q6',
    prompt: 'Se la vittima mostra i segni di un’ostruzione grave ed è cosciente, il soccorritore esegue fino a ___________, seguiti da ___________ se l’ostruzione non si è risolta.',
    options: [
      { id: 'a', text: '5 spinte addominali – 5 colpi tra le scapole' },
      { id: 'b', text: '5 colpi al dorso tra le scapole – 5 compressioni/spinte addominali' },
      { id: 'c', text: '3 colpi tra le scapole – 3 spinte addominali' },
    ],
    answer: ['b'],
    explain: 'Prima 5 colpi al dorso tra le scapole, poi 5 compressioni/spinte addominali (manovra di Heimlich).',
    page: '59, 61',
  },
  {
    id: 's07-q7',
    prompt: 'Se in qualsiasi momento la vittima perde coscienza, il soccorritore deve ____________________.',
    options: [
      { id: 'a', text: 'Allontanarsi, perché il soccorso non è più fattibile' },
      { id: 'b', text: 'Adagiarla a terra, chiamare o far chiamare i soccorsi e iniziare la RCP (compressioni toraciche e ventilazione artificiale secondo le linee guida BLS)' },
      { id: 'c', text: 'Chiamare aiuto senza preoccuparsi delle conseguenze della caduta della persona che sta soffocando' },
    ],
    answer: ['b'],
    explain: 'La vittima va sostenuta e adagiata a terra, si attiva il SME e si inizia la RCP.',
    page: '62',
  },
]

export default questions
